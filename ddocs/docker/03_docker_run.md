---
title: 도커 컨테이너 실행하기 docker run # 제목 (필수)
excerpt: 컨테이너를 실행해보자 # 서브 타이틀이자 meta description (필수)
date: 2024-02-26 12:00:00 +0900      # 작성일 (필수)
lastmod: 2024-02-26 12:00:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker/docker_run/
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



## 앞 챕터 리뷰

앞 챕터에서는 (1) 도커 패키지를 설치하고, (2) 도커 이미지를 받아 (3) 컨테이너를 올려 실행시켜보았습니다.

이번 섹션에서는 이렇게 올린 컨테이너에서 무얼 할 수 있는지 살펴보겠습니다.


## 도커 컨테이너 실행하기

```bash
docker run --name test -v ./dokcer_mnt:/data -p 10022:22 -p 18080:18080 -dit ubuntu:18.04 /bin/bash
```

우선 도커 이미지를 이용해 컨테이너를 실행합니다. 자주 사용하는 몇 가지 옵션을 더 추가하였는데요, 옵션들에 대한 설명은 아래를 참고해주세요.

```bash
docker run
# 도커 이미지로 컨테이너를 실행합니다.

--name test
# 컨테이너 이름은 "test" 로 설정합니다.

-v ./docker_mnt:/data
# 바깥쪽(머신)의 ./docker_mnt 디렉토리와 컨테이너 안쪽의 /data 디렉토리를 동기화하는볼륨 마운트를 합니다.

-p 10022:22
# 바깥쪽(머신)의 10022번 포트와 안쪽(컨테이너) 22번 포트를 포트포워딩합니다.

-p 18080:18080
# 상동. 포트포워딩

-dit
# 터미널 입력 환경으로(it) + 백그라운드에서(d) 실행합니다.

ubuntu:18.04
# 우분투 18.04 도커 이미지를 사용해서 컨테이너를 실행합니다.

bin/bash
# 사용하는 터미널 환경은 bash 입니다.
```

> ./docker_mnt 디렉토리에 테스트용 텍스트파일 하나를 만들어주세요! 그리고 그 텍스트파일 안에는 "컨테이너 바깥에서 작성한 파일입니다." 라는 내용을 넣어주세요.  
> 볼륨마운트가 무엇인지 이해하기 위한 장치입니다.  

## 도커 컨테이너 접속하기

도커에 접속은 `docker exec` 명령어를 통해 진행합니다. 우선, 도커의 ID를 알아야 하므로 `docker ps` 로 확인 해봅시다.

```bash
docker ps
>>> CONTAINER ID   IMAGE          COMMAND       CREATED     STATUS      PORTS      NAMES
>>> 1234567891     ubuntu:18.04   ""/bin/bash"  2 min ago   up 2 sconds 0.0....    test
```

확인하였다면 컨테이너 ID 혹은 컨테이너 이름을 명시하여 exec 명령어를 통해 컨테이너 안쪽으로 들어갑니다.  

<details>
<summary> 잠깐! 만약 docker ps에 아무것도 뜨지 않는다면? </summary>
<div markdown='1'>
분명 도커를 실행했었는데 docker ps에 아무것도 뜨지 않는다?  
도커가 exited 되어있을 수 있음.  

종료된 도커를 조회한 뒤, 해당 도커를 재실행하는 명령어는 아래와 같습니다.  

```bash
docker ps -a
>>> 모든 컨테이너 조회 (종료된 컨테이너도)

docker restart 컨테이너ID
>>> 종료(exited)된 컨테이너를 재실행
```

이는 컴퓨터를 종료했다가 재시작하는 것과 동일하게 보면 됩니다.

컨테이너가 실행되지 않았을 경우에는 위와 같이 재실행 하거나
혹은 `docker logs <컨테이너이름 혹은 ID>` 명령어를 통해 실행이 안되는 원인을 확인하시기 바랍니다.  

</div>
</details>

```bash
docker exec -it 1234567891 /bin/bash
# 혹은
docker exec -it test /bin/bash
```

접속하면 화면에서 사용하던 계정의 주소가 바뀜을 알 수 있습니다.

```bash
# 원래
root@jh-VirtualBox:

# docker exec 후
root@1234567891:
```

주소가 Container ID 로 변경되었을 것입니다. 즉 이는 "컨테이너 환경" 에 접속했다는 것이죠.  

## 둘러보기

자 그러면 둘러봅시다.  

```bash
ls -al
>>> total 76
>>> drwxr-xr-x   1 root root 4096 Aug 25 08:58 ./
>>> drwxr-xr-x   1 root root 4096 Aug 25 08:58 ../
>>> -rwxr-xr-x   1 root root    0 Aug 25 08:58 .dockerenv*
>>> drwxr-xr-x   2 root root 4096 May 30 02:04 bin/
>>> drwxr-xr-x   2 root root 4096 Apr 24  2018 boot/
>>> drwxr-xr-x   5 root root  360 Aug 28 03:46 dev/
>>> drwxr-xr-x   5 root root  360 Aug 28 03:46 data/
>>> drwxr-xr-x   1 root root 4096 Aug 25 08:58 etc/
>>> drwxr-xr-x   2 root root 4096 Apr 24  2018 home/
>>> drwxr-xr-x   8 root root 4096 May 23  2017 lib/
>>> drwxr-xr-x   2 root root 4096 May 30 02:03 lib64/
>>> drwxr-xr-x   2 root root 4096 May 30 02:03 media/
>>> drwxr-xr-x   2 root root 4096 May 30 02:03 mnt/
>>> drwxr-xr-x   2 root root 4096 May 30 02:03 opt/
>>> dr-xr-xr-x 251 root root    0 Aug 28 03:46 proc/
>>> drwx------   2 root root 4096 May 30 02:04 root/
>>> drwxr-xr-x   5 root root 4096 May 30 02:04 run/
>>> drwxr-xr-x   2 root root 4096 May 30 02:04 sbin/
>>> drwxr-xr-x   2 root root 4096 May 30 02:03 srv/
>>> dr-xr-xr-x  13 root root    0 Aug 28 03:46 sys/
>>> drwxrwxrwt   1 root root 4096 Aug 25 08:59 tmp/
>>> drwxr-xr-x  10 root root 4096 May 30 02:03 usr/
>>> drwxr-xr-x   1 root root 4096 May 30 02:04 var/
```

먼저 폴더들입니다. 우분투 운영체제에서 볼 수 있는 디렉토리들과 같습니다.  

```bash
cd /data
ls -al
>>> drwxr-xr-x   1 root root 4096 Aug 25 08:58 ./
>>> drwxr-xr-x   1 root root 4096 Aug 25 08:58 ../
>>> -rwxr-xr-x   1 root root    0 Aug 25 08:58 test.txt
```

/data 폴더에 들어가보면 컨테이너 바깥에서 mount 한 test.txt 파일을 볼 수 있습니다. 이걸 열어보면 "컨테이너 바깥에서 작성한 파일입니다." 라는 내용을 볼 수 있죠. 이 파일이 있다면 정상적으로 볼륨마운트가 된 것입니다.  

볼륨마운트는 바깥의 호스트에 있는 디렉토리와 컨테이너 안쪽의 디렉토리를 동기화하는 기능입니다.  

## 패키지 설치 (ssh, pix4d, conda, CUDA)

### 패키지 관리 툴 사용

```bash
apt-get update
```

컨테이너 안쪽에서도 바깥과 동일하게 운영체제에 맞는 패키지 관리 툴을 사용할 수 있습니다. 우분투는 apt, CentOS 는 yum, rocky는 dnf 가 되겠죠.


### 설치해두면 유용한 패키지들  

**1.ssh**  

외부와 통신을 원활하게 하기 위해 ssh를 설치해보도록 합시다.  

[https://whdrns2013.github.io/linux/network/20230602_001_ssh_connection/](https://whdrns2013.github.io/linux/network/20230602_001_ssh_connection/)  

도커를 실행할 때 도커 안의 22번포트가 도커 바깥의 10022포트와 연결되도록 포트포워딩을 진행했었죠.

이제 앞으로는 외부에서 IP:10022 로 접속하면 해당 컨테이너의 ssh 로 접속됩니다.  
물론 scp 전송도 가능해지기 때문에 편해지죠.  

**2.net-tools**  

net-tools는 네트워크 관련 여러 유용한 유틸리티를 제공하는 패키지입니다. netstat등이 그 대표적인 예시이죠.  

```bash
apt install net-tools
```

**3.nano**  

저는 리눅스의 텍스트 편집기 중에는 nano를 선호하는 편입니다. 쉬운 단축키로 작업이 편리하기 때문이죠!  

```bash
apt install nano
```

**4.wget, curl**  

wget, curl 등도 설치하시길 권장합니다.  

```bash
apt install wget
apt install curl
```

