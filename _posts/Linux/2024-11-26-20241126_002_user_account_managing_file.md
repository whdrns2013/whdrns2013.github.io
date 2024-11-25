---
title: 리눅스 사용자 계정 관리 파일 # 제목 (필수)
excerpt: passwd skel shadow 등 사용자 관리와 관련된 파일들  # 서브 타이틀이자 meta description (필수)
date: 2024-11-26 01:57:00 +0900      # 작성일 (필수)
lastmod: 2024-11-26 01:57:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-26 01:57:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 사용자 계정 관리 파일 useradd passwd shadow skel                     # 태그 복수개 가능 (필수)
classes: wide      # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20241126_002-->

## 사용자 계정 관리 파일  

|파일|설명|
|---|---|
|/etc/login.defs|사용자 계정 생성시 필요한 설정의 기본값을 정의한 파일|
|/etc/default/useradd|사용자 계정 생성 명령어인 useradd의 실행 파일|
|/etc/passwd|사용자 계정에 관련된 정보를 가진 텍스트 파일<br>암호, UID, GID, 설명, 홈디렉토리, 기본셸 등의 정보를 가진다.|
|/etc/shadow|사용자 계정의 암호와 패스워드 에이징 정보를 가진 파일<br>패스워드 에이징 : 비밀번호 변경 기간 및 만료 관련|
|/etc/group|그룹 계정에 관련된 정보를 가진 텍스트 파일<br>그룹이름, 그룹비밀번호, GID, 구성원 리스트 등의 정보를 가진다.|
|/home/<username>|생성되는 사용자의 홈 디렉토리 경로|
|/etc/skel|사용자 홈 디렉터리가 생성될 때 기본으로 생성될 파일들의 원본을 가진 디렉터리|


### /etc/login.defs  

-사용자 계정을 생성할 때 필요한 기본값을 정의한 파일  

|주요 항목|설명|
|---|---|
|UID_MIN|자동 할당 할 uid(유저 아이디) 값 중 최소 값|
|UID_MAX|자동 할당 할 uid(유저 아이디) 값 중 최대 값|
|GID_MIN|자동 할당 할 gid(그룹 아이디) 값 중 최소 값|
|GID_MAX|자동 할당 할 gid(그룹 아이디) 값 중 최대 값|
|USERGROUPS_ENAB|사용자 계정과 같은 이름의 그룹을 자동으로 만들지 여부|
|UMASK|기본 권한|
|HOME_MODE|홈 디렉터리 권한 모드 (0ugo) u, g, o 에는 각각 팔진수 권한을 넣어주면 됨|
|CREATE_HOME|홈 그룹을 자동으로 생성할지 여부|


### /etc/default/useradd  

-useradd 명령이 참조하는 기본값을 설정한 파일  

```bash
# useradd defaults file
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel
CREATE_MAIL_SPOOL=yes
```

|항목|설명|
|---|---|
|GROUP|login.defs에 자동 생성이 꺼져있을 때, 사용자의 주 그룹으로 할당될 그룹을 지정|
|HOME|홈 디렉터리의 생성 위치 지정|
|INACTIVE|0 : 비밀번호 만료 후 즉시 계정 비활성화<br>-1 : 만효 후 계정 비활성화 기능 사용하지 않음|
|EXPIRE|계정의 만료일 기본값.<br>값이 없으면 계정의 만료일이 없는 것|
|SHELL|기본 셸의 종류 지정|
|SKEL|skel 디렉터리의 위치|
|CREATE_MAIL_SPOOL||


### /etc/passwd  

-사용자 계정에 관한 정보를 가진 텍스트 파일  
-라인 별로 사용자 계정의 정보가 저장된다.  
-직접 수정은 권장되지 않는다. 명령어로 수정하는 것이 권장된다.  
-각 라인은 콜론(:) 으로 구분되는 7개의 필드를 가진다.  

```bash
cat /etc/passwd | grep tu_01
>> tu_01:x:1001:1002::/home/tu_01:/bin/bash
>> 사용자계정:암호:uid:gid:설명:홈디렉터리:기본셸
```

### /etc/shadow  

-사용자 계정의 암호 정보를 가짐  
-사용자 계정의 패스워드 에이징(비밀번호 변경 기간 및 계정 만료 일자 관련) 정보를 가짐  

```bash
cat /etc/shadow | grep tu_01
tu_01:abcdef:20052:0:99999:7:10:20054:
```

|항목|예시값|설명|
|---|---|---|
|1번|tu_01|사용자 계정|
|2번|abcdef|암호화된 비밀번호|
|3번|20052|최종 비밀번호 변경일 (1970.01.01 부터 지난 일수)|
|4번|0|비밀번호 변경 후 재변경이 금지되는 기간|
|5번|99999|비밀번호 변경 후 다시 변경하지 않고 사용할 수 있는 기간|
|6번|7|비밀번호 만료일 전에 경고를 보내는 날짜 수|
|7번|10|비밀번호 만료 후 로그인이 가능한 날짜 수|
|8번|20054|사용자 계정의 만료일. 빈 값인 경우 계정 만료일이 없는 것|
|9번||예약 필드|


### /etc/group  

-그룹 계정의 정보를 가진 텍스트파일  
-라인마다 그룹 계정의 정보가 저장된다.  
-라인은 콜론(:)으로 구분되는 4개의 필드를 가진다.  
-자세한 내용은 그룹 관리 파일 포스트에서 다시 다룬다.  

### /etc/skel  

-사용자 홈 디렉터리에 복사되는 파일들을 가진 폴더  
-.bashrc, .bash_profile, .bash_logout 과 같은 파일이 있다.  
-`skeleton`의 약자로, 뼈대가 되는 폴더라는 뜻을 가지고 있다.  

```bash
ls -al /etc/skel

>> drwxr-xr-x.  2 root root   62 Sep 18 11:08 .
>> drwxr-xr-x. 91 root root 8192 Nov 26 01:40 ..
>> -rw-r--r--.  1 root root   18 Apr 30  2024 .bash_logout
>> -rw-r--r--.  1 root root  141 Apr 30  2024 .bash_profile
>> -rw-r--r--.  1 root root  492 Apr 30  2024 .bashrc

```

## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
