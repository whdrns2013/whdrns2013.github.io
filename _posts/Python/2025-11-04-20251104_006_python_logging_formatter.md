---
title: "[파이썬-logging] 06. Formatter" # 제목 (필수)
excerpt: "로그 메시지의 형식을 컨트롤하는 포매터"  # 서브 타이틀이자 meta description (필수)
date: 2025-11-04 00:55:00 +0900      # 작성일 (필수)
lastmod: 2025-11-04 00:55:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-04 00:55:00 +0900   # 최종 수정일 (필수)
categories: Python      # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 로깅 로그 logging log formatter 포매터 형식 지정 포맷                    # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20251104_006-->  


## Formatter(포매터)  

### 역할  

- Logger가 생서한 로그 레코드 객체를 사용자가 원하는 형식의 문자열로 변환한다.  

### 주요 기능  

- 템플릿 정의 : 로그 메시지에 포함될 정보와 순서를 정의한다.  

### 포매터 선언 방법  

```python
formatter = logging.Formatter(
    fmt = "%(asctime)s, %(name)s - %(message)s" # 로그 메시지 포맷
    datefmt = "%Y-%m-%d" # datetime 포맷
    style = "%" # 로그레코드의 attribute를 가리키는 특수문자 스타일
)
```

|파라미터|설명|자료형|예시|
|---|---|---|---|
|`fmt`|로그 메시지 포맷. 로그 레코드를 이 포맷으로 변경한다.|str|"%(asctime)s - %(message)s"|
|`datefmt`|날짜 형식(포맷). 날짜를 표현해야 할 경우 이 포맷으로 표현한다.|str|"%Y-%m-%d"|
|`style`|로그레코드 attribute를 가리킬 때 사용하는 특수문자|str|"%"|
|`validate`|fmt, datefmt, style 매개변수가 유효한지 확인|bood|True|
|`defaults`|로그 레코드에 해당 attribute이 없을 때 사용하는 기본값|dict|{"username":"System"}|

### 로그 레코드 attribute 설명과 접근 방법  

| 포맷 필드 | 설명 |
| :--- | :--- |
| %(name)s | 로거(logging channel)의 이름 |
| %(levelno)s | 메시지의 숫자 로깅 레벨<br>(DEBUG, INFO, WARNING, ERROR, CRITICAL) |
| %(levelname)s | 메시지의 텍스트 로깅 레벨<br>("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL") |
| %(pathname)s | 로깅 호출이 발생한 소스 파일의 전체 경로 |
| %(filename)s | pathname에서 파일명 부분 |
| %(module)s | 파일명에서 모듈 이름 부분 |
| %(lineno)d | 로깅 호출이 발생한 소스 라인 번호 |
| %(funcName)s | 로깅 호출이 발생한 함수 이름 |
| %(created)f | LogRecord가 생성된 시간 (유닉스 시간) |
| %(asctime)s | LogRecord가 생성된 텍스트 형식의 시간 |
| %(msecs)d | 생성 시간의 밀리초 부분 |
| %(relativeCreated)d | 로깅 모듈 로드 시간을 기준으로 LogRecord가 생성된 상대 시간(밀리초) |
| %(thread)d | 스레드 ID |
| %(threadName)s | 스레드 이름 |
| %(taskName)s | 태스크 이름 (비동기 처리 시) |
| %(process)d | 프로세스 ID (PID) |
| %(processName)s | 프로세스 이름 |
| %(message)s | LogRecord가 방출될 때 계산되는 최종 메시지 내용 |

### 로그 레코드 attribute 접근 특수문자  

- `%`, `{`, `$` 중 하나.  


## Formatter 사용하기  

### 사용 예시  

```python
import logging

def about_formatter():
    
    # Logger 인스턴스 생성 및 설정
    logger_name = "about_formatter"
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.INFO)

    # Handler 인스턴스들 생성
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(level = logging.INFO)
    file_handler = logging.FileHandler(filename="logs/handler_log.log", mode="a", encoding="utf-8")
    file_handler.setLevel(logging.ERROR)
    
    # Formatter 생성
    stream_formatter = logging.Formatter(
        fmt="[%(levelname)s] %(asctime)s - %(message)s",
        datefmt="%Y-%m-%d"
    )
    file_formatter = logging.Formatter(
        fmt="[%(levelname)s] %(asctime)s [%(pathname)s] line %(lineno)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # Handler 에 Formatter 할당
    stream_handler.setFormatter(stream_formatter)
    file_handler.setFormatter(file_formatter)
    
    # Logger 에 Handler 할당
    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)
    
    # 로그 레코드 생성 및 핸들러에 전달
    logger.info("debug message")
    logger.error("error message")
    
    
if __name__ == "__main__":
    about_formatter()
```

```bash
# 콘솔로 출력된 로그
[INFO] 2025-11-04 - debug message
[ERROR] 2025-11-04 - error message
```

```bash
# 파일에 기록된 로그
[ERROR] 2025-11-04 00:28:05 [..생략../logging_06_formatter.py] line 36 - error message
```

## Reference  

[https://docs.python.org/3/library/logging.html](https://docs.python.org/3/library/logging.html)  
[https://docs.python.org/ko/3/howto/logging.html](https://docs.python.org/ko/3/howto/logging.html)  