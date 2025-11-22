---
title: "[통계] 조건부 확률" # 제목 (필수)
excerpt: "어떤 사건 B에 대한 어떠한 정보가 주어진 상황에서 구한 사건 A의 확률" # 서브 타이틀이자 meta description (필수)
date: 2025-11-22 18:15:00 +0900      # 작성일 (필수)
lastmod: 2025-11-22 18:15:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-22 18:15:00 +0900   # 최종 수정일 (필수)
categories: statistics         # 다수 카테고리에 포함 가능 (필수)
tags: 통계 statistic statistics 통계학 확률 probability 조건부 확률 조건부확률 conditional                   # 태그 복수개 가능 (필수)
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
  nav: docs_statistics
---
<!--postNo: 20251122_004-->


## 조건부 확률  

### 정의  

- 어떤 사건 B에 대한 어떠한 정보가 주어진 상황에서 구한 사건 A의 확률  
- 어떤 사건이 이미 일어났다는 정보를 알고 있을 때, 다른 사건이 일어날 확률  

### 계산식  

$$
P(A|B) = \frac{P(A\cap B)}{P(B)}
$$

- $A$ : 현재 관심이 있는 사건  
- $B$ : 정보가 주어진, 이미 일어난 사건  
- $P(A)$ : 사건 A 가 일어날 확률  
- $P(B)$ : 사건 B 가 일어날 확률  
- $P(A \cap B)$ : 사건 A 와 사건 B 가 동시에 일어날 확률  

### 예시  

#### 주사위  

- 1~6의 눈을 가진 6면체 주사위에서 1이 나올 확률 : 1/6  
- 1, 2, 3이 2면 씩 있는 주사위 -> 1이 나올 확률 : 1/3  

#### 폐질환과 흡연  

|구분|폐질환|양호|계|
|---|---|---|---|
|흡연자|70|330|400|
|비흡연자|30|1570|1600|
|계|100|1900|2000|

- 어떤 사람이 폐질환이 있을 확률 : 100/2000  
- 어떤 사람이 흡연자라면 폐질환이 있을 확률 : 70/400  


## Reference  

[통계로 세상 읽기 - 이긍희, 이기재, 장영재, 박서영, 한종대 공저](https://search.shopping.naver.com/book/catalog/49255953631)  
방송통신대 - 통계로 세상 읽기 강의  
[https://m.blog.naver.com/mmysmmys/222009435301](https://m.blog.naver.com/mmysmmys/222009435301)  