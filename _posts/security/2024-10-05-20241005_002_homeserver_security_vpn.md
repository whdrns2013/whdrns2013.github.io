---
title: 홈 서버 보안 강화 (2) VPN 구축 # 제목 (필수)
excerpt: 외부에서도 홈 네트워크를 이용해보자   # 서브 타이틀이자 meta description (필수)
date: 2024-10-05 23:45:00 +0900      # 작성일 (필수)
lastmod: 2025-08-11 19:40:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-08-11 19:40:00 +0900   # 최종 수정일 (필수)
categories: [Infra, security]         # 다수 카테고리에 포함 가능 (필수)
tags: linux rocky vpn wireguard openvpn 보안 사설망 가상사설망   # 태그 복수개 가능 (필수)
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
<!--postNo: 20241005_002-->



## VPN 이란  

### VPN의 개념  

<b><font color="008080">VPN (가상 사설망, Virtual Private Network)</font></b>은 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>인터넷을 통해 원격 위치에 있는 기기와 암호화된 통신을 할 수 있는 기술</span>입니다. 이를 통해 인터넷과 같은 공용 네트워크 안에서도 안전하게 데이터를 주고받을 수 있습니다.  

VPN의 개념을 이해하기 위해서는 먼저 <b><font color="008080">PN(사설망, Private Network)</font></b> 의 개념을 이해해야 합니다. PN은 사설망이라는 의미로 통신 내용이 외부에 공개되지 않는 물리적인 인트라넷(사설) 네트워크 망을 의미합니다. 즉, 실제 통신선을 연결하여 홈 네트워크나 회사 내부 네트워크 같은 내부 통신망을 구축하는 것이죠.  

![](/assets/images/20241005_002_001.jpeg)  

이러한 PN은 통신 내용이 외부에 드러나면 안되는 곳에서 사용됩니다. 예를 들면 회사 내의 사내 네트워크, 군부대와 같이 보안이 유지되어야 하는 단체의 네트워크 등이 해당될 것입니다.

그런데 PN은 문제가 하나 있습니다. 물리적인 통신선을 설치하는 것이므로, 설치 거리가 길어지면 길어질수록 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>구축 비용이 어마어마</span>하게 늘어난다는 것이죠. 이러한 문제를 기술적으로 극복하기 위해 개발된 기술이 바로 VPN입니다.  

![](/assets/images/20241005_002_002.jpeg)  

VPN은 물리적인 전용 통신 선 없이, 이미 전 세계에 연결된 인터넷 망과 같은 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>공용 네트워크 상에서 사설 네트워크 망을 구축</span>합니다. 통신 자체는 공용 네트워크를 통해 주고받지만, 통신의 내용 즉 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>패킷을 암호화</span>하여 제 3자가 패킷의 내용을 들여다볼 수 없게 하는 것입니다. 이로써 외부인이 접근할 수 없는 PN 과 같은 사설망을 구축할 수 있는 것이죠.  

VPN을 사용해 사설망에 연결된 PC나 스마트폰 같은 통신 기기는 해당 네트워크 망으로부터 임의의 사설 IP 주소를 하나 할당받게 됩니다. 이렇게 사설 IP 주소를 할당받음으로써 VPN 네트워크 상에 있는 다른 기기들과 통신을 할 수 있게 됩니다. 그리고 VPN을 사용할 때에는 사용자의 기기가 할당받은 사설 IP 주소로 나타나기 때문에, 자신의 진짜 IP 주소가 숨겨지게 됩니다. 이로써 해외에 있는 VPN 서버를 이용해, 한국에서 접근할 수 없는 사이트 등에 접근할 수 있게 되는 것입니다.  

![](/assets/images/20241005_002_003.jpeg)  

![](/assets/images/20241005_002_004.jpeg)  


### VPN의 기능  
#### 2.1 데이터 암호화  

VPN을 통해 인터넷에 연결할 때, 사용자의 모든 데이터는 **암호화**됩니다. 이를 통해 인터넷 사용 중 해킹이나 도청을 방지할 수 있습니다. 특히, 공용 Wi-Fi 같은 안전하지 않은 네트워크에서 VPN은 사용자의 개인 데이터를 보호하는 데 매우 유용합니다.

#### 2.2 보안 강화  

VPN을 이용함으로써 **보안을 강화**하고 **사설망을 구축**할 수 있습니다. 특히 기업 환경에서는 직원들이 원격으로 회사 네트워크에 접근할 때 VPN을 사용하여 회사의 내부 데이터와 시스템을 안전하게 보호할 수 있습니다.

#### 2.3 IP 주소 숨기기  

VPN은 사용자의 **실제 IP 주소를 숨기고** 대신 VPN 서버의 IP 주소를 노출합니다. 이를 통해 사용자의 **익명성**을 유지할 수 있으며, 특정 웹사이트나 서비스가 사용자의 위치를 추적하거나 제한하는 것을 방지할 수 있습니다.  

#### 2.4 지역 제한 우회  

특정 지역에서만 접근이 가능한 일부 웹사이트나 서비스를 이용하는 데 사용됩니다. VPN을 사용하면 다른 국가의 서버에 연결하여 해당 지역에서만 접근할 수 있는 콘텐츠나 서비스를 이용할 수 있습니다. 예를 들어, **해외에서 한국의 스트리밍 서비스**를 이용하거나, 해외 사이트에 접속할 수 있습니다.  

### VPN 기술의 종류  

VPN에는 다양한 종류가 있으며, 각기 다른 암호화 방식과 프로토콜을 사용합니다.  

| VPN       | 설명                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| IPsec     | - Internet Protocol Security<br>- 세션의 개별 IP 패킷을 인증하고 암호화<br>- 계층 3 암호화 프로토콜<br>- L2TP와 결합해 VPN 서비스를 제공한다.            |
| L2TP      | - Layer 2 Tunneling Protocol<br>- 계층 2 터널링 프로토콜<br>- IPsec과 결합해 VPN 서비스를 제공한다.<br>- 둘을 결합한 것을 L2TP/IPsec 이라고 한다.<br>- L2TP/IPsec 은 IPsec으로 인한 오버헤드가 발생할 수 있다.<br>- 때문에 OpenVPN보다 약간 느릴 수 있다.     |
| PPTP      | - Point-to-Point Tunneling Protocol<br>- 가장 오래된 터널링 프로토콜<br>- 속도가 빠르나, 보안이 취약한 프로토콜                                  |
| OpenVPN   | - 오픈소스 VPN<br>- 높은 보안성과 성능으로 인기가 많다.<br>- 네트워크 주소 변환(NAT)와 방화벽을 가로지를 수 있다.<br>- 즉, NAT 환경과 방화벽을 우회해서 VPN 통신을 할 수 있다.<br>- 호환성이 좋고, 비교적 속도가 빠르다. |
| WireGuard | - 오픈소스 VPN<br>- 사용 편의성, 고속 성능, 낮은 공격 표면을 목표로 설계됨<br>- UDP를 통해 트래픽을 전달함<br>- IPsec, OpenVPN보다 더 작고 나은 성능을 목표로 함<br>- 코드베이스가 간결해 오버헤드가 적다.<br>- 최신 암호화 기술을 효율적으로 사용해 OpenVPN보다 빠른 속도를 제공한다.       |

### VPN의 장단점  

#### 장점  

| 장점        | 설명                                                                                    |
| --------- | ------------------------------------------------------------------------------------- |
| 보안 강화     | - 통신 데이터를 암호화하여 주고받음<br>- 따라서 통신 도청, 해킹으로부터 사용자를 보호<br>- 공용 네트워크를 사용할 때 보안성 강화됨       |
| 인터넷 자유 보장 | - VPN 서버가 위치한 국가 IP로 우회 접속 가능<br>- 때문에 특정 국가, 지역에서 접근 불가한 자원에 접근 가능<br>- 즉, 인터네 검열 우회 |
| 프라이버시 보호  | - 실제 IP 주소가 숨겨지면서 익명성 보장<br>- 사용자 활동 추적에서 자유로움                                        |

#### 단점  

| 단점          | 설명                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------ |
| 속도 저하       | - 통신 데이터의 암호화, 복호화 처리 작업<br>- 통신 횟수 증가 (VPN 서버와 통신 후 인터넷 통신)<br>- 위 두 가지 사항으로 인터넷 통신 속도 저하 |
| VPN 서비스 신뢰도 | - 상용, 무료 VPN 서비스 이용시 로그 남는 문제<br>- 모든 데이터가 VPN 서비스에게 보여지는 문제                               |

## VPN 구축 시나리오  

이번 포스트의 목적은 홈서버 네트워크에 외부에서 안전하게 접속하기 위함입니다. 홈 네트워크 어딘가에 VPN 서버를 직접 구축하고, 외부에서는 인터넷을 통해 이 VPN 서버에 도달하여 홈 네트워크의 사설 IP를 받은 뒤, 홈 네트워크 안의 기기들과 통신하게끔 해야합니다. 따라서 상용 VPN 서비스는 고려 대상에서 제외입니다.  

### VPN 구축 위치 (1) 공유기에서 VPN 구축  

![](/assets/images/20241005_002_005.jpeg)  

공유기에 내장된 VPN 기능을 이용하여 구축하는 방법입니다. 설치가 쉽다는 장점이 있지만, 공유기 자체에서 VPN 기능을 제공해야지만 가능한 방법입니다.  

### VPN 구축 위치  (2) 홈서버에서 VPN 구축  

![](/assets/images/20241005_002_006.jpeg)  

홈서버에 VPN을 구축하는 방법입니다. 외부에서 접속시, 인터넷을 통해 홈 네트워크 게이트웨이인 공유기를 지나쳐, 홈서버에 도달합니다. 사용자는 홈서버로부터 홈서버 하위 사설 IP 를 부여받고 홈 네트워크 내에서 활동할 수 있습니다. 홈 네트워크와 통신할 때에는 홈서버의 IP로 통신하게 되고, 인터넷과 통신할 때에는 공유기의 공인 IP로 통신하게 됩니다.

### VPN 종류 선택하기  

앞서 살펴본 여러 VPN 종류 중, 선택한 VPN은 바로 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>WireGuard</span>입니다. WireGuard는 최근 각광받고 있는 VPN 으로 빠른 속도와 높은 보안성을 특징으로 가지고 있습니다.  


## 홈서버에서 VPN 구축하기  

### WireGuard 설치하기  

WireGuard는 도커 이미지를 통해 설치하고 구동하도록 하겠습니다.  

[WireGuard 도커 허브](https://hub.docker.com/r/linuxserver/wireguard)    

```bash
sudo docker pull linuxserver/wireguard
```

아래처럼 docker compose 파일을 작성해줍니다.  

```yml
version: "3"

services:
  wireguard:
    image: linuxserver/wireguard
    container_name: wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      - PUID=1000           # 사용자 ID, 관리자 권한과 동일
      - PGID=1000           # 그룹 ID
      - TZ=Asia/Seoul       # 시간대 설정
      - SERVERURL=yourdomain.com # 외부에서 접근할 서버 URL
      - SERVERPORT=<PORT>   # WireGuard 포트
      - PEERS=3             # 클라이언트 수 (추가 가능)
      - PEERDNS=auto        # DNS 서버 자동 설정
    volumes:
      - ./config:/config    # 설정 파일을 저장할 경로
      - /lib/modules:/lib/modules:ro
    ports:
      - <EXT_PORT>:<PORT>/udp  # 외부에서 접속할 포트
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
    restart: unless-stopped

```

아래 항목들은 상황에 맞게 설정해주면 됩니다.  

| 항목         | 설명                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| SERVERURL  | 외부에서 접근할 도메인 이름                                                                                                             |
| SERVERPORT | 외부에서 접근할 포트 번호 (홈서버 포트 번호)                                                                                                  |
| PEERS      | Client 수                                                                                                                    |
| volumes    | 홈서버와 WireGuard 도커 간 Binary Mount<br>위 설정대로 하는 것을 권장합니다.                                                                     |
| ports      | 홈서버와 WireGuard 도커 간 포트포워딩<br>- EXT_PORT : 도커 외부 (홈서버) 포트<br>- PORT : 도커 내부 (와이어가드) 포트<br>WireGuard 서비스는 51820이 기본 포트 번호입니다. |

### 홈서버 네트워크 설정  

홈서버에서 WireGuard를 통한 통신이 홈 네트워크에서도 작동할 수 있도록 네트워크 설정을 해줘야 합니다. iptable 관련 내용은 rocky 기준이므로, 운영체제에 맞춰서 진행해주세요.  

```bash
# WireGuard 포트 방화벽 해제
sudo firewall-cmd --zone=public --add-port=<EXT_PORT>/udp --permanent
sudo firewall-cmd --reload

# EXT_PORT : 홈서버의 포트. 와이어가드 도커의 와이어가드 서비스 포트와 연결되는 포트.
```

```bash
# iptable에 NAT 규칙 및 포트포워딩 설정
# IP대역은 WireGuard의 네트워크 대역을 입력해줘야 함 (ex. 192.56.12.0/24)
sudo iptables-nft -t nat -A POSTROUTING -s <IP대역> -o <네트워크인터페이스명> -j MASQUERADE
sudo iptables-nft -A FORWARD -i wg0 -j ACCEPT
sudo iptables-nft -A FORWARD -o wg0 -j ACCEPT
```

```bash
# iptable 설정 저장
sudo iptables-nft-save > /etc/iptables/rules.v4
sudo ip6tables-nft-save > /etc/iptables/rules.v6
```

```bash
# iptable 설정 부팅시 자동 적용
sudo nano /etc/systemd/system/iptables-restore.service

--------- 파일 내용 ---------
[Unit]
Description=Restore iptables rules on boot
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/sbin/iptables-nft-restore /etc/iptables/rules.v4
ExecStart=/usr/sbin/ip6tables-nft-restore /etc/iptables/rules.v6
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
----------------------------

# 서비스 활성화 및 시작
sudo systemctl daemon-reload
sudo systemctl enable iptables-restore.service
sudo systemctl start iptables-restore.service
```

```bash
# WireGuard에 필요한 커널 모듈 로드 설정
sudo nano /etc/modules-load.d/iptables-modules.conf

-------- 파일 설정 --------
ip_tables
iptable_nat
iptable_filter
ip_conntrack
-------------------------
```

## Reference  

[개발자는 알아야 할 VPN 작동원리](https://www.youtube.com/watch?v=Q0EgiHhw-E4)  
[VPN? 그럼 PN이 무엇인지는 알고 있죠?](https://www.youtube.com/watch?v=6w1F6qnPQiE)  
[WireGuard Docker Image](https://hub.docker.com/r/linuxserver/wireguard/tags?page_size=&ordering=&name=)  
[### 간단하게 Wireguard VPN 세팅하기](https://for2gles.tistory.com/m/67)  
[앱스토어 - WireGuard Client](https://apps.apple.com/us/app/wireguard/id1451685025?ls=1&mt=12  )  
[OpenVPN 대신 WireGuard 구축하기](https://chmodi.tistory.com/161)  
[Wikipedia - 가상사설망](https://ko.wikipedia.org/wiki/%EA%B0%80%EC%83%81%EC%82%AC%EC%84%A4%EB%A7%9D)  
[Wikipedia - WireGuard](https://ko.wikipedia.org/wiki/%EC%99%80%EC%9D%B4%EC%96%B4%EA%B0%80%EB%93%9C)  
[Wikipedia - OpenVPN](https://ko.wikipedia.org/wiki/%EC%98%A4%ED%94%88VPN)  
[Wikipedia - IPsec](https://ko.wikipedia.org/wiki/IPsec)  
[Wikipedia - L2TP](https://ko.wikipedia.org/wiki/%EA%B3%84%EC%B8%B5_2_%ED%84%B0%EB%84%90%EB%A7%81_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)  