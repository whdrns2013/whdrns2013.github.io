---
title: 리눅스 파일 시스템 탐색 방법 # 제목 (필수)
excerpt: ls, pwd, cd 등 기본적인 파일 탐색 명령어를 알아보자 # 서브 타이틀이자 meta description (필수)
date: 2024-11-24 18:16:00 +0900      # 작성일 (필수)
lastmod: 2024-11-24 18:16:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-24 18:16:00 +0900   # 최종 수정일 (필수)
categories: Linux        # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 파일시스템 파일 ls pwd cd 탐색 경로                     # 태그 복수개 가능 (필수)
classes: wide       # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20241124_011-->

## 파일 시스템  

### 파일 시스템의 정의  

- 운영체제가 디스크나 파티션 상에 파일들을 구성하는 방식  
- 파일과 디렉터리의 집합을 구조적으로 관리하는 체계  
- 리눅스는 전체 파일 시스템을 1개의 트리 구조로 관리한다.  

**1개의 트리 구조의 의미**  
전체 파일 시스템을 1개의 트리 구조로 관리한다.  
=> 루트(/) 디렉터리는 1개만 존재할 수 있다.  
이와 달리 윈도우 운영체제는 드라이브마다 루트 디렉터리가 존재한다. (C:/, D:/)
{: .notice--info}  

### 리눅스에서 파일의 종류  

ls -l 명령의 결과에서 각 라인의 가장 처음에 등장하는 문자는 파일의 종류를 나타낸다.  

|파일의 종류|설명|
|---|---|
|정규 파일|- 데이터를 저장하는 데 주로 사용되는 파일<br>- 대부분의 파일이 이 정규 파일에 해당한다.<br>- 텍스트 파일, 실행 파일, 이미지 파일 등<br>- 바이너리 파일 : 실행 파일이나 이미지 파일 등. 이들은 바이너리 형태로 저장됨|
|디렉터리|- 리눅스에서는 디렉터리도 파일로 취급한다.<br>- 디렉터리는 디렉터리에 저장된 파일이나 하위 디렉터리에 대한 정보가 저장된 파일임.|
|심볼릭 링크|- 윈도우의 바로가기와 같은 것으로,<br>- 절대경로나 상대경로를 사용해 다른 파일이나 디렉터리를 가리키는 파일<br>- 소프트링크라고도 한다.|
|장치 파일|- 리눅스에서는 각종 주변 장치를 파일로 취급하여 인터페이스를 제공한다.<br>- 블록 디바이스 파일과 문자 디바이스 파일로 구분된다.|
|블록 디바이스 파일|- 블록 단위로 데이터를 읽고 쓸 수 있는 디바이스인 블록 디바이스<br>- 이러한 블록 디바이스에 인터페이스를 제공하는 것이 블록 디바이스 파일<br>- 하드디스크나 CD-ROM 같은 것들이다.|
|문자 디바이스 파일|-한 번에 한 문자(바이트)씩 데이터를 주고받을 수 있는 디바이스<br>-이러한 디바이스에 인터페이스를 제공하는 것이 문자 디바이스 파일이다.<br>- 시리얼 포트, 병렬 포트, 터미널 등이 문자 디바이스에 해당함.|
|파이프 디바이스 파일|- 프로세스 간 통신을 위한 특수한 파일<br>- 문자 디바이스와 유사하나, 실제 디바이스와 연결된 것은 아니고<br>- 입력을 요구하는 프로세스와 출력을 제공하는 프로세스와 연결된다.|
|소켓 디바이스 파일|소켓 : 한 호스트 안에서 프로세스 간 통신의 목적으로 사용되는 인터페이스|


## 파일 시스템 탐색 방법  

리눅스 파일 시스템 탐색에 사용되는 명령어는 ls, file, pwd, cd 등의 명령이 있다.  

|명령어|설명|
|---|---|
|ls|디렉터리의 내용을 출력하는(목록을 나열하는) 명령어|
|file|파일의 종류를 알려주는 명령어|
|pwd|현재 작업 디렉터리를 절대 경로 방식으로 알려주는 명령어|
|cd|작업 디렉터리를 이동하는 명령어|

### ls  

- 기본 사용법 : `ls [options] [names:디렉터리명]`  
- 디렉터리 안의 파일과 서브디렉터리 목록을 나열하는 명령  
- 옵션에 따라 파일과 디렉터리의 속성도 확인할 수 있음  
- 한 번에 여러 개의 디렉터리를 인수로 가질 수도 있다.  
- 출력의 기본은 이름의 알파벳 순서이다.  

|짧은 옵션|긴 옵션|설명|
|---|---|---|
|-a|--all|숨김 파일을 포함하여 모든 파일을 보여준다.|
|-d|--directory|디렉터리 자체에 대한 정보를 보여준다.|
|-F|--classify|파일의 종류를 알려주는 문자를 오른쪽에 붙여 보여준다.<br>실행 파일 : *, 디렉터리 : /, 심벌릭링크 : @|
|-h|--human-readable|파일의 크기를 바이트가 아닌 human-readable로 변경해서 출력|
|-i|--inode|왼쪽에 inode 번호를 보여줌|
|-l|--format=long|긴 포맷으로 결과를 보여줌|
|-r|--reverse|역순으로 결과를 보여줌<br>기본이 알파벳순이니, 알파벳 역순으로 출력|
|-R|--recursive|재귀적 수행, 서브디렉터리의 내용도 나열된다.|
|-S|--sort=size|파일의 크기 순서로 출력한다.|
|-t|--sort=time|최종 수정시간 순서로 출력한다.|

```bash
ls
>> docker          docker_mounts  script.sh
>> docker-compose  installation

ls -a
>> .              .bashrc     docker
>> ..             .config     docker-compose
>> .bash_history  .lesshst    docker_mounts
>> .bash_logout   .ssh        installation
>> .bash_profile  .wget-hsts  script.sh

ls -al
>> drwx------.  8 user user  4096 Nov 24 18:00 .
>> drwxr-xr-x.  3 root root    22 Sep 10 01:20 ..
>> -rw-------.  1 user user 19084 Nov 24 16:55 .bash_history
>> -rw-r--r--.  1 user user    18 Jan 24  2023 .bash_logout
>> -rw-r--r--.  1 user user   141 Jan 24  2023 .bash_profile
>> -rw-r--r--.  1 user user   511 Nov 24 17:59 .bashrc
>> drwx------.  3 user user    20 Sep 23 09:38 .config
>> -rw-------.  1 user user    20 Nov 24 15:11 .lesshst
>> drwx------.  2 user user    29 Sep 10 23:52 .ssh
>> -rw-r--r--.  1 user user   183 Nov 11 00:35 .wget-hsts
>> drwx--x---. 12 root root   171 Nov 17 11:59 docker
>> drwxr-xr-x.  3 user user    59 Oct 26 23:17 docker-compose
>> drwxr-xr-x.  7 user user    97 Oct 26 21:48 docker_mounts
>> drwxr-xr-x.  3 user user    24 Oct 26 22:03 installation
>> ---x--x---.  1 user user     7 Oct  9 18:07 script.sh

ls -F
>> docker/          docker_mounts/  script.sh*
>> docker-compose/  installation/

ls -R
>> 아래 있는 모든 디렉터리 재귀적으로 출력
```

### ls -l 명령의 해석  

```bash
ls -l
>> drwx--x---. 12 root root   171 Nov 17 11:59 docker
>> drwxr-xr-x.  3 user user    59 Oct 26 23:17 docker-compose
>> drwxr-xr-x.  7 user user    97 Oct 26 21:48 docker_mounts
>> drwxr-xr-x.  3 user user    24 Oct 26 22:03 installation
>> ---x--x---.  1 user user     7 Oct  9 18:07 script.sh
```

|필드|설명|
|---|---|
|첫 번째 문자|- 파일의 종류를 나타내는 문자<br>- 대시(-) : 정규 파일<br>- d : 디렉터리<br>- l : 심벌릭 링크<br>- b : 블록 디바이스<br>- c : 문자 디바이스<br>- p : 파이프 디바이스<br>- s : 소켓|
|rwx--x---|- 파일의 접근 권한|
|12, 3 ...|- 하드 링크의 수|
|root|파일 소유자의 계정|
|root|파일 소유 그룹의 계정|
|171|바이트 단위의 파일 크기|
|Nov 17 11:59|파일이 최종 수정된 날짜와 시간|
|docker|파일 또는 디렉터리의 이름|


### file  

- 파일의 종류를 알려주는 명령  

```bash
file docker
>> docker: directory

file script.sh
>> script.sh: executable, regular file, no read permission

file /dev/nvme0
>> /dev/nvme0: character special

file /dev/vcs
>> /dev/vcs: character special
```

### pwd  

- 현재 작업 디렉터리를 절대 경로 방식으로 출력하는 명령  

```bash
pwd
>> /dev
```

### cd  

- `cd [디렉터리]` 와 같은 방식으로 사용  
- 작업 디렉터리를 이동하는 명령  
- 디렉터리를 지정하지 않는 경우 사용자의 홈 디렉터리로 이동함.  

```bash
cd /usr/bin
# > 바이너리 파일 디렉터리로 이동함

cd /dev
# > 장치 디렉터리로 이동함

cd
# > 사용자 홈 디렉터리로 이동함
```

## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  