---
title: "[GitOps] 3. GitLab - Docker Registry (Harbor) 연결하기" # 제목 (필수)
excerpt: 깃랩과 도커 레지스트리를 연결해보자 # 서브 타이틀이자 meta description (필수)
date: 2025-05-16 00:40:00 +0900      # 작성일 (필수)
lastmod: 2025-05-16 00:40:00 +0900   # 최종 수정일 (필수)
permalink: /docs/gitops/03_connect_gitlab_harbor/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
classes: wide
sidebar:
  nav: "docs_gitops"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

<!--postNo: 20250516_001-->

## Docker Registry 에 Project 생성  

gitlab 의 프로젝트와 연결할 docker registry 의 project 를 생성해줍니다.  

![](/assets/images/20250516_001_001.png)  

프로젝트 이름을 적고, 프로젝트 설정을 진행합니다. Project quota limits 는 프로젝트에서 사용할 수 있는 저장 공간 제한이고, -1 은 무제한을 뜻합니다.  

![](/assets/images/20250516_001_002.png)  

이제 이 프로젝트에 이미지를 Push 할 수 있고, 저장된 이미지를 Pull 할 수도 있습니다.  

![](/assets/images/20250516_001_003.png)  



## Docker Registry 에 Robot Account 생성  

### Robot Account  

Harbor에서 생성할 수 있는 특수한 계정 유형으로, 사람이 직접 로그인하는 것이 아닌 자동화된 시스템이나 CI/CD 파이프라인이 Harbor 레지스트리에 접근할 수 있도록 만들어진 비인간 사용자 계정입니다.  

#### 주요 특징  

- 프로젝트 단위로 생성됨 (global 이 아니고, 프로젝트에 귀속됨)  
- 사용자 이름은 robot$ 접두사로 시작됨 (e.g. robot$ci-runner)  
- 레지스트리 인증을 위한 토큰(Access token)이 발급됨  
- 읽기, 쓰기 등 세부 권한을 부여할 수 있음  
- Web UI 로그인은 불가능하며, Docker CLI 나 API 호출에만 사용됨  

#### 사용 예시  

- GitLab CI/CD 에서 이미지 푸시/풀  
- 자동 백업 스크립트에서 이미지 복제 시  
- 다른 시스템에서 이미지 상태 확인 시  

#### 사용 이유  

- 보안상 이점 : 최소 권한 원칙, 사용 기간 지정 가능, 사용자 계정보다 노출 위험 낮음  

### Robot Account 만들기  

#### Robot Account 만들기  

![](/assets/images/20250516_001_004.png)  

접속 > Administration > Robot Accounts > New Robot Account  

![](/assets/images/20250516_001_005.png)  

계정 기본정보 입력  

#### System 권한 설정하기  

![](/assets/images/20250516_001_006.png)  

이 계정의  harbor 시스템적인 권한  

#### Project 권한 설정하기  


![](/assets/images/20250516_001_007.png)  

프로젝트별로 권한 설정. 여기서 PERMISSIONS 를 누르면

![](/assets/images/20250516_001_008.png)  

해당 프로젝트에 대한 권한을 설정할 수 있음.  

![](/assets/images/20250516_001_009.png)  

권한 설정까지 완료됐다면 FINISH

![](/assets/images/20250516_001_010.png)  

### System Permission  

Robot Account 의 시스템 권한은 아래와 같습니다.  

| No. | 카테고리 이름                 | 설명                                                     | CI/CD 관련 |
| --- | ----------------------- | ------------------------------------------------------ | -------- |
| 1   | **Audit Log**           | Harbor의 이벤트 및 사용자 활동 로그를 조회하는 기능                       |          |
| 2   | **Catalog**             | Harbor에 저장된 전체 artifact 목록을 검색 및 탐색                    |          |
| 3   | **Garbage Collection**  | 사용되지 않는 artifact 데이터를 정리해<br>저장소 공간 확보                 |          |
| 4   | **Job Service Monitor** | 백그라운드 작업(Job)의 상태를 모니터링하는 기능<br>(예: 복제, 스캔 등)          |          |
| 5   | **Label**               | 전역 라벨(artifact태그) 생성,수정,삭제 등<br>메타데이터 관리               |          |
| 6   | **LDAP User**           | LDAP 서버의 사용자 계정을 검색하고 조회                               |          |
| 7   | **Preheat Instance**    | 콘텐츠 전송 최적화를 위한 Preheat 인스턴스 관리<br>(캐시 서버 등)            |          |
| 8   | **Project**             | 프로젝트 생성, 삭제, 설정 변경 등 전역 수준<br>프로젝트 관리                  | ★        |
| 9   | **Purge Audit**         | 감사 로그를 정리(삭제)하여 저장소 공간을 확보                             |          |
| 10  | **Quota**               | 프로젝트/사용자별 저장소 할당량(Quota)을<br>조회 및 설정                   |          |
| 11  | **Registry**            | 외부 컨테이너 레지스트리 등록 및 설정 관리<br>(예: Docker Hub, AWS ECR 등) |          |
| 12  | **Replication**         | 복제 작업(이미지/아티팩트 전송) 실행 제어                               |          |
| 13  | **Replication Adapter** | 복제 가능한 외부 시스템(어댑터) 목록 조회<br>(예: Helm, GitHub 등)        |          |
| 14  | **Replication Policy**  | 이미지 복제 규칙(정책) 생성, 수정, 삭제 등 관리 기능                       | ★        |
| 15  | **Robot Account**       | 시스템 전역 또는 프로젝트 내 로봇 계정 생성 및 관리                         | ★        |
| 16  | **Scan All**            | Harbor 내 모든 이미지에 대해 일괄 보안 스캔을 실행                       | ★        |
| 17  | **Scanner**             | 이미지 취약점 스캐너 설정 및 관리<br>(예: Trivy 등과의 연동 포함)            | ★        |
| 18  | **Security Hub**        | Harbor의 보안 관련 보고서나 분석 데이터 열람<br>(보안 대시보드 포함)           |          |
| 19  | **System Volumes**      | Harbor 시스템 리소스 상태 조회<br>(예 : 디스크 공간 사용량)               |          |
| 20  | **User**                | 사용자 계정 생성, 수정, 삭제, 목록 조회 등 사용자 관리                      |          |
| 21  | **User Group**          | 사용자 그룹 생성, 수정, 삭제 및 그룹 매핑 기능<br>(LDAP 그룹 포함)           |          |

### Project Permission  

| No. | 카테고리 이름                 | 설명                                                         | CI/CD 관련 |
| --- | ----------------------- | ---------------------------------------------------------- | -------- |
| 1   | **Accessory**           | 이미지에 부가적으로 생성된 데이터<br>(예: cosign 서명, provenance 등) 조회 및 관리 |          |
| 2   | **Artifact**            | 컨테이너 이미지 및 기타 artifact 자체<br>(push/pull/delete 등)          | ★        |
| 3   | **Artifact Addition**   | 이미지에 덧붙여지는 정보 관리<br>(e.g., SBOM, 서명 등)                     |          |
| 4   | **Artifact Label**      | 특정 artifact에 라벨을 부착/해제                                     | ★        |
| 5   | **Export CVE**          | 이미지의 보안 취약점(CVE) 보고서를 export                               |          |
| 6   | **Immutable Tag**       | 태그 불변 정책(immutable tag rule) 설정 및 조회                       |          |
| 7   | **Label**               | 프로젝트 전용 라벨 생성 및 관리                                         |          |
| 8   | **Log**                 | 프로젝트 내 작업 로그 조회                                            |          |
| 9   | **Project Member**      | 프로젝트 사용자 및 역할 관리<br>(추가, 삭제, 수정 등)                         |          |
| 10  | **Project Metadata**    | 프로젝트 메타데이터 조회 및 수정<br>(예: 공개 여부, 스캔 자동화 등)                 | ★        |
| 11  | **Notification Policy** | 이벤트 발생 시 외부로 알림을 보내는 정책 설정<br>(Webhook 등)                  |          |
| 12  | **Preheat Policy**      | 이미지 프리히트(Preheat, 캐시) 정책 설정                                |          |
| 13  | **Project**             | 프로젝트 정보 자체 조회 및 삭제                                         |          |
| 14  | **Quota**               | 프로젝트 저장소 사용량 및 제한량 설정                                      |          |
| 15  | **Repository**          | 저장소(Repo) 단위의 조회, 생성, 삭제, 태그 등 조작                          | ★        |
| 16  | **Robot Account**       | 프로젝트 범위의 로봇 계정 생성/삭제/조회                                    | ★        |
| 17  | **SBOM**                | 이미지의 Software Bill of Materials 조회<br>(구성 소프트웨어 목록)        | ★        |
| 18  | **Scan**                | 이미지 취약점 스캔 수행 또는 결과 확인                                     | ★        |
| 19  | **Scanner**             | 프로젝트에서 사용할 스캐너 설정<br>(기본 스캐너 지정 등)                         |          |
| 20  | **Tag**                 | 태그 생성/삭제 등 관리 (레포지토리 내부 단위)                                | ★        |
| 21  | **Tag Retention**       | 오래된 태그를 자동 삭제하는 보존 정책 관리                                   | ★        |

### 권한 레벨  

| 키워드      | 권한 수준           | 의미                                  |
| -------- | --------------- | ----------------------------------- |
| `create` | **생성(Create)**  | 새로운 자원 생성 (예: 새로운 레지스트리, 사용자 등)     |
| `delete` | **삭제(Delete)**  | 자원 제거                               |
| `list`   | **조회(Read)**    | 여러 리소스의 목록 조회                       |
| `read`   | **조회(Read)**    | 단일 리소스의 상세 정보 조회                    |
| `update` | **수정(Update)**  | 기존 자원의 속성 변경                        |
| `stop`   | **작업 중단(Stop)** | 실행 중인 백그라운드 작업을 중지 (예: 복제, GC 중단 등) |
| `push`   | **푸시(push)**    | 이미지를 Harbor로 업로드 (docker push 등)    |
| `pull`   | **풀(Pull)**     | Harbor에서 이미지를 다운로드 (docker pull 등)  |


## 깃랩 프로젝트와 Harbor 연결 설정  

![](/assets/images/20250516_001_011.png)  

Settings > Integrations  

![](/assets/images/20250516_001_012.png)  

목록에서 Harbor 를 찾아서 클릭

![](/assets/images/20250516_001_013.png)  

정보 세팅  

![](/assets/images/20250516_001_014.png)  

레지스트리 보기



## Reference  

https://jeongchul.tistory.com/727  
