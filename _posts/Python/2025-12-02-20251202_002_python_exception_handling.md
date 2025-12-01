---
title: "[Python] 파이썬 예외처리 try except finally" # 제목 (필수)
excerpt: "try except finally" # 서브 타이틀이자 meta description (필수)
date: 2025-12-02 03:16:00 +0900      # 작성일 (필수)
lastmod: 2025-12-02 03:16:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-02 03:16:00 +0900   # 최종 수정일 (필수)
categories: Python          # 다수 카테고리에 포함 가능 (필수)
tags: typography 파이썬 예외처리 try except finally                   # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20251202_002-->

## 예외처리 exception handling  

### 정의  

- 코드 실행 중 예기치 않은 오류 발생에 대비하는 코드 작성법  
- 예기치 않은 오류를 예외(exception)로 정의하며  
- 프로그램이 비정상적으로 종료되는 것을 방지한다.  
- `try-except` 문과 `finally` 블록을 사용한다.  

### 예외처리를 하지 않을 경우  

- 오류를 별도로 처리하지 않으면, 런타임 에러로 프로그램이 즉시 종료될 수 있음  
- 이는 사용자 경험 저하, 데이터 손실, 리소스 누수 등의 추가적인 문제를 일으키며  
- 개발자 입장으로도 디버깅을 어렵게 하는 현상으로 여겨진다.  

### 예외처리를 할 경우  

- 런타임 에러로 프로그램이 비정상 종료되는 것을 방지  
- 사용자 및 개발자도 예외처리에서 보이는 에러 힌트를 보고 오류 원인을 유추할 수 있음  

## try-except 문의 사용  

### 기본 문법  

```python
try:
  # 예외가 발생할 수도 있는 코드
except 예외타입:
  # 예외 발생 시 실행할 코드
```

### 예시  

#### 기본적인 try-except

```python
try:
  number = int(input("숫자를 입력하세요"))
  result = 10/number
except ZeroDivisionError:
  print("0으로 나눌 수 없습니다.")
```

#### 예외 타입별로 처리하는 경우   

```python
try:
  number = int(input("숫자를 입력하세요"))
  result = 10/number
except ZeroDivisionError:  # number 가 0인 경우
  print("0으로 나눌 수 없습니다.")
except ValueError:  # 숫자를 입력하지 않은 경우
  print("유효한 숫자를 입력해야 합니다.")
```

#### 동시에 여러 예외 타입을 처리하는 경우   

```python
try:
  number = int(input("숫자를 입력하세요"))
  result = 10/number
except (ZeroDivisionError, TypeError):
  print("입력값이 잘못되었습니다.")
```


#### 모든 타입의 에러를 포괄해 처리하는 경우  

- 그냥 `except` 키워드만 사용한다.  

```python
try:
  number = int(input("숫자를 입력하세요"))
  result = 10/number
except:
  print("오류가 발생했습니다. 확인해주세요.")
```

## Finally 블록  

### 정의  

- 예외 발생 여부와 관계 없이 반드시 실행되는 코드 블록  
- Finally 를 통해 컨텍스트 관리를 하면 타당하다.  

### 문법  

```python
try:
  # 예외가 발생할 수 있는 코드  
except:
  # 예외 발생시 실행할 코드  
finally:
  # 예외 여부에 상관 없이 실행할 코드
```

### 예시  

```python
try:
  file = open("data.csv", "r")
  content = file.read()
  print(content)
except FileNotFoundError:
  print("파일을 찾을 수 없습니다.")
finally:
  print("파일 작업 종료")
  file.close()
```


## Reference  

방송통신대 - 오픈소스기반 데이터분석 (정재화)