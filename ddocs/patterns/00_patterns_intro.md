---
title: "패턴 인트로" # 제목 (필수)
excerpt: 반복적으로 나타나는 문제들을 해결하기 위한 검증된 설계 방법 # 서브 타이틀이자 meta description (필수)
date: 2025-07-04 12:55:00 +0900      # 작성일 (필수)
lastmod: 2025-07-04 12:55:00 +0900   # 최종 수정일 (필수)
permalink: /docs/patterns/00_patterns_intro
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
classes: wide
sidebar:
  nav: "docs_patterns"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

## 🧠 Patterns: 소프트웨어 설계의 공통 언어  

Patterns 문서는 소프트웨어 개발 과정에서 반복적으로 마주치는 문제들을 효율적이고 재사용 가능한 방식으로 해결하기 위한 설계 지식의 집합입니다.  

이 문서에서는 크게 두 가지 패턴 계층을 다룹니다:  

### (1) 아키텍처 패턴 (Architectural Patterns)  

- 소프트웨어 아키텍처의 공통적인 발생 문제에 대한 일반적인, 재사용 가능한 해결책  
- 소프트웨어 디자인 패턴과 비슷하지만 더 넓은 범위  
- 하드웨어 성능 제한, 비즈니스 위험의 최소화와 고가용성 등의 문제를 해결하고자 함  
- 시스템 전체의 구조와 모듈 간의 책임 분리, 데이터 흐름을 설계하는 전략  
- 예: Layered Architecture, CQRS, DDD 등  

### (2) 디자인 패턴 (Design Patterns)  

- 특정 문맥에서 공통적으로 발생하는 문제에 대해 재사용 가능한 해결책  
- 프로그래머가 애플리케이션이나 시스템을 디자인할 때 공통된 문제들을 해결하는데에 쓰이는 형식화 된 가장 좋은 관행  
- 클래스, 객체, 메서드 수준의 구조와 협력 관계를 다루는 설계 해법  
- 예: Builder, Observer, Strategy 등  

### 패턴을 공부하는 이유  

> “패턴은 단순한 이론이 아니라, 설계를 더 잘하기 위한 사고 도구입니다.”  
> 이 문서를 통해 설계의 감각과 구조적 사고를 키워보도록 하겠습니다.  


## Reference  

[https://ko.wikipedia.org/wiki/소프트웨어_디자인_패턴](https://ko.wikipedia.org/wiki/%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4_%EB%94%94%EC%9E%90%EC%9D%B8_%ED%8C%A8%ED%84%B4)    
[https://ko.wikipedia.org/wiki/아키텍처_패턴](https://ko.wikipedia.org/wiki/%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98_%ED%8C%A8%ED%84%B4)  