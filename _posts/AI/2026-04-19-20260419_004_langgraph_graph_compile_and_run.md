---
title: "[LangGraph] 그래프의 생성, 컴파일(연결), 실행 (with invoke/stream)" # 제목 (필수)
excerpt: "워크플로 청사진인 그래프를 실행 가능하게 만들고, 실행하기" # 서브 타이틀이자 meta description (필수)
date: 2026-04-19 19:45:00 +0900      # 작성일 (필수)
lastmod: 2026-04-19 19:45:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-04-19 19:45:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langgraph 랭그래프 langchain 랭체인 graph 그래프 init 생성 compile 컴파일 연결 run 실행 invoke stream                  # 태그 복수개 가능 (필수)
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

<!--postNo: 20260419_004-->

## 그래프 Graph

### 1. 그래프의 개념

- 그래프란 Node(노드)와 Edge(엣지)로 이루어진 작업 흐름도를 뜻한다.
- 개념적으로는 “어떤 작업을 어떤 순서와 조건으로 실행할지 정의한 구조”라고 할 수 있다.
- node : 작업을 실제로 수행하는 함수
- edge : 다음에 어떤 노드로 이동할지 연결하는 규칙
- graph : node 와 edge로 이루어진 일련의 작업 흐름을 하나로 묶은 구조

```python
# 가장 기본적인 상태그래프  

from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class AppState(TypedDict):
    value:int

...

graph = StateGraph(AppState)

graph.add_node("generate", generate_node)
graph.add_node("terminate", terminate_node)

graph.add_edge(START, "generate")
graph.add_conditional_edges("generate", routing_function)
graph.add_edge("terminate", END)
```

![](/assets/images/20260419_004_001.png)  

### 2. 컴파일 Compile

- 앞서 살펴본 그래프(graph)는 작업의 “구조도”일 뿐이므로, 실행할 수 없다.
- 따라서 그래프에 정의된 작업을 실행하기 위해서는 그래프 객체를 컴파일(`.compile()`)을 하여 실행 가능한 객체를 만들어야 한다.
- 컴파일 단계에서는 그래프 구조에 기본적인 문제가 없는지 검사한다. (어디에도 연결되지 않은 노드가 있는지.. 등)
- 또한 체크포인터(checkpointer)나 브레이크포인트(breakpoint)처럼 실행시 사용할 설정도 이 단계에서 지정할 수 있다.

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
import random

class AppState(TypedDict):
    value:int

...

graph = StateGraph(AppState)

graph.add_node("generate", generate_node)
graph.add_node("terminate", terminate_node)

graph.add_edge(START, "generate")
graph.add_conditional_edges("generate", routing_function)
graph.add_edge("terminate", END)

app = graph.compile(...) # 컴파일
app # --> 컴파일된 실행 가능한 객체
```

### 3. 컴파일된 그래프 실행 방식

- `invoke()` : 한 번 실행하고 최종 상태를 한 번 반환받는 실행 방식.
- `stream()` : 실행 중간 과정을 단계별로 보면서 반환받는 실행 방식.
- 최종 결과만 필요할 경우 → invoke / 중간 흐름도 보고 싶은 경우 → stream
- 이외로 `ainvoke()` 와 `astream()` 이라는 비동기 실행 방법도 있으며, 이는 추후 심화 포스팅에서 다룬다.

#### (1) invoke

```python
# invoke
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
import random

class AppState(TypedDict):
    input:int
    value:int
    count:int
    response:str

def input_routing_function(state:AppState):
    return state["input"] < 0

def generate_node(state:AppState):
    return {"value" : random.randint(1, 100), "count" : state["count"] + 1}

def routing_function(state:AppState):
    return state["input"] > state["value"]

def terminate_node(state:AppState):
    if "value" not in state.keys():
        return {"response" : f"사용자가 입력한 {state['input']}은(는) 0보다 작습니다."}
    return {"response" : f"{state['count']} 번 반복 실행됐습니다."}

graph = StateGraph(AppState)
graph.add_node("generate", generate_node)
graph.add_node("terminate", terminate_node)

graph.add_conditional_edges(START, input_routing_function, {True:"terminate", False:"generate"})
graph.add_conditional_edges("generate", routing_function, {True:"terminate", False:"generate"})
graph.add_edge("terminate", END)

app = graph.compile()
app.invoke({"input":10, "count":0}) # invoke
```

```bash
{'input': 10, 'value': 3, 'count': 7, 'response': '7 번 반복 실행됐습니다.'}
```

#### (2) stream

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END
import random

class AppState(TypedDict):
    input:int
    value:int
    count:int
    response:str

def input_routing_function(state:AppState):
    return state["input"] < 0

def generate_node(state:AppState):
    return {"value" : random.randint(1, 100), "count" : state["count"] + 1}

def routing_function(state:AppState):
    return state["input"] > state["value"]

def terminate_node(state:AppState):
    if "value" not in state.keys():
        return {"response" : f"사용자가 입력한 {state['input']}은(는) 0보다 작습니다."}
    return {"response" : f"{state['count']} 번 반복 실행됐습니다."}

graph = StateGraph(AppState)
graph.add_node("generate", generate_node)
graph.add_node("terminate", terminate_node)

graph.add_conditional_edges(START, input_routing_function, {True:"terminate", False:"generate"})
graph.add_conditional_edges("generate", routing_function, {True:"terminate", False:"generate"})
graph.add_edge("terminate", END)

app = graph.compile()
for step in app.stream({"input":10, "count":0}): # stream
    print(step)
```

```bash
{'generate': {'value': 27, 'count': 1}}
{'generate': {'value': 32, 'count': 2}}
{'generate': {'value': 73, 'count': 3}}
{'generate': {'value': 28, 'count': 4}}
{'generate': {'value': 93, 'count': 5}}
{'generate': {'value': 32, 'count': 6}}
{'generate': {'value': 2, 'count': 7}}
{'terminate': {'response': '7 번 반복 실행됐습니다.'}}
```

## Reference

[Graph API overview - Docs by LangChain](https://docs.langchain.com/oss/python/langgraph/graph-api#compiling-your-graph)

