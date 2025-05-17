---
title: "Dart 설치하기"
excerpt: "Dart 프로그래밍의 첫 걸음. 설치."
last_modified_at: 2024-08-11 23:00:00 +0900
permalink: /docs/dart_and_flutter/01_dart_installation
classes: wide
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_dart_and_flutter"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---


## System Requiremetns  

<i>2024.01.14 Dart 3.2.4 version 기준</i>

|OS|항목|requirements|
|---|---|---|
|Windows|OS|Windows 10 and 11.|
||architectures|x64, IA32, ARM64.|
|Mac OS|OS|Mac OS 12, 13, 14|
||architectures|x64, ARM64.|
|Linux|OS|Debian stable, Ubuntu LTS|
||architectures|x64, IA32, ARM64, ARM, RISC-V (RV64GC).|

<i>Windows : Support for ARM64 is in preview, and is available only in the dev and beta channels.</i>  
<i>Linux : Support for RISC-V is in preview, and is available only in the dev and beta channels.</i>  


## Dart SDK install  

> dart 공식 홈페이지  
> [https://dart.dev/get-dart](https://dart.dev/get-dart)  


### (1) Mac OS  

```zsh
# install
brew tap dart-lang/dart
brew install dart

# upgrade  
brew upgrade dart

# 버전 변경  
brew install dart@신규버전
brew unlink dart@기존버전
brew unlink dart@신규버전
brew link dart@신규버전

# dart 정보 표시
brew info dart

==> dart-lang/dart/dart: stable 3.2.4, HEAD
SDK ...
```

### (2) Windows  

```powershell
# install
choco install dart-sdk

# upgrade
choco upgrade dart-sdk
```

### (3) Linux

```bash
# install
sudo apt-get update
sudo apt-get install apt-transport-https
wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/dart.gpg
echo 'deb [signed-by=/usr/share/keyrings/dart.gpg arch=amd64] https://storage.googleapis.com/download.dartlang.org/linux/debian stable main' | sudo tee /etc/apt/sources.list.d/dart_stable.list

sudo apt-get update
sudo apt-get install dart
```


## Dart Pad  

별도로 Dart SDK를 설치하지 않고 웹브라우저에서 Dart 를 연습할 수 있는 곳.  
[https://dartpad.dev/?](https://dartpad.dev/?)  

![](/assets/images/20240121_001_001.png)


## Reference  

dart Docs : https://dart.dev/get-dart  
노마드코더 : https://nomadcoders.co/dart-for-beginners/lectures/4092  