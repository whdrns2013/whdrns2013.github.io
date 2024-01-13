---
title: "3. docker registry 고도화 하기"
excerpt: "보안 강화와 자료 안정성 향상 방안 고민하기"
last_modified_at: 2024-01-13 18:25:00 +0900
permalink: /docs/docker/registry/03_registry_advance
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs"
---

## 고도화 방향 고민하기  

이전 포스트에서 개인화 도커 이미지 저장소 (docker registry) 를 구축해보았습니다.  
이어서 이번 포스트에서는 저장소 운영 고도화 방안에 대해 살펴보겠습니다.  

고도화 방향은 크게 세 가지로 설정해 보았는데요,    

<b><font color="FF82B2">정책적인 부분</font></b> : 이미지(레포지토리) 와 버전 명명법, 유저 권한 관리법 등 운영 정책에 대한 사항들  
<b><font color="FF82B2">보안적인 부분</font></b> : https통신, 권한별 이용 가능 기능 구분, 접근자 인증 절차 등  
<b><font color="FF82B2">안정화 부분</font></b> : 백업, 데이터 유실 위험성 최소화 방안  

정책적인 부분은 상황과 조직마다 다를 수 있어 넘어가도록 하고, 보안적인 부분과 안정화 부분을 살펴보겠습니다.  
