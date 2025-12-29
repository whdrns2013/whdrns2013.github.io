---
title: "[Milvus] 7. Milvus 엔티티 삽입, 업데이트(업서트), 삭제" # 제목 (필수)
excerpt: 컬렉션에 엔티티를 넣고 빼보자  # 서브 타이틀이자 meta description (필수)
date: 2025-05-31 10:15:00 +0900      # 작성일 (필수)
lastmod: 2025-05-31 10:15:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-05-31 10:15:00 +0900   # 최종 수정일 (필수)
categories: vector_db        # 다수 카테고리에 포함 가능 (필수)
tags: vector db vectordb milvus 구조 컬렉션 엔티티 삽입 삭제 업데이트 업서트 insert upsert delete 필드 field LLM RAG Embedding                     # 태그 복수개 가능 (필수)
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
sidebar:
  nav: docs_vector_db
pinned: 
---
<!--postNo: 20250531_002-->


## 엔티티 삽입  

### 엔티티  

- 컬렉션에서 동일한 필드 집합을 공유하는 데이터 레코드
- RDB 에서 레코드와 동일한 개념  
- 동일한 컬렉션 내의 엔티티는 동일한 속성(필드, 데이터 유형, 제약 조건 등)을 갖는다.  

### 엔티티 삽입의 작동 방식  

- 스키마에 정의된 모든 필드를 포함하는 경우에만 성공적으로 추가됨.  
- 삽입된 엔티티는 기본적으로는 삽입 순서대로 `_default` 라는 이름의 파티션에 들어감  
- 특정 파티션을 지정하여 삽입할 수도 있음.  
- `dynamil_field` 를 사용하는 컬렉션의 경우 스키마에 정의되지 않은 필드를 삽입할 수도 있음.  

### 엔티티 삽입  

#### 컬렉션 만들기  

- 최소 하나의 벡터 필드를 가져야 한다는 점을 주의!  
- 벡터 DB 특성상 벡터 필드 없이 메타데이터만으로 이루어진 컬렉션은 존재할 수 없음.  

```python
# 데이터베이스 생성

# load env
import dotenv
import os
dotenv.load_dotenv(dotenv.find_dotenv())
from pymilvus import MilvusClient, DataType

milvus_host = os.getenv('MILVUS_HOST')
milvus_port = os.getenv('MILVUS_PORT')
database_name = 'my_database_1'
milvus_username = 'root'    # milvus 기본 계정
milvus_password = 'Milvus'  # milvus 기본 비밀번호


# milvus client 인스턴스 생성
client = MilvusClient(
    uri=f"http://{milvus_host}:{milvus_port}",
    token=f"{milvus_username}:{milvus_password}"
)

# database 생성
client.create_database(
    db_name="test_database"
)

# database 선택
client.use_database(db_name='test_database')

# 스키마 생성
schema = MilvusClient.create_schema(enable_dynamic_field=True)
schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True, auto_id=True)
schema.add_field(field_name="movie_id", datatype=DataType.VARCHAR, max_length=40)
schema.add_field(field_name="movie_name", datatype=DataType.VARCHAR, max_length=512)
schema.add_field(field_name="movie_desc", datatype=DataType.VARCHAR, max_length=4096)
schema.add_field(field_name="movie_desc_vec", datatype=DataType.FLOAT_VECTOR, dim=4)

# 인덱스 생성
index_params = client.prepare_index_params()
index_params.add_index(field_name="id", index_type="AUTOINDEX")
index_params.add_index(field_name="movie_id", index_type="AUTOINDEX")
index_params.add_index(field_name="movie_name", index_type="AUTOINDEX")
index_params.add_index(field_name="movie_desc", index_type="AUTOINDEX")
index_params.add_index(field_name="movie_desc_vec", index_type="AUTOINDEX", metric_type="COSINE")

# 컬렉션 만들기
client.create_collection(
    collection_name="movie_info",
    schema=schema,
    index_params=index_params,
)

# 컬렉션 정보 확인
res = client.describe_collection(collection_name="movie_info")
print(res)
```

```python
# Output
{
    "collection_name": "movie_info",
    "auto_id": True,
	...
}
```

#### 엔티티 삽입  

- `client.insert` 명령어를 통해 데이터 삽입 가능.  
- 삽입 작업시 아래 두 가지 파라미터 지정 필요.  
- `collection` : 데이터를 삽입할 컬렉션 이름.  
- `data` : 삽입할 데이터. 리스트 형식으로 구축.  

```python
# 데이터 삽입

import dotenv
import os
dotenv.load_dotenv(dotenv.find_dotenv())
from pymilvus import MilvusClient, DataType

milvus_host = os.getenv('MILVUS_HOST')
milvus_port = os.getenv('MILVUS_PORT')
database_name = 'test_database'
collection_name = 'movie_info'
milvus_username = 'root'    # milvus 기본 계정
milvus_password = 'Milvus'  # milvus 기본 비밀번호


# milvus client 인스턴스 생성
client = MilvusClient(
    uri=f"http://{milvus_host}:{milvus_port}",
    token=f"{milvus_username}:{milvus_password}"
)

# database 선택
client.use_database(db_name=database_name)

# data
data = [
    {
        'movie_id':'1532',
        'movie_name':'대부2',
        'movie_desc':'시칠리아 콜레오네 출신인 비토 안돌리니는 마을을...',
        'movie_desc_vec':[0.5, 0.1, 0.3, 0.2]
    },
    {
        'movie_id':'253',
        'movie_name':'토이스토리',
        'movie_desc':'6살 짜리 소년 앤디가 갖고 있는 인형들 중 우디는...',
        'movie_desc_vec':[0.5, 0.1, 0.3, 0.2]
    },
    {
        'movie_id':'12',
        'movie_name':'기생충',
        'movie_desc':'직업도 없이 허름한 반지하에 사는 기택 가족에게...',
        'movie_desc_vec':[0.5, 0.1, 0.3, 0.2]
    }
]

# 데이터 삽입
res = client.insert(
    collection_name=collection_name,
    data=data
)
```

```python
# Outpu
print(res)

>> {
>> 	'insert_count': 3,
>> 	'ids': [458358507460986037, 458358507460986038, 458358507460986039],
>> 	'cost': 0
>> }
```

#### 엔티티 삽입 결과 UI 에서 조회하기  

- Milvus Web UI - Data 메뉴에서 간단하게 데이터의 개수와 컬렉션 속성 등 확인 가능  

![](/assets/images/20250531_002_001.png)  

- Attu에서는 컬렉션 속성, 데이터 개수 뿐 아니라 엔티티(즉, 데이터) 자체도 조회 가능  

![](/assets/images/20250531_002_002.png)  
![](/assets/images/20250531_002_003.png)  


## 엔티티 업서트 (Upsert)  

### 업서트(Upsert)  

#### 업서트의 개념  

- `Upsert` : Update + Insert 로, 업데이트와 삽입을 결합한 작업.  
- 대상 컬렉션에 삽입하려는 기본키가 존재하는지에 따라 Insert, Update가 선택적으로 수행됨.  
- 엔티티 삽입을 할 때, 삽입을 해야 하는지, 업데이트를 해야 하는지 부정확할 때 사용  

#### 업서트 작동 방식  

- 동일한 기본키 존재시 -> `Update 작업` : 신규 엔티티 생성 후 기본키가 겹치는 기존 엔티티 삭제  
- 동일한 기본키 없다면 -> `Insert 작업` 수행  
- 기본키가 AutoId 면, 새로 Insert 된 기본키로 대체됨.  
- 기본키가 AutoId가 아니면, 기본키는 그대로 동일함.  

![](/assets/images/20250531_002_004.png)  



### Upsert 수행  

- `client.upsert()` 메서드를 사용해 수행  

```python
# client 인스턴스 생성 부분 생략

database_name = 'test_database'
collection_name = 'movie_info'

# database 선택
client.use_database(db_name=database_name)

data = [
    {
        'id':458358507460986037,  # 이미 존재하는 id
        'movie_id':'1532',
        'movie_name':'Godfather Part2',    # 대부2 -> Godfather Part2 로 변경
        'movie_desc':'시칠리아 콜레오네 출신인 비토 안돌리니는 마을을...',
        'movie_desc_vec':[0.5, 0.1, 0.3, 0.2]
    },
    {
        'id':None,
        'movie_id':'9975',
        'movie_name':'시스터액트 2',
        'movie_desc':'라스베가스의 최고의 인기 가수가 된 들로리스에게...',
        'movie_desc_vec':[0.2, 0.5, 0.9, 0.8]
    }
]

res = client.upsert(
    collection_name=collection_name,
    data=data
)
```

- Attu 에서 조회해보면  

![](/assets/images/20250531_002_005.png)  

## 엔티티 삭제  

### 엔티티 삭제 방법  

- 엔티티를 삭제할 때에는 삭제 대상을 먼저 잡아야 함.  
- (1) 조건 필터링을 이용해 삭제할 엔티티를 포착하거나  
- (2) 기본 키를 필터링해 삭제할 엔티티를 포착할 수 있음.  

### 조건 필터로 엔티티 삭제하기  

- `client.delete()` 메서드를 통해 엔티티를 삭제할 수 있음.  
- `filter=` 파라미터를 통해 삭제한 엔티티를 필터링할 수 있음.  

```python
# client 인스턴스 생성 부분 생략
database_name = 'test_database'
collection_name = 'movie_info'

# database 선택
client.use_database(db_name=database_name)

# 엔티티 삭제
res = client.delete(
    collection_name=collection_name,
    filter="movie_name in ['기생충', 'Godfather Part2']"
)
```

- Attu 를 통해 조회시 삭제된 것을 확인할 수 있음.  

![](/assets/images/20250531_002_006.png)  

### 기본 키 필터로 엔티티 삭제하기  

- `client.delete()` 메서드를 통해 엔티티를 삭제할 수 있음.  
- `ids=` 파라미터로 삭제할 기본키를 지정할 수 있음.  

```python
# 기본키 필터로 엔티티 삭제
# client 인스턴스 생성 부분 생략
database_name = 'test_database'
collection_name = 'movie_info'

# database 선택
client.use_database(db_name=database_name)

# 엔티티 삭제
res = client.delete(
    collection_name=collection_name,
    ids=[458358507460986038]
)
```

- Attu 를 통해 조회시 삭제된 것을 확인할 수 있음.  

![](/assets/images/20250531_002_007.png)  

### 파티션에서 엔티티 삭제  

- 특정 파티션에 저장된 엔티티를 삭제할 때에는 `partition_name` 파라미터를 사용  

```python
res = client.delete(
    collection_name="quick_setup",
    ids=[18, 19],
    partition_name="partitionA"
)
```


## Reference  

[https://milvus.io/docs/ko/insert-update-delete.md](https://milvus.io/docs/ko/insert-update-delete.md)  
[https://milvus.io/docs/ko/upsert-entities.md](https://milvus.io/docs/ko/upsert-entities.md)  
[https://milvus.io/docs/ko/delete-entities.md](https://milvus.io/docs/ko/delete-entities.md)  