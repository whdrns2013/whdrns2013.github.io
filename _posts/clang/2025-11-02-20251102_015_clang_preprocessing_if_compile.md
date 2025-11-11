---
title: "[C언어] 선행처리 3.조건부 컴파일" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-02 02:10:00 +0900      # 작성일 (필수)
lastmod: 2025-11-02 02:10:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-02 02:10:00 +0900   # 최종 수정일 (필수)
categories: clang        # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 선행처리 선행처리기 preprocessing preprocess preprocessor 조건부컴파일 조건부 컴파일 compile if                   # 태그 복수개 가능 (필수)
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
<!--postNo: 20251102_015-->


## 조건부 컴파일  

### 정의  

- `#if`, `#elif`, `#else`, `#endif` 등의 지시어와 해당 지시어가 가리키는 조건에 따라, 컴파일할 코드를 선택할 수 있게 하는 기능이다.  
- 이 때 if 등의 뒤에 오는 조건문은 반드시 참(True, 1 이상의 정수)과 거짓(False, 0)중 하나의 결과값을 가져야 한다.  

### 사용법  

```c
#if 조건문
코드... // if 조건문에 해당하는 경우 실행됨

#elif 조건문
코드... // if 조건문에 해당하지 않고, elif 조건문에 해당하는 경우 실행됨

#else
코드... // if, elif 조건문에 모두 해당되지 않을 경우 실행됨

#endif // 조건부 컴파일 문 종료
```

### 예시  

- 아래와 같은 예시 코드가 있다고 해보자.  

```c
#define DEBUG_MODE ?
#define HONEY_POT ?
// 4가지 경우의 수 테스트 DEBUG 1/0 HONEY_POT 1/0

int main(){
#if DEBUG_MODE
    int a = 10, b = 20;
#elif HONEY_POT
    int a = 10, b = 10;
#else
    int a = 1, b = 2;
#endif
    printf("a * b = %d", a * b);
    return EXIT_SUCCESS;
}
```

`DEBUG_MODE` 와 `HONEY_POT` 의 값에 따라 main 함수의 출력값은 아래와 같이 달라진다.  

| DEBUG_MODE | HONEY_POT | 출력값           |
| ---------- | --------- | ------------- |
| 1          | 0         | `a * b = 200` |
| 0          | 1         | `a * b = 100` |
| 1          | 1         | `a * b = 200` |
| 0          | 0         | `a * b = 2`   |

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
