---
title: "[C언어] 연산자 02. 관계 연산자"  # 제목 (필수)
excerpt: "피연산자에 대한 대소 관계를 비교하는 연산자" # 서브 타이틀이자 meta description (필수)
date: 2025-11-16 23:54:00 +0900      # 작성일 (필수)
lastmod: 2025-11-16 23:54:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-16 23:54:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 관계 연산자                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251116_011-->  


## 관계 연산자  

### 정의  

- 피연산자에 대한 대소 관계를 비교하는 연산자  
- relational operator  
- **결과는 bool 값** 즉, 참(0이 아닌 값) 또는 거짓(0) 으로 표현된다.  

### 종류  

| 연산자                  | 의미         | 사용 예   |
| -------------------- | ---------- | ------ |
| `==`                 | 같음         | a == b |
| `!=`                 | 다름         | a != b |
| `>`, `>=`, `<`, `<=` | 대, 소 관계 비교 | a >= b |

### 예시  

```c
void relational_operator(){
    int a = 10;
    int b = 11;
    int c = 10;

    if (a == b) {           // 거짓
        println("a == b");
    }
    else if (a != b) {      // 참
        println("a != b");
    }

    if (b > c) {            // 참
        println("b > c");
    }
    else if (b < c ){       // 거짓
        println("b < c");
    }

    if ((a >= c) && (b > a)) {  // 모두 참
        println("a >=c and b > a");
    }
}
```

```bash
a != b
b > c
a >=c and b > a
```




## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
