---
title: "[통계] 산포" # 제목 (필수)
excerpt: "데이터가 평균 주변에서 얼마나 흩어져 있는지" # 서브 타이틀이자 meta description (필수)
date: 2025-11-21 00:50:00 +0900      # 작성일 (필수)
lastmod: 2025-11-21 00:50:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-21 00:50:00 +0900   # 최종 수정일 (필수)
categories: statistics         # 다수 카테고리에 포함 가능 (필수)
tags: 통계 statistic statistics 통계학 산포 dispersion                   # 태그 복수개 가능 (필수)
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
<!--postNo: 20251121_010-->


## 산포  

### 정의  

- 데이터가 평균 주변에서 얼마나 흩어져 있는지를 나타낸 것.  

### 산포가 왜 필요할까?  

평균 수심이 1m인 하천이 있다고 가정해보면, 겉보기에는 안전해 보일 수 있다. 하지만 어떤 구간은 수심이 20cm, 어떤 구간은 5m라면 이야기가 달라진다. 평균만 보면 안전해 보이지만, 실제로는 특정 구간에서 위험할 수 있다.

즉, 중심 위치는 전체 상황을 대표하지 못하는 경우가 많다. 때문에, 데이터가 얼마나 퍼져 있는지, 즉 흩어짐의 정도(산포)를 함께 봐야 실제 상황을 올바르게 이해할 수 있다.  

### 산포의 종류  

| 종류   | 설명                                                   |
| ---- | ---------------------------------------------------- |
| 범위   | 데이터의 최소~최대 범위를 뜻한다.<br>최대값에서 최소값을 차감하는 것으로 계산할 수 있다. |
| 분산   | (관찰값 - 평균)의 제곱 합을 (데이터수 - 1)로 나눈 것                   |
| 표준편차 | 분산을 제곱근한 것                                           |


## Reference  

[통계로 세상 읽기 - 이긍희, 이기재, 장영재, 박서영, 한종대 공저](https://search.shopping.naver.com/book/catalog/49255953631)  
방송통신대 - 통계로 세상 읽기 강의  