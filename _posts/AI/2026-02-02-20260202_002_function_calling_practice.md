---
title: "[LLM] 펑션 콜링 실습 function calling practice" # 제목 (필수)
excerpt: "펑션 콜링 구축해보기" # 서브 타이틀이자 meta description (필수)
date: 2026-02-02 23:46:00 +0900      # 작성일 (필수)
lastmod: 2026-02-02 23:46:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-02-02 23:46:00 +0900   # 최종 수정일 (필수)
categories: AI        # 다수 카테고리에 포함 가능 (필수)
tags: llm ai 펑션콜링 펑션 콜링 function calling 도구 호출 tool 실습             # 태그 복수개 가능 (필수)
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
<!--postNo: 20260222_002-->

## 펑션 콜링 실습  

### 실습 내용  

- 1. 프로젝트 폴더 만들기  
- 2. 도구(펑션) 함수와 설명 작성  
- 3. 도구(펑션) 리스트 작성  
- 4. 펑션 콜링 구현  

> 작성할 도구(펑션) 목록    
> (1) 특정 타임존의 현재 시각을 확인하는 함수  
> (2) 주식 종목의 정보를 가져오는 함수    
> (3) 주식 가격 이력을 가져오는 함수  
> (4) 주식 추천 정보를 가져오는 함수  


### 프로젝트 폴더 만들기  

- 파이썬 패키지 및 프로젝트 관리 툴인 uv 를 사용합니다.  
- uv : https://whdrns2013.github.io/python/20250515_002_uv/  

```bash
# 프로젝트 폴더 초기화
bash init function_calling
cd function_calling

# 폴더 생성
mkdir tools

# 의존성 설치
uv add openai yfinance pytz tabulate
```

### 도구(펑션)함수 및 설명 작성  

> 코드블럭 최상단의 파일명을 꼭 참고하고, 그 위치에 파일을 작성해주세요.  


#### 1. 시간 확인 함수  

- 특정 타임존의 현재 시간을 확인하는 함수입니다.  
- `datetime` 과 `pytz` 모듈을 사용합니다.  
- pytz에 대한 설명 : https://whdrns2013.github.io/python/20260126_001_pytz/  

```python
# 파일명 : tools/_get_current_time.py
from datetime import datetime
import pytz

def func(timezone="Asia/Seoul"):
    tz = pytz.timezone(timezone)
    now = datetime.now(tz).strftime("%Y-%m-%d %H:%M:%S")
    now_timezone = f"{now} {timezone}"
    return now_timezone

tool_def = {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "해당 타임존의 날짜와 시간을 반환합니다.",
            "parameters": {
                "type":"object",
                "properties":{
                    "timezone": {
                        "type":"string",
                        "description":"현재 날짜와 시간을 반환할 타임존을 입력하세요.(예. Aisa/Seoul)",
                    }
                },
                "required":["timezone"]
            }
        }
    }
```

#### 2. 주식 종목 정보 가져오기  

- 주식 종목의 정보를 가져오는 함수입니다.  
- `yfinance` (yahoo! finance) 라이브러리를 사용합니다.  
- yfinance : https://whdrns2013.github.io/python/20260129_001_yfinance/  

```python
# 파일명 : tools/_get_yf_stock_info.py
import yfinance as yf

def func(ticker: str):
    stock = yf.Ticker(ticker)
    info = stock.info
    return str(info)

tool_def = {
        "type": "function",
        "function": {
            "name": "get_yf_stock_info",
            "description": "해당 종목의 Yahoo Finance 정보를 반환합니다.",
            "parameters": {
                "type":"object",
                "properties":{
                    "ticker": {
                        "type":"string",
                        "description":"Yahoo Finance 정보를 반환할 종목의 티커를 입력하세요. (예:APPL)",
                    }
                },
                "required":["ticker"]
            }
        }
    }
```

#### 3. 주식 가격 이력 가져오기   

- 주식 종목의 과거 가격 이력을 조회해오는 함수입니다.  
- 동일하게 `yfinance` (yahoo! finance) 라이브러리를 사용합니다.  

```python
# 파일명 : tools/_get_yf_stock_history.py
import yfinance as yf

def func(ticker:str, period:str):
    stock = yf.Ticker(ticker)
    hist = stock.history(period=period)
    return str(hist.to_markdown())

tool_def = {
        "type": "function",
        "function": {
            "name": "get_yf_stock_history",
            "description": "해당 종목의 Yahoo Finance 주가 정보를 반환합니다.",
            "parameters": {
                "type":"object",
                "properties":{
                    "ticker": {
                        "type":"string",
                        "description":"Yahoo Finance 주가 정보를 반환할 종목의 티커를 입력하세요. (예:APPL)",
                    },
                    "period": {
                        "type": "string",
                        "description":"주가 정보를 조회할 기간을 입력하세요. (예: 1d, 5d, 1mo, 3mo, 1y, 5y)"
                    }
                },
                "required":["ticker", "period"]
            }
        }
    }
```

#### 4. 주식 추천 정보 가져오기  

- 전문가들의 주식 추천 정보를 가져오는 함수입니다.  
- 동일하게 `yfinance` (yahoo! finance) 라이브러리를 사용합니다.  

```python
# 파일명 : tools/_get_yf_stock_recommendations.py
import yfinance as yf

def func(ticker:str):
    stock = yf.Ticker(ticker)
    reco = stock.recommendations
    return str(reco.to_markdown())

tool_def = {
        "type": "function",
        "function": {
            "name": "get_yf_stock_recommendations",
            "description": "해당 종목의 Yahoo Finance 추천 정보를 반환합니다.",
            "parameters": {
                "type":"object",
                "properties":{
                    "ticker": {
                        "type":"string",
                        "description":"Yahoo Finance 추처 정보를 반환할 종목의 티커를 입력하세요. (예:APPL)",
                    }
                },
                "required":["ticker"]
            }
        }
    }
```

### 도구(펑션) 리스트 작성

- 이제 작성한 도구(펑션)들에 대한 설명 dictionary를 하나의 리스트 `tools`에 모읍니다.  
- 이렇게 모은 `tools`는 추후 LLM에 질의를 할 때 함께 제공합니다.  
- 하는 김에 펑션의 이름과, 이에 대해 실행해야 할 함수를 매칭시킨 함수 `tool_mapping`을 하나 만들어줍니다.

```python
# 파일명 : tools/gpt_functions.py
from tools import _get_current_time, _get_yf_stock_info, _get_yf_stock_history, _get_yf_stock_recommendations

# 사용 가능한 도구(펑션)들에 대한 설명 정보 리스트
tools = [
    _get_current_time.tool_def,
    _get_yf_stock_info.tool_def,
    _get_yf_stock_history.tool_def,
    _get_yf_stock_recommendations.tool_def
]

# 도구(펑션) 이름과 실행할 함수 매팽
def tool_mapping(tool_name:str, arguments:dict|None):
    if tool_name == "get_current_time":
        func_result = _get_current_time.func(timezone=arguments["timezone"])
    elif tool_name == "get_yf_stock_info":
        func_result = _get_yf_stock_info.func(ticker=arguments["ticker"])
    elif tool_name == "get_yf_stock_history":
        func_result = _get_yf_stock_history.func(ticker=arguments["ticker"], period=arguments["period"])
    elif tool_name == "get_yf_stock_recommendations":
        func_result = _get_yf_stock_recommendations.func(ticker=arguments["ticker"])
    return func_result

```

### 펑션 콜링 구현

- 앞서 작성한 도구들과 도구 목록을 이용해 LLM 펑션 콜링을 구현합니다.  
- 이번 실습에서는 OpenAI의 API를 사용합니다.  
- 터미널에서 간단하게 대화를 할 수 있게 만들었습니다.  

```python
# main.py
from openai import OpenAI
from tools.gpt_functions import tools, tool_mapping
import json

API_KEY=************* # api key 입력

def get_ai_response(messages:list[dict], model:str="gpt-4o", tools=tools):
    api_key = API_KEY
    client = OpenAI(api_key = api_key)
    response = client.chat.completions.create(
        model = model,
        messages = messages,
        tools = tools,
    )
    return response

def terminal_chat():
    messages = []
    while True:
        # 사용자 입력
        user_input = input("◆ user\t:")
        if user_input == "exit":
            break
        
        # 대화 내역 추가
        messages.append({"role":"user", "content":user_input})
        
        # AI의 1차 답변
        response = get_ai_response(messages=messages)
        
        # AI 1차 답변 분석 및 처리
        ai_message = None
        if hasattr(response, "choices"):
        
            # 펑션 콜링 처리
            if response.choices[0].message.tool_calls:
                ai_message_obj = response.choices[0].message
                tool_calls = ai_message_obj.tool_calls
                
                # messages 에 tool calls 추가
                messages.append(ai_message_obj)
                
                # 펑션 콜링 처리
                for tool_call in tool_calls:
                    tool_name = tool_call.function.name
                    tool_call_id = tool_call.id
                    arguments = json.loads(tool_call.function.arguments)
                    func_result = tool_mapping(tool_name=tool_name, arguments=arguments)
                    messages.append({"role":"tool", "tool_call_id":tool_call_id, "name":tool_name, "content":str(func_result)})
                    
                # 펑션콜링 결과를 반영한 AI 2차 답변
                response = get_ai_response(messages=messages)
                
            # AI 최종 응답
            ai_message = response.choices[0].message.content
            messages.append({"role":"assistant", "content":ai_message})
        
        # 화면 출력
        if ai_message:
            print("◆ AI\t:" + ai_message)

def main():
    terminal_chat()
```

```bash
# 실행
uv run main.py
```

### 대화 예시

```bash
◆ user    :애플 주식 정보 알려줘
◆ AI      :애플(AAPL) 주식에 대한 정보를 다음과 같이 제공할 수 있습니다:
					 - **회사명**: Apple Inc.
					 - **산업분야**: 소비자 전자 제품
					 ...
◆ user    :서울과 뉴욕의 시간 알려줘
◆ AI      :현재 시간은 다음과 같습니다:
					 - **서울(한국)**: 2026년 2월 2일 오후 7시 30분
					 - **뉴욕(미국)**: 2026년 2월 2일 오전 5시 30분
					 추가적인 도움이 필요하시면 언제든지 말씀해 주세요!
◆ user    :시간정보는 출처가 어디야
◆ AI      :시간 정보는 지정된 시간대에 따라 시스템에서 자동으로 계산된 결과입니다. 일반적으로 세계 표준 시간(UTC) 기준에서 각 시간대의 오프셋을 적용하여 계산합니다. 다른 질문 있으시면 알려주세요!
◆ user    :펑션콜링한거야?
◆ AI      :네, 저는 시간 정보를 얻기 위해 "get_current_time" 함수를 호출했습니다. 이를 통해 서울과 뉴욕의 현재 시간을 각각 가져올 수 있었습니다. 추가 질문이나 다른 요청이 있으시면 말씀해 주세요!user    :안녕?
◆ AI      :안녕하세요! 어떤 도움이 필요하신가요? 궁금한 점이나 요청 사항이 있으면 말씀해 주세요!
```


## Reference  

[Do it! LLM을 활용한 AI 에이전트 개발 입문 - 이성용 저](https://search.shopping.naver.com/book/catalog/54509126926)  
