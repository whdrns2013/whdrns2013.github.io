---
title: "[Python] print 출력 가로채기 : 표준 출력 리디렉션 redirection" # 제목 (필수)
excerpt: "print 출력을 로깅, 로그 수집, DB insert, 화면 출력으로 이용하기" # 서브 타이틀이자 meta description (필수)
date: 2026-10-18 20:33:00 +0900      # 작성일 (필수)
lastmod: 2026-10-18 20:33:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-10-18 20:33:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: Python 파이썬 print stdout stderr redirect_stdout contextlib StringIO 표준출력 출력 리다이렉션 리디렉션  로그 수집 캡처 로깅                     # 태그 복수개 가능 (필수)
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
  nav: 
pinned: 
series: 
series_index: 
---
<!--postNo: 20261018_001-->

# [Python] print 출력 가로채기 : 표준 출력 리디렉션 redirection

![](/assets/images/20261018_001_001.jpg)  

## Intro

### 1. 표준 출력을 가로채는 이유  

Python에서 가장 처음 배우는 함수, `print()`는 표준 출력을 지원한다. 이 **표준 출력 내용은 기본적으로 터미널에 표시**된다.  

```python
print("Hello")
```

```bash
Hello
```

하지만 프로그래밍을 하다 보면 출력 내용을 단순히 화면에 표시하는 것을 너머, 다른 방식으로 처리하고 싶을 때가 있다. 예를 들어 보자면 다음과 같다.  

| 활용 | 설명 |
|---|---|
| 로그 기록 | 출력 내용을 실행 로그로 저장 |
| 로그 전송 | 출력 내용을 서버나 외부 시스템으로 전달 |
| 테스트 | 특정 문자열이 출력되었는지 검증 |
| 출력 변환 | 출력 내용을 가공한 뒤 다른 형태로 처리 |
| 출력 억제 | 화면에는 출력하지 않고 내부에서만 처리 |

이러한 처리를 하기 위해서는 어떠한 처리를 해야할까? `print()` 함수 코드 자체를 수정하는 대신, **표준 출력의 흐름 자체를 빼올 수** 있다. 이를 **stdout 리다이렉션**이라고 하며, `contextlib.redirect_stdout()` 을 이용해 구현할 수 있다.  

이번 글에서는 표준 출력 리다이렉션 방법과 원리를 알아보고, 실습을 해보도록 한다.

### 2. 표준 출력 리다이렉션의 예시  

아직 표준 출력 리다이렉션에 대해 감이 잘 안잡힐 수 있으므로, 이해를 돕기 위한 예시를 살펴보자.  

#### Airflow  

Airflow는 미리 정의된 작업을 수행하는 Workflow Orchestrator이다. Airflow는 Airflow 서버에 정의된 작업을 별도 프로세스 혹은 독립된 컨테이너 상에서 수행할 수 있게 해준다. 이런 경우는 Airflow 서버와 작업의 프로세스가 서로 다르므로 당연히 표준 출력이 공유되지 않는다.  

하지만 워커에서 진행중인 작업의 진행 상황을 알 수 있어야 한다. 그러면 이를 어떻게 실현할 수 있을까? Airflow는 여기서 사용자가 서버에 미리 정의해둔 코드 내에 print() 되는 내용을 캡쳐한다. 그랬다가 Airflow 서버로 print() 되는 내용을 전송하여, Airflow 서버에서 실행 로그를 확인할 수 있게 한다.  

## 표준출력 리다이렉션 코드와 작동 원리  

### 1. 표준출력 리다이렉션 코드  

자 그러면 표준출력을 가로채 사용하는 코드 예시를 살펴보자. 우선은, 실행하려고 하는 코드가 아래와 같다고 해보자. 이 코드는 양의 숫자를 받아와서 1을 더한 뒤 반환한다.  

```python
def some_process(positive_number:int):
    print(f"프로세스 시작 input : {positive_number}")
    if positive_number < 0:
        raise ValueError(f"음수({positive_number})가 입력되었습니다.")
    positive_number += 1
    print(f"작업 완료. result : {positive_number}")
    print("프로세스 정상 종료")
    return positive_number
```

그 다음으로는 이 코드의 표준출력을 가로채는 코드를 작성해보도록 하겠다.  

```python
import io
import contextlib

buffer = io.StringIO()

with contextlib.redirect_stdout(buffer):
    some_process(1)

output = buffer.getvalue().split("\n")
print(len(output), output)
```

위 코드를 실행하면 아래와 같은 결과가 출력된다.  

```bash
4 ['프로세스 시작 input : 1', '작업 완료. result : 2', '프로세스 정상 종료', '']
```

즉, `some_process()` 함수 내부에서 여러 번 실행된 print의 출력은 화면에 표출되지 않고, 각각 buffer에 차례대로 기록된 것이다. 이후 `buffer.getvalue()` 를 통해 그동안 기록된 출력 내용을 한 번에 가져와서 사용할 수 있다. 이를 도식으로 표현해보면 아래와 같다.  

<pre class='mermaid'>
sequenceDiagram
    participant Function as some_process()
    participant Buffer as buffer
    participant GetValue as getvalue()

    Function->>Buffer: print("프로세스 시작 input : 1")
    Function->>Buffer: print("작업 완료. result : 2")
    Function->>Buffer: print("프로세스 정상 종료")

    GetValue->>Buffer: 누적된 출력 요청
    Buffer-->>GetValue: 전체 출력 문자열 반환
</pre>

### 2. stdout  

원리를 이해하기 위해 `stdout` 이 무엇인지부터 이해해보자. `stdout`은 **Standard Output, 즉 표준 출력**을 의미한다.

표준 출력이란 프로그램이 실행 중 만들어내는 일반적인 출력 데이터를 전달하기 위해 사용하는 기본 출력 통로다. 운영체제 수준에서 프로그램은 보통 다음과 같은 표준 스트림을 사용한다.

| 표준 스트림 | 의미 | 용도 |
|---|---|---|
| `stdin` | Standard Input | 프로그램이 입력을 받는 통로 |
| `stdout` | Standard Output | 일반적인 실행 결과를 출력하는 통로 |
| `stderr` | Standard Error | 오류나 진단 메시지를 출력하는 통로 |

그리고 Python에서는 이 표준 출력 스트림을 `sys.stdout` 객체를 통해 다룰 수 있으며, 일반적인 환경에서는 이 stdout이 터미널과 연결되어 있다.  

### 3. print  

Python의 `print()` 역시 기본적으로 `stdout`을 통해 문자열을 출력한다. 그리고 `stdout`은 기본적으로 터미널과 연결되어 있으므로, print() 함수를 사용하면 터미널에 출력되는 것이다.  

즉, print() 함수의 작동 원리는  

```python
print("Hello")
```

개념적으로는 다음 코드와 유사하다.

```python
import sys
sys.stdout.write("Hello\n")
```

즉, `print()`가 직접 터미널에 문자열을 표시하는 것이 아니라, 현재 `sys.stdout`이 가리키는 출력 대상으로 문자열을 전달하는 것이다.  

<pre class='mermaid'>
flowchart LR
    A[print]
    A --> B[sys.stdout]
    B --> C[터미널]
</pre>

### 4. stdout의 출력 대상  

여기서 중요한 점은 `stdout`의 출력 대상이 항상 터미널로 고정되어 있는 것은 아니라는 것이다. `sys.stdout`이 다른 객체를 가리키도록 변경하면 같은 `print()`를 사용하더라도 출력 내용을 다른 곳으로 전달할 수 있다.  

<pre class='mermaid'>
flowchart LR
    A[print]
    A --> B[sys.stdout]

    B --> C[터미널]
    B --> D[파일]
    B --> E[메모리 버퍼]
    B --> F[사용자 정의 출력 객체]
</pre>

이러한 특성을 이용해 기존 코드의 `print()`를 수정하지 않고도 출력 내용을 가로채 저장하거나, 전송하거나, 다른 방식으로 처리할 수 있는 것이다.

### 5. io.StringIO    

위 표준출력 리다이렉션 코드를 보면, `buffer` 라는 곳에 표준출력이 리다이렉션 되는 것을 볼 수 있다. 그리고 코드를 보면 이 buffer는 `StringIO` 라는 클래스의 인스턴스라는 것을 알 수 있다.  

```python
import io
buffer = io.StringIO()
```

`StringIO`는 **문자열을 메모리 안에서 파일처럼 다룰 수 있게 해주는 객체**다. 이와 대비해서 볼 수 있는 것은 File 객체로, 이는 데이터를 디스크에 쓴다는 점에서 차이가 있다.  

`StringIO`는 파일 객체와 비슷하게 `write()`를 제공하며, 이후 `getvalue()`를 호출하면 지금까지 저장된 전체 문자열을 가져올 수 있다.  

```python
import io

buffer = io.StringIO()

buffer.write("Hello")
buffer.write("\n")
buffer.write("World")

print(buffer.getvalue())
```

```bash
Hello
World
```

흐름을 도식화해보면 아래와 같다.  

<pre class='mermaid'>
sequenceDiagram
    participant Code as 코드
    participant Stdout as Stdout
    participant Buffer as StringIO

    Code->> Stdout: print("Hello")
    Stdout ->> Buffer: write("Hello")
    
    Code->> Stdout: print("\n")
    Stdout ->> Buffer: write("\n")
    
    Code->> Stdout: print("Python")
    Stdout ->> Buffer: write("Python")

    Code->>Buffer: getvalue()
    Buffer-->>Code: "Hello\nPython"
</pre>

`StringIO`가 표준출력 리다이렉션에 사용될 수 있는 이유도 바로 이 `write()` 때문이다.

앞에서 살펴본 것처럼 `print()`는 현재 `sys.stdout`이 가리키는 객체에 내용을 전달한다. 따라서 `sys.stdout`의 대상을 `StringIO`로 변경하면 `print()`의 출력이 터미널 대신 `StringIO`에 기록되는 것이다.  

따라서 표준출력 리다이렉션에서 `StringIO`는 **가로챈 출력 내용을 메모리에 받아두는 출력 대상**이라고 볼 수 있으며, 핵심적인 부분만 간추려보면, `StringIO`는 다음 역할을 한다.

| 기능 | 설명 |
|---|---|
| `write()` | 문자열을 메모리에 기록 |
| `getvalue()` | 지금까지 기록된 전체 문자열 반환 |
| 파일과 유사한 인터페이스 | 실제 파일 없이 메모리에서 문자열 처리 |
| stdout 출력 대상 | `redirect_stdout()`의 출력 대상으로 사용 가능 |

**다만 `StringIO`는 하나의 대표적인 출력 대상일 뿐**이다. `redirect_stdout()`은 **반드시 `StringIO`만 사용해야 하는 것은 아니며**, `write()`를 제공하는 다른 객체를 지정하면 파일 저장이나 실시간 로그 전송처럼 다른 동작도 구현할 수 있다.

### 6. contextlib  

`contextlib`은 Python에서 컨텍스트 매니저 관련 기능을 제공하는 표준 라이브러리 모듈이다. 쉽게 말해 **with 문으로 어떤 작업을 시작할 때 설정하고, 끝날 때 자동으로 원상복구하는 패턴을 만들거나 사용할 때 쓰는 도구**다.  

이번 글에서는 `contextlib.redirect_stdout`을 사용하고 있는데, 이는 표준출력을 가로채 리다이렉션할 수 있게 해주는 역할을 한다.  

```python
import contextlib
with contextlib.redirect_stdout(buffer):
    print("Hello")
```

이 때 redirect_stdout은 with 블록이 실행되는 동안 `sys.stdout`의 목적지를 인수로 받은 `buffer`로 변경하는 역할을 하게 된다. 이 변경 사항은 with 블록 안에서만 유지되며, with 블록이 끝나면 `sys.stdout`은 원래 대상으로 자동 복구된다.  

contextlib에는 redirect_stdout() 외에도 다음과 같은 기능들이 있다.  

| 기능 | 역할 |
|---|---|
| `redirect_stdout()` | 표준 출력 대상 변경 |
| `redirect_stderr()` | 표준 에러 출력 대상 변경 |
| `contextmanager` | 함수로 컨텍스트 매니저 작성 |
| `suppress()` | 특정 예외 무시 |
| `closing()` | 객체를 사용한 뒤 자동으로 `close()` |


## 더 깊이 이해해보기  

원리를 파악했으니, 이제 응용 범위를 넓히기 위해 더 깊이 이해해보자  

### 1. 호출된 함수 뿐만 아니라 그 안의 함수도 적용된다.  

with 컨텍스트 매니저와 redirect_stdout 을 통해 표준 출력 리다이렉션을 구현할 경우, **with 구문 안에 있는 함수 뿐만 아니라 그 함수 안에 사용되는 함수들에 정의된 표준출력들까지도 모두 리다이렉션**된다.  

이는 당연한 게, `redirect_stdout()` 은 표준출력의 목적지를 자신이 받은 인자로 돌리는 역할을 하며, `with` 구문은 그 설정이 자신의 블록 내에서 유지되도록 한다. 즉, **동일한 stdout 을 사용하는 함수라면, 그 목적지가 모두 변경되는 것**이다.  

```python
def sub_process():
    print("하위 작업을 실행합니다.")

def process(message: str) -> str:
    print("처리를 시작합니다.")
    sub_process()
    print(f"처리 메시지: {message}")
    return message.upper()

buffer = io.StringIO()
with contextlib.redirect_stdout(buffer):
    result = process("hello")

print([f"{i} : {p}" for i, p in enumerate(buffer.getvalue().split('\n'), 1)])
```

```bash
['1 : 처리를 시작합니다.', '2 : 하위 작업을 실행합니다.', '3 : 처리 메시지: hello', '4 : ']
```

즉, 중요한 기준은 **어떤 함수에서 출력했는가가 아니라, 리다이렉션이 적용된 실행 구간에서 stdout 출력이 발생했는가**이다.

### 2. 실시간 처리  

`redirect_stdout()` 은 출력 내용을 반드시 `StringIO`에 모아야 하는 것은 아니다. stdout의 목적지는 `write()`를 제공하는 객체라면 어떤 것이든 지정할 수 있다. 이것을 응용하면 `print()` 의 결과를 모아서 한 번에 처리하는게 아니라, 발생할 때마다 원하는 작업을 실시간으로 처리하도록 할 수 있다.  

아래는 print 문자열을 로그파일에 실시간으로 기록하는 예시이다.  

```python
import time

def some_process(positive_number:int):
    '''실행할 대상 함수 : time.sleep으로 인터벌을 둬서 실시간 여부 확인'''
    time.sleep(2)
    print(f"Start Process input : {positive_number}")
    time.sleep(1)
    if positive_number < 0:
        raise ValueError(f"negative ({positive_number}) is inputted")
    positive_number += 1
    time.sleep(1)
    print(f"job done. result : {positive_number}")
    time.sleep(1)
    print("Process Exit")
    return positive_number

class LogRecorder:
    '''문자열을 파일에 기록하는 객체'''

    def __init__(self, log_file_path:str):
        self.path = log_file_path

    def record(self, message:str):
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(message)

    def write(self, message:str):
        self.record(message)

    def flush(self):
        pass

lr = LogRecorder("./test_log.log")

import io
from contextlib import redirect_stdout

with redirect_stdout(lr):
    some_process(1)
```

위 코드를 실행시킨 뒤, 로그파일을 tail과 같은 실시간 출력 명령어로 확인해보면 아래와 같이 실시간으로 처리됨을 확인할 수 있다.


당연하지만 이러한 실시간 처리는 꼭 파일에만 적용되는 것은 아니며, 외부로 로그를 전송하거나 특정 작업을 실시간으로 처리할 때에도 사용할 수 있다.

### 3. 표준에러  

Python에는 일반 출력인 `stdout` 외에도 오류나 진단 메시지를 위한 `stderr`가 있다. 표준 출력과 비슷하게 문자열을 지정된 채널로 전송하는 역할을 하나 두 가지가 다르다.  

- 전송하는 문자열이 "오류" 또는 "진단 메시지"임
- 기본 전송 대상이 일반 출력 스트림이 아닌 "오류 출력 스트림" 임  

`stderr` 역시 `contextlib.redirect_stderr()`를 사용하여 다른 대상으로 리다이렉션할 수 있으며, **표준출력과 표준에러를 동시에 리다이렉트 할 수**있다.  

```python
# 실행할 함수
def some_process(positive_number:int):
    print(f"Start Process input : {positive_number}")
    if positive_number < 0:
        raise ValueError(f"negative ({positive_number}) is inputted")
    positive_number += 1
    print(f"job done. result : {positive_number}")
    print("Process Exit")
    return positive_number
```

```python
# 표준출력과 표준에러를 모두 리다이렉트
import contextlib
import traceback
import io

buffer = io.StringIO()

with contextlib.redirect_stdout(buffer), \
     contextlib.redirect_stderr(buffer):
    try:
        some_process(-1)
    except Exception:
        traceback.print_exc()

print(buffer.getvalue())
```

```bash
Start Process input : -1
Traceback (most recent call last):
  File "C:\Users\USER\AppData\Local\Temp\ipykernel_...\....py", line 10, in <module>
    some_process(-1)
    ~~~~~~~~~~~~^^^^
  File "C:\Users\USER\AppData\Local\Temp\ipykernel_...\....py", line 4, in some_process
    raise ValueError(f"negative ({positive_number}) is inputted")
ValueError: negative (-1) is inputted
```

## 활용 확장  

### 1. 공통 함수로 만들기  

여러 함수의 출력을 일괄적으로 수집해야 한다면 리다이렉션 로직을 공통 함수로 만들 수 있다.

```python
import io
import contextlib


def capture_output(func, *args, **kwargs):
    buffer = io.StringIO()

    with contextlib.redirect_stdout(buffer):
        result = func(*args, **kwargs)

    return result, buffer.getvalue()
```

다음과 같이 사용할 수 있다.

```python
result, output = capture_output(process, "hello")
```

## 표준 출력 리다이렉션 활용하기  

stdout을 가로챈 이후에는 목적에 따라 다양한 처리를 할 수 있다.  

### 1. 로그로 저장

```python
with contextlib.redirect_stdout(buffer):
    result = process("hello")

log = buffer.getvalue()

save_log(log)
```

함수 실행이 끝난 뒤 전체 출력을 하나의 로그로 저장할 수 있다.

---

### 2. 외부 시스템으로 일괄 전송

```python
with contextlib.redirect_stdout(buffer):
    result = process("hello")

send_log(buffer.getvalue())
```

HTTP API, 메시지 큐, 로그 수집 서버 등에 실행 결과 전체를 전송할 수 있다.

---

### 3. 외부 시스템으로 실시간 전송

```python
class LogSender:
    def write(self, message):
        if message.strip():
            send_log(message)

    def flush(self):
        pass

with contextlib.redirect_stdout(LogSender()):
    process("hello")
```

출력이 발생할 때마다 바로 외부 시스템으로 전달하는 방식도 가능하다.

---

### 4. 실행 결과와 함께 관리

```python
with contextlib.redirect_stdout(buffer):
    result = process("hello")

execution = {
    "result": result,
    "output": buffer.getvalue(),
}
```

함수 반환값과 stdout 출력을 서로 구분한 상태로 관리할 수 있다.

---

### 5. 테스트에서 검증

```python
with contextlib.redirect_stdout(buffer):
    process("hello")

assert "처리를 시작합니다." in buffer.getvalue()
```

특정 코드가 예상한 내용을 출력했는지 검증할 수도 있다.

stdout 리다이렉션의 핵심은 출력을 저장하는 것 자체가 아니라, **기존 출력 흐름을 다른 대상으로 연결해 필요한 동작을 수행할 수 있게 만드는 것**이다.

---

## 주의사항  

- redirect_stdout은 실행 구간 동안 `sys.stdout`을 다른 객체로 변경하므로, 멀티스레딩 환경(동일 프로세스에서 여러 스레드가 실행되고 있는 경우)에는 설정 충돌을 조심해야 한다.
- StringIO는 메모리에 문자열을 저장한다. 따라서 StringIO를 사용할 경우에는 적절히 쌓인 문자열을 비워주어야 한다.

## 정리

- Python의 `print()`는 문자열을 직접 터미널에 출력하는 것이 아니라 `sys.stdout`이 가리키는 출력 대상의 `write()`를 통해 데이터를 전달한다.  

<pre class='mermaid'>
flowchart LR
    A[Python 코드]
    A -->|print| B[sys.stdout]

    B --> C[기본: 터미널]
    B -->|redirect| D[다른 출력 대상]

    D --> E[StringIO]
    D --> F[파일]
    D --> G[커스텀 객체]

    E --> H[출력 누적]
    F --> I[파일 기록]
    G --> J[전송 / 가공 / 필터링]
</pre>

- `contextlib.redirect_stdout()`을 사용하면 특정 코드가 실행되는 동안 `stdout`의 목적지를 일시적으로 변경할 수 있다.  
- 또한 `redirect_stdout()`은 특정 함수 하나의 `print()`만 가로채는 것이 아니다. 리다이렉션이 적용된 실행 구간 안에서 호출되는 함수들이 동일한 `sys.stdout`을 사용한다면 여러 단계 아래에서 발생한 출력도 함께 가로챌 수 있다.  
- 출력을 처리하는 방식은 리다이렉션 대상에 따라 달라진다.  

> **stdout 리다이렉션은 기존 코드가 발생시키는 표준 출력의 흐름을 다른 출력 대상으로 전환하는 방법이며, 실제로 저장할지, 모아서 처리할지, 즉시 전송할지는 그 출력 대상의 `write()` 구현이 결정한다.**

## Reference  

[https://docs.python.org/ko/3.14/library/contextlib.html#contextlib.redirect_stdout](https://docs.python.org/ko/3.14/library/contextlib.html#contextlib.redirect_stdout)  
[https://docs.python.org/ko/3/library/sys.html](https://docs.python.org/ko/3/library/sys.html)  
[https://docs.python.org/ko/3.14/library/io.html](https://docs.python.org/ko/3.14/library/io.html)  
[https://docs.python.org/ko/3.14/library/traceback.html](https://docs.python.org/ko/3.14/library/traceback.html)  
[https://docs.python.org/ko/3.14/library/contextlib.html](https://docs.python.org/ko/3.14/library/contextlib.html)