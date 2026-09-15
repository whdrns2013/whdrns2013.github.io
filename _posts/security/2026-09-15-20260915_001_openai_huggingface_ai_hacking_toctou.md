---
title: "OpenAI HuggingFace 해킹 사건 7. TOCTOU의 개념과 이를 이용한 에이전트들의 Artifactory 장악 사례 살펴보기" # 제목 (필수)
excerpt: "상태 변화와 처리 순서가 만든 보안 문제" # 서브 타이틀이자 meta description (필수)
date: 2026-09-15 01:41:00 +0900      # 작성일 (필수)
lastmod: 2026-09-15 01:41:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-09-15 01:41:00 +0900  # 최종 수정일 (필수)
categories: security       # 다수 카테고리에 포함 가능 (필수)
tags: OpenAI 허깅페이스 Hugging Face HuggingFace AI 에이전트 agent 자율형 해킹 hacking TOCTOU time of check to use race condition 자원 경쟁 race window 원자성 atomic 상태변경 CVE-2026-65617
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
series: openai_huggingface_hacking
series_index: 7
---

<!--postNo: 20260915_001-->

![](/assets/images/20260915_001_001.jpg)  

TOCTOU(Time Of Check To Time Of Use) 의 개념은 단순하고 명확하다. 사용하려는 어떤 **자원의 상태를 확인한 시점과 실제로 사용하는 시점 사이에는 시간 차이가 존재하며, 그 사이 대상의 상태가 달라질 수 있다는 것**이다.  

이번 글에서는 TOCTOU가 무엇인지부터 시작해 실제 사례를 살펴보도록 하겠다. 또한 Race Condition과의 관계를 살펴보고, 간단한 실습을 통해서 직접 동작을 확인해보려 한다. 마지막으로, OpenAI HuggingFace 해킹 사건에서 TOCTOU가 어떤 형태로 등장했는지 살펴보자.

## TOCTOU란 무엇일까

TOCTOU(Time Of Check To Time Of Use)는 **자원의 상태를 확인한 시점(Check)과 실제로 사용하는 시점(Use) 사이에 상태가 변경되어, 검사 결과와 실제 사용 상태가 달라지는 문제**를 말한다.

프로그램은 보통 작업 전에 대상의 상태를 확인하곤 한다. 예를 들어 파일이 존재하는지 여부, 접근 권한, 경로의 안전성, 데이터의 현재 값 등을 검사한 뒤 실제 작업을 수행하는 것이다. 문제는 확인(check)과 작업(use) 두 단계가 하나의 원자적 연산이 아닐 경우, 그 사이에 다른 프로세스나 악의적인 공격자의 개입에 의해 대상의 상태를 바꿀 수 있다는 점이다.

<pre class="mermaid">
sequenceDiagram
    participant Program
    participant Resource
    participant Attacker as Other Process / Attacker

    Program->>Resource: Check
    Resource-->>Program: 현재 상태는 안전함

    Attacker->>Resource: 상태 변경

    Program->>Resource: Use
    Resource-->>Program: 변경된 상태의 자원 사용
</pre>

TOCTOU가 문제가 되는 경우의 핵심은 **Check의 결과가 Use 시점에도 여전히 유효하다고 가정하지만, 실제로는 그 상태가 보장되지 않을 수 있다는 것**이다.

즉, TOCTOU는 다음 조건이 함께 존재할 때 성립한다.  

| 조건                   | 설명                                |
| -------------------- | --------------------------------- |
| Check와 Use가 분리되어 있음  | 검사와 실제 사용이 서로 다른 시점에 수행됨          |
| 대상 상태가 변경 가능함        | 두 시점 사이에 파일·권한·값·참조 대상 등이 바뀔 수 있음 |
| 변경을 통제하지 못함          | 다른 프로세스·스레드·사용자 등이 중간에 개입할 수 있음   |
| 기존 Check 결과를 그대로 신뢰함 | Use 시점에 상태가 동일한지 보장하거나 다시 검증하지 않음 |

따라서 TOCTOU는 특정 파일 시스템 취약점만을 의미하는 게 아니다. 파일, 권한, 데이터베이스 값, 네트워크 주소처럼 **검사 이후 상태가 변경될 수 있는 자원을 대상으로 Check와 Use가 분리되어 있다면** 구조적으로 TOCTOU의 문제가 발생할 수 있다.

## TOCTOU의 유형

대표적인 유형을 몇 가지 살펴보자.

| 유형       | Check           | Use       | 불일치를 유발하는 사건           |
| -------- | --------------- | --------- | ----------------------- |
| 파일 접근    | 파일의 권한·상태 확인    | 파일 열기·수정  | 파일 또는 경로가 다른 대상으로 변경    |
| 임시 파일 생성 | 파일 존재 여부 확인     | 파일 생성·쓰기  | 다른 프로세스가 같은 경로를 선점      |
| 데이터베이스   | 데이터 존재 여부 확인    | 데이터 추가    | 다른 요청이 먼저 데이터 생성        |
| 권한 검사    | 사용자 권한 확인       | 보호된 작업 수행 | Check 이후 권한 또는 대상 상태 변경 |
| 네트워크 요청  | URL·IP가 안전한지 확인 | 실제 요청 전송  | DNS 응답이나 대상 주소 변경       |


### 1. 파일 권한 확인 후 파일 열기

첫 번째로 살펴볼 유형은 대표적인 TOCTOU 유형으로 꼽히는 파일 접근의 경우이다. 코드 파일 하나를 예시로 들어보자.  

```c
void write_file(const char *text) {
  if (access("/tmp/data", W_OK) == 0) {
      int fd = open("/tmp/data", O_WRONLY | O_APPEND);
      if (fd != -1) {
          write(fd, text, strlen(text));
          close(fd);
      }
  }
}
```

`access()`는 현재 사용자가 `/tmp/data`에 쓸 수 있는지 확인하고, `open()`은 실제로 해당 경로의 파일을 연다. 문제는 두 함수가 서로 독립된 시스템 호출이라는 점이다. 즉, 시간차에 의해 두 함수가 각각 검사한 파일과 실제로 연 파일이 달라질 수 있다.  

파일에 대한 TOCTOU를 악용하는 한 가지 공격 시나리오를 가정해보자.  

- 높은 권한을 가진 프로그램이 사용자가 입력한 내용을 `/tmp/data`에 기록하는 함수가 존재함  
- 공격자는 이 서버의 SSH 로그인을 해 서버 내 자원을 탈취하고자 함.  
- 이를 위해 `/root/.ssh/authorized_keys` 에 접근해서 자신의 SSH Key를 추가하고자 함  
- 일반 사용자 권한으로는 원래 `/root/.ssh/authorized_keys`를 수정하지 못함  

이 때, 공격자가 `write_file` 함수에 자신의 SSH Key를 입력으로 보내면서, `access`와 `open` 사이에 `/tmp/data`를 `/root/.ssh/authorized_keys` 파일을 가리키는 심볼릭 링크로 교체한다면, 공격자의 의도대로 SSH Key가 authorized_keys 파일에 쓰여질 것이다.  

| 시점           | 동작                            | /tmp/data 파일 |
| ------------ | ----------------------------- | --- |
| Check        | `/tmp/data`에 접근 가능한지 확인       | /tmp/data |
| State Change | 공격자가 `/tmp/data`가 가리키는 대상을 변경 | authorized_keys |
| Use          | `/tmp/data`를 다시 열어 사용         | authorized_keys |

이해를 돕기 위한 흐름도는 다음과 같다.

이 취약점은 이후 `CVE-2026-65617`로 NIST의 vulnerability DB에 **Artifactory의 Package Handling 과정에서 발생하는 역직렬화 취약점**으로 등록됐다. 즉, TOCTOU는 OpenAI 에서 이 공격의 처리 순서 설명 중 이해를 돕기 위해 말한 것이며, 실제 취약점은 **검증되지 않은 Ruby 객체의 역직렬화** 라고 해야 정확할 것 같다.  

이번 해킹 사례는 전형적인 TOCTOU와 다르기는 하나, **프로그램이 어떤 대상을 검증한 시점과 실제로 사용하는 시점의 원자성이 보장되지 않았다**는 점에서 공통적이다.

<pre class="mermaid">
sequenceDiagram
  participant Attacker
  participant Program
  participant file_a as /tmp/data
  participant authorized_keys

  Attacker ->> Program: write_file(SSH_KEY)
  Program ->> file_a: access(W_OK)
  file_a -->> Program: Writable
  
  Attacker ->> file_a: authorized_keys 를 가리키는 심볼릭 링크로 교체

  Program ->> file_a: open()
  file_a ->> authorized_keys: Symbolic Link

  authorized_keys -->> Program: File Descriptor
  Program ->> authorized_keys: write(SSH_KEY)
</pre>

> 그런데 이러한 TOCTOU는 실제 애플리케이션 개발 중에도 "악의 없이" 흔히 일어나는 실수이기도 하다.  

<br>

### 2. 권한 검사 후 작업 수행

두 번째 유형은 사용자의 권한을 먼저 확인한 뒤 실제 작업을 수행하는 경우다. 예를 들어 다음과 같이 관리 권한을 확인한 뒤 작업을 실행한다고 해보자.

```python
def execute_admin_task(user, task):
    if user.has_role("admin"):
        queue.add(task)
```

프로그램은 요청 시점에 사용자가 관리자 권한을 가지고 있는지 확인한다. 문제는 **권한을 확인한 시점과 실제 작업이 수행되는 시점이 다를 수 있다는 것**이다.

비슷하게 한 가지 상황을 가정해보자.

* 사용자가 관리자 권한을 가진 상태에서 중요한 작업을 요청함
* 프로그램은 권한을 확인한 뒤 해당 작업을 실행 대기열에 등록함
* 작업이 실제로 실행되기 전에 사용자의 관리자 권한이 회수됨
* 하지만 실행 단계에서는 권한을 다시 확인하지 않음

이 경우 실제 작업이 수행되는 시점에는 사용자가 더 이상 관리자 권한을 가지고 있지 않지만, 프로그램은 이전의 검사 결과를 그대로 신뢰하고 작업을 수행한다.

| 시점           | 동작                   | 사용자 권한 |
| ------------ | -------------------- | ------ |
| Check        | 관리자 권한 확인            | Admin  |
| State Change | 사용자의 관리자 권한 회수       | User   |
| Use          | 이전 검사 결과를 바탕으로 작업 수행 | User   |

<br>

### 3. 그래서 TOC TOU는  

앞에서 살펴본 유형들은 대상과 상황은 서로 다르지만 구조는 동일하다. 파일 접근에서는 검사한 파일과 실제로 연 파일이 달라졌고, 권한 검사에서는 확인 당시의 권한과 작업 수행 당시의 권한이 달라졌다. 결국 문제는 모두 **과거에 확인한 상태가 현재도 그대로 유지되고 있다고 가정한 것**에서 발생한다.  

> Check와 Use가 분리되어 있고, 그 사이 상태가 변할 수 있는데도 이전의 Check 결과를 그대로 신뢰하는 것.  

이것이 TOCTOU의 본질이다.

## Race Condition  

### Race Condition(경쟁 상태)

TOCTOU는 Race Condition과 함께 다루어지는 경우가 많다. Race Condition은 **여러 실행 흐름이 같은 자원이나 상태에 접근할 때, 실행 순서나 타이밍에 따라 결과가 달라지는 문제**이다.  

예를 들어 두 요청이 거의 동시에 같은 데이터를 확인하고 수정한다면, 어느 요청이 먼저 실행되느냐에 따라 최종 결과가 달라질 수 있다. 즉,  **여러 작업의 실행 순서가 결과에 영향을 준다는 것**이다.  

TOCTOU 역시 이러한 Race Condition의 한 형태다. 다만 Race Condition은 여러 유형으로 나타날 수 있지만, TOCTOU는 경쟁이 발생하는 지점이 Check와 Use 사이로 명확하다.

```text
Check
  ↓
Race Window
  ↓
Use
```

### Race Window  

이와 같은 Race Condition이 실제로 발생할 수 있는 시간 구간을 **Race Window**라고 한다. 이 구간에 다른 프로세스나 스레드, 요청 또는 공격자가 개입해 상태를 변경하면 그 개입의 선후에 따라 결과가 달라질 수 있다.  

앞에서 살펴본 파일 접근 사례를 다시 보면 관계가 명확하다.

### TOCTOU와 Race Condition

둘의 관계를 정리하면 다음과 같다.

| 구분    | Race Condition         | TOCTOU                     |
| ----- | ---------------------- | -------------------------- |
| 핵심    | 실행 순서와 타이밍에 따라 결과가 달라짐 | Check와 Use 사이의 상태 변화에 따라 결과가 달라짐       |
| 범위    | 동시성 문제 전반              | Race Condition의 특정 형태      |
| 경쟁 지점 | 공유 자원에 접근하는 모든 구간      | Check와 Use 사이의 Race Window |

즉, TOCTOU는 Race Condition의 한 종류이다.

## OpenAI Hugging Face 사건에서의 TOCTOU

이제 다시 OpenAI Hugging Face 해킹 사건으로 돌아가보자. 이 사건에서는 앞서 살펴본 파일이나 권한 검사와는 다른 형태의 TOCTOU가 등장한다.

이 사건에서 TOCTOU는 7월 13일, 에이전트들이 **OpenAI 내부 Artifactory를 다시 장악하는 과정**에서 사용됐다. 먼저 에이전트들은 이전에 확보한 SSRF 방법을 이용해 외부 인터넷의 어느 저장소에 **조작된 Ruby 패키지(편의상 악성패키지라고 지칭)** 를 올려놓았다. 그리고 내부에서는 Artifactory에 "나 그 악성 패키지 필요해!"라고 요청하여 Artifactory가 그 패키지를 받아오도록 유도했다.  

그렇다면 에이전트들은 조작된 Ruby 패키지로 무엇을 하려고 한 걸까? 문제는 이 Ruby 패키지를 처리하는 순서에 있었다.  

일반적으로 외부에서 전달된 객체를 처리한다면, 먼저 해당 객체가 안전한지 검사한 뒤 실제로 역직렬화하거나 사용해야 한다.

<pre class="mermaid">
flowchart LR
  A(Safety Check) --> B(Deserialization)
  B --> C(Use)
</pre>

하지만 Artifactory의 JRuby 기반 RubyGems 처리 경로에서는 Ruby Package **내부의 Nested Child와 Dependency가 안전한지 확인(Safety Check)되기 전에 Sandbox 밖에서 먼저 역직렬화**가 될 수 있는 취약점이 존재했다. OpenAI 기술 보고서에서는 이를 다음 순서로 설명한다.

<pre class="mermaid">
flowchart LR
  A(조작된 Ruby 패키지) --> B(Nested Child / Depndency)
  B --> C(Sandbox 밖에서 역직렬화)
  C --> D(안전 확인 Safety Check. 뒤늦게 이뤄짐)
</pre>

즉, **안전한지 확인해야 할 데이터가 검사되기도 전에 이미 사용된 것**이다. 살펴보면 전형적인 TOCTOU와 구조가 조금 다름을 알 수 있다. 하지만 OpenAI에서는 **개념상 Check와 Use가 보장되지 않았다는 점에서 TOCTOU로 설명한 것**이다.  

앞에서 살펴본 파일 TOCTOU와 비교하면 차이가 더 명확하다.

| 구분    | 전형적인 TOCTOU          | Artifactory 사례                                 |
| ----- | -------------------- | ---------------------------------------------- |
| Check | 대상의 상태·권한 확인         | Ruby Package의 안전성 확인                           |
| 문제    | Check 이후 대상의 상태가 변경됨 | Check가 끝나기 전에 Dependency가 처리됨                  |
| Use   | 변경된 대상을 사용           | Nested Dependency를 Unsandboxed Deserialization |
| 결과    | 검사한 대상과 실제 사용 대상 불일치 | 검증되지 않은 객체가 먼저 실행 가능                           |

따라서 이번 사례를 단순히 `Check → State Change → Use`로 설명하기는 어렵다. 공격자가 Check와 Use 사이에서 객체를 교체한 것이 아니라, **Artifactory 내부의 처리 순서 자체가 검증보다 사용을 먼저 허용하고 있었기 때문**이다.

에이전트들은 이 취약점을 이용해 Artifactory에서 **Remote Code Execution(RCE)**을 확보했다. 이후 이것을 발판삼아 Artifactory host 탈취에 이어 전반적인 훈련 K8s 권한 획득까지 이어지게 된다.  

## CVE-2026-65617

![](/assets/images/20260915_001_002.jpg)

이 취약점은 이후 `CVE-2026-65617`로 NIST의 vulnerability DB에 **Artifactory의 Package Handling 과정에서 발생하는 역직렬화 취약점**이라는 내용으로 등록됐다. OpenAI에서는 이 취약점을 TOCTOU라고 설명했지만, 이는 공격의 처리 순서 설명 중에 이해를 돕기 위해 말한 것으로 보이며, 실제 취약점은 **검증되지 않은 Ruby 객체의 역직렬화** 라고 해야 정확할 것 같다.  

전형적인 TOCTOU와 다르기는 하나, **프로그램이 어떤 대상을 검증한 시점과 실제로 사용하는 시점의 원자성이 보장되지 않았다**는 점에서는 공통점이 있다.  


### 방지 방법  

가장 효가적인 방법은 **Check와 Use를 가능한 한 분리하지 않는 것**이다. DB에서 자주 볼 수 있는 용어를 가져와 표현해 보면 **Check와 Use를 하나의 트랜잭션으로 묶어 원자성을 보장**하는 것이다. 예를 들어 파일의 존재 여부를 먼저 확인한 뒤 다시 생성하는 대신, 파일 생성 자체를 원자적인 연산으로 처리할 수 있다.  

```python
with open("result.txt", "x") as f:
    f.write("data")
```

`"x"` 모드는 파일이 이미 존재하면 실패하고, 존재하지 않으면 생성한다. 즉, 상태 확인과 사용을 별도로 수행하지 않는다.

결국 TOCTOU를 방지하는 핵심은 단순하다.

> **확인한 뒤 사용하는 것이 아니라, 가능하면 확인과 사용을 하나의 원자적인 작업으로 처리해야 한다.**

## TOCTOU 실습

이번에는 간단한 Python 코드로 **Check와 Use 사이에 상태가 변경되는 상황**을 직접 만들어보도록 하겠다. 실제 공격 상황을 구현하기에는.. 아이디어가 없어서, 우선 멀티스레딩 환경에서 TOCTOU가 어떤 구조로 발생하는지 확인해보도록 한다.  

아래 코드에서 `program` 함수는 target.txt 파일의 안전성을 체크한 뒤, 잠시 뒤 그 파일의 텍스트를 읽어와 그 내용을 표준 출력으로 출력한다. `another_process` 함수는 동일한 파일에 "악성코드"라는 텍스트를 쓰는 작업을 한다.  

```python
from pathlib import Path
import threading

target = Path("target.txt")
target.write_text("SAFE")

checked = threading.Event()
changed = threading.Event()


def program():
    # Check
    if target.read_text() == "SAFE":
        print("[PROGRAM] Check - SAFE 확인")

        checked.set()
        changed.wait()

        # Use
        data = target.read_text()
        print(f"[PROGRAM] USE - {data} 사용")


def another_process():
    checked.wait()

    target.write_text("악성코드")
    print("[Attacker] Change - 파일 내용 변경")

    changed.set()


t1 = threading.Thread(target=program)
t2 = threading.Thread(target=another_process)

t1.start()
t2.start()

t1.join()
t2.join()
```

실행 결과는 다음과 같다.

```plaintext
[PROGRAM] Check - SAFE 확인
[Attacker] Change - 파일 내용 변경
[PROGRAM] USE - 악성코드 사용
```

프로그램은 분명 Check 단계에서 `SAFE`라는 값을 확인했다. 하지만 실제 Use 단계에에 들어가기 전, 다른 작업이 파일을 변경했기 때문에 원래 확인했던 파일 내용이아닌 `악성코드`를 사용하게 된다.

| 시점           | 동작            | `target.txt` |
| ------------ | ------------- | ------------ |
| Check        | 파일 내용 확인      | `SAFE`       |
| State Change | 다른 스레드가 파일 변경 | `악성코드`    |
| Use          | 파일을 다시 읽어 사용  | `악성코드`    |

> threading.Event()는 TOCTOU 시점을 일부러 맞추기 위해 사용함. **실제 환경에서는** 이렇게 인위적인 이유 때문이 아니라, **파일 I/O, 네트워크 상황, DB 작업 동시 요청 등으로 인해 자연스럽게 Race Window가 만들어진다**.  

<pre class="mermaid">
sequenceDiagram
  participant p as program
  participant a as another_process
  participant t as target.txt

  p ->> t: Check("SAFE")
  t -->> p: SAFE
  a ->> t: change("악성코드")
  p ->> t: Use
  t -->> p: 악성코드
</pre>

## 참고 - 코드해설  

이 코드에서 threading은 두 작업을 동시에 실행하고, Event로 실행 순서를 맞추기 위해 사용하고 있다.  

1. Thread 생성

```python
t1 = threading.Thread(target=program)
t2 = threading.Thread(target=another_process)
```

여기서는 t1, t2라는 스레드를 만들고 있다. 각각은 program, another_process 함수 자체를 가지고 있다가, 스레드의 target이 이 함수를 가리키면 실행시킨다.  

2. start() 스레드 실행

```python
t1.start()
t2.start()
```

start()를 호출하면 각각의 스레드가 실행되면서 내부적으로 다음 함수가 호출된다. 여기서 중요한 게 하나 있는데, **두 함수가 독립적으로 실행되기 때문에 어느 쪽이 먼저 진행될지는 기본적으로 보장되지 않는다**. 그래서 이 코드에서는 **Event를 사용해 순서를 강제로 맞춘다**.  

3. Event - 스레드 간 신호 전달

```python
checked = threading.Event()
changed = threading.Event()
```

Event는 간단히 말하면 스레드끼리 사용하는 신호등이다. 초기 상태는 False이고, `wait()`, `set()` 메서드에 따라 상태를 False, True로 바꾼다.  

| 메서드            | 의미                                |
| -------------- | --------------------------------- |
| `event.wait()` | Event가 `True`가 될 때까지 대기           |
| `event.set()`  | Event를 `True`로 변경하고 대기 중인 스레드를 깨움 |

4. 흐름도

위 코드로 보장되는 프로세스의 흐름도를 그려보자면 아래와 같다.  

<pre class="mermaid">
sequenceDiagram
  participant t1 as Thread1(program)
  participant t2 as Thread2(another_process)
  participant e1 as Event1(checked)
  participant e2 as Event2(changed)
  participant t as target.txt

  t2 ->> e1: wait()
  
  t1 ->> t: Check("SAFE")
  t1 ->> e1: set()
  e1 -->> t2: wait 해제
  t1 ->> e2: wait()

  t2 ->> t: Change("악성코드")
  t2 ->> e2: set()
  e2 -->> t1: wait 해제

  t1 ->> t: Use()
  t -->> t1: 악성코드
</pre>

## Reference

[Wikipedia - TOCTOU의 기본 개념과 파일 시스템 사례](https://en.wikipedia.org/wiki/Time-of-check_to_time-of-use)

[Black Hat USA 2026 OpenAI HuggingFace 해킹 사건 발표](https://www.youtube.com/watch?v=Vr4skV4GGEA)

[OpenAI Technical Report - Artifactory 재장악과 JRuby/RubyGems 공격 과정](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf)

[NVD CVE-2026-65617 - Artifactory Deserialization 취약점 분류](https://nvd.nist.gov/vuln/detail/CVE-2026-65617)

[MITRE CWE-367 - TOCTOU의 정의와 Race Condition 관계](https://cwe.mitre.org/data/definitions/367.html)

[MITRE CWE-362 - Race Condition의 정의와 동시성 문제](https://cwe.mitre.org/data/definitions/362.html)