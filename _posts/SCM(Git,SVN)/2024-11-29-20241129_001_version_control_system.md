---
title: 버전 관리의 개념과 버전 관리 소프트웨어  # 제목 (필수)
excerpt: 그리고 형상 관리에 대한 개념 한스푼 # 서브 타이틀이자 meta description (필수)
date: 2024-11-29 02:29:00 +0900     # 작성일 (필수)
lastmod: 2024-11-29 02:29:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-29 02:29:00 +0900   # 최종 수정일 (필수)
categories: VCS         # 다수 카테고리에 포함 가능 (필수)
tags: 버전관리시스템 버전관리 버전 관리 시스템 version control system 중앙 집중형 분산형 cvs svn mercurial bazzar git VCS SCM                      # 태그 복수개 가능 (필수)
classes:  wide       # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20241129_001-->



## 버전 관리 시스템 version control system  

![](/assets/images/20241129_001_003.png)

### 버전 관리의 개념  

버전 관리란 파일이나 여러 파일 집합의 변경 이력을 추적하고, 기록하며 관리하는 것을 뜻한다. 버전 관리를 통해 크게 세 가지 기능을 얻을 수 있다.  

(1) 과거 어떤 시점의 파일 내용을 확인  
(2) 파일의 상태를 과거의 특정 시점으로 되돌림  
(3) 누가 언제 어떤 내용을 수정했는지 확인  

### 버전 관리의 필요성  

문서나 프로그램을 작성할 때에는 한 번에 작성을 시작하여 완성하는 경우는 드물고, 계속적인 수정 작업을 거치면서 완성을 해 나가게 된다. 프로젝트를 수행하면서 문서 또는 프로그램 소스 등을 관리해야 하는데, 특히나 다수의 사람이 참여하고 수많은 프로그램과 산출물을 관리해야 하는 소프트웨어 프로젝트에서는 그러한 변경 이력 관리가 특히나 필요하다. 하지만 수많은 문서의 변경 사항을 수작업으로 관리하는 것은 불가능에 가깝고, 가능하다 하더라도 생산성이 극도로 떨어진다.  

버전 관리의 필요성과, 수작업을 통한 버전 관리의 극악의 효율성을 극복하고 소프트웨어 개발 프로젝트에서 협업시 변경사항의 충돌 등을 방지하고자을 문서나 소스 코드의 변경 이력을 자동으로 관리하는 버전 관리 소프트웨어 혹은 버전 관리 시스템이 등장하였다.  

### 버전 관리 시스템(소프트웨어)의 역사  

|시대&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|버전 관리 시스템&nbsp;&nbsp;&nbsp;&nbsp;|내용|
|---|---|---|
|1972년|SCCS|Source Code Control System. 벨 연구소에서 개발된 최초의 VCS. 파일의 변경 이력을 기록하고 기본적인 버전 관리를 제공.|
|1982년|RCS|Revision Control System. SCCS보다 효율적인 파일 관리와 저장 방식을 도입한 VCS. 처음엔 프로그램을 위해 개발됐으나, 텍스트 문서나 구성 파일에 적용해도 유용하다.|
|1990년|CVS|Concurrent Versions System. RCS를 기반으로, 여러 사용자가 동시에 작업할 수 있는 기능이 추가됨. 협업 가능 중앙 집중형 모델의 대표적 시스템.|
|2000년|BitKeeper|소스 코드의 분산 버전 관리를 위한 소프트웨어로, 처음에는 사유 소프트웨어로 개발되었지만 2016년 오픈 소스 소프트웨어로 출시되었다. 더 이상 개발되고 있지 않다.|
|2000년|SVN|Subversion. CVS의 단점을 보완하고자 개발된 중앙 집중형 VCS. 보다 신뢰성이 높고 기능이 강화되었다.|
|2005년|Git|리눅스 커널의 창시자인 리누스 토르발스가 BitKeeper의 라이선스 논란에 대한 대안으로 개발함. 속도와 효율성을 강조한 분산형 VCS의 대표 주자.|
|2005년|Mercurial|크로스 플랫폼 분산 버전 관리 도구로, 대부분 파이썬을 사용해 개발되었다. CLI 기반 프로그램이다.|
|2007년|Bazaar|우분투를 담당하고 있는 캐노니컬이 지원하는 분산 VCS. 자유 소프트웨어이다.|

<br>

## 버전 관리 시스템 유형 비교 (중앙집중형과 분산형)  

### 중앙집중형 버전 관리 시스템  

![](/assets/images/20241129_001_001.png)

- 모든 버전 기록과 파일이 중앙 서버에 저장되는 버전 관리 시스템  
- 클라이언트-서버 구조  

<br>

### 분산형 버전 관리 시스템  

![](/assets/images/20241129_001_002.png)

- 중앙 서버(원격 서버)에 원격지 저장소와 지역 컴퓨터에 저장되는 지역 저장소가 있는 버전 관리 시스템  
- 지역 저장소도 완전한 버전 관리 기능을 갖춘 저장소이므로, 각 로컬 저장소에서 독립적인 작업 가능  

<br>

### 중앙집중형과 분산형의 비교  

|구분|중앙집중형|분산형|
|---|---|---|
|저장소 위치|중앙 서버에만 존재|중앙 서버 : 원격 저장소<br>지역 컴퓨터 : 지역 저장소(클라이언트)|
|복사본 복사 방법|||
|장점|시스템 구조가 단순하여 관리가 쉽고 배우기 쉬움|중앙 서버에 문제가 생겨도 지역 저장소 소스로 복구 가능<br>여러 명이 동시에 작업하는 병렬 개발 가능<br>오직 풀(pull)과 푸시(push) 작업에만 인터넷이 필요<br>대부분의 작업을 지역 저장소에서 할 수 있음|
|단점|중앙 서버에 문제가 생기면 데이터 손실 가능성이 있음<br>지역 저장소가 없으므로, 모든 버전관리 작업을 네트워크에 의존함|중앙 집중형보다 버전관리가 복잡함<br>저장소간 동기화 문제가 발생할 가능성이 있음|
|대표 소프트웨어|CVS, SVN|Mercurial, Bazaar, Got|
|서버 의존성|높음|낮음|
|오프라인 작업 가능 여부|불가능|가능|
|속도|느림(온라인)|빠름(오프라인)|


## VCS와 SCM  

|구분|버전 관리 시스템|소프트웨어 형상 관리|
|---|---|---|
|full name|Virsion Control System<br>Source Code Management<br>Source Control Management|Software Configuration Management|
|약어|VCS (버전 관리 시스템)<br>SCM (소스 코드 관리)|SCM (소프트웨어 형상 관리)|
|관리 대상|소스 코드 파일과 변경 이력|소스 코드, 빌드 프로세스, 배포 환경 등 전반|
|목적|코드의 변경 사항 추적 및 협업|소프트웨어의 품질 보증 및 변경 관리|
|대표 시스템|Git SVN 등|Ansible, Chef 등|

<br>

SCM이라는 약어만을 가지고 봤을 때에는 혼동할 여지가 있다. VCS와 동일한 의미로 사용되는 Source Code Management 와 형상관리를 뜻하는 Software Configuration Management 의 약어가 동일하기 때문이다. 이 둘은 약어만 같을 뿐, 의미하는 것에는 차이가 있다.  

Source Code Management 는 소스코드 제어 시스템(Source Code Control System) 즉 1972년에 처음 나온 버전 관리 시스템과 같은 개념으로 쉽게 말해 버전 관리 시스템 (VCS) 와 동일한 개념이라고 보면 된다.  

Software Configuration Management 소프트웨어 형상 관리는 더 넓은 의미로, 개발, 빌드, 패키징, 배포 릴리스, 버그 추적, 소프트웨어 설정, 호스트/네트워크 설정, 다른 소프트웨어와의 상호 작용의 버전 설정 등과 이에 필요한 모든 프로세스를 포괄한다.  

정리하자면 Software Configuration System(SCM) 은 소프트웨어의 전반적인 부분을 모두 포함하여 관리하는 것을 의미하고, Virsion Control System 은 그보다 더 좁게 소스 코드만을 관리하는 시스템이라고 보면 된다.  

참고 : 버전 관리 시스템으로 꼭 소스코드만이 아닌, 문서들을 관리할 수도 있다.  
{: .notice--info}

## Reference  

[Wikipedia - RCS](https://ko.wikipedia.org/wiki/%EB%A6%AC%EB%B9%84%EC%A0%84_%EC%BB%A8%ED%8A%B8%EB%A1%A4_%EC%8B%9C%EC%8A%A4%ED%85%9C)  
[Wikipedia - CVS](https://ko.wikipedia.org/wiki/CVS)  
[Wikipedia - BitKeeper](https://ko.wikipedia.org/wiki/%EB%B9%84%ED%8A%B8%ED%82%A4%ED%8D%BC)  
[Wikipedia - Git](https://ko.wikipedia.org/wiki/%EA%B9%83_(%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4))  
[Wikipedia - Mercurial](https://ko.wikipedia.org/wiki/%EB%A8%B8%ED%81%90%EB%A6%AC%EC%96%BC)  
[Wikipedia - Bazaar](https://ko.wikipedia.org/wiki/Bazaar_(%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4))  
[stackoverflow - vcs and scm](https://stackoverflow.com/questions/4127425/whats-the-difference-between-vcs-and-scm)  
[엘레나의 스터디로그 - 형상관리와 버전관리](https://imgeeae.tistory.com/5)  