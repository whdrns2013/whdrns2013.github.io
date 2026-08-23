---
title: "[Nmap] OS 탐지 모드 (-O)" # 제목 (필수)
excerpt: "Nmap OS 탐지(-O)의 작동 원리와 스캔 결과 상세 분석" # 서브 타이틀이자 meta description (필수)
date: 2026-08-24 01:12:00 +0900      # 작성일 (필수)
lastmod: 2026-08-24 01:12:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-08-24 01:12:00 +0900  # 최종 수정일 (필수)
categories: network       # 다수 카테고리에 포함 가능 (필수)
tags: nmap network scanning os os탐지 tcp/ip tcp ip 홉 hop                   # 태그 복수개 가능 (필수)
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
<!--postNo: 20260824_001-->

# nmap - OS 탐지 모드 (-O)

## `-O` : OS 탐지 모드  

### 1. OS 탐지 모드의 작동 원리  

OS 탐지 모드인 `-O` 옵션은 **대상 호스트의 OS 정보를 확인**하게끔 한다.  nmap이 서버에 직접 OS의 종류와 버전을 묻는 건 아니고, 여러 종류의 패킷을 보내서 **응답 패턴을 관찰**하고 분석해 **OS의 종류를 추론**하는 것이다.  

(**운영체제마다 TCP/IP 네트워크 구현에서 각 요소별로 미묘한 차이가 있기 때문**.)  

```plaintext
TTL
TCP Window Size
TCP Options
ICMP 응답
RST 패킷 형태
패킷 플래그 처리
```

그리고 nmap은 이러한 응답에서 관측된 특징들을 모아서 nmap OS Fingerprint DB에서 가장 유사한 OS 를 탐색해 추정한다.

### 2. OS 탐지 모드 예시  

VM을 띄우고 띄워둔 리눅스 서버에 OS 탐지 모드를 사용해 Nmap을 실행해봤다.  

```bash
sudo nmap -O XXX.XXX.XXX.XXX
```

- 결과

```bash
Starting Nmap 7.98 ( https://nmap.org ) at 2026-08-23 00:22 +0900
Nmap scan report for XXX.XXX.XXX.XXX
Host is up (0.0087s latency).
Not shown: 998 closed tcp ports (reset)
PORT     STATE SERVICE
...
MAC Address: ... (Unknown)
Device type: general purpose|router
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 4.15 - 5.19, OpenWrt 21.02 (Linux 5.4), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 1 hop
...
```

#### 호스트 응답 여부와 지연시간  

```bash
Host is up (0.0087s latency).
```

대상 호스트가 응답하고 있으며, 0.0087s는 약 8.7 ms의 응답 지연시간을 의미.  

#### 열리지 않은 포트 상태  

```bash
Not shown: 998 closed tcp ports (reset)
```

기본 Nmap 스캔에서는 일반적으로 자주 사용하는 TCP 포트 1,000개를 검사했으며, 그중 998개가 closed였다는 뜻. 그리고 (reset)은 해당 포트로 TCP 요청을 보냈을 때 대상이 `RST` 응답을 반환했다는 뜻. 즉, **이 포트에서는 서비스 안하고 있음**을 명확하게 응답한 것.    

**이 정보가 OS 탐지에도 꽤 중요**한데, Nmap 공식 문서에서도 **OS 탐지는 적어도 하나의 open TCP 포트와 하나의 closed TCP 포트가 있을 때 훨씬 효과적**이라고 설명하고 있다.  

#### 열린 포트 상세 정보 

```bash
PORT     STATE SERVICE
22/tcp   open  ssh (예시)
8080/tcp open  http-proxy (예시)
```

**PORT**: 포트 번호와 프로토콜, **STATE**: Nmap이 판단한 상태, **SERVICE**: 해당 포트에 일반적으로 대응되는 서비스

#### MAC 주소 (MAC Address)  

```bash
MAC Address: XX:XX:XX:XX:XX:XX (Unknown)
```

Nmap이 대상의 MAC 주소를 확인했다는 의미이다. Unknown은 MAC 주소의 앞부분인 OUI를 가지고 제조업체를 특정하지 못했다는 의미로 보면 된다. 만약 알려진MAC이었다면 아래와 같이 출력될 수도 있다.  

```bash
MAC Address: XX:XX:XX:XX:XX:XX (Cisco Systems)
```

#### 장비 유형 (Device type)  

```bash
Device type: general purpose|router
```

Nmap이 TCP/IP fingerprint를 기반으로 장비 종류를 추정한 것으로, 여기서는 후보가 **general purpose** 또는 **router** 두 개이다.   

**general purpose**는일반적인 컴퓨터나 서버 계열을 가리키며, **router**는 라우터 또는 네트워크 장비를 가리킨다. 즉, Nmap은 현재 fingerprint만으로는 정확히 대상이 어떤 device인지 확인하지 못했다는 것이다.  

#### 운영체제 계열 (Running)   

```bash
Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
```

여기서 `|`는 OR로 보면 되며, 이를 해석하면 Nmap이 관찰한 TCP/IP fingerprint가 **Linux 4.X**, **Linux5.X**, **MikroTik RouterOS 7.X** 계열과 유사하다고 판단한 것이다.  

주의할 점은 이 응답이 "세 가지 장비 중 하나다" 가 아니라, **"응답으로 미뤄보았을 때, 대상 기기는 이 세 가지 장비의 응답과 유사하다"**라고 봐야 한다는 점이다.  

#### OS CPE (Common Platform Enumeration)    

```bash
OS CPE:
cpe:/o:linux:linux_kernel:4
cpe:/o:linux:linux_kernel:5
cpe:/o:mikrotik:routeros:7
cpe:/o:linux:linux_kernel:5.6.3
```

CPE는 Common Platform Enumeration를 뜻하는데, 이는 소프트웨어나 OS를 표준화된 이름으로 표현하기 위한 형식이다. 예를 들어 **cpe:/o:linux:linux_kernel:5** 를 분해하면 아래와 같다.  

| 부분             | 의미               |
| -------------- | ---------------- |
| o            | Operating System |
| linux        | Vendor           |
| linux_kernel | Product          |
| 5            | Version          |

Nmap OS fingerprint 데이터베이스에 이러한 fingerprint에 대한 정보들이 있다.  

#### 세부 OS 정보 (OS details)  

```bash
OS details:
Linux 4.15 - 5.19,
OpenWrt 21.02 (Linux 5.4),
MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
```

Nmap의 fingerprint DB와 비교했을 때 현재 응답 패턴에 부합하는 후보들을 뜻한다.  

#### 네트워크 거리 (Network Distance)  

```bash
Network Distance: 1 hop
```

Nmap 스캔을 수행한 출발지부터 대상 호스트까지의 네트워크 거리(Hop 수)를 추정한 결과. 여기서 **홉 Hop**이란 패킷이 네트워크 상에서 한 라우터(또는 게이트웨이)를 거쳐 다음 네트워크 장비로 넘어가는 단계를 의미한다.   

따라서 **1 hop**이라는 것은 스캔을 보낸 주체와 대상 호스트 사이에 중간 라우터가 존재하지 않으며, 동일한 로컬 네트워크(L2 동일 대역)나 가상 네트워크에 있다는 것을 뜻한다.  

#### 결과 평가 : 맞지 않음  

결론적으로, Linux 계열이라는 것 하나만 맞았다.  

이렇게 `nmap -O` 옵션을 통해 얻은 대상 서버의 정보는 결론적으로 부정확하고, 불분명했다. 아래에서는 결과가 왜 부정확했는지에 대한 탐구를 진행해본다.  

### 3. OS 탐지 정확성  

왜 위 사례에서는 OS 탐지에 실패했을까?  

nmap 의 OS 탐지 모드는 항상 맞지 않을 수 있다. 이유는, 탐지 실행자와 탐지 대상 사이에 Firewall, NAT, Load Balancer, Reverse Proxy, IPS등이 있으면 실제 서버의 **네트워크 특징이 가려질 수 있기 때문**이다. 또한 Nmap OS 탐지는 일반적으로 열린 포트와 닫힌 포트를 적절히 관찰할 수 있을 때 더 잘 동작한다.  

하지만 분명히 네트워크 거리는 1 홉이었다. 중간에 이를 가릴만한 중간 요소는 없었다는 뜻이다. 그런데 왜 Linux 까지만 맞은 것일까?  

Nmap 탐지 결과가 'Linux' 수준에서 머무른 것은 매우 자연스러운 현상일 수 있다고 한다. Ubuntu 등 배포판 자체가 아닌, 그 기반인 Linux 커널의 네트워크 스택이 TCP/IP 응답을 생성하기 때문이며, Ubuntu, Debian 등 일반 배포판은 물론 OpenWrt나 MikroTik RouterOS 같은 임베디드 OS 모두 Linux 커널을 공유하므로, **TCP/IP 핑거프린트 특성이 서로 매우 비슷하기 때문에 Nmap이 응답 특성이 유사해 후보들을 제시한 것**이다.  

여기에 앞서 말했듯 NAT, 방화벽, 프록시, 로드 밸런서 등 **중간 네트워크 장비가 개입하면 패킷 특성이 변해 오탐이 발생할 가능성**이 더 높아진다. Nmap 공식 문서 역시 이러한 네트워크 환경에서는 OS 핑거프린팅의 정확도가 떨어질 수 있으므로 **단일 탐지 방식에만 의존하지 말 것을 권장**한다.  

### 4. 더 정확하게 OS를 탐지하려면?  

`-O` 옵션에 `-sV` 옵션을 추가하는 게 좋을 수 있다.  

```bash
sudo nmap -O -sV XXX.XXX.XXX.XXX
```

또는 `-A` 옵션을 사용하는 게 결과의 신뢰성이 교차검증될 수 있으므로 권장되고 있는데, 경험상으로도 OS를 추론할 때 `-O` 옵션보다는 `-A` 옵션을 사용했을 때 더 잘 찾았다. 보통의 경우 `-A` 옵션을 사용하는 게 나아 보인다.  

```bash
sudo nmap -A XXX.XXX.XXX.XXX
```

따라서 이번 결과는 "Nmap이 OS를 틀렸다"기보다는 **네트워크 스택 fingerprint만으로 Linux 계열까지는 잘 맞혔지만, 배포판/제품 수준까지 특정할 만큼 분별력 있는 독특한 fingerprint가 탐지되지 않았다**라고 해석하는 것이 가장 적절할 것이다.

## Reference  

[https://nmap.org/book/man.html](https://nmap.org/book/man.html)