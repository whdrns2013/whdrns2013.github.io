---
title: "[PostgreSQL] PostgreSQL 데이터베이스와 스키마 Database and Schema" # 제목 (필수)
excerpt: "데이터베이스와 스키마, 둘은 무엇이 다른 걸까?" # 서브 타이틀이자 meta description (필수)
date: 2026-02-19 20:47:00 +0900      # 작성일 (필수)
lastmod: 2026-02-19 20:47:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-02-19 20:47:00 +0900   # 최종 수정일 (필수)
categories: SQL         # 다수 카테고리에 포함 가능 (필수)
tags: sql postgre postgres postgresql 포스트그레 에스큐엘 데이터베이스 스키마 database schema                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20260219_001-->

## PostgreSQL에서 데이터베이스와 스키마

### Intro

PostgreSQL의 데이터 구조 객체 중에는 “데이터베이스(Database)”와 “스키마(Schema)” 가 있다. 두 개념은 역할과 범위가 다르지만, 처음 접할 때에는 혼동하기 쉽다. 따라서 이번 포스팅에서는 두 개념에 대해 차이를 명확히 구분해보도록 한다.  

![](/assets/images/20260219_001_001.png)  

(빨간 색 네모 부분이 데이터베이스, 초록색이 스키마)  

### 데이터베이스와 스키마 요약

데이터베이스와 스키마를 각각 한 줄로 표현해보면 아래와 같다.  

- “데이터베이스(Database)”는 **논리적으로 완전히 분리된 저장 공간**
- “스키마(Schema)”는 **하나의 데이터베이스 내부에서 객체를 구분하는 네임스페이스**

### 구조로 이해하기

```bash
PostgreSQL 서버
 ├── database1
 │    ├── schema1
 │    │     └──table
 │    ├── schema2
 │    │     └──table
 │
 ├── database2
      ├── schema1
           └──table
```

- 데이터베이스는 자신과 다른 데이터베이스와 논리적으로 완전히 분리된 저장공간이다.
- 스키마는 데이터베이스 하위에 존재하며 테이블과 같은 데이터베이스 하위 객체를 구분하는 네임스페이스 개념이다.

## 데이터베이스와 스키마

### Database 데이터베이스

#### 특징  

- 데이터베이스 간 서로 논리적으로는 완전히 격리됨
- (물리적으로는 같은 서버 안에 존재할 수 있음)
- 한 DB에서 다른 DB의 테이블을 일반적인 방식으로는 직접 조회할 수 없음
- 다른 DB의 테이블을 조회하기 위해서는 접속을 바꿔야 함 (`\c db명`)
- 보통 서비스 단위로 데이터베이스를 나눔

#### 예시  

```sql
CREATE DATABASE shop;
CREATE DATABASE analysis;
```

👉  shop DB에서 analysis DB 테이블은 일반적인 방식으로는 바로 조회 불가  

---

### Schema

#### 특징  

- 하나의 데이터베이스 안에서 네임스페이스 (논리적인 구분자) 역할
- 테이블 등의 이름 충돌을 방지하는 역할을 함
- 스키마별로 권한을 분리할 수 있다. (스키마별 접근 통제 가능)
- 동일한 데이터베이스 안에서도 스키마가 다르다면 같은 테이블 이름을 사용할 수 있음

#### 예시  

- 스키마 생성

```sql
\c shop;

CREATE SCHEMA sales;
CREATE SCHEMA marketing;
```

- 테이블 생성

```sql
-- 스키마가 다르다면, 동일한 이름의 테이블 생성 가능
CREATE TABLE users ( ... );            -- public.users 테이블이 생성됨
CREATE TABLE sales.users ( ... );      -- sales.users 테이블이 생성됨
CREATE TABLE marketing.users ( ... );  -- marketing.users 테이블이 생성됨
```

👉  같은 DB 안에서도 같은 이름의 테이블 공존 가능  

---

### 기본 스키마 

- PostgreSQL은 데이터베이스를 만들면 기본적으로 `public` 이라는 스키마를 가진다.
- 조회 등에서 스키마를 지정하지 않으면 `saerch_path` 설정값을 따른다.
- `search_path`의 기본값에는 `"$user"` , `public` 이 포함된다.
- `"$user"` 란, 현재 로그인한 사용자 이름과 동일한 스키마를 뜻한다.
- 즉, 스키마 지정이 없다면, search_path 에 있는 스키마에서 찾으며, search_path 의 기본값은 현재 유저의 이름과 동일한 스키마와 public 스키마이다.
- search_path 에 스키마 추가가 가능하다.

## 조회 방식의 차이

### 스키마 지정 없이 조회

```sql
SELECT * FROM users;
```

→ `search_path` 에 따라 스키마 지정이 결정되며, 기본값은 `public` 스키마이다.  

```sql
-- 별도 지정이 없는 경우, 아래 두 쿼리는 같음
SELECT * FROM users;
SELECT * FROM public.users;
```

---

### 스키마를 지정하여 조회

```sql
SELECT * FROM sales.users;
```

→ `sales` 스키마의 `users` 테이블에서 조회  

---

### 핵심 요약

- DB는 “논리적으로 완전히 분리된 다른 공간”
- Schema는 “같은 공간 안의 네임스페이스”

| 항목 | Database | Schema |
| --- | --- | --- |
| 별도 접속 필요 | O | X |
| 논리적 완전 격리 | O | X |
| cross query | 불가 | 가능 |
| 권한 분리 | 가능 | 가능 |

## 언제 Database 와 Schema를 사용하나

### (1) Database를 사용하는 경우

- 완전히 분리된 서비스에 대해서는 각각의 데이터베이스를 사용
- 다른 프로젝트는 각각의 데이터베이스를 사용
- 데이터의 격리가 필요할 경우
- 백업 단위를 분리하는 경우
- 데이터베이스별로 권한을 분리할 수 있음

### (2) Schema를 사용하는 경우

- 같은 서비스 내부에서 다른 관심주제에 대해서 스키마를 사용
- 기능별로 분리하는 경우 (user, order, log 등)
- 스키마별로도 권한을 분리할 수 있음
