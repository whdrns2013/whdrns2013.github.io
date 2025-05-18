---
title: 유니캐스트, 멀티캐스트, 브로드캐스트 # 제목 (필수)
excerpt: 최적의 전송 방식은? 상황에 따른 선택의 중요성 # 서브 타이틀이자 meta description (필수)
date: 2024-10-07 00:05:00 +0900      # 작성일 (필수)
lastmod: 2024-10-07 00:05:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-10-07 00:05:00 +0900   # 최종 수정일 (필수)
categories: network         # 다수 카테고리에 포함 가능 (필수)
tags: network unicast multicast broadcase 유니캐스트 멀티캐스트 브로드캐스트 브로드캐스팅                     # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20241007_001-->

## Intro  

우리가 인터넷을 사용할 때, 데이터를 어떻게 주고받는지에 대한 고민은 흔히 하지 않지만, 그 뒤에는 다양한 전송 방식이 있습니다. 유니캐스트, 멀티캐스트, 그리고 브로드캐스트는 그중 가장 기본적인 세 가지 방식이며, 각각이 다른 목적과 상황에 최적화되어 있습니다. 이 글에서는 이 세 가지 데이터 전송 방식의 차이점과 어떤 상황에서 어떤 방식이 적합한지 알아보겠습니다.  


## Unicast 유니캐스트  

![](/assets/images/20241007_001_001.jpg)  

유니캐스트는 네트워크에서 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>1대 1로 데이터를 전송</span>하는 방식입니다. 송신자와 수신자가 각각 한 명씩만 있으며, 송신자가 특정 수신자에게 데이터를 전송합니다. 예를 들어, 여러분이 웹사이트를 방문할 때, 그 웹사이트 서버로부터 데이터가 여러분의 컴퓨터로 전송되는 것이 유니캐스트 방식입니다.  

-특징 : 송신자가 특정 수신자 하나에게만 데이터를 보냄  
-예시 : 이메일 전송, HTTP  

## Multicast 멀티캐스트  

![](/assets/images/20241007_001_002.jpg)  

멀티캐스트는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>1대 다수의 방식으로 데이터를 전송</span>하는 방법입니다. 송신자가 여러 수신자에게 동시에 데이터를 전송하는데, 모든 수신자가 아닌, 특정 그룹의 수신자에게만 데이터를 전송합니다. 멀티캐스트는 네트워크 리소스를 절약할 수 있는데, 이는 동일한 데이터를 여러 번 전송하지 않고도 여러 대상에게 전달할 수 있기 때문입니다.  

-특징 : 송신자가 특정 그룹의 수신자들에게 데이터를 보냄  
-예시 : 온라인 게임, 비디오 회의  

## Broadcast 브로드캐스트  

![](/assets/images/20241007_001_003.jpg)  

브로드캐스트는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>1대 전체의 방식으로 데이터를 전송</span>하는 방법입니다. 송신자가 같은 네트워크 상의 모든 장치에게 데이터를 전송합니다. 이 방식은 데이터를 받는 장치가 누구인지에 상관없이 동일한 네트워크에 연결된 모든 장치에 데이터를 보냅니다.

-특징 : 네트워크에 연결된 모든 장치에 데이터를 보냄  
-WOL(Wake On Lan), ARP(Address Resolution Protocol), LAN 내 모든 컴퓨터에게 패킷을 보내는 경우  


## Reference  

[Just Blue - 유니캐스트(UniCast), 브로드캐스트(BroadCast), 멀티캐스트(MultiCast)](https://blog.naver.com/twers/50118680544)  