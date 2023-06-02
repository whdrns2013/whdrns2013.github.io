---
title: Virtualbox 가상 cent OS 인터넷 연결 실패 해결하기 # 제목
excerpt: 왜 실패하는데..!? # 서브 타이틀
date: 2023-06-01 20:22:00 +0900      # 작성일
lastmod: 2023-06-01 20:22:00 +0900   # 최종 수정일 : 구글 사이트등록 관련 필요
categories: Linux TroubleShooting         # 다수 카테고리에 포함 가능
tags: Linux Cent OS 인터넷 연결 실패 internet fail                     # 태그 복수개 가능
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color:             # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20230601_001-->

# Intro

Virtual Box 상에서 Cent OS를 구동하다가..  
아래와 같이 인터넷 연결에 실패했다는 문제상황을 맞딱뜨렸다.  

무슨문제인지, 어떻게 해결할 수 있을지 알아보자

![](/assets/images/20230601_001_001.png)

<br>

# 상황

바로 전날 Virtual Box를 이용해 가상 머신상에 Cent OS를 설치했다.  
그런데 오늘 회사에 와서 Cent OS를 구동시키니, "연결이 실패했습니다."라는 경고문구가 뜨는 게 아닌가!  

<br>

# 문제 원인

전날과 달라진 점을 꼽자면, 전날은 Wifi 상에서 작업을 했고,  
오늘은 이더넷 연결 상에서 작업을 했다는 차이점이 있다.  

이렇게 인터넷 환경이 달라지면서, 문제가 생긴 것으로 보인다.  
정확한 원인은 찾지 못함.  

<br>

# 해결

가상머신의 네트워크 환경을 바꿔주었다.  
어댑터1을 NAT 방식으로 바꿔주니, 인터넷 연결에 성공했다.  

![](/assets/images/20230601_001_002.png)

왜 문제가 생겼고, 왜 해결이 되었는지,  
그리고 네트워크 유형들은 무엇을 뜻하는지는 다음 포스트에서 다뤄보도록 하겠다.  

# Reference  

https://zzinise.tistory.com/84  