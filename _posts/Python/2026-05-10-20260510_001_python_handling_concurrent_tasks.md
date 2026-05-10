---
title: "[Python] 파이썬에서 여러 작업을 동시에 처리하는 방법" # 제목 (필수)
excerpt: "비동기(asynchronous), 스레딩(threading), 멀티프로세싱(multiprocessing)" # 서브 타이틀이자 meta description (필수)
date: 2026-05-10 09:32:00 +0900      # 작성일 (필수)
lastmod: 2026-05-10 09:32:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-05-10 09:32:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 비동기 스레딩 멀티프로세싱 멀티 async asynchronous threading multiprocessing multi processing 여러 작업 병렬 동시 효율 동기
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
series: python-handling-concurrent-tasks
series_index: 1
---
<!--postNo: 20260510_001-->

## 파이썬에서의 다중 작업 처리

### (1) 다중 작업 처리 방식

파이썬에서의 다중 작업 처리 방식은 크게 3가지로 정리할 수 있다. `asyncio`, `threading`, `multiprocessing` 이 바로 그것이다.  

<br>

#### a. asyncio

파이썬에서 비동기 처리를 할 때 가장 대표적으로 사용하는 방식이다. `async` 와 `await` 키워드를 사용해 하나의 스레드 안에서 여러 작업을 번갈아 처리하게 된다.  

주로 API 요청, 파일 I/O, DB 조회, 타이머 처럼 기다리는 시간이 많은 작업에 적합하다. 하지만, CPU bound 작업에서는 적합하지 않다.  

```python
import asyncio

async def main():
    await asyncio.sleep(1)
```

<br>

#### b. threading

여러 개의 스레드를 만들어 작업을 동시에 처리하는 방식이다. 네트워크 요청처럼 기다리는 시간이 많은 작업에는 유효하지만, CPU를 많이 쓰는 작업에는 한계가 있다.  

```python
import threading

thread = threading.Thread(target=work)
thread.start()
```

<br>

#### c. multiprocessing

여러 개의 프로세스를 만들어 병렬로 처리하는 방식이다. CPU 연산이 많은 작업에 적합하다.  

```python
import multiprocessing

process = multiprocessing.Process(target=work)
process.start()
```

<br>

### (2) asyncio

`asyncio` 는 파이썬에서 비동기 프로그래밍을 구현할 때 사용하는 대표적인 방식이다. `async`, `await` 키워드를 사용하며 하나의 스레드 안에서 여러 작업을 번갈아 실행하게 된다.  

주의할 점은, `asyncio` 가 여러 작업을 “진짜 동시에”실행하는 방식은 아니라는 것이다. 하나의 작업이 네트워크 응답이나 타이머처럼 기다리는 상태가 되면, 그 시간 동안 다른 작업을 실행하게 된다. 즉, **기다리는 시간을 낭비하지 않도록 실행 흐름을 바꿔가며 처리하는 방식**이 바로 `asyncio` 의 정체이다.  

예를 들어 여러 API에 요청을 보내야 한다고 해보자. 동기 방식이라면 첫 번째 API 응답을 기다린 뒤, 두 번째 요청을 보내고, 다시 응답을 기다린 뒤 세 번째 요청을 보내게 된다. 반면 `asyncio` 를 사용하면, 여러 요청을 먼저 보내두고, 응답이 오는 동안 다른 작업을 처리할 수 있다.  

따라서 `asyncio` 는 주로 I/O 작업에 적합하다.  

```
asyncio 가 적합한 작업  
- API 요청, 웹 크롤링, 데이터베이스 조회, 타이머 처리, 파일 읽기/쓰기(비동기 라이브러리 사용시)
```

`asyncio` 를 사용할 때 주의할 점이 있는데, 바로 **함수가 비동기 방식으로 작성되어야 한다는 점**이다. 아래에 동기 함수와 asyncio를 사용한 비동기 함수를 비교해보자.  

```python
import asyncio
import time

start = time.time()

def log(msg):
    print(f"{time.time() - start:4.1f}초 :: {msg}")

async def fetch_data(name, delay):
    log(f"{name} 요청 시작")
    await asyncio.sleep(delay)
    log(f"{name} 요청 완료")
    return f"{name} 결과"

async def main():
    results = await asyncio.gather(
        fetch_data("작업 A", 2),
        fetch_data("작업 B", 2),
        fetch_data("작업 C", 2),
    )

    log(f"최종 결과: {results}")

asyncio.run(main())
```

```bash
# 실행 결과
0.0초 :: 작업 A 요청 시작
0.0초 :: 작업 B 요청 시작
0.0초 :: 작업 C 요청 시작
2.0초 :: 작업 A 요청 완료
2.0초 :: 작업 B 요청 완료
2.0초 :: 작업 C 요청 완료
2.0초 :: 최종 결과: ['작업 A 결과', '작업 B 결과', '작업 C 결과']
```

이처럼 `asyncio` 를 사용할 때에는 함수를 정의하고 사용할 때 비동기 방식으로 작성해야하며, 따라서 사용하는 라이브러리도 비동기 처리를 지원해야 원하는 효과를 볼 수 있다.

<br>

### (3) threading

`threading` 은 **여러 개의 스레드를 만들어 작업을 나누어 처리하는 방식**이다.  

스레드는 하나의 프로세스 안에서 실행되는 작업 단위라고 볼 수 있는데, `asyncio` 가 하나의 스레드 안에서 작업을 번갈아 처리한다면, `threading` 은 여러 스레드가 각각의 작업을 맡아 실행하게 된다. 그래서 코드 형태만 보면 여러 작업이 동시에 실행되는 것처럼 보인다.  

예를 들어 파일을 다운로드하면서 동시에 로그를 남기거나, 사용자 입력을 기다리면서 백그라운드 작업을 처리하는 상황에서 사용할 수 있다.  

또한 `threading` 은 `asyncio` 에 비해 장점이 하나 있는데, 기존에 작성된 동기 함수를 크게 바꾸지 않고 병렬처리를 할 수 있다는 점이다.  

```python
import time
from concurrent.futures import ThreadPoolExecutor

start = time.time()

def log(msg):
    print(f"{time.time() - start:4.1f}초 :: {msg}")

def fetch_data(name, delay):
    log(f"{name} 요청 시작")
    time.sleep(delay)
    log(f"{name} 요청 완료")
    return f"{name} 결과"

def main():
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [
            executor.submit(fetch_data, "작업 A", 2),
            executor.submit(fetch_data, "작업 B", 2),
            executor.submit(fetch_data, "작업 C", 2),
        ]

        results = [future.result() for future in futures]

    log(f"최종 결과: {results}")

main()
```

```bash
# 실행 결과
0.0초 :: 작업 A 요청 시작
0.0초 :: 작업 B 요청 시작
0.0초 :: 작업 C 요청 시작
2.0초 :: 작업 C 요청 완료
2.0초 :: 작업 B 요청 완료
2.0초 :: 작업 A 요청 완료
2.0초 :: 최종 결과: ['작업 A 결과', '작업 B 결과', '작업 C 결과']
```

하지만 파이썬에서의 `threading` 에서는 한계점이 있는데, 바로 GIL(Global Interpreter Lock)이다. 이는 CPU 연산을 하는 파이썬 바이트코드를 어느 한 스레드가 실행할 때, 다른 스레드는 해당 코드에 접근하지 못하도록 막는 안전장치이다. 이 때문에 파이썬에서는 여러 스레드가 있어도, CPU 연산을 수행하는 파이썬 바이트코드는 한 번에 하나의 스레드만 실행할 수 있다.  

이 때문에 파이썬의 multithreading 은 기대만큼 성능 향상 효과를 보지 못하는 경우가 있었지만, 파이썬 3.13 버전부터는 이런 GIL을 비활성화하는 별도 빌드가 배포되었고, 3.14부터는 정식으로 도입되었다.  

<br>

### (4) multiprocessing

`multiprocessing` 은 여러 개의 프로세스를 만들어 작업을 병렬로 처리하는 방식이다.  

프로세스는 각각 독립된 메모리 공간을 가진 실행 단위를 가리킨다. 따라서 여러 개의 프로세스를 실행시키는 `multiprocessing` 은 `threading` 과 달리 여러 프로세스가 각자의 파이썬 인터프리터와 메모리 공간을 가지고 실행된다. 따라서 하나의 GIL을 여러 작업이 공유하지 않아 CPU를 많이 사용하는 작업에서는 `threading` 보다 더 적합한 경우가 많다.  

예를 들어 대용량 이미지 처리, 영상 인코딩, 복잡한 수치 계산, 머신러닝 전처리처럼 계산량이 많은 작업을 여러 프로세스로 나누어 처리할 수 있다. 각 프로세스가 별도로 작업을 수행하기 때문에 여러 CPU 코어를 더 적극적으로 활용할 수 있는 것이다.  

```python
import time
from concurrent.futures import ProcessPoolExecutor

start = time.time()

def fetch_data(args):
    name, delay = args
    print(f"{name} 요청 시작")
    time.sleep(delay)
    print(f"{name} 요청 완료")
    return f"{name} 결과"

def main():
    tasks = [
        ("작업 A", 2),
        ("작업 B", 2),
        ("작업 C", 2),
    ]

    with ProcessPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(fetch_data, tasks))

    print(f"최종 결과: {results}")

if __name__ == "__main__":
    main()
```

```bash
# 실행 결과
0.0초 :: 작업 A 요청 시작
0.0초 :: 작업 B 요청 시작
0.0초 :: 작업 C 요청 시작
2.0초 :: 작업 C 요청 완료
2.0초 :: 작업 B 요청 완료
2.0초 :: 작업 A 요청 완료
2.0초 :: 최종 결과: ['작업 A 결과', '작업 B 결과', '작업 C 결과']
```

하지만 장점만 있는 것은 아니다. 프로세스는 스레드보다 생성 비용이 크고, 각 프로세스가 독립된 메모리 공간을 사용하기 때문에 데이터를 주고받는 과정도 더 복잡한다. 작업 간에 공유해야 하는 데이터가 많다면 오히려 관리 비용이 커질 수도 있는 것이다.  

따라서 `multiprocessing` 은 단순히 “여러 작업을 동시에 하고 싶다”는 이유만으로 사용하기에는 과할 수 있으며, 실제로 CPU 연산이 오래 걸리거나 작업을 독립적으로 나눌 수 있을 때 효과적인 방식이다.  

정리하면, `multiprocessing` 은 **CPU를 많이 사용하는 작업을 여러 코어로 병렬 처리하고 싶을 때 적합한 방식**이라고 할 수 있다.  

## 마무리

세 방식은 모두 여러 작업을 효율적으로 처리하기 위한 도구이다. 하지만 해결하려는 문제, 목적은 조금씩 다르다.  

`asyncio` 는 기다리는 시간을 줄이는 데 초점이 있다. 하나의 스레드 안에서 작업을 번갈아 실행하며, 네트워크 요청처럼 대기 시간이 많은 작업을 처리하는 데 적합하다.  

`threading` 도 I/O 작업에 적합하다. 다만 `asyncio` 처럼 코드를 비동기 함수로 바꾸지 않아도, 기존 동기 함수를 여러 스레드에서 실행할 수 있다는 장점이 있다.  

`multiprocessing` 은 CPU 연산을 병렬로 처리하는 데 적합한다. 여러 프로세스를 사용하므로 자원 경쟁의 영향을 덜 받고, 여러 CPU 코어를 활용할 수 있으므로 자원 사용성을 높일 수 있다.  

표로 정리해보면 아래와 같다.  

| 방식 | 실행 단위 | 적합한 작업 | 특징 |
| --- | --- | --- | --- |
| **asyncio** | 하나의 스레드 | I/O 대기 작업 | `async` / `await` 기반 |
| **threading** | 여러 스레드 | I/O 대기 작업 | 기존 동기 코드와 함께 쓰기 좋음 |
| **multiprocessing** | 여러 프로세스 | CPU 연산 작업 | 여러 CPU 코어 활용 가능 |