---
title: 지식그래프 개요 # 제목 (필수)
excerpt: 객체지향적인 데이터 관리 방법 # 서브 타이틀이자 meta description (필수)
date: 2024-04-07 22:30:00 +0900      # 작성일 (필수)
lastmod: 2024-04-07 22:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-04-07 22:30:00 +0900   # 최종 수정일 (필수)
categories: KnowledgeGraph         # 다수 카테고리에 포함 가능 (필수)
tags: 지식그래프 knowledgegraph knowledge graph kbqa sparql rml r2rml          # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20240407_001-->

## 지식 그래프란?  

### 지식 그래프의 개념  

지식그래프란 사물이나 개념간의 관계를 나타내는 방법의 하나입니다. 그래프 DB 형태로 데이터를 관리하는, “객체지향적인 데이터 관리 방법” 이라고도 말할 수 있습니다. 각 데이터 객체는 속성(property)과 속성에 대한 속성값(value)를 가지며, 다른 데이터 객체와 관계를 가질 수 있습니다.

### 지식 그래프의 장점  

사람의 지식체계와 비슷하게 표현되기 때문에, RDB와 같은 관계형 데이터베이스보다 데이터를 유연하게 저장, 관리할 수 있으며, 각 데이터 객체 간의 관계를 직관적으로 시각화 할 수 있다는 장점이 있습니다.  

### 지식 그래프 활용 분야  

지식그래프는 검색 엔진, 자연어 처리 및 질의 시스템(문장을 기반으로 자연어 모델에게 자료 제공), 추천 시스템, 소셜 네트워크 분석(사용자 간 관계 모델링, 네트워크 구조 분석) 등의 넓은 분야에서 사용됩니다.  


## 지식그래프 구축 순서  

(1) 요구사항 분석  
(2) 데이터 수집 및 정형화  
(3) 데이터 모델링 (그래프 DB 스키마 설계)  
(4) 데이터 변환 및 적재 (정형화 데이터 -> 그래프 DB)  
(5) KBQA 구축  


## Reference  

지식그래프의 정의 : [https://boardmix.com/kr/](https://boardmix.com/kr/skills/what-is-knowledge-graph/)  
그래프 데이터베이스 : [https://d2.naver.com/helloworld/8446520](https://d2.naver.com/helloworld/8446520)  