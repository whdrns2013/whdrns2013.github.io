---
title: 리눅스 포맷과 설치 (feat ventoy)
excerpt: Ventoy를 사용한 리눅스 설치 및 포맷 방법 안내
date: 2024-06-26 10:30:00 +0900
lastmod: 2024-06-26 10:30:00 +0900
last_modified_at: 2024-06-26 10:30:00 +0900
categories: Linux
tags: 리눅스 설치 포맷 ventoy Linux installation format
classes: 
toc: true
toc_label: 
toc_sticky: true
header: 
  image: 
  teaser: 
  overlay_image: /assets/images/banners/banner.png
  # overlay_color: '#333'
  video:
    id: 
    provider: 
sitemap: 
  changefreq: daily
  priority: 1.0
author: 
---
<!--postNo: 20240626_001-->

## Intro  


## 설치 준비

### Ventoy  

Ventoy란 ISO/WIM/IMG/VHD(x)/EFI 파일을 위한 부팅 가능한 USB 드라이브를 만드는 오픈 소스 도구입니. 쉽게 말해서 부팅 디스크를 만들어주는 프로그램이죠.  

Ventoy는 아래와 같은 장점이 있습니다. 하나의 USB에 여러 OS를 담을 수 있는 있다는 아주 강력한 장점을 가지고 있습니다. 하나의 부팅 디스크로 상황에 따라 Rocky를 설치할 수도, Ubuntu를 설치할 수도 있는 것이죠. 그저 Ventoy가 설치된 USB에 OS 이미지 파일을 넣어주기만 하면 됩니다.  

[https://www.ventoy.net/](https://www.ventoy.net/en/download.html)  

먼저 USB를 PC에 삽입한 뒤, 위 링크에서 다운로드 받은 압축 파일을 압축을 해제한 뒤 Ventoy2Disk 프로그램을 실행합니다.  

실행된 프로그램에서 Device 를 USB 드라이브로 지정한 뒤, Install을 눌러줍니다. USB 안에 있는 데이터들이 모두 삭제된다는 경고 문구가 보일 텐데, 괜찮다면 '예'를 눌러 진행합니다.(더블체크)  

설치가 완료되면, 설치 프로그램에서 Ventoy In Device 부분이 Ventoy In Package 의 값과 동일해짐을 볼 수 있습니다. Ventoy 드라이브가 성공적으로 만들어졌습니다.  

### 설치 이미지  

설치할 OS의 이미지를 다운로드 받습니다.  

Rocky 다운로드  
[https://rockylinux.org/ko/download](https://rockylinux.org/ko/download)  

Ubuntu 다운로드  
[https://ubuntu.com/download](https://ubuntu.com/download)  

Alpine 다운로드  
[https://alpinelinux.org/downloads/](https://alpinelinux.org/downloads/)  

Kali 다운로드  
[https://www.kali.org/get-kali/#kali-installer-images](https://www.kali.org/get-kali/#kali-installer-images)  


### 설치 이미지의 종류  

아래 설치 이미지 종류를 참고해주세요!  

|OS|구분|설명|GUI|
|---|---|---|---|
|Rocky|DVD|모든 패키지를 포함한 전체 설치 이미지로, 네트워크 연결 없이도 설치할 수 있습니다.|포함|
|Rocky|Boot|인터넷을 통해 Rocky Linux를 설치하는 데 사용되는 부팅 이미지입니다.|미포함|
|Rocky|Minimal|필수 패키지만 포함된 최소 설치 이미지로, 네트워크를 통해 필요한 패키지를 추가 설치할 수 있습니다.|미포함|
|Ubuntu|Desktop|일반 데스크탑 사용자용 그래픽 인터페이스를 포함한 설치 이미지입니다.|포함|
|Ubuntu|Server|서버 환경에 최적화된 설치 이미지로, GUI가 포함되지 않습니다.|미포함|
|Ubuntu|Network installer|네트워크를 통해 설치할 수 있는 작은 크기의 설치 이미지입니다.|미포함|
|Alpine|STANDARD|기본 Alpine Linux 시스템 설치 이미지입니다.|미포함|
|Alpine|EXTENDED|추가 패키지를 포함한 확장 설치 이미지입니다.|미포함|
|Alpine|NETBOOT|네트워크를 통해 부팅하고 설치할 수 있는 최소 설치 이미지입니다.|미포함|
|Kali|Everything|모든 Kali Linux 도구가 포함된 전체 설치 이미지입니다.|포함|
|Kali|Installer|기본 Kali Linux 도구를 포함한 표준 설치 이미지입니다.|포함|
|Kali|NetInstaller|네트워크를 통해 설치할 수 있는 최소 설치 이미지입니다.|미포함|


## 포맷 및 설치  

### 부팅 순서 변경  

(1) Ventoy 혹은 ISO 파일이 담긴 설치 USB를 꽂은 후 머신을 부팅합니다.  
(2) 지정 키를 눌러 CMOS 설정 메뉴로 진입합니다. (보통 F2나 DEL 키)  
(3) 부팅 순서를 설치 USB가 최우선이 되도록 변경합니다.  
(4) 부팅 순서 변경 사항을 저장하고 재부팅합니다.  

### 설치 시작  

(1) 재부팅 후 보이는 Ventoy 설치 화면에서 설치할 OS 를 선택해줍니다.  
(2) Boot 옵션은 Grub2로 선택합니다.  
(3) 이후 설치 목적에 맞게 옵션을 선택해주며 설치를 진행합니다.  
(4) 주요 설정은 아래에서 별도로 다룰 것입니다. 그 외의 언어, 시간대 설정은 알맞게 진행하면 됩니다.  

### 디스크 설정  

(1) 먼저 Mount된 모든 파티션을 해제 (Reformat / Delete) 합니다.  
해제하면 해당 영역에 저장된 모든 데이터가 삭제됩니다.  

(2) BOOT 디스크를 설정해줍니다.  
SIZE : 1G  
MOUNT : /  
FORMAT : /boot (포맷 선택 란이 없을 경우는 MOUNT에 /boot 입력)  

/boot 가 ext4 포맷으로 1G 잡힐 것이고  
/boot/efi 가 xfs 포맷으로 1G 잡힐 것입니다.  

(3) SWAP 디스크를 설정해줍니다.  
SIZE : 16G  
MOUNT : /  
FORMAT : swap (포맷 선택 란이 없을 경우는 MOUNT에 swap 입력)  

(4) 나머지는 알맞게 나눠 배분하면 됩니다.  

>RAID 설정은 5번을 참고하세요.  

예를 들어 `/data` 에 300G, `/home` 에 200G 등 ..  
예시로 나머지 모든 용량을 home에 주게끔 하려면 아래와 같이 설정할 수 있습니다.  
SIZE : (빈칸은 나머지 전체 용량을 의미함)  
MOUNT : /home  
FORMAT : 해당 없음  
**RAID 설정을 하려면 (5) 번을 참고하세요**  

(5) RAID 설정  
볼륨 그룹을 생성하고, 레이드 단계를 설정합니다.  
<b><font color="FF82B2">==> 내용 추가 필요</font></b>  


### 사용자 생성  

사용자를 생성해줍니다. ID와 PASSWORD는 잊어버리지 않게 조심하세요!  


## 설치 후 세팅  

### root 비밀번호 세팅  

<<< https://www.psychz.net/client/question/ko/how-to-change-root-password-in-linux.html >>>

### IP Address 세팅  

#### 레드햇 계열  

<<< https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=tawoo0&logNo=221606425141 >>>

<<< https://velog.io/@calintzcs/%EC%A0%95%EB%B3%B4-CentOSRHELRocky-LinuxOracle-Linux%EC%97%90%EC%84%9C-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%84%A4%EC%A0%951-IP-%EC%84%A4%EC%A0%95 >>>

#### 우분투  
<<< https://passing-story.tistory.com/entry/Linux-%EC%9A%B0%EB%B6%84%ED%88%AC-%EA%B3%A0%EC%A0%95-IP-%EC%84%A4%EC%A0%95-Ubuntu-Static-IP-%EC%84%A4%EC%A0%95 >>>

```yaml
nano /etc/netplan

network:
    ethernets:
        eno1:
            dhcp4: no
            addresses:
            - 10.200.0.77/23
            nameservers:
                addresses:
                - 8.8.8.8
                search: []
            routes:
            - to: default
              via: 10.200.0.1
    versions: 2
    wifis: {}
```


### Network 세팅  
<<<<https://velog.io/@calintzcs/%EC%A0%95%EB%B3%B4-CentOSRHELRocky-LinuxOracle-Linux%EC%97%90%EC%84%9C-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%84%A4%EC%A0%951-IP-%EC%84%A4%EC%A0%95>>>>

### ssh 세팅  


### 방화벽 세팅 (레드햇 계열 해당)  


### SELinux 세팅 (레드햇 계열 해당)  


### 우분투 대기모드 해제  



데비안 계열과 레드햇 계열을 나눠서


## 서버 사양 확인하기  

<<< https://goldsony.tistory.com/44 >>>

## 관련 용어 정리  

|용어|설명|
|---|---|
|체크섬| <<< https://ko.wikipedia.org/wiki/%EC%B2%B4%ED%81%AC%EC%84%AC >>> |
|BIOS| <<< https://chatgpt.com/share/f1f0bb4b-94e3-4f80-9850-23425a8107d0 >>> |
|CMOS| <<< https://chatgpt.com/share/f1f0bb4b-94e3-4f80-9850-23425a8107d0 >>> |
|UEFI| <<< https://chatgpt.com/share/f1f0bb4b-94e3-4f80-9850-23425a8107d0 >>> |
|ext4| <<< https://chatgpt.com/share/f1f0bb4b-94e3-4f80-9850-23425a8107d0 >>> |
|XFS| <<< https://chatgpt.com/share/f1f0bb4b-94e3-4f80-9850-23425a8107d0 >>> |



## Reference  

Ventoy : [https://www.ventoy.net/](https://www.ventoy.net/en/download.html)  
체크섬 에러 : [https://cracode.tistory.com/85](https://cracode.tistory.com/85)  