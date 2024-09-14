---
title: 리눅스에서 가상 머신 다루기 (1) xcp-ng 설치 # 제목 (필수)
excerpt: 가상머신 솔루션 xcp-ng를 설치해보자  # 서브 타이틀이자 meta description (필수)
date: 2024-09-14 17:30:00 +0900      # 작성일 (필수)
lastmod: 2024-09-14 17:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-09-14 17:30:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 xcp-ng xcp ng xen-server 가상머신                     # 태그 복수개 가능 (필수)
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (assets내 혹은 url)
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
<!--postNo: 20240914_002-->



## XCP-ng 란  

XCP-ng란 가상 머신을 생성하고 관리해주는 가상 머신 솔루션으로, 상용 가상화 솔루션으로 유명한 Xen-Server의 오픈 소스 버전입니다. RedHat - CnetOS/Rocky 와 같은 관계죠.  

## XCP-ng 설치하기  

### 준비물  

XCP-ng 설치 iso가 담긴 USB (Ventoy 등도 가능)  
컴퓨터  

### 설치하기  

(1) 설치 OS 선택  

![](/assets/images/20240914_002_001.jpeg)  

(2) 부팅 모드 선택  

![](/assets/images/20240914_002_002.jpeg)  

![](/assets/images/20240914_002_003.jpeg)  

(3) 언어 선택 : US로 선택하면 됩니다.  

![](/assets/images/20240914_002_004.jpeg)  

(4) Setup을 눌러 설치를 시작합니다.  

![](/assets/images/20240914_002_005.jpeg)  

(5) Accept EULA 로 이용 약관에 동의합니다.  

![](/assets/images/20240914_002_006.jpeg)  

(6) 설치 Disk를 선택합니다. 제 경우엔 1TB NVME SSD에 설치합니다.  

![](/assets/images/20240914_002_007.jpeg)  

(7) 설치 소스를 선택합니다. USB를 통한 설치이므로 Local media를 선택합니다.  

![](/assets/images/20240914_002_008.jpeg)  

(8) 설치 소스에 대한 검증을 진행합니다. 문제가 없는 게 확실하다면 스킵해도 됩니다.  

![](/assets/images/20240914_002_009.jpeg)  

![](/assets/images/20240914_002_010.jpeg)  

(9) 비밀번호를 설정해줍니다. 최소 6자리 이상으로 설정합니다.  

![](/assets/images/20240914_002_011.jpeg)  

(10) IP 주소를 설정합니다. 사용하기로 결정한 고정 IP가 있다면 입력하고, 없다면  DHCP로 선택해줍니다. 이는 설치 후에도 언제든 변경 가능합니다.  

![](/assets/images/20240914_002_012.jpeg)  

![](/assets/images/20240914_002_013.jpeg)  

(11) DNS (도메인 네임 서버) 를 설정합니다. 기본적으로 8.8.8.8 (Google), 1.1.1.1(Cloud Fare) 로 설정하는 것을 권장합니다. 추가하자면 국내에는 KT DNS 서버 (168.126.63.1) 를 추천합니다.  

![](/assets/images/20240914_002_014.jpeg)  

(12) 타임존과 NTP(네트워크 타임과 동기화)를 설정합니다. NTP 서버는 아래 사진을 참고해주세요.  

![](/assets/images/20240914_002_015.jpeg)  

![](/assets/images/20240914_002_016.jpeg)  

![](/assets/images/20240914_002_017.jpeg)  

(13) 앞서 선택한 설정들로 XCP-ng 설치를 계속합니다.  

![](/assets/images/20240914_002_018.jpeg)  

(14) 편의 도구들을 설치할지 선택합니다. 저는 필요 없을 것 같아 NO 를 선택했습니다.  

![](/assets/images/20240914_002_019.jpeg)  

(15) 설치가 성공하면 아래와 같은 메세지를 볼 수 있습니다.  

![](/assets/images/20240914_002_020.jpeg)  


### XCP-ng 접속하기  

설치를 성공적으로 마치고 재부팅을 합니다. 재부팅시에는 USB로 부팅되지 않게 꼭 USB를 제거해주세요. 부팅 시 아래와 같은 화면이 보인다면 성공적으로 설치가 완료된 것입니다.  

![](/assets/images/20240914_002_021.jpeg)  


### 네트워크 세팅  


외부 및 홈 네트워크와 통신을 위해 네트워크를 설정해줍니다. XCP-ng의 경우 Wifi와 같은 무선 통신을 기본적으로는 지원하지 않습니다. 따라서 랜선을 꽂아 외부 및 홈 네트워크와 연결해줘야 합니다.  

저는 ipTime의 AU-M3 extender (Wifi 확장기. 브릿지 설정으로 AP와 같은 역할을 할 수 있음.)를 머신과 연결한 뒤 네트워크 설정을 진행했습니다.  

![](/assets/images/20240914_002_023.jpeg)  


### (추가) 고정 IP 설정하기    

(1) XCP-ng 홈 화면에서 Network and Managemnet Interface 메뉴를 선택합니다.  

![](/assets/images/20240914_002_022.jpeg)

(2) Configure Managemnet Interface 메뉴를 선택하고, 설정을 변경할 네트워크를 선택합니다. 랜선이 연결되어있다면 보통 eth0 (이더넷 첫번째) 가 메인 네트워크일 것입니다.  

![](/assets/images/20240914_002_024.jpeg)  

(3) 네트워크 유형 선택 화면이 보입니다. 가장 위는 DHCP, 두 번째는 호스트 이름을 활용한 DHCP, 세 번째는 고정 IP를 이용하는 선택지입니다. 이 중 Static을 선택합니다.  

![](/assets/images/20240914_002_025.jpeg)  

![](/assets/images/20240914_002_026.jpeg)  

(4) IP 주소, 넷마스크, 게이트웨이를 입력합니다. 넷마스크는 기본적으로 255.255.255.0 을, 게이트웨이는 IP 네트워크 대역대의 ~.1.1 을 입력하면 됩니다.  

![](/assets/images/20240914_002_027.jpeg)  



  
