---
title: 커밋 메시지 베스트 프랙티스 # 제목 (필수)
excerpt: 커밋 메시지 잘 작성하기 commit message best practice # 서브 타이틀이자 meta description (필수)
date: 2025-11-07 10:08:00 +0900      # 작성일 (필수)
lastmod: 2025-11-07 10:08:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-07 10:08:00 +0900   # 최종 수정일 (필수)
categories: VCS         # 다수 카테고리에 포함 가능 (필수)
tags: git commit message subtitle title best practice 커밋 메시지 메세지 베스트 프랙티스 제목 본문                     # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
permalink: 
sidebar:
  nav: 
---
<!--postNo: 20251107_001-->

## 커밋 메시지 베스트 프랙티스  

### 커밋 메시지의 구성  

- 제목  
- 본문  

### 제목  

-	한줄, 50자 이내로 핵심 요약  
-	첫머리에 커밋 타입 명시 (`커밋타입: 제목`)  
-	명령형 동사 사용 권장 (Fixed login bug (X) Fix login bug (O))  

### 본문  

- 변경 이유와 배경 설명  
- 코드만으로 이해하기 어려운 의도를 명확히 기술  

### 커밋 타입 컨벤션  

| 커밋 타입 | 영문 의미 | 설명 (내용) |
| :--- | :--- | :--- |
| **feat** | Feature | 새로운 기능 추가 및 요구 사항에 따른 기능 수정 |
| **fix** | Bug Fix | 버그 수정 |
| **docs** | Documentation | 문서 수정 (README, 환경 설정 문서 등) |
| **style** | Style | 포맷팅, 세미콜론 등 **비기능적** 포맷 수정 |
| **refactor** | Refactoring | 기능은 유지하면서 코드 리팩터링 (로직 개선 등) |
| **test** | Test | 테스트 코드 추가 또는 수정 |
| **chore** | Chore | 빌드, 설정 파일 등 **기타 작업** (시스템 설정 등) |
| **perf** | Performance | 성능 개선을 위한 작업 |
| **ci** | Continuous Integration | CI 설정 파일 변경 및 스크립트 수정 |
| **build** | Build | 빌드 파일, 외부 종속성 변경 (npm, pip, maven 등) |

### 커밋 명령  

- 1단계 : 커밋 명령 실행  

```bash
git commit
```

- 2단계 : 커밋 제목 및 메시지 작성 (편집기)  

```bash
feat: 유저 인증 기능 추가

새로운 로그인 엔드포인트 (/login) 과 유저의 인증정보 검증 기능입니다.
password hashing을 위해 bcrypt 라이브러리를 사용했습니다.
```

- 3단계 : 저장 및 종료 (편집기에 따라 다름)  

