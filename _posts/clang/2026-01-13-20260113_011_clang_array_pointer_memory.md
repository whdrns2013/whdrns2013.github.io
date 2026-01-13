---
title: "[C언어] 배열과 포인터의 기억공간 확보"  # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2026-01-13 21:48:00 +0900      # 작성일 (필수)
lastmod: 2026-01-13 21:48:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-13 21:48:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 배열 포인터 메모리 기억공간       # 태그 복수개 가능 (필수)
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
<!--postNo: 20260113_011-->  


## 배열과 포인터의 기억공간 확보  

### 배열의 기억공간 확보  

- 배열은 고정적인 기억공간을 확보한다.  
- 배열은 선언 시점에 필요한 저장공간이 한 번에 할당된다.  
- 예를 들어 `int A[5]`는 프로그램 시작 시점에 이미 5개의 int 공간이 고정 크기로 확보된다.  
- 따라서 배열은 크기가 변하지 않으며, 미리 정해진 공간을 그대로 사용한다.  

### 포인터의 기억공간 확보  

- 포인터 자체는 주소를 저장할 뿐이다.  
- 여기에 `malloc` 같은 동적 메모리 할당을 사용하면 기억공간을 유동적으로 확보할 수 있다.  
- 필요할 때만 자료용 기억 공간을 확보할 수 있으므로, 자료의 개수가 가변적인 경우 유용하다.  

> 포인터가 배열에 비해 다양한 용도로 활용하기 더 적합함  

### 예시  

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};        // 배열은 크기가 고정된다
    int *pt = NULL;                      // 포인터는 주소만 저장한다
    int n = 3;                           // 필요한 자료 개수를 입력받았다고 가정한다

    pt = (int*)malloc(sizeof(int) * n);  // 필요한 만큼만 동적으로 공간을 확보한다
    pt[0] = 10;
    pt[1] = 20;
    pt[2] = 30;

    printf("arr[0] = %d\n", arr[0]);     // 고정 배열 출력이다
    printf("pt[0] = %d\n", pt[0]);       // 동적 메모리 출력이다

    free(pt);                            // 동적 메모리는 반드시 해제한다
    return 0;
}
```

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
