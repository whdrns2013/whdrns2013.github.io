---
title: Docker Registry 살펴보기 및 Configuration # 제목 (필수)
excerpt: Docker Registry Config # 서브 타이틀이자 meta description (필수)
date: 2024-01-08 01:30:00 +0900      # 작성일 (필수)
lastmod: 2024-01-08 01:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-01-08 01:30:00 +0900   # 최종 수정일 (필수)
categories: docker         # 다수 카테고리에 포함 가능 (필수)
tags: docker registry config 도커 레지스트리 저장소 설정                     # 태그 복수개 가능 (필수)
classes:        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20240108_001-->

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Intro</span>

이전 포스트에서 개인화 도커 이미지 저장소 Docker Registry를 구축했습니다.  

그리고 이 저장소를 고도화하기 위해 보안과 백업 부분에 대해 살펴보려 하는데요,  
**그 전에** <u>Docker Registry가 어떠한 특징을 가지고 있고, 어떤 설정 옵션들을 가지고 있는지</u> 살펴보도록 하겠습니다.  

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Docker Registry 환경 파악하기</span>

### 운영체제 : Alpine Linux  

구축한 Docker Registry 컨테이너에 대해 자세히 살펴보겠습니다. Docker Registry는 기본적으로 Alpine Linux 기반의 경량한 이미지를 사용하며, sh 셸을 활용합니다.  

```terminal
$ docker exec -it <registry 컨테이너 이름> sh
```

가장 먼저 컨테이너 내 운영체제를 살펴보겠습니다.  

```terminal
$ vi /etc/issue
>>> Welcome to Alpine Linux 3.18
>>> Kernel \r on an \m (\l)
```

구축한 docker registry는 Alpine Linux 3.18을 사용하고 있습니다.  

Alpine Linux는 경량화된 설치와 최소한의 서비스만 실행되도록 설계되어, 이미지의 크기가 작고 빠른 부팅과 운영이 가능합니다.  

이러한 특성으로 컨테이너 및 클라우드 환경에서 널리 사용되고 있고, 특히 docker와의 호환성이 높다는 특징이 있습니다.  

### 패키지 매니저 : apk  

Alpine Linux는 패키지 매니저로 'apk'를 사용합니다.  

```terminal
# 알파인 리눅스는 apk 패키지 매니저를 사용합니다.

$ apk update
>>> 사용 가능한 패키지 목록 업데이트

$ apk add nano
>>> apk add : 패키지 설치
```

### Docker Registry 설정 파일

Docker Registry의 설정 파일은 일반적으로 `/etc/docker/registry/config.yml`에 위치합니다. 해당 파일을 살펴보겠습니다.  

```
$ vi /etc/docker/registry/config.yml
```

```yaml
version: 0.1         # config.yml 파일의 버전
log:                 # 로깅 관련 설정
  fields:
    service: registry
storage:             # 도커 이미지 저장 관련 설정
  cache:
    blobdescriptor: inmemory
  filesystem:        # 도커 이미지 저장 경로 (registry 컨테이너 안쪽)
    rootdirectory: /var/lib/registry
http:                # 연결 관련 설정
  addr: :5000        # 포트 정보
  headers:           # 응답 헤더 구성
    X-Content-Type-Options: [nosniff]  # MIME 스니핑 방지
health:              # registry 서비스 상태 모니터링
  storagedriver:     # 드라이버 상태 모니터링
    enabled: true    # 모니터링 활성화
    interval: 10s    # 모니터링 간격 10초
    threshold: 3     # 3회 이상 실패시 서비스 재시작
auth:                # authentication 사용자 인증
  htpasswd:          # htpasswd 방식을 이용한 인증
    realm: basic-realm
    path: /path/to/htpasswd
```

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Reference</span>  

알파인 리눅스 위키백과 : https://ko.wikipedia.org/wiki/%EC%95%8C%ED%8C%8C%EC%9D%B8_%EB%A6%AC%EB%88%85%EC%8A%A4  
컨테이너 환경에서 알파인리눅스를 사용하는 이유 : https://velog.io/@dry8r3ad/why-alpine-linux  
알파인 리눅스 : https://www.lesstif.com/docker/alpine-linux-35356819.html  
docker registry config : https://gdevillele.github.io/registry/configuration/  
docker registry config : https://ly.lv/106  
docker registry config : https://arisu1000.tistory.com/27799  

