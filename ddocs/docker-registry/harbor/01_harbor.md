---
title: "1. Harbor 소개"
excerpt: "대표적인 도커 레지스트리 관리 툴 Harbor"
date: 2025-05-02 13:15:00 +0900      # 작성일 (필수)
lastmod: 2025-05-02 13:15:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker_registry/harbor/01_harbor
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker_registry"
---

<!--postNo: 20250502_001-->


## Harbor 란?  

![](/assets/images/20250502_001_001.png)  

### Harbor 소개  

> Harbor is an open source registry that secures artifacts with policies and role-based access control, ensures images are scanned and free from vulnerabilities, and signs images as trusted. Harbor, a CNCF Graduated project, delivers compliance, performance, and interoperability to help you consistently and securely manage artifacts across cloud native compute platforms like Kubernetes and Docker.  

**오픈 소스 컨테이너 이미지 레지스트**리로서, 역할 기반 접근 제어(RBAC) 및 정책으로 아티팩트를 보호하고, 이미지의 취약점을 스캔하여 안정성을 보장하며, 이미지 에 대한 서명으로 신뢰할 수 있는 이미지임을 표출할 수 있게 해줍니다.  

쉽게 말해 Docker Registry 위에 보안, 권한 관리, 이미지 서명, 복제 등의 기능을 덧붙여서 편리하게 이미지를 관리할 수 있게 확장한 이미지 관리 도구입니다.  

컨테이너 이미지 외로도 클라우드 네이티브 환경에서 사용하는 다양한 형식의 아티팩트를 통합 관리할 수 있으며, 이 때문에 CI/CD 파이프라인의 주요한 구성원으로 많이 차용됩니다. (예를 들어 Gitlab CI/CD 의 이미지 저장소 역할을 할 수도 있습니다.)  


> 아티팩트 : 소프트웨어 개발과 배포 과정에서 생성되거나 사용되는 모든 산출물. 여기에서는 컨테이너 이미지를 뜻한다.  

### Harbor 의 기능  

| 기능                     | 설명                                                                       |
| ---------------------- | ------------------------------------------------------------------------ |
| **이미지 저장 및 버전 관리**     | - 이미지를 저장및 관리하는 Registry 기능 제공<br>- 프로젝트-태그 단위의 체계적인 관리                  |
| **이미지 Pull/Push 지원**   | - 개발자나 배포 시스템이 이미지 업로드(Push), 다운로드(Pull) 가능                              |
| **다중 프로젝트 구조**         | - 여러 팀이 각자의 이미지 저장소를 가질 수 있도록 구조화 가능                                     |
| **웹 기반 UI**            | - 직관적인 Web 기반 사용자 인터페이스 제공                                               |
| **역할 기반 접근 제어 (RBAC)** | - 프로젝트별 사용자 권한(읽기/쓰기/관리자) 설정 가능                                          |
| **RESTful API 제공**     | - 자동화 및 외부 시스템 연동 가능                                                     |
| **Robot User**         | - 외부 애플리케이션용 계정(Robot User) 생성 가능  <br>- 이를 통해 확실한 권한 분리와 활동 이력 추적이 가능   |
| **Webhook 통합**         | - 이미지 푸시/풀/삭제 등 이벤트 발생 시 알림 전송                                           |
| **OCI 표준 지원**          | - Docker 외에도 표준화된 아티팩트 형식(OCI 이미지) 저장 가능                                 |
| **이미지 취약점 스캔**         | - Clair, Trivy 등을 이용한 이미지 내 취약점 탐지<br>- Notary 또는 Cosign을 이용한 이미지 신뢰성 확보 |
| **감사 로그 (Audit Logs)** | - 사용자 및 시스템 활동 로그 기록                                                     |

## Reference  

[Harbor.io](https://goharbor.io/)