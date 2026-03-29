---
title: "[Airflow] 04. 에어플로우 설치, Docker를 이용한." # 제목 (필수)
excerpt: "배포된 도커 이미지를 이용한 설치" # 서브 타이틀이자 meta description (필수)
date: 2026-03-30 01:07:00 +0900      # 작성일 (필수)
lastmod: 2026-03-30 01:07:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-03-30 01:07:00 +0900   # 최종 수정일 (필수)
categories: Ops         # 다수 카테고리에 포함 가능 (필수)
tags: airflow devops mlops 스케줄링 scheduling schedule 모니터링 monitor monitoring airflow 에어플로우 설치 installation docker image 도커 이미지 워크플로우 워크플로 workflow 오케스트레이션 오케스트레이터 orchestration orchestrator                   # 태그 복수개 가능 (필수)
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
<!--postNo: 20260330_006-->

## Docker로 Airflow 설치하기

### 설치 환경

- OS : Linux, WSL 등 Docker 활용이 가능한 OS 또는 플랫폼 위

[도커 설치 방법](https://whdrns2013.github.io/docker/20230912_001_docker_installation/)  

[도커 컴포즈 설치 방법](https://whdrns2013.github.io/docker/20241015_002_docker_compose_install/)  

### (1) 설치에 대한 안내

[Installation of Airflow® — Airflow 3.1.8 Documentation](https://airflow.apache.org/docs/apache-airflow/stable/installation/index.html#using-production-docker-images)

도커 이미지를 통해 컨테이너로 airflow를 띄울 때의 주의사항  

- (1) 종속성과 확장 기능은 직접 구현해야 함
- (2) airflow, airflow provider의 데이터베이스 설정을 직접 해야 함
- (3) 자동시작, 복구, 유지관리를 직접 해야 함
- (4) 시스템 리소스 모니터링 및 관리를 직접 해야 함

### (2) Apache Airflow 용 Docker Image  

- Apache Airflow 커뮤니티에서는, 새로운 버전이 출시될 때마다 Docker Hub 에 이미지를 배포한다.  
- [https://hub.docker.com/r/apache/airflow](https://hub.docker.com/r/apache/airflow)  
- Airflow Docker Image의 태깅 규칙은 아래와 같다.  

|이미지|설명|
|---|---|
|apache/airflow:latest|기본 Python 버전이 포함된 최신 Airflow 이미지|
|apache/airflow:latest-pythonX.Y|특정 Python 버전이 포함된 최신 Airflow 이미지|
|apache/airflow:x.y.z|기본 Python 버전이 포함된 특정 Airflow 이미지|
|apache/airflow:x.y.z-pythonX.Y|특정 Python 버전이 포함된 특정 Airflow 이미지|

- Airflow의 필수 기능만 포함한 slim 이미지가 있다.  
- slim 이미지는 Airflow Core, Task SDK 및 최소한의 필수 의존성만 가지고 있다.  
- 따라서 필요시 종속성 및 추가 패키지를 직접 설치해야 한다.  

|이미지|설명|
|---|---|
|apache/airflow:slim-latest|기본 Python 버전이 포함된 최신 Airflow 이미지(코어)|
|apache/airflow:slim-latest-pythonX.Y|특정 Python 버전이 포함된 최신 Airflow 이미지(코어)|
|apache/airflow:slim-x.y.z|기본 Python 버전이 포함된 특정 Airflow 이미지(코어)|
|apache/airflow:slim-x.y.z-pythonX.Y|특정 Python 버전이 포함된 특정 Airflow 이미지(코어)|

### (3) Docker 기반 Airflow 설치 방법의 종류  

- Docker 기반 Airflow 설치 방법은 아래 순서에 따라 살펴볼 예정이다.  

|No|설치 방법|설명|
|---|---|---|
|1|Docker Compose|Airflow에서 제공하는 Docker Compose 설정파일을 이용하 컨테이너들을 실행|
|2|Docker Build|기본 Airflow Docker Image를 이용하되, 필요한 Provider 등을 함께 설치|

## 1. Docker Compose를 이용한 설치    

### (1) Docker Image 탐색    

- [https://hub.docker.com/r/apache/airflow](https://hub.docker.com/r/apache/airflow)  
- Docker Hub 에서 알맞은 Airflow 도커 이미지를 찾는다.  
- 이번 실습에서는 Python3.13 버전이 포함된 Airflow3.1.8 버전 이미지를 사용한다.  

### (2) Docker Compose 설정파일 준비  

- Docker Compose를 위한 설정파일을 준비한다.  
- 표준적인 설정파일을 Airflow에서 제공하고 있으니, 아래 URL을 통해 다운로드 받는다.   
- [https://airflow.apache.org/docs/apache-airflow/3.1.8/docker-compose.yaml](https://airflow.apache.org/docs/apache-airflow/3.1.8/docker-compose.yaml)  

### (3) Docker Compose 설정파일 설명  

- 표준적인 Airflow Docker Compose는 아래 서비스들로 구성된다.  

> Airflow에서도 밝히듯 이는 `CeleryExecutor` 기준의 표준이다. LocalExecutor를 사용하는 경우, redis나 worker, flower가 불필요하다.  

|서비스|역할|설명|
|---|---|---|
|airflow-scheduler|스케줄러|모든 Task와 DAG를 모니터링한 뒤, 실행조건이 맞으면 Task를 작업 큐에 예약/실행|
|airflow-dag-processor|DAG분석기|DAG 파일을 읽고 해석하여 스케줄러가 사용할 수 있는 형태로 변환|
|airflow-api-server|API서버&UI|Airflow의 웹 인터페이스(Web UI)를 제공하며, 외부 API 요청을 처리(기본 8080포트)|
|airflow-worker|워커|스케줄러가 지정한 작업을 실행하는 작업자|
|airflow-triggerer|트리거러|지연 작업(Deferred tasks)을 효율적으로 처리하기 위해 비동기적으로 이벤트를 감시|
|airflow-init|초기화 서비스|컨테이너가 처음 뜰 때 DB 마이그레이션, 유저 생성, 폴더 권한 설정 등을 수행하고 종료|
|postgres|메타데이터DB|Airflow의 모든 설정, DAG 상태, 실행 이력 등을 저장|
|redis|메시지브로커|스케줄러가 보낸 작업 메시지를 워커에게 전달하기 위한 중간 대기소|
|airflow-cli|명령어도구|`airflow` 명령어를 직접 입력해 관리 작업을 수행할 수 있는 디버깅용 서비스|
|flower|모니터링 툴|Celery 워커들의 상태와 작업 처리 현황을 시각적으로 보여줌(기본 5555포트)|

- 주요 설정 포인트들은 아래와 같다.  

|설정|역할|설명|
|---|---|---|
|`x-airflow-common`|공통 설정|모든 Airflow 서비스가 동일한 이미지와 환경 변수(DB 연결 정보 등)를 공유하도록 함|
|`postgres-db-volume`|데이터 보존|컨테이너가 내려가도 DB 데이터가 사라지지 않게 설정|
|`image: ${AIRFLOW_IMAGE_NAME}`|이미지 버전|Airflow 이미지 버전|

### (4) Docker Compose 설정값 조정  

- 개인의 필요에 맞춰 Docker Compose 내 설정값을 조정한다.  
- 공통 설정값은 `x-airflow-commo` 그룹에서 설정하며, 개별 서비스별 설정값은 해당 섹션에서 설정한다.  
- 설정값을 직접 조정하는 것 보다는, `.env` 파일을 이용해 설정값을 주입하는 방식을 권장한다.  

```yml
# .env 파일을 통한 주입 예시 - Docker Compose 파일
x-airflow-common:
  &airflow-common
  image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:3.1.8}
  # build: .
  env_file:
    - ${ENV_FILE_PATH:-.env}
  environment:
    &airflow-common-env
    AIRFLOW__CORE__EXECUTOR: ${AIRFLOW_CORE_EXECUTOR:-CeleryExecutor}
    # AIRFLOW__CORE__AUTH_MANAGER: airflow.providers.fab.auth_manager.fab_auth_manager.FabAuthManager
    AIRFLOW__CORE__SIMPLE_AUTH_MANAGER_ALL_ADMINS: "True"
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@${AIRFLOW_POSTGRES_SERVICE_NAME:-postgres}/airflow
    AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@${AIRFLOW_POSTGRES_SERVICE_NAME:-postgres}/airflow
    AIRFLOW__CELERY__BROKER_URL: redis://:@${AIRFLOW_REDIS_SERVICE_NAME:-redis}:${AIRFLOW_REDIS_PORT:-6379}/0
    AIRFLOW__CORE__FERNET_KEY: ''
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: 'true'
    AIRFLOW__CORE__LOAD_EXAMPLES: 'true'
    AIRFLOW__CORE__EXECUTION_API_SERVER_URL: 'http://airflow-apiserver:${AIRFLOW_API_PORT:-8080}/execution/'
    AIRFLOW__API_AUTH__JWT_SECRET: ${AIRFLOW__API_AUTH__JWT_SECRET:-airflow_jwt_secret}
    AIRFLOW__API_AUTH__JWT_ISSUER: ${AIRFLOW__API_AUTH__JWT_ISSUER:-airflow}
    AIRFLOW__SCHEDULER__ENABLE_HEALTH_CHECK: 'true'
    _PIP_ADDITIONAL_REQUIREMENTS: ${_PIP_ADDITIONAL_REQUIREMENTS:-}
    AIRFLOW_CONFIG: '/opt/airflow/config/airflow.cfg'
  volumes:
    - ${AIRFLOW_PROJ_DIR:-./airflow}/dags:/opt/airflow/dags
    - ${AIRFLOW_PROJ_DIR:-./airflow}/logs:/opt/airflow/logs
    - ${AIRFLOW_PROJ_DIR:-./airflow}/config:/opt/airflow/config
    - ${AIRFLOW_PROJ_DIR:-./airflow}/plugins:/opt/airflow/plugins
  user: "${AIRFLOW_UID:-50000}:0"
  ...
```

> `AIRFLOW__CORE__AUTH_MANAGER` 설정값 주석  
> FabAuthManager provider는 기본 설치된 provider가 아님. 이에 오류를 유발시킬 수 있어 주석처리  
> 대신 AIRFLOW__CORE__SIMPLE_AUTH_MANAGER_ALL_ADMINS 를 활성화하여 사용자들의 로그인 허용  

- `.env` 파일에 설정값을 지정하면, Docker Compose 파일에서 설정을 하나 하나 바꿀 필요 없어서 편리함  
- 또한, 같은 값이 여러 군데 존재하는 경우에도, 한 번에 적용할 수 있으므로 편리  

```bash
# .env 파일을 통한 주입 예시 - .env 파일
AIRFLOW_IMAGE_NAME=apache/airflow:3.1.8-python3.13
AIRFLOW_CORE_EXECUTOR=LocalExecutor
AIRFLOW_POSTGRES_SERVICE_NAME=airflow-postgres
AIRFLOW_REDIS_SERVICE_NAME=airflow-redis
AIRFLOW_REDIS_PORT=6379
AIRFLOW_API_PORT=8080
AIRFLOW_PROJ_DIR=./airflow
```

### (5) Docker Compose 실행  

- 설정이 모두 완료되었다면, `docker-compose up` 명령어를 통해 실행  

```bash
docker compose up
```

- 모든 컨테이너가 정상적으로 올라왔다면 브라우저를 통해 `http://localhost:8080` UI로 접속  

![alt text](/assets/images/20260330_006_001.png)

- 위와 같이 UI가 정상적으로 보인다면 설치 완료  


## 커스텀 Docker Image Build  

### (1) Provider  

- Airflow 생태계에는 Airflow Core에서 제공하지 않는 유용한 추가 기능들이 갖춰져있다.  
- 이러한 추가 기능들을 `provider` 라고 부르며, Airflow에서는 이들을 쉽게 연결할 수 있는 체계가 갖춰져있다.  
- 더욱 자세한 내용은 포스팅 중 Airflow Provider 에 대한 포스팅을 참고하기 바란다.  
(Provider와 Extras)  

### (2) Dockerfile 작성  

- 커스텀 도커 이미지를 빌드하기 위해 Dockerfile에 세부 스펙을 명세한다.  

```dockerfile
# Dockerfile.airflow
ARG AIRFLOW_ORIGIN_IMAGE_NAME=apache/airflow:3.1.8-python3.13 # .env 파일로부터 IMAGE 이름 로딩 

FROM ${AIRFLOW_ORIGIN_IMAGE_NAME}
USER airflow

ARG AIRFLOW_EXTRAS            # .env 파일로부터 설치할 EXTRAS 로딩
RUN pip install --no-cache-dir "apache-airflow[${AIRFLOW_EXTRAS}]"
```

- env 파일에 설치할 EXTRAS에 대해 명시한다.  

```bash
# .env 파일
AIRFLOW_ORIGIN_IMAGE_NAME=apache/airflow:3.1.8-python3.13
AIRFLOW_EXTRAS=postgres,mysql,docker,elasticsearch,pgvector,redis,apache-kafka,apache-spark,grpc,http,opensearch
```

### (3) Dockerfile을 이용해서 빌드  

- 이제 Airflow 이미지를 빌드해서 사용하면 된다. 여기에는 두 가지 방법이 있다.  
- (a) docker compose 파일에서 이미지명 대신 build 키워드를 이용  
- (b) `docker build` 명령어로 이미지를 빌드한 뒤 사용  

#### (a) docker compose 파일에서 build 키워드 사용    

- image 키워드 대신 build 키워드를 사용하고, build에 필요한 컨텍스트와 인자를 정의한다.  

```yml
x-airflow-common:
  &airflow-common
  # image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:3.1.8} # 이미지 대신
  build: # build 키워드 사용
    context: .
    args:
      - AIRFLOW_ORIGIN_IMAGE_NAME=${AIRFLOW_ORIGIN_IMAGE_NAME}
      - AIRFLOW_EXTRAS=${AIRFLOW_EXTRAS}
```

- 이후 `docker compose up` 명령어를 통해 컨테이너를 실행시키면 된다  

#### (b) docker build로 도커 이미지 만들기  

- 또 다른 방법은 `docker build` 명령어로 도커 이미지를 만드는 것이다.  
- 인터넷이 안되는 폐쇄망 환경에서 docker compose 를 사용해 컨테이너를 실행해야 하는 환경 등에 유용하다.  
- 가장 먼저 env 파일에 환경변수를 세팅한다.  

```bash
# .env 파일에 이미지명 등 환경변수 세팅
AIRFLOW_ORIGIN_IMAGE_NAME=apache/airflow:3.1.8-python3.13 # base image 이름
AIRFLOW_IMAGE_NAME=apache/airflow:3.1.8-python3.13-custom # 빌드하는 이미지 이름
AIRFLOW_EXTRAS=postgres,mysql,docker,elasticsearch,pgvector,redis,grpc,http,opensearch
```

- env 파일에 세팅한 환경변수를 현재 쉘에 등록한다.  

```bash
# 현재 폴더의 .env 파일의 변수를 환경변수에 등록
export $(grep -v '^#' .env | xargs)
```

- 이미지를 빌드한다.  

```bash
# 도커 이미지 빌드
docker build \
        --build-arg AIRFLOW_ORIGIN_IMAGE_NAME="$AIRFLOW_ORIGIN_IMAGE_NAME" \
        --build-arg AIRFLOW_EXTRAS="$AIRFLOW_EXTRAS" \
        -t apache/airflow:3.1.8-python3.13-custom \
        -f Dockerfile.airflow .
```

- 빌드가 완료되면 지정한 태그의 도커 이미지가 생성된 것을 볼 수 있다.  

```bash
$ sudo docker images
IMAGE                                    ...  DISK USAGE   CONTENT SIZE   EXTRA
apache/airflow:3.1.8-python3.13          ...  3.04GB          646MB
apache/airflow:3.1.8-python3.13-custom   ...  3.06GB          648MB    U
```

- `docker compose up` 명령어를 통해 컨테이너들을 실행시킨다.  
- docker compose 파일에서 airflow 이미지 이름이 빌드한 이미지와 일치하는지 반드시 확인한다.  

```yml
x-airflow-common:
  &airflow-common
  image: ${AIRFLOW_IMAGE_NAME}
```

## Further More  

### 1. LocalExecutor를 사용하는 경우 제외해도 되는 서비스들    

- 표준 docker compose 파일을 열어보면 많은 서비스들이 있다.  
- airflow-api, worker, scheduler ... 등등 10개나 된다.  
- Airflow 공식 DOC에서도 밝히듯, 이 서비스들은 `CeleryExecutor` 기반의 환경에 맞춰 설계되었다.  
- `LocalExecutor` 를 사용하는 경우는 일부 서비스를 제외해도 된다.  

|서비스|제외 가능 여부|설명|
|---|---|---|
|airflow-scheduler|제외불가|스케줄링에 필요한 필수 서비스|
|airflow-dag-processor|제외불가|스케줄러와 함께 필요한 필수 서비스|
|airflow-api-server|제외불가|핵심 API 서버로 제외 불가|
|postgres|제외불가|LocalExecutor 사용시 필수|
|airflow-init|제외불가|필수 초기화 태스크 포함|
|airflow-triggerer|옵셔널|deferred task를 사용하는 경우 필요|
|airflow-cli|가능|CLI 명령어 전용 작업 컨테이너이므로 제거 가능<br>편의용으로, Celery 사용 여부에 관계 없이 제거 가능|
|airflow-worker|가능|Celery 환경에서 필요한 서비스임|
|redis|가능|Celery 환경에서 필요한 서비스임|
|flower|가능|Celery 환경에서 필요한 서비스임|

<details>
<summary> <strong>LocalExecutor 를 사용할 경우 Docker Compose</strong> </summary>
<div markdown='1'>

- docker-compose.yml  

```yml

---
x-airflow-common:
  &airflow-common
  image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:3.1.8-python3.13-custom}
  # build: .
  env_file:
    - ${ENV_FILE_PATH:-.env}
  environment:
    &airflow-common-env
    AIRFLOW__CORE__EXECUTOR: ${AIRFLOW_CORE_EXECUTOR:-LocalExecutor}
    # AIRFLOW__CORE__AUTH_MANAGER: airflow.providers.fab.auth_manager.fab_auth_manager.FabAuthManager
    AIRFLOW__CORE__SIMPLE_AUTH_MANAGER_ALL_ADMINS: "True"
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@${AIRFLOW_POSTGRES_SERVICE_NAME:-postgres}/airflow
    AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@${AIRFLOW_POSTGRES_SERVICE_NAME:-postgres}/airflow
    AIRFLOW__CELERY__BROKER_URL: redis://:@${AIRFLOW_REDIS_SERVICE_NAME:-redis}:${AIRFLOW_REDIS_PORT:-6379}/0
    AIRFLOW__CORE__FERNET_KEY: ''
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: 'true'
    AIRFLOW__CORE__LOAD_EXAMPLES: 'true'
    AIRFLOW__CORE__EXECUTION_API_SERVER_URL: 'http://airflow-apiserver:${AIRFLOW_API_PORT:-8080}/execution/'
    AIRFLOW__API_AUTH__JWT_SECRET: ${AIRFLOW__API_AUTH__JWT_SECRET:-airflow_jwt_secret}
    AIRFLOW__API_AUTH__JWT_ISSUER: ${AIRFLOW__API_AUTH__JWT_ISSUER:-airflow}
    AIRFLOW__SCHEDULER__ENABLE_HEALTH_CHECK: 'true'
    _PIP_ADDITIONAL_REQUIREMENTS: ${_PIP_ADDITIONAL_REQUIREMENTS:-}
    AIRFLOW_CONFIG: '/opt/airflow/config/airflow.cfg'
  volumes:
    - ${AIRFLOW_PROJ_DIR:-./airflow}/dags:/opt/airflow/dags
    - ${AIRFLOW_PROJ_DIR:-./airflow}/logs:/opt/airflow/logs
    - ${AIRFLOW_PROJ_DIR:-./airflow}/config:/opt/airflow/config
    - ${AIRFLOW_PROJ_DIR:-./airflow}/plugins:/opt/airflow/plugins
    - /var/run/docker.sock:/var/run/docker.sock
  user: "${AIRFLOW_UID:-50000}:0"
  depends_on:
    &airflow-common-depends-on
    airflow-postgres:
      condition: service_healthy

services:
  airflow-postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - ${AIRFLOW_POSTGRES_DB_VOLUME_NAME:-postgres-db-volume}:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "airflow"]
      interval: 10s
      retries: 5
      start_period: 5s
    restart: always

  airflow-apiserver:
    <<: *airflow-common
    command: api-server
    ports:
      - "${AIRFLOW_API_PORT:-8080}:8080"
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8080/api/v2/monitor/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-scheduler:
    <<: *airflow-common
    command: scheduler
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8974/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-dag-processor:
    <<: *airflow-common
    command: dag-processor
    healthcheck:
      test: ["CMD-SHELL", 'airflow jobs check --job-type DagProcessorJob --hostname "$${HOSTNAME}"']
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-triggerer:
    <<: *airflow-common
    command: triggerer
    healthcheck:
      test: ["CMD-SHELL", 'airflow jobs check --job-type TriggererJob --hostname "$${HOSTNAME}"']
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-init:
    <<: *airflow-common
    entrypoint: /bin/bash
    # yamllint disable rule:line-length
    command:
      - -c
      - |
        if [[ -z "${AIRFLOW_UID}" ]]; then
          echo
          echo -e "\033[1;33mWARNING!!!: AIRFLOW_UID not set!\e[0m"
          echo "If you are on Linux, you SHOULD follow the instructions below to set "
          echo "AIRFLOW_UID environment variable, otherwise files will be owned by root."
          echo "For other operating systems you can get rid of the warning with manually created .env file:"
          echo "    See: https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#setting-the-right-airflow-user"
          echo
          export AIRFLOW_UID=$$(id -u)
        fi
        one_meg=1048576
        mem_available=$$(($$(getconf _PHYS_PAGES) * $$(getconf PAGE_SIZE) / one_meg))
        cpus_available=$$(grep -cE 'cpu[0-9]+' /proc/stat)
        disk_available=$$(df / | tail -1 | awk '{print $$4}')
        warning_resources="false"
        if (( mem_available < 4000 )) ; then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough memory available for Docker.\e[0m"
          echo "At least 4GB of memory required. You have $$(numfmt --to iec $$((mem_available * one_meg)))"
          echo
          warning_resources="true"
        fi
        if (( cpus_available < 2 )); then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough CPUS available for Docker.\e[0m"
          echo "At least 2 CPUs recommended. You have $${cpus_available}"
          echo
          warning_resources="true"
        fi
        if (( disk_available < one_meg * 10 )); then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough Disk space available for Docker.\e[0m"
          echo "At least 10 GBs recommended. You have $$(numfmt --to iec $$((disk_available * 1024 )))"
          echo
          warning_resources="true"
        fi
        if [[ $${warning_resources} == "true" ]]; then
          echo
          echo -e "\033[1;33mWARNING!!!: You have not enough resources to run Airflow (see above)!\e[0m"
          echo "Please follow the instructions to increase amount of resources available:"
          echo "   https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#before-you-begin"
          echo
        fi
        echo
        echo "Creating missing opt dirs if missing:"
        echo
        mkdir -v -p /opt/airflow/{logs,dags,plugins,config}
        echo
        echo "Airflow version:"
        /entrypoint airflow version
        echo
        echo "Files in shared volumes:"
        echo
        ls -la /opt/airflow/{logs,dags,plugins,config}
        echo
        echo "Running airflow config list to create default config file if missing."
        echo
        /entrypoint airflow config list >/dev/null
        echo
        echo "Files in shared volumes:"
        echo
        ls -la /opt/airflow/{logs,dags,plugins,config}
        echo
        echo "Change ownership of files in /opt/airflow to ${AIRFLOW_UID}:0"
        echo
        chown -R "${AIRFLOW_UID}:0" /opt/airflow/
        echo
        echo "Change ownership of files in shared volumes to ${AIRFLOW_UID}:0"
        echo
        chown -v -R "${AIRFLOW_UID}:0" /opt/airflow/{logs,dags,plugins,config}
        echo
        echo "Files in shared volumes:"
        echo
        ls -la /opt/airflow/{logs,dags,plugins,config}

    # yamllint enable rule:line-length
    environment:
      <<: *airflow-common-env
      _AIRFLOW_DB_MIGRATE: 'true'
      _AIRFLOW_WWW_USER_CREATE: 'true'
      _AIRFLOW_WWW_USER_USERNAME: ${_AIRFLOW_WWW_USER_USERNAME:-airflow}
      _AIRFLOW_WWW_USER_PASSWORD: ${_AIRFLOW_WWW_USER_PASSWORD:-airflow}
      _PIP_ADDITIONAL_REQUIREMENTS: ''
    user: "0:0"

volumes:
  airflow-postgres-db-volume:

```

- env 환경변수  

```bash
# Airflow
AIRFLOW_UID=50000
AIRFLOW_ORIGIN_IMAGE_NAME=apache/airflow:3.1.8-python3.13
AIRFLOW_IMAGE_NAME=apache/airflow:3.1.8-python3.13-custom
AIRFLOW_CORE_EXECUTOR=LocalExecutor
AIRFLOW_POSTGRES_SERVICE_NAME=airflow-postgres
AIRFLOW_REDIS_PORT=6379
AIRFLOW_API_PORT=8080
AIRFLOW_FLOWER_PORT=5555
AIRFLOW_PROJ_DIR=./airflow
AIRFLOW_POSTGRES_DB_VOLUME_NAME=airflow-postgres-db-volume
_AIRFLOW_WWW_USER_USERNAME=1234
_AIRFLOW_WWW_USER_PASSWORD=1234
AIRFLOW_EXTRAS=postgres,mysql,docker,elasticsearch,pgvector,redis,apache-kafka,apache-spark,grpc,http,opensearch
```

- Dockerfile  

```bash
ARG AIRFLOW_ORIGIN_IMAGE_NAME=apache/airflow:3.1.8-python3.13 # .env 파일로부터 IMAGE 이름 로딩 

FROM ${AIRFLOW_ORIGIN_IMAGE_NAME}
USER airflow

ARG AIRFLOW_EXTRAS            # .env 파일로부터 설치할 EXTRAS 로딩
RUN pip install --no-cache-dir "apache-airflow[${AIRFLOW_EXTRAS}]"
```

</div>
</details>


### 2. 예시 DAG들을 제거하기  

![alt text](/assets/images/20260330_006_002.png)

- airflow를 처음 접속해보면 위 사진과 같이 많은 예제 DAG들을 볼 수 있다.  
- 이런 예제들을 제거하려면, 설정파일을 수정해주면 된다.  

```bash
# airflow.cfg
load_examples = False # True -> False 수정
```


## Trouble Shooting  

### 1. ModuleNotFoundError: No module named 'airflow.providers.fab'  

#### (1) 원인  

- Airflow 3.0부터는 기존에 기본으로 포함되어 있던 UI 관리자(Flask App Builder, FAB)가 별도의 프로바이더 패키지로 완전히 분리됨  
- Airflow 표준 Docker Compose 파일에는 `AIRFLOW__CORE__AUTH_MANAGER` 설정값이 `airflow.providers.fab`로 지정되어있으나, 이는 기본 패키지가 아님  
- 따라서 의존성 확보 실패로 인해 서비스가 실행되지 않음  

#### (2) 해결  

- 1안 : `AIRFLOW__CORE__AUTH_MANAGER`를 비활성화하고 `AIRFLOW__CORE__SIMPLE_AUTH_MANAGER_ALL_ADMINS`를 활성화해 모든 접속을 허용  
- 2안 : `AIRFLOW__CORE__AUTH_MANAGER` 대신 `AIRFLOW__CORE__SIMPLE_AUTH_MANAGER_USERS` 사용  
- 3안 : `airflow.providers.fab` provider를 포함하여 airflow 이미지 빌드  



## Reference  

[https://airflow.apache.org/docs/docker-stack/index.html](https://airflow.apache.org/docs/docker-stack/index.html)  
[https://airflow.apache.org/docs/apache-airflow/stable/extra-packages-ref.html](https://airflow.apache.org/docs/apache-airflow/stable/extra-packages-ref.html)  
[https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html](https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html)  
[https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html)