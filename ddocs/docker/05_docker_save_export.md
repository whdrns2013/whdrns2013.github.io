---
title: 컨테이너 및 이미지를 파일로 추출하기 save export # 제목 (필수)
excerpt: save export load import # 서브 타이틀이자 meta description (필수)
date: 2024-07-15 23:59:59 +0900      # 작성일 (필수)
lastmod: 2024-07-15 23:59:59 +0900   # 최종 수정일 (필수)
permalink: /docs/docker/docker_save_export/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---


 <!--postNo: 20240715_001-->


## Intro  

도커 컨테이너나 이미지를 파일로 추출해야 할 때가 있습니다. 예를 들어, <b><u>개발 환경에서 테스트를 마친 애플리케이션을 프로덕션 환경으로 이동</u></b>시키거나, 특정 이미지를 <b><u>백업하여 나중에 복원하고자 할 때</u></b>, 또는 다른 팀원들과 동일한 환경을 공유하고자 할 때 등이 있을 수 있습니다. 도커는 이러한 상황에 컨테이너와 이미지를 손쉽게 파일로 추출하고 저장할 수 있게 해줍니다. 이번 포스에서는 도커 컨테이너 및 이미지를 파일로 추출하는 방법과 그 활용 방안에 대해 알아보겠습니다.

## 추출하기  

도커 컨테이너 및 이미지를 파일로 추출하는 과정은 생각보다 간단합니다. `docker export`와 `docker save` 명령어를 통해 파일로 추출할 수 있는데요, 아래에서 이 두 가지 방법에 대해 자세히 살펴보겠습니다.

### 방법1 docker export - 컨테이너를 파일로 추출하기  

먼저, <b><font color="FF82B2">실행 중인 도커 컨테이너를 파일로 추출</font></b>  하려면 `docker export` 명령어를 사용합니다. 이 명령어는 컨테이너의 파일 시스템을 tar 아카이브로 내보냅니다. <b>마운트된 디렉토리는 tar 파일에 저장되지 않습니다.</b>  

```bash
# 기본 사용법
docker container export [OPTIONS] CONTAINER

# Alias
docker export [OPTIONS CONTAINER]
```

| 옵션           | 설명                     |
| ------------ | ---------------------- |
| -o, --output | 파일의 경로와 파일의 이름을 지정합니다. |

```bash
# 예시 1
docker export red_panda > latest.tar

# 예시 2
docker export --output="latest.tar" red_panda
```

### 방법2 docker save - 도커 이미지를 파일로 추출하기  

하나 이상의 <b><font color="FF82B2">도커 이미지를 tar 파일로 저장</font></b>  하는 명령어입니다. <b><u>모든 레이어와 모든 메타데이터를 포함</u></b>하여 파일로 저장됩니다.    

```bash
# 기본 사용법
docker image save [OPTIONS] IMAGE [IMAGE...]

# Alias
docker save [OPTIONS] IMAGE [IMAGE...]
```

| 옵션           | 설명                     |
| ------------ | ---------------------- |
| -o, --output | 파일의 경로와 파일의 이름을 지정합니다. |

```bash
# 예시
# (1) 
docker save busybox > busybox.tar
ls -sh busybox.tar
>> 2.7M busybox.tar
# (2) 
docker save --output busybox.tar busybox
ls -sh busybox.tar
>> 2.7M busybox.tar
# (3) 
docker save -o fedora-all.tar fedora
docker save -o fedora-latest.tar fedora:latest
```


## 복원하기  

### 방법1 docker import  

파일로 추출한 컨테이너는 `docker import` 명령어를 통해 도커 이미지로 복원할 수 있습니다.   

```bash
# 기본 사용법
docker image import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]

# Alias
docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]
```

| 옵션            | 설명                                                              |
| ------------- | --------------------------------------------------------------- |
| -c, --change  | 생성된 이미지에 Dockerfile 명령어를 추가합니다.<br>즉, 시작 CMD, 환경변수를 수정할 수 있습니다. |
| -m, --message | 가져온 이미지에 대해 commit 메세지를 작성합니다.                                  |
| -platform     | 서버가 다중 플랫폼 지원이 가능한 경우 플랫폼 설정                                    |

```bash
# 예시 1 : 로컬 파일에서 가져오기
docker import /path/to/exampleimage.tgz # 기본 import
docker import --message "New image" - exampleimagelocal:new # 메세지 추가

# 예시 2 : 원격 위치에서 가져오기
docker import https://example.com/exampleimage.tgz
cat exampleimage.tgz | docker import - exampleimagelocal:new
```

### 방법2 docker load - 도커 이미지 복원하기  

tar 아카이브에서 도커 이미지나 저장소를 로드합니다.

```bash
# 기본 사용법
docker image load [OPTIONS]

# Alias
docker load [OPTIONS]
```

| 옵션          | 설명                           |
| ----------- | ---------------------------- |
| -i, --input | 복원할 이미지를 담은 tar 아카이브를 지정합니다. |
| -q, --quiet | 출력을 하지 않습니다.                 |

```bash
# 예시 1

# (1) load 전 도커 이미지 확인
docker image ls
>> REPOSITORY   TAG   IMAGE ID   CREATED   SIZE

# (2) 도커 이미지를 load
docker load < busybox.tar.gz
>> Loaded image: busybox:latest

# (3) load 후 도커 이미지 확인
docker images
>> REPOSITORY    TAG       IMAGE ID       CREATED       SIZE
>> busybox       latest    769b9341d937   7 weeks ago   2.489 MB
```

```bash
# 예시 2

docker load --input fedora.tar
>> Loaded image: fedora:rawhide
>> Loaded image: fedora:20

docker images
>> REPOSITORY   TAG          IMAGE ID        CREATED         SIZE
>> busybox      latest       769b9341d937    7 weeks ago     2.489 MB
>> fedora       rawhide      0d20aec6529d    7 weeks ago     387 MB
>> fedora       20           58394af37342    7 weeks ago     385.5 MB
>> fedora       heisenbug    58394af37342    7 weeks ago     385.5 MB
>> fedora       latest       58394af37342    7 weeks ago     385.5 MB

```


## save 와 export 의 차이점


|구분| 명령어     |설명          |
|----| ----------- | ------------- |
| 추출  | docker export | 실행 중인 컨테이너의 파일 시스템을 파일로 추출.<br>컨테이너의 파일 시스템 스냅샷을 생성하며<br>컨테이너의 <b>메타데이터나 history 포함하지 않음</b>                     |
| 복원  | docker import | `docker export`로 생성된 파일 시스템 스냅샷을 이미지로 load<br>컨테이너의 메타데이터나 역사(history)는 복원되지 않는다.<br>단순히 파일 시스템 상태만을 새로운 이미지로 생성 |
| 추출  | docker save   | 도커 이미지를 파일로 추출하는 명령어<br>이미지의 모든 레이어와 메타데이터를 포함하여 tar 파일로 저장<br>이미지를 다른 시스템으로 전송하거나, 특정 버전을 보존할 때 사용              |
| 복원  | docker load   | `docker save`로 생성된 이미지를 복원<br>이미지의 모든 레이어와 메타데이터를 포함하여 복원<br>주로 백업한 이미지를 복원, 다른 시스템으로 이미지 전송에 사용                 |


<b><u>save 명령어는 도커의 메타데이터를 저장</u></b>하는데요, 아래 예시를 보면 쉽게 이해할 수 있습니다.  

```bash
# 도커 이미지 확인
docker images
>> REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
>> image        0.0.1     abcdefghijk    2 minutes ago   6.03GB

# 도커 이미지 저장
# 주의 : 이미지의 TAG는 0.0.1인데, 파일명은 0.0.2로 저장했음
docker save image:0.0.1 -o image:0.0.2.tar

# tar 파일 load
docker load -i image:0.0.2.tar

# 도커 이미지 확인
docker images
>> REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
>> image        0.0.1     abcdefghijk    2 minutes ago   6.03GB
>> <none>       <none>    abcdefghijk    20 minutes ago  6.03GB
```

tar 파일에 저장된 도커 이미지의 TAG는 0.0.1이기 때문에 파일명과 관계 없이 TAG가 0.0.1로 불러와집니다.  

## 왜 tar 파일인가?  

이미지를 tar 파일로 저장하는 이유는  

(1) 유연하고 광범위하게 사용되는 아카이브 포맷이라는 점  
(2) 압축으로 파일의 용량을 줄일 수 있다는 점  
(3) 계층 구조를 보존한다는 점  
(4) 생성과 추출이 간편하다는 점  

에서 도커 이미지나 컨테이너를 파일로 저장할 때 적당한 파일 포맷입니다.  
 
## Reference  

docker save : [https://docs.docker.com/reference/cli/docker/image/save/](https://docs.docker.com/reference/cli/docker/image/save/)  
docker load : [https://docs.docker.com/reference/cli/docker/image/load/](https://docs.docker.com/reference/cli/docker/image/load/)  
docker export : [https://docs.docker.com/reference/cli/docker/container/export/](https://docs.docker.com/reference/cli/docker/container/export/)  
docker import : [https://docs.docker.com/reference/cli/docker/image/import/](https://docs.docker.com/reference/cli/docker/image/import/)  
[https://waspro.tistory.com/584](https://waspro.tistory.com/584)    
[https://chatgpt.com/c/95e0f735-bf96-4810-b1d6-305bc7337094](https://chatgpt.com/c/95e0f735-bf96-4810-b1d6-305bc7337094)  
