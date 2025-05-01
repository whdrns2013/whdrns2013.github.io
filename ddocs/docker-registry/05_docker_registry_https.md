---
title: "4-2. 보안 강화 - https 적용"
excerpt: "SSL TLS 인증서로 https 적용하기"
last_modified_at: 2024-01-13 18:25:00 +0900
permalink: /docs/docker_registry/05_ssl_tls
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker_registry"
---



## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Docker Registry 보안 강화</span>  

지난 포스트에서는 Docker Registry의 보안 강화 방법 중 "사용자 인증 절차 구축" 방법을 살펴보았습니다. 이번에는 그 다음으로 HTTPS 통신을 구현하는 방법을 알아보겠습니다. HTTPS 통신은 데이터를 암호화하고 안전하게 전송하여 중간자 공격과 데이터의 무단 접근을 방지할 수 있는 방법 중 하나입니다.  

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>https 적용하기</span>  

### (1) 인증서 발급  

이전 포스트에서는 인증서를 발급받는 방법에 대해 상세히 다뤘습니다. 아래 링크를 참고해서 발급해주시기 바랍니다.  
ssl 인증서를 발급받은 폴더 안쪽에는 아래와 같이 인증서 및 키 관련 파일이 생성되어 있어야 합니다.  

> [ssl 인증서 발급받기](https://whdrns2013.github.io/etc/20240113_002_ssl_tls/)  

```bash
$ cd /host/some/path/ssl   # ssl 인증서를 저장할 폴더로 이동
$ ls -al
>>> server.crt
>>> server.csr
>>> server.key
>>> server.key.origin
```

이렇게 발급받은 ssl 인증서는 volume mount를 통해 registry 컨테이너에 공유할 것입니다.     


### (2) 컨테이너 이미지화 하기  

https 적용하기 전, 지금까지 작업한 registry 컨테이너를 이미지로 만들어주겠습니다. 이는 지금까지 만들어놓은 registry 컨테이너 안의 환경과 자료를 안전하게 보관한 상태에서 재기동하기 위함입니다. <b><font color="FF82B2">이 작업은 호스트 서버에서 진행해줘야 합니다.</font></b>  

```bash
$ docker ps
>>> CONTAINER ID   IMAGE    COMMAND     CREATED     ...
>>> a7659e5daa4f   registry:latest   "/entrypoint.sh /etc…"   15 hours ago ...

$ docker commit a7659e5daa4f docker-registry:0.0.1
# (a7659e5daa4f 컨테이너를 docker-registry 라는 이미지 0.0.1 버전으로 commit)
```

### (3) docker registry config yaml 파일 작성  

다음으로 Docker Registry의 설정값을 담은 config 파일을 호스트 서버에 작성합니다. 이 config 파일은 나중에 volume mount를 통해 호스트와 Docker Registry 컨테이너 적용할 것입니다.  

이렇게 해두면 registry 컨테이너에 들어가지 않더라도 호스트 서버에서 편리하게 registry 컨테이너의 설정을 변경하여 재구동 할 수 있습니다.  

```bash
$ cd /host/some/path   # 도커 컴포즈 파일 저장할 경로로 이동
$ vi ./config.yml
```

```yaml
# /host/some/path/config.yml
version: 0.1
log:
  fields:
    service: registry
storage:
  cache:
    blobdescriptor: inmemory
  filesystem:
    rootdirectory: /var/lib/registry
http:
  addr: :5000
  headers:
    X-Content-Type-Options: [nosniff]
  tls:
    certificate: /container/path/to/ssl/server.crt
    key: /container/path/to/ssl/server.key
health:
  storagedriver:
    enabled: true
    interval: 10s
    threshold: 3
auth: # htpasswd configure
  htpasswd:
    realm: basic-realm
    path: /container/path/to/htpasswd
```


### (4) docker compose 파일 작성  

Registry 컨테이너의 구동 옵션을 편리하게 기록하고, 간편하게 컨테이너를 시작하거나 중지하기 위해 Docker Compose를 활용할 것입니다. 먼저, Docker Compose에 사용할 환경변수 파일을 작성합니다.  

```bash
$ cd /host/some/path   # 도커 컴포즈 파일 저장할 경로로 이동
$ vi .env
```

환경변수 파일에는 SSL 인증서 파일 경로, htpasswd 파일 경로, Registry 설정 파일 경로 등을 기록합니다. 이 때에는 <b><font color="FF82B2">"컨테이너 환경 안쪽"의 경로를 적어줘야</font></b> 한다는 점을 주의해주세요.  

```bash
HOST_PATH=./
SSL_PATH=/container/path/to/ssl                  # ssl인증서 경로
REGISTRY_CONF_PATH=/etc/docker/registry/conf.yml # registry config 파일 경로
```

다음으로 docker compose yaml 파일을 작성해줍니다.  

```bash
$ vi docker-compose.yml
```

여러 가지 설정 항목이 있지만, 여기서는 환경변수 설정 부분과 volumes(볼륨 마운트) 부분을 유의깊게 봐주세요.  

```yaml
version: '3'

services:
    docker-registry:
        image: docker-registry:0.0.1 # 사용할 도커 이미지 명시
        container_name: docker-registry # 컨테이너 명 설정하기
        restart: always # 비정상 종료시 자동 재시작
        volumes: # volume mount
            - ${HOST_PATH}/ssl:${SSL_PATH}
            - ${HOST_PATH}/config.yml:${REGISTRY_CONF_PATH}
        environment: # 환경변수 설정
            - REGISTRY_HTTP_ADDR=0.0.0.0:5000
            - REGISTRY_HTTP_TLS_CERTIFICATE=${SSL_PATH}/server.crt
            - REGISTRY_HTTP_TLS_KEY=${SSL_PATH}/server.key
        ports: # 포트포워딩
            - "5000:5000"
```

### (5) 인증서 갱신 및 docker 재기동  

호스트 서버에서 진행해주세요.  

```bash
$ update-ca-trust

$ systemctl restart docker
$ systemctl restart containerd
```

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>테스트</span>  

https가 잘 적용되었는지 확인해보겠습니다. 우선 기존과 같이 http로 접속해보면 "HTTPS 서버에 HTTP 요청을 보냈다" 라는 경고 문구가 발생합니다. 잘 적용이 되었네요!  

![](/assets/images/20240113_003_001.png)

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Reference</span>  
tls 인증서 설명 : https://babbab2.tistory.com/5  
openssl 을 이용한 ssl 인증서 발급 : https://m.blog.naver.com/espeniel/221845133507  
docker compose - env 연동 사용 방법 : https://kb.mantech.co.kr/docs/docker-docker-compose-%ED%99%98%EA%B2%BD%EB%B3%80%EC%88%98-%EC%84%A4%EC%A0%95/  
docker registry https 적용하기 : https://wiki.tistory.com/entry/Private-Docker-Register  


