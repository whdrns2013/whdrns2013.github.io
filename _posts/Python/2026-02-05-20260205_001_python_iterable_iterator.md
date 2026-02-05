---
title: "[Python] 파이썬 Iterable 과 Iterator" # 제목 (필수)
excerpt: "반복 가능 객체와 반복자" # 서브 타이틀이자 meta description (필수)
date: 2026-02-05 23:15:00 +0900      # 작성일 (필수)
lastmod: 2026-02-05 23:15:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-02-05 23:15:00 +0900   # 최종 수정일 (필수)
categories: Python        # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 iterable iterator 반복 가능 객체 반복자 list 리스트 tuple 튜플 dictionary 딕셔너리 generator 제너레이터                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20260205_001-->

## Iterable

### 정의

- Iterable : 반복 가능 객체
- 파이썬에서 `list` , `tuple` , `str` 과 같은 객체들
- 내부에 데이터를 담고 있고, 그 데이터를 하나씩 꺼내 반환할 수 있는 **구조를 가진 객체**

### 핵심

- `__iter__()` 메서드를 가지고 있어, 이를 호출하면 `Iterator` 를 반환한다.
- 내부 데이터를 직접 꺼내는 게 아니라, Iterator를 통해 꺼낼 수 있는 “재료”의 역할을 한다.

### 종류

| 종류 | 설명 |
| --- | --- |
| list | 순서가 있는 가변 시퀀스 |
| dict | 키(Key)와 값(Value)의 쌍으로 이루어진 매핑 객체 |
| set | 중복을 허용하지 않는 집합 객체 |
| str | 문자들의 시퀀스 |
| bytes | 바이트 단위의 시퀀스 |
| tuple | 순서가 있는 불변 시퀀스 |
| range | 연속된 숫자를 생성하는 객체 |

## Iterator

### 정의

- Iterator : 반복자
- 데이터를 차례대로 꺼낼 수 있는 객체

### 핵심

- 대상 객체 : 반복시킬 Iterable의 위치(참조값)
- Index Pointer : 다음번에 호출할 요소의 위치(참조값)
- 자신이 어디까지 데이터를 읽었는지 상태(State)를 기억한다.
- `__iter__()` : `Iterator` 자기 자신을 반환한다. (Iterator도 Iterable이 되기 위함)
- `__next__()` : 다음 요소를 하나씩 반환한다. 더 이상 반ㅂ환할 요소가 없으면 `StopIteration` 예외를 발생시킨다.

### 작동 방식

- `next()` 가 호출될 때마다 내부에서 아래와 같이 동작한다.

```python
1. 현재 인덱스가 리스트의 길이보다 작은지 확인한다.  
2. 작다면, 리스트의 현재 인덱스에 있는 값을 반환하고, 현재 인덱스를 1 증가시킨다.  
3. 만약 인덱스가 범위를 벗어난다면 "StopIteration" 을 발생시킨다.  
```

### 실습

#### Iterable 과 Iterator 감 잡기  

```python
iterable = [1, 2, 3, 4]  # iterable : Iterable
it = iter(iterable)      # it : Iterator

print(next(it))
print(next(it))
print(next(it))
print(next(it))
print(next(it))
```

```bash
1
2
3
4
---------------------------------------------------------------------------
StopIteration                             Traceback (most recent call last)
Cell In[120], line 7
      5 print(next(it))
      6 print(next(it))
----> 7 print(next(it))

StopIteration: 
```

#### for 반복문과 iter  

```python
for item in [1, 2, 3]:
    print(item)
```

- (1) Iterator 획득 : 주어진 `iterable` 내부의 `__iter__()` 메서드를 호출해 Iterator를 획득한다.

```python
iterator = iter([1, 2, 3])
```

- (2) 반복 호출 : 획득한 Iterator에 대해 `next()` 메서드를 반복적으로 호출해 값을 하나씩 가져온다.

```python
item = next(iterator)
```

- (3) 종료 처리 : 더 이상 내보낼 값이 없으면 `StopIteration` 예외를 발생시킨다. for문은 이 예외를 감지함녀 루프를 안전하게 종료시킨다.

```python
iterator = iter([1, 2, 3])

while True:
    try:
        item = next(iterator)
        print(x)
    except StopIteration:
        break
```

### Iterator 만들어보기

- 인입된 Iterable 객체의 “반대 순서”로 데이터의 순서를 저장하는 Iterator를 만들어보았다.

```python
class ReverseIterator:
    def __init__(self, data):
        self.data = data
        self.index = 0
    
    def __iter__(self):
        self.data = self.data[::-1] # __iter__()메서드가 호출되면 인입된 데이터를 거꾸로 저장
        return self
    
    def __next__(self):
        if self.index >= len(self.data):
            raise StopIteration
        self.index += 1
        return self.data[self.index - 1]
```

```python
ri = ReverseIterator([1, 2, 3, 4])
for i in ri:
    print(i)
```

```bash
4
3
2
1
```

## Reference

[Python docs - 이터레이터 객체](https://docs.python.org/ko/3.13/c-api/iterator.html)  
[Wikidocs - 38. Iterable 과 Iterator](https://wikidocs.net/16068)  