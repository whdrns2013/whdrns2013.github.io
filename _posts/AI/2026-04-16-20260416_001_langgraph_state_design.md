---
title: "[LangGraph] State(상태) - 2. 상태 설계하고 만들기" # 제목 (필수)
excerpt: "TypedDict로 상태 스키마 정의 방법들과 기본적인 상태 만들어보기" # 서브 타이틀이자 meta description (필수)
date: 2026-04-16 07:07:00 +0900      # 작성일 (필수)
lastmod: 2026-04-16 07:07:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-04-16 07:07:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langgraph 랭그래프 langchain 랭체인 구성 요소 구성요소 state 상태 typeddict pydantic dataclass                    # 태그 복수개 가능 (필수)
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

<!--postNo: 20260416_001-->

## State 상태의 설계

### 1. 상태 스키마 정의 방법

#### (1) TypedDict

- Python의 내장 기능을 사용하는 가장 권장되는 방법
- LangGraph의 기본 상태 스키마 정의 방법
- 상태(State) 내 여러 필드가 모두 채워지지 않아도 운용이 가능하다는 장점이 있음
- TypedDict 포스팅 : [https://whdrns2013.github.io/python/20260411_001_python_typeddict/](https://whdrns2013.github.io/python/20260411_001_python_typeddict/)
- 각 필드(키)의 타입 힌트를 작성해둘 수 있지만, 런타임에서 검증은 수행되지 않는다.

```python
from typing import TypedDict, Annotated, Required, NotRequired

class MessageState(TypedDict):
    query: str
    messages: Annotated[list[str], add]
    response: str
```

#### (2) dataclass

- Python의 내장 기능을 사용하는 방법
- 기본값 설정이 가능한 장점이 있다.
- 반면, 상태(State) 내 모든 필드가 채워져야 하는 제한사항이 있다.
- TypedDict와 같이 타입 힌트를 설정해둘 수 있지만, 런타임에서 검증은 수행되지 않는다.

```python
from dataclasses import dataclass

@dataclass
class MyClass:
    name: str
    hobby: list[str]
    age: int = 30
```

#### (3) Pydantic BaseModel

- Pydantic이라는 모듈 내의 기능을 활용하는 방법 (파이썬 내장 기능이 아님)
- 타입 힌트를 작성할 수 있으며, 타입에 대한 검증이 런타임에서 이뤄진다.
- 따라서 타입이 맞지 않는 값에 대해 오류를 발생시킴
- 단, 이러한 풍부한 검증에 따른 오버헤드가 발생하여 TypedDict나 dataclass보다는 느리다는 단점
- 또한 Pydantic이라는 추가 의존성이 필요함

```python
from pydantic import BaseModel

class MyClass(BaseModel):
    name: str
    age: int = 30    # 만약 문자열을 넣는다면, 오루 발생
    hobby: list[str]
```

#### 요약

|  | TypedDict | dataclass | Pydantic BaseModel |
| --- | --- | --- | --- |
| 장점 |   • 빠른 속도  <br>  • LangGraph의 기본 방법  <br>  • 모든 필드가 채워지지 않아도 됨   |   • 기본값 설정 가능  <br>  • 빠른 속도 |   • 런타임 타입 체크  <br>  • 다양한 유효성 검증   |
| 단점 |   • 기본값 설정 불가능  <br>  • 런타임 타입 체크 없음   |   • 모든 필드가 채워져야 하는 제한   |   • 의존성(Pydantic) 필요  <br>  • 비교적 느린 속도   |

### 2. 기본적인 상태 만들어보기

#### (1) 기본 상태

- 애플리케이션 예시 : 사용자 질문에 대해, 로컬에 저장된 자료에서 참고자료를 찾고, 없으면 인터넷에서 관련 자료를 찾아 답변하는 RAG 애플리케이션

```python
# 1. 기본적인 상태

from typing import TypedDict, Annotated
from operator import add

class GraphState(TypedDict):
    query: str  # 사용자 질의
    documents: Annotated[list[str], add] # 답변을 위해 검색된 내용
    response: str    # AI 답변
    success_flag: int  # AI 답변의 품질 검토 - 1:성공, 0:실패
```

#### (2) Input / Output 을 분리하여 관리하는 상태

- 애플리케이션 예시는 동일

```python
# 2. 입출력 스키마 구분

from typing import TypedDict, Annotated
from operator import add
from langgraph.graph import StateGraph

class GraphState(TypedDict):
    query: str  # 사용자 질의
    documents: Annotated[list[str], add] # 답변을 위해 검색된 내용
    response: str    # AI 답변
    success_flag: int  # AI 답변의 품질 검토 - 1:성공, 0:실패

class SearchInputState(TypedDict):
    query:str

class AnswerOutputState(TypedDict):
    response:str

def search_node(state: SearchInputState):
    def do_search(query: state["query"]):
        # do something with query
        return ["doc1", "doc2"]
    documents = do_search()
    return {
        "query" : state["query"],
        "documents" : documents
    }

def llm_invoke(state: GraphState) -> AnswerOutputState:
    def do_llm_invoke(state):
        prompt = f"user query: {state['query']}, documents: {state['documents']}"
        # do llm invoke
        return "llm response"
    response = do_llm_invoke(state)
    return {
        "response" : response
    }

# Graph 를 빌드할 때 input, output을 지정
builder = StateGraph(
    GraphState,
    input = SearchInputState,
    output = AnswerOutputState
)
```

## Reference

**Do it! LLM을 활용한 AI 에이전트 개발 입문 (이성용 저)**  

[https://wikidocs.net/261579](https://wikidocs.net/293353)

[https://www.youtube.com/watch?v=W_uwR_yx4-c](https://www.youtube.com/watch?v=W_uwR_yx4-c)  