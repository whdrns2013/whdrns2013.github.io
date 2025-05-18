---
title: "[GitOps] 2. Docker Registry 설치하기" # 제목 (필수)
excerpt: 빌드한 도커 이미지를 저장할 레지스트리 설치하기 # 서브 타이틀이자 meta description (필수)
date: 2025-05-15 00:40:00 +0900      # 작성일 (필수)
lastmod: 2025-05-15 00:40:00 +0900   # 최종 수정일 (필수)
permalink: /docs/gitops/02_docker_registry_install/
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
<!--postNo: 20250515_001-->

## Docker Registry  

### Docker Registry  

- Docker Registry 는 도커(컨테이너) 이미지를 저장하고 관리하는 저장소입니다.  
- 이번 GitOps 에서는 빌드한 도커 이미지를 저장하는 저장소로 사용할 예정입니다.  
- 사용할 Docker Registry 툴은 오픈소스인 Harbor 입니다.  

### 설치 방법  

설치 방법은 이전에 포스팅한 페이지를 참고해주시기 바랍니다.  

[https://whdrns2013.github.io/docs/docker_registry/harbor/02_harbor_install](https://whdrns2013.github.io/docs/docker_registry/harbor/02_harbor_install)  

