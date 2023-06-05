---
title: CentOS 리눅스에서 파이썬 설치(업그레이드) 하고 기본 파이썬 버전으로 교체하기 # 제목
excerpt: CentOS 7.9 # 서브 타이틀
date: 2023-06-03 11:33:00 +0900      # 작성일
lastmod: 2023-06-03 11:33:00 +0900   # 최종 수정일 : 구글 사이트등록 관련 필요
categories: Linux         # 다수 카테고리에 포함 가능
tags: Linux CentOS Ububtu 우분투 파이썬 설치 업그레이드 yum apt CentOS7.9 Ubuntu18.04.6     # 태그 복수개 가능
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
<!--postNo: 20230603_001-->


# Intro  

이번 포스트에서는 리눅스 CentOS에 파이썬을 설치해보도록 하겠습니다.  

리눅스의 CentOS 와 Ubuntu 는 기본적으로 파이썬이 설치되어있습니다.  
하지만 기본 설치된 파이썬은 Python3가 아닌 Python2로, 현재의 딥러닝 라이브러리들을 사용하기는 힘들죠.  

그래서 파이썬3을 설치하고, 이렇게 설치한 파이썬을 기본 파이썬 버전으로 설정해보겠습니다.  

명심할 것은 기존 설치된 파이썬2는 제거하지 않는 게 좋다는 것입니다.  
리눅스OS 자체의 기능을 못쓰게 될 수도 있기 때문입니다.  

이번 포스트에서는 CentOS에서, 다음 포스트에서는 Ubuntu에서 진행합니다.  

**진행 환경**
* CentOS 7.9  
* Python 3.8.0  
{: .notice--warning}

참고 : 가상 리눅스 설치하기 [포스트 링크](https://whdrns2013.github.io/linux/20230530_001_centosinstall/)   

<br>
<br>


# CentOS에서 파이썬 설치하기  

## 파이썬 버전 확인

리눅스 터미널에서 `python -V` 명령어로 설치된 파이썬 버전을 확인합니다.  
기본 설치된 파이썬 버전은 2.7.5 군요.  

```terminal
python -V
--> Python 2.7.5
```

<br>

## yum update  

yum 은 Cent OS의 패키지 관리 툴입니다.  
파이썬의 pip와 비슷하다고 보시면 됩니다.  

파이썬 설치에 앞서 필요한 플러그인을 설치하기 위해 업데이트 해줍니다.  
시간이 다소 소요되니, 이점 참고해주세요.  

```terminal
sudo yum update
```

<br>

## 필요 플러그인 설치  

파이썬 설치 전에 필요한 플러그인을 설치합니다.  

```terminal
sudo yum install wget
sudo yum install gcc openssl-devel
sudo yum install gcc bzip2-devel
sudo yum install libffi-devel
```

**devel 패키지란?**
다른 패키지를 설치하기 위한, 의존성 문제를 해결하기 위한 라이브러리 패키지.  
* wget : 웹 서버로부터 컨텐츠를 가져오는 라이브러리.  
* openssl-devel : 네트워크를 통한 데이터 통신에 쓰이는 라이브러리  
* bzip2-devel : 압축 알고리즘/소프트웨어. 보통 bz2 확장자.  
* libffi-devel : 다른 프로그래밍 언어로 작성된 함수를 호출하고 인터페이스하는 기능 제공. C언어를 사용하지 않는 언어로 작성된 코드에서 C 라이브러리의 함수를 호출할 수 있게 지원한다.  
{: .notice}

<br>

## 파이썬 다운로드

파이썬 홈페이지에서 파이썬 설치파일을 다운로드 합니다.  
아래 파이썬 홈페이지에서 설치를 원하는 버전의 Gzip 설치 파일의 링크를 복사합니다.  

[파이썬 홈페이지](https://www.python.org)  

![](/assets/images/20230603_001_001.png)  
![](/assets/images/20230603_001_002.png)  

이번 포스트에서는 python 3.8.0 버전을 설치해보겠습니다.  
이후, 리눅스 터미널에서 wget을 통해 설치파일을 다운로드 합니다.  

```terminal
wget https://www.python.org/ftp/python/3.8.0/Python-3.8.0.tgz
```

정상적으로 다운로드가 되었다면 아래와 같이 해당 파일이 현재 경로에 보일 것입니다.  

![](/assets/images/20230603_001_003.png)  

<br>

## 파이썬 설치  

**설치파일 압축 해제**  
이제 다운로드 받은 설치파일을 설치합니다.  
먼저, 다운로드 받은 설치파일은 압축파일이므로 압축을 해제해줍니다.  

```terminal
tar xzf Python-3.8.0.tgz
```

**컴파일**  
압축이 해제되면 아래와 같이 압축파일과 동일한 이름의 디렉토리가 생성되었을 것입니다.  
이 디렉토리로 이동해준 뒤, configure를 실행시켜 컴파일합니다.    

![](/assets/images/20230603_001_004.png)  

```terminal
# 압축 해제 디렉토리로 이동
cd Python-3.8.0

# configure로 컴파일
./configure --enable-optimizations
```

--enable-optimizations  
최적화된 설치를 의미합니다.  
{: .notice}

**설치**  
컴파일이 완료되면 설치를 진행합니다.  

```terminal
make altinstall
```

<br>

## 파이썬 기본 버전 설정

**바이너리 파일 위치 찾기**  
설치가 완료되었다면, 이제 파이썬 기본 버전을 새로 설치한 3.8.0 버전으로 바꿔줄 것입니다.  
먼저, 파이썬 3.8.0 버전의 바이너리 파일의 위치를 찾습니다.  

```terminal
which python3.8
--> /usr/local/bin/python3.8
```

![](/assets/images/20230603_001_005.png)  

**bashrc 편집**  
파이썬 기본 버전을 바꾸기 위해 bashrc 파일을 vi 편집기로 엽니다.  

```terminal
vi /root/.bashrc
```

bashrc 파일에 파이썬의 기본 경로를 위에서 확인한 `/usr/local/bin/python3.8`로 설정합니다.  
vi 편집기를 실행한 후 키보드에서 i 를 누르면 편집(insert) 모드로 변경됩니다.  

```terminal
...
alias python="/usr/local/bin/python3.8"
...
```

![](/assets/images/20230603_001_006.png)  

프로그래밍 언어를 접해봤다면 알 수 있는 alias.  
즉, 위 bashrc에서의 설정은 "/usr/local/bin/python3.8 을 python 이라는 별칭으로 부른다" 로 해석할 수 있습니다.  

입력이 완료되었다면 vi 편집기를 저장 후 종료합니다.  
저장 후 종료하는 명령어는 esc 를 누른 뒤 ":wq" 를 입력하면 됩니다.  

**bashrc 적용**  
bashrc 의 변경 내용을 적용해줍니다.  

```terminal
source /root/.bashrc
```

![](/assets/images/20230603_001_007.png)  

**python 버전 확인**  
파이썬 버전 확인 명령어를 통해, 잘 적용되었는지 확인합니다.  

```terminal
python -V
--> Python 3.8.0
```

# 그 외 참고  

제 경우, 파이썬을 사용할 때는 명령어에 버전을 구분해 실행시키는 편입니다.  
버전 혼동을 막기 위해서 일부러 파이썬 버전을 명시해줍니다. 아래처럼요.  

```terminal
python3.8 -m pip install matplotlib
```


<br>
<br>

# Reference

devel 패키지란 ? : https://mentha2.tistory.com/214  
wget : https://ko.wikipedia.org/wiki/Wget  
openssl : https://ko.wikipedia.org/wiki/OpenSSL  
bzip2 : https://ko.wikipedia.org/wiki/Bzip2  
파이썬 설치파일 다운로드 : https://www.python.org  
리눅스에서 파이썬 설치 : https://mainia.tistory.com/5966  
