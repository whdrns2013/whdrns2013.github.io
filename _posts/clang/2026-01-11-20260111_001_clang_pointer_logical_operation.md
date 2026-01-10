---
title: "[C언어] 포인터 연산자의 논리적 처리 과정"  # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2026-01-11 01:00:00 +0900      # 작성일 (필수)
lastmod: 2026-01-11 01:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-11 01:00:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 포인터 pointer 연산 논리적 처리 과정 연산자 주소 할당 값       # 태그 복수개 가능 (필수)
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
<!--postNo: 20260111_001-->  

## 포인터 연산자의 논리적 처리 과정  

### 예시 코드  

```c
int a, b, c;
int *p;
a = 5000;
p = &a;
b = *p;
p = &c;
*p = 100;
```

#### 1. 포인터에 주소값 할당  

```c
int a, b, c;
int *p;
a = 5000;
p = &a;
```

- int 형 변수 a, b, c 를 선언했고, 변수 a 의 주소값을 포인터변수 p 에 할당했다.  
- 위 코드가 종료된 뒤 메모리 상황은 아래와 같다.  

```plaintext
| variable | address | value |
|     a    |   200   | 5000  |
|     p    |   201   | 200   | # 값 할당
```

#### 2. 변수에 포인터를 통한 값 할당  

```c
int a, b, c;
int *p;
a = 5000;
p = &a;
b = *p;
```

- 이어서 int 형 변수 b 에 포인터 변수 p 가 가리키는 메모리에 저장된 값을 할당했다.  
- 위 코드가 종료된 뒤 메모리 상황은 아래와 같다.  

```plaintext
| variable | address | value |
|     a    |   200   | 5000  |
|     p    |   201   | 200   |
|     b    |   202   | 5000  | # 값 할당
```

#### 3. 포인터변수가 가리키는 주소값 변경  

```c
int a, b, c;
int *p;
a = 5000;
p = &a;
b = *p;
p = &c;
```

- 이어서 포인터변수 p 가 가리키는 메모리 주소값을 변수 c 의 메모리 주소값으로 변경함  
- 위 코드가 종료된 뒤 메모리 상황은 아래와 같다.  

```plaintext
| variable | address | value |
|     a    |   200   | 5000  |
|     p    |   201   | 203   | # 변경
|     b    |   202   | 5000  |
|     c    |   203   | ....  |
```

#### 4. 포인터변수가 가리키는 주소에 저장된 값 변경  

```c
int a, b, c;
int *p;
a = 5000;
p = &a;
b = *p;
p = &c;
*p = 100;
```

- 이어서 현재 포인터변수가 가리키는 메모리공간에 저장되는 값을 100으로 변경했다.  
- 위 코드가 종료된 뒤 메모리 상황은 아래와 같다.  

```plaintext
| variable | address | value |
|     a    |   200   | 5000  |
|     p    |   201   | 203   |
|     b    |   202   | 5000  |
|     c    |   203   | 100   | # 값 할당
```



## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
