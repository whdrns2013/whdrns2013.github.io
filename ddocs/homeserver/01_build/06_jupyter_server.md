---
title: jupyter 서버 구축  # 제목 (필수)
excerpt: jupyter lab 서버 구축 # 서브 타이틀이자 meta description (필수)
date: 2024-09-19 00:30:00 +0900      # 작성일 (필수)
lastmod: 2024-09-19 00:30:00 +0900   # 최종 수정일 (필수)
permalink: /docs/homeserver/01_build/06_jupyter_server
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_homeserver"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

<!--postNo: 20240919_001-->



## Intro  

홈 서버를 구축하기로 마음을 먹었을 때, 꼭 올리고 싶던 서비스가 두 가지가 있었습니다. <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>jupyter lab 그리고 nginx 웹서버</span>가 바로 그것이었습니다.  

최근 수행하고 있는 업무가 빅데이터 분석 및 모델 개발이다 보니 이와 관련하여 어디서든 접근할 수 있는 나만의 jupyter lab을 구축하고 싶었고, 또한 회사의 정체성에 따라 웹개발을 공부하기 위해 nginx 웹서버를 구축하고 싶었습니다.  

이번 포스팅을 포함하여 다음 포스팅까지 연속 두 편을 통해 그 두 서비스를 도커로 구축해보겠습니다.  

## Docker  

jupyter lab 서버 (애플리케이션) 과 nginx 웹서버 모두 docker와 docker compose를 사용해 구축할 예정입니다. docker를 선택한 이유는 아래와 같습니다.  

<b><font color="008080">첫째. 구축하기 쉽다</font></b>  
docker를 이용하면 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>애플리케이션 구축이 용이</span>합니다. 도커 패키지를 설치하고, 도커 이미지를 끌어와서, 컨테이너를 실행시키기만 하면 되기 때문에 매우 간단하고 신경쓸 게 별로 없습니다. 쉽다는 게 바로 docker를 선택한 첫 번째 이유입니다.  

<b><font color="008080">둘째. 격리된 환경</font></b>  
docker 를 사용하면 호스트 머신과 격리된 환경의 컨테이너가 만들어지고, 그 위에서 애플리케이션이 실행됩니다. 환경을 격리시킬 수 있다는 것은 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>어느 한 쪽에 문제가 생기더라도 그게 다른 쪽에 영향을 끼치지 않는다</span>는 것을 뜻합니다. 홈 서버를 처음 구축해보는 입장에서 분명 많은 실수가 생길 게 분명합니다. 만약 호스트에 모든 애플리케이션을 설치한다면 문제가 생길 때마다 OS를 새로 설치해야 할 가능성이 높다고 판단되어 docker를 선택했습니다.  

<b><font color="008080">셋째. 스냅샷</font></b>  
현재 실행중인 컨테이너를 도커 이미지로 스냅샷 저장이 용이하다는 장점이 있습니다. 저장하고 싶은 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>환경 및 애플리케이션을 그 당시의 시점 그대로 이미지 하나에 저장</span>할 수 있는 것이죠. 때문에 중간 중간 중요한 지점마다 이미지로 저장을 해놓으면 구축 도중에 오류가 생기더라도 가장 최근 스냅샷으로 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>복원하는 것이 가능</span>합니다. 이렇게 되면 처음부터 다시 시작하지 않아도 되므로 시간을 아낄 수 있습니다.  


## Docker 및 Docker Compose에 대한 설명과 설치 방법  

Docker, Docker Compose에 대한 설명과 설치 방법에 대해서는 Doc에 정리된 내용을 참고하기 바랍니다.  

[whdrns2013 Docs - Docker](https://whdrns2013.github.io/docs/docker/intro/)   

## 계획  

### 목표와 요구 사항 정의  

| 구분    | 내용                               |
| ----- | -------------------------------- |
| 목표    | jupyter lab 서버 구축                |
| 요구사항1 | 쉽게 구축하고, 롤백이 용이할 것               |
| 요구사항2 | 비정상적인 머신 종료(정전 등)에 대비한 자동 재시작    |
| 요구사항3 | 백업이 쉽고, 다른 머신에서 동일한 환경 구축이 가능할 것 |

### 계획  

(1) 나만의 custom jupyter docker 이미지 만들기  
(2) docker compose로 명세 작성  
(3) 포트 포워딩  
(4) 테스트  

## (1) Jupyter Docker 이미지 만들기  

가장 먼저 custom jupyter docker 이미지를 만들겠습니다. 사실 docker hub에 가면 이미 편리하게 사용할 수 있도록 만들어진 jupyter notebook docker 이미지들이 많이 있습니다.  

![](/assets/images/20240919_001_001.jpeg)  

하지만 저는 기본적인 리눅스 docker 이미지를 베이스로 하여 직접 jupyter docker 이미지를 만들어보려고 하는데요, 그 첫 번째 이유는 이미지 내에서 conda를 통해 여러 가상환경을 구축할 수 있도록 파이썬을 설치하려 함이고, 두 번째 이유는 내가 사용하기 편한 방식으로 세팅하기 위해서입니다.  

### 베이스 리눅스 이미지 pull  

저는 베이스가 되는 리눅스 이미지로 Ubuntu:24.04 이미지를 이용하였습니다.  

```bash
sudo docker pull ubuntu:24.04
```

그리고 pull 한 ubuntu 이미지를 실행시켜줍니다.  

```bash
sudo docker run -dit --name jupyter-server ubuntu:24.04 /bin/bash
```

실행시킨 ubuntu 컨테이너에 접속한 뒤 필요한 패키지를 설치합니다.  

```bash
# 컨테이너에 접속
sudo docker exec -it jupyter-server /bin/bash

# 필요한 패키지 설치
apt update
apt install net-tools wget -y
```

### miniconda 설치  

miniconda 설치파일을 다운로드 합니다. 다운로드 위치는 본인의 입맛에 맞게 지정하면 됩니다.  

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
```

다운로드 받은 miniconda 설치파일로 설치를 진행합니다.  

```bash
chmod 755 ./Miniconda3-latest-Linux-x86_64.sh  # 권한 부여
./Miniconda3-latest-Linux-x86_64.sh            # 실행
```

bashrc에 miniconda3를 초기화할지에 대한 질문이 나오면 yes를 입력합니다. 만약 이 단계를 놓쳤다면, 컨테이너에 재접속한 뒤 `conda init` 명령어를 실행시켜주면 됩니다.    

```bash
Do you wish the installer to initialize Miniconda3
in your /root/.bashrc ? [yes|no]
[no] >>> yes
```

shell을 실행시킬 때 base 가상환경을 실행할 것인지에 대해 많이들 false(base를 실행하지 않음) 옵션으로 두지만, 저는 그렇게 하지 않았습니다. jupyter lab 자체를 base에서 설치하여 추후 jupyter에 대한 변경 사항은 모두 base에서 처리하게끔 할 것입니다.  

설치가 정상적으로 완료되었다면 컨테이너에 재접속합니다.  

### jupyter 설치  

위 단계대로 설치를 진행했다면 컨테이너에 재접속했을 때 사용자명 앞에 (base)가 붙어있는 것을 볼 수 있을 것입니다. conda 가 잘 설치되었다는 증거죠.  

이제 base 가상환경에서 jupyter 를 설치하고, jupyter 관련 환경설정을 해줄 것입니다.  

```bash
pip install jupyter
```

jupyter 설치가 완료되었다면, jupyter lab 환경설정을 진행합니다. 이전 포스트에서 이와 관련하여 자세하게 설명하였으니, 아래 설명과 이전 포스트를 함께 참고해주세요.  

```bash
# jupyter 설정 파일 생성
jupyter lab --generate-config

# jupyter 설정파일 경로 확인
jupyter --config-dir
>> /root/.jupyter

# jupyter 환경설정 파일 편집기로 열기
vi /root/.jupyter/jupyter_lab_config.py
```

자세한 설정 방법은 이전 포스트 참고 -  

[주피터 jupyter 외부에서 접속 가능하게 하기](https://whdrns2013.github.io/python/20240114_004_jupyter_inbound/)  

### jupyter 이미지 제작  

여기까지 완료가 되었다면, jupyter lab 서버를 운영하는 컨테이너 구축이 완료된 것입니다. 이제 이 컨테이너를 이미지로 만들어주면 됩니다.  

```bash
# 컨테이너 바깥으로 탈출
exit

# 컨테이너를 이미지로 commit  
sudo docker commit jupyter-server jupyter:1.0.0

# 컨테이너 이미지 확인
sudo docker images

>> REPOSITORY  TAG     IMAGE ID   ...  SIZE
>> jupyter     1.0.0   c9...      ...  1.13GB
>> ubuntu      24.04   ed...      ...  78.1MB
```


## (2) Docker Compose 작성  

앞선 단계에서 만든 docker 이미지를 실행하는 방법을 docker compose 형식으로 명세하고 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>docker compose</span> 를 통해 실행할 수 있도록 하겠습니다. docker compose 를 이용할 때 얻을 수 있는 장점은 다음과 같다고 생각합니다. <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>(1) 정전 등의 사유로 서버가 비정상 재부팅 된 후 jupyter 컨테이너가 자동으로 실행 (2) 실행 조건과 환경을 명세하여 다른 환경에서도 본 이미지를 쉽게 실행시킬 수 있음</span>  

### Docker Compose 작성  

jupyter 서버를 운영할 컨테이너를 실행시키는 데 대한 Docker Compose를 아래와 같이 작성하였습니다.  

```yml
version: "3"

services:
    jupyter:
        image: jupyter:1.0.0
        ports:
          - 18888:8888
        restart: always
        volumes:
          - host-volume:inner-volume
        command: jupyter lab --allow-root
```

하지만 jupyter라는 것을 찾을 수 없다는 아래와 같은 에러 메세지가 발생하였는데요,    

```bash
Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: exec: "jupyter":executable file not found in $PATH: unknown
```

이 에러 메세지는 jupyter라는 파일을 PATH에서 찾을 수 없다는 내용입니다. 따라서 docker-compose.yml 파일에 jupyterlab 실행파일이 있는 디렉토리가 PATH에 추가되도록 설정해주는 것으로 해결했습니다.  

```yml
version: "3"

services:
    jupyter:
        image: jupyter:1.0.0
        environment:
          PATH: /root/miniconda3/bin:${PATH}  # 이렇게 추가
        ports:
          - 18888:8888
        restart: always
        volumes:
          - host-volume:inner-volume
        command: jupyter lab --allow-root
```

### Docker Compose 로 jupyter 컨테이너 실행  

이제 jupyter 컨테이너를 실행하고 접속해볼 일만 남았습니다.  

```bash
docker compose up -d
# 이 명령어는 docker-compose.yml 파일이 있는 곳에서 실행합니다.
# d 옵션은 command가 백그라운드에서 실행되게끔 하는 옵션입니다.
```

## (3) 포트포워딩  

외부에서 jupyter lab 서버에 접근하기 위해서는 홈 네트워크의 가장 상단에 있는 통신사 공유기에서 포트포워딩 설정을 통해 매핑을 만들어야 합니다. 자세한 내용은 이전 포스트를 참고해주세요.  

![](/assets/images/20240919_001_003.png)  

[홈 서버 만들기 (4) 포트포워딩과 DMZ](https://whdrns2013.github.io/infra/20240916_001_setting_homeserver_04/)  

## (4) 테스트  

이제 jupyter lab에 접근해보도록 하겠습니다.  

![](/assets/images/20240919_001_002.jpeg)  

정상적으로 접근 되는 것을 확인할 수 있습니다.  

처음 접속하면 위의 이미지와는 살짝 다른 화면을 만날 텐데요, 제 경우 이미 token 인증을 통해 비밀번호를 설정해버려서 위와 같은 화면이 보입니다. 처음 접속했다면 token 인증 및 비밀번호 설정 페이지를 만나볼 수 있을 것입니다.  

([주피터 jupyter 외부에서 접속 가능하게 하기](https://whdrns2013.github.io/python/20240114_004_jupyter_inbound/))  

