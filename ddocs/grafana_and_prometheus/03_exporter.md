---
title: Exporter 설치하고 메트릭 수집하기 # 제목 (필수)
excerpt: 메트릭을 수집하고 제공하는 ecporter  # 서브 타이틀이자 meta description (필수)
date: 2025-04-22 18:40:00 +0900      # 작성일 (필수)
lastmod: 2025-04-22 18:40:00 +0900   # 최종 수정일 (필수)
permalink: /docs/grafana_and_prometheus/03_exporter/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
classes: wide
sidebar:
  nav: "docs_grafana_and_prometheus"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---
<!--postNo: 20250422_001-->

## Exporter  

### Exporter  

Exporter 란 시스템이나 애플리케이션의 메트릭 데이터를 수집하고, 이를 Prometheus 가 요청(Pull)할 때 제공할 수 있도록 설계된 구성 요소입니다.  

Exporter 가 데이터를 수집하는 방식엔 능동적인 방식과 수동적인 방식이 있습니다. 능동적으로 데이터를 읽어오기도 하지만, 애플리케이션이나 시스템으로부터 데이터를 수신하기도 합니다. 타겟이 되는 애플리케이션이나 시스템의 구조와 상황에 맞춰 이러한 데이터 수집 방식과 exporter의 종류를 결정해야 합니다. 아래 실제 예시에서 능동적인 유형과 수동적인 유형 두 가지를 모두 살펴보도록 하겠습니다.   

Exporter 는 수집하고 변환, 보관한 데이터를 일반적으로 HTTP 서버 형태로 메트릭을 노출합니다. 그리고 Prometheus 는 이렇게 노출된 엔드포인트에 접근해 데이터를 수집, 저장하게 됩니다.  

> 쉽게 말해, Prometheus 가 메트릭을 가져올 수 있도록 애플리케이션으로부터 데이터를 수집하고, 이 데이터를 엔드포인트에 노출시키는 역할을 한다.

### Exporter 의 종류  

Exporter 는 수집 대상에 따라 다양한 종류가 있습니다.  

| Exporter 이름        | 설명                                                |
| ------------------ | ------------------------------------------------- |
| node_exporter      | 리눅스 서버의 **CPU, 메모리, 디스크, 네트워크** 등 시스템 리소스를 수집     |
| cAdvisor           | Docker 컨테이너의 **리소스 사용량(CPU, 메모리, I/O 등)** 을 수집    |
| blackbox_exporter  | 외부 서비스에 대한 **Ping, HTTP, DNS, TCP 포트 상태** 등을 체크   |
| statsd_exporter    | StatsD 포맷으로 전송된 메트릭을 Prometheus 형식으로 변환           |
| mysqld_exporter    | MySQL 서버의 성능 및 상태 메트릭 수집 (쿼리 속도, 연결 수 등)          |
| kube-state-metrics | Kubernetes 클러스터 상태(파드 수, 상태, 리소스 요청량 등) 수집        |
| pushgateway        | 일시적인 메트릭(예: 배치 작업 결과)을 푸시해서 Prometheus에 저장 가능하게 함 |

### Exporter 개발하기  

필요에 따라서 커스텀 Exporter 를 개발할 수도 있습니다. 그리고 Python, Go, Node.js 등 다양한 언어로 쉽게 제작할 수 있도록 라이브러리들도 존재하고 있습니다.  

| 언어                    | 라이브러리 이름                                                                  | 설명                                        |
| --------------------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| **Go**                | [`prometheus/client_golang`](https://github.com/prometheus/client_golang) | Prometheus의 공식 언어, 가장 기능이 풍부하고 성숙도 높음     |
| **Python**            | [`prometheus_client`](https://github.com/prometheus/client_python)        | Flask나 Django와 연동하거나 단독 HTTP 서버로 쉽게 구성 가능 |
| **Java** / **Kotlin** | [`simpleclient`](https://github.com/prometheus/client_java)               | Spring Boot, Micronaut 등과 통합해서 사용         |
| **Node.js**           | [`prom-client`](https://github.com/siimon/prom-client)                    | Express.js 등 Node 기반 서버와 쉽게 통합 가능         |
| **Rust**              | [`prometheus`](https://github.com/tikv/rust-prometheus)                   | 매크로 기반으로 메트릭 선언이 편리함                      |
| **.NET (C#)**         | [`prometheus-net`](https://github.com/prometheus-net/prometheus-net)      | ASP.NET Core에 쉽게 통합 가능                    |


## Node Exporter  

### Node Exporter  

Node Exporter 는 리눅스 서버의 CPU, 메모리, 디스크, 네트워크사용량 등을 수집하여 HTTP 엔드포인트에 노출시키는 Exporter 입니다.  

### 설치하기  

Node Exporter 또한 도커로 쉽게 설치할 수 있습니다.  

[공식 node-exporter 도커](https://hub.docker.com/r/prom/node-exporter)    

재사용성과 명확한 명세를 위해 docker-compose 로 작동시키도록 하겠습니다.  

```yaml
services:
    node_exporter:
        image: prom/node-exporter:v1.9.1
        container_name: node_exporter
        command:
          - '--path.rootfs=/host'
        pid: host
        restart: unless-stopped
        ports:
          - 9100:9100
        volumes:
          - '/:/host:ro,rslave'
```

docker-compose 파일에 명세가 되었다면, 실행시켜줍니다.  

```bash
sudo docker compose up -d
```

### Prometheus 와 연결하기  

이전 포스트에서 airflow 에 대한 statsd exporter 와 연결시켜준 것과 동일하게, 설정파일에 node-exporter 에 대한 job 과 엔드포인트를 추가해주면 됩니다.  

```bash
vi /path/to/prometeus.yml
```

```yaml
scrape_configs:
  ...
  - job_name: node_exporter
    static_configs:
      - targets: ['localhost:9100']
    metrics_path: /metrics
```

추가했다면, 프로메테우스를 재실행해줍니다. docker 를 통해 프로메테우스를 실행해줬다면, 아래 명령어로 재실행이 가능합니다.  

```bash
sudo docker restart [프로메테우스 container id]
```

### 사용하기  

Prometheus 에서 node_ 라는 프리픽스로 볼 수 있습니다.  

![](/assets/images/20250422_001_001.png)  

### 주로 사용되는 쿼리  

| 구분       | 설명                                     | 쿼리                                                                                                                                            |
| -------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU 사용율  | idle 시간을 기준으로 전체 CPU 사용율 계산, 단위 퍼센트(%) | 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)                                                                |
| 메모리 사용량  | 사용 가능한 메모리를 전체 메모리에서 뺀 값, 바이트 단위       | node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes                                                                                   |
| 메모리 사용율  | 사용량 / 전체 메모리                           | (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100<br>                                          |
| 디스크 사용율  | 각 파티션별 디스크 사용율. 마운트포인트를 지정해주면 된다.      | 100 * (node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_avail_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} |
| 네트워크 송수신 | 루프백을 제외한 모든 네트워크 장비의 평균 트래픽            | 송신<br>rate(node_network_transmit_bytes_total{device!="lo"}[5m])<br>수신<br>rate(node_network_receive_bytes_total{device!="lo"}[5m])<br>         |

## cAdvisor  

### cAdvisor  

Google에서 개발한 도구로, **Docker 컨테이너들의 CPU, 메모리, 디스크 I/O, 네트워크 사용량** 등을 수집합니다. 메트릭을 Prometheus 포맷으로 `/metrics` 엔드포인트에 노출하기 때문에 Prometheus가 쉽게 수집할 수 있습니다.  

### 설치하기  

cAdvisor 또한 도커 컨테이너로 쉽게 띄울 수 있습니다.  

헷갈릴 수 있는 게, '컨테이너의 정보를 수집하려면, 컨테이너 안쪽에 설치해야 하나?' 라는 의문이 들 수 있지만, 그렇지 않습니다. cAdvisor 는 호스트에 설치하거나 또는, 별도 컨테이너로 띄우면 됩니다. 호스트의 docker 내부 정보를 읽을 수 있도록 볼륨 마운트를 진행해주기 때문에 각 컨테이너 안쪽에 설치되지 않아도 트래킹이 가능한 것입니다.  

[Google - cAdvisor 깃허브](https://github.com/google/cadvisor)  

```yaml
services:
    cadvisor:
        image: gcr.io/cadvisor/cadvisor:v0.49.1
        container_name: cadvisor
        privileged: true
	    devices:
	      - /dev/kmsg
	    ports:
	      - 9103:8080
	    volumes:
	      - /:/rootfs:ro
	      - /var/run:/var/run:ro
	      - /sys:/sys:ro
	      - /var/lib/docker/:/var/lib/docker:ro
	      - /dev/disk/:/dev/disk:ro
	    restart: unless-stopped
```

작성이 완료됐다면  

```bash
sudo docker compose up -d
```

### 사용하기  

웹 브라우저를 통해 `http://호스트주소:9103` 으로 접속해보면 호스트의 CPU, 메모리 사용에 관련된 정보나 호스트에 띄워진 컨테이너들, 그리고 각 컨테이너들의 CPU 사용율 등의 정보를 알 수 있습니다.  

![](/assets/images/20250422_001_002.png)  

### Prometheus 와 연결하기  

앞서 설명한 node-exporter 와 동일하게, prometheus yaml 파일에서 job 과 엔드포인트를 추가해주면 됩니다.  

```bash
vi /path/to/prometeus.yml
```

```yaml
scrape_configs:
  ...
  - job_name: cadvisor
    static_configs:
      - targets: ['localhost:9103']
    metrics_path: /metrics
```

추가했다면, 프로메테우스를 재실행해줍니다. docker 를 통해 프로메테우스를 실행해줬다면, 아래 명령어로 재실행이 가능합니다.  

```bash
sudo docker restart [프로메테우스 container id]
```

### 자주 사용되는 쿼리  

| 구분            | 설명                                                       | 쿼리                                                                                                |
| ------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 컨테이너 리스트      | 마지막으로 수집한 시간을 나타내는 쿼리. 실행중인 컨테이너 리스트를 확인하는 데에도 사용할 수 있다. | container_last_seen                                                                               |
| 컨테이너 CPU 사용률  |                                                          | rate(container_cpu_usage_seconds_total[1m])                                                       |
| 컨테이너 메모리 사용률  |                                                          | container_memory_usage_bytes / container_spec_memory_limit_bytes * 100                            |
| 컨테이너 디스크 사용률  |                                                          | container_fs_usage_bytes / container_fs_limit_bytes * 100                                         |
| 컨테이너 네트워크 트래픽 |                                                          | rate(container_network_receive_bytes_total[1m]), rate(container_network_transmit_bytes_total[1m]) |


## Statsd Exporter  

### statsd  

tatsd는 애플리케이션에서 발생하는 메트릭 데이터를 수집하고 전송하기 위한 경량 UDP 기반의 네트워크 프로토콜이자, 그것을 처리하는 데몬을 지칭합니다. UDP 를 사용한 이유는, 가볍고 빠르면서, 실시간성을 보장한다는 장점이 있기 때문입니다. 약간의 데이터 손실이 있지만, 앞서 설명한 장점 때문에 모니터링 시스템에 아주 적합합니다.  

### statsd exporter  

statsd exporter 란 statsd 형식의 데이터를 UDP 를 통해 수신하고, 이를 metric 형태로 변환하고, prometheus 등에서 사용할 수 있게 보관하고 있다가, prometheus 등의 서비스의 요청에 따라 메트릭 데이터를 제공할 수 있도록 HTTP endpoint 로 노출하는 서버를 뜻합니다.  

### 왜 필요한데?  

statsd 가 필요한 이유는 바로, 능동적인 metric 송신처의 데이터를 받기 위해서입니다. 우리가 prometheus 를 통해 데이터를 수집하려는 여러 서비스들은 항상 자신의 데이터를 프로메테우스가 가져갈 수 있도록 엔드포인트를 열어놓지 않습니다. 보안상 이유일 수도 있고, 혹은 그러한 기능을 만들지 않았기 때문일 수도 있습니다.  

따라서 애플리케이션측에서 직접적으로 메트릭 데이터를 만들어 송신하는 경우가 있는데, 이러한 데이터를 수신하기 위한 서버로 statsd exporter 가 필요한 것입니다.  

참고로 statsd-exporter 의 8125번 포트를 수신 포트, 9102번 포트를 메트릭 데이터를 제공하는 엔드포인트로 설정하는 게 기본값입니다.  

### 설치하기  

statsd exporter 를 설치하는 방법은 굉장히 간단합니다. 도커 이미지를 pull 하고, 실행시켜주면 됩니다. 제 경우엔 docker-compose 파일에 명세하여 실행시켰습니다.  

[Prometheus statsd exporter docker image](https://hub.docker.com/r/prom/statsd-exporter)  

```yml

# docker-compose.yml

services:
    ...
    statsd_exporter:
        image: prom/statsd-exporter:v0.28.0
        ports:
          - 8125:8125/udp
          - 9102:9102
        restart: always
        command: "--statsd.listen-udp=:8125"
```

```bash
sudo docker compose up -d statsd_exporter
```




## 예시 - airflow 연결해보기  

### airflow  

aiflow 는 작업을 스케줄링하고, 관리하고, 모니터링하는 데 사용되는 오픈 소스로, 주로 데이터 엔지니어링 작업이나 MLOps 에서 많이 사용됩니다. 저는 홈서버에서 데이터 스크래핑 과 데이터 변환 및 적재(즉 ETL)과 이를 Discord에 주기적으로 뿌려주는 역할로 사용하고 있습니다.  

### airflow 에서 metric 활성화하기  

airflow 는 metric을 송신하는 기능을 옵션으로 제공하고 있습니다. 이를 활용하기 위해서는 airflow 의 설정파일(`airflow.cfg`)에서 몇 가지 수정이 필요합니다. 설정 파일의 위치는 `${AIRFLOW_HOM}/airflow.cfg`  입니다.  

파일 내에서 아래 옵션들을 설정해주면 됩니다. statsd 라는 옵션명으로 쉽게 찾을 수 있습니다.  

```bash
# airflow.cfg
...
[metrics]
statsd_on = True               # False -> True 로 변경
statsd_host = localhost        # 프로메테우스가설치된호스트
statsd_port = 8125             #
statsd_prefix = airflow
```

위와 같이 설정이 완료되었다면, airflow 의 scheduler 와 webserver 를 다시 실행해줍니다.  

```bash
<scheduler, webserver 종료 후>
airflow scheduler -D
airflow webserver -D
```

만약 아래와 같은 오류가 발생한다면, 파이썬의 statsd 모듈을 설치해주면 됩니다.  

```bash
[2025-04-20T00:15:12.523+0900] {stats.py:42} ERROR - Could not configure StatsClient: No module named 'statsd', using NoStatsLogger instead.

$pip install statsd
```


위와 같이 설정하면, 프로메테우스에서 데이터를 수집할 수 있게 됩니다. 구성도는 아래와 같습니다.  

```csharp
[Airflow] --UDP전송(statsd포맷)--> [Statsd] --수집/변환--> [Prometheus]
```

### Prometheus 와 연결하기  

앞서서 statsd 를 설명하면서, statsd 서비스를 띄웠기 때문에 airflow 에서 송신하는 metric이 statsd로 들어가고 있고, 이를 Prometheus가 수집하고 있을 것입니다.  

만약, 앞선 statsd 섹션을 스킵했다면, 아래와 같이 prometheus yaml 파일에서 job 과 엔드포인트를 추가해줘야 합니다.  

```bash
vi /path/to/prometeus.yml
```

```yaml
scrape_configs:
  ...
  - job_name: airflow
    static_configs:
      - targets: ['localhost:9102']
    metrics_path: /metrics
```

추가했다면, 프로메테우스를 재실행해줍니다. docker 를 통해 프로메테우스를 실행해줬다면, 아래 명령어로 재실행이 가능합니다.  

```bash
sudo docker restart [프로메테우스 container id]
```

### 수집 데이터 확인하기  

이제 Airflow 에서 statsd 쪽으로 metric을 잘 보내는지, 그리고 이렇게 보낸 metric 이 Prometheus 에 잘 수집되는지를 살펴보겠습니다.  

수집 데이터를 확인할 수 있는 가장 간단한 방법은, 노드 익스포터의 엔드포인트에 직접 접근하는 것입니다. 엔드포인트가 기억나지 않는다면, Prometheus 에서 `Status > Target health` 메뉴에서 각 익스포터의 메트릭 엔드포인트를 확인할 수 있습니다.  


![](/assets/images/20250422_001_003.png)    

이번 포스팅에서는 statsd exporter 에 airflow의 metric 이 수집되고 있으니(정확히는 airflow가 exporter 에 데이터를 전송하고 있는 것) statsd_exporter 의 엔드포인트에 접근해보도록 하겠습니다.  

```bash
# HELP airflow_dag_processing_file_path_queue_size Metric autogenerated by statsd_exporter.
# TYPE airflow_dag_processing_file_path_queue_size gauge
airflow_dag_processing_file_path_queue_size 0
# HELP airflow_dag_processing_file_path_queue_update_count Metric autogenerated by statsd_exporter.
# TYPE airflow_dag_processing_file_path_queue_update_count counter
airflow_dag_processing_file_path_queue_update_count 3497
# HELP airflow_dag_processing_import_errors Metric autogenerated by statsd_exporter.
# TYPE airflow_dag_processing_import_errors gauge
airflow_dag_processing_import_errors 0
# HELP airflow_dag_processing_last_duration Metric autogenerated by statsd_exporter.
# TYPE airflow_dag_processing_last_duration summary
airflow_dag_processing_last_duration{quantile="0.5"} 0.20400800000000002
airflow_dag_processing_last_duration{quantile="0.9"} 0.304239
airflow_dag_processing_last_duration{quantile="0.99"} 0.40478
airflow_dag_processing_last_duration_sum 105.45207400000008
airflow_dag_processing_last_duration_count 435
# HELP airflow_dag_processing_last_duration_crawl_k_startup_announcement Metric autogenerated by statsd_exporter.
# TYPE airflow_dag_processing_last_duration_crawl_k_startup_announcement summary
```

수집되는 데이터를 보니, 잘 수집되고 있음을 알 수 있습니다.

## 다음 포스팅  

다음 포스팅은 `Grafana and Prometheus를 활용한 모니터링 시스템 구축` 시리즈의 마지막으로, 시각화 툴인 Grafana 를 설치하고 Prometheus에 수집된 데이터를 조회해 대시보드로 보여주는 내용을 다뤄보겠습니다.  

## Reference  

[공식 node-exporter 도커](https://hub.docker.com/r/prom/node-exporter)    
[Google - cAdvisor 깃허브](https://github.com/google/cadvisor)  
[Prometheus statsd exporter docker image](https://hub.docker.com/r/prom/statsd-exporter)  
[세상은 넓어요 - CPU, Memory 모니터링을 위한 node exporter 시작하기](https://velog.io/@suk13574/Promehteus-node-exporter-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)  