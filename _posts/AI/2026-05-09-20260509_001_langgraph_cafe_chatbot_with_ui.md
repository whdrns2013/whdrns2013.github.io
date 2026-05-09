---
title: "[LangGraph] 카페 챗봇을 OpenWebUI와 연동하기" # 제목 (필수)
excerpt: "OpenAI Compatible API와 스트리밍 응답으로 챗봇을 웹 UI에서 사용하기" # 서브 타이틀이자 meta description (필수)
date: 2026-05-09 17:32:00 +0900      # 작성일 (필수)
lastmod: 2026-05-09 17:32:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-05-09 17:32:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langgraph 랭그래프 langchain 랭체인 graph 그래프 init 챗봇 실습 간단 코드 OpenWebUI UI 화면 채팅화면                  # 태그 복수개 가능 (필수)
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
permalink: 
sidebar:
  nav: docs_llm
pinned: 
series: langgraph-cafe-rag
---

<!--postNo: 20260509_001-->

## 카페 챗봇을 UI와 연동하기

### 1. UI 연동 계획

앞서 만든 카페 챗봇은 정상적으로 동작하지만, 터미널 환경에서만 사용할 수 있다는 한계가 있다. 이번 글에서는 일반 사용자도 편하게 사용할 수 있도록 카페 챗봇을 채팅 UI와 연동해보도록 하겠다.  

연동 방향은 다음과 같다.

- 채팅 UI 는 **OpenWebUI** 를 사용한다.
- OpenWebUI 연동을 위해 카페 챗봇은 **OpenAI Compatible API** 형태로 감싸준다.
- LLM 응답은 **스트리밍 방식**으로 처리해 사용자 경험을 향상시킨다.

### 2. 최종 결과물

구체적인 연동 방법을 살펴보기 전에, 먼저 최종 결과물을 확인해보자.  

![](/assets/images/20260509_001_001.gif)

주요한 기능은 다음과 같다.  
- 랭그래프의 각 노드에서 진행중인 작업 현황을 출력한다.
- RAG 기반으로 답변을 수행한다.
- LLM 스트리망 방식을 적용.

## 구현 방법  

> 포스팅 시리즈의 첫 글 [LangGraph 카페 질문 답변 RAG 챗봇 만들기 실습](https://whdrns2013.github.io/ai/20260426_001_langgraph_cafe_rag_exam/)에서 이어집니다. 기존 코드를 확인하려면 해당 글을 참고해주세요.  

### 1. LLM 모델 stream 응답 방식 추가

가장 먼저 LLM 모델을 선택적으로 스트리밍 모드로 사용할 수 있도록 **streaming 옵션을 추가**했다. (이 글에서는 Google의 Gemini API를 사용한다.)  

```python
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from config.config import secret

# 모델 로딩
def load_model(api_key:str|None=None,
               model_name:str|None="gemini-2.5-flash-lite",
               streaming:bool=False):
    if api_key is None:
        api_key = secret["apikey"]["google"]
    os.environ["GOOGLE_API_KEY"] = api_key
    model = ChatGoogleGenerativeAI(model=model_name, streaming=streaming)
    return model
```

### 2. 의도분류 노드 - 비동기 적용

이전에 구축한 노드 중, 가장 먼저 실행되는 노드는 intent_classify_node이다. 이 노드는 사용자의 **질문 의도를 분석하는 역할**을 한다.  

의도 분류 결과는 사용자에게 **실시간으로 보여줄 필요가 없으므로 스트리밍 방식으로 출력하지 않아도** 된다. 따라서 **streaming = False** 옵션으로 생성한 모델을 이용한다.  

다만, 전체적인 애플리케이션이 **비동기** 방식으로 동작하기 때문에 비동기 처리를 위해 `invoke` 대신 `ainvoke` 를 사용하고, 노드 함수 자체도 `async` 로 비동기 함수로 만들어준다.  

> 반드시 잊지 말아야 할 게, 비동기 처리가 필요한 함수 앞에는 `await` 키워드를 붙여줘야 한다는 점!  

```python
async def intent_classify_node(state:CafeState):
    prompt_file_path = "prompts/intent_classify_v1.0.txt"
    with open(prompt_file_path, "r", encoding="utf-8") as f:
        prompt = PromptTemplate.from_template(f.read())
    chain = prompt | load_model(streaming=False) | JsonOutputParser()
    response = await chain.ainvoke({"query":state["query"]})
    return {"intent":response["intent"], "intent_reason":response["reason"]}
```

### 3. 프롬프트 수정

다음으로는 최종 답변을 생성하는 프롬프트를 수정한다. 참고자료를 가져온 뒤, 사용자 질의를 함께 LLM에게 주고, 최종 답변을 요청하는 이 프롬프트를 수정하는 이유는 바로 **출력 형식** 때문이다.  

이 코드를 처음 작성했을 당시에는 streaming을 고려하지 않았기 때문에, LLM 자체에서 state와 일치하는 형식(JSON)으로 답변하도록 유도했다. 하지만 이제는 streaming 방식을 사용할 것이므로, LLM이 JSON이 아닌 일반 문자열 답변을 바로 출력하도록 변경한다.  

```bash
# 기존
당신은 카페의 규정, 운영 안내, 소개 자료를 바탕으로 사용자의 질문에 답변하는 카페 안내 상담원입니다.
당신의 목표는 사용자가 제공한 질문에 대해, 함께 전달되는 ◻참고자료만 근거로 정확하고 친절하게 ◻출력형식에 맞춰 답변하는 것입니다.
...
◻출력형식
출력 형식은 반드시 아래 JSON만 사용합니다.
{ {
    "response": "사용자 질문에 대한 답변"
} }
◻참고자료
{reference}

◻사용자 질문
{query}
```


- 첫 지시문에서 출력 형식에 맞추라는 문구 제거, 아래 부분의 ◻출력형식 부분도 제거

```python
# 수정
당신은 카페의 규정, 운영 안내, 소개 자료를 바탕으로 사용자의 질문에 답변하는 카페 안내 상담원입니다.
당신의 목표는 사용자가 제공한 질문에 대해, 함께 전달되는 ◻참고자료만 근거로 정확하고 친절하게 답변하는 것입니다.
...
◻참고자료
{reference}

◻사용자 질문
{query}

```

### 4. LLM 응답 생성 노드

다음으로는 llm 응답 생성 노드를 수정한다.  

먼저, 사용하는 모델의 **streaming 옵션은 True로** 변경한다. 또한 출력형식이 JSON에서 일반 문자열로 바뀌었으므로, **파서도 JSONOutputParser 에서 StrOutputParser로 변경**한다.  

그리고 앞서 수정한 intent_classify 노드와 마찬가지로 비동기 처리를 적용한다. 그 외의 구조는 기존과 동일하다.  

```python
async def llm_node(state:CafeState):
    prompt_file_path = "prompts/llm_response_v1.0.txt"
    with open(prompt_file_path, "r", encoding="utf-8") as f:
        prompt = PromptTemplate.from_template(f.read())
    chain = prompt | load_model(streaming=True) | StrOutputParser()
    response = await chain.ainvoke({"query":state["query"], "reference":state["document"]})
    return {"response":response}
```

여기서 한 가지 의문이 생길 수 있다. 모델은 streaming 모드로 사용하는데 왜 chain 의 추론 방식은 `stream` 이 아닌 `ainvoke` 를 사용할까? 바로 LLM 토큰 스트리밍을 노드 내부가 아니라 **그래프 실행부에서 처리**하기 때문이다.  

현재 애플리케이션은 LangChain chain을 단독으로 실행하는 구조가 아니라, LangGraph 안에서 노드 단위로 감싸 실행하는 구조다. 따라서 `llm_node`의 역할은 최종적으로 state에 저장할 응답을 반환하는 것이다.  

반면, 실제 토큰 스트림을 외부로 흘려보내는 역할은 그래프 실행부에서 담당한다. 이 부분은 이어지는 코드에서 볼 수 있듯 `graph.stream()` 을 통해 처리한다.  

### 5. OpenAI Compatible API

다믕으로는 지금까지 만든 LangGraph 애플리케이션을 **OpenAI Compatible API** 형태로 서빙하는 단계이다. OpenAI Compatible API에 대한 자세한 내용은 이전 글에서 다뤘었다. [https://whdrns2013.github.io/ai/20260505_001_openai_compitable_api/](https://whdrns2013.github.io/ai/20260505_001_openai_compitable_api/)  

그렇다면 왜 OpenAI Compatible API 형태로 만들어야 할까?

이유는 이번 글에서 UI로 사용할 **OpenWebUI와 쉽게 연동하기 위해서**다. OpenWebUI는 기본적으로 OpenAI API의 요청/응답 형식을 기대한다. 따라서 카페 챗봇도 OpenAI API와 호환되는 형태로 감싸주면, OpenWebUI에서 별도 수정 없이 사용할 수 있는 것이다.  

이번에는 FastAPI를 사용해 OpenAI Compatible API를 만들어보도록 한다. 먼저, 이전에 터미널에서 메시지를 주고받을 때 사용했던 코드는 아래와 같다.

```python
import os
from retrieval import ingest
from config.config import config
from graph.builder import CafeLanggraphBuilder
from graph.state import CafeState

def main():
    while True:
        query = input("사용자 입력 : ")
        graph, app = CafeLanggraphBuilder.build()
        state = CafeState({"query" : query})
        response = app.invoke(state)
        print(f'AI : {response["response"]}\n')

if __name__ == "__main__":
    if not os.path.exists(config["path"]["vector_store"]):
        ingest.init()
    main()

```

위 코드는 사용자의 입력을 터미널에서 직접 받고, LangGraph 애플리케이션을 실행한 뒤 결과를 다시 터미널에 출력하는 구조이다. 이제 이 구조를 FastAPI 기반의 API 서버 형태로 바꿔보겠다. (코드가 길기 때문에 접은 글 형태로 게시한다.)  

<details>
<summary> 펼치기/접기 </summary>
<div markdown='1'>

```python
import os
from retrieval import ingest
from config.config import config
from graph.builder import CafeLanggraphBuilder
from graph.state import CafeState
import time
import uuid
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import json
import uvicorn

app = FastAPI()

model_list = ["cafe-chatbot"]

# /v1/models
@app.get("/v1/models")
async def list_models():
    return {
        "object": "list",
        "data": [
            {
                "id": model,
                "object": "model",
                "created": int(time.time()),
                "owned_by": "local"
            } for model in model_list
        ]
    }

# /v1/chat/completions
@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    body = await request.json()
        
    # 요청 파라미터
    model = body.get("model", model_list[0])
    messages = body.get("messages", [])
    stream = body.get("stream", False)

    # 가장 마지막 user 메시지 추출
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            user_message = msg.get("content", "")
            break
    
    # langgraph 앱
    graph, app = CafeLanggraphBuilder.build()
    state = CafeState({"query":user_message})
    
    # LangGraph 호출 예시
    ## 1. stream == false 인 경우
    if not stream:
        result = await app.ainvoke(state)
        return {
            "id": f"chatcmpl-{uuid.uuid4().hex}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": model,
            "choices": [
                {
                    "index":0,
                    "messages": {
                        "role": "assistant",
                        "content": result["response"]
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        }

    ## 2. stream != false 인 경우
    async def event_generator():
        response_id = f"chatcmpl-{uuid.uuid4().hex}"
        created = int(time.time())
        
        ### 1) 첫 chunk : assistant role 알림
        first_chunk = {
            "id": response_id,
            "object": "chat.completion.chunk",
            "created": created,
            "model": model,
            "choices": [
                {
                    "index": 0,
                    "delta": {
                        "role": "assistant"
                    },
                    "finish_reason": None
                }
            ]
        }
        yield f"data: {json.dumps(first_chunk, ensure_ascii=False)}\n\n"
        
        ### 2) 중간 chunk : content (실제 답변)
        async for msg, metadata in app.astream(state, stream_mode="messages"):
            
            if metadata.get("langgraph_node") != "llm":
                continue
            
            content = msg.content
            
            if not content:
                continue
            
            chunk = {
                "id": response_id,
                "object": "chat.completion.chunk",
                "created": created,
                "model": model,
                "choices": [
                    {
                        "index": 0,
                        "delta": {
                            "content": content
                            },
                        "finish_reason": None
                    }
                ]
            }
            yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
            # ensure_ascii=False : json dumps에서 한글을 \uXXX로 이스케이프 하지 않고 그대로 보내기 위한 옵션
            # \n\n : SSE에서 "이 이벤트 하나가 끝났다"라는 구분자. 반드시 필요.
        
        ### 3) 종료 chunk
        done_chunk = {
            "id": response_id,
            "object": "chat.completion.chunk",
            "created": created,
            "model": model,
            "choices": [
                {
                    "index": 0,
                    "delta": {}, # 빈 delta
                    "finish_reason": "stop"
                }
            ]
        }
        yield f"data: {json.dumps(done_chunk, ensure_ascii=False)}\n\n"
        
        ### 4) 종료 신호
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        event_generator(),                # 스트리밍 제너레이터 
        media_type="text/event-stream"    # 미디어 타입
    )

def main():
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )

if __name__ == "__main__":
    if not os.path.exists(config["path"]["vector_store"]):
        ingest.init()
    main()

```


</div>
</details>

<br>

코드가 길기 때문에, 핵심이 되는 부분만 나눠서 살펴보도록 한다. 주요하게 볼 부분은 다음 네 가지이다.  

```bash
- 사용자 메시지를 추출하는 부분
- LangGraph 애플리케이션을 빌드하는 부분
- `stream=False`일 때 응답을 반환하는 부분
- `stream=True`일 때 스트리밍 응답을 반환하는 부분
- FastAPI 실행 부분
```

#### (1) 사용자 메시지 추출 부

먼저, 유저의 발화를 가져오는 부분이다.  

```python
async def chat_completions(request: Request):
    body = await request.json()
		
	# 요청 파라미터
    model = body.get("model", model_list[0])
    messages = body.get("messages", [])
    stream = body.get("stream", False)

    # 가장 마지막 user 메시지 추출
    user_message = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            user_message = msg.get("content", "")
            break
```


OpenAI Chat Completions API 형식에서는 대화 내용이 `messages` 배열로 전달된다. 이 배열에는 `system`, `user`, `assistant` 등의 역할을 가진 메시지가 함께 들어올 수 있다.

여기서는 가장 최근의 사용자 질문에 답변하기 위해, `messages`를 뒤에서부터 순회하면서 마지막 `user` 메시지를 가져온다.

#### (2) LangGraph 애플리케이션 빌드 부

다음은 이 사용자의 질문에 대해 응답하는 랭그래프를 빌드하는 부분이다.  

```python
# langgraph 앱
graph, app = CafeLanggraphBuilder.build()
state = CafeState({"query":user_message})
```

`CafeLanggraphBuilder.build()`를 통해 그래프와 실행 가능한 앱을 생성하고, 사용자의 질문을 `CafeState`의 `query` 값으로 넣어준다.  

이제 이 `state`를 기준으로 LangGraph가 의도 분류, 문서 검색, LLM 응답 생성 등의 흐름을 실행하게 된다.  

#### (3) stream=False 인 경우 응답 처리

다음은 `stream=False`인 경우의 응답 처리다. 

```python
# LangGraph 호출 예시
## 1. stream == false 인 경우
if not stream:
    result = await app.ainvoke(state)
    return {
        "id": f"chatcmpl-{uuid.uuid4().hex}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index":0,
                "messages": {
                    "role": "assistant",
                    "content": result["response"]
                },
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0
        }
    }
```

`stream=False` 인 경우에는 응답을 실시간으로 나누어 보내지 않고, 최종 답변을 한 번에 반환하게 된다.  

이때 주의할 점은, LangGraph 앱을 `invoke` 가 아니라 `ainvoke` 로 실행해야 한다는 점이다. 앞 서 노드들을 비동기 함수로 수정했기 때문에, 그래프 실행도 비동기 방식으로 처리해야 하며, 따라서 `await` 키워드도 함께 써줘야 한다.  

또한 OpenAI Chat Completions 응답 형식에 맞추기 위해 `choices` 안에 assistant 메시지를 담아 반환하도록 수정한다.  

#### (4) stream=True 인 경우 응답 처리

마지막으로 가장 중요하게 봐야 할 부분은 `stream=True`인 경우의 응답 처리이다.  

```python
## 2. stream != false 인 경우
async def event_generator():
    response_id = f"chatcmpl-{uuid.uuid4().hex}"
    created = int(time.time())
    
    ### 1) 첫 chunk : assistant role 알림
    first_chunk = {
        "id": response_id,
        "object": "chat.completion.chunk",
        "created": created,
        "model": model,
        "choices": [
            {
                "index": 0,
                "delta": {
                    "role": "assistant"
                },
                "finish_reason": None
            }
        ]
    }
    yield f"data: {json.dumps(first_chunk, ensure_ascii=False)}\n\n"
    
    ### 2) 중간 chunk : content (실제 답변)
    async for msg, metadata in app.astream(state, stream_mode="messages"):
        
        if metadata.get("langgraph_node") != "llm":
            continue
        
        content = msg.content
        
        if not content:
            continue
        
        chunk = {
            "id": response_id,
            "object": "chat.completion.chunk",
            "created": created,
            "model": model,
            "choices": [
                {
                    "index": 0,
                    "delta": {
                        "content": content
                        },
                    "finish_reason": None
                }
            ]
        }
        yield f"data: {json.dumps(chunk, ensure_ascii=False)}\n\n"
        # ensure_ascii=False : json dumps에서 한글을 \uXXX로 이스케이프 하지 않고 그대로 보내기 위한 옵션
        # \n\n : SSE에서 "이 이벤트 하나가 끝났다"라는 구분자. 반드시 필요.
    
    ### 3) 종료 chunk
    done_chunk = {
        "id": response_id,
        "object": "chat.completion.chunk",
        "created": created,
        "model": model,
        "choices": [
            {
                "index": 0,
                "delta": {}, # 빈 delta
                "finish_reason": "stop"
            }
        ]
    }
    yield f"data: {json.dumps(done_chunk, ensure_ascii=False)}\n\n"
    
    ### 4) 종료 신호
    yield "data: [DONE]\n\n"

return StreamingResponse(
    event_generator(),                # 스트리밍 제너레이터 
    media_type="text/event-stream"    # 미디어 타입
)
```

<br>

`stream=True`인 경우에는 응답을 한 번에 반환하지 않고, 토큰이 생성될 때마다 chunk 단위로 나누어 전달한다.

이를 위해 `event_generator()`라는 비동기 제너레이터를 만들고, `StreamingResponse`로 감싸 반환한다. 이때 `media_type`은 SSE(Server-Sent Events) 형식에 맞게 `text/event-stream`으로 지정한다.  

LangGraph의 스트리밍 응답은 `app.astream()`을 통해 처리한다. 비동기 스트림을 순회해야 하므로 일반 for문이 아니라 **async for**문을 사용한다.  

<br>

```python
async for msg, metadata in app.astream(state, stream_mode="messages"):
```

여기서는 `stream_mode="messages"`를 사용해 LLM이 생성하는 메시지 단위의 출력을 받아온다. 

다만 그래프에는 여러 노드가 포함되어 있으므로, 모든 노드의 출력이 사용자에게 전달되면 안 된다. 따라서 metadata에 포함된 `langgraph_node` 값을 확인해, 실제 답변을 생성하는 `llm` 노드의 출력만 통과시킨다.  

<br>

```python
if metadata.get("langgraph_node") != "llm":
    continue
```

이후 `msg.content`에 들어 있는 실제 토큰을 OpenAI 스트리밍 응답 형식에 맞는 `chunk`로 감싼 뒤, `yield`를 통해 하나씩 클라이언트로 전달한다. 응답이 모두 끝나면 `finish_reason`을 `"stop"`으로 설정한 종료 chunk를 보내고, 마지막으로 `[DONE]` 신호를 전달한다.

#### (5) FastAPI 애플리케이션 실행 부

```python
def main():
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
```

<br>

### 6. API 테스트

이제 만든 API가 정상적으로 동작하는지 테스트해보자. 먼저 `stream=false`인 경우. 이 경우에는 응답이 스트리밍되지 않고, 최종 답변이 한 번에 반환된다.  

- stream=false 인 경우

```python
# 요청 바디
{
  "model": "cafe-chatbot",  // 모델 목록에서 조회 가능한 ID
  "messages": [             // 메시지 목록
    {
      "role": "user",
      "content": "이 카페의 메뉴들을 소개해주세요."
    }
  ],
  "stream": false,     // 스트리밍 답변 적용 여부
}
```

```python
# 응답
{
    "id": "chatcmpl-e8c1087be0f64e85889fa3d420877ae2",
    "object": "chat.completion",
    "created": 1777989869,
    "model": "cafe-chatbot",
    "choices": [
        {
            "index": 0,
            "messages": {
                "role": "assistant",
                "content": "오로라 카페의 메뉴는 커피, 시그니처 음료, 티/논커피, 에이드/주스, 디저트, 그리고 세트 메뉴로 구성되어 있습니다.\n\n**커피**에는 에스프레소, 아메리카노, 카페라떼, 바닐라라떼, 카푸치노가 있으며, 모든 에스프레소 음료는 500원을 추가하여 디카페인으로 변경 가능합니다. 디카페인 원두는 산미가 적고 고소한 맛이 특징입니다.\n\n**시그니처 음료**로는 오로라 크림 라떼, 솔티드 카라멜 라떼, 제주 말차 라떼, 흑임자 크림 커피가 있습니다.\n\n**티/논커피** 메뉴에는 얼그레이 티, 캐모마일 티, 제주 감귤차, 초콜릿 라떼, 딸기 우유가 있습니다.\n\n**에이드/주스**는 레몬 에이드, 자몽 에이드, 청포도 에이드, 오렌지 주스가 준비되어 있습니다.\n\n**디저트**로는 플레인 스콘, 초코 스콘, 크루아상, 치즈케이크, 티라미수, 말차 갸또가 있습니다.\n\n**세트 메뉴**로는 아메리카노와 플레인 스콘 세트, 카페라떼와 크루아상 세트가 있습니다.\n\n우유가 포함된 메뉴는 카페라떼, 바닐라라떼, 카푸치노, 오로라 크림 라떼, 솔티드 카라멜 라떼, 제주 말차 라떼, 초콜릿 라떼, 딸기 우유, 치즈케이크, 티라미수입니다. 흑임자 크림 커피와 말차 갸또는 견과류가 포함될 수 있습니다. 메뉴별 상세 알레르기 정보는 직원에게 문의하시면 안내해 드립니다.\n\n또한, 일부 음료는 HOT/ICE 선택이 가능하며, ICE 음료는 기본적으로 큰 컵에 제공됩니다. 샷 추가는 500원, 시럽 추가는 300원, 오트밀크 변경은 700원의 추가 요금이 발생합니다."
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 0,
        "completion_tokens": 0,
        "total_tokens": 0
    }
}
```

<br>

다음은 `stream=true`인 경우. 이 경우에는 답변이 한 번에 반환되지 않고, 생성되는 순서대로 chunk 단위로 전달된다.  

- stream=true인 경우 응답

```python
# 요청 바디
{
  "model": "cafe-chatbot",  // 모델 목록에서 조회 가능한 ID
  "messages": [             // 메시지 목록
    {
      "role": "user",
      "content": "이 카페의 메뉴들을 소개해주세요."
    }
  ],
  "stream": true,     // 스트리밍 답변 적용 여부
}
```

```python
# 응답
# 너무 길어서 주요 부분만 가져옴
{"choices": [{.."delta": {"role": "assistant"},"finish_reason": null}]}
{"choices": [{.."delta": {"content": "오로라 카페"},"finish_reason": null}]}
{"choices": [{.."delta": {"content": "의 메뉴는 커피, 시그니처 음료, 티/논커피, 에이드"},"finish_reason": null}]}
...
{"choices": [{.."delta": {"content": " 안내되어 있으며, 메뉴별 상세 알레르기 정보는 직원에게 문의하실 수 있습니다. 또한, 일부 음료는 HOT/ICE 선택이 가능하며, 샷, 시럽 추가 및 오트밀크 변경 옵션도 제공"},"finish_reason": null}]}
{"choices": [{.."delta": {"content": "됩니다."},"finish_reason": null}]}
{"choices": [{.."delta": {},"finish_reason": "stop"}]}
[DONE]
```

<br>

## OpenWebUI 연결

이제 마지막으로 OpenWebUI에 연결할 차례다. OpenWebUI의 설치 방법에 대해 이전에 다룬 포스팅이 있으므로, 필요시 참고[https://whdrns2013.github.io/ai/20260113_004_install_openwebui/](https://whdrns2013.github.io/ai/20260113_004_install_openwebui/)

### 1. OpenWebUI에 API 연결

- OpenWebUI 설치 후 접속한 뒤, 관리자패널을 열어준다.

![](/assets/images/20260509_001_002.png)  

- 설정 → 연결 → OpenAI API 연결 관리의 `+` 버튼을 클릭한다.

![](/assets/images/20260509_001_003.png)  

- URL 부분에 [`http://서빙하는머신의IP:8000/v1`](http://서빙하는머신의IP:8000/v1) 을 입력해준다.
- 그리고 `저장` 버튼을 클릭

![](/assets/images/20260509_001_004.png)  

- 다시 메인화면으로 돌아와보자. 잘 연결되었다면 모델 선택 부분에 “cafe-chatbot” 이 보일 것이다.

![](/assets/images/20260509_001_005.png)  

- 질의 응답 테스트

![](/assets/images/20260509_001_006.gif)  

<br>

### 2. 각 노드별 작업상황 출력

API 연동 후 실제로 질의해보면, **답변이 출력되기 전까지 대기 시간이 다소 길게** 느껴질 수 있다.

위 GIF에서는 대기 시간을 일부 잘라냈기 때문에 대기 시간이 짧아 보이지만, 실제로는 꽤 긴 시간을 대기해야 하며(4~5초), 실제 사용 환경에서는 **화면에 아무런 변화도 없는 이 시간이 사용자 경험에 영향을 줄 수** 있다.  

사용자가 아무런 피드백 없이 기다리지 않도록, 중간중간 현재 처리 상황을 메시지로 공유해보도록 한다. 이를 위해 이전 포스팅에서 살펴봤던 **Custom Stream 메시지**를 사용한다.  

- 참고 : [https://whdrns2013.github.io/ai/20260506_001_langgraph_custom_stream/](https://whdrns2013.github.io/ai/20260506_001_langgraph_custom_stream/)

<br>

먼저, custom stream 메시지를 만들기 위해서는 랭그래프에서 제공하는 `get_stream_writer` 를 사용한다.  

```python
from langgraph.config import get_stream_writer
```

`get_stream_writer()`로 Stream Writer를 가져온 뒤, 각 노드에서 사용자에게 보여줄 문구를 writer에 넘겨주면 된다.  

<br>

예를 들어 사용자의 질문 의도를 분석하는 `intent_classify_node`에서는 다음과 같이 처리 상황을 출력할 수 있다.

```python
async def intent_classify_node(state:CafeState):
    
    writer = get_stream_writer()
    writer("사용자의 질문 의도를 파악중입니다...\n")
    
    prompt_file_path = "prompts/intent_classify_v1.0.txt"
    with open(prompt_file_path, "r", encoding="utf-8") as f:
        prompt = PromptTemplate.from_template(f.read())
    chain = prompt | load_model(streaming=False) | JsonOutputParser()
    response = await chain.ainvoke({"query":state["query"]})
    
    writer(f"사용자의 질문 의도는 {response['intent']}로 판단됩니다.\n")
    
    return {"intent":response["intent"], "intent_reason":response["reason"]}
```

<br>

문서를 검색하는 `retrieve_node`에서도 같은 방식으로 처리 상황을 전달할 수 있다.  

```python
def retrieve_node(state:CafeState):
    writer = get_stream_writer() # Stream Writer 불러오기
    writer("사용자의 질문에 참고할 수 있는 문서를 검색중입니다...") # 여기!
    document = retrieval.retrieve(query = state["query"])
    return {"document":document}
```

<br>

여기서 중요한 점은, 이렇게 직접 만든 Custom Stream 메시지는 기존 LLM 토큰 스트림과 다른 방식으로 받아와야 한다는 것이다.  

기존 LLM 답변은 `stream_mode="messages"` 옵션을 사용해 받아왔다. 반면 `get_stream_writer()`로 직접 출력한 메시지는 `stream_mode="custom"` 옵션을 사용해야 받을 수 있다.

따라서 LLM 응답과 Custom Stream 메시지를 모두 처리하려면, `stream_mode`에 `messages`와 `custom`을 함께 지정해야 한다.

```python
### 2) 중간 chunk : content (실제 답변)
async for mode, chunk in app.astream(state, stream_mode=["messages", "custom"]): # message, custom 둘 모두 사용
    
    # LLM 응답일 경우
    if mode == "messages":
        msg, metadata = chunk
        if metadata.get("langgraph_node") != "llm":
            continue
        content = msg.content
        if not content:
            continue
    # Custom Message 인 경우
    elif mode == "custom":
        content = chunk
```

위 코드처럼 `mode` 값을 기준으로 분기하면 된다.  

- `mode == "messages"`인 경우: LLM이 생성한 실제 답변 토큰.
- `mode == "custom"`인 경우: 각 노드에서 `writer()`로 직접 보낸 처리 상황 메시지.

<br>

이렇게 구성하면 사용자는 최종 답변이 생성되기 전에도 현재 어떤 작업이 진행 중인지 확인할 수 있고, 대기 시간이 길게 느껴지는 문제를 줄이고, 전체 사용 경험을 개선할 수 있다.  

<br>

### 3. 최종 챗봇 UI 사용 예시

![](/assets/images/20260509_001_001.gif)  

