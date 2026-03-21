---
title: "[Python] setattr 과 getattr, 클래스의 동적 필드 정의" # 제목 (필수)
excerpt: "문자열을 통해 클래스의 속성에 관여하기" # 서브 타이틀이자 meta description (필수)
date: 2026-03-21 10:23:00 +0900      # 작성일 (필수)
lastmod: 2026-03-21 10:23:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-03-21 10:23:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 property getattr setattr 속성 정의 클래스 필드 정의 동적                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20260321_001-->

## getattr, setattr, hasattr

### 소개

- 객체의 속성(attribute)를 문자열 이름으로 다룰 수 있게 해주는 파이썬 내장함수
- 예를 들어, [`obj.name`](http://obj.name) 처럼 속성을 다루는 게 아닌, “name” 이라는 문자열로 다룰 수 있게 해준다.

### 속성(attribute) 이란?

- 파이썬 객체, 특히 클래스 안에 정의된 값이나 메서드

```python
class User:
    def __init__(self):
        self.name = "Jongya"  # 속성
        self.level = 23       # 속성
```

- 보통은 `객체.속성명` 과 같이 속성의 값을 다룬다.

```python
u = User()
print(u.name)
```

### 1. setattr

- 객체의 특정 속성에 값을 넣을 때, 속성의 이름(name)을 이용해 값을 넣는 방법

```python
# 문법
setattr(객체, "속성이름", 넣을값)
```

- 예시

```python
# 일반적인 방법  
u = User()
u.name = "James"

# setattr 이용
u = User()
setattr(u, "name", "Iverson")
```

### 2. getattr

- 객체의 속성값을 불러올 때, 속성의 이름(name)을 이용해 불러오는 방법

```python
# 문법
getattr(객체, "속성이름", 기본값)
```

- 예시

```python
# 일반적인 방법
print(u.name)

# getattr 이용
print(getattr(u, "name")
```

```bash
'Iverson'
```

- 속성이 없는 경우

```python
getattr(u, "abcd", 123)
```

```bash
123
# 속성값이 객체에 저장되지는 않음
```

### 3. hasattr

- 속성이 존재하는지 “속성의 이름”을 통해 확인하는 방법. Boolean 값을 반환.

```python
# 문법
hasattr(객체, "속성이름")
```

- 예시

```python
hasattr(u, "name")
# >> True

hasattr(u, "age")
# >> False
```

### 사용하는 이유

- 일반적인 경우 `객체.속성명` 과 같이 사용하면 된다.
- 단, **속성의 이름이 “실행 중” 결정될 때**에는 getattr, setattr 이 필요할 수 있다.

## 사용 예시

### 동적 필드(속성) 생성

- 딕셔너리 또는 리스트 형태를 받아,  key를 속성 이름, value 를 속성값으로 정의하는 경우
- 키값이 미리 정해져 있지 않은 경우

```python
class User:
    def __init__(self, info:dict):
        for k, v in info.items():
            setattr(self, k, v)

info = {
    "name" : "James",
    "job" : "Basketball Player",
    "age" : 25
}

u = User(info)

print(u.__dict__)    
```

```bash
{'name': 'James', 'job': 'Basketball Player', 'age': 25}
```