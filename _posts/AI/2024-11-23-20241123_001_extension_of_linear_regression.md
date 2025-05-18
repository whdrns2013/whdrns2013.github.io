---
title: 회귀 모델 - 선형 회귀의 확장 # 제목 (필수)
excerpt: # 서브 타이틀이자 meta description (필수)
date: 2024-11-23 14:30:00 +0900      # 작성일 (필수)
lastmod: 2024-11-23 14:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-23 14:30:00 +0900   # 최종 수정일 (필수)
categories: AI         # 다수 카테고리에 포함 가능 (필수)
tags: AI 머신러닝 회귀 regression 선형 회귀 비선형 선형화                      # 태그 복수개 가능 (필수)
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
<!--postNo: 20241123_001-->

## 선형회귀의 확장  

### 선형회귀의 확장이란  

입력값 x와 출력값 y의 관계를 선형으로 매핑할 수 없는 문제에 대해, 데이터들을 선형회귀로 표현할 수 있게, `적절히 선형화(linearization) 과정을 거쳐` x' 와 y'로 변형ㄴ한 후, 이들의 매핑 관계를 설명하는 선형 항수 `y' = mx' + b` 를 찾는 방식을 의미한다.  

즉, 데이터를 선형회귀에 맞추는 방법!  

### 선형회귀의 확장 방법  

데이터의 분포 및 입출력 매핑 형태에 따라서 선형회귀의 확장은 여러 가지 방법을 적용한다.  

|선형화 방법|설명|
|---|---|
|(1) 데이터에 자연로그를 취해 선형화|지수함수와 같은 데이터 형태에 대해 자연로그를 취해 선형화|
|(2) 데이터에 로그를 취해 선형화|거듭제곱과 가튼 데이터 형태에 대해 로그를 취해 선형화|
|(3) 데이터에 역수를 취해 선형화|포화된 증가 형태 데이터에 대해 역수를 취해 선형화|
|(4) 다항 회귀|고차 다항식 사용한 회귀 방법|
|(5) 비선형 입력 변환함수를 사용한 선형회귀|비선형 기저 함수 사용|
|(6) 비선형 회귀|신경망과 같은 복잡한 비선형함수를 사용하는 방법<br>커널을 이용해 고차원 공간으로 매핑하는 SVM적용|

![](/assets/images/20241123_001_001.png)  

## Reference  


[머신러닝 (이관용, 박혜영 공저)](https://search.shopping.naver.com/book/catalog/33751852618?cat_id=50005558&frm=PBOKPRO&query=머신러닝+이관용&NaPm=ct%3Dm3hfzyhc%7Cci%3D228c56736e9b189c35b08cbd8c5ddb7f9e67e63e%7Ctr%3Dboknx%7Csn%3D95694%7Chk%3D8bfde20797c97955dc000ea62799753a0da42a06)  

