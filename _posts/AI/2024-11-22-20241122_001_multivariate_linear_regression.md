---
title: 회귀 모델 - 다변량 선형 회귀 # 제목 (필수)
excerpt: # 서브 타이틀이자 meta description (필수)
date: 2024-11-23 13:30:00 +0900      # 작성일 (필수)
lastmod: 2024-11-23 13:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-23 13:30:00 +0900   # 최종 수정일 (필수)
categories: AI         # 다수 카테고리에 포함 가능 (필수)
tags: AI 머신러닝 회귀 regression 다변량 선형                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20241122_001-->


## 다변량 선형 회귀  

### 개념  

- 다변량 : 입력값 x 가 여러 개의 값(특징)으로 이루어진 경우  
- 선형 회귀 : 입력값 x와 출력값 y 간의 매핑 함수  
- ex. 입력값 : 나이, 몸무게 / 출력값 : 수축기 혈압  


### 초평면 (hyperplane)  

- 초평면이란 기하학에서 n차원 공간에서의 n-1차원 부분 공간을 의미하는 단어이다.  
- 예를 들어 3차원에서의 초평면은 2차원 평면 형태가 될 것이다.  
- 2차원에서의 초평면은 1차원인 선 형태가 될 것이다.  
- 1차원에서의 초평면은 0차원인 점 형태가 될 것이다.  

### 그래프에서의 다변량 선형 회귀 표현  

- 단변량 화귀함수 (입력값 x 가 한 종류인 선형회귀)의 경우 입력값 x와 출력값 y 를 그래프로 표현하면 직선 형태가 된다.  
- 입력값이 2가지 종류인 경우(이변량) x0, x1, y 세 가지가 그래프로 표현되고, 이때의 회귀함수는 평면으로 표현된다. (아래 예시)  
- 결론적으로 다변량 회귀함수는 `f(x) = w0 + w1x1 + w2x2 + ... + wnxn`으로 나타낼 수 있으며, 그래프에서 n+1차원(x개 + 출력값 1개) 공간에서의 n차원 부분공간(초평면으)로 나타난다.  

![](/assets/images/20241122_001_001.png)

## 다변량 선형 회귀의 행렬 표현과 최적해 구하기  

### 다변량 선형 회귀의 행렬 표현  

다변량 선형 회귀, 즉 n개의 변수와 상수값(절편) 으로 이루어진 함수를 효율적으로 다루기 위해 행렬 형태 식으로 표현할 수 있다. 

![](/assets/images/20241122_001_002.png)  

![](/assets/images/20241122_001_003.png)  

이에 대한 오차함수와, 최적의 w 행렬을 구하기 위해 편미분한 수식은 아래와 같다.  

![](/assets/images/20241122_001_004.png)  

![](/assets/images/20241122_001_005.png)  

편미분한 식을 정리하면  

![](/assets/images/20241122_001_006.png)  

이 식에서 X와 y는 데이터로부터 얻을 수 있기 때문에, 최적 파라미터 w의 값을 얻을 수 있다.  


## Reference  


[머신러닝 (이관용, 박혜영 공저)](https://search.shopping.naver.com/book/catalog/33751852618?cat_id=50005558&frm=PBOKPRO&query=머신러닝+이관용&NaPm=ct%3Dm3hfzyhc%7Cci%3D228c56736e9b189c35b08cbd8c5ddb7f9e67e63e%7Ctr%3Dboknx%7Csn%3D95694%7Chk%3D8bfde20797c97955dc000ea62799753a0da42a06)  

