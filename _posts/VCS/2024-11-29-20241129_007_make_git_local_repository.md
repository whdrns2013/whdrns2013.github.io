---
title: git 깃 저장소 만들기와 .git 살펴보기  # 제목 (필수)
excerpt: 깃 저장소를 만드는 방법. 그리고 그 안에는 뭐가 들어있을까? # 서브 타이틀이자 meta description (필수)
date: 2024-11-29 15:00:00 +0900      # 작성일 (필수)
lastmod: 2024-11-29 15:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-29 15:00:00 +0900   # 최종 수정일 (필수)
categories: VCS        # 다수 카테고리에 포함 가능 (필수)
tags: 깃 저장소 지역 repository 디렉터리 만들기                     # 태그 복수개 가능 (필수)
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20241129_007-->


## 깃 저장소  

### 저장소로 사용할 디렉터리(폴더) 생성하기  

깃으로 버전 관리를 하려면, 먼저 특정 작업 디렉터리를 `깃 저장소`로 지정해야 한다. GUI 환경인 경우 특정 폴더를 만들면 되고, 리눅스의 경우에는 mkdir 명령어를 통해 저장소로 사용할 작업 디렉터리를 생성해준다.  

```bash
mkdir ./git_local
```

### 깃 저장소로 만들기  

디렉터리를 깃 저장소로 만들 때에는 `git init` 명령어를 사용한다. 셸을 사용하여 생성한 디렉토리로 이동한 뒤 `git init` 명령어를 사용한다.  

|명령어|설명|
|---|---|
|`git init`|현재 디렉터리를 깃 저장소로 만든다.|
|`git init /path/of/dir`|지정한 디렉터리를 깃 저장소로 만든다.|

```bash
# git_local 디렉터리로 이동
cd ./git_local

# 디렉터리 파일 확인
ls -al
>> total 0 # 없음

# git init
git init
>> Initialized empty Git repository in ~/git_local/.git/

# 디렉터리 확인
ls -al
>> drwxr-xr-x. 7 user user  119 Nov 29 14:47 .git # 숨김 디렉터리
```

### .git 디렉터리  

`git init` 명령어를 통해 디렉터리를 깃 저장소로 만들면, `.git`디렉터리가 생성된다. `.git`디렉터리에는 저장소의 소스, 여러 가지 변경 이력 등을 저장하고 있다.  

```bash
cd ./.git
ls -al

>>
-rw-r--r--. 1 user user   21 Nov 29 14:47 HEAD
drwxr-xr-x. 2 user user    6 Nov 29 14:47 branches
-rw-r--r--. 1 user user   92 Nov 29 14:47 config
-rw-r--r--. 1 user user   73 Nov 29 14:47 description
drwxr-xr-x. 2 user user 4096 Nov 29 14:47 hooks
drwxr-xr-x. 2 user user   21 Nov 29 14:47 info
drwxr-xr-x. 4 user user   30 Nov 29 14:47 objects
drwxr-xr-x. 4 user user   31 Nov 29 14:47 refs
```

|파일/디렉터리|설명|역할 및 내용|
|---|---|---|
|HEAD|현재 체크아웃된 브랜치 정보|현재 작업 중인 브랜치를 가리키는 포인터<br>ex. ref:refs/heads/main|
|branches||현재는 잘 사용되지 않는 디렉터리. 대체로 비어있음.<br>과거에는 추가적인 브랜치 정보를 저장하던 디렉터리<br>현재는 refs/heads 와 /refs/remotes 디렉터리가 대신함|
|config|git 설정 파일|저장소의 로컬 설정이 정의된 파일|
|description|저장소 설명 파일|Bare 저장소에서 사용되는 설명|
|hooks|훅 스크립트 디렉터리|특정 git 이벤트에서 실행되는 스크립트<br>ex pre-commit, post-merge|
|info|추가 정보 디렉터리|무시 패턴(exclude) 등 추가 정보 파일을 포함함|
|objects|git 객체 데이터를 포함한 디렉터리|커밋, 트리, 블롭, 태그 등 git의 모든 데이터 객체를 저장|
|refs|레퍼런스 정보|브랜치(refs/heads), 태그(refs/tags), 원격 브랜치(refs/remotes) 포인터 저장|

## Reference  

[UNIX시스템 - 김희천,김진욱 저](https://search.shopping.naver.com/book/catalog/41474371650)  