---
title: "[PostgreSQL] PostgreSQL 관행" # 제목 (필수)
excerpt: "PostgreSQL의 네이밍 규칙 등" # 서브 타이틀이자 meta description (필수)
date: 2025-12-15 13:11:00 +0900      # 작성일 (필수)
lastmod: 2025-12-15 13:11:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-15 13:11:00 +0900   # 최종 수정일 (필수)
categories: SQL         # 다수 카테고리에 포함 가능 (필수)
tags: sql postgre postgres postgresql 포스트그레 에스큐엘 네이밍 이름 짓기 이름짓기 네임 name naming 규칙 관례 관행                    # 태그 복수개 가능 (필수)
classes: wide         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
  nav: docs_postgresql
---
<!--postNo: 20251215_001-->


## PostgreSQL 의 보편적 규칙  

### 이름 Name  

> 최근 업데이트 : 2025-12-15  

#### 기본 규칙  

- 첫 문자 : 이름은 문자(`a`~`z`) 또는 언더스코어(`_`)로 시작해야 한다.  
- 나머지 문자 : 문자(`a`~`z`), 숫자(`0`~`9`) 또는 언더스코어(`_`)  
- 이름의 최대 길이 : `NAMEDATALEN - 1` 자까지만 허용됨 (그 이후는 잘림)  
- `NAMEDATALEN` : 기본적으로 32로 설정됨. 따라서 이름의 최대 길이는 31자.  
- `src/include/postgres_ext.h` 파일에서 `NAMEDATALEN`의 값을 변경할 수 있다.  
- 즉, **snake_case 를 사용하는 것을 강력하게 권장**한다.  

#### PostgreSQL의 대소문자 구분  

- 기본적으로 대문자는 소문자로 변환된다. (e.g. TableName -> tablename)  
- 대소문자를 구분하기 위해서는 큰따옴표를 사용해야 한다.  


#### 큰따옴표 추가 규칙  

- 큰따옴표(`""`)로 묶는 경우, `a`~`z`, `0`~`9`, `_`를 제외한 문자도 이름으로 사용할 수 있다.  
- 큰따옴표로 묶는 경우, 대소문자를 구분하며, `&` 등 기본 문자 외의 특수한 문자도 이름으로 사용할 수 있다.  
- 또한 큰따옴표는 SQL의 keyword와 Name을 구분지어준다. (`IN` 은 keyword, `"IN"`은 이름)  
- 단, 모든 구문에서 큰따옴표를 써야 한다는 번거로움이 있다. (SELECT 문에서도 써야 함)  

#### PostgreSQL 이름 규칙의 장점  

- 가독성이 좋다.  
- MySQL처럼 운영체제에 따른 대소문자 의존성을 가지지 않는다.  
- snake_case 라는 일관된 네이밍 규칙을 자연스럽게 받아들일 수 있다.  
- 이로 인해 개발과 운영 과정에서 충돌을 줄이고, 원활한 프로젝트를 지원한다.  


## Reference  

[https://www.postgresql.org/docs/7.0/syntax525.htm](https://www.postgresql.org/docs/7.0/syntax525.htm)  
[https://medium.com/mr-plan-publication/why-snake-case-is-the-best-naming-convention-for-postgresql-776063a57ff3](https://medium.com/mr-plan-publication/why-snake-case-is-the-best-naming-convention-for-postgresql-776063a57ff3)  