---
title: "[DP] Top-Down 방식의 다이나믹 프로그래밍 Dynamic Programming" # 제목 (필수)
excerpt: "재귀와 메모이제이션을 이용한 다이나믹 프로그래밍" # 서브 타이틀이자 meta description (필수)
date: 2025-07-22 03:52:00 +0900      # 작성일 (필수)
lastmod: 2025-07-22 03:52:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-07-22 03:52:00 +0900   # 최종 수정일 (필수)
categories: Algorithm         # 다수 카테고리에 포함 가능 (필수)
tags: 파이썬 재귀함수 메모이제이션 lru_cache 다이나믹프로그래밍 재귀호출한도 setrecursionlimit 파이썬최적화 피보나치 재귀함수예제 알고리즘문제 해결방법 파이썬성능개선 알고리즘기초 dynamic programming dp dynamicprogramming python   # 태그 복수개 가능 (필수)
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
<!--postNo: 20250719_002-->

## 다이나믹 프로그래밍의 두 가지 방식  

- 다이나믹 프로그래밍은 두 가지 방식으로 구현된다.  
- Top-Down (재귀적) : 큰 문제를 작은 문제로 접근 - 재귀 + 메모이제이션 사용  
- Bottom-Uo (반복적) : 작은 문제를 결합해 큰 문제로 - 테이블로 단계적으로 쌓아감  
- 재귀함수는 다이나믹 프로그래밍의 Top-Down 방식에 해당한다.  

## 예제 - 피보나치수  

### 피보나치수의 정의  

```python
fib(0) = 0
fib(1) = 1
fib(n) = fib(n-1) + fib(n-2)
```

## 재귀함수  

### 재귀함수의 정의  

- 자기 자신을 다시 호출하는 함수  
- 즉, 함수 내부에서 자기 자신을 호출해, 문제를 더 작은 단위로 해결하려는 방식  

### 재귀함수의 필수 구성  

- 종료 조건 (Base Case) : 더 이상 재귀 호출을 하지 않고 끝나는 조건이 있어야 한다.  
- 재귀 호출 (Recursive Case) : 자기 자신을 다시 호출하는 부분이 있어야 한다.  

### 피보나치 수열을 재귀함수로 정의하기  

```python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
```

## 메모이제이션  

### 메모이제이션의 정의  

- 어떤 함수에 들어왔던 파라미터와, 그 파라미터에서의 함수 결과값을 저장하고 있다가  
- 나중에 동일한 파라미터가 들어오면, 계산 없이 저장한 결과값을 바로 반환하는 기법  
- `@lru_cache(maxsize=None)` 어노테이션을 통해 메모이제이션을 함수에 적용한다.  

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def some_function(param):
	...
	return a
```

### 메모이제이션 미적용 코드  

```python
import time

start = time.time()

def fib(n):
	if n <= 1:
		return n
	return fib(n-1) + fib(n-2)

# 시간 측정
print(fib(40))
print(f'duration : {time.time() - start}')

# 출력
>> 102334155
>> duration : 8.589844226837158
```

### 메모이제이션 적용 코드  

```python
from functools import lru_cache
import time

start = time.time()

@lru_cache(maxsize=None)
def fib(n):
	if n <= 1:
		return n
	return fib(n-1) + fib(n-2)

# 시간 측정
print(fib(50))
print(f'duration : {time.time() - start}')

# 출력
>> 102334155
>> duration : 0.0007688999176025391
```

### dict 를 이용한 직접 메모이제이션  

```python
import time

start = time.time()

memo = {}

def fib_manual(n):
    if n in memo:
        return memo[n]
    if n <= 1:
        memo[n] = n
    else:
        memo[n] = fib_manual(n-1) + fib_manual(n-2)
    return memo[n]

# 시간 측정
print(fib_manual(40))
print(f'duration : {time.time() - start}')

# 출력
>> 102334155
>> duration : 0.0006320476531982422
```


## 재귀 호출 한도 증대  

### 재귀 호출 한도  

- 하나의 함수가 자신을 반복 호출할 수 있는 최대 깊이를 말한다.  
- 깊이란, 스택에 쌓이는 함수 호출의 횟수이다.  
- 너무 깊게 재귀 호출을 하면 스택 오버플로 혹은 RecursionError 가 발생한다.  
- 이를 방지하기 위해 대부분의 언어는 재귀 깊이에 제한을 둔다.  
- 이 제한은 호출 스택 크기를 관리하고 메모리 폭주를 방지하기 위한 장치이다.  

> 쉽게 말해, "몇 번까지 재귀적으로 함수를 부를 수 있나?"를 제한하는 수치이다.  

### 파이썬의 기본 재귀 호출 한도  

- 파이썬의 기본 재귀 호출 한도는 환경마다 다르며  
- `sys.getrecursionlimit()` 함수를 통해 확인할 수 있다.  

```python
import sys
print(sys.getrecursionlimit())

>> 3000
```

### 한도를 초과하는 재귀호출 해보기  

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
	if n <= 1:
		return n
	return fib(n-1) + fib(n-2)

print(fib(3001))

>> RecursionError: maximum recursion depth exceeded
```

### 재귀호출 한도를 늘리는 방법  

- `sys.setrecursionlimit()` 함수를 통해 한도를 늘릴 수 있다.  
- 이론적으로는 한도를 무한하게 늘릴 수 있으나,  
- 현실적으로는 컴퓨터의 메모리와 시스템 스택 한도에 따라 제한된다.  
- 너무 크게 설정하면 강제 종료나 시스템 크러시가 발생할 수도 있다.  
- 일반적으로는 10000회 이하로 제한하는 것이 권장된다.  

```python
from functools import lru_cache
import sys

sys.setrecursionlimit(5000)

@lru_cache(maxsize=None)
def fib(n):
	if n <= 1:
		return n
	return fib(n-1) + fib(n-2)

print(fib(3300))

>> 20404587654072771...
```