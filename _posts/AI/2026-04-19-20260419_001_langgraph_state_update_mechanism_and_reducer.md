---
title: "[LangGraph] State(상태) - 3.상태 업데이트 메커니즘과 리듀서" # 제목 (필수)
excerpt: "랭그래프에서 상태의 업데이트는 어떻게 이루어질까?" # 서브 타이틀이자 meta description (필수)
date: 2026-04-19 19:00:00 +0900      # 작성일 (필수)
lastmod: 2026-04-19 19:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-04-19 19:00:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langgraph 랭그래프 langchain 랭체인 상태 state 업데이트 수정 변경 메커니즘 작동방식 방식 리듀서 reducer                   # 태그 복수개 가능 (필수)
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

<!--postNo: 20260419_001-->

## 1. State 상태 업데이트 메커니즘

### (1) State 의 channel (채널)

- State 안의 “각각의 키 하나 하나를 그래프 런타임(Pregel)이 관리하는 저장 슬롯” 이다.
- 쉽게 말해, State 안에 있는 각각의 필드가 하나 하나의 채널이다.
- 각 채널은 **“현재 값”** 과 **“업데이트 규칙”**을 가진다.
- 별도의 업데이트 규칙을 정해주지 않으면, 기본적으러 덮어쓰기를 수행한다.

```python
class GraphState(TypedDict):
    user_input: str                  # user_input 채널
    intent: str                      # intent 채널
    logs: Annotated[list[str], add]  # result 채널
```

### (2) State 업데이트 예시

- 예시를 들기 전, node 에 대해 잠깐 설명해야 한다.
- node는, LangGraph에서 특정한 작업을 수행하는 단위, 함수에 해당한다.
- 또한 node는 State를 입력으로 받아, 업데이트한 뒤 State를 반환한다.
- 사용자의 발화에서 의도를 추출하고 답변을 생성하는 간단한 애플리케이션을 예로 들어본다.

```python
from typing import TypedDict, Annotated
from operator import add
from langgraph.graph import StateGraph

class GraphState(TypedDict):
    user_input: str
    intent: str
    result: str

# 사용자의 의도를 판단해, intent 채널에 업데이트
def classify_node(state: GraphState) -> dict:
    if "환불" in state["user_input"]:
        return {"intent": "refund"}
    elif "구매" in state["user_input"]:
        return {"intent": "purchase"}
    return {"intent": "general"}

# 사용자 의도에 따라 result 채널에 업데이트
def response_node(state: GraphState) -> dict:
    if state["intent"] == "refund":
        return {"result": "환불 절차를 안내합니다."}
    elif state["intent"] == "purchase":
        return {"result": "구메 절차를 안내합니다."}
    return {"result": "일반 문의로 처리합니다."}
```

- 알아둘 점은, 노드는 전체 State를 수정하는 게 아니라, **업데이트 되는 채널만 반환**하며
- 반환된 값을 참고하여 **랭그래프의 런타임이 그 채널의 업데이트 규칙에 따라 기존 값을 수정한다는** 것이다.
- 위 랭그래프에 대해 `환불받고 싶어요` 라는 user_input이 들어왔다고 해보자.

```python
{
    "user_input": "환불받고 싶어요",
    "intent": "",
    "result": ""
}
```

- `classify_node` 노드 실행 후에는 State가 아래와 같이 업데이트 된다.

```python
{
    "user_input": "환불받고 싶어요",
    "intent": "refund",
    "result": ""
}
```

- 그 다음 `response_node` 가 실행되면 State 는 아래와 같이 바뀔 것이다.

```python
{
    "user_input": "환불받고 싶어요",
    "intent": "refund",
    "result": "환불 절차를 안내합니다."
}
```

### (3) State 상태 업데이트 메커니즘

- 상태 업데이트 메커니즘에 대해 간단히 정리해보면 아래와 같다.
- (1) 그래프가 현재 State 를 노드에 전달한다.
- (2) 노드는 State를 읽고, 작업을 수행한 뒤, **변경분(채널)**만 `dict` 형태로 반환한다.
- (3) LangGraph 런타임이 반환값을 받아 **채널의 업데이트 규칙에 맞게** State에 반영한다.
- (4) 다음 노드는 업데이트된 State를 받아 작업을 수행한다.

<br>

## 2. 리듀서 Reducer

### (1) 채널의 업데이트 규칙

- 앞서 소개했듯, State 의 각 채널은 “현재 값”과 함께 **”업데이트 규칙”**을 가진다.
- 그렇다면 채널의 업데이트 규칙에는 어떤 종류들이 있을까?
- 기본값은 덮어쓰기고, “리스트에 추가”하는 규칙도 자주 사용된다.
- 그리고 자유롭게 업데이트 규칙을 정할 수도 있다.

| 업데이트 규칙 | 설명 |
| --- | --- |
| 덮어쓰기 |   • 채널의 현재 값을 덮어쓴다.<br>  • 기본적인 업데이트 규칙<br>  • 별도 규칙을 정하지 않으면 덮어쓰기가 적용됨 |
| 리스트에 추가 |   • 채널이 list[] 자료형인 경우<br>  • 현재값(리스트)의 요소를 추가하는 방식으로 업데이트됨<br>  • Message 또는 Log 등에 자주 사용됨 |
| 사용자 정의 |   • 그 외로도 다양한 방식의 업데이트 규칙이 가능하다.<br>  • 예를 들어 int 형 채널에 대해 값을 1씩 늘린다던가 하는 규칙 등 |

### (2) 리듀서(Reducer)의 정의

- State의 특정 키(채널)에 새 값이 들어왔을 때, **기존 값과 새 값을 어떻게 합칠지 정의하는 함수**
- 각 키(채널)들은 자신만의 reducer를 가질 수 있다.
- reducer를 지정하지 않은 경우, 기본 업데이트 규칙은 덮어쓰기.

### (3) 리듀서의 예시

- 아래는 삼세판 가위바위보로 승자를 가리는 랭그래프다.
- (1) count : 가위바위보 횟수
- (2) win_logs : 각 판의 승리자를 누적한 리스트
- (3) winner : 최종 승리자

```python
from typing import Annotated
from operator import add
from typing_extensions import TypedDict
from collections import Counter
from langgraph.graph import StateGraph

class State(TypedDict):
    count: Annotated[int, add]
    win_logs: Annotated[list[str], add]
    winner: str

def first_round_node(state: State) -> State:
    return {
        "count": 1,
        "win_logs": ["철수"]
    }

def second_round_node(state: State) -> State:
    return {
        "count": 1,
        "win_logs": ["민수"]
    }

def third_round_node(state: State) -> State:
    return {
        "count": 1,
        "win_logs": ["철수"]
    }

def judge_node(state: State) -> State:
    c = Counter(state["win_logs"])
    return {
        "winner": c.most_common()[0][0]
    }
    
builder = StateGraph(State)

builder.add_node("first", first_round_node)
builder.add_node("second", second_round_node)
builder.add_node("third", third_round_node)
builder.add_node("judgement", judge_node)

builder.set_entry_point("first")
builder.add_edge("first", "second")
builder.add_edge("second", "third")
builder.add_edge("third", "judgement")

app = builder.compile()

state = State({"count":0})
app.invoke(state)
```

- 이 그래프는 첫 노드를 거치면, 상태가 아래와 같이 업데이트된다.

```python
{"count":1, "win_logs":["철수"]}
```

- 두 번째 판에서는 민수가 이겼고, 상태는 아래와 같이 업데이트된다.

```python
{"count":2, "win_logs":["철수", "민수"]}
```

- 마지막 판에서는 철수가 이겼고, 상태는 아래와 같이 업데이트된다.

```python
{"count":3, "win_logs":["철수", "민수", "철수"]}
```

- 최종 판결 노드를 거친 최종 상태는 아래와 같다.

```python
{"count":3, "win_logs":["철수", "민수", "철수"], winner:"철수"}
```

### (4) 예시 작동 방식 살펴보기

- `count` 와 `win_logs` 두 채널에서 `operator.add` 라는 함수를 리듀서로 사용했다.
- 이 함수는 더하기를 수행하는 함수로, `+` 와 같은 작동방식을 가진다.
- 동일한 함수임에도`count` 와 `win_logs` 각 채널에서의 작동방식이 다름을 볼 수 있다. 이는 자료형의 차이 때문.

> - `count` 는 int 형이기 때문에 add 를 하면 두 숫자가 더해진 결과가 반환된다.  
> - `win_logs` 는 list 형이기 때문에 add 가 `extend` 와 같은 동작을 수행한다.  

- 리듀서의 작동 방식을 함수 선언문으로 표현해보면 아래와 같다.

```python
def reducer(a:SOMETYPE, b:SOMETYPE) -> SOMETYPE
```

### (4) 주의할 사항

- (1) 업데이트 되는 자료형과, 리듀서가 리턴하는 자료형이 같아야 한다.  
- (2) list 형태인 채널에 대해서는 list 로 리턴해야 한다.
- 이 정도를 주의하면 좋을 것이다.  
- 추후 추가  

## Reference

[https://docs.langchain.com/oss/python/langgraph/graph-api](https://docs.langchain.com/oss/python/langgraph/graph-api?utm_source=chatgpt.com)  

**Do it! LLM을 활용한 AI 에이전트 개발 입문 (이성용 저)**  

https://wikidocs.net/261579  

https://www.youtube.com/watch?v=W_uwR_yx4-c
