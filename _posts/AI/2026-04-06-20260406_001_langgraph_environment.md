---
title: "[LangGraph] LangGraph 개발 환경 구성" # 제목 (필수)
excerpt: "랭그래프 개발 환경 구성" # 서브 타이틀이자 meta description (필수)
date: 2026-04-06 01:03:00 +0900      # 작성일 (필수)
lastmod: 2026-04-06 01:03:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-04-06 01:03:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langgraph 랭그래프 langchain 랭체인 설치 환경 구성                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20260406_001-->

## LangGraph 개발 환경 구성

### 기본 환경

- python 3.10 이상

### 패키지 설치

- 아래는 실습에 필요한 패키지들을 포함함

```bash
# uv
uv add langgraph langchain langchain-openai pydantic

# pip
pip install langgraph langchain langchain-openai pydantic

# conda
conda install langgraph langchain langchain-openai pydantic
```

| 패키지 | 설명 |
| --- | --- |
| `langgraph` | 여러 단계의 작업 흐름을 그래프 형태로 설계하고, 분기·반복·상태 관리를 제어하는 프레임워크 |
| `langchain` | LLM 애플리케이션에 필요한 프롬프트, 메시지, 툴, 에이전트 등의 공통 기능을 제공하는 프레임워크 |
| `langchain-openai` | OpenAI의 GPT 모델과 임베딩 모델을 LangChain/LangGraph 환경에서 사용할 수 있게 해주는 연동 패키지 |
| `pydantic` | 상태, 입력값, 출력값 등의 데이터 구조를 정의하고 검증하는 라이브러리 |

### 더미 그래프 만들고 구조 출력해보기

- 더미 그래프 코드

```python
from typing import TypedDict
from langgraph.graph import StateGraph, END

# 1. 상태 정의 (노드 간 공유 정보)
class ClusterState(TypedDict):
    query: str
    documents: list[str]
    response: str
    response_grade: str # "back to web searcher", "back to query", "pass"

# 2. 노드 함수 정의 (자율적 상호작용)
def query_refiner_node(state: ClusterState):
    """사용자의 질문을 정제하는 노드"""
    return {"query": "refined Query"}

def retriever_node(state: ClusterState):
    """저장된 문서에서 검색을 수행하는 노드"""
    return {"documents": ["doc1", "doc2"]}

def llm_inference_node(state: ClusterState):
    """LLM 답변을 생성하는 노드"""
    return {"response": "LLM 답변"}

def response_refiner_node(state: ClusterState):
    """최종 답변을 정제하는 노드"""
    return {"response": "Refined LLM Response"}

def query_rewriter_node(state: ClusterState):
    """사용자의 질문을 다시 쓰는 노드"""
    return {"query": "rewrited query"}

def web_searcher_node(state: ClusterState):
    """자료가 부족할 경우 웹에서 검색을 수행하는 노드"""
    return {"documents": ["doc1", "doc2", "web_doc"]}

def response_evaluator_node(state: ClusterState):
    """답변 평가 노드"""
    return {}

def response_node(state: ClusterState):
    """답변 노드"""
    return {}

# 3. 그래프 구성
builder = StateGraph(ClusterState)

builder.add_node("query_refiner", query_refiner_node)
builder.add_node("retriever", retriever_node)
builder.add_node("llm", llm_inference_node)
builder.add_node("response_refiner", response_refiner_node)
builder.add_node("query_rewriter", query_rewriter_node)
builder.add_node("web_searcher", web_searcher_node)
builder.add_node("response_evaluator", response_evaluator_node)
builder.add_node("response", response_node)

# 4. 엣지 연결 (상호작용 중심)
builder.set_entry_point("query_refiner")

# 병렬 실행 (Parallel)
builder.add_edge("query_refiner", "retriever")
builder.add_edge("query_refiner", "web_searcher")

# 병렬 실행 집결 (Fan-in)
builder.add_edge("retriever", "llm")
builder.add_edge("web_searcher", "llm")

# 피드백 루프
builder.add_edge("llm", "response_evaluator")

# 분기 처리 (평가)
builder.add_conditional_edges(
    "response_evaluator",
    lambda x: "web_searcher" if x["response_grade"] == "back to web searcher" else\
              "query_rewriter" if x["response_grade"] == "back to query" else\
              "response_refiner" if x["response_grade"] == "pass" else "",
    {"web_searcher": "web_searcher", "query_rewriter": "query_rewriter", "response_refiner":"response_refiner"}
)

# 피드백 이후 엣지 연결
builder.add_edge("query_rewriter", "query_refiner")
builder.add_edge("response_refiner", "response")

app = builder.compile()
```

- 그래프 구조 출력해보기

```python
from IPython.display import Image, display
display(Image(app.get_graph().draw_mermaid_png()))
```

- 출력된 그래프 구조

![](/assets/images/20260406_001_001.png)  

## Reference

**Do it! LLM을 활용한 AI 에이전트 개발 입문 (이성용 저)**  

https://wikidocs.net/261587

https://www.youtube.com/watch?v=W_uwR_yx4-c