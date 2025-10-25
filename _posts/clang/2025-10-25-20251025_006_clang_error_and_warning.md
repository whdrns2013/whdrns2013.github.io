---
title: "[C언어] 에러와 경고" # 제목 (필수)
excerpt: "프로그램 빌드에서 만날 수 있는 두 친구"  # 서브 타이틀이자 meta description (필수)
date: 2025-10-25 21:26:00 +0900      # 작성일 (필수)
lastmod: 2025-10-25 21:26:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-10-25 21:26:00 +0900   # 최종 수정일 (필수)
categories: clang         # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 에러 경고 error warning     # 태그 복수개 가능 (필수)
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
---
<!--postNo: 20251025_006-->

## 에러(error)  

### 정의  

- 프로그램을 정상적으로 빌드할 수 없는 문제가 포함된 소스 코드를 컴파일 할 경우 에러 메시지가 출력된다.  

### 발생하는 경우  

- C 언어의 문법에 맞지 않는 형식의 문장을 사용한 경우  
- 컴파일에 반드시 필요한 요소가 누락된 경우  

### 결과  

- 빌드가 중지되며, 목적 코드 및 실행 파일이 생성되지 않는다.  
- 이 경우, 에러 메시지를 확인하여 에러 발생 원인을 반드시 수정해야 한다.  


## 경고(warning)  

### 정의  

- 빌드를 진행할 수는 있지만, 문제 발생 가능성이 있는 소스코드를 컴파일할 경우 경고 메시지가 출력 된다.  

### 발생하는 경우  

- 사용하지 않는 변수나 함수를 정의한 경우  
- 변수 타입의 수용량 오차  

### 결과  

- 경고가 있더라도 실행 파일은 생성되며, 프로그램을 실행할 수 있다.  
- 경고 메시지를 보고, 필요한 경우 적절하게 수정해야 한다.  
- 아무런 문제가 없는 경고는 무시해도 된다.  

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
