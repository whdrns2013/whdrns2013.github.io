---
title: "[홈서버] 리눅스 가상화 플랫폼 만들기 - 1.KVM과 Cockpit 설치" # 제목 (필수)
excerpt: "KVM과 Cockpit을 이용해서 쉽게 가상 머신 만들기"  # 서브 타이틀이자 meta description (필수)
date: 2026-02-08 23:10:00 +0900      # 작성일 (필수)
lastmod: 2026-02-08 23:10:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-02-08 23:10:00 +0900   # 최종 수정일 (필수)
categories: Infra         # 다수 카테고리에 포함 가능 (필수)
tags: infra 인프라 홈서버 homeserver server kvm cockpit ubuntu 가상화 가상머신 virtualization virtual machine                     # 태그 복수개 가능 (필수)
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
  nav: docs_homeserver
pinned: 
---
<!--postNo: 20260208_001-->

## Intro  

홈서버를 운영하다 보면, 단순히 Docker와 같은 컨테이너 격리만으로는 부족한 순간들이 있습니다. 컨테이너는 가볍고 편리하지만, 결국 하나의 운영체제 위에서 프로세스 단위로 격리되는 구조이다보니 여러 가지 제약이 존재합니다.  

예를 들어 완전히 독립된 운영체제가 필요하거나, 서로 다른 OS 종류(리눅스-윈도우)를 동시에 운영해야 하거나, 또는 네트워크 레벨에서 완전히 분리된 환경이 필요한 경우에서는 컨테이너만으로는 한계가 있습니다.  

이번 포스팅 시리즈에서는 **정말 쉽게** 홈서버에 가상화 플랫폼을 구축하고, 그 위에서 실제로 여러 개의 가상 머신을 운영하는 과정을 정리해보도록 하겠습니다.  

## 가상화 플랫폼 만들기  

### 가상화 플랫폼  

> 하나의 물리 서버를 여러 대의 가상 서버처럼 활용할 수 있도록 만들어주는 기반 환경  

가상화 플랫폼이란, **하나의 베어메탈 서버 위에서 여러 개의 독립적인 가상 서버(정확히는 가상 머신 -VM)을 실행하고, 관리**할 수 있도록 구성된 환경을 말합니다. 가상화 플랫폼은 일반적으로 아래와 같은 역할을 수행합니다.  

- 물리 서버의 CPU, 메모리, 저장공간 등의 자원을 여러 VM에 분배한다.  
- 각 VM을 완전히 독립된 시스템처럼 동작하도록 격리한다.  
- 네트워크, 저장공간 등을 가상화하여 제공한다.  
- VM의 생성, 삭제, 백업, 스냅샷을 관리한다.  

> 베어메탈 서버 (Bare-metal server) : 가상 머신이 아닌 물리적 서버를 뜻하는 용어.  


### 가상화 플랫폼을 구축하면 뭐가 좋은데?  

하나의 물리적인 서버에 가상화 플랫폼을 구축하면 다음과 같은 이점을 얻을 수 있습니다.  

- 하나의 물리적 서버 위에 완전히 독립적인 여러 가상 서버를 운용  
- 리눅스, 윈도우 등 다양한 OS를 하나의 머신에서 구동할 수 있음  
- 각 가상 서버는 필요할 때만 켜고 끌 수 있음  

### 사용하는 기술  

이번 포스팅 시리즈에서는 KVM 과 Cockpit 두 가지를 이용해 가상화 환경을 구축할 예정입니다. KVM이란, 실제 가상 머신을 구동하는 핵심 기술이며, Cockpit은 이를 웹 UI로 손쉽게 관리할 수 있도록 도와줍니다. 이 두 가지가 무엇인지는 다음 단락에서 알아보도록 하겠습니다.  

- KVM : 가상머신 구동 엔진  
- Cockpit : 가상머신 생성 및 관리 웹 UI  


### 왜 KVM + Cockpit 구조를 선택했나?  

여기에는 크게 두 가지 이유가 있습니다.  

#### (1) 하드웨어의 제약  

제가 사용하는 홈서버는 비교적 저렴하게 구매한 하드웨어입니다. 그러다 보니 펌웨어 완성도가 높지 않았고, 이로 인해 설치할 수 있는 운영체제에도 제약이 있었습니다.  

처음에는 Proxmox나 XCP-ng 같은 전용 가상화 솔루션을 사용하려고 했습니다. 하지만 여러 버전을 바꿔 가며 설치를 시도해 보았음에도 정상적으로 동작하지 않았고, 결국 하드웨어 또는 펌웨어 호환성 문제로 해당 솔루션들을 사용할 수 없다는 결론을 내리게 되었습니다.  

그래서 범용 리눅스 환경에서 안정적으로 사용할 수 있는 대안을 찾게 되었고, 그 결과가 KVM 기반 구성입니다.  

#### (2) 가벼움과 안정성  

KVM은 리눅스 커널에 기본적으로 내장된 가상화 기술입니다. 별도의 무거운 가상화 OS를 설치할 필요 없이 기존 리눅스 환경 위에서 바로 사용할 수 있기 때문에 오버헤드가 매우 적습니다.

또한 서버 환경에서 오랜 기간 검증된 기술이기 때문에 안정성도 뛰어나며, 성능 면에서도 효율적입니다. 이러한 이유로, 제 홈서버 환경에는 KVM 기반의 가상화 구조가 가장 적합하다고 판단했습니다.


## KVM

### 소개  

![](/assets/images/20260208_001_001.png)  

- Kernel-based Virtual Machine  

**KVM은 리눅스 커널에 내장된 하이퍼바이저 기술**로, 커널 레벨에서 동작하는 **가상화 엔진**입니다. 쉽게 말해, 일반적인 리눅스를 가상화 호스트로 변환하고, 그 위에 여러 개의 가상 머신(VM)을 실행할 수 있도록 해주는 기반 기술이라고 볼 수 있습니다.  

KVM 환경에서는 각각의 가상 머신(VM)이 하나의 독립적인 프로세스처럼 관리됩니다. 또한 Intel VT-x, AMD-V 와 같은 CPU의 가상화 기능을 직접 사용하기 때문에, 가상 머신을 거의 네이티브에 가까운 성능으로 실행할 수 있습니다.  

> 하이퍼바이저 기술 : 하나의 물리 하드웨어 위에서 여러 개의 가상 머신을 실행할 수 있도록 해주는 가상화 소프트웨어 기술  

### KVM의 구조

| 구분 | 내용 |
| --- | --- |
| KVM 커널 모듈 | • `kvm.ko` / `kvm_intel.ko` / `kvm_amd.ko`<br> • 위 모듈들이 CPU 하드웨어 가상화 기능을 활용함<br> • 즉, “가상화 엔진” |
| 사용자 공간 도구 | • `QEMU`, `libvirt`, `virt-manager`, `virsh`<br> • 실제 가상머신을 실행하고 관리하는 부분<br> • 즉, “관리 도구” |

KVM 자체는 커널 레벨에서 동작하는 가상화 엔진이며, 실제로 VM을 만들고 운영하기 위해서는 QEMU나 libvirt같은 사용자 공간 도구들이 함께 사용됩니다.  

### KVM의 특징  

- 리눅스 커널에 기본으로 포함되므로 별도 설치가 필요 없음  
- Type1 하이퍼바이저 구조에 가까워, 성능이 우수함  
- 하드웨어 가상화 기능을 직접 사용하므로 안정성과 속도가 뛰어남  
- 위 이유로, 성능 오버헤드가 매우 적음  
- 오픈소스 기반으로 무료 사용 가능  


## Cockpit  

### 소개  

![](/assets/images/20260208_001_002.png)  

- 리눅스 서버를 웹에서 관리할 수 있게 해주는 **경량 웹 기반 관리 도구**입니다.  
- KVM과 연동하면 **가상머신 관리 UI**로 사용할 수 있습니다.  

### Cockpit의 특징

- 웹 브라우저 기반 관리 (`https://서버IP:9090`)  
- 서버 자원(CPU, 메모리, 디스크) 모니터링 포함  
- 터미널을 웹 기반으로 사용할 수 있음  
- KVM/libvirt 공식 연동  
- VM 생성, 삭제, 콘솔 접속 가능  
- 매우 가볍고 단순한 구조  


## 설치  

### 환경 소개  

- OS: Ubuntu Server 22.04 LTS  

### KVM 설치

```bash
sudo apt update
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
```

### Cockpit 설치

```bash
sudo apt install -y cockpit cockpit-machines
sudo systemctl enable --now cockpit
```

### 네트워크 설정

- VM 이 직접 LAN 에 붙을 수 있도록 브릿지 네트워크를 추가해줍니다.  
- interfaces 에는 `ip a` 명령어로 확인한 실제 물리 네트워크 인터페이스 이름을 기재합니다.  

```bash
sudo vi /etc/netplan/01-bridge.yaml
```

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp1s0:
      dhcp4: no
  bridges:
    br0:
      interfaces: [물리 네트워크 인터페이스 이름]
      dhcp4: yes
```

```bash
sudo netplan apply
```

### Cockpit 접속

```bash
https://서버IP:9090
```

- 로그인 화면 : 계정과 비밀번호는 리눅스의 계정, 비밀번호와 동일  

![](/assets/images/20260208_001_003.png)  

- 로그인 후 화면(대시보드)  

![](/assets/images/20260208_001_004.png)  


<details>
<summary> Trouble Shooting - 로그인 후 응답이 없거나 하얀 화면만 뜨는 경우 (펼치기/접기) </summary>
<div markdown='1'>

로그인 후 응답이 없거나 하얀 화면만 뜨는 경우가 있습니다. 제 경우 인증서 신뢰 문제여서 아래와 같이 해결했습니다.  

![](/assets/images/20260208_001_005.png)  

```bash
sudo apt install -y ca-certificates openssl libgnutls30 gnutls-bin sscg
sudo update-ca-certificates --fresh
```

```bash
sudo systemctl stop cockpit
sudo rm -rf /etc/cockpit/ws-certs.d/*
sudo systemctl start cockpit
```

- 브라우저에 돌아와서 인증서 신뢰


</div>
</details>


## Reference  

[https://aws.amazon.com/ko/what-is/kvm/](https://aws.amazon.com/ko/what-is/kvm/)  
[https://cockpit-project.org/documentation.html](https://cockpit-project.org/documentation.html)  
[https://feccle.tistory.com/207#google_vignette](https://feccle.tistory.com/207#google_vignette)  
[https://en.wikipedia.org/wiki/Bare-metal_server](https://en.wikipedia.org/wiki/Bare-metal_server)  