---
title: "[WireGuard] 2. WireGuard의 네트워크 구조 이해하기" # 제목 (필수)
excerpt: "WireGuard를 이용한 네트워크의 구조를 대략적으로 알아보자" # 서브 타이틀이자 meta description (필수)
date: 2026-09-02 21:25:00 +0900      # 작성일 (필수)
lastmod: 2026-09-02 21:25:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-09-02 21:25:00 +0900  # 최종 수정일 (필수)
categories: network       # 다수 카테고리에 포함 가능 (필수)
tags: network wireguard vpn tunnel peer 터널 암호화 네트워크 구조                  # 태그 복수개 가능 (필수)
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
permalink: 
sidebar:
  nav: 
pinned: 
series: 
series_index:
---
<!--postNo: 20260902_001-->

# 2. WireGuard의 네트워크 구조 이해하기

## WireGuard의 네트워크 구조 이해하기

> 그냥 쭉 한 번 읽고 다음으로 넘어가도 되는 글입니다.  

### (1) 두 개의 주소가 필요하다.  

WireGuard를 설정할 때 가장 먼저 이해해야 할 것은 **“인터넷을 통해 연결되는 주소”와 “VPN 터널 안에서 사용하는 주소”가 서로 다르다는 점**이다. WireGuard는 기존 인터넷 회선을 없애거나 대체하는 것이 아니라, 신뢰하기 어려운 네트워크 위에 별도의 암호화된 가상 네트워크를 추가한다. *이 부분은 대부분의 터널형 VPN에서는 공통적인 사항이다.)  

따라서 하나의 장치는 동시에 두 종류의 네트워크에 속할 수 있다.  

- 인터넷에서 상대방을 찾기 위한 실제 주소
- WireGuard 터널 내부에서 통신하기 위한 가상 주소

이 두 주소의 역할을 구분하면 WireGuard 설정 파일에 등장하는 `Address`, `Endpoint`, `AllowedIPs`의 관계도 자연스럽게 이해할 수 있다.

<br>

### (2) 암호화 터널과 가상 IP 네트워크  

WireGuard 연결을 단순화하면 다음과 같이 표현할 수 있다.  

```text
Peer2
실제 주소: 192.168.x.x
   │
   │ 일반 인터넷
   ▼
┌──────────────────────────────┐
│ WireGuard 암호화 터널           │
│                              │
│ 터널 내 네트워크: 10.0.0.0/24    │
└──────────────────────────────┘
   │
   ▼
Peer1
실제 주소: 111.111.111.111
```

Peer2와 Peer1은 인터넷상에서 서로 다른 실제 주소(공인 IP)를 사용한다. 예를 들어 Peer1이 공인 IP `111.111.111.111`을 가지고 있고, WireGuard가 UDP `51820` 포트에서 연결을 기다린다고 하자. Peer2가 주소와 포트를 이용해 Peer1을 찾는다.

```ini
Endpoint = 111.111.111.111:51820
```

여기서 `Endpoint`는 WireGuard 터널 내부의 주소가 아니다. 인터넷상에서 상대 Peer에 도달하기 위한 실제 접속 주소(공인 IP)다. 반면 터널이 구성된 뒤 두 장치가 VPN 내부에서 사용하는 주소는 별도로 지정한다.

```text
WireGuard Network: 10.0.0.0/24

Peer1   10.0.0.1
Peer2   10.0.0.2
```

설정 파일에서는 다음처럼 표현한다.

```ini
# Peer1
[Interface]
Address = 10.0.0.1/24

# Peer2
[Interface]
Address = 10.0.0.2/32
```

이때 `10.0.0.1`과 `10.0.0.2`는 인터넷에서 직접 사용되는 공인 IP가 아니다. WireGuard 인터페이스에 할당된 가상 IP이며, 암호화 터널이 활성화된 뒤 VPN 내부 통신에 사용된다. Peer1에서 다음 명령을 실행하면 인터넷을 거쳐 전달된 패킷이 VPN 내부 주소를 통해 Peer2에 도달한다.

```bash
ping 10.0.0.1
```

전체 흐름을 단순화하면 다음과 같다.

```text
Peer2 내 애플리케이션
     │
     ▼
10.0.0.1로 향하는 패킷
     │
     ▼
Peer2 내 WireGuard 인터페이스(wg0)
     │
     │ 암호화 및 실제 인터넷 주소로 전송
     ▼
Peer1의 Endpoint
111.111.111.111:51820
     │
     ▼
복호화
     │
     ▼
Peer1의 WireGuard 주소
10.0.0.1
```

즉 패킷의 논리적인 목적지는 `10.0.0.1`이지만, 인터넷을 통과하는 동안에는 WireGuard가 이를 암호화해 Peer1의 실제 Endpoint로 전달한다. 수신 측에서는 패킷을 복호화한 뒤 VPN 내부의 목적지 주소에 맞게 처리한다.

주소의 역할을 다음과 같이 정리할 수 있다.

| 구분 | 예시 | 역할 |
|---|---|---|
| 실제 인터넷 주소 | `111.111.111.111` | 인터넷에서 장치를 찾는 주소 |
| `Endpoint` | `111.111.111.111:51820` | 상대 Peer의 실제 IP와 UDP 포트 |
| WireGuard `Address` | `10.0.0.1` | VPN 내부에서 사용하는 가상 IP |
| VPN 네트워크 | `10.0.0.0/24` | 여러 Peer가 공유하는 가상 네트워크 대역 |

이 구분은 특히 사설 IP를 사용하는 Client에서 중요하다. Client가 공유기 뒤에 있어 실제 인터넷 주소가 `192.168.x.x`와 같은 사설 주소라 하더라도, WireGuard는 NAT를 통과해 Server와 암호화 터널을 구성할 수 있다. 다만 외부에서 먼저 연결을 받아야 하는 Peer라면 포트 포워딩이나 방화벽 설정이 필요할 수 있으며, NAT 환경의 Client에서는 뒤에서 설명할 `PersistentKeepalive`가 유용할 수 있다. 이에 대해서는 뒤에서 더 자세히 다뤄보도록 한다.  

<br>

### (3) 중앙 서버형 구성과 다중 Peer 구성

실무에서는 하나의 고정 주소를 가진 Peer를 중앙 Server처럼 사용하고, 여러 장치(Client Peer)가 이 Server에 연결하는 구성을 흔하게 사용한다.  

> 단 주의하자. WireGuard는 Server-Client 구조가 아니라 Peer-Peer 구조이다. Server와 Client는 이해를 돕고자 풀어서 사용한 단어이다.  

```text
                         Internet

                 Peer1 (WireGuard Server 역할)
                 실제 주소: 203.0.113.10
                 VPN 주소: 10.0.0.1
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Peer           Peer           Peer 
     (Client1)      (Client2)      (Client3)
      10.0.0.2       10.0.0.3       10.0.0.4
```

Peer1(Server 역할)의 설정에는 각 Client Peer(Peer2 ~ 4)를 별도의 `[Peer]`로 등록한다.

```ini
# Peer1 의 설정 파일
[Interface]
PrivateKey = SERVER_PRIVATE_KEY
Address = 10.0.0.1/24
ListenPort = 51820

[Peer]
# Client 1
PublicKey = CLIENT1_PUBLIC_KEY
AllowedIPs = 10.0.0.2/32

[Peer]
# Client 2
PublicKey = CLIENT2_PUBLIC_KEY
AllowedIPs = 10.0.0.3/32

[Peer]
# Client 3
PublicKey = CLIENT3_PUBLIC_KEY
AllowedIPs = 10.0.0.4/32
```

각 Client Peer 역시 Peer1(중앙 Server 역할)를 하나의 Peer로 등록한다.

```ini
[Interface]
PrivateKey = CLIENT1_PRIVATE_KEY
Address = 10.0.0.2/32

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = vpn.example.com:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25
```

여기서 Server Peer의 `AllowedIPs`는 각 Peer의 고유한 VPN 주소(더 정확한 표현은 다음 글에서 살펴보자)를 가리킨다. 예를 들어 `10.0.0.2/32`는 `10.0.0.2`라는 단 하나의 주소를 Client 1 Peer에 할당한다는 뜻이다. Peer1(Server)는 이 정보를 바탕으로 `10.0.0.2`로 향하는 패킷을 Client 1 Peer에게 전달한다.

반대로 Client Peer의 **`AllowedIPs = 10.0.0.0/24`는 VPN 내부 네트워크 전체로 향하는 트래픽을 Server Peer를 통해 보내겠다는 의미**다. 이 설정이 있기 때문에 Client Peer는 `10.0.0.1`인 Server뿐 아니라 다른 VPN Client의 주소에도 WireGuard를 통해 접근할 수 있다. 단, 실제로 Client 간 통신을 허용하려면 Server의 IP forwarding과 방화벽 정책도 함께 확인해야 한다.

다중 Peer 구성에서 가장 중요한 운영 규칙은 **각 Peer의 VPN 주소와 `AllowedIPs`가 서로 겹치지 않도록 관리하는 것**이다.

```text
Client 1 Peer → 10.0.0.2/32
Client 2 Peer → 10.0.0.3/32
Client 3 Peer → 10.0.0.4/32
```

두 Peer에 동일한 주소 대역을 지정하면 Server Peer가 해당 트래픽을 어느 Peer로 보내야 할지 판단하기 어려워지고, 라우팅 충돌이나 예기치 않은 연결 문제가 발생할 수 있다. 따라서 새로운 장치를 추가할 때는 먼저 사용하지 않은 VPN 내부 IP를 배정한 뒤, 해당 주소를 그 장치의 설정과 Server Peer의 `[Peer]` 설정에 일관되게 반영해야 한다.  

결국 중앙 서버형 WireGuard 네트워크는 다음 세 가지 관계로 정리할 수 있다.  

-  각 장치는 자신의 `[Interface]`에 고유한 Private Key와 VPN 내부 `Address`를 가진다.  
- 각 장치는 통신할 상대방을 `[Peer]`에 Public Key로 등록한다.  
- 각 Peer의 `AllowedIPs`를 통해 어느 트래픽을 어느 상대방에게 전달할지 결정한다.  

이제 이러한 구조를 실제 설정 파일에 옮기려면 각 항목의 의미를 더 세밀하게 살펴봐야 한다. 다음 절에서는 `[Interface]`와 `[Peer]`를 중심으로 WireGuard의 구조와 설정 파일 내에서 볼 수 있는 `PrivateKey`, `PublicKey`, `Address`, `Endpoint`, `AllowedIPs`가 무엇인지를 살펴보도록 한다.

## Reference  

[https://www.wireguard.com/](https://www.wireguard.com/)