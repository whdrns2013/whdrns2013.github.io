---
title: "[Python] String Formatting - 문자열 형식 지정" # 제목 (필수)
excerpt: # 서브 타이틀이자 meta description (필수)
date: 2025-12-01 12:30:00 +0900      # 작성일 (필수)
lastmod: 2025-12-01 12:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-01 12:30:00 +0900   # 최종 수정일 (필수)
categories: Python          # 다수 카테고리에 포함 가능 (필수)
tags: typography 파이썬 문자열 스트링 형식 포맷 지정 포매팅 포맷팅 string formatting format                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251201_005-->

## String Formatting  

### 정의  

- 문자열 형식 지정, String Formatting  
- 변수 값을 포함한 문자열을 생성하는 데 사용됨  

### 방법  

|No|방법|
|---|---|
|1|C 스타일의 %연산자 formatting|
|2|str.format()메서드를 이용한 formatting|
|3|f-string formatting|

### C 스타일의 % 연산자   

- C 언어의 printf() 스타일과 유사한 formatting 방법  
- 장점 : C언어를 배운 사람이라면 쉽게 이해하고 사용함  
- 단점 : 변수의 개수가 증가할 수록 복잡성 증대, 가독성 저하  
- 단점 : 딕셔너리, 리스트 등 중첩된 데이터 구조를 직접 활용하기 어려움  

```python
# 문법 형식
"형식 지정자를 포함한 문자열" % (변수 리스트)
```

|형식 지정자|설명|
|---|---|
|%d|정수(decimal) 출력|
|%i|정수(integer) 출력 : %d와 동일|
|%o|8진수 출력|
|%x|16진수 출력 (lower case)|
|%X|16진수 출력 (upper case)|
|%f|소수점이 있는 실수 출력|
|%.nf|소수점 이하 n자리까지 출력|
|%c|단일 문자 출력|
|%s|문자열 출력|
|%%|%문자 자체를 출력|
|...||

```python
# 예제  
item = "프린터"
price = 360000
print("상품명 : %s, 가격 : %d" % (item, price))
>> 상품명 : 프린터, 가격 : 360000
```

### str.format() 메서드  

- 중괄호 `{}`를 자리표시자로 이용해 문자열 내의 변수의 위치를 표현하는 방법  
- String 클래스의 메서드 중 하나  
- 장점 : 형식 지정자를 지정하지 않아도 돼서 간편  
- 장점 : % 연산자 방식보다 가독성이 낫고 유연함  
- 단점 : 변수의 개수가 증가할 수록 복잡성 증대, 가독성 저하

```python
# 문법 1
"{} 를 포함한 문자열".format(변수1, 변수2 ...)

# 문법 2
"{0}번 변수와 {1}번 변수 같이 순서를 지정".format(변수1, 변수2 ...)

# 문법 3
"{item} 상품은 {price}원 과 같이 변수를 지정".format(item, price)
```

```python
# 예제 1
item = "프린터"
price = 360000
print("상품명 : {}, 가격 : {}".format(item, price))
>> 상품명 : 프린터, 가격 : 360000

# 예제 2
item = "프린터"
price = 360000
print("상품명 : {0}, 할인 가격 : {1}".format(item, int(price * 0.8)))
>> 상품명 : 프린터, 할인 가격 : 288000

# 예제 3
item_name = "프린터"
print("상품명 : {item}, 원래 가격 : {price:,}, 할인 가격 : {sale:.2f}, 소비세 : {tax:.1%}".format(item=item_name, price=3500, sale=3500*0.7189, tax=0.1))
>> 상품명 : 프린터, 원래 가격 : 3,500, 할인 가격 : 2516.15, 소비세 : 10.0%
```

### f-string  

- 파이썬 3.6버전부터 도입된 문자열 formatting 방식  
- 문자열 앞에 f 또는 F 접두사를 붙이고, 문자열 내부에 중괄호(`{}`)를 사용해 변수나 수식을 표현  
- 문자열 형식을 지정할 때에는 콜론(`:`) 을 붙이고, 그 뒤에 형식 지정  
- 장점 : 직관적, 코드 길이 단축, 가독성 향상  

```python
f"문자열 {수식}"
```

```python
# 예제 1
item = "프린터"
price = 360000
print(f"상품명 : {item}, 가격 : {price}")
>> 상품명 : 프린터, 가격 : 360000

# 예제 2
item = "프린터"
price = 360000
print(f"상품명 : {item}, 할인 가격 : {int(price*0.8)}")
>> 상품명 : 프린터, 할인 가격 : 288000

# 예제 3
item_name = "프린터"
print(f"상품명 : {item_name}, 원래 가격 : {3500:,}, 할인 가격 : {3500*0.7189:.2f}, 소비세 : {0.1:.1%}")
>> 상품명 : 프린터, 원래 가격 : 3,500, 할인 가격 : 2516.15, 소비세 : 10.0%
```


## Reference  

방송통신대 - 오픈소스기반 데이터분석 (정재화)