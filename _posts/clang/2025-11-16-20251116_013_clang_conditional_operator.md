---
title: "[C언어] 연산자 04. 조건 연산자"  # 제목 (필수)
excerpt: "조건문의 결과에 따라 대입할 값이나 실행할 수식을 선택할 수 있는 연산자" # 서브 타이틀이자 meta description (필수)
date: 2025-11-16 23:57:00 +0900      # 작성일 (필수)
lastmod: 2025-11-16 23:57:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-16 23:57:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 조건 연산자                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251116_013-->  


## 조건 연산자  

### 정의  

- 조건문의 결과에 따라 대입할 값이나 실행할 수식을 선택할 수 있는 연산자  
- `?` 와 `:` 로 표현한다.  

```c
expr1 ? expr2 : expr3
// expr1 : 조건식
// expr2 : 조건식이 참일 때의 값
// expr3 : 조건식이 거짓일 때의 값
```

### 예시  

```c
void conditional_operator(){
	
	// 표준 형식
    int a = 1;
    int b = 2;
    int max = a > b ? a : b;
    println_int("the max is %d\n", max);

    // 수식을 담는 경우
    int c = 1;
    int d = 2;
    c > d ? d++ : c++;
    printf("c's value : %d / d's value : %d", c, d);
}
```

```bash
the max is 2 # b 의 값이 출력됨
c's value : 2 / d's value : 2 # c 가 증가됨
```




## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
