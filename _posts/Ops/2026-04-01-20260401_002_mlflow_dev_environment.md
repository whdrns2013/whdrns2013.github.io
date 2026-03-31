---
title: "[MLflow] 환경 준비" # 제목 (필수)
excerpt: "MLflow Server Side, Client Side에 대한 환경 준비" # 서브 타이틀이자 meta description (필수)
date: 2026-04-01 02:28:00 +0900      # 작성일 (필수)
lastmod: 2026-04-01 02:28:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-04-01 02:28:00 +0900   # 최종 수정일 (필수)
categories: Ops         # 다수 카테고리에 포함 가능 (필수)
tags: AI 인공지능 머신러닝 ML machine learning mlflow 환경 준비                     # 태그 복수개 가능 (필수)
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
  nav: docs_mlflow
pinned: 
---
<!--postNo: 20260401_002-->

## 환경 소개  

- 본 포스팅 시리즈의 개발 환경은 다음과 같다.  
- 비슷한 스펙이면 된다.  

#### MLflow 의 버전  

- 3.10.1    

#### Server Side(Tracking Server)  

|구분|개발 환경|권장 환경|
|---|---|---|
|OS|Ubuntu 22.04|리눅스 계열(Ubuntu 권장)|
|CPU|Intel N100|MLflow 공식 권장사양 확인 안됨<br>직접 해본 결과, 저전력 N100 CPU 도 되니, 웬만한 환경에서는 가능할 듯|
|RAM|32GB|MLflow 공식 권장사양 확인 안됨<br>실험 결과 Tracking Server 컨테이너만 띄우면 100MB 수준|
|STORAGE|SSD 1TB|MLflow Docker : 약 800MB<br>그 외 실험하고자 하는 모델의 종류와 수에 따라 다름|

#### Client Side  

|구분|개발 환경|권장 환경|
|---|---|---|
|OS|MacOS 26|개발 및 CLI가 가능한 환경이면 상관 없음|
|CPU|M2|상동|
|RAM|16GB|상동|
|STORAGE|256GB|상동|


