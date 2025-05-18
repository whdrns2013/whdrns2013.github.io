---
title: LINUX의 배포판 # 제목 (필수)
excerpt: 데비안 레드햇 우분투 centos rocky 여러 리눅스 배포판에 대해 알아보자 # 서브 타이틀이자 meta description (필수)
date: 2024-11-23 17:30:00 +0900      # 작성일 (필수)
lastmod: 2024-11-23 17:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-23 17:30:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux distribution 리눅스 배포판 데비안 debian 레드햇 redhat RHEL ubuntu 우분투 cent centos rocky suse 수세 slackware 슬랙웨어                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20241123_004-->

## 리눅스 배포판  

### 리눅스 배포판이란  

-배포판 : 커널 + 사용자 편의를 위한 개발자 도구, 편집기, 네트워킹 도구 등의 소프트웨어와 + 프로그램을 포함한 완전한 운영체제.  
-커널 : CPU와 메모리 등 자원의 관리, 프로세스 관리, 디스크와 주변장치 제어 등의 기능을 수행하는 운영체제의 핵심 부분.  
-리눅스 배포판의 분류 : 상업적 배포판(RHEL, SLE 등), 비상업적 배포판 (Fedora, Ubuntu, openSUSE, Debian 등)  

### 리눅스 배포판의 역사  

-1991년 : 리눅스 커널이 처음 개발됨  
-1992년 : 최초의 배포판 MCC Interim 과 SLS 배포판 발표됨  
-1993년 ~ : 주요 배포판이 발표되기 시작함  

## 주요 리눅스 배포판의 종류  

### 계열에 따른 분류  

|계열|배포판|
|---|---|
|RedHat 계열|RHEL<br>Fedora<br>CentOS<br>Rocky Linux<br>Oracle Enterprise Linux<br>Mandriva 등|
|Debian 계열|Debian<br>Ubuntu<br>Linux Mint 등|
|Slackware 계열|Slackware<br>SUSE<br>openSUSE 등|

현재는 크게 데비안 계열과 레드햇 계열의 배포판이 시장을 지배하고 있다.

### 주요 배포판 종류  

|배포판|설명|URL|계열|
|---|---|---|---|
|Red Hat Enterprise Linux|신뢰성과 안정성을 제공하는 상용 버전|redhat.com|RedHat|
|Oracle Enterprise Linux|RHEL의 오라클 버전|oracle.com|RedHat|
|Fedora|RHEL의 신기술 시험용|fedoraproject.org|RedHat|
|CentOS|RHEL의 무료 버전|centos.org|RedHat|
|Rocky Linux|CentOS의 대안 운영체제|rockylinux.org|RedHat|
|Mandriva|오랜 역사, 쉬운 설치와 사용|mandriva.com|RedHat|
|Debian|GNU의 공식 후원 리눅스|debian.org|Debian|
|Ubuntu|Debian의 개인용 버전|ubuntu.com|Debian|
|Linux Mint|Ubuntu 기반, 세련된 응용 제공|linuxmint.com|Debian|
|Slackware|현존 가장 오래된 배포판|slackware.com|Slackware|
|SUSE Linux Enterprise|유럽에서 주로 사용되는 상용 버전|novell.com/linux|Slackware|
|openSUSE|SUSE의 무료 버전|opensuse.org|Slackware|
|Gentoo|환경에 최적화된 설치 가능|gentoo.org||


## 주요 리눅스 배포판 소개  

### Debian 리눅스  

![](/assets/images/20241123_004_001.png)  

-Debian 프로젝트 : 자유 운영체제를 만들어가는 비영리 조직 (Ian Murdock 설립)  
-Debian 프로젝트에서 만들어진 운영체제를 Debian GNU/Linux 또는 Debian이라고 함  
-GNU 정신에 가장 충실한 배포판, GNU의 공식 후원을 받는 유일한 배포판  
-패키지 인스톨러 : apt-get  
-세 가지 릴리스  

|릴리스|설명|
|---|---|
|stable|안정화된 기능|
|unstable|새로운 기능이 추가된 새로운 버전|
|testing|unstable 테스트 용|

<br>

### RedHat 리눅스

![](/assets/images/20241123_004_002.png)  

-가장 널리 알려진 배포판  
-무상 배포판의 마지막 버전은 9로, 2003년 지원 중단 됨  
-무료 배포판의 유지와 개발을 Fedora라는 오픈소스 프로젝트에 이양함  
-이후 RedHat사는 RHEL(Red Hat Enterprise Linux)는 RedHat 사에서 지원하는 상용 엔터프라이즈 리눅스로, 최신 버전은 9  
-Fedora와 CentOS라는 오픈소스 프로젝트를 지원함  
-패키지 인스톨러 : RPM (Redhat Package Manager)  
-패키지가 인기 있던 이유는 <b><font color="008080">RPM의 존재와 기능</font></b> 으로, RPM은 바이너리, 설정파일, 라이브러리, 도큐먼트 등을 일괄 관리 가능하고, RPM 데이터베이스에서 패키지나 특정 파일이 검색 가능하고, 패키지에 필요한 파일과 의존성 유무 등을 조사하는 기능을 가지고 있다.  

<br>

### CentOS  

![](/assets/images/20241123_004_003.png)  

<i>[Centos-logo-2022.svg](https://commons.wikimedia.org/wiki/File:Centos-logo-2022.svg)</i>

-Community ENTerprise Operating System  
-RHEL의 소스 코드를 기반으로 만들어지는 무료 배포판  
-무료 정책과 커뮤니티 중심의 지원을 유지하기 위해 탄생함  
-Fedora에 비해 기능이 적지만, 안정적이라는 특징이 있음  
-서버용으로 많이 사용되고 있다.  
-2020년 12월 레드햇사는 RHEL의 <b><font color="008080">다운스트림 버전인 CentOS 개발 중단</font></b>  
-이후 레드햇사는 RHEL의 업스트림 버전인 CentOS Stream만 지원  

|용어|설명|
|---|---|
|다운스트림|안정화 버전을 토대로 만들어진 버전|
|업스트림|실험적인 개발용 버전|

<br>

### Rocky Linux  

![](/assets/images/20241123_004_004.png)  

-<b><font color="008080">CentOS의 대체 제품</font></b>   
-CentOS의 릴리스 정책이 변경됨에 따라 CentOS의 창립자인 그레고리 커처가 시작한 프로젝트  
-RHEL의 다운스트림 버전. RHEL과 실행 코드와의 호환성을 중시해 개발 및 유지보수 중.  
-2021년 6월 Rocky Linux 8.4 안정화 릴리스로 출시  
-Rocky : 초기 CentOS 공동 창립자인 록키 맥고를 기리기 위한 이름  
-록키 엔터프라이즈 소프트웨어 재단(RESF)에서 개발과 유지관리를 수행  
-목표 : 엔터프라이즈 환경에서 무료로 안정적이고 신뢰성 있는 운영 환경 제공  

<br>

### SuSE  

![](/assets/images/20241123_004_005.png)  

-Software Und System Entwicklung  
-독일에서 만든 배포판으로, 유럽에서 가장 인기 있음.  
-가장 오래된 상용 배포판.  
-SlackWare 리눅스로부터 파생된 리눅스.  
-풍부한 기능과 안정성, 보안 기능이 포함됨  
-설치와 설정 도구가 제공되어, 초보자도 쉽게 리눅스를 업그레이드하고 패키지를 관리할 수 있음.  
-Novell 사에 의해 지원되고 있음.  
-커뮤니티가 주도하는 openSUSE 프로젝트가 별도 운영되어, 무료 버전을 제공하고 있음.  

<br>

### Slackware  

![](/assets/images/20241123_004_006.png)  

-현존하는 가장 오래된 배포판이며, 가장 먼저 대중화된 배포판.  
-다른 리눅스 배포판의 기초가 되었다.  
-1992년 Patric Volkerding에 의해 시작됨.  
-1992년 당시 SLS Linux를 사용하다가, 버그가 많아 동료들과 함께 새로운 배포판을 만듦  
-간결함을 설계 철학으로 하는(KISS principle) 최초의 유닉스 정신과 가장 가까운 배포판.  
-GUI 버전이 없다.  
-유닉스 학습에 가장 적합한 배포판.  
-패키지 업그레이드와 관리 기능이 취약해 인기가 떨어지고 있다.  

<br>

### Ubuntu  

![](/assets/images/20241123_004_007.png)  

-Debian 리눅스로부터 파생된 배포판.  
-영국 기반의 Canonical의 지원을 받고 있음.  
-2004년 처음 발표, 6개월마다 새로운 버전을 발표하고 있다.  
-데스크톱 환경 Unity를 제공했으나, 최근 다시 GNOME을 사용  
-Debian 리눅스에 비해 사용 편의성에 중점을 둔 배포판임.  
-<b><font color="008080">개인 사용자에게 가장 인기 있는</font></b>  리눅스 배포판 중 하나.  

|리눅스|차이점|
|---|---|
|Debian|매우 안정적이고 보수적인 배포판. 주로 서버용으로 사용됨.|
|Ubuntu|사용자 친화적, 빠른 개발 주기|

<br>

## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
[wikipedia - UNIX](https://ko.wikipedia.org/wiki/%EC%9C%A0%EB%8B%89%EC%8A%A4)  
[Centos-logo-2022.svg](https://commons.wikimedia.org/wiki/File:Centos-logo-2022.svg)  