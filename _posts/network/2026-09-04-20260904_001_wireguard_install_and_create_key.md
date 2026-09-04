---
title: "[WireGuard] 4. WireGuard 설치와 키 준비" # 제목 (필수)
excerpt: "운영체제별 WireGuard 패키지 설치와 Peer별 개인키 및 공개키 생성 방법" # 서브 타이틀이자 meta description (필수)
date: 2026-09-04 19:15:00 +0900      # 작성일 (필수)
lastmod: 2026-09-04 19:15:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-09-04 19:15:00 +0900  # 최종 수정일 (필수)
categories: network       # 다수 카테고리에 포함 가능 (필수)
tags: network wireguard vpn tunnel peer 터널 암호화 설정 설치 install PrivateKey PublicKey 개인키 공개키 생성       # 태그 복수개 가능 (필수)
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
<!--postNo: 20260904_001-->


## WireGuard 설치와 키 준비

WireGuard VPN을 구성하려면 먼저 WireGuard 도구를 설치하고, 각 장치가 사용할 키 쌍을 생성한 뒤, 각 장치에서 통신에 대한 구성을 설정해줘야 한다.  설치 순서는 다음과 같이 진행한다.  

```plaintext
1. WireGuard를 사용할 장치에 WireGuard 도구 설치  
2. 각 Peer에서 사용할 개인-공개 키 쌍 생성
3. 각 장치의 개인키를 자신의 설정에 등록  
4. 각 장치의 공개키를 상대방 설정에 등록  
5. 비밀키와 설정 파일의 접근 권한 제한  
```

---

<br>

### 1. 운영체제별 WireGuard 설치 방법  

WireGuard 도구에는 키 생성, 인터페이스 실행, 상태 확인 등에 사용하는 `wg`와 `wg-quick` 명령이 포함된다. 운영체제에 따라 패키지 이름과 설치 방법이 다르므로 사용하는 배포판에 맞는 명령을 실행한다.  

#### (1) Alpine Linux 계열  

경험상 보통 VPN은, 그리고 WireGuard는 많은 리소스나 의존 패키지를 필요로 하지 않는다. 따라서 서버-클라이언트 구조의 VPN을 계획하고 있다면, **가벼운 Alpine Linux**는 VPN 서버로 좋은 선택지라고 생각한다.  

Alpine에서 Wireguard는 다음과 같이 설치할 수 있다.

```bash
apk add wireguard-tools
```

설치가 끝나면 다음 명령으로 도구가 정상적으로 설치되었는지 확인한다.

```bash
wg --version
wg-quick --version
```

Alpine Linux는 일반적으로 `systemd`가 아니라 OpenRC를 사용한다. 따라서 이후 서비스 관리나 자동 시작을 구성할 때에는 `systemctl` 명령이 아닌 `rc-service`, `rc-update` 등의 OpenRC 명령을 사용하게 된다.  

일반적인 Linux 환경에서는 `/etc/wireguard/`가 **설정 파일 보관 위치**이다. 이 디렉터리에는 비밀키와 VPN 설정이 함께 저장될 수 있으므로, 생성 후 접근 권한을 제한하는 것이 좋다.  

```bash
sudo mkdir -p /etc/wireguard
sudo chmod 700 /etc/wireguard
```

<br>

#### (2) Debian 및 Ubuntu 계열  

Debian이나 Ubuntu에서는 다음 명령으로 WireGuard를 설치한다.  

```bash
sudo apt update
sudo apt install wireguard
```

설치 후 명령을 확인한다.

```bash
wg --version
wg-quick --version
```

<br>

#### (3) MAC, IPhone  

MAC과 IPhone은 앱스토어에서 WireGuard 애플리케이션을 설치할 수 있다.

![](/assets/images/20260904_001_001.jpg)  

[https://apps.apple.com/kr/app/wireguard/id1451685025?mt=12](https://apps.apple.com/kr/app/wireguard/id1451685025?mt=12)  

> 스크린샷에서 과거 평이 안좋은 것을 볼 수 있는데, 지금은 잘 작동하니 걱정하지 않아도 된다.

<br>

#### (4) Windows, 그 외 OS  

WireGuard 홈페이지에 가면 지원되는 모든 운영체제에서 설치하는 방법을 안내하고 있다.  

[https://www.wireguard.com/install/](https://www.wireguard.com/install/)

<br>

### 2. Peer의 개인-공개 키 생성

WireGuard의 각 Peer는 자신만의 키 쌍을 가진다.  

```text
Private Key ───────► Public Key
```

- **Private Key**: 자신의 장치에만 보관하는 비밀키
- **Public Key**: 상대 Peer의 설정에 등록하는 공개키

통신하는 **두 Peer는 서로 다른 키 쌍을 생성해야** 한다. 한 장치의 비밀키를 다른 장치와 공유하거나, 여러 장치에서 동일한 키를 재사용하는 것은 바람직하지 않다.  

다음은 WireGuard가 설치된 Linux 운영체제에서 Private-Public Key를 생성하는 방법이다. 각 운영체제마다 생성하는 명령어는 다를 수 있지만, 생성 방법은 비슷비슷 하니 참고.  

```bash
sudo mkdir -p /etc/wireguard
cd /etc/wireguard

sudo sh -c 'umask 077; wg genkey | tee private.key | wg pubkey > public.key'
```

명령어가 이렇게 긴 이유는 보안 때문이다. 쓸데 없이 출력하지 않으며, 허가받지 않은 사용자가 키 파일을 열어볼 수 없도록 하기 위해 번거롭지만 다소 긴 명령어를 사용한다.  

누군가는 이렇게 생각할 수 있다. "그냥 중요한 부분인 `wg genkey | tee private.key | wg pubkey > public.key` 만 실행했다가 파일을 바로 지우면 안되나?" .. 실제로 이렇게 생각한 사람이 바로 나다.  그런데 이렇게 보안을 안 지킬 거면 VPN도 안써도 되지 않을까?  

생성된 키를 확인하려면 다음과 같이 실행한다. `cat` 명령어로 화면에 출력할 수도 있지만, 불필요한 출력을 줄이기 위해 편집기를 활용하는 편이 더 낫지 않을까 생각한다.  

```bash
sudo vi /etc/wireguard/private.key
sudo vi /etc/wireguard/public.key
```

<br>

### 3. 공개키를 상대 Peer 설정에 등록하기

키 교환은 다음 원칙을 따른다.

```plaintext
Peer1의 Private Key > Peer1 에만 보관
Peer1의 Public Key > 통신할 상대방(Peer2) 의 [Peer]에 등록

Peer2의 Private Key > Peer2에만 보관
Peer2의 Public Key > Peer1의 [Peer]에 등록
```

이를 설정 관점에서 표현하면 다음과 같다.

| 장치 | `[Interface]`에 입력하는 키 | 상대방의 `[Peer]`에 등록되는 키 |
|---|---|---|
| Peer1 | Peer1의 `PrivateKey` | Peer2의 `PublicKey` |
| Peer2 | Peer2의 `PrivateKey` | Peer1의 `PublicKey` |

예를 들어 Peer1 설정의 `[Peer]` 블록에는 Peer2의 공개키가 들어간다.

```ini
[Peer]
PublicKey = PEER2_PUBLIC_KEY
```

반대로 Peer2 설정의 `[Peer]` 블록에는 Peer1의 공개키를 입력한다.

```ini
[Peer]
PublicKey = PEER1_PUBLIC_KEY
```

<br>

### (추가) qrencode : 설정을 QR로 공유하기  

추후 모바일에도 WireGuard 설정을 심을 것인데, 설정 파일이(특히 키값이) 길다보니 모바일에서의 설정 작업이 여간 귀찮은 게 아니다. 이 때 활용할 수 있는 게 QR코드다.  

설정을 QR 코드로 변환해 쉽게 공유할 계획이라면 `qrencode`도 함께 설치하는 것을 권장한다.  

```bash
apk add wireguard-tools qrencode
```

<br>

### 4. 비밀키와 설정 파일의 보안 관리  

WireGuard의 비밀키는 해당 Peer의 신원을 증명하는 핵심 정보다. 비밀키가 외부에 노출되면 공격자가 해당 Peer를 가장하거나 VPN 네트워크에 접근할 가능성이 있으므로 다음 자료들이 노출되지 않게 보호해야 한다.  

- `PrivateKey`가 저장된 키 파일  
- `wg0.conf`와 같은 WireGuard 설정 파일  
- 모바일용 QR 코드  
- 비밀키가 포함된 터미널 출력 및 로그  
- 메신저나 문서로 전달한 설정 내용  
- 백업 파일과 스냅샷  

우선, 각 Peer 의 Private Key는 각 Peer에서만 관리하도록 한다. 절대 한 장치에서 몰아서 관리하지 않는다.  

키 파일의 기본 권한은 소유자만 읽고 쓸 수 있도록 제한한다.    

```bash
chmod 600 server_private.key
chmod 600 client_private.key
```

설정 파일에도 비밀키가 포함되므로 같은 방식으로 권한을 제한한다.    

```bash
chmod 600 /etc/wireguard/wg0.conf
```

키를 생성할 때 `umask 077`을 사용하면 새로 만들어지는 파일의 접근 권한을 보다 안전하게 설정할 수 있다.    

```bash
umask 077
wg genkey | tee privatekey | wg pubkey > publickey
```

공개키는 상대 Peer에게 전달해도 되지만, 비밀키는 전달해서는 안 된다. 특히 모바일 앱에 설정을 쉽게 가져오기 위해 생성하는 QR 코드에는 비밀키가 포함되어 있으니 잘대 노출하지 않도록 조심한다.  

QR 코드 이미지나 설정 파일을 분실했거나 외부에 노출했다면 해당 Peer의 키를 새로 생성하고, 상대방 장치에 등록된 기존 공개키도 교체해야 한다.  

자 이제 다음 글에서는 드디어 VPN을 구축해볼 차례이다.

<br>

## Reference  

[https://www.wireguard.com/](https://www.wireguard.com/)