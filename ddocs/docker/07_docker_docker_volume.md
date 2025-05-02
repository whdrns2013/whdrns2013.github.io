---
title: 디렉토리 공유 docker volumes # 제목 (필수)
excerpt: bind mount 와 docker volume # 서브 타이틀이자 meta description (필수)
date: 2024-09-20 00:30:00 +0900      # 작성일 (필수)
lastmod: 2024-09-20 00:30:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker/docker_docker_volume/
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


 <!--postNo: 20240920_001-->  

## Intro  

컨테이너 기반 환경에서 Docker Volumes 옵션은 정말 많이 사용됩니다. 이 옵션을 통해 <b><font color="FF82B2">컨테이너와 호스트 머신 간의 데이터를 쉽게 공유</font></b>할 수 있으며, <b><font color="FF82B2">컨테이너가 삭제되더라도 데이터를 보존</font></b>할 수 있습니다. 특히, 데이터가 지속적으로 저장되어야 하는 애플리케이션에서는 Docker Volumes가 필수적입니다. 이번 포스트에서는 Docker Volumes의 기본 개념부터 사용 방법, 그리고 다양한 활용 사례까지 상세히 알아보겠습니다. Docker Volumes를 효과적으로 활용하면 어떻게 애플리케이션의 데이터 관리를 개선할 수 있는지 함께 살펴보겠습니다.

## Docker Volumes  

### 개념  

Docker Volumes는 <b><font color="FF82B2">컨테이너와 호스트 간의 데이터를 공유</font></b>하거나 <b><font color="FF82B2">컨테이너 간에 데이터를 공유</font></b>할 수 있게 해줍니다. 이를 통해 데이터를 컨테이너의 라이프사이클과 독립적으로 데이터를 관리하고 보존할 수 있어, 데이터의 지속성과 안전성을 보장합니다.  

컨테이너는 기본적으로 레이어 구조로 이루어져있고, 저장되지 않은 레이어(변경 사항)은 휘발되는 특징을 가지고 있습니다. 때문에 컨테이너를 종료하면, 변경 내용이나 생성한 작업물들이 사라지게 되는 것이죠. Docker Volumes 는 컨테이너  

Volumes 옵션을 사용해도 해당 볼륨(혹은 마운트)을 사용하는 컨테이너의 사이즈가 늘어나지는 않습니다. 볼륨이 컨테이너의 라이프사이클 외부에 존재하기 때문인데요 (=호스트에 저장되기 때문), 마치 <b><font color="FF82B2">호스트를 외장 드라이브처럼</b></font> 이용하는 것과 비슷하죠.  

### 종류  

도커 Volumes (-v 옵션) 에는 두 가지 종류가 있습니다. `바인드 마운트`와 `볼륨`이 바로 그것인데요, 둘의 특징과 차이점은 아래와 같습니다.  

| 종류      | 설명                                                                                                                                                                    |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 바인드 마운트 | - 호스트의 특정 디렉토리와 컨테이너 내부의 특정 디렉토리를 연결합니다.<br>- 어느 한 쪽에서 작업한 내용이 양쪽에 동시에 반영됩니다.<br>- 컨테이너가 바뀌어도 (버전 변경, re-run 등) 자료는 보존됩니다.<br>- 호스트에 파일이 저장되기 때문에 컨테이너 용량에는 변동이 없습니다. |
| 볼륨      | - 대부분은 바인드 마운트와 동일합니다.<br>- 다른 점은, 연결 대상이 `도커가 관리하는` 호스트의 공간과 컨테이너 내부의 특정 디렉토리를 연결한다는 점입니다.<br>- 파일 보관 위치는 호스트로, 바인드 마운트와 동일합니다.                                      |

### 공통적인 특징  

- 호스트의 파일시스템과 도커 내부를 연결한다.  
- 컨테이너가 종료되어도 데이터는 호스트에 보존된다.  
- 데이터 저장 위치는 양쪽 모두가 아닌, 호스트에만 저장된다.  


## Bind Mount 바인드 마운트  

### 설명  

바인드 마운트는 특정 디렉터리(또는 파일)를 컨테이너의 디렉터리에 직접 연결하여 호스트와 컨테이너 간에 데이터를 실시간으로 공유할 수 있게 합니다. 이 방식은 기존의 디렉터리를 그대로 사용하므로 “bind”라는 용어가 사용되었습니다. 이는 호스트 시스템의 파일 시스템과 컨테이너 파일 시스템을 “결합”하여 동일한 파일을 접근하고 수정할 수 있게 합니다.  

![](/assets/images/20240920_001_001.png)  
<i>docker docs 에 있는 설명도를 따라 그렸습니다.</i>  

위 그림 중 (1) bind mount 부분

### 사용법  

```bash
# 도커 실행시 host의 디렉토리에 마운트
docker run -v [/HOST/PATH]:[/CONTAINER/PATH] [OPTION] [IMAGE:TAG] [COMMAND]
```

### 예시  

예시로는 호스트의 /home/user/b_mount 디렉토리와 컨테이너의 /root 디렉토리를 연결해보고, 바인드된 디렉토리에 파일을 생성했을 때 어떤 일이 일어나는지 살펴보겠습니다. 예시로 사용할 이미지는 `alpine` 인데요, alpine은 경량 리눅스 OS로 유명합니다.   

```bash
# 예시 도커 이미지 pull
docker pull alpine

# 마운트할 호스트의 디렉토리 생성
mkdir /home/user/b_mount

# 도커 이미지 Run + 바인드 마운트
docker run -dit -v /home/user/b_mount:/root \
--name alpine_mount alpine:latest /bin/sh

# 도커 안쪽의 /root 디렉토리 살펴보기
docker exec alpine_mount ls -al /root
>> 파일 없음

# 호스트에 test.txt 파일을 만들고, 다시 살펴보기
echo "Hello Container Mount!" > /home/user/b_mount/test.txt

docker exec alpine_mount ls -al /root
>> -rw-r--r--  1 root root ... test.txt  # 파일 생김

docker exec alpine_mount cat /root/test.txt
>> Hello Container Mount!
```

예시에서 보듯이 바인드 마운트 된 폴더에 만든 `test.txt` 파일이 컨테이너 안쪽에도 생겼음을 확인할 수 있습니다. 그러면 이번엔 컨테이너 안쪽에서 파일을 만들어보도록 하겠습니다.  

```bash
# 컨테이너 안쪽으로 진입
docker exec -it alpine_mount /bin/sh
echo "Hello, I'm in Container" > /root/test2.txt

# 호스트로 빠져나오기
exit

# 호스트의 마운트 디렉토리에서 파일 확인하기
ls -al /home/user/b_mount
>> -rw-r--r--  1 root root ... test.txt
>> -rw-r--r--  1 root root ... test2.txt  # 파일 생김

cat /home/user/b_mount/test2.txt
>> Hello, I'm in Container
```

컨테이너 안쪽에서 생성한 파일도 역시 호스트에서도 생겼음을 확인할 수 있습니다. 그러면 이번엔 파일을 수정해보도록 하겠습니다.  

```bash
# 호스트에서 test.txt 파일 내용 수정하고 컨테이너에서 확인하기
echo "edited at host" > /home/user/b_mount/test.txt
docker exec alpine_mount cat /root/test.txt
>> edited at host  # 수정된 문구 출력됨

# 컨테이너에서 test2.txt 파일 내용 수정하고 호스트에서 확인하기
docker exec alpine_mount sh -c 'echo "edited at container" > /root/test2.txt'
cat /home/user/b_mount/test2.txt
>> edited at container  # 수정된 문구 출력됨
```

컨테이너 안쪽의 수정사항도 호스트에 적용되었음을 확인할 수 있습니다.

### 주의 - 호스트엔 마운트하는 디렉토리가 존재해야 한다.  

주의할 점은, 호스트에 마운트하는 디렉토리가 존재해야 한다는 점입니다. 만약 호스트에 디렉토리가 없다면 제대로 마운트가 되지 않습니다.  

```bash
# 호스트에 없는 디렉토리를 마운트
docker run -dit -v /weird:/root --name al alpine:latest /bin/sh

# 호스트에서 디렉터리 찾아보기
ls /
>> bin cdrom etc lib ... tmp var
>> wierd 디렉토리는 없음

# 컨테이너 안쪽에서 파일을 생성해도 - 호스트엔 디렉터리 없음
docker exec al sh -c 'echo "test" > /root/test.txt'
ls /
>> bin cdrom etc lib ... tmp var
>> wierd 디렉토리는 없음

# 컨테이너 안쪽에는 파일이 정상적으로 생성됨
docker exec al cat /root/test.txt
>> test

# docker inspect에도 바인드 마운트가 잡힘
docker inspect -f '{{ .Mounts }}' al
>> [{bind  /weird /root   true rprivate}]
```

호스트에 디렉토리가 있다면, 컨테이너 안쪽에 없는 디렉토리를 마운트하는 것은 문제가 없습니다. 컨테이너 안쪽에 자동의 디렉토리가 생성되기 때문이죠.  

```bash
# 컩테이너에 없는 디렉토리를 마운트
docker run -dit -v /home/user/b_mount:/weird2 \
--name al alpine:latest /bin/sh

# 컨테이너 안에서 확인 : 디렉토리 자동 생성됨
docker exec al ls /
>> bin dev ... usr var 'weird2'

# docker inspect에도 바인드 마운트 잡힘
docker inspect -f '{{ .Mounts }}' al
>> [{bind  /home/user/b_mount /weird2   true rprivate}]
```

### 주의 - 바인드 마운트는 덮어씌워진다.  

바인드 마운트시에 주의할 점이 한 가지 더 있는데요, 바로 호스트 디렉토리의 내용이 연결된 컨테이너 디렉토리에 덮어씌워진다는 점입니다. 때문에 내용물이 있는 컨테이너 디렉토리와 빈 호스트 디렉토리를 연결하면 빈 디렉토리가 되어버립니다. 예시로 nginx 도커 이미지를 활용해보겠습니다. nginx 도커는 웹사이트 등을 띄울 수 있게 해주는 웹 서버인 nginx를 가지고 있는 도커입니다.  

먼저, 바인드 마운트 없이 도커를 포트포워딩만 줘서 띄워보겠습니다.  

```bash
# nginx 도커 이미지 pull
docker pull nginx

# 도커 이미지 run, 80포트 포트포워딩
docker run -p 8080:80 -d --name nginx_wo_mount nginx:latest

# 도커 status 확인
docker ps
>> CONTAINER ID  IMAGE          ...   STATUS        PORTS         NAMES
>> 1bd91afe4467  nginx:latest   ...   Up 1 second   8080->80/tcp  nginx
```

웹 브라우저를 통해 `http://서버ip주소:8080` 로 접속해보면, 아래와 같이 정상적인 nginx 기본 페이지를 볼 수 있습니다.  

![](/assets/images/20240920_001_002.png)  

이번에는 호스트의 빈 디렉토리와 nginx의 html을 보관하는 /usr/share/nginx/html 디렉토리를 바인드 마운트 해보겠습니다.  


```bash
# 호스트에 html 파일을 보관할 빈 디렉토리 생성
mkdir /home/user/html
ls /home/user/html
>> 출력 없음 (비어있음)

# 도커 이미지 run + 바인드 마운트
docker run -v /home/user/html:/usr/share/nginx/html \
-p 8081:80 -d --name nginx_void nginx:latest

# 브라우저에서 접속해보기
```

그리고 브라우저를 통해 nginx 가 실행되고 있는 8081번 포트에 접속해보도록 하죠.  

![](/assets/images/20240920_001_003.png)  

이번에는 403 Forbidden 에러가 발생합니다. 빈 디렉토리가 덮어씌워지면서 기본적으로 nginx 도커가 가지고 있어야 할 index.html 파일이 없어졌기 때문입니다.  

```bash
# nginx html 디렉토리 확인 (덮어씌워진 경우)
docker exec nginx_void ls /usr/share/nginx/html
>> 출력 없음 (비어있음)

# nginx html 디렉토리 확인 (마운트 안함)
docker exec nginx_wo_mount ls /usr/share/nginx/html
>> 50x.html
>> index.html
```

### 주의 - 파일은 호스트에 저장된다.  

바인드 마운트의 특징 한 가지를 더 살펴보겠습니다. 바로 바인드 마운트 된 디렉토리 내의 데이터는 호스트에만 저장된다는 특징입니다. 이 특징 덕분에 컨테이너의 용량은 그대로 유지한 채 호스트에 있는 파일을 편리하게 사용할 수 있을 뿐 아니라, 컨테이너가 삭제되더라도 데이터는 보존될 수 있습니다.  

하지만 주의할 점은 컨테이너에 데이터가 저장되지 않기 때문에, 컨테이너를 다른 환경에서 실행할 때에는 도커 이미지와 더불어 데이터(파일 등)도 함께 이동해야 한다는 것입니다.  

아래 예시를 통해 자세하게 알아보겠습니다.  

```bash
# 호스트에 디렉토리 생성하고 파일 추가
mkdir /home/user/b_mount
echo "this is a file" > /home/user/b_mount/test.txt

# 도커 이미지 run with bind mount
docker run -dit -v /home/user/b_mount:/root \
--name alpine alpine:latest /bin/sh

# 컨테이너 안쪽에 파일이 있음을 확인
docker exec alpine ls /root
>> test.txt

# 컨테이너를 이미지로 만들고 (commit) 종료
docker commit alpine alpine:mounted
docker stop alpine
docker rm alpine

# 새로 만든 도커 이미지를 run
docker run -dit --name alpine alpine:mounted /bin/sh

# 컨테이너 안쪽에 파일 있는지 확인 : 파일 없음
docker exec alpine ls /root
>> 출력 없음 (파일 없음)

# 호스트에는 그대로 파일이 있음을 확인
cat /home/user/b_mount/test.txt
> this is a file
```


## Docker Volume 도커 볼륨  

### 설명  

Docker volume은 기본적으로 바인드 마운트와 유사합니다. 다른 점이라면 컨테이너 내부 의렉토리와 연결되는 호스트의 공간이 도커가 관리하는 공간이라는 점이 있습니다. 이러한 특징은 볼륨내부의 데이터에 대한 보존성과 보안성을 높일 수 있으며, 백업이나 마이그레이션이 더 쉽다는 장점으로 이어집니다.  

바인드 마운트는 호스트의 파일 시스템에 강하게 의존하므로 호스트에 접근한 사용자들에 의해 쉽게 내용이 확인될 수 있고, 수정 및 삭제 되기도 용이합니다. 하지만 도커 볼륨은 도커가 관리하는 격리된 관리 구조로 보존성과 보안성이 높습니다.  

또한 바인드 마운트는 호스트의 디렉토리를 컨테이너 안쪽에 덮어씌우는 방식이었다면, 도커 볼륨은 양 디렉토리를 동기화시키는 방식이라는 점에서도 차이가 있습니다.  

그렇다고 바인드 마운트가 도커 볼륨보다 안좋다라는 것은 아닙니다. 바인드 마운트는 설정이 쉽고, 호스트에서도 파일에 직접 접근이 가능하기 때문에 작업상 편리한 점이 있습니다. 목적과 스타일에 따라 선택해 사용하면 됩니다.  

![](/assets/images/20240920_001_004.png)  
<i>docker docs 에 있는 설명도를 따라 그렸습니다.</i>  

위 그림 중 (2) docker volume 부분  

### 사용법  

1. 도커 볼룸 생성  

```bash
docker volume create [OPTIONS] [VOLUME]
```


2. 볼륨을 마운트하여 컨테이너 시작  

-v 옵션 혹은 --mount 옵션으로 사용합니다.  

```bash
docker run -v [VOLUME]:[/CONTAINER/PATH] [OPTION] [IMAGE]:[TAG] [COMMAND]
```

또는  

```bash
docker run \
--mount source=[VOLUME], target=[/CONTAINER/PATH] \
[OPTION] [IMAGE]:[TAG] [COMMAND]
```

호스트에 존재하는 볼륨의 목록을 확인하거나, 볼륨의 상세 내용을 보는 것은 아래 명령어를 참고해주세요. (호스트에서 실행해야 합니다. )  

3. 볼륨 목록 확인  

```bash
docekr volume ls
>> 볼륨 목록 출력됨
```

4. 볼륨 상세 정보(inspect) 확인  

```bash
docker volume inspect [VOLUME]
```

5. 볼륨 백업과 복원  

도커 볼륨의 백업과 복원은 데이터 유지 및 이전에 중요한 작업입니다.  

5.1 볼륨 백업  
아래 명령어를 실행하여 도커 볼륨을 tar 파일로 백업할 수 있습니다.  

```bash
# 볼륨 백업
docker run --rm --volumes-from [CONTAINER] \
-v [/HOST/PATH/TO/SAVE/VOLUME]:[TARGET_DIR_IN_CONTAINER] \
[BASE_IMAGE] \
tar cvf [HOST/PATH/TO/SAVE/VOLUME]/backup.tar /[TARGET_DIR_IN_CONTAINER]
```

명령어는 아래와 같이 작동합니다.  

- `--rm`: 컨테이너 실행이 끝나면 자동으로 삭제됩니다.
- `--volumes-from [CONTAINER]`: 백업할 데이터가 저장된 컨테이너에서 볼륨을 가져옵니다.
- `-v [/HOST/PATH/TO/SAVE/VOLUME]:[TARGET_DIR_IN_CONTAINER]`: 백업 파일을 저장할 호스트 경로와 컨테이너 내부의 경로를 마운트합니다.
- `tar cvf [HOST/PATH/TO/SAVE/VOLUME]/backup.tar`: tar 명령어를 사용하여 컨테이너의 데이터를 tar 파일로 압축합니다.

5.2 볼륨 복원

tar 파일로 백업한 도커 볼륨을 다시 도커 볼륨으로 복원하는 방법을 알아보겠습니다.  

```bash
# 볼륨 복원

# (1) 새로운 볼륨 생성
docker volume create [VOLUME]

# (2) tar 파일 복원
docker run --rm -v [VOLUME]:/volume \
-v /path/to/backup.tar:/backup.tar busybox \
tar xvf /backup.tar -C /volume

```

이 명령어는 백업된 tar 파일을 생성한 볼륨으로 복원하는 방법입니다. 자세한 설명은 다음과 같습니다:

- `-v [VOLUME]:/volume`: 복원할 도커 볼륨을 `/volume`으로 마운트합니다.
- `-v /path/to/backup.tar:/backup.tar`: 백업 파일이 있는 경로를 컨테이너 내부에 마운트합니다.
- `busybox tar xvf /backup.tar -C /volume`: `busybox` 이미지를 사용하여 백업 파일의 데이터를 도커 볼륨으로 복원합니다.

이제 tar 파일로 백업된 데이터가 다시 도커 볼륨으로 복원되어 사용 가능합니다.

6. 볼륨 제거  

더 이상 필요하지 않은 볼륨은 `docker volume rm` 명령어로 제거할 수 있습니다. 이 명령어는 볼륨을 삭제하므로, 데이터를 완전히 삭제하기 전에 확인이 필요합니다.  

```bash
docker volume rm [VOLUME]
```


### 예시  

먼저 도커 볼륨은 만들어줍니다.  

```bash
# 도커 볼륨 생성
docker volume create volume_test
```

볼륨이 잘 만들어졌는지 리스트와 inspect를 확인하겠습니다.  

```bash
# 도커 볼륨 리스트 확인
docker volume ls
>> DRIVER    VOLUME NAME
>> local     volume_test

# 도커 inspect 확인
docker volume inspect volume_test
>> [
>>     {
>>         "CreatedAt": "2024-07-28T09:37:45Z",
>>         "Driver": "local",
>>         "Labels": null,
>>         "Mountpoint": "/var/snap/docker/common/var-lib-docker/volumes/volume_test/_data",
>>         "Name": "volume_test",
>>         "Options": null,
>>         "Scope": "local"
>>     }
>> ]
```

만들어진 볼륨을 컨테이너에 연결해서 사용해보겠습니다. 예시로 위에서 사용했던 nginx 이미지를 사용하고, 8080 포트와 80 포트를  포트포워딩 해주겠습니다.  

```bash
# nginx 이미지 실행
docker run -d -v volume_test:/usr/share/nginx/html \
-p 8080:80 --name nginx_w_volume nginx:latest

# 컨테이너 상태 확인
docker ps
CONTAINER ID   IMAGE            PORTS              NAMES
5395719120e2   nginx:latest ... 0.0.0.0:8080->80   nginx_w_volume
```

이번에는 정상적으로 nginx 기본 페이지가 보입니다. 바인드 마운트와 다른 점으로, 디렉토리를 덮어쓰는 방식이 아니라 동기화하는 방식이기 때문에 컨테이너 안쪽의 파일이 보존되는 것을 볼 수 있습니다.  

![](/assets/images/20240920_001_005.png)  

컨테이너 안쪽으로 접속하여 html의 내용을 바꿔보겠습니다.  

```bash
# 컨테이너에 접속
docker exec -it nginx_w_volume /bin/bash
vi /usr/share/nginx/html/index.html

>> Welcome to nginx! 를 Docker Volume Test로 변경  
```

![](/assets/images/20240920_001_006.png)  

정상적으로 수정이 되었네요. 여기에 새로운 컨테이너를 실행시키고, 똑같이 volume_test 볼륨을 마운트해보겠습니다. 새로 만드는 컨테이너의 이름은 nginx_w_volume2, 포워딩 포트는 8081번을 할당하겠습니다. 그리고 브라우저로 8081 포트로 접속을 해보죠.    

```bash
docker run -d -v volume_test:/usr/share/nginx/html \
-p 8081:80 --name nginx_w_volume2 nginx:latest
```

![](/assets/images/20240920_001_007.png)  

수정사항이 docker volume에 적용되었고, 하나의 도커 볼륨을 여러 컨테이너가 동시에 공유할 수 있음도 알 수 있네요. 그렇다면 이번엔 수정 사항이 적용된 볼륨을 tar 파일로 백업하고, 다시 불러와서 사용해 보겠습니다.  

```bash
# 호스트로 나가기
exit

# 도커 볼륨을 백업할 디렉토리 생성
mkdir /home/user/backup

# 도커 볼륨을 호스트에 tar 파일로 백업
docker run --rm --volumes-from nginx_w_volume \
-v /home/user/backup:/backup ubuntu \
tar cvf /backup/backup.tar /new_volume_test
```

위 명령어는 `nginx_w_volume` 컨테이너에 연결된 `volume_test` 볼륨을 `/usr/share/nginx/html` 경로에서 tar 파일로 압축하여 호스트의 `/home/user/backup` 디렉토리에 `backup.tar`로 저장하는 과정입니다.

```bash
# 호스트의 백업 디렉토리 확인
ls /home/user/backup
>> backup.tar
```

tar 파일로 백업이 완료되었네요. 이번에는 백업 파일을 다시 도커 볼륨으로 복원하여 사용해보겠습니다.  

```bash
# 백업된 데이터를 담을 새로운 볼륨 생성
docker volume create volume_test_restore

# tar 파일을 새로운 볼륨에 복원합니다.
docker run --rm -v volume_test_restore:/usr/share/nginx/html \
-v /home/user/backup/backup.tar:/backup.tar ubuntu \
tar xvf /backup.tar -C /usr/share/nginx/html
```

복원된 데이터를 사용할 새로운 컨테이너를 실행하고, 새로 만든 도커 볼륨을 마운트 합니다.  

```bash
docker run -d -v volume_test_restore:/usr/share/nginx/html \
-p 8082:80 --name nginx_restored nginx:latest
```


## Refernce  

컨테이너 인프라 환경 구축을 위한 쿠버네티스/고커 (조훈, 심근우, 문성주 지음)  
[Docker Docs](https://docs.docker.com/)  
https://www.daleseo.com/docker-volumes-bind-mounts/  

