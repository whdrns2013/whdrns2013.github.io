---
title: "[C언어] 자료형 01. 정수형" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-02 01:05:00 +0900      # 작성일 (필수)
lastmod: 2025-11-02 01:05:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-02 01:05:00 +0900   # 최종 수정일 (필수)
categories: clang        # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 자료형 데이터타입 datatype data type 정수형 int short shortint long longint longlong longlongint 숫자                    # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20251102_002-->


## 정수형  

### 정의  

- Integer  
- 정수 형태의 값을 표현한다.  
- signed (부호가 있는) 형과 unsigned (부호가 없는) 형으로 표현할 수 있다.  
- 기본적으로는 signed 형태로 사용된다.  

### 참고 - 정수형의 크기  

- 정수형은 메모리의 크기가 확정되어 있지는 않다.  
- 특히 `int`형의 경우, C 언어를 구현하는 컴퓨터에서 가장 효율적으로 처리할 수 있는 정수형을 가리킨다.  
- 즉, `int` 형은 컴퓨터에 따라 `short int`  일 수도 있고, `long int`나 `long long int`일 수도 있다.  

### 정수형 자료형 정리  

| 구분  | 자료형           | 설명                                                                                                                  | 크기        |
| --- | ------------- | ------------------------------------------------------------------------------------------------------------------- | --------- |
| 정수형 | short int     | 작은 정수를 담는 자료형<br>0 ~ 65,535<br>-32,768 ~ 32,767                                                                     | 2         |
|     | int           | 일반적인 정수를 담는 자료형<br>컴퓨터에서 가장 효율적으로 연산할 수 있는 크기를 가진다.<br>                                                             | 2, 4, 8.. |
|     | long int      | 큰 정수를 담는 자료형<br>컴퓨터 아키텍처에 따라 4 또는 8바이트를 가진다.<br>아래는 4바이트인 경우<br>0 ~ 4,294,967,295<br>-2,147,483,648 ~ 2,147,483,647 | 4, 8..    |
|     | long long int | 매우 큰 정수를 담는 자료형<br>0 ~ 18,466,744,073,709,551,615<br>(부호 있는 경우는 생략)                                                 | 8         |

### 정수형 알아보기  

#### short int  

- `short int` 혹은 `short` 라고 표현한다.  
- `unsigned short` 은 부호가 없는 short int 형이다.  
- 출력할 때에는 `%d`로 표현한다.  

```c
// short int (signed) 범위
short int min_short_int = SHRT_MIN;
short max_short_int = SHRT_MAX;
printf("short int 자료형의 범위(s) : %d, %d\n", min_short_int, max_short_int);

>> short int 자료형의 범위(s) : -32768, 32767

// short int (unsigned) 범위
unsigned short min_ushort_int = 0;
unsigned short max_ushort_int = USHRT_MAX;
printf("short int 자료형의 범위(us) : %d, %d\n", min_ushort_int, max_ushort_int);

>> short int 자료형의 범위(us) : 0, 65535

// short int 의 크기(메모리)
short shrt;
printf("short int 의 size : %d\n", sizeof(shrt));

>> 2
```

#### int  

- `int` 라고 표현한다.  
- int 형은 C 언어를 구현하는 컴퓨터가 가장 효율적으로 처리할 수 있는 메모리 크기를 가진다.  
- 출력할 때에는 `%d`(signed) 또는 `%u`(unsigned) 로 표현한다.  
- 내 경우, int 형이 4바이트를 표현하게 되어 있다.  

```c
// int (signed) 범위
int min_int = INT_MIN;
int max_int = INT_MAX;
printf("int 자료형의 범위(s) : %d, %d\n", min_int, max_int);

>> int 자료형의 범위(s) : -2147483648, 2147483647
  
// int (unsigned) 범위
unsigned int min_uint = 0;
unsigned int max_uint = UINT_MAX;
printf("int 자료형의 범위(us) : %u, %u\n", min_uint, max_uint);

>> int 자료형의 범위(us) : 0, 4294967295

// int 의 크기(메모리)
int intig;
printf("int 의 size : %d\n", sizeof(intig));

>> int 의 size : 4
```

#### long int  

- `long` 혹은 `long int` 라고 표현한다.  
- 4바이트를 가지며, 큰 정수를 담을 때 사용한다.  
- 출력할 때에는 `%ld`(signed) 또는 `%lu`(unsigned)로 표현한다.  
- 내 경우, long int 형이 8바이트만큼의 범위를 표현한다.  

```c
// long int (signed) 범위
long int min_long_int = LONG_MIN; // long int 로 써도 되고
long max_long_int = LONG_MAX; // long 으로 써도 됨
printf("long int 자료형의 범위(s) : %ld, %ld\n", min_long_int, max_long_int);

>> long int 자료형의 범위(s) : -9223372036854775808, 9223372036854775807  

// long int (unsigned) 범위
long min_ulong_int = 0;
long max_ulong_int = ULONG_MAX;
printf("long int 자료형의 범위(us) : %lu, %lu\n", min_ulong_int, max_ulong_int);

>> long int 자료형의 범위(us) : 0, 18446744073709551615

// long int 의 크기(메모리)
long lint;
printf("long int 의 size : %d\n", sizeof(lint));

>> long int 의 size : 8
```

#### long long int  

- `long long` 혹은 `long long int` 로 표현한다.  
- 8바이트를 가지며, 매우 큰 정수를 담을 때 사용한다.  
- 출력할 때에는 `%lld`(signed) 또는 `%llu`(unsigned)로 표현한다.  

```c
// long long int (signed) 범위
long long int min_long_long_int = LLONG_MIN; // long long int 로 써도 되고
long long max_long_long_int = LLONG_MAX; // long long 으로만 써도 됨
printf("long long int 자료형의 범위(s) : %lld, %lld\n", min_long_long_int, max_long_long_int);

>> long long int 자료형의 범위(s) : -9223372036854775808, 9223372036854775807

// long long int (unsigned) 범위
long long min_ulong_long_int = 0;
long long max_ulong_long_int = ULLONG_MAX;
printf("long long int 자료형의 범위(us) : %llu, %llu\n", min_ulong_long_int, max_ulong_long_int);

>> long long int 자료형의 범위(us) : 0, 18446744073709551615

// long long int 의 크기(메모리)
long long llint;
printf("long long int 의 size : %d\n", sizeof(llint));

>> long long int 의 size : 8
```

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  

