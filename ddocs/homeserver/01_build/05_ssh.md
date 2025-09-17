---
title: 홈 서버 만들기 (5) SSH 접속 # 제목 (필수)
excerpt: 세팅한 홈 서버에 원격으로 접속해보자 # 서브 타이틀이자 meta description (필수)
date: 2024-09-18 18:00:00 +0900      # 작성일 (필수)
lastmod: 2024-09-18 18:00:00 +0900   # 최종 수정일 (필수)
permalink: /docs/homeserver/01_build/05_ssh
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_homeserver"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

<!--postNo: 20240918_001-->  

## Intro  

앞선 포스트들에서 서버의 세팅과 네트워크 세팅까지 마쳤습니다. 이제 외부에서 서버를 제어할 수 있도록 SSH를 이용해 서버에 접속해보도록 하겠습니다.  


## SSH 란?  

Secure SHell 의 줄임말로, 원격 호스트에 접속하기 위해 사용되는 보안 프로토콜(통신 방식) 입니다. 기존의 Telnet 이라는 방식의 원격 접속에서 보안성을 높이기 위한 암호화 방식 등을 도입한 통신 방식입니다. [출처 : gabia 라이브러리](https://library.gabia.com/contents/infrahosting/9002/)  

## SSH 설치  

SSH 통신을 위해서는 우선 홈 서버에 SSH-server 를 설치해야 합니다. SSH-server 는 가장 많이 사용되는 openssh-server 를 사용하겠습니다.  

```bash
sudo dnf install openssh-server
```

설치하는 패키지의 이름이 openssh-server 입니다. 이름에서 알 수 있듯이 server 즉 어떠한 클라이언트의 요청에 대해 응답을 하는 server 를 설치합니다. 홈 서버에서는 응답만 하면 되므로 ssh server 만 설치해주면 됩니다. 만약 홈 서버에서 다른 서버로 ssh 통신 요청을 할 일이 있다면 ssh-client도 설치해줘야 합니다.  

설치가 완료되었다면 ssh 서비스를 실행시켜줍니다.  

```bash
sudo systemctl start sshd # ssh 데몬 실행
```

더불어서 ssh 서비스가 서버 시동시 자동으로 실행되도록 설정해주겠습니다.  

```bash
sudo systemctl enable sshd # 서버 시동시 sshd 자동 실행
```

ssh 서버에 대한 설정은 `/etc/ssh/sshd_config` 파일에서 진행할 수 있습니다. 아래에서는 핵심적인 설정 부분을 기재했습니다. sshd_config 설정 파일의 내용을 변경한 뒤 적용을 위해서는 sshd 재시작을 해야 하는 것을 잊지 말아주세요!  

```bash
sudo vi /etc/ssh/sshd_config # ssh 설정 파일

Port 22 # ssh 포트 번호 지정
ListenAddress 0.0.0.0 # 접속 허용 IP (0.0.0.0 : Any)
PermitRootLogin no # root 계정으로 로그인 허용 여부

sudo systemctl restart sshd  # ssh 설정 변경 적용
```


## 포트포워딩  

외부 네트워크와 내부 네트워크 게이트웨이 단의 라우터에서 포트포워딩을 진행해줍니다. 즉, 외부에서 홈 네트워크의 공인 IP로 접근해서 내부 네트워크에 있는 홈 서버의 SSH 서비스 포트로 접근할 수 있게 포트끼리 매핑을 해주는 작업이 필요합니다. 이 부분은 이전 포스팅을 참고해주세요. sshd의 기본 포트는 22번이라는 점을 잊지 말아주세요!  

[홈 서버 만들기 (4) 포트포워딩과 DMZ](https://whdrns2013.github.io/infra/20240916_001_setting_homeserver_04/)  

## 노트북 및 모바일 기기에서 SSH 클라이언트 설치 및 이용  

이제 준비는 끝났습니다. 이제 홈서버에 접속을 시도할 기기들에 SSH 클라이언트를 설치하고 홈서버와 SSH 통신을 해보겠습니다. 이 부분 또한 이전 포스팅을 참고해주세요.  

[ssh key 발급 및 등록(윈도우)](https://whdrns2013.github.io/network/20240214_002_ssh_key/)  
[모바일 환경에서 SSH 키 발급받기](https://whdrns2013.github.io/network/20240915_001_mobile_ssh_key/)  


## Reference  

[gabia 라이브러리 - SSH 명칭부터 접속까지 한 번에 이해하기 1](https://library.gabia.com/contents/infrahosting/9002/)