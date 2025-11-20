---
title: "[통계] 표준편차" # 제목 (필수)
excerpt: "데이터가 평균을 중심으로 얼마나 흩어져 있는가" # 서브 타이틀이자 meta description (필수)
date: 2025-11-21 01:05:00 +0900      # 작성일 (필수)
lastmod: 2025-11-21 01:05:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-21 01:05:00 +0900   # 최종 수정일 (필수)
categories: statistics         # 다수 카테고리에 포함 가능 (필수)
tags: 통계 statistic statistics 통계학 표준편차 standard deviation std                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251121_013-->


## 표준편차  

### 정의  

- 데이터가 평균을 중심으로 얼마나 흩어져 있는가를 나타내는 지표  

### 계산법  

- 분산을 제곱근한다.  

#### 표본집단의 표준편차  

$$
s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}
$$


#### 모집단의 표준편차  

$$
\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(x_i - \mu)^2}
$$



### 예시  


```c
데이터 : 10, 20, 30, 6, 0, -6
평균 = (10 + 20 + 30 + 6 + 0 -6)/6 = 10
분산 = ((10 - 10)^2 + (20 - 10)^2 + ... + (-6 - 10)^2)/(6 - 1)
    = ((0)^2 + (10)^2 + ... + (-16)^2)/5
    = (0 + 100 + ... + 256)/5
    = 872/5
    = 174.4
표준편차 = 174.4^(1/2)
       = 13.20605922
```


### 분산이 있는데 왜 표준편차를 계산할까?  

분산은 "오차를 제곱"해서 합하므로, 데이터 각각의 값들과 다른 단위의 값을 보여준다. 예를 들어 데이터의 단위가 $cm$ 라면, 분산의 단위는 $cm^2$가 된다. 이렇게 단위가 달라지면, 데이터가 얼마나 퍼져있다는 것인지 직관적으로 알기가 쉽지 않다.  

따라서 분산의 단위를 다시 원래 데이터 단위로 되돌려, 해석을 훨씬 쉽게 만들기 위해 만들어진 통계량이 바로 표준편차인 것이다. 표준편차는 원래 데이터의 단위($cm$) 와 동일하기 때문에, 퍼짐 정도에 대해 직관적으로 알 수 있다.  


## Reference  

[통계로 세상 읽기 - 이긍희, 이기재, 장영재, 박서영, 한종대 공저](https://search.shopping.naver.com/book/catalog/49255953631)  
방송통신대 - 통계로 세상 읽기 강의  