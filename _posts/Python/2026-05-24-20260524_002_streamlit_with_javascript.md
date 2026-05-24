---
title: "[Streamlit] Streamlit 에서 JavaScript 사용하기" # 제목 (필수)
excerpt: "Streamlit 웹앱에서 프론트엔드 작업이 필요할 경우" # 서브 타이틀이자 meta description (필수)
date: 2026-05-24 04:56:00 +0900      # 작성일 (필수)
lastmod: 2026-05-24 04:56:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-05-24 04:56:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 streamlit 스트림릿 웹앱 만들기 앱 app webapp javascript 자바스크립트                     # 태그 복수개 가능 (필수)
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
  nav: docs_python
pinned: 
series: streamlit-cloud-deploy
series_index: 2
---
<!--postNo: 20260524_002-->


## Streamlit에서 JavaScript 사용하기

### 1. Streamlit의 한계

이렇게 편하게 웹앱을 쉽게 만들 수 있다니. 파이썬 코드만으로 버튼, 입력창, 차트, 테이블, 차일 업로드, 대시보드까지 단 몇줄의 코드만으로 만들 수 있다는 게 놀랍다.  

하지만 편한 만큼 한계도 있다. 대표적인 한계는 프론트엔드에서 매우 자주 갱신되어야 하는 작업을 처리하기 어렵다는 점이다. 예를 들어, 스톱워치 웹앱을 만든다고 가정해보자.(물론 스톱워치 만들려고 Streamlit을 쓰는 사람은 거의 없겠지만, 한계를 설명하기에는 좋은 예시라고 생각된다.)  

스톱워치는 화면의 시간이 짧은 텀을 두고 계속 바뀌어야 한다.  

```python
00:00.01
00:00.02
00:00.03
...
```

이걸 Streamlit의 Python 코드만으로 구현하려면 보통 이런 방식이 될 것이다.  

```python
import time
import streamlit as st

time.sleep(0.1)
st.rerun()
```

이 방식의 문제는, Streamlit 앱이 기본적으로 사용자 입력이나 상태 변화가 있을 때 Python 스크립트를 다시 실행하는 방식으로 동작한다는 점이다. 즉, 스톱워치 화면을 0.1초마다 갱신하려고 한다면, Streamlit 앱도 0,1초마다 다시 실행되는 것이다.  

바꿔 말하면, 0.1초마다 갱신하는 스톱워치 웹앱은, 사용자 한 명당 초당 10회 통신이 일어나는 것이다. 이게 사용자가 한명이면 초당 10회지만, 1000명이면 초당 10000회로, 서버에게 가벼운 일은 아닐 것이다. 그리고 이 방식은 너무도 비효율적이다.  

### 2. 자주 갱신되는 작업을 어떻게 처리할까?

사실 스톱워치 시간 계산 자체를 서버가 할 필요는 없다. 브라우저가 이미 현재 시간을 알고 있고, 화면단에서 가볍게 보여주는 숫자(시간)만 바꿔주면 되는 것이다. 그리고 Javascript에서는 `Date.now()`나 `setInterval()` 을 이용해 화면을 가볍게 생신할 수 있다.  

따라서 스톱워치의 경우에는 아래처럼 역할을 나눠 처리하는 것이 훨씬 합리적일 것이다.  

```python
화면의 시간 갱신 → JavaScript
시작 / 정지 / 초기화 버튼 → JavaScript
최종 기록 저장 → 백엔드
DB 저장, CSV 저장, 분석 → 백엔드
```

즉, **계속 바뀌는 화면은 브라우저에서 처리하고, 백엔드는 필요한 순간에만 값을 받는 구조인 것이다.**  

그리고 만약 정말 Streamlit에서 스톱워치를 구현해야 한다면, 위처럼 JavaScript를 사용하는 방법이 필요해진다.  

### 3. Streamlit에서 Javascript를 사용하는 방법

결론부터 말하자면 Streamlit과 JavaScript를 함께 사용할 수 있다. 우선 디렉터리 구조를 설명하자면 아래와 같다.  

```python
my_app/
├─ app.py
└─ components/
   └─ stopwatch
       ├─ __init__.py
       └─ frontend/
          └─ index.html
```

| 경로 | 역할 |
| --- | --- |
| `my_app/` | 프로젝트 루트 폴더 |
| `app.py` | Streamlit 실행 파일. `streamlit run app.py`로 실행 |
| `components/` | 커스텀 컴포넌트들을 모아두는 폴더 |
| `components/stopwatch/` | 스톱워치 컴포넌트 하나를 담는 패키지 |
| `components/stopwatch/__init__.py` | Python에서 컴포넌트를 등록하고 호출하는 연결 파일 |
| `components/stopwatch/frontend/` | HTML, CSS, JavaScript 화면 코드가 들어가는 폴더 |
| `components/stopwatch/frontend/index.html` | 실제 스톱워치 UI와 JavaScript 로직 |

코드들을 하나씩 살펴보자.  

- app.py

```python
# app.py
import streamlit as st
from components.stopwatch import stopwatch

st.title("스톱워치")

result = stopwatch(key="stopwatch")

st.write("Python으로 받은 값")

if result is None:
    st.info("아직 기록된 시간이 없습니다.")
else:
    start_datetime = result.get("start_datetime")
    elapsed_ms = result.get("elapsed_ms", 0)

    st.write("시작일시:", start_datetime)
    st.write("경과시간(ms):", elapsed_ms)
    st.write("경과시간(초):", round(elapsed_ms / 1000, 2))

    if start_datetime:
        st.success(f"시작일시 {start_datetime}, 경과시간 {elapsed_ms / 1000:.2f}초")
```

- components/stopwatch/__init__.py

```python
import os
import streamlit.components.v1 as components

_component_func = components.declare_component(
    "stopwatch",
    path=os.path.join(os.path.dirname(__file__), "frontend"),
)

def stopwatch(key=None):
    return _component_func(key=key, default=None)
```

- components/stopwatch/frontend/index.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />

  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 16px;
    }

    .box {
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 20px;
    }

    #display {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    #startedAt {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }

    button {
      padding: 10px 18px;
      margin: 4px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>

<body>
  <div class="box">
    <div id="display">00:00.00</div>
    <div id="startedAt">시작일시: -</div>

    <button onclick="startTimer()">시작</button>
    <button onclick="stopTimer()">정지</button>
    <button onclick="resetTimer()">초기화</button>
    <button onclick="sendValue()">기록하기</button>
  </div>

  <script>
    const Streamlit = {
      setComponentReady: function() {
        window.parent.postMessage(
          {
            isStreamlitMessage: true,
            type: "streamlit:componentReady",
            apiVersion: 1
          },
          "*"
        );
      },

      setFrameHeight: function(height) {
        window.parent.postMessage(
          {
            isStreamlitMessage: true,
            type: "streamlit:setFrameHeight",
            height: height
          },
          "*"
        );
      },

      setComponentValue: function(value) {
        window.parent.postMessage(
          {
            isStreamlitMessage: true,
            type: "streamlit:setComponentValue",
            value: value,
            dataType: "json"
          },
          "*"
        );
      }
    };

    let startTime = 0;
    let elapsed = 0;
    let timerInterval = null;
    let running = false;

    let startDatetime = null;

    function toLocalISOString(date) {
      const offsetMs = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offsetMs);
      const iso = localDate.toISOString().slice(0, -1);

      const offsetMinutes = -date.getTimezoneOffset();
      const sign = offsetMinutes >= 0 ? "+" : "-";
      const absOffset = Math.abs(offsetMinutes);
      const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
      const minutes = String(absOffset % 60).padStart(2, "0");

      return iso + sign + hours + ":" + minutes;
    }

    function formatTime(ms) {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const centiseconds = Math.floor((ms % 1000) / 10);

      return String(minutes).padStart(2, "0") + ":" +
             String(seconds).padStart(2, "0") + "." +
             String(centiseconds).padStart(2, "0");
    }

    function getCurrentElapsed() {
      if (running) {
        return elapsed + Date.now() - startTime;
      }
      return elapsed;
    }

    function updateDisplay() {
      document.getElementById("display").innerText =
        formatTime(getCurrentElapsed());
    }

    function updateStartedAtDisplay() {
      document.getElementById("startedAt").innerText =
        startDatetime ? "시작일시: " + startDatetime : "시작일시: -";
    }

    function startTimer() {
      if (!running) {
        startTime = Date.now();

        if (startDatetime === null && elapsed === 0) {
          startDatetime = toLocalISOString(new Date());
        }

        running = true;
        timerInterval = setInterval(updateDisplay, 50);
        updateStartedAtDisplay();
      }
    }

    function stopTimer() {
      if (running) {
        elapsed += Date.now() - startTime;
        running = false;
        clearInterval(timerInterval);
        updateDisplay();
      }
    }

    function resetTimer() {
      elapsed = 0;
      startTime = 0;
      startDatetime = null;
      running = false;
      clearInterval(timerInterval);

      updateDisplay();
      updateStartedAtDisplay();

      Streamlit.setComponentValue({
        start_datetime: null,
        elapsed_ms: 0
      });
    }

    function sendValue() {
      const current = Math.floor(getCurrentElapsed());

      Streamlit.setComponentValue({
        start_datetime: startDatetime,
        elapsed_ms: current
      });
    }

    Streamlit.setComponentReady();
    Streamlit.setFrameHeight(260);
    updateDisplay();
    updateStartedAtDisplay();
  </script>
</body>
</html>
```

- 결과물

![](/assets/images/20260524_002_001.jpg)  

### 4. 원리

그러면 이게 어떻게 가능한 걸까? 가능하다는 것을 알게 되었으니, 이게 어떻게 동작하는지 알아보자.  

Python과 HTML/JavaScript는 내 기준에서는 서로 꽤 거리가 있는 것들이다. 

위 코드들에서 Streamlit 앱은 Python으로 작성한다. 반면 버튼 클릭, 화면 갱신, DOM 조작 같은 프론트엔드 작업은 JavaScript가 담당하고 있다. 이 둘을 연결하는 방법이 바로 **Streamlit Custom Component**이다.  

Streamlit DOC에 따르면 **Custom Component**는 Streamlit의 기본 위젯으로 해결하기 어려운 기능을 확장하기 위한 방식이다. 특히 JavaScript, HTML, CSS 같은 웹 기술을 Streamlit 앱 안에 통합할 때 사용된다. 또한 단순히 화면에 HTML을 보여주는 것에서 끝나는 것이 아니라, **Python에서 JavaScript로 값을 넘기고, 다시 JavaScript에서 Python으로 값을 돌려받는 양방향 통신**도 가능하다.  

구조를 단순화하면 다음과 같다.  

```python
Streamlit Python 앱
        ↓
Custom Component 호출
        ↓
iframe 안에서 HTML/JavaScript 실행
        ↓
JavaScript가 화면 처리
        ↓
필요한 순간에 Python으로 값 전달
```

여기서 중요한 점은, JavaScript가 Streamlit 앱과 완전히 섞여서 실행되는 것이 아니라는 점이다. Custom Compoenent는 Streamlit 화면 안에 별도의 프론트엔드 영역을 만들고, 그 안에서 HTML과 JavaScript를 실행하며, 보통 이 영역은 iframe 안에서 렌더링된다.  

즉, Python 파일 안에서 모든 화면 동작을 직접 처리하는 게 아니라, Python은 컴포넌트를 호출하고, JavaScript는 그 컴포넌트 내부에서 사용자 인터랙션과 화면 갱신을 담당하는 것이다.  

이 구조 덕분에 스톱워치 시간이 바뀔 때마다 Streamlit 앱 전체를 다시 실행할 필요가 없다. 시간 표시는 브라우저의 JavaScript가 계속 갱신하고, Python은 사용자가 기록 버튼을 눌렀을 때처럼 필요한 순간에만 값을 받으면 된다.

정리하면 핵심은 이렇다.

> **계속 바뀌는 화면은 JavaScript가 처리하고, Python은 필요한 결과값만 받는다.**

### 5. 각각의 역할

- JavaScript에서 Python으로 시간을 넘기는 `Streamlit.setComponentValue()`

```jsx
Streamlit.setComponentValue({
  start_datetime: startDatetime,
  elapsed_ms: current
});
```

- Python에서 컴포넌 컴포넌트를 호출한 결과값으로 위 데이터를 받는다.

```jsx
result = stopwatch(key="stopwatch")
```

- 결과적으로는 Python에서 아래와 같은 값을 받아올 수 있는 것

```jsx
{
    "start_datetime": "2026-05-24T14:32:10.123+09:00",
    "elapsed_ms": 15320
}
```

## Reference

[Intro to custom components - Streamlit Docs](https://docs.streamlit.io/develop/concepts/custom-components/components-v1/intro?utm_source=chatgpt.com)