---
title: "[C언어] 함수의 구조"  # 제목 (필수)
excerpt: "헤더, 몸체, 반환부로 이루어진 C 언어의 함수 구조" # 서브 타이틀이자 meta description (필수)
date: 2025-12-17 22:53:00 +0900      # 작성일 (필수)
lastmod: 2025-12-17 22:53:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-17 22:53:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 함수 구조 function structure             # 태그 복수개 가능 (필수)
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
  nav: docs_clang
---
<!--postNo: 20251217_012-->  

## 함수의 구조  

### 함수의 전체 구조  

```c
int sum(int a, int b) { // 헤더, 매개변수
    int d;              // 몸체
    d = a + b;          // 몸체
    return d;           // 반환
}
```

- 헤더, 몸체, 반환부로 이루어진다.  
- 반환부는 보통 몸체에 포함하기도 한다.  

### 함수 헤더  

#### 기초 문법  

- 반환 자료형, 함수명, 매개변수 리스트를 차례대로 작성한다.  

```c
// 문법
ret_type func_name(parm_type param1, ...);

// 예시
int add_function(int a, int b);
```

#### 반환 자료형  

- 함수의 처리 결과로 반환할 값(return value)의 자료형을 지정한다.  
- 만약 반환하는 값이 없다면 `void` 키워드를 명시한다.  
- C 언어 초기에는 int 형을 return 하는 게 기본이었으나, C99 부터 `void` 변환 자료형은 return 을 생략할 수 있따.  

#### 함수명  

- 함수를 식별하거나 호출할 때 사용되는 명칭이다.  
- 기본적으로 "의미 있는 함수명"을 사용하는 것을 권장한다.(함수 이해도에 영향)  

#### 매개변수  

- 피호출 함수에 자료를 전달하기 위해 선언된 변수  
- 함수 내에서는 지역변수처럼 사용된다.  
- 매개변수가 여러 개일 경우, 콤마(,)로 구분하여 나열한다.  
- 매개변수가 없는 경우, **공란 또는 void**로 표기한다.  

```c
// int 형 매개변수 하나, char 형 매개변수 하나
void main(int a, char b);

// 매개변수 없음
void some(void);
```


### 함수 몸체  

#### 정의  

- 함수의 기능을 수행하는 문장들의 집합  
- 기능을 수행하는 식을, 그리고 수행 결과를 반환하고 호출 지점으로 복귀하는 return 명령문으로 구성된다.  

#### 형식  

```c
int sum(int a, int b) {
    int d;          // 지역변수
    d = a + b;      // 기능 수행  
    return d;       // return 반환값  
}
```

- 중괄호를 이용해 블록을 구성한다.  
- 함수 안에서 선언된 지역변수는 함수 안에서만 사용할 수 있다.  
- `return` 명령은 함수를 호출한 곳으로 **복귀**를 지시하는 키워드이다.  
- void형 함수가 아닌 경우, 반환 자료형의 식을 반환하다.  

### 결과값의 반환  

#### 함수 실행의 종료  

|종류|설명|
|---|---|
|함수의 마지막 문장 실행|함수의 마지막 문장 실행|
|return 명령의 실행|함수 실행의 결과값을 반환하고, 함수를 호출한 곳으로 복귀|

#### return 문을 이용한 결과값 반환 형식  

```c
int main() {
    expression;
    return return_expr_ret;
}
```

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
