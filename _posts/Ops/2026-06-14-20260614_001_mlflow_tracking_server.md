---
title: "[MLflow] Tracking Server" # 제목 (필수)
excerpt: "MLOps 시스템의 중앙 관제 역할을 하는 서버" # 서브 타이틀이자 meta description (필수)
date: 2026-06-14 18:54:00 +0900      # 작성일 (필수)
lastmod: 2026-06-14 18:54:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-06-14 18:54:00 +0900   # 최종 수정일 (필수)
categories: Ops         # 다수 카테고리에 포함 가능 (필수)
tags: AI 인공지능 MLOps 머신러닝 ML machine learning mlflow 등록 아티팩트 모델 tracking server 트래킹 서버           # 태그 복수개 가능 (필수)
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
series: 
series_index: 
---
<!--postNo: 20260614_001-->

## Tracking Server

### 1. 개념

MLflow Tracking Server는 MLflow의 **중앙 관제 서버 역할**을 담당한다.  

![](/assets/images/20260614_001_001.jpg)  

- 클라이언트가 기록하는 실험(Experiment), 실행(Run), 파라미터, 메트릭, 태그, 아티팩트에 대한 요청을 받아 Backend Store와 Artifact Stroe에 알맞게 전달한다.
- 사용자가 실험 이력, 실행 결과, 모델, 아티팩트 등을 확인할 수 있는 Web UI를 제공한다.
- MLflow Tracking API와 REST API의 진입점 역할을 한다.

### 2. 역할

| 역할 | 설명 |
| --- | --- |
| Tracking API 제공 | 실험, 실행, 파라미터, 메트릭, 태그 등을 기록할 수 있는 API 제공 |
| Web UI 제공 | 실험 목록, 실행 이력, 메트릭, 파라미터, 아티팩트 등을 브라우저에서 확인할 수 있는 Web UI 제공 |
| Backend Store 연결 | 실험, 실행 관련 메타데이터를 Backend Store에 저장, 조회 |
| Artifact Store 연결 | 모델 파일, 이미지, 데이터 파일 등 대용량 결과물을 Artifact Store에 저장, 조회 |
| Artifact Proxy 역할 | 클라이언트가 Object Storage(Artifact Store)에 직접 접근하지 않고 Tracking Server를 통해 업로드/다운로드 할 수 있게 연결한다. |
| Model Registry 접근점 | 등록된 모델, 모델 버전, alias, stage 등의 정보를 조회하고 관리하는 진입점 역할 |

### 3. Tracking Server 유무에 따른 작업 환경 비교

![](/assets/images/20260614_001_002.jpg)  

#### (1) Tracking Server가 없는 경우

- 클라이언트 코드가 직접 Backend Stroe와 Artifact Store에 접근하여 저장, 조회 수행
- 실험에 대한 메타데이터나, 모델 학습 결과물 등을 저장하고 불러오는 코드를 직접 작성해야 함
- Backend Store, Artifact Stroe에 대한 연결, 정보 관리 등을 직접 수행해야 함
- 여러 사용자가 함께 작업할 경우, 저장소 경로, 권한, 환경변수, 접근 키 관리 복잡

#### (2) Tracking Server가 있는 경우

- 클라이언트는  Trackig Server 와만 통신
- Tracking Server 가 실험, 실행에 대한 메타 데이터와 모델을 저장하고 조회함
- Backend Store, Artifact Store 에 대한 관리와 연결은 Tracking Server 에서 담당
- 여러 사용자가 함께 협업하는 환경에서 Tracking Server가 중앙 관리 지점이 됨

## 설치와 실행

### 1. 설치 방법 안내

Tracking Server는 기본적으로 파이썬 라이브러리로 제공된다. 따라서 파이썬만 설치되어 있다면, 패키지를 다운로드 받은 뒤 간단한 명령어만으로도 Tracking Server를 구동할 수 있다.

하지만 대부분의 프로덕션 환경에서는 컨테이너 기반의 운영을 선호할 것이다. 이에 따라 두 가지 설치 방법을 모두 안내한다.

- (1) Python 패키지를 이용한 설치
- (2) Docker Compose를 이용한 설치

> 다음 포스팅에서 Tracking Server와 함께 Server Side를 구성하는 Backend Store, Artifact Store를 함께 설치하는 방법을 다룰 예정이다. 이번 포스팅에서는 Tracking Server에만 집중하여 일부 누락된 내용이 있을 수 있으니, 필요시 다음 포스팅을 참고
> 

### 2. Python 패키지를 이용한 설치

#### (1) MLflow 설치

가장 먼저 Python 환경에 MLflow 패키지를 설치한다.

```
pip install mlflow
```

설치가 완료되면 `mlflow` 명령어를 사용할 수 있다.

```
mlflow --version
```

#### (2) 기본 Tracking Server 실행

가장 단순한 방식으로 Tracking Server를 실행한다.

```
mlflow server \
  --host 0.0.0.0 \
  --port 5000
```

실행 후 브라우저에서 다음 주소로 접속한다.

```
http://localhost:5000
```

![](/assets/images/20260614_001_003.jpg)  

위 방식으로 실행하면 별도의 Backend Store와 Artifact Store를 지정하지 않으며, 기본 설정에 따라 로컬 환경에 메타데이터와 아티팩트가 저장된다. 개인 개발이나 간단한 테스트에는 적합하지만, 팀 단위 협업이나 운영 환경에는 적합하지 않다.

### 3. Docker Compose를 이용한 설치

#### (1) Docker Compose 방식의 구성

운영 환경에서는 Tracking Server만 단독으로 실행하기보다는 다음 구성 요소를 함께 실행하는 것이 일반적이다. 하지만 이번 포스팅에서는 Tracking Server만 살펴보도록 하며, 그 외의 요소들은 다음 포스팅에서 살펴보도록 한다.  

| 구성 요소 | 역할 | 예시 |
| --- | --- | --- |
| MLflow Tracking Server | API 및 Web UI 제공 | `mlflow` |
| Backend Store | 실험, 실행 메타데이터 저장 | PostgreSQL |
| Artifact Store | 모델 파일, 이미지, 데이터 파일 저장 | RustFS, MinIO, S3 |
| Bucket 초기화 컨테이너 | Artifact Store 버킷 생성 | AWS CLI |

#### (2) docker compose 파일 예시

아래는 PostgreSQL을 Backend Store로 사용하고, RustFS를 Artifact Store로 사용하는 예시다.

```yaml
# docker-compose.mlflow-server.yml
services:
  mlflow:
    image: ghcr.io/mlflow/mlflow:${MLFLOW_VERSION}
    container_name: mlflow-server
    command:
      - /bin/bash
      - -c
      - |
        mlflow server \
          --host "${MLFLOW_HOST}" \
          --port "${MLFLOW_PORT}"
    ports:
      - "${MLFLOW_PORT}:${MLFLOW_PORT}"
```

환경변수 파일은 아래와 같이 작성해준다.  

```bash
# .env
MLFLOW_VERSION=v3.10.1-full
MLFLOW_HOST=0.0.0.0
MLFLOW_PORT=5000
```

Docker Compose 명령어를 통해 컨테이너, 서비스를 실행할 수 있다.  

```bash
docker compose -f docker-compose.mlflow-server.yml up -d
```

위 설정만으로도 MLflow Tracking Server를 실행할 수 있지만, 이 경우 컨테이너 내부에 데이터가 저장되므로, 컨테이너를 삭제하면 실험 이력과 아티팩트가 사라질 수 있다. 따라서 프로덕션 환경에서는 도커 볼륨 마운트 및 Backend-Stroe, Artifact Store와의 연결을 고려해야 한다.  

샌드박스 서버에서 컨테이너를 실행시킨 뒤 접속해본 화면은 아래와 같다.  

![](/assets/images/20260614_001_004.jpg)  

### 4. 설치 방식 비교

| 구분 | Python 패키지 설치 | Docker Compose 설치 |
| --- | --- | --- |
| 권장 상황 | 개인 개발, 간단한 테스트 | 팀 협업, 운영 환경 |
| 실행 방식 | `mlflow server` 명령어 직접 실행 | 컨테이너 기반 실행 |
| Backend Store | 로컬 또는 외부 DB 직접 지정 | PostgreSQL 컨테이너 연동 용이 |
| Artifact Store | 로컬 또는 외부 스토리지 직접 지정 | RustFS, MinIO, S3 등 연동 용이 |
| 장점 | 빠르고 단순함 | 재현성, 분리성, 운영 관리에 유리 |
| 단점 | 운영 환경 관리가 어려움 | 초기 설정이 상대적으로 복잡함 |

### 5. Tracking Server 실행과 실행 옵션

#### (1) Tracking Server 실행

Tracking Server는 `mlflow server` 명령어로 실행한다.

```bash
mlflow server \
  --backend-store-uri postgresql://user:password@localhost:5432/mlflowdb \
  --artifacts-destination s3://my-mlflow-bucket \
  --serve-artifacts \
  --host 0.0.0.0 \
  --port 5000
```

#### (2) 실행 옵션

| 옵션 | 설명 |
| --- | --- |
| `--host` | 서버가 바인딩될 네트워크 주소 |
| `--port` | Tracking Server가 사용할 포트 |
| `--backend-store-uri` | 실행, 실험, 파라미터, 메트릭 등의 메타데이터를 저장할 Backend Store URI  |
| `--artifacts-destination` | 아티팩트를 저장할 Artifact Store URI |
| `--serve-artifacts` | 클라이언트가 Artifact Store에 직접 접근하지 않고 Tracking Server를 통해 아티팩트를 주고받도록 설정 |

## Backend Store, Artifact Store와 연결

### 1. Backend Store 와의 연결

Tracking Server는 `--backend-store-uri` 옵션을 통해 Backend Store와 연결된다.

```bash
--backend-store-uri postgresql://mlflow:mlflow@mlflow-postgres:5432/mlflow
```

### 2. Artifact Store 와의 연결

Tracking Server는 `--artifacts-destination` 옵션을 통해 Artifact Store와 연결된다.

```bash
--artifacts-destination s3://mlflow
```

S3 호환 오브젝트 스토리지를 사용하는 경우, 다음 환경변수도 함께 설정한다.  

```bash
MLFLOW_S3_ENDPOINT_URL=http://mlflow-storage:9000
AWS_ACCESS_KEY_ID=s3admin
AWS_SECRET_ACCESS_KEY=s3admin
AWS_DEFAULT_REGION=us-east-1
```

### 3. Artifact Proxy

Artifact Proxy를 사용하면 클라이언트가 S3, RustFS, MinIO 같은 Artifact Store에 직접 접근하지 않는다. 대신 Tracking Server가 클라이언트 요청을 받아 Artifact Store에 업로드하거나 다운로드한다.

운영 환경에서는 Artifact Proxy 방식을 사용하는 것이 일반적이며, 장점은 아래와 같다.  

| 장점 | 설명 |
| --- | --- |
| **접근 정보 단순화** | 클라이언트는 Tracking Server 주소만 알면 된다. |
| **보안성 향상** | S3 Access Key, Secret Key를 각 사용자 PC에 배포하지 않아도 된다. |
| **중앙 제어** | Artifact 접근 경로와 권한을 서버 측에서 관리할 수 있다. |
| **협업 편의성** | 여러 사용자가 동일한 서버를 통해 실험 결과와 모델 파일을 공유할 수 있다. |

MLflow Tracking Server를 실행시킬 때 Artifact Proxy 사용 설정을 할 수 있다.  

```bash
mlflow server \
  --serve-artifacts \
  ...
```

## Reference

![https://mlflow.org/docs/latest/self-hosting/architecture/tracking-server/](https://mlflow.org/docs/latest/self-hosting/architecture/tracking-server/)  
![https://mlflow.org/docs/latest/self-hosting/architecture/backend-store/](https://mlflow.org/docs/latest/self-hosting/architecture/backend-store/)  
![https://mlflow.org/docs/latest/self-hosting/architecture/artifact-store/](https://mlflow.org/docs/latest/self-hosting/architecture/artifact-store/)  
![https://mlflow.org/docs/latest/ml/tracking/](https://mlflow.org/docs/latest/ml/tracking/)  
![https://mlflow.org/docs/latest/self-hosting/security/network/](https://mlflow.org/docs/latest/self-hosting/security/network/)  