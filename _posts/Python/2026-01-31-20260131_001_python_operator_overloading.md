---
title: "[Python] 연산자 오버로딩 Operator Overloading" # 제목 (필수)
excerpt: "연산자를 내 마음대로 정의하기"  # 서브 타이틀이자 meta description (필수)
date: 2026-01-31 21:48:00 +0900      # 작성일 (필수)
lastmod: 2026-01-31 21:48:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-31 21:48:00 +0900   # 최종 수정일 (필수)
categories: Python        # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 연산자 오버로딩 operator overloading overriding 오버라이딩 에어플로 airflow 랭체인 langchain lcel                     # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20260131_001-->


## 연산자 오버로딩  

### 개념  

- Operator overloading  
- 정의 : 내장된 **기본 연산자의 동작을 클래스 내에서 재정의(Overriding)**하여, 별도 의도된 작업을 처리하도록 하는 기법  
- 쉽게 말해, 원래 파이썬에서 사용되는 연산자의 작동 방식을 직접 정의해 덮어씌운 것  


### 예시  

#### (1) 파이썬 기본 문법  

동일한 연산자가 데이터 타입에 따라 다르게 동작하는 기본적인 사례  

- `+` 연산자 : 숫자형에서는 덧셈의 역할, 문자열에서는 결합(concatenation) 역할  

```python
# --- add 연산자 (정수형) --- #
print(1+1)
# >> 2

# --- add 연산자 (부동소수형) --- #
print(3.14 + 5.676)
# >> 8.816

# --- add 연산자 (문자형) --- #
print('a' + 'b')
# >> ab

# --- add 연산자 (문자열) --- #
print("abc" + "def")
# >> abcdef
```

- `*` 연산자 : 숫자형에서는 곱셈의 역할, 문자열에서는 반복(repeat) 역할  

```python
# --- mul 연산자 (정수형) --- #
print(3*2)
# >> 6

# --- mul 연산자 (부동소수형) --- #
print(3.14 * 5.676)
# >> 17.82264

# --- mul 연산자 (문자형 * 정수형) --- #
print('a' * 3)
# >> aaa

# --- mul 연산자 (문자열 * 정수형) --- #
print("abc" * 2)
# >> abcabc
```

#### Apache Airflow  

- Airflow 에서는 `>` 연산자를 통해 태스크 파이프라인(DAG)을 정의한다.  

```python
start > task1 > group1 > integration_task > end
start > task1 > group2 > integration_task > end
start > task1 > group3 > end
```

#### LCEL  

- LCEL(LangChain Expression Language) 에서는 `|` 연산자를 통해 흐름(Chain)을 정의한다.  

```python
chain = prompt | llm | parser
```

<br>
<br>

### 사용자 정의 연산자 오버로딩  

#### 연산자의 원리  

- 사용자 정의 연산자를 살펴보기 전에, 특정 클래스에서의 연산자들이 어떻게 정의되는지 살펴본다.  
- 클래스에서 각 연산자는 `__add__`(더하기 연산자) `__mul__`(곱하기 연산자) 등의 매직 메서드로 정의된다.  

```python
class Test:
    
    def __init__(self, a:int):
        self.a = a
        
    def __add__(self, other:int):
        return self.a + other.a
```

<br>

#### 연산자 매직 메서드의 종류  

- 사칙연산 Arithmetic Operators  

|연산자|메서드|이름풀이|
|---|---|---|
|`+`|`__add__(self, other)`|add|
|`-`|`__sub__(self, other)`|subtract|
|`*`|`__mul__(self, other)`|multiply|
|`/`|`__truediv__(self, other)`|true divide|
|`//`|`__floordiv__(self, other)`|floor divide|
|`%`|`__mod__(self, other)`|modulo|
|`**`|`__pow__(self, other)`|power|

- 비교연산 Comparison Operators  

|연산자|메서드|이름풀이|
|---|---|---|
|`<`|`__lt__(self, other)`|less than|
|`>`|`__gt__(self, other)`|greater than|
|`<=`|`__le__(self, other)`|less than or equal to|
|`>=`|`__ge__(self, other)`|greater than or equal to|
|`==`|`__eq__(self, other)`|equal|
|`!=`|`__ne__(self, other)`|not equal|

- 대입 연산자 Assignment Operator  

|연산자|메서드|이름풀이|
|---|---|---|
|`+=`|`__iadd__(self, other)`|in-place(그 자리에서) add|
|`-=`|`__isub__(self, other)`|in-place subtract|
|`*=`|`__imul__(self, other)`|in-place multiply|
|`/=`|`__itruediv__(self, other)`|in-place true divide|
|`//=`|`__ifloordiv__(self, other)`|in-place floor divide|
|`%=`|`__imod__(self, other)`|in-place modulo|
|`**=`|`__ipow__(self, other)`|in-place power|

- 단항연산자 Unary Operators  

|연산자|메서드|이름풀이|
|---|---|---|
|`-`|`__neg__(self)`|negative|
|`+`|`__pos__(self)`|positive|
|`~`|`__invert__(self)`|invert|

- 불리언 연산자 Boolean Operator  

|연산자|메서드|이름풀이|
|---|---|---|
|`&`|`__and__(self)`|and|
|`|`|`__or__(self)`|or|

<br>

#### 사용자 정의 연산자 만들어보기  

- 덧셈을 곱셈으로 만들기  

```python
class Test:
    def __init__(self, a:int):
        self.a = a
    def __add__(self, other:int):
        return self.a + other.a

t1 = Test(3)
t2 = Test(5)
print(t1 + t2)
```

```bash
15
```

<br>

#### LangChain의 파이프라인 재현해보기  

- `LCELObject` : Prompt, LLM, Parser 와 같은 LCEL 표현법의 오브젝트들  
- `Chain` : LCEL 오브젝트들의 선후관계를 묶은 체인  
- LCELObject 들은 모두 `process`라는 작업 실행 메서드를 가지고 있음  
- Chain 은 전체 파이프라인을 실행시키는 `invoke`라는 메서드를 가지고 있음  

```python
from abc import ABC, abstractmethod

class LCELObject(ABC):
    def __or__(self, next_object):
        return Chain(self, next_object)
    @abstractmethod
    def process(self, something):
        pass

class Chain:
    def __init__(self, first, second):
        self.first = first
        self.second = second
    def invoke(self, data):
        first_result = self.first.process(data)
        final_result = self.second.process(first_result)
        return final_result

class Prompt(LCELObject):
    def __init__(self, prompt):
        self.prompt = prompt
    def process(self, data:str):
        if data is not None:
            self.prompt = data
        return self.prompt

class LLM(LCELObject):
    def __init__(self, config):
        self.config = config
        self.name = config.get("name")
    def process(self, data):
        return self.name + f" AI 응답 : {data}에 대한 AI 응답입니다."
```

- prompt와 llm 설정을 지정한 뒤 실행  

```python
prompt = Prompt("당신은 사용자를 돕는 상담사입니다.")
llm = LLM({"name":"샘플 LLM"})

chain = prompt | llm
result = chain.invoke("안녕하세요?")
print(result)
```

```bash
샘플 LLM AI 응답 : 안녕하세요?에 대한 AI 응답입니다.
```



## Reference  

[https://www.geeksforgeeks.org/python/operator-overloading-in-python/](https://www.geeksforgeeks.org/python/operator-overloading-in-python/)  

