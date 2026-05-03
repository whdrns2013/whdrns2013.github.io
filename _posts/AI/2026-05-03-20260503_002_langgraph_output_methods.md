---
title: "[LangGraph] LangGraph의 다양한 출력 방식 (invoke, stream, batch)" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2026-05-03 20:10:00 +0900      # 작성일 (필수)
lastmod: 2026-05-03 20:10:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-05-03 20:10:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langgraph 랭그래프 langchain 랭체인 graph 그래프 출력 invoke stream batch                  # 태그 복수개 가능 (필수)
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
series:
---

<!--postNo: 20260503_002-->

## LangGraph의 다양한 출력 방식

### 1. 출력 방식들

- 기본적인 출력 방식 : 단일 출력

| **메서드** | **설명** | **주요 특징** |
| --- | --- | --- |
| **`invoke`** | 그래프를 한 번 실행하고 최종 상태(State)를 반환한다. | 동기 방식이며, 실행이 끝날 때까지 대기함. |
| **`ainvoke`** | `invoke`의 비동기 버전. | `await`를 사용하여 비동기 환경에서 실행 가능 |
| **`batch`** | 여러 개의 입력을 동시에 처리. | 리스트 형태의 입력을 받아 병렬로 처리한 뒤 결과 리스트를 반환함 |

- 스트리밍 출력 : 노드 단위의 결과물을 출력

| **메서드** | **설명** | **주요 특징** |
| --- | --- | --- |
| **`stream`** | 각 노드의 결과를 노드별로 출력 |   • 노드 단위의 결과를 각각 출력<br>  • 챗봇의 스트리밍 출력과는 다름 |
| **`astream`** | stream에 더해 비동기 처리 기능을 더한 방식 | |

| 스트리밍 주요 모드 | 설명 | 출력 결과 |
| --- | --- | --- |
| `values` |   • 그래프의 상태 전체를 스트리밍<br>  • 노드가 실행될 때마다 업데이트된 전체 상태를 출력 | 전체 상태 |
| `updates`  |   • 각 노드 실행 후 변경사항(Delta)만 출력<br>  • 각 노드의 반환값을 추적하는 데 용이 | 변경 사항 |
| `debug`  |   • 그래프 실행의 상세한 내부 이벤트 모드 출력<br>  • 개발 단계에서 흐름 파악에 용이 |  |

### 2. 예시 랭그래프

- 각 출력의 차이를 보기 위해 아래와 같은 랭그래프를 정의했다.
- 아래 랭그래프 애플리케이션은 사용자가 입력한 숫자보다 작은 숫자가 나올 때까지 1~100 사이 숫자를 랜덤 반복 생성하는 애플리케이션이다.

```python
# Graph

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
```

### 3. 기본 출력

#### (1) invoke

```python
# invoke
app.invoke({"input":10, "count":0})
```

- 출력

```bash
{'input': 10, 'value': 1, 'count': 8, 'response': '8 번 반복 실행됐습니다.'}
```

### (2) ainvoke

```python
# ainvoke
result = await app.ainvoke({"input":10, "count":0})
print(result)
```

- 출력

```bash
{'input': 10, 'value': 9, 'count': 9, 'response': '9 번 반복 실행됐습니다.'}
```

### (3) batch

```python
# batch
works = [
    {"input":10, "count":0},
    {"input":20, "count":0},
    {"input":30, "count":0}
    ]
app.batch(works)
```

- 출력

```bash
[
  {'input': 10, 'value': 1, 'count': 1, 'response': '1 번 반복 실행됐습니다.'},
  {'input': 20, 'value': 3, 'count': 18, 'response': '18 번 반복 실행됐습니다.'},
  {'input': 30, 'value': 5, 'count': 16, 'response': '16 번 반복 실행됐습니다.'}
  ]
```

### 5-1. stream - values

- **stream_mode**를 `values` 로 지정하면 된다.

```python
# stream : values
mode = "values"
for result in app.stream({"input":10, "count":0}, stream_mode=mode):
    print(result)
```

- 출력

```bash
{'input': 10, 'count': 0}
{'input': 10, 'value': 83, 'count': 1}
{'input': 10, 'value': 47, 'count': 2}
{'input': 10, 'value': 99, 'count': 3}
{'input': 10, 'value': 93, 'count': 4}
{'input': 10, 'value': 5, 'count': 5}
{'input': 10, 'value': 5, 'count': 5, 'response': '5 번 반복 실행됐습니다.'}
```

### 5-2. stream - updates

- **stream_mode**를 `updates` 로 지정하면 된다.
    - 또한, **stream_mode** 를 지정하지 않으면, 기본값으로 updates가 적용된다.

```python
# stream : updates
mode = "updates"
for result in app.stream({"input":10, "count":0}, stream_mode=mode):
    print(result)
```

- 출력

```bash
{'generate': {'value': 96, 'count': 1}}
{'generate': {'value': 36, 'count': 2}}
{'generate': {'value': 1, 'count': 3}}
{'terminate': {'response': '3 번 반복 실행됐습니다.'}} # -> 전체 내용이 아닌, 업데이트 된 내용만 출력
```

### 5-3. stream - debug

- **stream_mode**를 `debug` 로 지정하면 된다.

```python
# stream : debug
mode = "debug"
for result in app.stream({"input":10, "count":0}, stream_mode=mode):
    print(result)
```

- 출력

```bash
{'step': 1, 'timestamp': '2026-05-03T09:05:50.366649+00:00', 'type': 'task', 'payload': {'id': 'f8fbe072-b092-8e55-73bd-6b79995a8250', 'name': 'generate', 'input': {'input': 10, 'count': 0}, 'triggers': ('branch:to:generate',)}}
{'step': 1, 'timestamp': '2026-05-03T09:05:50.366809+00:00', 'type': 'task_result', 'payload': {'id': 'f8fbe072-b092-8e55-73bd-6b79995a8250', 'name': 'generate', 'error': None, 'result': {'value': 92, 'count': 1}, 'interrupts': []}}
{'step': 2, 'timestamp': '2026-05-03T09:05:50.366884+00:00', 'type': 'task', 'payload': {'id': '6dd92e14-edb6-e27f-3f57-06774aed12ea', 'name': 'generate', 'input': {'input': 10, 'value': 92, 'count': 1}, 'triggers': ('branch:to:generate',)}}
{'step': 2, 'timestamp': '2026-05-03T09:05:50.367000+00:00', 'type': 'task_result', 'payload': {'id': '6dd92e14-edb6-e27f-3f57-06774aed12ea', 'name': 'generate', 'error': None, 'result': {'value': 61, 'count': 2}, 'interrupts': []}}
{'step': 3, 'timestamp': '2026-05-03T09:05:50.367065+00:00', 'type': 'task', 'payload': {'id': 'af0a517a-a3c3-6b3a-8e0c-9a4947eb7d72', 'name': 'generate', 'input': {'input': 10, 'value': 61, 'count': 2}, 'triggers': ('branch:to:generate',)}}
{'step': 3, 'timestamp': '2026-05-03T09:05:50.367176+00:00', 'type': 'task_result', 'payload': {'id': 'af0a517a-a3c3-6b3a-8e0c-9a4947eb7d72', 'name': 'generate', 'error': None, 'result': {'value': 13, 'count': 3}, 'interrupts': []}}
{'step': 4, 'timestamp': '2026-05-03T09:05:50.367232+00:00', 'type': 'task', 'payload': {'id': '08b09278-c833-66d4-4e9d-c63e5be47350', 'name': 'generate', 'input': {'input': 10, 'value': 13, 'count': 3}, 'triggers': ('branch:to:generate',)}}
{'step': 4, 'timestamp': '2026-05-03T09:05:50.367329+00:00', 'type': 'task_result', 'payload': {'id': '08b09278-c833-66d4-4e9d-c63e5be47350', 'name': 'generate', 'error': None, 'result': {'value': 4, 'count': 4}, 'interrupts': []}}
{'step': 5, 'timestamp': '2026-05-03T09:05:50.367387+00:00', 'type': 'task', 'payload': {'id': 'a5d102d1-eb46-9dd1-198c-bf36f6d1576c', 'name': 'terminate', 'input': {'input': 10, 'value': 4, 'count': 4}, 'triggers': ('branch:to:terminate',)}}
{'step': 5, 'timestamp': '2026-05-03T09:05:50.367455+00:00', 'type': 'task_result', 'payload': {'id': 'a5d102d1-eb46-9dd1-198c-bf36f6d1576c', 'name': 'terminate', 'error': None, 'result': {'response': '4 번 반복 실행됐습니다.'}, 'interrupts': []}}
```

### 6. astream

- stream에 더해 비동기 처리가 가능한 출력 모드이다.

```python
# astream : a
mode = "updates"
async for result in app.astream({"input":10, "count":0}, stream_mode=mode):
    print(result)
```

```bash
{'generate': {'value': 28, 'count': 1}}
{'generate': {'value': 55, 'count': 2}}
{'generate': {'value': 33, 'count': 3}}
{'generate': {'value': 33, 'count': 4}}
{'generate': {'value': 74, 'count': 5}}
{'generate': {'value': 31, 'count': 6}}
{'generate': {'value': 96, 'count': 7}}
{'generate': {'value': 65, 'count': 8}}
{'generate': {'value': 84, 'count': 9}}
{'generate': {'value': 37, 'count': 10}}
{'generate': {'value': 83, 'count': 11}}
{'generate': {'value': 81, 'count': 12}}
{'generate': {'value': 27, 'count': 13}}
{'generate': {'value': 75, 'count': 14}}
{'generate': {'value': 98, 'count': 15}}
{'generate': {'value': 2, 'count': 16}}
{'terminate': {'response': '16 번 반복 실행됐습니다.'}}
```