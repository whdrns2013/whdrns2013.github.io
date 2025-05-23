---
title: "[GitOps] 0. GitOps 에 대한 설명과 이번 시리즈의 목표" # 제목 (필수)
excerpt: "현대적인 CICD, GitOps" # 서브 타이틀이자 meta description (필수)
date: 2025-05-12 04:20:00 +0900      # 작성일 (필수)
lastmod: 2025-05-12 04:20:00 +0900   # 최종 수정일 (필수)
permalink: /docs/gitops/intro/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
classes: 
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
<!--postNo: 20250512_001-->


![](/assets/images/20250512_001_001.png)

## ⭐️ 이번 시리즈의 목표, 기타 참고사항  

### 이번 시리즈의 목표  

- Git 저장소 및 GitLab을 설치하고 운용한다.  
- 도커 이미지 레지스트리 Harbor 를 설치하고 운용한다.  
- Git 저장소에 build 태그로 Push 하면, 도커 이미지가 빌드되도록 한다.  
- Git 저장소에 push 태그로 Push 하면, 빌드한 도커 이미지를 도커 레지스트리에 등록한다.   
- GitOps Tool 을 운용하며, Git 저장소의 변경사항을 파악해 도커 레지스트리로부터 이미지를 Pull  
- Pull 한 이미지를 기반으로 K8s 클러스터 레벨에서의 애플리케이션 배포를 수행한다.  
- 위 사항들이 일회성이 아닌, 지속성을 가진 시스템으로 운용될 수 있게 한다.  

### 이번 시리즈를 포스팅하는 이유  

- GitOps 는 활발한 서비스를 관리하는 환경에서 널리 쓰이는 기술  
- 개발 뿐만 아니라 서비스의 배포까지 전반을 자동화하는 기술을 공부해보고 싶음  
- CI / CD 에 대한 이해와 공부  
- 쿠버네티스에 대한 이해와 공부  

### 기타 참고사항  

- Docker, 컨테이너에 대한 개념과 사용 이유, 편의성 등에 대한 이해를 전제로 합니다.  

## GitOps    

### GitOps  

- Git 저장소를 단일 소스 삼아 애플리케이션 배포를 자동화하고 관리하는 운영 방식입니다.  
- 쉽게 말해 Git 저장소에 정의된 상태가 실제 클러스터(K8s 등)의 상태와 일치하도록 보장하는 방식입니다.  
- 개발자는 Git 저장소에 소스를 올리는 것만으로 클러스터 레벨의 애플리케이션 배포가 가능합니다.    

### GitOps 의 구조  

```scss
[Git Repository] : 설계도  
[Kubernetes Cluster] : 설계도를 구현해 제품을 생산하고 유지하는 공장  
[GitOps Tool] : 설계도를 배달하고, 생산된 제품이 설계도와 동일한지 모니터링  
```

#### 1. Git Repository  

> 서비스의 배포 방식, 대상 등을 정의한 매니페스트 파일을 저장하고 관리하는 `Single Source of Truth`  
- 애플리케이션이 가져야 하는 상태(구성, 버전, 환경설정 등)을 저장하고 관리하는 공간.  
- 이러한 상태에 대한 명세는 yaml 파일로 작성되며, 이를 매니페스트(Manifest; 선언문) 라고 부름.  
- 매니페스트 파일은 GitOps Tool 을 통해 Kubernetes Cluster 에 실제로 반영됨.  

#### 2. Kubernetes Cluster  

> 매니페스트에 따라 컨테이너 기반 애플리케이션을 오케스트레이션하는 쿠버네티스 환경  
- 매니페스트에 정의된 상태를 실제로 실행하고 유지하는 주체.  
- GitOps 에서 소스 변경에 따른 적용의 무대, 종착지.  

#### 3. GitOps Tool  

> Git Repository의 변경 사항을 감지해서 Kubernetes Cluster에 반영하는 역할  
- GitOps Tool 은 아래와 같은 기능들을 함.  
- Git Repository 모니터링.  
- 변경 사항을 감지해서 Kubernetes Cluster에 반영.  
- Cluster 의 상태와 Git Repository 의 상태를 비교해서 다르면, 자동 동기화.  
- 상태 시각화 및 이력 추적.  
- 대표 툴 : ArgoCD, Flux  

| 항목     | ArgoCD                   | Flux                      |
| ------ | ------------------------ | ------------------------- |
| 운영방식   | 웹 UI / CLI 중심, Pull 방식   | Git 연동 자동화, 기본적으로 Pull 방식 |
| UI 제공  | 웹  UI 를 제공함              | 제공하지 않음                   |
| 설치 난이도 | 약간 복잡                    | 쉬움                        |
| 기업 채택  | CNCF에서 인증했음, 대기업에서 많이 사용 |                           |
| 특징     | 앱 단위 배포, 상태 확인, 롤백 UI 제공 | GitOps 자동화에 집중, 모듈형 구조    |

### GitOps 의 흐름  

```scss
1. 개발자가 Git Repository 에 Manifest (yaml) 를 푸시한다.
2. GitOps Tool 이 Git Repository 의 변경 사항을 감지한다.  
3. GitOps Tool 이 변경 사항을 Kubernetes Cluster 에 적용한다.
4. Kubernetes Cluster 에서는 Manifest 에 따라 애플리케이션을 수정, 배포하거나 관리한다.
5. GitOps Tool 이 Git 저장소와 k8s Cluster 의 상태를 지속적으로 비교하며 동기화 상태를 유지한다.
```


## Kubernetes    

### Kubernetes  

- 오픈소스 컨테이너 오케스트레이션 플랫폼.  
- 컨테이너화 된 애플리케이션을 자동으로 배포, 관리하는 게 목적.  
- 컨테이너 : 애플리케이션이 격리된 환경에서 실행되도록 하는 환경 기반, 또는 그 기술.  
- 오케스트레이션 : 자동 배치, 확장, 복구 등.  
- k8s 라고도 부른다.  

| No  | 주요 기능             |
| --- | ----------------- |
| 1   | 자동 배포 및 롤백        |
| 2   | 서비스 디스커버리 및 로드밸런싱 |
| 3   | 자동 스케일링 (수평 확장)   |
| 4   | 자원 모니터링           |
| 5   | 자체 복구             |
### Kubernetes Cluster  

- 쿠버네티스가 설치되어있고 컨테이너 애플리케이션을 배포, 운영할 수 있는 컴퓨터들의 집합.  
- 쿠버네티스를 설치하면 하나의 클러스터가 만들어지게 된다.  
- 그리고 그 클러스터 안에 여러 앱(Pod)을 배포하면 쿠버네티스가 알아서 실행, 확장, 복구를 수행한다.  

### Kubernetes Cluster의 구조  

```scss
[Kubernetes Cluster]
  ├─ Control Plane (1개 이상) : 클러스터 관리
  │   ├─ API Server
  │   ├─ Scheduler
  │   ├─ Controller Manager
  │   ┕─ etcd
  ┕─ Worker Nodes (여러 개): 앱 실행
      ├─ kubelet
      ├─ kube-proxy
      ┕─ container runtime
```

#### 1. 컨트롤 플레인 (Control Plane)  
- 쿠버네티스 클러스터 전체를 관리, 조정하는 역할을 하는 부분, 즉 쿠버네티스 클러스터의 두뇌.    
- 어떤 앱을 어디에 띄울지 결정하고, 상태를 감시하고, 필요시 복구를 진행한다.  
- 구성 : `API Server`, `Scheduler`, `Controller`, `etcd`  

| 구성                 | 설명                                 |
| ------------------ | ---------------------------------- |
| API Server         | 클러스터와 통신하는 입구. 모든 명령이 시작되는 곳이다.    |
| Scheduler          | 어떤 Worker Node에 어떤 Pod를 배치할지 결정한다. |
| Controller Manager | 상태 유지를 담당한다. Pod 복구, 스케일링 등.       |
| etcd               | 모든 클러스터 상태를 저장하는 Key-Value 저장소     |

#### 2. 워커 노드 (Worker Node)  
- 실제 앱(Pod)이 실행되는 컴퓨터(머신 또는 인스턴스).  
- 여러 개의 노드가 클러스터에 연결된다.  
- 각각에 `kubelet`, `kube-proxy`, `container runtime`이 있다.  

| 구성                | 설명                                    |
| ----------------- | ------------------------------------- |
| kubelet           | 노드에서 Pod을 실행하고, 상태를 보고하는 역할.          |
| kube-proxy        | 네트워크 통신 및 로드밸런싱.                      |
| container runtime | 도커 또는 containerd 등, 실제 컨테이너를 실행하는 역할. |
### Kubernetes Cluster 만들기  

쿠버네티스 클러스터를 만들 때에는 보통 아래의 도구들을 사용합니다. 이들은 **쿠버네티스 배포 도구 (Kubernetes provisioning tools)** 라고 부릅니다.

| 구분  | 방법             | 설명                                                              |
| --- | -------------- | --------------------------------------------------------------- |
| 운영  | kubeadm        | Kubernetes를 직접 설치하고 구성할 수 있게 도와주는 도구.<br>공식 Kubernetes 설치 도구이다. |
| 운영  | EKS            | AWS에서 제공하는 관리형 Kubernetes 서비스                                   |
| 운영  | GKE            | Google Cloud에서 제공하는 관리형 Kubernetes 서비스                          |
| 운영  | AKS            | Azure에서 제공하는 관리형 Kubernetes 서비스                                 |
| 테스트 | Minikube       | 로컬에서 단일 노드 클러스터를 빠르게 만들 수 있는 테스트용 도구.                           |
| 테스트 | kind           | 도커 컨테이너로 Kuvernetes Cluster를 구성하는 테스트용 도구                       |
| 테스트 | Docker Desktop | Docker에 내장된 로컬 Kubernetes 기능을 사용할 수 있다.                         |

이런 쿠버네티스 배포 도구들을 사용하지 않아도 직접 쿠버네티스를 소스 코드 수준에서 컴파일하고 설치하는 것도 가능하지만, 매우 복잡하고 시간도 오래 걸리기 때문에 위 도구들을 사용합니다. 이들은 빠르고 안정적으로 쿠버네티스 클러스터를 만들 수 있게 도와줍니다.  

### Pod 란?  

- pod : 작은 무리  
- 쿠버네티스에서 생성하고 관리할 수 있는 배포 가능한 가장 작은 컴퓨팅 단위.  
- 1개 이상의 컨테이너들을 감싸는 래퍼(wrapper) 역할을 하며,  
- 동일 Pod 에 속한 컨테이너는 같은 IP 및 포트공간, 스토리지를 공유하며 서로 로컬처럼 통신할 수 있다.  
- 쿠버네티스틑 컨테이너를 직접 다루기보단, 이 Pod 단위로 배포, 스케일링, 복구를 진행한다.  
- 예를 들어 컨테이너 여러 개가 결합해 하나의 서비스를 만들 때 사용될 수 있다. (웹 서버 + 로그 수집기 등)  



## CI CD    

![](/assets/images/20250512_001_002.jpg)

### CI : Continuous Integration  

지속적 통합  
- 지속적 : 사람이 건드리지 않아도 지속되는, 즉 자동화를 뜻함  
- 통합 : 개발자들이 작업한 코드가 통합돼 하나로 합쳐지는 것  
- 여러 개발자가 만든 코드를 중앙 저장소에 통합하고, 이를 자동으로 빌드 및 테스트하는 것.  
- 예시 : GitHub 에 PR시 Jenkins 가 코드를 pull 하고, 빌드와 단위 테스트를 자동으로 실행, 
  테스트를 통과하면 QA 서버 등에 자동으로 반영  

### CD : Continuous Deployment  

지속적 배포  
- 지속적 : 사람이 건드리지 않아도 지속되는, 즉 자동화를 뜻함  
- 배포 : 실제 서빙 환경에 프로그램을 배포하고, 운영하고, 모니터링하는 것  
- CI를 통과한 애플리케이션을 프로덕션(운영) 환경에 자동으로 배포, 운영 상태를 모니터링 하는 것.  
- 얘시 : CI 성공 후 -> AWS Code Pipeline -> EC2 또는 Lambda 배포 -> CloudWatch 로 모니터링  

## Reference  

GitOps Cookbook - 나탈리 빈토, 알렉스 소토 부에노 지음  
https://pm-developer-justdoit.tistory.com/327  
