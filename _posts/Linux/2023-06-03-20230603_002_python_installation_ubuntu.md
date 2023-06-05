---
title: Ububtu 리눅스에서 파이썬 설치(업그레이드) 하고 기본 파이썬 버전으로 교체하기 # 제목
excerpt: Ubuntu 18.04.6 # 서브 타이틀
date: 2023-06-03 13:33:00 +0900      # 작성일
lastmod: 2023-06-03 13:33:00 +0900   # 최종 수정일 : 구글 사이트등록 관련 필요
categories: Linux         # 다수 카테고리에 포함 가능
tags: Linux Ububtu 우분투 파이썬 설치 업그레이드 yum apt CentOS7.9 Ubuntu18.04.6     # 태그 복수개 가능
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20230603_002-->

# Intro  

이번 포스트에서는 리눅스 Ububtu에 파이썬을 설치해보도록 하겠습니다.  

이전 포스트에서는 CentOS에서 파이썬을 설치했는데요,  
Ubuntu에서는 그 설치 과정이 CentOS와 살짝 다릅니다.  
자세한 내용은 본 포스트를 따라가보며 확인할 수 있습니다.  

리눅스의 CentOS 와 Ubuntu 는 기본적으로 파이썬이 설치되어있습니다.  
하지만 기본 설치된 파이썬은 Python3가 아닌 Python2로, 현재의 딥러닝 라이브러리들을 사용하기는 힘들죠.  

그래서 파이썬3을 설치하고, 이렇게 설치한 파이썬을 기본 파이썬 버전으로 설정해보겠습니다.  

명심할 것은 기존 설치된 파이썬2는 제거하지 않는 게 좋다는 것입니다.  
리눅스OS 자체의 기능을 못쓰게 될 수도 있기 때문입니다.  

이번 포스트에서는 Ubuntu에서 진행합니다.  

**진행 환경**
* Ubuntu 18.04.6    
* Python 3.8.0  
{: .notice--warning}

참고 : 가상 리눅스 설치하기 [포스트 링크](https://whdrns2013.github.io/linux/20230530_001_centosinstall/)   

<br>
<br>

# Ubuntu에서 파이썬 설치하기

## 파이썬 버전 확인

리눅스 터미널에서 `python -V` 명령어로 설치된 파이썬 버전을 확인합니다.  
기본 파이썬 버전은 파이썬2로 설정되어있고,  
파이썬3로 기본 설치되어있으나 버전은 3.6.X 입니다.  

```terminal
python -V
--> Python 2.7.5

python3 -V
--> Python 3.6.9
```

![](/assets/images/20230603_002_001.png)

<br>

## apt Update

Advanced Packaging Tool.  

apt는 Ubuntu, 데비안 계열에서 사용하는 패키지 관리 툴입니다.  
파이썬의 pip와 같다고 보면 될 것입니다.  

이 패키지 관리 툴을 업데이트 해줍니다.  

```terminal
sudo apt update  
```

<br>

## 필요 플러그인 설치  

파이썬 설치 전에 필요한 플러그인을 설치합니다.  

```terminal
sudo apt install software-properties-common
```

<br>

## 파이썬 설치  

Ubuntu에서 파이썬을 설치하는 건 CentOS보다 비교적 간편했습니다.  
apt를 통해 설치하는 명령어만 입력하면 되기 때문이죠.  

```terminal
sudo apt install python3.8
```

<br>

## 파이썬 버전 확인  

파이썬이 잘 설치되었는지 확인해줍니다.  

```terminal
python3.8 -V
--> Python 3.8.0

python3 -V
--> Python 3.6.9
```

파이썬 3.8은 새로 설치한 3.8.0으로 잘 나오고,  
파이썬 3은 기존의 3.6.9 버전으로 나오네요!  


## 파이썬 기본 버전 설정

파이썬 기본 버전을 변경해줍니다.  
먼저, 파이썬 바이너리 파일이 위치한 경로를 찾아줍니다.  

```terminal
which python3.8
--> /usr/bin/python3.8
```

파이썬3.8을 기본 python으로 변경해줍니다.  

```terminal
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.8 1
```

![](/assets/images/20230603_002_002.png)

## pip 설치  

파이썬의 패키지 관리 툴인 pip를 설치해줍니다.  

```terminal
sudo apt install python3.8 -pip
```

혹은

```terminal
python3.8 -m pip install pip
```

이제 Ubuntu에서 파이썬3.8을 사용할 수 있습니다.  


# 그 외 참고  

제 경우, 파이썬을 사용할 때는 명령어에 버전을 구분해 실행시키는 편입니다.  
버전 혼동을 막기 위해서 일부러 파이썬 버전을 명시해줍니다. 아래처럼요.  

```terminal
python3.8 -m pip install matplotlib
```


<br>
<br>

# Reference

Ubuntu 18.04 파이썬3.8 설치 : https://sanghaklee.tistory.com/73  
Ubuntu 18.04 파이썬3.8 설치 : https://jjeongil.tistory.com/1806  
apt : https://ko.wikipedia.org/wiki/어드밴스트_패키징_툴  
