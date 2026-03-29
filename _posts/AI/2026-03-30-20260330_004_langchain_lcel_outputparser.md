---
title: "[LangChain] LCEL - Output Parser" # 제목 (필수)
excerpt: "실제로 응답을 생성하는 주체" # 서브 타이틀이자 meta description (필수)
date: 2026-03-30 00:39:00 +0900      # 작성일 (필수)
lastmod: 2026-03-30 00:39:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-03-30 00:39:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langchain 랭체인 LCEL 구성 요소 개념 expression language Output Parser outputparser 파서                    # 태그 복수개 가능 (필수)
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
---

<!--postNo: 20260330_004-->

## Output Parser

### (1) 개념

- Output Parser는 Model이 생성한 출력 결과를 원하는 형태로 변환해주는 구성요소입니다.
- LCEL에서 Parser는 보통 Model 뒤에서 응답을 문자열, JSON 등 특정 형식으로 가공합니다.
- 즉, Parser는 Model의 응답을 애플리케이션에서 다루기 쉬운 형태로 정리하는 역할을 담당합니다.

### (2) 예시

- `ChatOpenAI` 와 같은 Chat Model의 응답은 보통 `AIMessage` 객체입니다.
- 먼저, Parser를 사용하지 않은 답변을 출력해보면 아래와 같습니다.

```bash
AIMessage(
  content='LCEL의 Parser는 텍스트 데이터를 분석하여...',
  additional_kwargs={'refusal': None},
  response_metadata={'token_usage':
      {'completion_tokens': 96,
       'prompt_tokens': 30,
       'total_tokens': 126,
       'completion_tokens_details':
           {'accepted_prediction_tokens': 0,
            'audio_tokens': 0,
            'reasoning_tokens': 0,
            'rejected_prediction_tokens': 0
            },
            'prompt_tokens_details':
                {'audio_tokens': 0, 'cached_tokens': 0}},
                'model_provider': 'openai',
                'model_name': 'gpt-4o-mini-2024-07-18',
                'system_fingerprint': '...',
                'id': '...',
                'service_tier': 'default',
                'finish_reason': 'stop',
                'logprobs': None},
              id='..',
              tool_calls=[],
              invalid_tool_calls=[],
              usage_metadata={
                'input_tokens': 30,
                'output_tokens': 96,
                'total_tokens': 126,
                'input_token_details':
                  {'audio': 0,
                  'cache_read': 0
                  },
                'output_token_details': {'audio': 0, 'reasoning': 0}})
```

- 이때 `StrOutputParser` 를 이용하면 응답 본문만 문자열로 쉽게 추출할 수 있습니다.
- 즉, Parser를 사용하면 모델의 출력을 후속 처리에 적합한 형태로 변환할 수 있습니다.

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os

# model 준비
os.environ["OPENAI_API_KEY"] = "my API Key..."
model = ChatOpenAI(model="gpt-4o-mini")

# prompt 준비
system_prompt = "{topic}에 대해 초보자도 이해할 수 있도록 3문장으로 설명하시오"
prompt = PromptTemplate.from_template(system_prompt)

# parser 준비
parser = StrOutputParser()

# chain 준비
chain = prompt | model | parser

# 추론
result = chain.invoke({"topic" : "LCEL의 Parser"})
print(result)
```

```python
LCEL의 Parser는 텍스트 데이터를 분석하여 의미 있는 정보를 추출하는 프로그램입니다.
입력된 문장을 구성하는 단어와 구문을 이해하고, 그 관계를 파악하여 구조화된 데이터를 생성합니다.
이 과정을 통해 사용자에게 유용한 결과를 제공하고, 다양한 언어 처리 작업을 지원합니다.
```

### (3) 종류

- `StrOutputParser` : LLM의 응답에서 메타데이터를 제외하고 순수하게 메시지 내용(content)만 문자열로 추출
- `JsonOutputParser` : LLM의 응답을 JSON 형식으로 변환. 보통 프롬프트에 원하는 JSON 스키마를 함께 전달하여 LLM으로부터 JSON형식의 답변을 받아올 떄 사용
- `JsonOutputKeyToolsParser` : OpenAI와 같은 모델이 Tool Calling을 할 때, 도구 중 특정 키값에 해당하는 인자만 JSON 형태로 출력
- `PydanticToolsParser` : 모델의 도구 호출 결과를 Pydantic 모델 객체로 변환
- `XMLOutputParser` : LLM의 응답에서 XML 태그 형식을 찾아 파싱함.
- `CommaSeparatedListOutputParser` : 콤마로 구분된 문자열 응답을 Python 리스트 형식으로 변환
- `BaseOutputParser` : 모든 출력 파서의 최상위 추상 클래스
- `BaseLLMOutputParser` : BaseOutputParser 의 하위 클래스

### (4) 각 OutputParser 예시

- JsonOutputParser : 응답을 dictionary 형태로 변환하기 쉬워집니다.

```python
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI
import os

os.environ["OPENAI_API_KEY"] = "my API Key..."

model = ChatOpenAI(model="gpt-4o-mini")
parser = JsonOutputParser()

prompt = PromptTemplate.from_template("""
다음 질문에 답하고, 반드시 JSON 형식으로만 출력하세요.

질문: {question}

출력 형식:
{
 {
  "question": "질문 내용",
  "answer": "질문에 대한 답변"
 }
}
""")

chain = prompt | model | parser

result = chain.invoke({"question": "LCEL은 무엇인가요?"})
print(result)
```

```bash
# 출력 예시
{
  'question': 'LCEL은 무엇인가요?',
  'answer': 'LCEL은 LangChain Expression Language의 약자로, LangChain에서 체인을 선언적으로 연결하기 위한 표현 방식입니다.'
}
```

- PydanticOutputParser : 출력 형식을 엄격하게 관리할 수 있습니다.

```python
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
import os

os.environ["OPENAI_API_KEY"] = "my API Key..."

class AnswerSchema(BaseModel):
    question: str = Field(description="사용자의 질문")
    answer: str = Field(description="질문에 대한 답변")

parser = PydanticOutputParser(pydantic_object=AnswerSchema)
model = ChatOpenAI(model="gpt-4o-mini")

prompt = PromptTemplate.from_template("""
다음 질문에 답하세요.

질문: {question}

{format_instructions}
""")

prompt = prompt.partial(format_instructions=parser.get_format_instructions())

chain = prompt | model | parser

result = chain.invoke({"question": "Prompt Template은 무엇인가요?"})
print(result)
```

```bash
# 출력 예시
question='Prompt Template은 무엇인가요?'
answer='Prompt Template은 변수 값을 삽입해 재사용 가능한 프롬프트를 만들기 위한 템플릿입니다.'
```

### (5) Parser를 이용하는 이유

- Model의 출력은 그대로 사용하기 어려울 수 있으므로, 원하는 형태로 변환 필요
- 어떤 때는 문자열, 또 다른 상황에서는 JSON 등 상황에 따라 필요한 응답 구조를 사용
- 이를 통해 후속 코드에서 결과를 쉽게 재사용할 수 있음
- LCEL에서는 `prompt | model | parser` 형태로 연결해서 사용