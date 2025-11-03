---
title: "[파이썬-logging] 05. Handler" # 제목 (필수)
excerpt: "파이썬 로깅의 행동대장. 로그 메시지를 전송하는 Handler." # 서브 타이틀이자 meta description (필수)
date: 2025-11-04 00:50:00 +0900      # 작성일 (필수)
lastmod: 2025-11-04 00:50:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-04 00:50:00 +0900   # 최종 수정일 (필수)
categories: Python      # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 로깅 로그 logging log handler 핸들러                    # 태그 복수개 가능 (필수)
classes: wide         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
  nav: "docs_python_logging"
---
<!--postNo: 20251104_005-->



## Handler(핸들러)  

### 역할  

- Logger 로부터 받은 **로그 레코드를 실제 출력 위치로 전송하는 역할**을 한다.  
- **하나의 Logger에 1개 이상의 Handler**를 할당할 수 있다.  
- 개인적으로 로깅 기능을 구축할 때, 가장 중요한 역할을 하는 요소라고 생각한다.  

### 주요 기능  

- 출력 대상 결정 : 콘솔(스트림), 파일, 이메일, HTTP 서버 등 다양한 대상으로 로그 전송
- 포매터 연결 : Formatter 객체를 연결해 로그 레코드를 원하는 문자열 형식으로 변환한다.  
- 레벨 검사 : 핸들러 자체의 레벨이 설정되어 있어, 해당 레벨 이하의 로그 레코드는 처리하지 않는다.  
- 개발자가 **직접 핸들러가 처리할 로직을 구성하여 새로 만들 수도** 있다.  

### 핸들러의 종류  

|종류|설명|선언된 파일|
|---|---|---|
|Handler|여러 핸들러를 추상화한 클래스(인터페이스)|`logging.__init__.py`|
|StreamHandler|콘솔(sys.stderr 또는 sys.stdout)에 출력|`logging.__init__.py`|
|FileHandler|지정된 파일에 출력(기록)|`logging.__init__.py`|
|NullHandler|모든 로그 레코드를 처리하지 않고 단순히 버리는(=아무것도 하지 않는) 역할|`logging.__init__.py`|
|RotatingFileHandler|파일의 크기가 일정 수준을 넘으면 자동으로 파일을 교체(로테이션)|`logging.handlers.py`|
|TimedRotatingFileHandler|시간의 흐름에 따라 자동으로 파일을 교체(로테이션)|`logging.handlers.py`|
|SMTPHandler|로그를 메일로 전송|`logging.handlers.py`|
|SocketHandler|TCP/IP 소켓을 통해 네트워크로 로그 전송|`logging.handlers.py`|
|DatagramHandler|UDP를 통해 네트워크로 로그 전송|`logging.handlers.py`|
|HTTPHandler|HTTP GET 또는 POST 요청을 통해 로그 전송|`logging.handlers.py`|
|SysLogHandler|Unix/Linux 표준 로깅 메커니즘을 사용, syslog서버로 전송도 가능|`logging.handlers.py`|
|NTEventLogHandler|Windows 운영체제 전용, 로그를 Windows 이벤트 뷰어에 기록|`logging.handlers.py`|
|WatchedFileHandler|파일이 외부에서 삭제되거나 리네임될 때 자동으로 다시 열어 로깅을 계속함|`logging.handlers.py`|
|BufferingHandler|로그 레코드를 메모리 버퍼에 쌓아둠|`logging.handlers.py`|
|MemoryHandler|BufferingHandler와 유사하지만, 특정 레벨의 로그가 들어올 때만 플러시|`logging.handlers.py`|
|QueueHandler|로그 레코드를 queue.Queue 객체로 넣어 처리|`logging.handlers.py`|


## Handler 사용하기  

### 사용 예시  

```python
import logging

def about_handler():
    
    # Logger 인스턴스 생성 및 설정
    logger_name = "about_handler"
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.INFO)

    # StreamHandler 인스턴스 생성
    stream_handler = logging.StreamHandler()        # 핸들러의 종류를 정할 수 있다.
    stream_handler.setLevel(level = logging.INFO)   # 핸들러가 처리할 최소 로그 레벨을 설정한다.
    formatter = logging.Formatter()                 # Formatter 생성 : 추후에 다룸
    stream_handler.setFormatter(formatter)          # Formatter 할당
    
    # FileHandler 인스턴스 생성
    file_handler = logging.FileHandler(
        filename="logs/handler_log.log",
        mode="a",
        encoding="utf-8"
    )
    file_handler.setLevel(logging.ERROR)            # 핸들러마다 각기 다른 로그 레벨을 설정할 수 있다.
    new_formatter = logging.Formatter()             # Formatter 생성 : 추후에 다룸
    file_handler.setFormatter(new_formatter)        # 핸들러마다 각기 다른 포매터를 설정할 수 있다.
    
    # addHandler : Logger 에 Handler 할당
    # 하나의 Logger 에 다수 개의 Handler 를 할당할 수 있다.
    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)
    
    # 로그 레코드 생성 및 핸들러에 전달
    logger.info("info message")
    logger.error("error message")
    
if __name__ == "__main__":
    about_handler()
```

### Handler 의 메서드  

|메서드|설명|
|---|---|
|`setLevel()`|핸들러가 처리할 가장 최소릐 로그 레벨을 설정한다.|
|`setFormatter()`|핸들러에 인입된 로그 레코드를 로그 메시지로 변환할 포매터를 설정한다.|
|`addFilter()`|핸들러에 필터를 추가한다.|
|`removeFilter()`|핸들러에 필터를 제거한다.|

### Handler 생성 및 사용 흐름  

- 1개 이상의 로거가 생성되어있다는 전제 하에  

|No|흐름|설명|
|---|---|---|
|1|핸들러 생성|로거가 만든 로그 레코드를 전송하는 핸들러를 생성하고, 로그레벨 등 관련 설정을 수행한다.|
|2|포매터 생성|로그 레코드를 지정 형식의 로그 메시지로 만드는 포매터를 생성하고, 관련 설정을 수행한다.|
|3|포매터 할당|핸들러에 포매터를 할당한다.|
|4|핸들러 할당|(생성되어있는)로거에 핸들러를 할당한다.|

### Logger 와 Handler 의 로그 레벨에 따른 처리  

- 위 사용 예시에서 생성된 로그 메시지에 대해서는 아래와 같이 처리될 것이다.  

|Logger|Handler|Method|로그 레코드 생성 및 핸들러로 전달|로그 메시지 전송|
|---|---|---|---|---|
|DEBUG|ERROR|logging.info()|O|X|
|DEBUG|ERROR|logging.error()|O|O|

- 더 많은 경우의 수  

|Logger|Handler|Method|로그 레코드 생성 및 핸들러로 전달|로그 메시지 전송|
|---|---|---|---|---|
|ERROR|DEBUG|logging.debug()|X|X|
|DEBUG|DEBUG|logging.info()|O|O|
|INFO|WARNING|logging.info()|O|X|

## Reference  

[https://docs.python.org/3/library/logging.html](https://docs.python.org/3/library/logging.html)  
[https://docs.python.org/ko/3/howto/logging.html](https://docs.python.org/ko/3/howto/logging.html)  