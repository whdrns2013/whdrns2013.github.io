---
title: "[Supabase] Supabase 데이터베이스 마이그레이션(With SQLAlchemy & Alembic)" # 제목 (필수)
excerpt: "BaaS인 Supabase에도 Alembic을 이용한 데이터베이스 마이그레이션이 가능하다?!" # 서브 타이틀이자 meta description (필수)
date: 2026-05-26 00:36:00 +0900      # 작성일 (필수)
lastmod: 2026-05-26 00:36:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-05-26 00:36:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: supabase 수파베이스 python 파이썬 SQL RDB DB 데이터 alembic data 데이터 마이그레이션 migration sqlalchemy revision
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
  nav: docs_python
pinned: 
series: python-data-migration-guide-with-sqlalchemy-and-alembic
series_index: 4
---
<!--postNo: 20260526_001-->

## SQLAlchemy와 Alembic으로 Supabase 데이터베이스 마이그레이션

이번 글에서는 **SQLAlchemy ORM**으로 테이블 구조를 정의하고, **Alembic**을 이용해 **Supabase PostgreSQL 데이터베이스에 마이그레이션**을 적용하는 방법을 정리한다.

Supabase는 PostgreSQL 기반이기 때문에, 일반 PostgreSQL 데이터베이스를 다루는 방식과 거의 동일하게 SQLAlchemy, Alembic을 사용할 수 있다.

### 1. Supabase

Supabase는 Firebase의 오픈소스 대안으로 자주 소개되는 **Backend-as-a-Service (BaaS) 플랫폼**이다. Supabase에서 프로젝트를 생성하면, **PostgreSQL 데이터베이스를 중심으로** 인증, 스토리지, Edge Function, Realtime, REST API등을 손쉽게 만들거나 활용할 수 있다. 쉽게 말하면, **DB 기반 온라인 오픈소스 백엔드**이다.  

예를 들어 다음과 같은 기능을 사용할 수 있다.  

- SQL 기반 테이블 설계 및 생성
- RDB 데이터 적재, 조회, 수정, 삭제
- 외래 키, 인덱스, 제약 조건
- View, Function, Trigger
- DATA REST API 자동 생성
- Storage 기능
- 인증 (Supabase Auth)

특히 백엔드 서버를 직접 만들지 않아도 데이터베이스 테이블을 기반으로 REST API가 자동으로 만들어져 제공된다는 점이 아주 편리하다. 단순히 데이터의 CRUD 뿐만 아니라, 테이블, 뷰, 함수 등에 대해서도 API를 자동으로 제공한다.  

2026년 기준, 무료 플랜으로 Supabase는 월간 활성 사용자 5만명, 500MB 사이즈의 데이터베이스, 1GB의 파일 스토리지 등을 제공한다. 즉, 학습용이나 작은 사이드 프로젝트로는 무료 플랜으로도 충분하지만, 운영 서비스에서는 DB 용량 등을 고려해서 유료 플랜으로의 전환이 필요하다.  

### 2. Supabase DB URL 준비

#### (1) 프로젝트 만들기

Supabase에서 데이터베이스를 만들기 위해서는 우선 **Project**를 만들어야 한다.  

Project는 Supabase에서 하나의 애플리케이션 단위라고 볼 수 있다. 하나의 Project 안에는 PostgreSQL 데이터베이스, Auth, Storage, Edge Functions, API 설정 등이 하나로 묶여 포함된다.  

![](/assets/images/20260526_001_001.jpg)

로그인 후 Projects 메뉴로 진입하면 우측에 `New project` 버튼이 존재한다. 이 버튼을 눌러 프로젝트를 만들 수 있다.    

![](/assets/images/20260526_001_002.jpg)

프로젝트 생성 화면에서는 다음 항목들을 입력한다.  

| 항목 | 설명 |
| --- | --- |
| Organization | 프로젝트가 속할 조직. 기본 Organization이 선택되어 있을 것이다. |
| Project name | 프로젝트 이름입. 나중에 Dashboard에서 구분하기 쉬운 이름으로 지정. |
| Database Password | PostgreSQL 데이터베이스의 비밀번호. 이후 SQLAlchemy, Alembic에서 DB에 접속할 때 사용됨. |
| Region | 데이터베이스가 생성될 물리적 리전. 사용자가 많은 지역과 가까운 리전을 선택하는 것이 좋음 |
| Data API | Supabase가 데이터베이스 테이블을 기반으로 REST API를 자동 제공하는 기능. |

#### (2) Supabase DB URL 확인

![](/assets/images/20260526_001_003.jpg)

Project가 만들어졌다면, 해당 프로젝트 페이지 상단에 `Connect` 버튼을 볼 수 있을 것이다. 이 버튼을 누르면 데이터베이스 접속 정보를 확인할 수 있다.  

![](/assets/images/20260526_001_004.jpg)

우측에 연결 정보 패널이 나오는데, 여기서 연결 방법을 선택할 수 있다. 이번에는 `Direct Connection` 에서 `Transaction pooler` 를 선택한다.  

Supabase는 Direct connection과 Pooler 연결 방식을 제공한다. DOC에서는 Transaction mode connection string은 proxy를 통해 Postgres에 연결하며, 서버리스 또는 Edge Functions처럼 짧은 연결이 많이 발생하는 환경에 적합하다고 한다.  

| 구분 | 설명 | 추천 상황 |
| --- | --- | --- |
| Direct connection | 애플리케이션이 PostgreSQL 데이터베이스에 직접 연결하는 방식 | 백엔드 서버가 고정적으로 떠 있고 connection pool을 직접 관리하는 경우 |
| Transaction pooler | Supabase pooler를 통해 트랜잭션 단위로 DB 연결을 공유하는 방식 | Vercel, Netlify, Lambda, Edge Function, 간단한 외부 스크립트 |
| Session pooler | Supabase pooler를 사용하되 세션 단위로 연결을 유지하는 방식 | 장시간 세션이 필요한 앱 또는 일반 서버 환경 |

![](/assets/images/20260526_001_005.jpg)

그 아래쪽에서는 **DB의 URL**을 확인할 수 있다. DB 마이그레이션에 꼭 필요한 정보이니 복사해놓자.  

### 3. DB 마이그레이션 파이썬 프로젝트 준비

아래와 같은 패키지들을 설치한다.  

```bash
uv add alembic psycopg2-binary sqlalchemy
```

우선 디렉터리 구조는 아래와 같이 잡았다. (alembic 초기화는 같은 시리즈의 ***[Python] Alembic으로 구축하는 DB 마이그레이션* 포스팅을 참고)**  

```bash
my-app/
├─ db/
│  └─ models.py
├─ alembic/
│  ├─ env.py
│  └─ versions/
├─ alembic.ini
├─ .env
└─ main.py
```

`alembic.ini` 에는 위 Supabase의 DB URL을 넣어준다.    

```bash
sqlalchemy.url = postgresql+psycopg2://postgres.abcdef:[YOUR-PASSWORD]@region.pooler.supabase.com:port/db
```

이제 생성하고자 하는 테이블들에 대한 ORM을 작성해준다. 이번엔 예시로 간단한 사용자 목록 테이블을 만들어보려 한다.  

```python
# db/models.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id    : Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, comment="사용자 고유 ID")
    name  : Mapped[str] = mapped_column(String(50), comment="사용자 이름")
    email : Mapped[str] = mapped_column(String(100), unique=True, comment="사용자 이메일")
    
```

이제 Alembic이 이 SQLAlchemy 모델을 읽을 수 있도록 `alembic/env.py` 파일을 수정한다. 이 파일에는 `Base.metadata` 를 `target_metadata` 로 지정한다. Alembic의 autogenerate 기능은 이 `target_metadata`를 기준으로 현재 DB 상태와 SQLALchemy 모델 상태를 비교한다.  

```python
from db.models import Base
target_metadata = Base.metadata
```

### 4. Supabase에 DB 마이그레이션

  첫 마이그레이션을 생성한다.  

```bash
alembic revision --autogenerate -m "create users table"
```

위 명령어는 SQLAlchemy 모델과 현재 DB 상태를 비교해서 마이그레이션 파일을 자동 생성한다. 정상 작동되었다면 아래와 같은 출력이 보이고, `alembic/versions` 디렉터리에 마이그레이션 파일이 생성될 것이다.  

```bash
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.plugins] setting up autogenerate plugin alembic.autogenerate.schemas
INFO  [alembic.runtime.plugins] setting up autogenerate plugin alembic.autogenerate.tables
INFO  [alembic.runtime.plugins] setting up autogenerate plugin alembic.autogenerate.types
INFO  [alembic.runtime.plugins] setting up autogenerate plugin alembic.autogenerate.constraints
INFO  [alembic.runtime.plugins] setting up autogenerate plugin alembic.autogenerate.defaults
INFO  [alembic.runtime.plugins] setting up autogenerate plugin alembic.autogenerate.comments
INFO  [alembic.autogenerate.compare.tables] Detected added table 'users'
  Generating alembic/versions/48c3b34d15d0_create_users_table.py ...  done
```

이제 Supabase에 변경사항을 적용한다. `upgrade head`는 아직 적용되지 않은 모든 마이그레이션을 최신 버전까지 적용하겠다는 의미다.  

```bash
alembic upgrade head
```

정상적으로 명령이 수행되었다면, Supabase 사이트의 `Project > Database > Tables`에서 `users` 테이블이 생성된 것을 볼 수 있다.  

![](/assets/images/20260526_001_006.jpg)

### 5. Data API 사용해보기

#### (1) Data API URL 및 KEY 확인

Supabase는 데이터베이스의 CRUD를 REST API 형태로 제공해주는 **Data API** 기능을 제공한다. 즉, `users` 테이블을 만들면 별도로 백엔드 API 서버를 만들지 않아도 다음과 같은 REST API를 사용할 수 있다.

![](/assets/images/20260526_001_007.jpg)

Data API URL은 Project의 `Integration > Installed > Data API` 에서 확인할 수 있다.  

![](/assets/images/20260526_001_008.jpg)

API에 접근하기 위한 API Key는 `Project > Settings > API Keys` 메뉴에서 확인할 수 있다.  

#### (2) Data API URL

Data API는 보통 다음과 같은 형태이다.  

```bash
https://basdafgaergsadfasfd.supabase.co/rest/v1/
```

만약 `users` 테이블에 접근하고자 한다면, 뒤에 테이블 이름을 붙이면 된다.  

```bash
https://basdafgaergsadfasfd.supabase.co/rest/v1/users
```

#### (3) SELECT 요청

`users` 테이블의 데이터를 조회해보자.

```bash
curl "https://[PROJECT_REF].supabase.co/rest/v1/users?select=*" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ANON_KEY]"
```

정상적으로 조회되면 JSON 배열이 반환된다.  

```bash
[
  {
    "id": 1,
    "name": "김철수",
    "email": "kcs@example.com"
  }
]
```

#### (4) INSERT 요청

이번에는 `users` 테이블에 데이터를 추가해보자.  

```bash
curl -X POST "https://[PROJECT_REF].supabase.co/rest/v1/users" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "name": "김철수",
    "email": "cskim@example.com"
}'
```

만약 Postman과 같은 GUI기반 API 툴을 사용한다면, `Authorization` 에 Auth Type `API Key` 로 다음과 같이 API KEY를 입력해주면 된다.  

![](/assets/images/20260526_001_009.jpg)

성공했다면 아래와 같이 Supaase 테이블에 데이터가 들어간 것을 볼 수 있다.  

![](/assets/images/20260526_001_010.jpg)

#### (5) UPDATE 요청

```bash
curl -X PATCH "https://[PROJECT_REF].supabase.co/rest/v1/users?email=eq.hong@example.com" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "name": "홍길동2"
  }'
```

#### (6) DELETE 요청

```bash
curl -X DELETE "https://[PROJECT_REF].supabase.co/rest/v1/users?email=eq.hong@example.com" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ANON_KEY]"
```

## Reference

[Pricing & Fees - Supabase](https://supabase.com/pricing?utm_source=chatgpt.com)

[Data REST API - Supabase Docs](https://supabase.com/docs/guides/api)