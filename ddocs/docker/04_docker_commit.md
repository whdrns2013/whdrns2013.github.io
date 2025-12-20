---
title: 컨테이너를 이미지로 만들기 docker commit # 제목 (필수)
excerpt: 새로운 이미지로 commit # 서브 타이틀이자 meta description (필수)
date: 2024-07-14 15:20:00 +0900      # 작성일 (필수)
lastmod: 2024-07-14 15:20:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker/docker_commit/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---


 
## docker commit  

컨테이너의 파일 변경 사항이나 설정의 변경 사항을 적용한 새 이미지를 만드는 방법입니다.  

> <b><font color="FF82B2">주의사항</font></b>  
> -커밋에는 마운트된 볼륨에 포함된 어떤 데이터도 포함되지 않습니다.  
> -기본적으로 커밋되는 컨테이너와 해당 프로세스는 커밋되는 동안 일시 중지됩니다.
> (커밋 과정에서 데이터 손상 발생 가능성 줄이기 위함. 중지되는 게 싫을 경우 --pause false 옵션 적용할 것)  

### 기본 명령어  

```bash
# full
docker container commit [OPTIONS] CONTAINER이름혹은ID [REPOSITORY:TAG]

# alias
docker commit [OPTIONS] CONTAINER이름혹은ID [REPOSITORY:TAG]
```

### 기본 예시  

```bash

# commit 전 image 리스트
docker images
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
ubuntu       18.04     f9a80a55f492   2 months ago     63.2MB

# container commit
docker ps
>> CONTAINER ID   IMAGE          ...  CREATED     STATUS      PORTS    NAMES
>> 1234567891     ubuntu:18.04   ...  2 min ago   up 2 sconds 0.0....  test

docker commit -a "작성자" -m "커밋 메세지" test test:0.0.1

# commit 후 image 리스트
docker images
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
test         0.0.1     45b6a2956c40   40 seconds ago   228MB
ubuntu       18.04     f9a80a55f492   2 months ago     63.2MB

```


## docker commit 옵션  

| 옵션            | default | 설명                                                  |
| ------------- | ------- | --------------------------------------------------- |
| -a, --author  |         | 작성자(예: `John Hannibal Smith <hannibal@a-team.com>`) |
| -c, --change  |         | 생성된 이미지에 Dockerfile 명령어 적용                          |
| -m, --message |         | 커밋 메시지                                              |
| -p, --pause   | true    | 커밋 중 컨테이너 일시 중지                                     |

### change 옵션  

생성된 이미지에 Dockerfile 명령어를 적용합니다. 쉽게 말해, 컨테이너를 이미지로 커밋하면서 환경변수를 바꾸거나, 기본 실행 커맨드를 변경할 수 있습니다. 아래 예시를 보죠.  

```bash
# change 전 상태
docker ps
>> CONTAINER ID  IMAGE         COMMAND    ...  PORTS   NAMES
>> c3f279d17e0a  ubuntu:22.04  /bin/bash  ...          desperate_dubinsky
>> 197387f1b436  ubuntu:22.04  /bin/bash  ...          focused_hamilton

# commit + change
# (1) 컨테이너 실행시 커맨드를 변경함
# (2) 80번 포트를 사용함
# 이미지 이름은 testimage:version4
docker commit --change='CMD ["apachectl", "-DFOREGROUND"]' -c "EXPOSE 80" c3f279d17e0a  svendowideit/test:v4
>> f5283438590d

# 새로이 만든 이미지로 docker run
docker run -d svendowideit/test:v4
>> 893737..

# docker run 후 상태
docker ps
>> CONTAINER ID  IMAGE    COMMAND                ...  PORTS    NAMES
>> 89373736e2e7  test:v4  "apachectl -DFOREGROU" ...  80/tcp   distracted_fermat
>> c3f279d17e0a  ubun...  /bin/bash              ...           desperate_dubinsky
>> 197387f1b436  ubun...  /bin/bash              ...           focused_hamilton
```

예시를 해석하면 아래와 같습니다.  

| 명령어                           | 설명                                                                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| docker commit                 | 실행중인 컨테이너를 이미지화(커밋) 한다.                                                                                                             |
| --change, -c                  | 생성된 이미지에 Dockerfile 명령어 적용                                                                                                          |
| ["apachectl", "-DFOREGROUND"] | Apach HTTP 서버를 포그라운드로 실행한다.<br><br>컨테이너에 포그라운드로 실행되는 프로세스가 없을 경우<br>컨테이너가 종료되기 때문에, 백그라운드가 아닌 포그라운드로<br>실행시키는 것으로 보인다.              |
| "EXPOSE 80"                   | 컨테이너가 내부적으로 80 포트를 사용함을 나타낸다.<br><br>단, 컨테이너 외부와의 포트 매핑이 아니라<br>단지 80포트를 사용하고 있다는 메타데이터의 의미이다.<br>다른 개발자나 사용자가 사용 포트를 알 수 있게 하는 목적. |
| c3f279d17e0a                  | 커밋 대상은 컨테이너 아이디 c3f279d17e0a 이다.                                                                                                    |
| svendowideit/test:v4          | 생성하는 이미지 이름을 지정함                                                                                                                    |

이번에는 commit 시에 환경변수를 추가하는 예제를 살펴보겠습니다.  

```bash
# commit 전
docker ps
>> CONTAINER ID   IMAGE        COMMAND    ...   NAMES
>> c3f279d17e0a   ubuntu:22.04 /bin/bash  ...   desperate_dubinsky
>> 197387f1b436   ubuntu:22.04 /bin/bash  ...   focused_hamilton

# c3f279d17e0a 컨테이너의 환경변수를 조회
docker inspect -f "{% raw %}{{ .Config.Env }}{% endraw %}" c3f279d17e0a
>> [HOME=/ PATH=/usr/local/sbin:/usr/local/bin:...]

# commit 하면서 ENV에 DEBUG=true 추가
docker commit --change "ENV DEBUG=true" c3f279d17e0a  svendowideit/test:v3
>> f5283438590d

# commit을 통해 새로 만들어진 이미지의 환경변수를 조회
docker inspect -f "{% raw %}{{ .Config.Env }}{% endraw %}" f5283438590d
>> [HOME=/ PATH=/usr/local/sbin:/usr/local/bin:... DEBUG=true]
```

## 도커 스토리지 변경

도커를 다루다 보면 도커 이미지와 컨테이너가 저장되는 경로를 바꿔야 할 수도 있습니다. 도커 이미지는 기본적으로 `/var/lib/docker` 에 저장되지만, 만약 리눅스 서버의 `/` 디렉토리에 할당된 디스크의 크기가 작을 경우, 새로운 도커 이미지를 추가하거나 다른 패키지를 설치하는 등의 활동에 제약을 받을 수 있기 때문입니다.  

도커 이미지와 컨테이너 저장 경로는 도커 데몬 설정 파일에서 지정해줄 수 있습니다. 설정 파일 적용시에는 도커 서비스를 꼭 재실행해줘야 합니다.  

```bash
# 도커 저장 경로 확인
docker info | grep "Docker Root Dir"
>> /var/lib/docker

# 새로운 도커 저장 경로 디렉토리 생성
mkdir /data/docker

# 도커 설정 파일 수정 (파일이 없다면 생성하기)
vi /etc/docker/daemon.json

> {
> 	"data-root":"/data/docker" # 새로 생성한 도커 저장 디렉토리
> }

# 도커 서비스 재시작
systemctl stop docker
systemctl start docker
systemctl restart docker.socket
```

기존에 있던 이미지와 컨테이너 데이터가 있다면, 이들을 새로이 만들어진 도커 저장 디렉토리에 복사/이동 해주면 됩니다. 이 동작은 docker 서비스 중지(stop) 와 재시작(start) 사이에 해주는 것을 권장합니다.  

```bash
# 도커 서비스 중지
systemctl stop docker

# 기존 도커 데이터 복사
cp -r /var/lib/docker /data/docker

# 도커 서비스 재시작
systemctl start docker
systemctl restart docker.socket
```

도커 서비스를 중지한 뒤 데이터를 복사하는 이유는 데이터 무결성 보장을 위함입니다.  

(1) <b><font color="FF82B2">파일 일관성 유지</font></b>: 도커가 실행 중인 상태에서는 컨테이너가 계속 데이터를 읽고 쓰기 때문에, 복사시 파일의 일관성이 깨질 수 있습니다. 이를 방지하기 위해 도커를 중지하고 모든 파일이 고정된 상태에서 복사함으로써 일관성을 유지할 수 있습니다.  

(2) <b><font color="FF82B2">경쟁 조건 방지</font></b>: 도커가 데이터를 읽고 쓰는 동안 데이터를 복사하면, 경쟁 조건(race condition)이 발생해 데이터가 불완전하거나 손상될 가능성을 높입니다. 도커를 중지하면 이러한 문제를 피할 수 있습니다.  

(3) <b><font color="FF82B2">잠금 문제 방지</font></b>: 도커가 데이터를 사용하는 동안 파일 시스템에서 파일 잠금 문제가 발생하여 복사 과정에서 오류를 일으킬 수 있습니다. 도커를 중지하면 파일 잠금 문제가 발생하지 않습니다.  

## Reference

[https://docs.docker.com](https://docs.docker.com/reference/cli/docker/container/commit/  )
[https://domdom.tistory.com/589](https://domdom.tistory.com/589)  
[https://yoo11052.tistory.com/144](https://yoo11052.tistory.com/144)  
[https://dongle94.github.io/](https://dongle94.github.io/docker/docker-image-storage-change/#google_vignette)  