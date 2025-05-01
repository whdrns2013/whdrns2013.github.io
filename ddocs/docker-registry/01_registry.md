---
title: "1. docker registry"
excerpt: "도커 저장소 역할을 하는 도커, registry"
last_modified_at: 2024-01-13 16:25:00 +0900
permalink: /docs/docker_registry/01_registry
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker"
---

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>1. Intro</span>

도커를 사용하면 도커허브(Docker Hub)에서 다양한 이미지를 손쉽게 받아올 수 있습니다. `docker pull` 명령어를 이용하면 원하는 도커 이미지를 쉽게 다운로드할 수 있죠.  

그러나 때로는 외부에 유출되면 안 되는 도커 이미지를 안전하게 보관하고 싶을 때가 있습니다. 이미지를 tar 파일로 저장하는 방법도 있지만, 이는 번거로울 뿐더러 필요한 곳으로 이미지를 이동할 때 불편함이 있습니다.

개인용 도커허브를 구축할 수 있다면 어떨까요? 도커 이미지를 한 군데에 저장하고, 편리하게 버전 관리가 가능하고, 내가 허용한 사용자만 접근할 수 있는 도커 이미지 저장소가 있다면 편리하겠죠.  

이 글에서 개인용 도커 저장소를 어떻게 구성하고 활용할 수 있는지 알아보겠습니다.  

![](/assets/images/20240104_001_001.png)  
<center><i>그림 : docker hub 화면</i></center>

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>2. docker registry</span>

Docker Registry는 Docker 이미지를 저장하고 관리하는 저장소 시스템입니다.  
또한 편하고 쉽게 Docker 이미지를 공유하고 배포하기 위한 서버 역할도 수행합니다.  
도커허브 또한 Docker Registry죠.  

Docker Registry의 특징은 아래와 같습니다.  

<b><font color="FF82B2">이미지 저장소:</font></b>  
Docker Registry는 Docker 이미지를 저장하는 저장소입니다. 이미지는 여러 레이어로 구성되며, 각 레이어는 이전 레이어의 변경 사항을 기반으로 구성됩니다.  

<b><font color="FF82B2">접근 권한 관리:</font></b>  
Docker 이미지에 대한 접근 권한을 관리할 수 있습니다. 비공개 레지스트리를 설정하여 인증된 사용자만이 이미지에 접근하고 푸시할 수 있도록 할 수 있습니다.  

<b><font color="FF82B2">이미지 버전 관리:</font></b>  
이미지를 버전 별로 저장하고 관리할 수 있습니다. 이미지 버전은 태그로 구분합니다.  

<b><font color="FF82B2">보안 및 HTTPS:</font></b>  
Docker Registry는 HTTPS를 통한 보안 통신을 지원하며, SSL/TLS 인증서를 사용하여 통신을 암호화할 수 있습니다.  

<b><font color="FF82B2">백업 및 복원:</font></b>  
Docker Registry의 데이터를 백업하고 복원하여 이미지와 메타데이터를 안전하게 보호할 수 있습니다.  

![](/assets/images/20240104_001_002.png)

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>3. docker image 저장소 만들기</span>

### 3-1. 환경 준비 : docker 설치

먼저, 개인용 docker 조정소를 만들 호스트 서버에 docker 를 설치합니다.  

```bash
# ubuntu
sudo apt update
sudo apt install docker-ce
sudo apt install docker-ce-cli
sudo apt install containerd.io

# CentOS
sudo yum install yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce
sudo yum install docker-ce-cli
sudo yum install containerd.io
```

설치 후에는 docker service를 실행해주세요. 서버가 시작될 때 자동으로 docker 서비스도 시작되도록 enable 하는 것도 추천합니다.  

```bash
## 도커 실행
sudo systemctl start docker.service
sudo systemctl start docker.socket

## 부팅시 도커 자동 실행
sudo systemctl enable docker.service
sudo systemctl enable docker.socket
```

### 3-2. Docker 이미지 저장소 만들기

앞서 설명한 docker registry 이미지를 통해 저장소 컨테이너를 만들 것입니다.  
우선은 dockerhub에서 제공하는 docker registry 이미지를 pull 합니다.  

```bash
docker pull registry:latest

docker images
>>> REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
>>> registry     latest    909c3ff012b7   4 weeks ago   25.4MB
```

pull 한 registry 이미지를 이용해 저장소로 활용할 컨테이너를 구동합니다.  
이 때 포트 포워딩을 설정하여 호스트와 컨테이너 내부 간 통신 포트를 하나 추가합니다.  
이번 예시에서는 5000 번 포트를 이용하겠습니다.  

```bash
docker run -dit -p 5000:5000 --restart=always --name docker_repository registry:latest
```

참고로 registry:latest 도커 이미지의 경우 OS가 Alpine Linux 3.18 입니다. (2024-01-04 기준)  

```bash
docker exec -it docker_repository sh

cat /etc/issue
>> Welcome to Alpine Linux 3.18
>> Kernel \r on an \m (\l)
```

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>4. 이용하기</span>

이제 다른 서버 혹은 다른 사용자가 위에서 만든 저장소를 이용하는 방법을 알아보겠습니다.  

### 4-1. 사전 준비 : 신뢰할 수 있는 registry 등록  

먼저, 신뢰할 수 있는 registry로 등록합니다. docker daemon 파일에서 등록이 가능합니다.  
https가 아닌 http 통신도 가능케 하기 위함입니다.  

```bash
# docker daemon 파일 작성
vi /etc/docker/daemon.json

# 아래 내용을 추가하고 편집 종료
{
    "insecure-registries":["ip주소:포트번호"]
}

# docker service restart
systemctl restart docker.service
systemctl restart docker.socket
```

### 4-2. 이용하기 : docker push

docker registry 에는 아직 아무런 이미지도 등록되어있지 않습니다. 실습을 위해 ubuntu 도커 이미지를 pull 해보겠습니다.  

```bash
docker pull ubuntu:20.04

=== 결과 ===
docker images
>> REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
>> ubuntu       20.04     f78909c2b360   3 weeks ago   72.8MB
>> registry     latest    909c3ff012b7   4 weeks ago   25.4MB
```

이렇게 받은 도커 이미지를 개인용 docker registry 에 push 해보도록 하겠습니다.  
먼저, push할 docker image에 registry 서버를 명시한 태그를 붙여야 합니다.  

```bash
docker tag ubuntu:20.04 서버ip:5000/mydocker:0.1

=== 결과 ===
$docker images
>> REPOSITORY                  TAG       IMAGE ID       CREATED       SIZE
>> ubuntu                      20.04     f78909c2b360   3 weeks ago   72.8MB
>> 서버ip:5000/mydocker         0.1      f78909c2b360   3 weeks ago   72.8MB
>> registry                    latest    909c3ff012b7   4 weeks ago   25.4MB
```

이제 docker push 명령어를 통해 이미지를 push할 수 있습니다.  

```bash
docker push 서버ip:5000/mydocker:0.1
```

### 4-3. push 한 docker image 확인

제대로 push가 되었는지 docker registry에 등록된 이미지를 확인해보겠습니다.  
명령어는 아래와 같습니다.

```bash
# docker image 목록(리포지토리) 확인
curl http://서버ip:5000/v2/_catalog

# 특정 리포지토리(ubntu 등)의 버전 목록 확인
curl http://서버ip:5000/v2/<리포지토리이름>/tags/list
```

예시에 적용해보면 아래와 같이 출력될 것입니다.  

```bash
# docker image 목록 확인
curl http://서버ip:5000/v2/_catalog
>>> {"repositories":["mydocker"]}

# 특정 리포지토리(ubntu 등)의 이미지 목록 확인
curl http://서버ip:5000/v2/mydocker/tags/list
>>> {"name":"mydocker","tags":["0.1"]}
```

registry 서버에 mydocker:0.1 이미지가 업로드되어있는 것을 확인할 수 있습니다.  

### 4-4. docker image pull  

이제 또 다른 서버에서 개인 docker registry에 등록된 이미지를 pull 해보겠습니다.  
이제 막 docker를 설치한 따끈따끈한 서버입니다.  

```bash
docker images
>>> REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
```

pull을 한 번 해보겠습니다.  

```bash
docker pull 서버ip:5000/mydocker:0.1

docker images
>>> REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
>>> ip주소:5000/my_docker  0.0.1 f78909c2b360 3 weeks ago 72.8MB
```

성공적으로 이미지를 받아온 것을 볼 수 있습니다.

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>5. Outro</span>

지금까지 개인용 도커 이미지 저장소를 만드는 방법을 알아보았습니다.  
다음엔 이어서 도커 이미지 저장소(Docker Registry)에 어떻게 이미지가 저장되는지, 그리고 데이터 보관 안정성과 보안성을 높이는 방법에 대해 살펴보겠습니다.  

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>6. Reference</span>  

https://sharplee7.tistory.com/m/82  
https://www.leafcats.com/190  
https://www.joinc.co.kr/w/man/12/docker/privateRepository  
chat-gpt  