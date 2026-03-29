---
title: "[Airflow] 에어플로우 Docker Operator" # 제목 (필수)
excerpt: "컨테이너를 띄워서 작업을 수행하기" # 서브 타이틀이자 meta description (필수)
date: 2026-03-30 01:18:00 +0900      # 작성일 (필수)
lastmod: 2026-03-30 01:18:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-03-30 01:18:00 +0900   # 최종 수정일 (필수)
categories: Ops         # 다수 카테고리에 포함 가능 (필수)
tags: airflow devops mlops 스케줄링 scheduling schedule airflow 도커 docker 오퍼레이터 operator 워크플로우 워크플로 workflow 오케스트레이션 오케스트레이터 orchestration orchestrator        # 태그 복수개 가능 (필수)
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

<!--postNo: 20260330_010-->

## Docker Operator  

### 1. 소개  

- Airflow에서 Docker 컨테이너를 하나의 Task 실행 단위로 다룰 수 있게 해주는 Operator  
- 이를 사용하면 특정 작업을 별도의 컨테이너 환경에서 실행할 수 있다.  
- 이 덕분에 호스트나 Airflow 환경과 분리된 상태로 작업을 처리할 수 있다.  
- Python 패키지 충돌, 시스템 라이브러리 차이, 실행 환경 문제를 줄일 수 있다.  
- 특히나 데이터 전처리, 모델 훈련 등 독립된 실행 환경이 필요한 작업에 안성맞춤!  
- 다만, Airflow가 Docker 위에서 동작하는 경우에는 추가 설정이 필요하다.  


### 2. 환경 준비    

- Docker 위에서 Airflow 가 동작하는 경우에 필요한 환경 준비 내용  
- 본 포스팅에서는 1번(Host의 Docker Engine을 이용) 방법을 적용했다.  

#### (1) Host의 docker engine을 이용  

- 첫 번째 방법은 Host의 docker engine을 이용하는 방법이다.  
- 이를 위해 Airflow Container는 Host의 docker 소켓에 접근이 가능해야 한다.  
- 이를 위해 Host의 docker.sock를 마운트 해준다.  

```yml
x-airflow-common:
  &airflow-common
  ...(중략)
  volumes:
    - ${AIRFLOW_PROJ_DIR:-./airflow}/dags:/opt/airflow/dags
    - ${AIRFLOW_PROJ_DIR:-./airflow}/logs:/opt/airflow/logs
    - ${AIRFLOW_PROJ_DIR:-./airflow}/config:/opt/airflow/config
    - ${AIRFLOW_PROJ_DIR:-./airflow}/plugins:/opt/airflow/plugins
    - /var/run/docker.sock:/var/run/docker.sock # 추가
...(후략)
```

#### (2) DinD 이용  

- 또는 DinD(Docker-in-Docker)를 이용할 수도 있다.  
- 하지만 이는 권한 설정이 까다롭고 보안상 위험할 수 있어 권장하지 않는다.  
- 대신 KubernetesPodOperator 사용을 권장하는 추세이다.  

### 3. 단일 DockerOperator Task 예제  

- `airflow.providers.docker.operators.docker` 의 `DockerOperator` 를 사용한다.  
- 아래는 도커를 실행시킨 뒤 "hello from container"를 출력하는 예제 코드이다.  

```python
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from datetime import datetime

with DAG(
    dag_id="run_process_via_host_docker",
    start_date=datetime(2026,1,1),
    schedule=None,
    catchup=False
) as dag:

    run_job = DockerOperator(
        task_id="run_job",
        image="python:3.11-slim",
        command="python -c \"print('hello from container')\"",
        docker_url="unix://var/run/docker.sock",
        network_mode="bridge",
        auto_remove="success",
    )
```

- 위와 같이 만든 py 파일을 DAG 디렉터리에 넣고, Airflow에서 DAG가 인식되면 Run  

![](/assets/images/20260330_010_001.png)


- 실행 결과  

![](/assets/images/20260330_010_002.png)

### 4. 소스코드나 데이터셋을 Mount 하기  

#### (1) 개요  

- DockerOperator를 사용하는 가장 핵심적인 이유는 "실행환경의 격리" 라고 생각한다.  
- 그리고 이러한 격리가 필요한 경우는, 보통 크고 복잡한 작업인 경우들이 대부분이라고 생각한다.  
- 따라서 여러 소스코드나 데이터셋을 Task에서 처리할 일이 많을 것이다.  
- 이 때 필요한 것이 바로 Mount 기능이다.  

#### (2) 방법  

- Airflow 워커가 접근 가능한 경로에 코드와 데이터셋을 둔다.  
- 그 경로를 새로 띄워지는 컨테이너 안에 마운트한다.  
- 먼저, 컨테이너에서 실행시킬 파이썬 파일 하나를 만들어봤다.  
- 이 파이썬 코드는 20초동안 sleep 하다가 일어나 텍스트 파일에 적힌 자신의 이름을 외친다.  

```python
# sleeping.py
import time

with open("/workspace/src/data/name.txt", "r", encoding="utf-8") as f:
    name = f.readline()

print("Go to Sleep...")
time.sleep(20)
print(f"Wake Up!!!! my name is {name}!!")
```

- 그리고 이를 불러와 컨테이너에서 실행시키는 Task 를 포함하는 DAG도 만들었다.  
- 명심할 것은, source 즉 원천 데이터가 **호스트에서 접근 가능한 경로**로 작성되어야 한다는 것  

```python
# docker_operator_mount_example.py
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from docker.types import Mount
from datetime import datetime

with DAG(
    dag_id="docker_mount",
    start_date=datetime(2026,1,1),
    schedule=None,
    catchup=False
) as dag:

    sleeping = DockerOperator(
        task_id="sleeping",
        image="python:3.11-slim",
        command="python /workspace/src/scripts/sleeping.py",
        docker_url="unix://var/run/docker.sock",
        mounts=[
            Mount(
                source="/opt/airflow/src/scripts", # 원천데이터 : 호스트에서 접근 가능한 경로여야 함 (Airflow 도커 안쪽이 아님!)
                target="/workspace/src/scripts",   # 타겟 : 워커 컨테이너 내에 마운트할 경로
                type="bind",                       # 마운트 유형
            ),
            Mount(
                source="/opt/airflow/src/data",
                target="/workspace/src/data",
                type="bind",
                read_only=True                     # 마운트 읽기전용 여부
            ),
        ],
        network_mode="bridge",
        working_dir="/workspace",
        auto_remove="success",
    )
```


- 파일의 위치를 그려보면 다음과 같다.(호스트 기준)  

```bash
opt
├─airflow
│  ├─config
│  ├─dags
│  │  └─docker_operator_mount_example.py
│  ├─logs
│  ├─plugins
│  ├─src
│  │  ├─scripts
│  │  │  └─sleeping.py
│  │  └─data
│  │     └─name.txt
...
```

### (3) 실행 결과  

- DAG가 정상적으로 잡히면, 트리거로 실행한다.  
- sleep 도중에 호스트에서 `docker ps` 명령어를 실행하면 아래와 같이 워커 컨테이너가 출력되는 것도 볼 수 있다.  

```bash
$ sudo docker ps
CONTAINER ID   IMAGE             COMMAND                  CREATED   ...
a12bc98c1221   python:3.11-slim  "python /workspace/s…"   8 seconds ago ... 
```

- 실행 결과 로그를 보면, 정상적으로 자신의 이름을 외치는 것을 볼 수 있다.  

![](/assets/images/20260330_010_003.png)


### 5. 다중 DockerOperator Task 예제  

- DockerOperator 는 각 Task마다 각각의 컨테이너를 띄운다.  
- 따라서 여러 개의 DockerOperator Task가 있다면, 해당 DAG에서는 여러 컨테이너들이 띄워졌다 종료된다.  

```python
# docker_operator_multi_task_examply.py
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from datetime import datetime

with DAG(
    dag_id="multi_task_docker_operator",
    start_date=datetime(2026,1,1),
    schedule=None,
    catchup=False
) as dag:

    first_job = DockerOperator(
        task_id="first_job",
        image="python:3.11-slim",
        command="python -c \"print('hello from container')\"",
        docker_url="unix://var/run/docker.sock",
        network_mode="bridge",
        auto_remove="success",
    )

    second_job = DockerOperator(
        task_id="second_job",
        image="python:3.11-slim",
        command="python -c \"print('2nd job is here!')\"",
        docker_url="unix://var/run/docker.sock",
        network_mode="bridge",
        auto_remove="success",
    )
```

- 실행 결과  

![](/assets/images/20260330_010_004.png)

![](/assets/images/20260330_010_005.png)



