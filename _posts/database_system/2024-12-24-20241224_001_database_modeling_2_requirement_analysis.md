---
title: 데이터베이스 모델링 (2) 사용자 요구사항 분석의 개념과 과정 # 제목 (필수)
excerpt: 명확한 요구사항 분석은 신속하고 정확한 데이터베이스 구축의 첫 단추 # 서브 타이틀이자 meta description (필수)
date: 2024-12-24 00:15:00 +0900      # 작성일 (필수)
lastmod: 2024-12-24 00:15:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-12-24 00:15:00 +0900   # 최종 수정일 (필수)
categories: database_system       # 다수 카테고리에 포함 가능 (필수)
tags: database data system 데이터베이스 모델링 사용자 요구사항 분석 정의 명세                     # 태그 복수개 가능 (필수)
classes: wide       # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20241224_001-->
 

## 사용자 요구사항 분석  

![](/assets/images/20241224_001_001.png)  

### 사용자 요구사항 분석의 개념  

사용자 요구사항 분석은 데이터베이스 모델링에서 가장 선행되는 단계로, `실세계의 사용자나 비즈니스 프로세스, 조직에서 필요로 하는 바를 파악하고, 명세 및 정의하는 단계`를 말한다.  

이를 위해 제안요청서 분석, 사용자 인터뷰, 설문조사나 기존 시스템에 대한 분석 등의 활동을 진행하고, 이를 통해 `요구사항 명세서`와 `요구사항 정의서` 등의 산출물이 만들어진다.  

### 사용자 요구사항 분석의 필요성  

어떤 프로그램을 만든다고 했을 때, 요구되는 기능과 목적이 불분명한 경우를 생각해보자. 우리는 과연 어떤 프로그램을 만들어야 할까? 일단 막연하고, 적절한 설계에 어려움을 느낄 것이다.  

비슷하게 데이터베이스 혹은 데이터베이스 시스템을 만들 때에도 `수요자의 명확한 요구사항과 목적`이 필요하고, 이는 `결과물의 완성도와 신뢰도 및 만족도`를 높여주고, 더욱 `신속하고 정확한` 데이터베이스 구축으로 이어지게 된다.  

기술의 발전과 더불어 데이터베이스의 구조가 점차 복잡해지고, 수명 주기가 단축되는 상황 하에서 명확하지 않은 요구사항을 바탕으로 데이터베이스를 구축할 경우, 데이터베이스 구축이 느려질 뿐만 아니라 구축 후에도 추가되는 요구사항들로 인해 유지 보수에 들어가는 시간도 길어질 것이다. 그리고 이에 따라 사용자는 사용자대로 불편하고, 개발사는 개발사대로 수익성이 악화되는 크나큰 문제를 초래할 수 있다.  

### 사용자 요구사항 분석의 목적  

(1) 데이터베이스 시스템의 대상이 되는 업무를 분석하고  
(2) 이를 토대로 신속하고 효과적으로 업무 처리를 지원하는 데이터베이스를 구축하고  
(3) 나아가 필요한 데이터를 저장하고 운용할 수 있는 구조 개발로 이어지도록 함  

### 사용자 요구사항 분석의 단계  

![](/assets/images/20241224_001_002.png)  

|단계|설명|대표 방법|산출물|
|---|---|---|---|
|요구사항 도출|- 초기 요구사항을 확인/수집하고 이를 구체적으로 문서화 하는 단계<br>- 제안 요청서(RFP) 기반 인터뷰 등을 진행한다.<br>- 이를 통해 개발 관점에서의 요구사항을 새롭게 도출하게 된다.|- 제안 요청 분석<br>- 인터뷰<br>- 기존 시스템 분석|요구사항 명세서|
|요구사항 분석|- 도출된 요구사항의 명확성, 완전성, 모호성을 검증한다.<br>- 실현 가능성을 검토하고, 불완전한 부분은 요구사항 도출단계를 재수행한다.<br>- 정리된 내용을 요구사항을 분류하여 통합 또는 분리한다<br>- 즉, 기존에 업무별로 정리된 내용을 개발 관점의 기능별 항목들로 재정리한다.||요구사항 정의서|
|요구사항 기록(검증)|- 요구사항 목록을 정리하고, 관리자로부터 승인을 얻는 단계이다.<br>- 고객과 공유하여 완전성을 검토하기도 한다.<br>- 정리되고 승인받은 요구사항을 형식에 맞춰 문서화한다.|||
|요구사항 관리|- 요구사항이 반영됐는지 여부를 추적하고 관리하는 단계<br>- 요구사항 기록(검증) 단계에 포함시키기도 하는 단계이다.|||


## Reference  

[데이터베이스시스템 (정재화 저)](https://search.shopping.naver.com/book/catalog/3247843974)  