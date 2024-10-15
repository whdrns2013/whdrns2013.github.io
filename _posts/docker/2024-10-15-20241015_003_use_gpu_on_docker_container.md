---
title: Docker 에서 GPU 사용하기 (feat CUDA) # 제목 (필수)
excerpt: 컨테이너에서 GPU를 사용해보자 # 서브 타이틀이자 meta description (필수)
date: 2024-10-15 17:30:00 +0900      # 작성일 (필수)
lastmod: 2024-10-15 17:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-10-15 17:30:00 +0900   # 최종 수정일 (필수)
categories: docker         # 다수 카테고리에 포함 가능 (필수)
tags:  docker dockercompose compose 도커 컴포즈 도커 컴포즈 gpu CUDA                   # 태그 복수개 가능 (필수)
classes:  wide       # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20241015_003-->


## 호스트에 Docker 설치  

```bash
## Ubuntu의 경우
sudo apt update                # 시스템 패키지 업데이트
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - # gpg 키 추가
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" # 저장소 추가. 아키텍처가 arm64일 경우 [arch=arm64]로 변경
sudo apt update                # 시스템 패키지 업데이트

## CentOS의 경우
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum-config-manager --enable docker-ce-nightly
sudo yum install docker-ce
sudo yum install docker-ce-cli
sudo yum install containerd.io

## Rocky Linux의 경우
dnf install dnf-utils         # 유틸 패키지 설치
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo                # 패키지 저장소 추가
dnf install docker-ce         # 도커 설치
```

## (선택) Docker Compose 설치  

바이너리를 직접 다운로드 받는 방법과, 패키지 관리 툴을 통한 설치 방법이 있습니다.  
### 1번 방법. 바이너리를 직접 다운로드  

```bash
# 바이너리 다운로드
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 설치 확인 (버전 확인)
docker-compose --version    # 설치 확인
>> Docker Compose version v2.29.7
```

### 2번 방법. 패키지 관리 툴을 통한 설치  

```bash
# Ubuntu
sudo apt update
sudo apt install docker-compose

# 설치 확인 (버전 확인)
docker-compose --version    # 설치 확인
>> Docker Compose version v2.29.7
```


## 호스트에 Nvidia 드라이버 및 Toolkit 설치  

### (1) 호스트에 Nvidia 드라이버 설치  

#### 1번 방법. 패키지 관리 툴을 통한 설치  

```bash
# PPA(Personal Package Archive) 추가
sudo apt update
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update

# 설치 가능한 Nvidia 드라이버 확인
ubuntu-drivers devices
```

```bash
# 자동으로 권장 버전을 설치할 경우
sudo ubuntu-drivers autoinstall

# 수동으로 특정 버전을 설치할 경우
sudo apt install nvidia-driver-535
```

```bash
# 재부팅
sudo reboot
```

#### 2번 방법. Nvidia 홈페이지에서 드라이버를 다운로드받아 설치  

개발에 필요한 CUDA 버전, torch 버전등을 확인하고, 최종적으로 현재 그래픽카드에서 설치할 수 있는 최적의 nvidia 드라이버 버전을 확인하여 다운로드 합니다.  

[CUDA-드라이버 버전 호환성 확인](https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html)  
[torch - cuda 버전 호환성 확인](https://pytorch.org/get-started/previous-versions/)  
[nvidia 드라이버 다운로드](https://www.nvidia.co.kr/Download/Find.aspx?lang=kr)  

```bash
# 드라이버 다운로드
wget https://www.nvidia.com/ko-kr/drivers/details/<드라이버번호>

# 설치파일에 실행 권한 부여
chmod 111 ./NVIDIA-Linux-<아키텍처>-<버전>.run

# 실행
./NVIDIA-Linux-<아키텍처>-<버전>.run
```


### (2) Nidia 드라이버 설치 완료 확인  

```bash
# 드라이버 상태 출력
nvidia-smi
```

![[Pasted image 20240114133521.png]]  

### (3) 호스트에 Nvidia-CUDA-Toolkit 설치  

**nvidia-cuda-toolkit**은 **CUDA**(Compute Unified Device Architecture) 개발 환경을 제공하여, GPU에서 **병렬 계산**을 수행할 수 있는 도구입니다.

```bash
# Nvidia 툴킷 설치
apt install nvidia-cuda-toolkit
```


### (4) 호스트에 nvidia-docker2 설치  

**nvidia-docker2**는 **Docker** 컨테이너에서 **GPU**를 사용할 수 있도록 해주는 패키지입니다.

```bash
# Nvidia Docker 리포지토리 추가
distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
&& curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
&& curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

# nvidia-docker2 설치
sudo apt-get update
sudo apt-get install -y nvidia-docker2
```

### (5) docker daemon 설정 파일에 runtime 추가  

```bash
nano /etc/docker/daemon.json
```

```json
{ "runtimes": 
     "nvidia": {
         "path": "nvidia-container-runtime",
         "runtimeArgs": []
         }
}
```


### (6) docker 서비스 재시작  

```bash
sudo systemctl restart doker
```

## 도커 이미지 준비  

사용할 도커 이미지를 준비합니다. 기본적으로 nvidia에서 제공하는 CUDA 도커 이미지를 사용하기를 권장합니다.  

[Nvidia/Cuda docker registry](https://hub.docker.com/r/nvidia/cuda)  


## 도커 컨테이너 실행  

### 1번 방법. docker run 으로 실행할 경우  

```bash
# 모든 GPU를 사용할 경우
docker run --gpus all -dit <이미지:태그> bash
```

```bash
# 특정 GPU만 사용할 경우
docker run --gpus '"device=0"' -dit <이미지:태그> bash
```


### 2번 방법. docker compose up 으로 실행할 경우  


```yaml
version: '3.8'
services:
  <서비스명>:
    image: <이미지명:태그>
    runtime: nvidia  # 컨테이너가 NVIDIA GPU를 사용할 수 있게 설정
    environment:
      - NVIDIA_VISIBLE_DEVICES=all  # 모든 GPU를 사용
      - NVIDIA_DRIVER_CAPABILITIES=compute,utility  # 컨테이너가 GPU에서 사용할 수 있는 기능 지정
    command: bash
```