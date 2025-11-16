---
title: "[C언어] 연산자 05. 대입 연산자"  # 제목 (필수)
excerpt: "좌측 피연산자에 우측 피연산자의 값을 저장하는 연산자" # 서브 타이틀이자 meta description (필수)
date: 2025-11-16 23:58:00 +0900      # 작성일 (필수)
lastmod: 2025-11-16 23:58:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-16 23:58:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 대입 연산자                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251116_014-->  


## 대입 연산자  

### 정의  

- 좌측 피연산자에 우측 피연산자의 값을 저장하는 연산자  
- assignment operator  
- `=` 로 표현한다.  
- **대입 연산자도 연산**이다. 그렇다면 연산의 **결과값**은? 바로 **대입된 값**  

### 좌측 피연산자(l-value)와 우측 피연산자(r-value)  

#### 좌측 피연산자 l-value  

- 대입 연산자의 좌측에 있는 피연산자  
- l-value 라고도 하며, **저장공간**이어야 한다.  
- 즉, 우측 피연산자의 값을 저장할 저장 공간이어야 한다.  

#### 우측 피연산자 r-value  

- 대입 연산자의 우측에 있는 피연산자  
- r-value 라고도 하며, **값**이어야 한다.  
- 즉, 좌측 피연산자의 공간에 저장할 값이어야 한다.  

### 예시  

```c
void assignment_operator(){
    // expr1 = expr2
    // expr1 : l-value : 저장공간
    // expr2 : r-value : 값
    int a = 3;
    printf("a : %d\n", a);
    
    // 대입 연산자의 결과값 = 대입되어 저장된 값이 리턴됨
    int b;
    int c = b = a;
    printf("a : %d / b : %d / c : %d\n", a, b, c);

    // 중간에 다른 자료형이 있는 경우, 원래의 값이 전달됨  
    float d = 1.5f;
	int e;
	float f = e = d;
	printf("d : %f / e : %d / f : %f\n", d, e, f);
}
```

```bash
a : 3
a : 3 / b : 3 / c : 3
d : 1.500000 / e : 1 / f : 1.000000
```

### 대입 연산자의 결과값은 대입된 값이다.  

- **대입 연산자도 연산**이다. 그렇다면 연산의 **결과값**은? 바로 **대입된 값**  

```c
float d = 1.5f;
int e;
float f = e = d;
printf("d : %f / e : %d / f : %f\n", d, e, f);
```

```bash
d : 1.500000 / e : 1 / f : 1.000000
```

(1) e = d : int 형인 e 에 실수형 1.5f 를 대입했으므로, 소수점 아래가 무시된다.  
(2) 따라서 int e 에 대입되는 값은 1  
(3) 실수형 f 에 int 형 1 이 대입되면서, 자동으로 큰 수로 형변환이 이루어진다.  
(4) 따라서 float f 에 대입되는 값은 1.000000  


## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
