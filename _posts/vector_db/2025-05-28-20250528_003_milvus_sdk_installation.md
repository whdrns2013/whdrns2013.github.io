---
title: "[Milvus] 3. Milvus SDK 설치" # 제목 (필수)
excerpt: 애플리케이션 개발단에서 Milvus를 연동하는 SDK  # 서브 타이틀이자 meta description (필수)
date: 2025-05-28 00:30:00 +0900      # 작성일 (필수)
lastmod: 2025-05-28 00:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-05-28 00:30:00 +0900   # 최종 수정일 (필수)
categories: vector_db        # 다수 카테고리에 포함 가능 (필수)
tags: vector db vectordb milvus 설치 install installation SDK Python Java Go NodeJS LLM RAG Embedding                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20250528_003-->


## milvus SDK 설치  

### milvus SDK  

- milvus 를 애플리케이션에서 쉽게 사용할 수 있도록 도와주는 소프트웨어 개발 키트 (SDK)  
- 코딩 단에서 milvus 와의 연결, 데이터 삽입, 삭제 등을 할 수 있게 도와준다.  

### milvus SDK 설치  

| 언어     | 라이브러리                    |
| ------ | ------------------------ |
| Python | PyMilvus                 |
| Java   | milvus-sdk-java          |
| Go     | milvus-sdk-go            |
| NodeJS | @zilliz/milvus2-sdk-node |

#### 파이썬 - pymilvus  

- pip 를 통한 설치  

```bash
pip install pymilvus
```

- 설치 확인  

```bash
python -c "from pymilvus import Collection"
```

#### Java - Milvus Java SDK  

- Java8 이상에서 설치 가능  
- Apache Maven, Gradle/Grails 를 통해 설치 가능  

- Apache Maven  

```xml
<dependency>
	<groupId>io.milvus</groupId>
	<artifactId>milvus-sdk-java</artifactId>
	<version>2.5.7</version>
</dependency>
```

- Gradle/Grails  

```xml
implementation 'io.milvus:milvus-sdk-java:2.5.7'
```

#### Go - Milvus Go SDK  

- GO 1.17 버전 이상  

```bash
go get -u github.com/milvus-io/milvus-sdk-go/v2
```

#### NodeJS  

- NodeJS v18 이상  
- npm 을 통한 설치 권장  

```bash
npm install @zilliz/milvus2-sdk-node
# or ...
yarn add @zilliz/milvus2-sdk-node
```


## Reference  

[https://milvus.io/docs/ko/install-pymilvus.md](https://milvus.io/docs/ko/install-pymilvus.md)  
[https://milvus.io/docs/ko/install-java.md](https://milvus.io/docs/ko/install-java.md)  
[https://milvus.io/docs/ko/install-go.md](https://milvus.io/docs/ko/install-go.md)  
[https://milvus.io/docs/ko/install-node.md](https://milvus.io/docs/ko/install-node.md)  