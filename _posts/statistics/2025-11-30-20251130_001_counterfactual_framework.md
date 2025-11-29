---
title: "[통계] 반사실체계 counterfactual framework" # 제목 (필수)
excerpt: "잠재적 결과(potential outcome)라는 개념을 이용해 인과관계를 설명하는 체계" # 서브 타이틀이자 meta description (필수)
date: 2025-11-30 00:11:00 +0900      # 작성일 (필수)
lastmod: 2025-11-30 00:11:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-30 00:11:00 +0900   # 최종 수정일 (필수)
categories: statistics         # 다수 카테고리에 포함 가능 (필수)
tags: 통계 statistic statistics 통계학 잠재적 결과 potential outcome 반사실체계 counterfactual framework 랜덤화 randomization   # 태그 복수개 가능 (필수)
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
<!--postNo: 20251130_001-->

## 반사실체계  

### 정의  

- counterfactual framework  
- 인과관계를 정의하는 여러가지 방법 중 하나  
- 잠재적 결과(potential outcome)라는 개념을 이용해 인과관계를 설명한다.  

### 잠재적 결과  

- potential outcome  
- 어떠한 사건 X에 따라 일어나는 **잠재적 사건 Y**를 뜻한다.  

> 예시  
> 섭취 열랑 X 가 3,000kcal일 때 체중증가량이 2kg라는 사실관계가 있다.  
> 반사실체계에서는 이를 "X=3,000kcal 일 때 체중증가량의 잠재적 결과는 2kg이다"라고 표현한다.  
> 그리고 X=2,000kcal 일 때의 체중증가량의 잠재적 결과는 또 다를 수 있다.  

### 반사실체계의 한계점  

- 현실에서는 오로지 하나의 X값에 대해 하나의 잠재적 결과만 관측할 수 있다.  
- X=3,000kcal 일 때와 X=4,000kcal 일 때의 잠재적 결과를 동시에 둘 다 관측하는 것은 불가능  
- 따라서 대부분의 상황에서 반사실체계를 이용해 인과관계를 증명하는 것은 매우 어렵다.  

> 예시  
> 오늘 나라는 사람이 하루에 3,000kcal 을 섭취하거나, 4,000kcal 을 섭취하는 두 가지 경험을 모두 다 할수는 없다.  

### 랜덤화  

- randomization  
- 실험 대상을 무작위로 배정해 교란변수가 실험군과 통제군에 모두 고르게 분포해, 교란변수의 영향을 최소화하는 방법  
- 랜덤화를 한 임상시험 결과를 통계적으로 추정하여 반사실체계의 한계를 극복하고 인과관계를 성립시킬 수 있다.  
- 하지만 이 랜덤화도 윤리적 문제, 현실적 문제로 인해 쉽지 않다.  
- 이에 대해서는 추후에 포스팅한다.  

> 예시 : 모유수유와 인지기능 간의 인과관계  
> 연구참여자를 랜덤하게(참여자의 모든 특성이 균일하게 섞이도록) 두 그룹으로 나눈다.  
> 한 그룹은 모유수유를 하게 하고, 다른 그룹은 분유만 먹게 한다.  
> 수개월 또는 수년 뒤 인지기능 측정을 비교한다.  
> 이러한 랜덤화는 불가능 : 윤리적 문제, 연구 참여자의 순응도  
> 따라서 모유수유와 인지기능 간 인과관계를 완벽하게 밝히기는 아직은 불가능  

## Reference  

[통계로 세상 읽기 - 이긍희, 이기재, 장영재, 박서영, 한종대 공저](https://search.shopping.naver.com/book/catalog/49255953631)  
방송통신대 - 통계로 세상 읽기 강의  

