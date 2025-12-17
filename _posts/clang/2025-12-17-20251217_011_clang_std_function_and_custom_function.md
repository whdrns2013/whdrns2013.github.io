---
title: "[C언어] 표준 함수와 사용자 정의 함수"  # 제목 (필수)
excerpt: "C 언어에서 자체적으로 제공하는 함수, 혹은 사용자가 필요에 의해 직접 정의하는 함수" # 서브 타이틀이자 meta description (필수)
date: 2025-12-17 22:49:00 +0900      # 작성일 (필수)
lastmod: 2025-12-17 22:49:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-17 22:49:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 표준함수 include 내장함수            # 태그 복수개 가능 (필수)
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
<!--postNo: 20251217_011-->  

## 표준 함수  

### 정의  

- C 언어 자체에서 제공하는 함수들  
- 프로그램 작성에 필요한 기본 기능을 제공한다.  
- 표준 라이브러리 형태로 제공된다.  
- 사용하기 위해 표준함수의 원형이 선언되어 있는 헤더파일을 미리 포함(`#include`)해야 한다.  

### 주요 표준함수  

|헤더파일|선언된 함수|함수 예|
|---|---|---|
|stdio.h|입출력 함수|printf(), scanf(), getchar(), putchar() 등|
|stdio.h|파일 관련 함수|fopen(), fclose(), fprintf() 등|
|string.h|문자열 처리 함수|strcmp(), strlen(), strcpy(), strcat() 등|
|math.h|수학 함수|sqrt(), sin(), cos(), tan(), log(), pow() 등|
|ctype.h|문자 형태 판별|isalpha(), isdigit(), islower(), isupper() 등|
|ctype.h|문자 변환 함수|tolower(), toupper() 등|
|stdlib.h|수치 변환 함수|atoi(), strtol() 등|
|stdlib.h|난수 관련 함수|rand(), srand() 등|
|stdlib.h|메모리 관련 함수|malloc(), free(), qsort() 등|

### 사용 예  

```c
#include <stdio.h>
#include <math.h>
#include <stdlib.h>

int main() {
    double x = 12.34;
    int i = -5, j = 2;
    int a, b, c;
    a = (int)ceil(x);
    b = (int)floor(x);
    c = (int)pow(4, j);
    printf("abs(-5) = %d\n", abs(i));
    printf("ceil(12.34) = %d\n", a);
    printf("floor(12.34) = %d\n", b);
    printf("cos(10) = %f\n", cos(10));
    printf("exp(2) = %f\n", exp(j));
    printf("sqrt(2) = %f\n", sqrt(j));
    printf("pow(4, 2) = %d\n", c);
    return EXIT_SUCCESS;
}
```


## 사용자 정의 함수  

### 정의  

- 사용자가 필요에 따라 특정 기능을 수행하도록 정의한 함수  

### 함수 정의 형식  

```c
return_type function_name(type_a param1, type_b param2 ...) {   // ==> 함수 헤더
    type1 local_var1;                                           // ==> 함수 몸체(이하)
    type2 local_var2;                                           // 
    ...                                                         // 
    statement1;                                                 // 
    statement2;                                                 // 
    ...                                                         // 
    return expr_return;                                         // 
}

// return_type : 반환 자료형 (expr_return 의 자료형)
// function_name : 함수명  
// param1, param2 : 매개변수  
// type_a, type_b : 매개변수의 타입  
// local_var : 지역변수
// statement : 기능 수행 문장
// expr_return : 반환값
```

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
