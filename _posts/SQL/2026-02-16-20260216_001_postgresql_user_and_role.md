---
title: "[PostgreSQL] PostgreSQL 사용자 생성, 수정, 삭제 그리고 권한 부여와 회수" # 제목 (필수)
excerpt: "PostgreSQL의 사용자와 권한에 대한 명령어" # 서브 타이틀이자 meta description (필수)
date: 2026-02-16 23:54:00 +0900      # 작성일 (필수)
lastmod: 2026-02-16 23:54:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-02-16 23:54:00 +0900   # 최종 수정일 (필수)
categories: SQL         # 다수 카테고리에 포함 가능 (필수)
tags: sql postgre postgres postgresql 포스트그레 에스큐엘 데이터베이스 사용자 user role 권한 부여 회수 grant revoke privileges                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20260216_001-->

## 1. 사용자 생성, 수정, 삭제

### (1) 사용자 생성

- 기본 생성

```sql
CREATE ROLE username WITH LOGIN PASSWORD 'password';
```

- 권한을 포함한 생성

```sql
CREATE ROLE app_user
WITH LOGIN PASSWORD 'pass123'
CREATEDB
CREATEROLE;
```

`LOGIN` → 로그인 가능

`CREATEDB` → DB 생성 가능

`CREATEROLE` → 사용자 생성 가능

`SUPERUSER` → 관리자

`NOSUPERUSER` → 일반유저(기본값)

### (2) 사용자 수정

- 비밀번호 변경

```sql
ALTER ROLE username WITH PASSWORD 'newpassword';
```

- 권한 변경

```sql
ALTER ROLE username CREATEDB;
ALTER ROLE username NOSUPERUSER;
```

- 이름 변경

```sql
ALTER ROLE oldname RENAME TO newname;
```

### (3) 사용자 삭제

```sql
DROP ROLE username;
```

※ 해당 사용자가 소유한 객체가 있으면 삭제 불가

### (4) 사용자 조회

```sql
\du
```

또는

```sql
SELECT rolname FROM pg_roles;
```

## 2. 권한 부여와 회수

### (1) 권한 부여

- DB 접속 권한

```sql
GRANT CONNECT ON DATABASE mydb TO username;
```

- 스키마 사용 권한

```sql
GRANT USAGE ON SCHEMA public TO username;
```

- 모든 테이블의 모든 권한

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO username;
```

- 특정 테이블의 특정 권한

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO username;
```

- 시퀀스 권한

```sql
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO username;
```

- 실행 권한

```sql
GRANT EXECUTE ON FUNCTION my_function() TO username;
```

### (2) 권한 회수

- 특정 권한 회수

```sql
REVOKE SELECT ON users FROM username;
```

- 모든 권한 회수

```sql
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM username;
```

### (3) 기본 권한 설정

- 앞으로 생성될 테이블에도 자동 권한

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO username;
```

### (4) 권한 조회

- 테이블 권한

```sql
\z users
```

- 사용자 권한

```sql
\du
```

## 3. 권한 구조의 핵심 이해하기

- Role = 사용자 + 그룹 개념
- 권한은 Role에 부여
- Role을 다른 Role에 할당 가능

```sql
GRANT readonly TO username;
```

## 4. 실수 포인트

### 1) 스키마 권한 빠짐

```sql
GRANT USAGE ON SCHEMA public TO username;
```

→ 없으면 테이블 접근 불가

### 2) 시퀀스 권한 없음 (INSERT 실패)

```sql
GRANT USAGE, SELECT ON SEQUENCES
```

### 3) 미래 테이블 권한 누락

```sql
ALTER DEFAULT PRIVILEGES ...
```