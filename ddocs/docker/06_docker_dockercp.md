---
title: 호스트 - 컨테이너 간 파일 옮기기 # 제목 (필수)
excerpt: docker cp - dockerfile add - scp # 서브 타이틀이자 meta description (필수)
date: 2024-07-25 21:45:00 +0900      # 작성일 (필수)
lastmod: 2024-07-25 21:45:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker/docker_dockercp/
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


 <!--postNo: 20240725_001-->


## Intro  

Docker를 사용하다 보면 컨테이너 내부로 파일을 옮기거나, 컨테이너 내부의 파일을 외부로 가져오는 작업이 필요할 때가 있습니다. 이번포스트에서는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Docker 컨테이너 내부로 파일을 옮기는</span> 여러 가지 방법을 다뤄보겠습니다.  

기본적인 `docker cp` 명령어부터, Dockerfile의 `ADD` 및 `COPY` 명령어, 그리고 네트워크를 통한 파일 전송 방법까지 다양한 접근 방식을 소개합니다. Docker Volumes 옵션을 활용하는 방법도 있는데, 이는 다음 포스트에서 다뤄보도록 하겠습니다.  

## 컨테이너 안쪽으로 파일을 옮기는 방법들  

| 방법             | 설명                                                       |
| -------------- | -------------------------------------------------------- |
| docker cp      | 도커의 명령어로 호스트와 컨테이너 간,<br>혹은 컨테이너와 컨테이너 간에 <b>파일을 복사하는 방법</b>    |
| Dockerfile ADD | 도커 이미지를 만들 때 호스트에 있는 파일을 포함하도록 하는 방법                     |
| 네트워크 통신        | scp 등의 통신으로 호스트와 컨테이너 간,<br>혹은 컨테이너와 컨테이너 간에 <b>파일을 전송하는 방법</b> |

## docker cp  

`docker cp <호스트의 파일 경로> <컨테이너 이름>:<컨테이너 내부 경로>` 와 같은 명령어로 호스트에 위치한 파일을 구동중인 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>컨테이너 내부에 복사</span>하는 방법입니다. 동기화 같은 방식이 아닌, 단편적으로 파일을 전송하는 방법입니다.  

### 사용법  

```bash
# 호스트의 파일을 컨테이너에 복사하기
docker cp <호스트의 파일 경로> <컨테이너 이름>:<컨테이너 내부 경로>

# 컨테이너의 파일을 호스트에 복사하기
docker cp <컨테이너 이름>:<컨테이너 내부 경로> <호스트의 파일 경로>

# 컨테이너 간 파일 복사
docker cp <컨테이너1이름>:<컨테이너 내부 경로> <컨테이너2이름>:<컨테이너 내부 경로>
```

### 예시  

```bash
# 실험용 파일 만들기
vi /home/user/test.txt

# 아래 내용을 입력하고 저장
the text text file.
it will be copied from host to container.
good luck!
```

```bash
# 실험 대상 도커 : nginx
docker images
>> REPOSITORY   TAG                 IMAGE ID       CREATED      ..
>> nginx        stable-alpine3.19   1201b47b620e   4 weeks ago  ..

# 도커 실행
docker run -d --name cptest nginx:stable-alpine3.19

# 컨테이너 안쪽으로 접속
docker exec -it cptest /bin/sh

# 컨테이너 안쪽 파일 디렉토리 확인
cd /opt
ls -al
>> 아무 파일도 없음

# 호스트로 빠져나오기
exit

```

```bash
# 호스트에 만든 test.txt 파일을 컨테이너 안쪽에 복사
docker cp /home/user/test.txt  cptest:/opt/

# 컨테이너 안쪽으로 접속
docker exec -it cptest /bin/sh

# 컨테이너 안쪽 디렉토리 확인
cd /opt
ls -al
>> -rw-r--r--  1 root  root  73 Jul 23 15:19 test.txt

# 파일 출력
cat ./test.txt
>> the text text file.
>> it will be copied from host to container.
>> good luck!
```


## Dockerfile ADD  

도커 이미지를 만들 떄 호스트의 특정 파일 등을 컨테이너 내부에 복사하여 만들어지도록, 도커 이미지를 만드는 명세서인 Dockerfile에 기재하는 방법입니다. `ADD` 라는 문구로 컨테이너 내부로 복사할 파일의 경로를 지정합니다. 이미지를 빌드할 때부터 복사할 파일을 지정할 수 있다는 장점이 있습니다.  

``` yml
...
ADD <호스트 파일의 경로> <컨테이너 안쪽에 위시시킬 경로>
...
```


## SCP  

컨테이너와 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>네트워크 통신으로</span> 파일을 주고 받는 기능입니다. 이 기능을 사용하기 위해서는 `호스트와 컨테이너 안쪽 모두에서 ssh 서비스를 설치하고 실행`시켜야 합니다. 그리고 컨테이너의 ssh 서비스 포트는 `호스트와 포트포워딩`이 되어있어야 하죠. 아래 설명은 ssh 서비스가 양쪽 모두에서 실행되고 있다는 전제 하에 진행합니다.  

### 사용법  

```bash
scp -P <컨테이너ssh포트번호> <계정>@<IP주소>:/path/to/upload
```

### 예시  

```bash
# 컨테이너 실행시 포트포워딩 (2222:22)
docker run -d --name cont -p 2222:22 nginx:stable-alpine3.19

# 컨테이너 안쪽으로 접속
docker exec -it cont /bin/bash    # Alpine의 경우 /bin/sh

# 컨테이너 안쪽에서 ssh 설치 (ssh-server, clienbt)
apt install openssh-server openssh-client    # ubuntu
yum install openssh-server openssh-clients    # CentOS
dnf install openssh-server openssh-clients    # Rocky
apk add openssh    # Alpine

# 컨테이너 안쪽에서 ssh 서비스 실행
ssh-keygen -A
/usr/sbin/sshd
cd /opt
ls -al
>> 파일 없음

# 컨테이너 바깥쪽으로 이동
exit

# 호스트의 파일을 컨테이너 안쪽으로 scp 전송
scp -P 2222 ./test/txt root@서버의IP주소:/path/to/upload/test.txt

# 컨테이너 안쪽의 파일 확인
docker exec cptest cat /opt/test/txt
>> the text text file.
>> it will be copied from host to container.
>> good luck!
```


## Reference  

docker cp : [https://docs.docker.com/reference/cli/docker/container/cp/](https://docs.docker.com/reference/cli/docker/container/cp/)  
docker add : [https://docs.docker.com/reference/dockerfile/](https://docs.docker.com/reference/dockerfile/)  
컨테이너 인프라 환경 구축을 위한 쿠버네티스/도커 (조훈, 심근우, 문성주 지음)  