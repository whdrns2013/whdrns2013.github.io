---
title: "[파이썬-logging] 03. 파이썬 로깅 라이브러리의 구조" # 제목 (필수)
excerpt: "파이썬 로깅 라이브러리 파헤쳐보기" # 서브 타이틀이자 meta description (필수)
date: 2025-11-04 00:40:00 +0900      # 작성일 (필수)
lastmod: 2025-11-04 00:40:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-04 00:40:00 +0900   # 최종 수정일 (필수)
categories: [Python, doc]      # 다수 카테고리에 포함 가능 (필수)
doc_group: python_logging
tags: python 파이썬 로깅 로그 logging log 라이브러리 구조 구성 요소 구성요소 Logger Handler Formatter LogRecord                    # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20251104_003-->


## 파이썬 로깅 라이브러리의 구조  

### 구성 요소  

- 파이썬 로깅 라이브러리는 `Logger`, `Handler`, `Formatter` 라는 세 가지 주요 요소로 구성된다.  
- 이 세 구성 요소 간에 전달되는 정보를 담은 데이터 구조가 `LogRecord` 이다.  

#### Logger(로거)  

- 역할 : **로깅 시스템의 진입점**이자 구심점이 되는 객체. 개발자가 **로깅 메시지를 생성하고 관리**하는 역할을 한다.  
- 로깅 메시지 생성 : `logger.debug()`, `logger.error()` 등 메서드를 사용해 **로그 레코드를 생성**한다.  
- 레벨 검사 : 자신에게 설정된 로그 레벨 미만의 메시지는 처리하지 않고 무시한다.  
- 핸들러 전달 : 생성 및 레벨 검사에서 통과된 **로그 레코드를 하나 이상의 Handler 에 전달**한다.  
- 계층 구조 : 로거는 계층적 구조를 가질 수 있으며(e.g. `main.sub`) 메시지는 기본적으로 상위 로거로 전파(propagation) 된다.  

#### Handler(핸들러)  

- 역할 : Logger 로부터 받은 **로그 레코드를 실제 출력 위치로 전송하는 역할**을 한다.  
- 출력 대상 결정 : 콘솔(스트림), 파일, 이메일, HTTP 서버 등 다양한 대상으로 로그 전송
- 포매터 연결 : Formatter 객체를 연결해 로그 레코드를 원하는 문자열 형식으로 변환한다.  
- 레벨 검사 : 핸들러 자체의 레벨이 설정되어 있어, 해당 레벨 이하의 로그 레코드는 처리하지 않는다.  
- 개발자가 **직접 핸들러가 처리할 로직을 구성하여 새로 만들 수도** 있다.  

|종류|설명|
|---|---|
|StreamHandler|콘솔(sys.stderr 또는 sys.stdout)에 출력|
|FileHandler|지정된 파일에 출력(기록)|
|RotatingFileHandler|파일의 크기가 일정 수준을 넘으면 자동으로 파일을 교체(로테이션)|
|TimedRotatingFileHandler|시간의 흐름에 따라 자동으로 파일을 교체(로테이션)|
|SMTPHandler|로그를 메일로 전송|

#### Formatter(포매터)  

- 역할 : Logger가 생서한 로그 레코드 객체를 사용자가 원하는 형식의 문자열로 변환한다.  
- 주요 기능 : 템플릿 정의 - 로그 메시지에 포함될 정보와 순서를 정의한다.  
- 예시 포맷 문자열 : `"%(asctime)s - %(name)s - %(message)s"`  


#### LogRecord(로그레코드)  

- 로깅 이벤트에 대한 모든 정보를 담고 있는 객체  
- 역할 : Logger, Handler, Formatter 사이를 이동하는 **데이터 패키지** 역할  
- 메시지 텍스트, 로깅 레벨, 타임스탬프, 파일명, 라인 번호 등 모든 관련 컨텍스트 정보를 포함한다.


## 파이썬 로깅의 흐름  

### 로깅 준비  

|No|흐름|설명|
|---|---|---|
|1|로거 생성|로깅을 수행할 로거를 생성하고, 로그레벨 등 관련 설정을 수행한다.|
|2|핸들러 생성|로거가 만든 로그 레코드를 전송하는 핸들러를 생성하고, 로그레벨 등 관련 설정을 수행한다.|
|3|포매터 생성|로그 레코드를 지정 형식의 로그 메시지로 만드는 포매터를 생성하고, 관련 설정을 수행한다.|
|4|포매터 할당|핸들러에 포매터를 할당한다.|
|5|핸들러 할당|로거에 핸들러를 할당한다.|

### 로깅  

|No|흐름|설명|
|---|---|---|
|1|로깅 메서드 호출|생성된 `Logger` 인스턴스를 통해 로깅 메서드(e.g. `logger.info()`)를 호출한다.|
|2|로그 레코드 생성|메서드 호출의 결과로 로그 레코드(`LogRecord`)인스턴스가 생성된다.|
|3|로거 레벨 필터링|`Logger` 는 자신에게 설정된 로그 레벨을 확인해, 로그 레코드가 해당 레벨 이상이면 처리하도록 한다.|
|4|핸들러 전달|필터링을 통과한 로그 레코드는 해당 `Logger`에 등록된 모든 `Handler`에 전달된다.|
|5|핸들러 레벨 필터링|`Handler` 자신에게 설정된 로그 레벨을 확인하고, 전달받은 로그 레코드를 처리할지 결정한다.|
|6|포맷 변환|`Handler`에 연결된 `Formatter` 인스턴스가 로그 레코드의 정보를 지정된 형식의 문자열로 변환한다.|
|7|전파(propagation)|로그 레코드가 계층 구조를 따라 상위 로거로 전달된다.(설정값에 따름)<br>상위 로거도 3~8번 단계를 거친다.|
|8|최종 출력|변환된 문자열 로그 메시지는 `Handler`가 지정한 대상(파일, 콘솔, 이메일 등)으로 최종 출력된다.|

## Reference  

[https://docs.python.org/3/library/logging.html](https://docs.python.org/3/library/logging.html)  
[https://docs.python.org/ko/3/howto/logging.html](https://docs.python.org/ko/3/howto/logging.html)  