---
title: 웹개발 - 정적 컨텐츠와 동적 컨텐츠 # 제목 (필수)
excerpt: 움직이지 않는 컨텐츠와 움직이는 컨텐츠? # 서브 타이틀이자 meta description (필수)
date: 2024-01-02 21:55:00 +0900      # 작성일 (필수)
lastmod: 2024-01-02 21:55:00 +0900   # 최종 수정일 (필수)
categories: ComputerScience         # 다수 카테고리에 포함 가능 (필수)
tags: static dynamic content web was 정적컨텐츠 동적컨텐츠 정적 동적 컨텐츠                     # 태그 복수개 가능 (필수)
classes:        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20240102_001-->


## 정적 컨텐츠 Static Content

> 정적(靜的) : 정지 상태에 있는.  
> 클라이언트(접속자)에 상관 없이 동일한 결과를 보여주는 컨텐츠.  

클라이언트에 상관 없이 동일한 결과를 보여주는 컨텐츠를 정적 컨텐츠라고 합니다. 웹서버에 저장이 된 파일을 그대로 사용자에게 보여줄 경우 정적 컨텐츠입니다.  

쇼핑몰 웹사이트를 예로 들면, 모든 고객에게 동일하게 보여주는 "로그인 하기 전 가장 첫 페이지" 를 정적 컨텐츠라고 말할 수 있겠습니다. 보통 HTML, CSS, JavaScript 파일을 있는 그대로 보여줄 것입니다.  

- 정적 컨텐츠의 특징  
(1) <b><font color="FF82B2">고정된 내용</font></b> : 정적 컨텐츠는 고정되어 있어 서버에서 클라이언트(웹 브라우저)로 전송되는 동안 변경되지 않는다.  
(2) <b><font color="FF82B2">캐시 가능</font></b> : 정적 컨텐츠는 한 번 다운로드 되면 여러 요청에서 재사용될 수 있으므로 캐싱이 효과적으로 사용될 수 있다.  
(3) <b><font color="FF82B2">주요 정적 컨텐츠</font></b> : HTML, CSS, 이미지 파일 등 변하지 않는 파일들이 포함된다.  
(4) <b><font color="FF82B2">서버 부하 감소</font></b> : 정적 컨텐츠는 서버 측에서 수행할 작업이 동적 컨텐츠보다 적거나 없으므로 서버 부하가 동적 컨텐츠에 비해 적다.  

<br>

## 동적 컨텐츠 Dynamic Content

> 동적(動的) : 움직이는 성격의.
> 클라이언트(접속자)의 요청에 따라 각기 다른 결과를 보여주는 컨텐츠.  

첫 번째로는 어떤 클라이언트의 요청인지, 언제, 어디서, 어떤 내용으로 요청했는지에 따라 각기 다른 결과를 보여주는 컨텐츠, 그리고 두 번째로 실시간으로 변하는 컨텐츠인 경우 동적 컨텐츠라고 합니다.  

쇼핑몰 웹사이트를 예로 들면, 고객의 장바구니 페이지나 구매목록 페이지와 같은, 사용자에 따라서 다른 내용을 보여주므로  동적 컨텐츠라고 할 수 있습니다. 혹은 간단하게 "게시판" 또한 DB 등에서 게시글 목록을 조회해 보여주는 동적 컨텐츠라고 할 수 있죠.  

- 동적 컨텐츠의 특징  
(1) <b><font color="FF82B2">실시간으로 생성되는 내용</font></b> : 동적 컨텐츠는 클라이언트의 요청에 따라 서버에서 실시간으로 생성되거나 업데이트된다.  
(2) <b><font color="FF82B2">사용자 상호작용</font></b> : 주로 사용자의 입력이나 다양한 외부 요소에 의해 동적으로 변경되는 내용을 포함한다.  
(3) <b><font color="FF82B2">서버 스크립트와 데이터베이스 사용</font></b> : 동적 컨텐츠는 서버 측 스크립트 (PHP, Python Node.js 등)와 데이터베이스(MySQL 등)를 사용하여 생성되는 경우가 많다.  
(4) <b><font color="FF82B2">개인화 및 동적 행위</font></b> : 동적 컨텐츠는 사용자에게 맞춤형 컨텐츠를 제공하고, 상황에 따라 동적으로 반응하는 데 적합하다.  

<br>

## 예시  

정적 컨텐츠 : 모든 클라이언트 (=접속자) 에게 동일하게 보여지는 쇼핑몰 화면  

![](/assets/images/20240102_001_001.png)  

동적 컨텐츠 : 클라이언트 (=접속자) 마다 다르게 보여지는 주문목록 등  

![](/assets/images/20240102_001_002.png)  


<br>

## Reference  

아파치, NginX, 톰캣이 뭔가요? : https://www.youtube.com/watch?v=Zimhvf2B7Es  
정적 컨텐츠와 동적 컨텐츠란? : https://t1.daumcdn.net/kas/static/safeframe.html?surl=https%3A%2F%2Fcceeun.tistory.com%2F68&bidId=25673350-e274-4126-a7dd-5360d6b699c01  
(Spring) 정적 컨텐츠/동적 컨텐츠 : https://velog.io/@gerrymandering/Spring-%EC%A0%95%EC%A0%81-%EC%BB%A8%ED%85%90%EC%B8%A0%EB%8F%99%EC%A0%81-%EC%BB%A8%ED%85%90%EC%B8%A0  
(쉽게 읽는 IT 시스템) 정적 콘텐츠와 동적 콘텐츠 쉽게 요약정리 : https://t1.daumcdn.net/adfit/adunit_style/6925534485970661108147244842185310134681?surl=https%3A%2F%2Fhgney.com%2F1044  