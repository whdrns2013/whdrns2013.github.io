---
title: "Flutter Installation"
excerpt: "플러터를 설치해보자"
last_modified_at: 2024-01-28 00:30:00 +0900
permalink: /docs/dart_and_flutter/08_flutter_installation
classes: wide
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_dart_and_flutter"
---

## Installation  

![](/assets/images/20240128_002_001.png)

Flutter.dev 사이트로 가 Install에 대해 살펴보도록 하겠습니다.    

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>[https://docs.flutter.dev/get-started/install](https://docs.flutter.dev/get-started/install)</span>  

운영체제에 맞는 것은 선택 해 설치 방법에 대해 확인하면 됩니다. 설치 방법은 계속 업데이트 되므로, 설치 방법을 본 포스트에서 적지는 않겠습니다.  

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>설치는 크게 두 단계</span>로 이루어집니다.  

**(1) SDK 설치**  
Dart, 및 기타 개발에 필요한 개발 도구를 설치한다.  

**(2) 시뮬레이터 설치**  
만들어진 애플리케이션을 iOS, Android, Web 등에서 어떻게 보이고 실행되는지 보여주는 시뮬레이터입니다.  


Flutter 공식 홈페이지에 있는 방식을 따라 설치를 진행해도 되지만, 환경변수를 설정해줘야 하는 등의 번거로운 작업들이 있습니다. 따라서 아래와 같은 다른 설치 방식을 추천합니다.  


## SDK Installation  

### 1. Windows  

chocolatey 를 이용해 설치합니다. chocolatey는 Windows에서 사용할 수 있는 패키지 매니저입니다. zip 파일을 다운로드 받을 필요도 없고, path 설정을 따로 해줄 필요도 없어 간편합니다.  

choco가 설치된 경우, 1~5번은 skip 해도 됩니다.  
{: .notice--info}  

**(1) 위 링크로 접속한 뒤 먼저 chocolatey를 설치합니다.**    

[https://chocolatey.org/install](https://chocolatey.org/install)  


**(2) Choose How to Install Chocolatey**  
-> individual 선택  

![](/assets/images/20240128_002_002.png)

**(3) PowerShell 을 설치해줍니다.**  

[https://learn.microsoft.com/ko-kr/powershell](https://learn.microsoft.com/ko-kr/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4)


**(4) PowerShell 을 관리자 권한으로 열고, chocolatey에서 안내하는 대로 설치를 진행합니다.**  

```powershell
Get-ExecutionPolicy
# >> Restricted

Set-ExecutionPolicy AllSigned

Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**(5) choco를 통해 flutter SDK를 설치합니다.**  

```powershell
choco install flutter
```

<br>

### 2. Mac OS  

Mac OS 사용자들에게 친숙한 HomeBrew를 이용해 설치합니다.  

**(1) homebrew 가 없는 경우 설치해줍니다.**  

[https://brew.sh/](https://brew.sh/)  

**(2) 터미널에 아래 명령어를 입력해 Flutter SDK를 설치합니다**  

(주의) 원활한 설치를 위해서는 기존 설치한 dart를 삭제하고 flutter를 설치하는 것을 추천합니다. flutter SDK에 dart 또한 포함되어있습니다.  

```zsh
brew install --cask flutter
```



## Simulator Installation  

시뮬레이터는 내가 개발한 애플리케이션이 여러 플랫폼(Windows, Mac, iOS, Android, Web ..) 에서 어떻게 보여지고 어떻게 작동하는지 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>테스트해볼 수 있는 도구</span>입니다. flutter의 홈페이지에 안내된 설치방법에 따라 설치를 진행하면 됩니다.  

단, <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>모든 플랫폼에 대한 시뮬레이터를 처음부터 설치할 필요는 없습니다.</span> 그때 그때 필요한 경우 설치하면 됩니다. 처음부터 모든 것을 설치하려면 시간도 소요되고, 충돌이 일어나면 이를 해결하는 데 진이 빠져버릴 거에요. 그러니 우선 하나만 정해서 시뮬레이터를 설치해 보는 것을 추천합니다.  

### 1. Windows  

windows, web, android 세 가지 선택지가 있습니다. 이미 브라우저가 있으므로 웹을 개발하려고 한다면 딱히 할 것은 없습니다. 만약 Android 앱을 개발하려고 하면 가이드의 android setup으로 가서 해당 페이지에 있는 설치 방법을 따라 Android Simulator를 설치합니다.  

[https://docs.flutter.dev/get-started/install/windows](https://docs.flutter.dev/get-started/install/windows)

또한 윈도우 개발을 원한다면 해당 가이드를 따르면 됩니다.  

### 2. Mac OS

Mac OS는 Windows보다 더 많은 선택지가 있습니다. iOS, Android, macOS, Web 까지. 이 또한 가이드의 내용을 따라 진행하면 됩니다.  

[https://docs.flutter.dev/get-started/install/macos](https://docs.flutter.dev/get-started/install/macos)  


## Reference  

https://docs.flutter.dev/get-started/install  
https://nomadcoders.co/flutter-for-beginners/lectures/4133  
