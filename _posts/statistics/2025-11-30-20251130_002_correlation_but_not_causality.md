---
title: "[통계] 인과관계가 없는 상관관계" # 제목 (필수)
excerpt: "두 변수 간에 통계적으로 유의한 상관(+) 또는 (–) 관계가 존재하지만, 한 변수가 다른 변수를 직접적으로 원인으로 만든다고 설명할 수 없는 관계" # 서브 타이틀이자 meta description (필수)
date: 2025-11-30 00:30:00 +0900      # 작성일 (필수)
lastmod: 2025-11-30 00:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-30 00:30:00 +0900   # 최종 수정일 (필수)
categories: statistics         # 다수 카테고리에 포함 가능 (필수)
tags: 통계 statistic statistics 통계학 인과관계 상관관계  # 태그 복수개 가능 (필수)
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
<!--postNo: 20251130_002-->

## 인과관계가 없는 상관관계  

### 정의  

- 두 변수 간에 통계적으로 유의한 상관(+) 또는 (–) 관계가 존재하지만, 한 변수가 다른 변수를 직접적으로 원인으로 만든다고 설명할 수 없는 관계  

### 예시  

#### 니콜라스 케이지의 연간 영화 출연 수와 미국 수영장 익사자 수  

![](/assets/images/20251130_002_001.png)

<center>연도에 따른 니콜라스 케이지가 출연한 영화의 수와, 미국 수영장에서 익사한 사람의 수 그래프</center>  

- 상당히 유사한 경향을 보여주고 있다.  
- 하지만 상식적으로, 두 변수 간의 인과관계가 있다고 생각하기는 힘들다.  

### 인과관계가 없는 상관관계의 종류  

|종류|설명|
|---|---|
|우연|두 변수 간 인과관계가 없이 우연히 상관관계를 보이는 경우|
|선택편향|모집단 내의 실제 상관관계와 표본에서 나타나는 상관관계가 다른 경우|
|교란작용|변수 X와 Y에 영향을 주는 제 3의 변수가 존재하여, X-Y간 인과관계가 없더라도 상관관계가 관측되는 현상|


## Reference  

[통계로 세상 읽기 - 이긍희, 이기재, 장영재, 박서영, 한종대 공저](https://search.shopping.naver.com/book/catalog/49255953631)  
방송통신대 - 통계로 세상 읽기 강의  

