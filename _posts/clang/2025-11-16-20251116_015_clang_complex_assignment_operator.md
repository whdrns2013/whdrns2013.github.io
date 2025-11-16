---
title: "[C언어] 연산자 06. 복합 대입 연산자"  # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-16 23:59:00 +0900      # 작성일 (필수)
lastmod: 2025-11-16 23:59:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-16 23:59:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 복합 대입 연산자                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251116_015-->  


## 복합 대입 연산자  

### 정의  

- 대입 연산자와 또 다른 연산자를 붙여서 사용하는 연산자  
- 2항 연산자의 좌측 피연산자에 연산 결과를 대입한다.  

```c
expr1 op= expr2;
// op : +, -, *, /, %, <<, >>, &, ^, | 연산자
// 위 수식은 expr1 = expr1 op expr2 와 같다.  
```

### 종류  

| 연산자   | 풀이              | 설명                    |
| ----- | --------------- | --------------------- |
| `+=`  | e1 = e1 + e2    | 덧셈과 대입연산자의 결합         |
| `-=`  | e1 = e1 - e2    | 뺄셈과 대입연산자의 결합         |
| `*=`  | e1 = e1 * e2    | 곱셈과 대입연산자의 결합         |
| `/=`  | e1 = e1 / e2    | 나눗셈과 대입연산자의 결합        |
| `%=`  | e1 = e1 % e2    | 나머지 연산과 대입연산자의 결합     |
| `<<=` | e1 = e1 << e2   | 비트연산(제곱)과 대입연산자의 결합   |
| `>>=` | e1 = e1 >> e2   | 비트연산(2나눗셈)과 대입연산자의 결합 |
| `&=`  | e1 = e1 & e2    | 비트연산(AND)과 대입연산자의 결합  |
| `^=`  | e1 = e1 ^ e2    | 비트연산(XOR)과 대입연산자의 결합  |
| `\|=` | e1 = e1 `\|` e2 | 비트연산(OR)과 대입연산자의 결합   |

### 예시  

```c
void complex_assignment_operator(){
	int a = 10, b = 3, c = 1, d=3;
	a *= b - 1;
	b /= 2 + 3;
	c += 2;
	d ^= 2;
	printf("a : %d, b : %d, c : %d, d : %d\n", a, b, c, d);
}
```

```bash
a : 20, b : 0, c : 3
```

> 참고 : d XOR 연산  
> d (3) 의 이진수 표현 :   0011  
> 2 의 이진수 표현       :   0010  
> `------------------------`  
>                   0001  

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
