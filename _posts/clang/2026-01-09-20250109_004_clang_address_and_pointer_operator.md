---
title: "[C언어] 주소 연산자와 포인터 연산자 그리고 간접 참조(역참조)"  # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2026-01-09 18:05:00 +0900      # 작성일 (필수)
lastmod: 2026-01-09 18:05:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-09 18:05:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 포인터 pointer 주소 연산자 간접 참조 역참조 간접참조       # 태그 복수개 가능 (필수)
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
<!--postNo: 20260109_004-->  

## 주소 연산자와 포인터 연산자  

### 주소 연산자 `&`  

- `&` 는 주소 연산자이다.  
- 이 연산자는 **변수의 주소**를 반환한다.  

```c
void address_operator() {
  int num = 10;
  printf("address of num : %p\n", &num)
}
```

```bash
0x12dcf624c
```

### 참조(포인터) 연산자 `*`  

- `*`는 참조(포인터) 연산자이다.  
- 이 연산자는 **포인터가 가리키는 메모리를 참조(접근)하는 연산**을 수행  
- 즉, **간접 참조(dereference, 역참조)**를 발생시킨다.  

```c
void pointer_operator() {
  int num = 20;
  int *p = &num;
  printf("*p : %d\n", *p);
  printf("p  : %p", p);
}
```

```bash
*p : 20
p  : 0x12dcf624c
```

- 여기서 잘 이해를 해야한다.  
- 먼저, 포인터 자체는 메모리 주소를 저장하고 있다.  

```c
printf("p : %p", p);
// 출력 : p : 0x12dcf624c
```

- 그리고 포인터 연산(`*`)을 하면 해당 변수에 저장된 값에 해당하는 메모리 주소에 접근하게 된다.  

```c
printf("*p : %d", *p);
// 즉, *0x12dcf624c
// 출력 : *p : 20
```

|코드|설명|
|---|---|
|`int *p = 주소값;`|포인터 변수 p의 메모리 주소에 접근해 주소값을 저장|
|`p`|위 식을 통해 포인터 변수 p에 담긴 주소값|
|`*p`|포인터 변수 p가 담고 있는 메모리 주소, 그 주소에 저장된 값|

```plaintext
| variable |   address   |    value    |
| -------- | ----------- | ----------- |
|    num   | 0x12aee284c |      20     | *p
|    ...   |     ...     |     ...     |
|     p    | ??????????? | 0x12aee284c |
|    ...   |     ...     |     ...     |
```

### 포인터의 주소 예시  

```c
void add_and_pointer(){
    int num = 20;
    int *p = &(num);
    printf("num  : %-12d // num 의 값\n", num);
    printf("p    : %-12p // num 의 주소값\n", p);
    printf("*p   : %-12d // num 의 주소에 저장된 값\n", *p);
    printf("&p   : %-12p // p의 주소값\n", &p);
    printf("*&p  : %-12p // p의 주소값에 해당하는 메모리에 담긴 값\n", *&p);
    printf("**&p : %-12d // p의 주소값에 해당하는 메모리에 담긴 값(주소)에 해당하는 메모리에 담긴 값\n", **&p);
}
```

```bash
num  : 20           // num 의 값
p    : 0x12aee284c  // num 의 주소값
*p   : 20           // num 의 주소에 저장된 값
&p   : 0x42ace3241  // p의 주소값
*&p  : 0x12aee284c  // p의 주소값에 해당하는 메모리에 담긴 값
**&p : 20           // p의 주소값에 해당하는 메모리에 담긴 값(주소)에 해당하는 메모리에 담긴 값
```

```plaintext
| variable |   address   |    value    |
| -------- | ----------- | ----------- |
|    num   | 0x12aee284c |      20     |
|    ...   |     ...     |     ...     |
|     p    | 0x42ace3241 | 0x12aee284c |
|    ...   |     ...     |     ...     |
```



## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
