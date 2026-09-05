---
title: "[WireGuard] 6. WireGuard 트래픽 전달 방식 설정하기 (Split Tunneling / Full Tunneling)" # 제목 (필수)
excerpt: "AllowedIPs로 이해하는 Split Tunnel과 Full Tunnel: 특정 네트워크부터 전체 인터넷 트래픽까지 전달 경로 설정하기" # 서브 타이틀이자 meta description (필수)
date: 2026-09-06 00:02:00 +0900      # 작성일 (필수)
lastmod: 2026-09-06 00:02:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-09-06 00:02:00 +0900  # 최종 수정일 (필수)
categories: network       # 다수 카테고리에 포함 가능 (필수)
tags: network wireguard vpn tunnel 터널 peer 설정 구축 구성 연결 split full tunneling 분할 터널링 host route 호스트 라우트 subnet routing 서브넷 라우팅 default gateway 기본 게이트웨이 ip forwarding nat     # 태그 복수개 가능 (필수)
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
<!--postNo: 20260906_001-->

# 6. WireGuard 트래픽 전달 방식 설정하기 (Split Tunneling / Full Tunneling)

## 트래픽 전달 방식 알아보기  

WireGuard 터널을 만든다고 해서 모든 트래픽이 자동으로 VPN을 통과하는 것은 아니다. 어떤 목적지로 향하는 패킷을 VPN 터널로 보낼지는 각 Peer의 `AllowedIPs` 설정에 의해 결정된다. 따라서 WireGuard를 실제 네트워크에 적용할 때는 단순히 “연결이 되었는가”뿐 아니라 **“어떤 트래픽이 어느 경로로 전달되는가”를 함께 설계**해야 한다. 

가장 일반적인 방식은 필요한 네트워크만 VPN으로 보내는 **Split Tunneling**이고, 모든 인터넷 트래픽을 VPN 서버를 거쳐 보내는 방식은 **Full Tunneling**이다. 우선 Split Tunnel이 무엇인지, Full Tunnel이 무엇인지부터 알아보면서, 이를 WireGuard에서 어떻게 설정하는지 알아보도록 하겠다.

### 1. Split Tunneling (분할 터널링)  

Split Tunneling **일부 네트워크의 트래픽만 VPN 터널로 전달**하고, 나머지 인터넷 트래픽은 기존 네트워크 연결을 사용하는 방식이다.

![](/assets/images/20260906_001_001.jpg)  

Split Tunneling은  

- 원하는 목적지 IP와의 통신에 대해서만 VPN 터널을 이용한 통신을 한다.  
- 모든 통신이 암호화되지는 않는다. Allowed IPs와의 통신에서의 패킷만 암호화된다.

### 2. Full Tunneling (풀 터널링)  

Full Tunneling은 Split Tunneling과는 다르게 **모든 네트워크 트래픽을 VPN 터널로 전달**하는 방식이다.

![](/assets/images/20260906_001_002.jpg)  

Full Tunneling의 경우  

- 모든 패킷이 암호화된다. 따라서 모든 트래픽이 보안상 비교적 안전하다.
- 모든 패킷에 대해 암호화, 복호화가 필요하며, 무조건 상대 Peer를 거치다 보니 모든 통신에서 속도가 느려진다.

<br>

## WireGuard 트래픽 전달 방식 설정하기

### 1. 단일 Peer 통신 (Split Tunnel - Host Route)  

가장 단순한 형태의 통신으로, 특정 Peer 한 대와만 WireGuard를 통해 통신하도록 구성하는 방식이다.

![](/assets/images/20260906_001_003.jpg)  

이 경우 Peer1과 Peer2의 설정파일은 다음과 같다. (Peer3 설정은 생략한다.)  

```ini
# Peer1
[Interface]
Address = 10.0.0.1/32
PrivateKey = PEER1_PRIVATE_KEY

[Peer]
PublicKey = PEER2_PUBLIC_KEY
Endpoint = XXX.XXX.X.XX:51820
AllowedIPs = 10.0.0.2/32
```

```ini
# Peer2
[Interface]
Address = 10.0.0.2/32
PrivateKey = PEER2_PRIVATE_KEY

[Peer]
PublicKey = PEER1_PUBLIC_KEY
AllowedIPs = 10.0.0.1/32

[Peer]
PublicKey = PEER3_PUBLIC_KEY
AllowedIPs = 10.0.0.3/32
```

여기서 Peer1에 설정된 Peer2 부분을 보자. Peer2의 AllowedIPs는 10.0.0.2/32로, 정확히 하나의 IP 주소만 의미한다. 따라서 Peer1에서 목적지가 10.0.0.2인 패킷만 Peer2를 향한 WireGuard 경로로 전달된다. 결과적으로 **Peer1에서 WireGuard를 통한 통신은 Peer2와의 통신만 가능한 것**이다.  

예를 들어 Peer3의 WireGuard 주소가 10.0.0.3이고, Peer2 뒤에 192.168.10.0/24 사설망이 존재하더라도 이들은 현재 AllowedIPs 범위에 포함되지 않는다. 이 경우, Peer2가 Peer3와 통신할 수 있는 설정을 가지고 있더라도 Peer1은 10.0.0.3 목적지 패킷을 Peer2로 보내지 않는다. 패킷 자체가 Peer2까지 도착하지 않으므로 Peer2가 이를 Peer3로 중계할 기회도 없다.

이 구성은 **특정 Peer와의 직접 통신만 필요할 때 가장 단순하게 사용할 수** 있다

<br>

### 2. VPN 대역 통신 (Split Tunnel - VPN Subnet Route)  

이번에는 특정 Peer 하나가 아니라 같은 WireGuard VPN 주소 대역에 속한 다른 Peer와도 통신할 수 있는 방법을 알아보도록 하자. 아래는 Peer2를 통해 VPN 대역대의 다른 Peer와 통신하는 구성을 그린 그림이다.

![](/assets/images/20260906_001_004.jpg)  

이 경우 Peer들의 설정파일은 다음과 같다.  

```ini
# Peer1
[Interface]
Address = 10.0.0.1/32
PrivateKey = PEER1_PRIVATE_KEY

[Peer]
PublicKey = PEER2_PUBLIC_KEY
Endpoint = XXX.XXX.X.XX:51820
AllowedIPs = 10.0.0.0/24
```

```ini
# Peer2
[Interface]
Address = 10.0.0.2/32
PrivateKey = PEER2_PRIVATE_KEY

[Peer]
PublicKey = PEER1_PUBLIC_KEY
AllowedIPs = 10.0.0.1/32

[Peer]
PublicKey = PEER3_PUBLIC_KEY
AllowedIPs = 10.0.0.3/32
```

```ini
# Peer3
[Interface]
Address = 10.0.0.3/32
PrivateKey = PEER3_PRIVATE_KEY

[Peer]
PublicKey = PEER2_PUBLIC_KEY
Endpoint = XXX.XXX.X.XX:51820
AllowedIPs = 10.0.0.0/24
```

이전 설정 파일과 달라진 점은, Peer1 설정파일 내에 Peer2의 `AllowedIPs` 가 **10.0.0.2/32 에서 10.0.0.0/24로 바뀐 것**이다.  

이렇게 되면 Peer1에서 목적지가 10.0.0.x인 패킷은 모두 Peer2를 향한 WireGuard 경로로 들어가게 되며, 들어오는 출발지가 10.0.0.x 인 패킷 또한 WireGuard 인터페이스를 통하게 된다.  

여기서 **중요한 점은 Peer1이 해당 주소의 실제 최종 위치를 직접 알고 있는 것은 아니라는 점**이다. 예를 들어 Peer3의 WireGuard 주소가 10.0.0.3이고 Peer2가 Peer3에 대한 설정을 가지고 있다면, 패킷은 다음과 같이 전달될 수 있다.  

```plaintext
Peer1
  ↓
목적지 10.0.0.3
  ↓
AllowedIPs = 10.0.0.0/24 에 매칭
  ↓
Peer1 WireGuard → Peer2
  ↓
Peer2가 다시 라우팅
  ↓
Peer3
```

즉 **Peer2가 일종의 VPN 내부 라우터 역할을 하는 구조**다.

<br>

### 3. 원격 사설망 통신 (Split Tunnel - Peer-to-Site)  

WireGuard는 Peer 자체뿐 아니라 **Peer 뒤에 연결된 다른 사설망에 접근**하는 용도로도 사용할 수 있다. 재택근무 할 때 회사 내부망에 연결하는 VPN 구조를 생각하면 된다.

![](/assets/images/20260906_001_005.jpg)  

아래는 원격 사설망 통신 구조를 구축하기 위한 WireGuard 설정파일 예제이다.  

```ini
# Peer1
[Interface]
Address = 10.0.0.1/32
PrivateKey = PEER1_PRIVATE_KEY

[Peer]
PublicKey = PEER2_PUBLIC_KEY
Endpoint = XXX.XXX.X.XX:51820
AllowedIPs = 192.168.10.0/24
```

```ini
# Peer2
[Interface]
Address = 10.0.0.2/32
PrivateKey = PEER2_PRIVATE_KEY

[Peer]
PublicKey = PEER1_PUBLIC_KEY
AllowedIPs = 10.0.0.1/32
```  

이 경우 Peer1은 목적지가 192.168.10.x인 패킷을 Peer2로 전달한다.  

```plaintext
Peer1
  ↓
192.168.10.27 목적지
  ↓
AllowedIPs에 매칭
  ↓
Peer1 WireGuard → Peer2
  ↓
Peer2가 사설망으로 전달
  ↓
192.168.10.27
```

여기서 Peer2는 최종 목적지가 아니라 원격 사설망으로 들어가기 위한 게이트웨이 역할을 한다. Peer2를 중심으로 보면 앞서 살펴본 VPN 대역 구조와 비슷한 통신 구조라고 볼 수 있다.  

이 설정에서는 한 가지 주의할 점이 있다. Peer2의 WireGuard 주소가 10.0.0.2라고 해도 10.0.0.2는 현재 AllowedIPs에 포함되지 않는다. 따라서 Peer2의 WireGuard 주소에도 함께 접근하고 싶다면 다음과 같이 설정할 수 있다.  

```ini
AllowedIPs = 10.0.0.2/32, 192.168.10.0/24
```

또한 **Peer2 뒤의 다른 장치까지 실제로 통신하려면 Peer2가 패킷을 LAN으로 전달해야 하므로 IP forwarding이 필요**하다. 그리고 반대 방향의 응답 패킷도 Peer1로 돌아올 수 있어야 하므로, **정적 라우트를 추가하거나 NAT를 이용하는 방법 등이 필요**하다.

<br>

### 4. Full Tunnel (Default Gateway)  

마지막은 **모든 목적지 트래픽**을 Peer2를 통해 보내는 Full Tunnel 구성이다.

![](/assets/images/20260906_001_006.jpg)  

이 경우 Peer들의 설정파일은 다음과 같다.  

```ini
# Peer1
[Interface]
Address = 10.0.0.1/32
PrivateKey = PEER1_PRIVATE_KEY

[Peer]
PublicKey = PEER2_PUBLIC_KEY
Endpoint = XXX.XXX.X.XX:51820
AllowedIPs = 0.0.0.0/0
```

```ini
# Peer2
[Interface]
Address = 10.0.0.2/32
PrivateKey = PEER2_PRIVATE_KEY

[Peer]
PublicKey = PEER1_PUBLIC_KEY
AllowedIPs = 10.0.0.1/32

[Peer]
PublicKey = PEER3_PUBLIC_KEY
AllowedIPs = 10.0.0.3/32
```

```ini
# Peer3
[Interface]
Address = 10.0.0.3/32
PrivateKey = PEER3_PRIVATE_KEY

[Peer]
PublicKey = PEER2_PUBLIC_KEY
Endpoint = XXX.XXX.X.XX:51820
AllowedIPs = 10.0.0.0/24
```

수정된 부분은 Peer1 의 설정 중 `AllowedIPs` 가 **0.0.0.0/0 으로 세팅**된 부분이다.  

Split Tunnel과 가장 큰 차이는 최종 목적지를 어디까지 VPN으로 보낼 것인지에 대한 판단이 Peer1에서 거의 사라진다는 점이다. Split 방식에서는, WireGuard를 이용해 통신할 대역을 구분(분할=Split)하여 AllowedIPs에 명시했지만, Full Tunnel 방식에서는 이를 0.0.0.0/0 으로 설정하여, **모든 트래픽이 WireGuard를 통해 이뤄지도록** 한다.  

다시 말해, Full Tunnel에서는 WireGuard가 단순히 특정 사설망에 접근하기 위한 통로가 아니라, **Peer1의 기본 네트워크 경로 자체를 Peer2 쪽으로 가져오는 구조**가 된다.  

이 Full Tunnel의 경우, Remote LAN Route와 마찬가지로 Peer2에서 패킷을 다른 네트워크로 전달하려면 역시 **IP forwarding이 필요하며, Peer1의 인터넷 통신을 위해 NAT 설정이 필요**하다.

<br>
<br>

## 서버의 IP Forwarding과 NAT 설정  

### 1. IP Forwarding  

Full Tunnel의 네트워크 흐름을 살펴보면 다음과 같다.

```text
Peer1
10.0.0.1
   │ 암호화된 WireGuard 패킷
   ▼
Peer2 wg0
10.0.0.1
   │ IP Forwarding
   ▼
Peer2 Server eth0
   │ NAT / Masquerade
   ▼
Internet
```

이를 위해, 먼저 서버(Peer2 장치)가 한 네트워크 인터페이스에서 다른 인터페이스로 IP 패킷을 전달하도록 IP Forwarding을 활성화한다.

```bash
sysctl -w net.ipv4.ip_forward=1
```

이 명령은 현재 실행 중인 시스템에 즉시 적용된다. 재부팅 이후에도 유지하려면 시스템의 `sysctl` 설정 파일에 다음 항목을 추가한다.

```text
net.ipv4.ip_forward=1
```

IP Forwarding은 서버 **자신을 목적지로 하지 않는 패킷을 다른 네트워크 인터페이스로 전달할 수 있도록 허용하는 기능**이다. P Forwarding을 활성화하면 여러 네트워크 사이에서 패킷을 전달하는 **라우터 역할**도 수행할 수 있는 것이다.  

예를 들어 Peer1에서 8.8.8.8로 패킷을 전송한다고 해보자. Full Tunnel 환경에서는 이 패킷이 WireGuard 터널을 통해 Peer2의 wg0 인터페이스에 도착한다. 그러나 패킷의 최종 목적지는 Peer2가 아니라 8.8.8.8이다. 따라서 Peer2는 이 패킷을 자신의 애플리케이션에서 처리하는 것이 아니라, 라우팅 테이블을 조회하여 인터넷으로 연결된 eth0 인터페이스로 다시 전달할 것이다.  

### 2. NAT  

그다음 서버(Peer2 장치)의 외부 인터넷 인터페이스를 통해 나가는 패킷에 NAT를 적용한다. 외부 인터페이스가 `eth0`인 경우의 예시는 다음과 같다.

```bash
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

여기서 `eth0`은 서버가 인터넷에 연결된 실제 네트워크 인터페이스를 의미한다. 환경에 따라 `ens3`, `enp1s0` 등 다른 이름을 사용할 수 있으므로 `ip route` 명령으로 실제 인터페이스 이름을 먼저 확인하는 것이 좋다. (출력에서 기본 경로에 연결된 인터페이스를 확인한 뒤, 해당 이름을 `-o` 옵션에 사용한다.)  

NAT 설정은 **Peer1의 사설 VPN 주소를 Peer2가 속한 네트워크의 외부 주소(=공인 IP)로 변환**한다. 외부 인터넷 입장에서는 `10.0.0.1`라는 내부 주소가 아니라 Peer2의 공인 IP에서 접속한 것처럼 보인다. **반면, NAT를 수행하지 않으면 외부 인터넷이 `10.0.0.1`로 응답을 돌려보낼 경로를 알지 못해 통신이 실패**할 수 있다.

### 3. WireGuard 통신 흐름 이해하기  

자, 이렇게 설정된 경우에 Peer1과 Peer2의 설정 내용을 보고, 통신의 흐름을 이해해보도록 하자.  

```text
Peer1
AllowedIPs = 0.0.0.0/0
→ 모든 목적지 트래픽을 Peer2로 전달

Peer2
AllowedIPs = 10.0.0.1/32
→ Peer1트 주소로 돌아가는 트래픽을 해당 Peer로 전달
```

여기서 Peer2의 `AllowedIPs = 10.0.0.1/32`는 Peer1의 VPN 주소인 `10.0.0.2`로 향하는 패킷을 해당 Peer에게 전달하고, 그 Peer가 해당 주소를 사용하도록 식별하는 역할을 한다. 반면 Peer1의 `AllowedIPs = 0.0.0.0/0, ::/0`은 모든 외부 목적지 트래픽을 Peer2로 보내는 역할을 한다.

### 4. 주의사항  

실제 운영 환경에서는 `iptables` 명령이 방화벽 정책에 의해 차단되지 않는지도 확인해야 한다. 또한 클라우드 서버를 사용하는 경우에는 운영체제의 방화벽뿐 아니라 클라우드 보안 그룹이나 네트워크 ACL에서도 WireGuard의 UDP 수신 포트와 필요한 포워딩 트래픽을 허용해야 한다.

## Reference  

[https://www.fortinet.com/kr/resources/cyberglossary/vpn-split-tunneling](https://www.fortinet.com/kr/resources/cyberglossary/vpn-split-tunneling)  
[https://www.wireguard.com/quickstart](https://www.wireguard.com/quickstart)  
[https://ubuntu.com/server/docs/how-to/wireguard-vpn/](https://ubuntu.com/server/docs/how-to/wireguard-vpn/)  
[https://ubuntu.com/server/docs/how-to/wireguard-vpn/vpn-as-the-default-gateway/](https://ubuntu.com/server/docs/how-to/wireguard-vpn/vpn-as-the-default-gateway/)
