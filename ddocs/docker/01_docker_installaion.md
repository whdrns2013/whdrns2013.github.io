---
title: "1. 도커 설치하기" # 제목 (필수)
excerpt: 알면 편해진다. 도커를 써보자. # 서브 타이틀이자 meta description (필수)
permalink: /docs/docker_installation/
date: 2023-09-12 23:50:00 +0900      # 작성일 (필수)
lastmod: 2024-01-07 15:50:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-01-07 15:50:00 +0900   # 최종 수정일 (필수)
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  # nav: "docs"
  nav: "doc_docker"
classes: wide
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---


## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 1️. 실습 환경 설명</span>

- 리눅스 Ubuntu 18.04.6

<br>

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 2️. 도커 설치  </span>

### 설치

두 가지 방법을 소개합니다. 둘 중 하나만 하면 됩니다!  

**(1) 패키지 도구 이용**

```terminal
## Ubuntu의 경우
$ apt-get update                # 패키지 업데이트가 있는지 확인
$ apt-get install docker-ce     # 도커 엔진 설치
$ apt-get install docker-cli    # 도커 클라이언트 설치
$ apt-get install containerd.io # 컨테이너 런타임 설치

## CentOS의 경우
$ yum update
$ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
$ yum-config-manager --enable docker-ce-nightly
$ sudo yum install docker-ce
$ sudo yum install docker-ce-cli
$ sudo yum install containerd.io
```

**(2) curl 방법**

```terminal
$ curl -s https://get.docker.com | sudo sh

# 정상적으로 설치되면 아래와 같은 출력을 볼 수 있습니다.
>>> # Executing docker install ...
>>> + sh -c apt-get update -qq >/dev/null
>>> ...
>>> Server: Docker Engine - Community
>>>  Engine:
>>>   Version:          24.0.2
>>>   API version:      1.43 (minimum version 1.12)
>>> ...
```

### 도커 서비스 실행

도커를 설치했다면 서비스를 시작해줍니다.  

```terminal
## 도커 실행
$ sudo systemctl start docker.service
$ sudo systemctl start docker.socket

## 부팅시 도커 자동 실행
$ sudo systemctl enable docker.service
$ sudo systemctl enable docker.socket
```

enable을 하면, 재부팅시 도커 서비스가 자동으로 시작됩니다.  

### 설치 확인

설치가 잘 되었는지 확인해봅시다.  
아래와 같이 출력된다면, 정상적으로 설치된 것입니다.  

```terminal
$ docker -v
>>> Docker version 24.0.2, build cb74dfc

$ docker
>>> Usage:  docker [OPTIONS] COMMAND
>>> 
>>> A self-sufficient runtime for containers
>>> 
>>> Common Commands:
>>>   run         Create and run a new container from an image
>>>   exec        Execute a command in a running container
>>>   ps          List containers
>>>   build       Build an image from a Dockerfile
>>>   pull        Download an image from a registry
>>>   push        Upload an image to a registry

$ docker ps
>>> CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

<br>

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 3️. 그 외 참고  </span>

### 도커 패키지 설치 경로

별도 설정하지 않는다면 도커 패키지는 보통 아래 경로에 설치됩니다.  

```terminal
$ which docer
>>> /usr/bin/docker
```

### 도커 에디션

- docker-ce : 커뮤니티 에디션. 무료.  
- docker-ee : 엔터프라이즈 에디션. 유료.  

<br>

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 4️. Reference  </span>

도커 설치(공식) : https://docs.docker.com/engine/install/ubuntu/  
도커 설치 : https://www.44bits.io/ko/post/easy-deploy-with-docker  
서비스 활성화와 등록 : https://www.kernelpanic.kr/20  
containerd에 대한 설명 : [kr.linkedin.com](https://kr.linkedin.com/pulse/containerd는-무엇이고-왜-중요할까-sean-lee)  