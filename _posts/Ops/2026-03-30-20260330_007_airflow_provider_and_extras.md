---
title: "[Airflow] 05. 에어플로우 Provider 와 Extras" # 제목 (필수)
excerpt: "Airflow 에 추가기능을 장착하기" # 서브 타이틀이자 meta description (필수)
date: 2026-03-30 01:12:00 +0900      # 작성일 (필수)
lastmod: 2026-03-30 01:12:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-03-30 01:12:00 +0900   # 최종 수정일 (필수)
categories: Ops         # 다수 카테고리에 포함 가능 (필수)
tags: airflow devops mlops 스케줄링 scheduling schedule airflow provider extras 워크플로우 워크플로 workflow 오케스트레이션 오케스트레이터 orchestration orchestrator        # 태그 복수개 가능 (필수)
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
  nav: docs_airflow
pinned: 
---

<!--postNo: 20260330_007-->


## 1. Provider와 Extras  

### (1) Provider  

- 한마디로, Airflow 추가 기능 플러그인  
- Airflow의 Core 기능 외에, 외부 서비스(AWS, GCP, Postgres, Docker 등)와 연결하기 위한 기능을 담은 독립 플러그인 패키지  
- Airflow의 Core 부분은 Task, DAG, 스케줄 관리, 실행만을 담당하며, 그 외의 기능은 Provider로 독립시킴  
- Airflow 1.0 시절에는 하나의 패키지에 모두 포함되었으나, 너무 무거워서 각 서비스별 별도 패키지(Provider)로 분리됨  

### (2) Extras  

- 특정 기능을 추가하기 위해 사용하는 **'설치 옵션 키워드'**  
- `pip` 를 이용해 Airflow Core 외의 기능과 그에 대한 의존성까지 한꺼번에 설치하도록 함  
- `[ ]` 안에 넣는 이름을 지칭하며, 보통 편의를 위해 짧고 직관적인 별칭으로 명명한다.  

```bash
pip install "apache-airflow[google]"
```

### (3) Provider와 Extras의 관계  

- Extras는 `pip` 명령어와 `[]`를 이용해 특정 기능을 위한 1개 이상의 의존성을 함께 설치하는 편의 기능  
- Provider는 Airflow와 외부 서비스를 연결하는 기능을 제공하는 패키지  
- Extras를 통해 특정 기능 묶음을 설치할 때, 필요시 Provider 패키지가 포함될 수 있음  

|매핑 관계|설명|예시 Extra|
|---|---|---|
|1대1 매핑|특정 Extra를 호출하면 대응하는 Provider 하나가 설치|Extras: `amazon`<br>Provider: `apache-airflow-providers-amazon`|
|번들(묶음)매핑|하나의 Extra 키워드가 여러 개의 Provider나 라이브러리를 포함하는 경우|Extras : `google`<br>설치 : `apache-airflow-providers-google`<br>및 구글 인증 라이브러리|
|Core 기능 확장|모든 Extra가 Provider를 설치하는 것은 아님. Airflow 자체의 기능을 확장하는 경우도 있음.|Extras: `password`<br>설치 : `bcrypt`, `flask-bcrypt`|


### (4) Extras 의 종류  

- Apache에서는 Airflow의 Extras를 아래와 같이 분류하고 있음  
- 2026.03.28 기준  

|종류|설명|
|---|---|
|Core Airflow extras|Airflow 핵심 기능을 확장하는 Airflow 추가 기능|
|Meta-airflow package extras|여러 기능을 한꺼번에 편하게 설치하고 싶을 때 사용|
|Providers extras|Provider를 간편하게 설치할 수 있는 기능|

### (5) Provider Extras 의 종류  

- Provider Extras의 하위 종류는 아래와 같음  
- 2026.03.28 기준  

|종류|설명|
|---|---|
|Apache Software extras|다른 Apache 프로젝트와의 통합에 필요한 종속성을 추가하는 추가 기능|
|External Services extras|외부 서비스(클라우드 기반 또는 온프레미스)와의 통합에 필요한 종속성을 추가하는 추가 기능|
|Locally installed software extras|Airflow 배포 시 일반적으로 설치되는 다른 소프트웨어 패키지와의 통합에 필요한 종속성을 추가|
|Other extras| 일반적으로 표준 프로토콜을 통해 외부 시스템과의 통합을 지원하는 기능|


### (6) Provider 목록  

- Provider 목록 및 설치 방법은 Apache Airflow Doc을 참고  

[https://airflow.apache.org/docs/apache-airflow/stable/extra-packages-ref.html#external-services-extras](https://airflow.apache.org/docs/apache-airflow/stable/extra-packages-ref.html#external-services-extras)  


## Reference  

[https://airflow.apache.org/docs/apache-airflow/stable/extra-packages-ref.html](https://airflow.apache.org/docs/apache-airflow/stable/extra-packages-ref.html)  


