---
title: 머신러닝 소개 # 제목 (필수)
excerpt: 머신러닝의 정의, 필요성, 활용분야  # 서브 타이틀이자 meta description (필수)
date: 2024-10-21 00:30:00 +0900      # 작성일 (필수)
lastmod: 2024-10-21 00:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-10-21 00:30:00 +0900   # 최종 수정일 (필수)
categories: AI        # 다수 카테고리에 포함 가능 (필수)
tags: ai artificial intelligence machine learning deep 인공지능 머신러닝 기계학습 딥러닝      # 태그 복수개 가능 (필수)
classes:        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20241021_001-->  

## 머신러닝  

### 머신러닝에 대한 정의  

Machine Learning 직역하면 "기계 학습"을 의미하며, 개념적으로는 인간이 가진 고유의 지능적 기능 중 하나인 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>학습 능력을 기계를 통해 구현</span>하기 위한 접근 방법이다.  

또한 실무적으로 접근했을 때의 머신 러닝은, 주어진 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>데이터를 분석해 그로부터 일반적인 규칙(패턴)이나 새로운 지식</span>을 기계 스스로가 자동으로 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>추출하도록</span> 하는 접근 방법이다.  


![](/assets/images/20241021_001_001.png)  

조금 더 자세히 들여다보면 위와 같다.  

사람이 직접 문제 해결에 대한 모델 (문제 해결을 추상화한 방법)을 만들 때에는, 문제에 대한 파악과 도메인에 대한 이해, 그리고 문제 해결을 위한 알고리즘 제작을 모두 사람이 맡아서 진행하여야 한다.  

반면 머신러닝의 경우, 충분한 양의 데이터 덩어리가 있다면, 문제 파악을 통해 포착한 방향으로 기계가 데이터를 통해 스스로 학습할 수 있도록 한다. 기계는 학습을 위한 알고리즘(학습 알고리즘)을 사용하여 데이터 덩어리 속에서 일반화 된 규칙(패턴)을 파악하거나 새로운 지식을 추출한다.  

### 머신러닝의 필요성  

-문제 해결을 위한 명시적인 처리 과정의 나열 (=알고리즘 구축)이 사람이 직접 하기 어렵거나 현실적으로 불가능한 문제를 해결하기 위함  
-데이터의 변형(잡음, 인공적 요소 등)이 굉장히 많이 존재하며, 그 한계를 정하기 힘든 문제들에 대한 해결 (얼굴인식, 숫자인식 등)  

### 머신러닝이 활용되는 분야  

-얼굴인식 등 생체인식  
-필기체 문자 인식  
-음성 인식  
-스팸 이메일 필터링  
-문서 분류 및 인식  
-주식시장 예측  
-질병의 진단 및 위험도 예측  
-홈쇼핑 고객의 취향분석 및 상품 추천  
-유전자 데이터 분석  
-자율 주행 시스템  
-금융 데이터 분석  

## Referebce  

머신러닝 (이관용, 박혜영 공저)  
[SK하이닉스 - All Around AI 1편 AI의 시작과 발전 과정, 미래 전망](https://news.skhynix.co.kr/post/all-around-ai-1)  
