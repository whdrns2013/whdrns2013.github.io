---
title: "[GitOps] 4. GitLab CI/CD 에 대해 알아보자" # 제목 (필수)
excerpt: 깃랩을 이용한 지속적 통합과 배포 # 서브 타이틀이자 meta description (필수)
date: 2025-05-17 22:50:00 +0900      # 작성일 (필수)
lastmod: 2025-05-17 22:50:00 +0900   # 최종 수정일 (필수)
permalink: /docs/gitops/04_gitlab_cicd/
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

<!--postNo: 20250517_001-->


## GitLab CI/CD  

### GitLab CI/CD   


![](/assets/images/20250517_001_001.png)  

> CI/CD is a continuous method of software development, where you continuously build, test, deploy, and monitor iterative code changes.  

<b><font color="FF82B2">CI/CD 란</font></b> 개발자들이 작성한 코드를 하나로 모아 통합해 빌드하고, 빌드한 시스템을 테스트하며, 테스트를 통과한 서비스를 배포하는 서비스의 전 과정을 지속 가능하게(=자동화하여) 하는 소프트웨어 개발 방법입니다.  

<b><font color="FF82B2">GitLab CI/CD 는 깃 저장소에서 코드 변경 사항을 포착하고 이를 기반으로 빌드, 테스트, 배포</font></b>를 할 수 있게 해주는 자동화 도구입니다.  

- 빌드, 테스트, 서비스 배포, 모니터링의 전 과정을 자동화하는 도구  
- 빌드한 시스템을 도커 이미지 등으로 저장도 가능  
- 원격 서버에 배포도 가능  

### GitLab CI/CD 의 과정  

#### Step 1. `.gitlab-ci.yml` 파일 만들기  

GitLab CI/CD 는 프로젝트의 깃 저장소 루트(/) 에 `gitlab-ci.yml` 파일을 만들어주는 것으로부터 시작합니다. 이 파일은 `CI/CD 구성 파일`로써, <b><font color="FF82B2">CI/CD 파이프라인 동안 실행할 작업들과 이들의 순서, 그리고 실행할 작업에 대한 스크립트를 명세</font></b>합니다.  

`gitlab-ci.yml` 파일은 YAML 확장자를 가지며, 이 파일에는 CI/CD 작업에 사용될 변수, 작업 간의 종속성과 작업을 실행할 시기와 방법 또한 지정합니다.  

파일의 이름은 원하는 대로 지정할 수 있지만, `.gitlab-ci.yml` 이라는 파일 이름이 가장 일반적이며, 공식 DOC 에서도 이 파일 이름으로 CI/CD 구성 파일을 지칭합니다.  


- CI/CD 구성 파일로써, 파이프라인의 작업 내용을 명세.  
- 프로젝트 깃 저장소의 루트(/) 에 저장.  
- yaml 형식의 파일.  
- 파일엔 변수, 작업 간 종속성, 작업을 실행할 시기와 방법(트리거) 를 지정.  
- 파일명은 사용자가 지정 가능, 가장 기본적인 이름은 `gitlab-ci.yml`

#### Step 2. Runner 찾거나 생성하기  

<b><font color="FF82B2">Runner 는 CI/CD 작업을 실행하는 에이전트</font></b>입니다. Runner 는 물리적 머신일 수도 있고, 혹은 컨테이너와 같은 가상 인스턴스일 수도 있습니다. Runner 가 컨테이너일 경우, `.gitlab-ci.yml` 파일에서 작업을 실행하기 위한 컨테이너 이미지를 지정할 수 있습니다.  

- Runner 는 실제 CI/CD 작업을 실행하는 에이전트  
- Runner 는 물리적인 머신일 수도 있고, 컨테이너 같은 인스턴스일 수도 있음.  

#### Step 3. Pipeline 정의하기  

<b><font color="FF82B2">파이프라인</font></b>이란 `.gitlab-ci.yml` 파일에서 정의한 작업들이 `Runner` 에서 실행될 때 일어나는 <b><font color="FF82B2">일련의 작업 모음</font></b>을 의미합니다.  

`pipeline(파이프라인)`은 기본적으로 `jobs(작업)`와 `stage(스테이지)`로 구성되며, 특정 조건이나 시점과 같은 `trigger(트리거)`에 따라 실행됩니다. 그 외로 다양한 키워드를 통해 확장성을 가져갈 수 있습니다.  

`stage(스테이지)`는 실행 순서를 의미하는데, 일반적으로 `빌드`, `테스트`, `배포` 와 같은 단계를 지칭합니다.  

`job(작업)`은 각 스테이지에서 수행할 세부적인 작업을 지정한 것을 의미합니다. 예를 들어 `코드를 컴파일` 하는 작업이나, `테스트` 하는 작업 등이 있습니다.  

`trigger(트리거)`는 파이프라인을 실행시키는 조건이나 사건을 의미하며, `코드의 푸시`, `병합` 과 같은 다양한 이벤트일 수 있고, 혹은 특정 일정일 수도 있습니다.  

- Pipeline : 트리거를 통해 실행되는, 스테이지라는 체계를 갖춘 여러 일련의 작업 모음.  
- Stage : CI/CD 의 단계. `빌드`, `테스트`, `배포` 등. 사용자 정의 가능.  
- Job : 각 스테이지에서 수행할 세부적인 작업. 코드 컴파일, 테스트 등.  
- Trigger : 파이프라인을 실행시키는 특정 조건이나 사건 혹은 일정  

#### Step 4. CI/CD 변수를 작업에서 사용하기  

<b><font color="FF82B2">`GitLab CI/CD variables`(GitLab CI/CD 변수) 는 API 키나 토큰과 같은 민감한 정보를 저장</font></b>하는 변수를 뜻합니다. 이는 GitLab CI/CD 과정에서 활용되며 파이프라인의 작업에 민감 정보나 반복적인 값을 전달할 때 사용됩니다. 변수는 프로젝트, 그룹, 혹은 인스턴스 단위로 격리 또는 공유하여 정의할 수 있습니다.    

`GitLab CI/CD variables` 는 키-값 쌍의 형태로 이루어져 있으며, 사용자가 정의하는 `custom variables(사용자 정의 변수)`, 그리고 GitLab 에서 미리 정의된 `predefined(미리 정의된 변수)` 가 있습니다.  

이 `GitLab CI/CD variables` 는 `.gitlab-ci.yml`파일에 직접 하드코딩 하거나, GitLab 의 프로젝트 설정에 지정하거나 혹은 동적으로 생성할 수도 있습니다.  

민감한 정보를 담은 만큼 보안도 중요합니다. 이를 위해 변수를 특정 브랜치나 태그에서만 사용될 수 있는 `protected variables(보호된 변수)` 또는 작업 로그에서는 변수의 실제 값이 가려지는 `masked variables(마스킹된 변수)` 로 설정함으로써 내용을 보호할 수 있습니다.  

- GitLab CI/CD variables : CI/CD 과정에서 사용되는 민감 정보 등을 담은 키-값 쌍 형태의 자료.  
- 프로젝트, 그룹 혹은 인스턴스 단위로 변수를 격리하거나 공유해서 정의, 사용할 수 있음  
- 미리 정의된 predefined 와 사용자가 정의하는 custom variables 가 있음.  
- 변수 내용 보호를 위해 `protected variables` 또는 `masked variables` 로 설정 가능  

#### Step 5. CI/CD 컴포넌트 사용하기  

<b><font color="FF82B2">`CI/CD Component` 는 파이프라인 설정을 재사용할 수 있도록 만든 블록</font></b>입니다. 파이프라인 설정을 할 때 이 Component 만으로 전체적인 구성을 할 수도 있고, 파이프라인의 일부를 Component 로 구성할 수도 있습니다.  

`.gitlab-ci.yml` 파일에서 `include:component` 키워드를 사용해 컴포넌트를 사용할 수 있습니다.  

예시로 테스트, 보안 검사, 배포 작업 등을 하나의 컴포넌트로 만든 뒤, 이를 필요할 때마다 불러와 사용할 수 있습니다.  

컴포넌트를 사용하면 (1) 중복을 줄일 수 있고, (2) 유지보수가 용이해지며 (3) 여러 프로젝트 간에 일관된 설정을 유지할 수 있다는 장점을 가질 수 있습니다.  

만약 여러 프로젝트에서 컴포넌트를 공유해 사용하고 싶다면, 컴포넌트 전용 프로젝트를 만들고, 이를 GitLab 의 CI/CD 카탈로그에 등록하면 됩니다. 그러면 다른 프로젝트에서도 쉽게 해당 컴포넌트를 가져다가 사용할 수 있습니다.  

- 컴포넌트는 재사용 가능한 블록(테스트 작업, 보안 검사 작업, 배포 작업 등)    
- 이를 이용해 CI/CD 명세에 중복을 줄일 수 있고, 유지보수가 용이해짐  
- 여러 프로젝트 간에도 컴포넌트 공유가 가능함  

#### Step 6. CI/CD 트리거 설정하기  

<b><font color="FF82B2">GitLab CI/CD 파이프라인은 특정 이벤트나 조건(트리거)을 기반으로 자동 실행</font></b>되도록 설정할 수 있습니다. 이를 통해 개발 프로세스의 자동화를 극대화할 수 있으며, 코드 푸시뿐만 아니라 병합(Merge), 스케줄(Schedule), 태그(Tag) 푸시, API 호출 등 다양한 방식으로 트리거를 정의할 수 있습니다.  

CI/CD 파이프라인은 일반적으로 아래와 같은 Git 이벤트를 트리거로 가집니다.  

- Code Push : 브랜치에 새로운 커밋이 푸시되면 파이프라인 실행  
- Merge Request : 병합 요청이 생성되거나 업데이트 될 때 파이프라인 실행  
- Git Tag Push : 특정 커밋의 태그 혹은 릴리즈가 푸시되면 파이프라인 실행  

또한 스케줄을 트리거로 가질 수도 있습니다.  

- 예시 : 매일 새벽 2시에 테스트틑 수행  

혹은 API 를 이용해 외부에서 파이프라인을 실행시킬 수도 있습니다.  

- GitLab API 를 통해 파이프라인을 실행시킬 수 있습니다.  
- 외부 시스템과의 연계에서 유용한 방법입니다.  
- ![](/assets/images/20250517_001_002.png)  


## 이번 포스팅 시리즈의 목표  

- GitLab CI/CD 를 이용해서 코드 변경사항에 따라 도커 이미지를 만들고(CI)  
- 이를 배포하여 운영하는(CD) 것까지  


## Reference  

[https://docs.gitlab.com/ci/](https://docs.gitlab.com/ci/)  