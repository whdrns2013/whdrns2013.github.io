---
title: Docker Compose 란 # 제목 (필수)
excerpt: 도커 실행에 대한 명세서 # 서브 타이틀이자 meta description (필수)
date: 2024-10-15 12:30:00 +0900      # 작성일 (필수)
lastmod: 2024-10-15 12:30:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker/docker_compose/
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---


 <!--postNo: 20241015_001-->

## Docker Compose 란  

Docker Compose는 여러 개의 컨테이너를 손쉽게 정의하고 관리할 수 있도록 도와주는 도구입니다. 일반적으로 Docker를 사용하면 하나의 컨테이너를 구동할 때 명령어로 실행하지만, 복잡한 애플리케이션 환경에서는 여러 개의 컨테이너가 필요합니다. 예를 들어, 웹 애플리케이션을 실행할 때 데이터베이스, 캐시 서버, 웹 서버 등 다양한 서비스가 컨테이너로 실행되어야 합니다. Docker Compose를 사용하면 이러한 복수의 컨테이너를 정의하고 함께 실행할 수 있습니다.  

## Docker Compose의 주요 기능  

(1) 여러 서비스 정의: docker-compose.yml 파일을 사용해 여러 컨테이너를 하나의 설정 파일에서 정의할 수 있습니다.  
(2) 서비스 간 의존성 관리: 컨테이너 간의 의존성을 정의해 특정 컨테이너가 다른 컨테이너가 준비된 후 실행되도록 할 수 있습니다.  
(3) 손쉬운 실행: 한 명령어로 여러 컨테이너를 동시에 실행하고 관리할 수 있습니다.
네트워크 자동 생성: 각 컨테이너는 동일한 네트워크 내에서 실행되므로, 네트워킹을 설정할 필요 없이 서로 통신할 수 있습니다.  
(4) 볼륨 관리: 데이터 볼륨을 쉽게 설정하여 데이터를 컨테이너 외부에 저장하고 유지할 수 있습니다.  



