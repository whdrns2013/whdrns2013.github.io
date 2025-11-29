---
title: "[통계] 통계적 가설검정의 방법들 - 유의성 검정과 최강력 검정" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-29 17:26:00 +0900      # 작성일 (필수)
lastmod: 2025-11-29 17:26:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-29 17:26:00 +0900   # 최종 수정일 (필수)
categories: statistics         # 다수 카테고리에 포함 가능 (필수)
tags: 통계 statistic statistics 통계학 fisher neyman pearson                 # 태그 복수개 가능 (필수)
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
<!--postNo: 20251129_003-->

## 가설 검정의 방법의 종류  

|기설 검정의 방법|설명|
|---|---|
|유의성 검정|유의확률이 유의수준보다 낮은 경우 귀무가설을 기각한다.|
|최강력 검정|동일한 유의수준에서 검정력이 최대가 되도록 설계된 가장 효율적인 검정 방법|

## 유의성 검정  

### 정의  

- 유의확률(p-value)이 사전에 정한 유의수준(α)보다 작으면 귀무가설을 기각하는 검정 방법.  

### 설명  

- R.A. Fisher 가 제안한 가설 검정의 방법이다.  
- 귀무가설을 기각하느냐 기각하지 않느냐만을 보는 검정 방법  
- 귀무가설만 필요  

## 최강력 검정  

### 정의  

- 동일한 유의수준 조건에서 대립가설을 가장 잘 검출(기각)할 수 있도록 설계된 검정 방법.  

### 설명  

- Neyman, Pearson 이 제안한 검정 방법  
- p-value 중심의 유의성 검정과 달리, 오류 통제와 검정력(파워)에 초점을 둠  
- 검정력(Power) : 대립가설이 참일 때, 이를 탐지해내 귀무가설을 기각할 확률 = 참인 대립가설을 찾아낼 확률  
- 검정력은 "참일 확률"이 아니라 탐지 능력(detection ability)  
- 유의확률이 작지만 유의수준 이상이라 귀무가설을 기각할 수 없는 경우, 어떤 가설을 참이라고 할 수 있는가? 라는 의문에서 시작  
- 최강력 검정은 가능도비(likelihood ratio)를 바탕으로 도출함  
- 귀무가설과 대립가설이 모두 필요  

### 유의성 검정 + 최강력 검정  

- Fisher 사후, 통계적 가설검정을 할 때에는 두 방법을 혼합해서 많이 이용힌다.  


## Reference  

[통계로 세상 읽기 - 이긍희, 이기재, 장영재, 박서영, 한종대 공저](https://search.shopping.naver.com/book/catalog/49255953631)  
방송통신대 - 통계로 세상 읽기 강의  

