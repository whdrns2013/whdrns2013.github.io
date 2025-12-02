---
title: "[Python] 의미 없는 값을 변수에 넣을 때, 단일 언더스코어" # 제목 (필수)
excerpt: "필요 없는 값을 변수에 할당해야 할 때, 그 변수의 이름으로 사용되는 언더스코어" # 서브 타이틀이자 meta description (필수)
date: 2025-12-02 03:13:00 +0900      # 작성일 (필수)
lastmod: 2025-12-02 03:13:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-02 03:13:00 +0900   # 최종 수정일 (필수)
categories: Python          # 다수 카테고리에 포함 가능 (필수)
tags: typography 파이썬 언더스코어 밑줄 underscore 의미 없는 값                   # 태그 복수개 가능 (필수)
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
  nav: docs_python
---
<!--postNo: 20251202_001-->

## 단일 언더스코어 underscore  

### 정의  

- 필요 없는 값을 변수에 할당해야 할 때, 그 변수의 이름으로 사용된다.  
- 즉 **값을 무시할 때** Throwaway variable 로 사용하며  
- 특히 언패킹이나 반복(iteration) 과정에서 특정 값이 필요하지 않을 때 임시 변수로 사용한다.  

### 문법  

#### 반복문(iteration)에서 변수의 값이 필요하지 않을 때

```python
for _ in range(5):
  print("Hello")
```

#### 언패킹(Unpacking)에서 변수의 값이 필요하지 않을 때  

```python
students = [
  (2012345, "김철수", 30),
  (2016548, "이영희", 25),
  (2065794, "박민수", 35)
]

for _, name, age in students:
  print(f"{name} : {age}")
```

## Reference  

방송통신대 - 오픈소스기반 데이터분석 (정재화)