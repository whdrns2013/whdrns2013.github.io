---
title: 리눅스 파일 및 디렉터리 접근권한 설정 # 제목 (필수)
excerpt: 파일 및 디렉터리에 대한 접근 권한 개녕, 그리고 접근 권한 수정 방법 # 서브 타이틀이자 meta description (필수)
date: 2024-11-24 20:31:00 +0900      # 작성일 (필수)
lastmod: 2024-11-24 20:31:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-24 20:31:00 +0900   # 최종 수정일 (필수)
categories: [Blogging, Demo]         # 다수 카테고리에 포함 가능 (필수)
tags: 리눅스 linux 접근권한 chmod chown umask rwx                     # 태그 복수개 가능 (필수)
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20241124_013-->


## 파일과 디렉터리의 접근 권한  

### 리눅스에서의 접근 권한  

-사용자 및 그룹에 따라 접근할 수 있는 파일 및 디렉터리를 제한  
-이로써 보안성 강화, 시스템에 대한 접근 제한으로 운영 안정성  
-총 9개의 비트로 이루어져있으며, 소유자, 소유자그룹, 이외 사용자에 대한 권한 관리를 한다.  

![](/assets/images/20241124_013_001.png)

|접근 권한|설명|8진수 표현법|
|---|---|---|
|rwx|읽기, 쓰기, 실행 권한|7 (4 + 2 + 1)|
|rw-|읽기와 쓰기 권한|6 (4 + 2 + 0)|
|r-x|읽기와 실행 권한|5 (4 + 0 + 1)|
|r--|읽기 권한|4 (4 + 0 + 0)|
|-wx|쓰기와 실행 권한|3 (0 + 2 + 1)|
|-w-|쓰기 권한|2 (0 + 2 + 0)|
|--x|실행 권한|1 (0 + 0 + 1)|
|---|권한 없음|0 (0 + 0 + 0)|

### 파일과 디렉터리의 접근 권한  

읽기, 쓰기, 실행 권한은 아래와 같다.  

|접근권한|파일|디렉터리|
|---|---|---|
|읽기|- 파일의 내용을 볼 수 있다.|- 디렉터리 내 파일과 서브디렉터리 목록 볼 수 있음.|
|쓰기|- 파일의 내용 수정<br>- 파일의 이름 수정<br>- 파일 삭제 가능|- 디렉터리 내 파일이나 서브디렉터리 생성 가능<br>- 디렉터리 내 파일 및 서브디렉터리 삭제 가능|
|실행|- 파일 실행 가능|- 디렉터리 또는 서브디렉터리로 cd명령으로 이동 가능<br>디렉터리에서 프로그램 실행 가능<br>파일의 메타 데이터에 접근 가능|



## 권한 설정  

### chmod  

#### 명령어 설명  

파일의 소유자가 파일의 접근 권한을 변경하는 명령어. chande mode 의 약자이다.  

#### 기본 사용법  

```bash
chmod [options] mode files  # (1) 
chmod -r [options] mode dir # (2)
```

(1) 파일들의 접근권한을 변경  
(2) 디렉터리에 포함된 모든 파일과 서브 디렉터리까지 권한 변경  

#### 옵션  

|옵션|full name|설명|
|---|---|---|
|[대상]+[권한]||- [대상]에게 [권한]을 추가|
|[대상]-[권한]||- [대상]에게 [권한]을 제거|
|[대상]=[권한]||- [대상]의 권한을 [권한]으로 지정|
|a+[권한]||- 전체에게 [권한]을 추가|
|a-[권한]||- 전체에게 [권한]을 제거|
|a=[권한]||- 전체의 권한을 [권한]으로 지정|

#### 예시  

```bash
ls -al
>> -rw-r--r--. 1 user user    0 Nov 24 20:10 test.txt

chmod 777 ./test.txt
ls -al
>> -rwxrwxrwx. 1 user user    0 Nov 24 20:10 test.txt

chmod 755 ./test.txt
ls -al
>> -rwxr-xr-x. 1 user user    0 Nov 24 20:10 test.txt

chmod 444 ./*
ls -al
>> -r--r--r--. 1 user user    0 Nov 24 20:10 test.txt

chmod ug+w ./test.txt
ls -al
>> -rw-rw-r--. 1 user user    0 Nov 24 20:10 test.txt

chmod a-wx ./*
ls -al
>> -r--r--r--. 1 user user    0 Nov 24 20:10 test.txt
```


### umask  

#### 명령어 설명  

파일이나 디렉터리 기본 접근권한을 출력하거나 설정하는 명령어  
보통 umask에 대한 내용은 /etc/bashrc 에 저장됨  

#### 기본 사용법  

```bash
umask [options] [mask]    # (1)
umask                     # (2)
```

(1) 파일이나 디렉터리 기본 접근권한을 설정  
-umask의 mask는 "가리다"의 의미를 가지고 있다.  
-chmod가 권한을 "추가" 하는 것이었다면, umask는 권한을 "가리는" 의미이다.  
-예시로, chmod 002면 other 사용자에게만 write 권한이지만,  
-umask 002면 user, group 은 전체권한, other 에게만 읽기쓰기 권한을 주는 것이다.  
-또한 디렉터리의 기본 권한은 777로 시작하지만, 파일의 기본 권한은 666에서부터 시작한다.  
-기본 umask 값은 002  

(2) 현재 접근권한 기본값 출력
-S 옵션을 사용할 경우 기호 모드로 출력됨

**umask 주의사항**
-umask 는 권한 획득이 아니라 권한 상실의 의미로 사용된다.  
-따라서 umask 뒤에 부여되는 [mask]는 "상실하는 권한" 이 된다.  
-디렉터리는 기본 777 권한에서부터, 파일은 기본 666 권한에서부터 시작한다.  
{: .notice--danger}

#### 옵션  

|옵션|full name|설명|
|---|---|---|
|-S||권한을 8진수가 아닌 기호 모드로 보여줌|

#### 예시  

```bash
umask
>> 0022

umask -S
>> u=rwx,g=rx,o=rx

umask 002
umask
>> 0002
umask -S
>> u=rwx,g=rwx,o=rx
```

### chown

#### 명령어 설명  

-r<b><font color="FF82B2">oot 사용자가</font></b> 파일이나 디렉터리의 소유자 또는 소유 그룹을 변경하는 명령.  
-기본적으로 파일이나 디렉터리를 생성할 때에는 생성한 사용자와 사용자가 속한 그룹이 해당 파일 혹은 디렉터리의 소유자, 소유그룹이 된다.  

#### 기본 사용법  

```bash
chown [options] newowner[:group] files  # (1)
```

-소유자 명시하고 그룹 생략시 : 소유자를 변경하고, 그룹을 소유자와 같은 그룹으로 변경  
-소유자 생략하고 그룹만 명시 : 그룹만 변경  
-소유자와 그룹 모두 명시 : 소유자와 그룹 모두 변경  

#### 옵션  

|옵션|full name|설명|
|---|---|---|
|-R||디렉터리에 chown 명령어를 사용할 경우 디렉터리의 하우 파일 및 디렉터리들에 재귀적으로 적용|


## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  