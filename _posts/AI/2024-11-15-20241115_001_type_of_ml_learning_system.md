---
title: 머신러닝 학습 시스템의 유형 # 제목 (필수)
excerpt: 지도학습 비지도학습 준지도학습 강화학습  # 서브 타이틀이자 meta description (필수)
date: 2024-11-15 00:30:00 +0900      # 작성일 (필수)
lastmod: 2024-11-15 00:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-15 00:30:00 +0900   # 최종 수정일 (필수)
categories: AI        # 다수 카테고리에 포함 가능 (필수)
tags: 지도학습 비지도학습 준지도학습 강화학습 ai artificial intelligence machine learning deep 인공지능 머신러닝 기계학습 딥러닝       # 태그 복수개 가능 (필수)
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
<!--postNo: 20241115_001-->   

## 머신러닝 학습 시스템  

### 머신러닝 학습 시스템  

컴퓨터가 데이터를 통해 학습하여, 예측을 하거나 결정을 내리는 데 도움을 줄 수 있도록 하는 방법론과 알고리즘의 집합. 학습의 궁극적인 목표는 앞으로 주어질 새로운 데이터에 대해 이러한 예측이나 의사결정에 도움을 주는 성능을 최대화 하는 것이다.  


### 머신러닝 학습 시스템의 유형  

|유형|원어|설명|
|---|---|---|
|지도학습|supervised learning|- 학습 과정에서 데이터(입력값)과 그에 대한 목표 출력값(정답)이 함께 제공되는 형태<br>- 목표 출력값이 교사(supervisor)와 같이 학습의 방향을 지도한다<br>- 분류 및 회귀 문제에 적합한 방법<br>- 지도학습을 위해서는 목표 출력값이 필요하며, 목표 출력값을 레이블링 하는 데에는 비용이 발생할 수 있다.|
|비지도학습|unsupervised learning|- 학습 과정에서 목표 출력값 없이, 입력값만 주어지는 형태<br>- 군집화 문제에 적합|
|준지도학습|semi-supervised learning|- 지도학습과 비지도학습을 섞어놓은 형태<br>- 지도학습에서 발생하는 비용을 최소화하는 방법<br>- 입력-출력 데이터 쌍이 있는 데이터들과, 입력값만 있는 데이터 모두를 학습에 활용한다<br>- 이러한 준지도 학습이 학습 정확도에서 상당히 좋음이 확인되었다.|
|강화학습|reinforcement learning|- 출력값에 대해 "좋다/나쁘다" "성공/실패"와 같은 교사 신호를 줌<br>- 이러한 교사 신호는 보상(reward)와 같은 것으로 보면 된다.<br>- 교사 신호는 정확한 값이 아니고, 즉시 주어지는것이 아님<br>- 최근 들어 딥러닝에서 많이 사용되는 방법|
|약지도학습|weakly supervised learning|- 부정확한 레이블도 부여해서 학습에 사용하는 방법|
|자기지도학습|self supervised learning|- 학습 데이터에 레이블을 스스로 부여한 뒤<br>- 지도 또는 비지도 학습으로 실제 모델을 학습<br>- 최근 뛰어난 결과를 보여주고 있음<br>- 낮은 품질의 데이터로 학습해도 결과물의 품질을 높일 수 있음<br>- 인간이 사물을 분류하는 방법을 밀접하게 모방한 학습법|


## Reference  

[머신러닝 (이관용, 박혜영 공저)](https://search.shopping.naver.com/book/catalog/33751852618?cat_id=50005558&frm=PBOKPRO&query=머신러닝+이관용&NaPm=ct%3Dm3hfzyhc%7Cci%3D228c56736e9b189c35b08cbd8c5ddb7f9e67e63e%7Ctr%3Dboknx%7Csn%3D95694%7Chk%3D8bfde20797c97955dc000ea62799753a0da42a06)  
[Wikipedia - 준지도 학습](https://ko.wikipedia.org/wiki/준지도_학습)  
[Wikipedia - 자기지도 학습](https://ko.wikipedia.org/wiki/자기_지도_학습)  
  