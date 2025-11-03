---
title: "[파이썬-logging] 07. LogRecord" # 제목 (필수)
excerpt: "파이썬 logging 라이브러리의 데이터 패키지" # 서브 타이틀이자 meta description (필수)
date: 2025-11-04 01:00:00 +0900      # 작성일 (필수)
lastmod: 2025-11-04 01:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-04 01:00:00 +0900   # 최종 수정일 (필수)
categories: Python      # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 로깅 로그 logging log logrecord record 로그레코드 레코드 데이터 패키지                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251104_007-->


## LogRecord(로그 레코드)  

### 역할  

- 로깅 이벤트에 대한 모든 정보를 담고 있는 객체  
- 역할 : Logger, Handler, Formatter 사이를 이동하는 데이터 패키지 역할  

### 주요 기능  

- 메시지 텍스트, 로깅 레벨, 타임스탬프, 파일명, 라인 번호 등 모든 관련 컨텍스트 정보를 포함한다.

### LogRecord 의 속성(attributes)  

| 속성명 | 설명 | 포맷터 필드 |
| :--- | :--- | :--- |
| `msg` | 개발자가 전달한 원래의 로그 메시지 포맷 문자열 (인수가 치환되기 전) | %(message)s |
| `message` | 인수가 치환되어 완성된 최종 로그 메시지 문자열 | %(message)s |
| `levelname` | 로그의 레벨 이름 (예: INFO, ERROR, DEBUG) | %(levelname)s |
| `levelno` | 로그의 숫자 레벨 (예: 20은 INFO) | %(levelno)s |
| `name` | 메시지를 생성한 로거의 이름 | %(name)s |
| `asctime` | 로그가 생성된 시간 (사람이 읽을 수 있는 형식) | %(asctime)s |
| `filename` | 로깅 호출이 발생한 소스 파일 이름 | %(filename)s |
| `lineno` | 로깅 호출이 발생한 라인 번호 | %(lineno)s |
| `pathname` | 로깅 호출이 발생한 소스 파일의 전체 경로 | %(pathname)s |
| `funcName` | 로깅 호출이 발생한 함수 이름 | %(funcName)s |
| `process` | 현재 프로세스의 ID | %(process)s |
| `threadName` | 현재 스레드의 이름 | %(threadName)s |



## LogRecord 살펴보기  

### 예시 코드  

```python
import logging
import time

# LogRecord를 직접 처리하는 커스텀 핸들러 정의
class CustomLogRecordHandler(logging.Handler):
    def emit(self, record):
        # LogRecord의 모든 속성을 반복하여 출력
        for attr, value in record.__dict__.items():
            if attr == 'created':
                readable_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(value))
                print(f"[{attr:<15}] : {value} (Readable: {readable_time})")
            else:
                print(f"[{attr:<15}] : {value}")
        if self.formatter:
            print(f"[Formatted Output]: {self.format(record)}")

def inspect_log_record():
    # 로거 인스턴스 생성 및 설정
    logger_name = "log_record_inspector"
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    logger.propagate = False

    # 커스텀 핸들러 인스턴스 및 포매터 생성 및 설정
    custom_handler = CustomLogRecordHandler()
    custom_formatter = logging.Formatter(
        fmt="[%(levelname)s][%(name)s:%(lineno)d] -> %(message)s",
        datefmt="%H:%M:%S"
    )
    custom_handler.setFormatter(custom_formatter)
    logger.addHandler(custom_handler)
    
    # 로깅 메시지 생성 (LogRecord 생성 유발)
    logger.warning("로깅 레코드의 모든 속성을 확인합니다.")
    logger.info(
        "커스텀 데이터 포함", 
        extra={"user_id": 42, "session_key": "abc123xyz"}
    )
    
if __name__ == "__main__":
    inspect_log_record()
```

```bash
# 출력
[exc_text       ] : None
[stack_info     ] : None
[lineno         ] : 35
[funcName       ] : inspect_log_record
[created        ] : 1762184218.248369 (Readable: 2025-11-04 00:36:58)
[msecs          ] : 248.0
[relativeCreated] : 0.7219314575195312
[thread         ] : 8423376896
[threadName     ] : MainThread
[processName    ] : MainProcess
[process        ] : 11691
[taskName       ] : None
[user_id        ] : 42
[session_key    ] : abc123xyz
[Formatted Output]: [INFO][log_record_inspector:35] -> 커스텀 데이터 포함
```

## Reference  

[https://docs.python.org/3/library/logging.html](https://docs.python.org/3/library/logging.html)  
[https://docs.python.org/ko/3/howto/logging.html](https://docs.python.org/ko/3/howto/logging.html)  