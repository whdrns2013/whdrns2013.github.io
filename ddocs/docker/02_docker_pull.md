---
title: 도커 이미지 다운받기 docker pull # 제목 (필수)
excerpt: 만들어져있는 다양한 도커 이미지를 사용해보자 # 서브 타이틀이자 meta description (필수)
date: 2023-09-12 23:50:00 +0900      # 작성일 (필수)
lastmod: 2023-09-12 23:50:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker/pull/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 1️. 도커 이미지 pull  </span>

내가 원하는 운영 환경을 만들기 위해서는, 우선 하드웨어를 제어해 줄 운영체제가 있어야 합니다.

도커 또한 마찬가지입니다.  
격리된 환경에서 동작할 운영체제가 있어야 환경 구축이 가능하겠죠.  

원하는 운영체제가 포함된 도커 이미지를 다운받아줍니다.  

pull 이라는 명령어로요!  
docker pull 명령어를 통해 도커 이미지를 받아올 수 있습니다.  

```bash
docker pull 이미지명:태그

# 예시 : CentOS
docker pull centos         # Cent OS :latest 도커 (최신버전)
docker pull centos:7       # Cent OS 7 도커 

# 예시 : 우분투
docker pull ubuntu         # Ubuntu:latest 도커 (최신버전)
docker pull ubuntu:18.04   # Ubuntu:18.04 도커
```

도커 pull이 성공적으로 진행되면 아래와 같이  
pull 받는 도커의 정보 및 complete 구문을 볼 수 있습니다.  

```bash
docker pull ubuntu:18.04
>>> 18.04: Pulling from library/ubuntu
>>> ...
>>> ... Pull complete
```

이미지를 성공적으로 설치한 게 맞는지 확인하려면  
docker images 를 통해 run 할 수 있는 docker 리스트를 뽑아보면 됩니다.  

```bash
docker images
>>> REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
>>> ubuntu       18.04     f9a80a55f492   2 months ago   63.2MB
```

<br>

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 2️. 도커 이미지란?  </span>

이해를 돕기 위해 정확하지는 않지만, 쉽게 설명을 해보겠습니다.  

도커 이미지를 예로 들자면 "템플릿"과 같다고 보면 됩니다.  
더 정확히 말하면 "특정한 시점의 운영환경을 담고 있는 패키지" 이죠.  

예를 들어 Windows 운영체제를 설치한다고 생각해봅시다.  
USB에 운영체제 설치 파일을 담고 있다가 PC 등에 Windows 운영체제를 설치할 수 있죠.  
하지만 설치파일만으로는 게임을 실행하거나 사무업무를 볼 수 없죠.  
설치를 완료한 머신 위에서 할 수 있는 것입니다.  

도커 이미지는 여기에서 좀 더 나아가야 합니다.  
바로 "특정 시점"의 격리된 환경을 저장할 수 있다는 점인데요,  
Windows 등의 운영체제에서는 "특정 시점"으로 복구할 수 있는 기능이 있죠.  
이 또한 특정 시점의 환경을 "이미지"에 담고 있기 때문에 가능한 것입니다.  

도커 이미지는 이렇게 (격리 환경을 만들 수 있는) 설치 파일의 역할도 하고 특정 시점의 환경을 담을 수 있는,  
템플릿의 역할을 합니다.  

앞서 말했듯 이해를 돕기 위한 설명인 만큼 정확한 설명은 아닙니다.  
정확한 이해를 위해선 더욱 전문성 있게 설명한 다른 포스트들을 찾아보길 권합니다.  

<br>

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 3️. 컨테이너 실행하기</span>

도커 이미지를 받았다면, 그 이미지를 기반으로 컨테이너 환경(격리된 환경)을 실행합니다.  
앞서 살펴본 도커 이미지가 설치파일이라면, 컨테이너는 설치가 완료되어 사용자가 사용할 수 있는 상태가 된 환경입니다.  

```bash
docker images # 컨테이너 실행할 수 있는 도커 이미지 확인
>>> REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
>>> ubuntu       18.04     f9a80a55f492   2 months ago   63.2MB

docker run -p 10022:22 -dit ubuntu:18.04 /bin/bash 
# -> ubuntu:18.04 도커 이미지를 run 한다. -it 터미널 환경은 bash로.
# -> d : 백그라운드에서 실행

```

기본적으로는 위와 같이 실행할 수 있습니다.  

컨테이너 환경 안에서 무얼 할 수 있는지는 다음 챕터에서 더욱 자세히 둘러보도록 하겠습니다.  

<br>

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 4️. 추가 : 다운로드 받을 수 있는 도커 이미지 확인하기  </span>

다운로드 받을 수 있는 도커 이미지들이 뭐가 있을지 궁금하다면!  
도커 허브에서 확인 가능합니다.  

[https://hub.docker.com/](https://hub.docker.com/)

혹은 docker search 명령어를 통해서도 가능합니다.

```bash
docker search 검색할키워드
```

<br>

## <span style='background:linear-gradient(to top, #e8ff94 50%, transparent 50%)'> 5️. Reference  </span>

도커 이미지 확인 : https://hub.docker.com  
ununtu docker 설치하기 : https://joshwon.tistory.com/61#google_vignette  