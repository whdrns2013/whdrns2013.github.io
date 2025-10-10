---
title: "[Harbor] 3. 계정 관리"
excerpt: "사용자 계정과 로봇 계정 그리고 관리자 계정"
date: 2025-05-02 03:25:00 +0900      # 작성일 (필수)
lastmod: 2025-05-02 03:25:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker_registry/harbor/03_harbor_account
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
sidebar:
  nav: "docs_docker_registry"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

<!--postNo: 20250502_002-->


## harbor 계정  

### harbor 계정의 종류  

harbor 의 계정 종류는 크게 다섯 가지로 나눠집니다.  

|역할(Role)|이미지 Pull|이미지 Push|프로젝트 설정 변경|멤버 관리|태그 삭제|웹훅/복제 설정|
|---|---|---|---|---|---|---|
|**Project Admin**|✅|✅|✅|✅|✅|✅|
|**Maintainer**|✅|✅|❌|❌|✅|✅|
|**Developer**|✅|✅|❌|❌|❌|❌|
|**Guest**|✅|❌|❌|❌|❌|❌|
|**Limited Guest***|✅ (일부 제한)|❌|❌|❌|❌|❌|

추가적으로 Robot Account 가 있는데, 이는 CI/CD 자동화에 쓰이는 전용 계정입니다.  

| 구분            | 설명                                                       |
| ------------- | -------------------------------------------------------- |
| 사용자 계정        | 실제 사용자가 사용하는 계정. 위 표와 같다.                                |
| Robot Account | CI/CD 자동화에 쓰이는 전용 계정.<br>Gitlab 과 같은 곳에 CI/CD 설정시에 사용한다. |

## 사용자 계정  

### 사용자 계정 만들기  

harbor 에 어드민 계정으로 로그인을 한 뒤, `관리 > 사용자` 메뉴에서 `새 사용자` 버튼을 클릭함으로써 사용자 계정을 생성할 수 있습니다.  

![](/assets/images/20250502_003_001.png)  

새 사용자 버튼을 누르면 아래와 같이 계정에 대한 정보를 입력하게끔 팝업창이 생성됩니다.  

![](/assets/images/20250502_003_002.png)  

### 관리자 설정  

`관리>사용자` 메뉴에서 생성한 사용자에게 관리자 권한을 줄 수도 있습니다.  

![](/assets/images/20250502_003_003.png)  



## Robot Account  

### Robot Account 생성  

`관리 > 로봇 계정` 메뉴에서 Robot Account 를 생성할 수 있습니다.  

![](/assets/images/20250502_003_004.png)  

로봇 계정은 추후 CI/CD 내용과 함께 다뤄보도록 하겠습니다.  

## Reference  

https://goharbor.io/docs/2.13.0/administration/managing-users/  

