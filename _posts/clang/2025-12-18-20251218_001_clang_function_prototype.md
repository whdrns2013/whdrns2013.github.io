---
title: "[C언어] 함수의 원형"  # 제목 (필수)
excerpt: "함수의 인터페이스를 명시하는 문장" # 서브 타이틀이자 meta description (필수)
date: 2025-12-18 07:04:00 +0900      # 작성일 (필수)
lastmod: 2025-12-18 07:04:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-18 07:04:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 함수의 원형 함수의원형 함수 prototype of function            # 태그 복수개 가능 (필수)
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
<!--postNo: 20251218_001-->  


## 함수의 원형  

### 개념  

- function prototype  
- 함수의 반환 자료형, 함수의 이름, 매개변수 자료형을 명시한 문장  
- 함수의 본문을 제외한 다른 부분을 명시하는 것으로, "함수의 헤더" 부분에 해당한다.  
- 즉, **함수의 인터페이스**를 선언하는 것이다.  

### 함수의 원형을 사용하는 이유  

- 함수를 알림 : 컴파일러가 함수에 대해 인식하도록 알린다.  
- 인터페이스 : 함수의 사용법을 미리 알게 하여,오류를 방지한다.  

### 문법  

```c
// 함수의 원형 선언
int proto_2(int a, int b); // 함수의 헤더 부분만 선언한다. 작동 방식은 뒤에서 정의한다.
int proto_1(int, int);     // 매개변수 이름은 중요하지 않다.

int main(){
  ...
}

int proto_1(int a, int b){  // 함수의 몸체를 정의
  return a+b;
}

int proto_2(int x, int y){  // 매개변수 이름은 바뀌어도 상관 없다.
  return x - y;
}
```

- 함수의 헤더 부분을 선언하면 된다.  
- 매개변수의 경우 자료형만 중요하며, 매개변수 이름은 부여하지 않아도 된다.  


## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
