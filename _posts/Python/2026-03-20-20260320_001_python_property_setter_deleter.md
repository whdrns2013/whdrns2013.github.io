---
title: "[Python] 파이썬 @property, @setter, @deleter 사용법" # 제목 (필수)
excerpt: "클래스 속성을 메서드로 정의하기" # 서브 타이틀이자 meta description (필수)
date: 2026-03-20 01:54:00 +0900      # 작성일 (필수)
lastmod: 2026-03-20 01:54:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-03-20 01:54:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 property setter deleter getter 속성 정의                      # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20260320_001-->

## `@property`, `@setter`, `@deleter`

### 1. 소개

- 클래스의 메서드를 속성(attribute) 처럼 다룰 수 있게 해주는 데코레이터
- 속성처럼 [`obj.name`](http://obj.name) 처럼 호출하지만, 실제로는 내부 메서드가 실행되어 속성을 조회하는 방식
- 속성을 메서드로 다루기 때문에, 속성 조회, 검증, 계산 등의 통제를 자동으로 할 수 있게 해준다.

| 데코레이터 | 기능 |
| --- | --- |
| `@property` | getter 를 만드는 데코레이터로, 메서드를 읽기 전용 속성처럼 만들어준다.<br>속성을 읽을 때 사용. |
| `@setter`  | 메서드를 속성에 값을 대입하는 setter로 만들어준다. 값의 검증 로직을 추가할 수 있다.<br>속성을 대입할 때 사용. |
| `@deleter`  | 메서드를 통해 속성을 제거할 때 사용된다.   |

### 2. 사용법

#### (1) `@property`

```python
class User:
    def __init__(self, name:str):
        self._name = name

    @property
    def name(self):
        return self._name

u = User("소크라테스")
print(u.name)
```

```bash
소크라테스
```

#### (2) `@setter`

```python
class User:
    def __init__(self, name:str|None = None):
        self._name = name

    @property
    def name(self):
        return self._name
    
    @name.setter
    def name(self, name):
        self._name = name

u = User()
u.name = "소크라테스"
print(u.name)
```

```bash
소크라테스
```

#### (3) `@deleter`

```python
class User:
    def __init__(self, name:str):
        self._name = name

    @property
    def name(self):
        return self._name

    @name.deleter
    def name(self):
        del self._name

u = User("소크라테스")
del u.name
print(u.name)
```

```python
AttributeError: 'User' object has no attribute '_name'
```

### 2. 사용하는 이유

#### (1) 속성값을 읽을 때 변환 로직을 넣기 위해

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperature(30)
print("celsius : ", t.celsius)
print("fahrenheit : ", t.fahrenheit)
```

```bash
celsius :  30
fahrenheit :  86.0
```

#### (2) 속성값을 넣을 때 값을 검증하기 위해

```python
class User:
    def __init__(self, email:str|None = None):
        self._email = email

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        if "@" not in value:
            raise ValueError("올바른 이메일 형식이 아닙니다.")
        self._email = value

u = User()
u.email = "abcdefg"
```

```bash
올바른 이메일 형식이 아닙니다.
```

#### (3) 외부에서의 사용 방식은 유지하고, 내부 구현을 바꿀 때

```python
class Dollar:
    def __init__(self, dollar):
        self._dollar = dollar

    @property
    def korean_won(self):
        exchange_rate = 1400
        return self._dollar * exchange_rate

d = Dollar(1)
print(d.korean_won)

# >> 1400
```

```python
class Dollar:
    def __init__(self, dollar):
        self._dollar = dollar

    @property
    def korean_won(self):
        exchange_rate = 1500
        return self._dollar * exchange_rate

d = Dollar(1)
print(d.korean_won)

# >> 1500
```

#### (4) 기능을 가지면서, 호출할 때에는 일반 속성처럼 호출

- 값의 변환 기능을 가지는 **일반** 메서드를 만들 경우

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperature(30)
t.fahrenheit()
```

- `@property` 를 사용하는 경우

```python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperature(30)
t.fahrenheit
```

### 3. 결론

- `@property` 를 사용하는 것은, “이 값은 객체의 속성이다”라는 의미를 더 자연스럽게 표현함
- 이처럼 상태, 성질(속성)처럼 보이고 싶은 경우 property 데코레이터를 사용하고
- 행동 중심, 특정 작업처럼 보이고 싶은 경우엔 일반 메서드를 사용하면 된다.