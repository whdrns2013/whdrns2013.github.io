---
title: "[Python] 함수형 프로그래밍" # 제목 (필수)
excerpt: "무상태(stateless), 불변성(Immutability)을 지향하는 프로그래밍" # 서브 타이틀이자 meta description (필수)
date: 2025-12-02 06:00:00 +0900      # 작성일 (필수)
lastmod: 2025-12-02 06:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-02 06:00:00 +0900   # 최종 수정일 (필수)
categories: Python          # 다수 카테고리에 포함 가능 (필수)
tags: typography 파이썬 함수형 프로그래밍 함수형프로그래밍 무상태 불변성 funtional programming fp                  # 태그 복수개 가능 (필수)
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
<!--postNo: 20251202_004-->


## 함수형 프로그래밍  

### 정의  

- Functional Programming, FP  
- 상태(state)와 가변 데이터(Mutability)를 멀리하는 프로그래밍 패러다임의 하나  
- 즉, 상태를 저장하지 않는 무상태(stateless), 불변성(Immutability)을 지향한다.  
- 데이터 변경을 최소화하고, 순수 함수를 활용해 부작용을 줄이는 게 목표

|용어|영문|정의|
|---|---|---|
|순수 함수|pure function|같은 입력에 대해 항상 같은 출력을 반환하는 함수|
|부작용|side effect|함수가 원래 목적의 값을 계산하는 것 외에 외부에 영향을 미치는 모든 행위|

### 파이썬에서의 함수형 프로그래밍  

- 파이썬은 절차적, 객체지향, 함수형 프로그래밍 방식을 모두 지원  

### 함수형 프로그래밍의 장점  

- 코드의 가독성이 높아짐  
- 디버깅이 용이  
- 병렬처리를 효율적으로 수행할 수 있음  

### 함수형 프로그래밍의 단점  

- 객체지향이나 명령형 프로그래밍에 익숙한 경우, 진입장벽이 존재  
- 사고방식 자체를 전환해야 하므로 초기 진입 장벽이 높음  
- 모나드나 펑터와 같은 고차원적 개념이 이해하기 어려움  

## Reference  

방송통신대 - 오픈소스기반 데이터분석 (정재화)  

[https://ko.wikipedia.org/wiki/함수형프로그래밍](https://ko.wikipedia.org/wiki/%ED%95%A8%EC%88%98%ED%98%95_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)  
