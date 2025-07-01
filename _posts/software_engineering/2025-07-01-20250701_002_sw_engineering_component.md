---
title: "[소프트웨어 공학] 컴포넌트" # 제목 (필수)
excerpt: 배포 가능한 가장 작은 단위, 컴포넌트  # 서브 타이틀이자 meta description (필수)
date: 2025-07-01 12:30:00 +0900      # 작성일 (필수)
lastmod: 2025-07-01 12:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-07-01 12:30:00 +0900   # 최종 수정일 (필수)
categories: software_engineering        # 다수 카테고리에 포함 가능 (필수)
tags: 소프트웨어 공학 소프트웨어공학 용어 컴포넌트                     # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20250701_002-->


## 컴포넌트  

### ✅ 정의  

> 독립적으로 배포될 수 있는, 재사용 가능한 소프트웨어의 단위  

- (1) 소프트웨어의 **독립적인 배포 단위**  
- (2) 명확한 **인터페이스를 통해 접근할 수 있는 기능을 제공**해야 함.  
- (3) 다른 페이지나 기능에서도 **재사용이 가능해야** 함  
- (4) 내부 구현은 **캡슐화**되어있음.  
- 모듈에 비해 **배포나 교체 단위**로 강조되는 용어  
- **독립적**이어야 하므로, 다른 컴포넌트에 의존하면 안된다.  
- 인터페이스를 통해 컴포넌트 간 통신을 수행한다.  
- 서브시스템이 존재한다면, 컴포넌트는 서브시스템을 구성하는 단위다.  
- 독립적으로 배포할 수 있는 가장 작은 단위  

### ✅ 예시  

- 장바구니 컴포넌트 : 상품 추가/삭제, 수량 조절 기능  
- 추천 상품 컴포넌트 : 사용자 구매 이력 기반 추천 기능  
- 로그인 컴포넌트 : 사용자 인증 처리 기능  
- 상품 검색 컴포넌트 : 키워드 검색, 필터링 기능 등  

### 컴포넌트 설계의 원칙  

- (1) REP 

#### REP 재사용 / 릴리즈 등가 원칙  

> 재사용 단위는 릴리즈 단위와 같다.  



## 컴포넌트 기반 개발 (CBD) 방법론  




## Reference  

[https://hwannny.tistory.com/32](https://hwannny.tistory.com/32)  
