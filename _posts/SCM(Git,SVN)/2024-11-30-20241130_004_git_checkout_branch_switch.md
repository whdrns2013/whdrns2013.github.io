---
title: git 브랜치와 관련된 명령어 교통정리, 그리고 전망 살펴보기 # 제목 (필수)
excerpt: 복잡복잡 git 브랜치 명령어 # 서브 타이틀이자 meta description (필수)
date: 2024-11-30 03:29:00 +0900      # 작성일 (필수)
lastmod: 2024-11-30 03:29:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-30 03:29:00 +0900   # 최종 수정일 (필수)
categories: VCS         # 다수 카테고리에 포함 가능 (필수)
tags: git branch checkout switch 깃 브랜치 체크아웃 스위치                     # 태그 복수개 가능 (필수)
classes:  wide       # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20241130_004-->


## branch, checkout, switch 기능 비교  

### 기능 비교  

|기능|branch|checkout|switch|
|---|---|---|---|
|요약|브랜치 관리|다목적 명령|브랜치 전환/생성에 특화|
|브랜치 전환<br>(HEAD 이동)|X|O<br>`git checkout <branch name>`|O<br>`git swtich <branch name>`|
|브랜치 생성 + 전환|X|O<br>`git checkout -b <branch name>`|O<br>`git switch -c <branch name>`|
|브랜치 생성만|O<br>`git branch <branch name>`|X|X|
|브랜치 삭제|O<br>`git branch -d/-D <branch name>`|X|x|
|브랜치 이름 변경|O<br>`git branch -m <new branch name>`|X|X|
|특정 커밋으로 이동<br>(HEAD 이동)|X|O<br>`git checkout <commit ID>`|O<br>`git switch -d <commit ID>`|
|파일 복원|X|O<br>`git checkout -- <file>`|X|
|브랜치 목록 확인|O<br>`git branch [--list]`|X|X|

### 리뷰  

전체적으로 명령어가 중복되어 복잡하다. git checkout과 git switch는 겹치는 명령어도 많고, 둘의 옵션 이름이 미묘하게 다른 복잡함이 발생하고 있다.  

git branch는 브랜치 생성과 삭제 등 관리에 특화된 점에서 차이가 크지만, 여전히 다른 두 명령어도 브랜치 생성이 가능하다는 점에서 복잡함을 제공하는 소지가 있다고 생각한다.  

### 왜 이러한 원인이 발생하였는가?  

기존에 git checkout 명령어가 다목적 명령어로서 여러 가지 기능을 가지고 있었다. 하지만 명령어의 목적이 많아지면 사용하기가 어려워지고 그 정체성이 모호해질 수 있기 때문에 git checkout 명령어를 세분화하고, 대체하는 명령어를 도입하게 되었다.  

### 이후에는 어떻게 달라질까?  

git checkout 명령어는 점차 권장되지 않는 상황이며, 이를 git switch 와 git restore 명령어로 대체하는 것이 권장되고 있다. git branch 명령어는 명확한 정체성을 가지고 있기 때문에 그대로 유지할 가능성이 높다.  

-git switch : 브랜치 전환 및 생성에 특화  
-git restore : 파일 복원에 특화  

