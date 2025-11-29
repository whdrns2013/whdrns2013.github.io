---
title: "[통계] 상관계수로 선수의 지표와 연봉 관계 살펴보기" # 제목 (필수)
excerpt: "야구선수의 연봉과 경기력 지표간의 관계" # 서브 타이틀이자 meta description (필수)
date: 2025-11-29 23:01:00 +0900      # 작성일 (필수)
lastmod: 2025-11-29 23:01:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-29 23:01:00 +0900   # 최종 수정일 (필수)
categories: statistics         # 다수 카테고리에 포함 가능 (필수)
tags: 통계 statistic statistics 통계학 표본상관계수 상관계수 sample correlation coefficient  # 태그 복수개 가능 (필수)
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
<!--postNo: 20251129_017-->

## 표본상관계수  

### 정의  

- sample correlation coefficient  
- 두 변수의 관련성의 방향과 정도의 수치를 파악하기 위한 계수  
- 표본상관계수는 -1 ~ 1 사이의 값을 가진다.  
- 1이나 -1 근처에 위치할 때 강한 관련성이 있다고 하며  
- 0에 가까울 수록 관련성이 약한 것이다.  
- 양수인 경우 양의 상관성, 음수인 경우 음의 상관성이다.  
- 양의 상관성은 두 변수 중 하나가 증가할 때 다른 변수도 증가하는 경향을 말하며  
- 음의 상관성은 반대로 하나의 변수가 증가하면 다른 변수는 감소하는 경향을 말한다.  

### 계산식  


$$
r = \frac{\sum_{i=1}^{n}(x_{i}-\bar{x})(y_{i}-\bar{y})}{\sqrt{\sum_{i=1}^{n}(x_{i}-\bar{x})^{2}\sum{_{i=1}^{n}(y_{i}-\bar{y})^{2}}}}
$$

### 예시  

#### 타격 관련 변수와 연봉의 표본상관계수  

|구분|타율|홈런|타점|출루율|장타력|공격공헌도|
|---|---|---|---|---|---|---|
|연봉|0.255|0.236|0.162|0.366|0.231|0.289|

- 출루율과 연봉간 상관계수가 가장 높은 것을 볼 수 있다.  
- 그리고 이들은 모두 양의 상관관계를 가지고 있다.  
- 이는 데이터가 타율, 홈런, 공격공헌도들이 높을수록 연봉이 높은 경향을 보이고 있다는 것을 시사한다.  

#### 투수 관련 변수와 연봉의 표본상관계수  

|구분|평균자책점|이닝당 주자허용률|이닝당 평균삼진수|
|---|---|---|---|
|연봉|-0.097|-0.153|-0.079|

- 이닝당 출루허용률과 연봉 간 상관계수가 가장 높은 것을 볼 수 있다.  
- 그리고 둘 간은 음의 상관성을 보이고 있다.  
- 즉, 데이터가 이닝당 주자허용률이 낮을수록 연봉이 높은 경향읋 보이고 있다는 것을 시사한다.  

## Reference  

[통계로 세상 읽기 - 이긍희, 이기재, 장영재, 박서영, 한종대 공저](https://search.shopping.naver.com/book/catalog/49255953631)  
방송통신대 - 통계로 세상 읽기 강의  

