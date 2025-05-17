---
title: Grafana 설치하고 사용하기 # 제목 (필수)
excerpt: 수집한 메트릭을 시각화하기  # 서브 타이틀이자 meta description (필수)
date: 2025-04-30 12:55:00 +0900      # 작성일 (필수)
lastmod: 2025-04-30 12:55:00 +0900   # 최종 수정일 (필수)
permalink: /docs/grafana_and_prometheus/04_grafana/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_grafana_and_prometheus"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---
<!--postNo: 20250430_001-->


## 설치 환경  

- OS : RockyOS 9.3  

## 설치 방법  

### 설치 방법  

권장하는 설치 방법은 두 가지가 있습니다.  
(1) 설치 파일을 다운로드 받아 직접 설치  
(2) docker image 를 통한 설치  

이번 설치에서는 docker 를 이용하겠습니다.  

[Grafana 공식 docker](https://hub.docker.com/r/grafana/grafana)  
[Grafana 공식 DOC - docker 를 통한 설치](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/)  

### Docker Image Pull  

가장 최근 이미지인 11.6.0 버전 그라파나 도커 이미지를 pull 하겠습니다.  

```bash
sudo docker pull grafana/grafana:11.6.0
```
### Docker Compose  

그라파나 서비스에 대한 명시를 명확히 하고, 재사용성을 높이기 위해 docker compose 로 서비스를 실행시키겠습니다.  
그러기 위해 먼저 docker-compose.yml 파일을 작성해보겠습니다.   

```yaml
services:
	grafana:
		image: grafana/grafana:11.6.0
		ports:
		  - 3000:3000 # grafana 기본 서비스 포트
		restart: always
		user: '0'     # /var/lub/grafana permission 획득
		volumes:
		  - /path/to/grafana/data:/var/lib/grafana
```

도커 컴포즈 파일을 여기까지 작성했다면, 실행시켜주도록 하겠습니다.  

```bash
sudo docker compose up -d
```


## Grafana 둘러보기  

### Grafana 서비스 접근  

앞선 설정대로 서비스를 실행시켰다면, 웹 브라우저를 통해 `<host>:3000` 에 접근이 가능합니다.  

![](/assets/images/20250430_001_001.png)  

초기 로그인 계정인 `admin / admin` 으로 로그인하면, 바로 새로운 패스워드를 설정하라고 나옵니다.  
보안을 위해 꼭 패스워드를 설정합니다.  

![](/assets/images/20250430_001_002.png)  

로그인을 하면 위와 같은 화면을 볼 수 있습니다.  

### 데이터 소스 설정  

이제 그라파나에서 시각화를 할 데이터 소스, 즉 이전 포스트에서 구축한 프로메테우스를 그라파나와 연결해보도록 하겠습니다.  

![](/assets/images/20250430_001_003.png)  

그라파나의 메뉴 중 `Connections > Data sources` 메뉴에서 연결 설정이 가능합니다.  

![](/assets/images/20250430_001_004.png)  

Data sources 메뉴에 들어가면 아무런 데이터 소스도 보이지 않을 것입니다.  
이제 첫 데이터 소스를 만들어보자. 화면의 `Add data source` 를 클릭합니다.  

![](/assets/images/20250430_001_005.png)  

그라파나와 연결 가능한 데이터 소스 목록이 리스팅됩니다.  
여기서 프로메테우스를 연결할 것이므로, 프로메테우스를 선택합니다.  

![](/assets/images/20250430_001_006.png)  

설정 화면으로 연결될텐데, 적절한 커넥션 이름을 지어주고, Connection 부분에 프로메테우스의 URL 을 입력해줍니다.  

![](/assets/images/20250430_001_007.png)  

설정이 완료됐다면 아래의 `Save & test` 버튼을 클릭해줍니다.  
위와 같이 Successfully 메세지가 뜬다면 정상적으로 연결된 것입니다.  

## 대시보드 만들기  

### 대시보드  

앞서 연결한 데이터소스에서 필요한 데이터를 조회해오고, 이를 시각적으로 한 눈에 보여주는 역할을 하는 게 대시보드입니다. 그라파나의 핵심 기능이라고 힐 수 있죠. 대시보드를 만들어 보겠습니다.  

### 대시보드 만들기  

`Dashboards` 메뉴에서 대시보드를 만들 수 있습니다.  
이름에 복수형 s가 붙은 것에서 알 수 있듯, 여러 개의 대시보드를 만들 수가 있습니다.  

![](/assets/images/20250430_001_008.png)  

메뉴에 진입하면 텅 비어있는 대시보드 메뉴를 볼 수 있습니다.  
여기에 새로운 대시보드를 만들기 위해 Create dashboard 버튼을 클릭합니다.  

![](/assets/images/20250430_001_009.png)  

새로운 대시보드입니다. 이제 대시보드에 보여줄 그래프나 기타 시각화된 컨텐츠들을 구성해겠습니다.  

Add visualization 을 클릭하면 대시보드의 구성요소를 추가할 수 있습니다.  

![](/assets/images/20250430_001_010.png)  

데이터소스를 선택하는 화면이 나올텐데, 이전 포스트에서 만든 프로메테우스를 선택해보겠습니다.  

![](/assets/images/20250430_001_011.png)  

이번에는 node-exporter 에서 가져오는 CPU 관련 정보를 토대로 CPU 사용율 시각화를 만들어볼 것입니다.

![](/assets/images/20250430_001_012.png)  

먼저, 화면 구성을 살펴보겠습니다.  

| 번호  | 구성        | 설명                                                                |
| --- | --------- | ----------------------------------------------------------------- |
| 1   | 시각화 패널 정보 | 이 시각화 패널의 제목, 설명 등 패널에 대한 정보를 설정하는 영역                             |
| 2   | 쿼리명       | 이 시각화 패널을 구성항 쿼리의 제목을 입력하는 곳.<br>하나의 시각화 패널에는 여러 개의 쿼리가 들어갈 수 있다. |
| 3   | 쿼리        | 시각화 대상 데이터를 불러올 쿼리                                                |
| 4   | 쿼리 실행     | 쿼리를 실행해볼 수 있는 버튼                                                  |
| 5   | 쿼리 유형     | 항목에서 쿼리를 선택하는 식으로 쿼리를 완성시킬지,<br>혹은 코드 형식으로 직접 쿼리를 짜 넣을지           |
| 6   | 쿼리 추가     | 쿼리를 추가하는 버튼                                                       |
| 7   | 시각화 예시    | 쿼리 실행 버튼의 결과물을 볼 수 있는 영역                                          |

쿼리의 유형을 code 로 바꾸고, 아래 쿼리를 입력해보겠습니다.   

```bash
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)
```

패널에 대한 모든 설정이 끝났다면, `Back to dashboard` 버튼을 클릭해서, 대시보드 화면으로 돌아가보겠습니다.  

![](/assets/images/20250430_001_013.png)  

### 대시보드 확인하기  

위 단락에서 설정한 CPU 사용율과 더불어 몇 가지를 더 추가한 대시보드입니다.  
구성이 완료됐다면  우측 상단에 Save dashboard 를 클릭해줍니다.  

![](/assets/images/20250430_001_014.png)  

대시보드의 이름과, 설명을 적고 저장해줍니다.  

![](/assets/images/20250430_001_015.png)  

## 마치며  

이번 `Grafana and Prometheus를 활용한 모니터링 시스템 구축` 시리즈에서는 프로메테우스와 그라파나에 대한 개념을 알아보고 설치를 해봤습니다. 그리고 애플리케이션과 시스템의 메트릭 데이터를 수집하고, 그라파나를 통해 시각화하는 것까지 해봤습니다.  

프로메테우스와 그라파나는 프로덕션 환경에서 서비스에 대한 모니터링과 알람 기능으로 많이 사용됩니다. 특히나 쿠버네티스와 같은 동적인 CI/CD 환경에서는 더욱 그 빛을 발한다고 합니다.  

## Reference  

[Grafana 공식 docker](https://hub.docker.com/r/grafana/grafana)  
[Grafana 공식 DOC - docker 를 통한 설치](https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/)  