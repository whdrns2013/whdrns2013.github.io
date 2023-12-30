---
title: 네트워크 출발지와 목적지, 인바운드와 아웃바운드 # 제목 (필수)
excerpt: 네트워크 방향성에 대해 알아보자 # 서브 타이틀이자 meta description (필수)
date: 2023-12-31 02:20:00 +0900      # 작성일 (필수)
lastmod: 2023-12-31 02:20:00 +0900   # 최종 수정일 (필수)
categories: [ComputerScience, network]         # 다수 카테고리에 포함 가능 (필수)
tags: network, source, destination, inbound, outbound, 네트워크, 출발지, 목적지, 인바운드, 아웃바운드  
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20231231_001-->


## 1. 출발지와 목적지

네트워크 통신에서 데이터를 주고 받을 때, 데이터가 어디에서 와서 어디로 가는지를 식별하는 데 사용되는 용어이다. 말 그대로 데이터가 출발하는 (=데이터를 보내는) 곳이 출발지, 데이터를 받는 곳이 목적지이다.  

- 출발지 : 데이터 전송의 시작점.  
- 목적지 : 데이터 전송의 도착 지점.  

네트워크 방화벽 정책 설정에 있어서 출발지와 목적지를 명확히 전달해야 하는 경우가 있다. 예를 들어 아래와 같은 방식의 네트워크 통신이 필요할 경우, 방화벽 정책 설정은 다음과 같이 서술할 수 있다. 

![](/assets/images/20231231_001_001.png)

```text
출발지 : 1.1.1.1, 1.1.1.2, 1.1.1.3
목적지 : 100.100.100.1
통신 포트 : 8000 (100.100.100.1의 8000번 포트)
```

<br>

## 2. 인바운드와 아웃바운드

인바운드와 아웃바운드는 통신의 방향을 일컫는 말이다. 인바운드는 외부에서 내부로, 아웃바운드는 내부에서 외부로 향하는 통신을 말한다.  

- 인바운드 : 외부에서 내부로 데이터가 흐르는 방향.  
- 아웃바운드 : 내부에서 외부로 데이터가 흐르는 방향.  

![](/assets/images/20231231_001_002.png)

<br>

## Reference

https://dongjuppp.tistory.com/60  
https://m.ppomppu.co.kr/new/bbs_view.php?id=developer&no=23967  
https://m.blog.naver.com/thislover/220909157076  