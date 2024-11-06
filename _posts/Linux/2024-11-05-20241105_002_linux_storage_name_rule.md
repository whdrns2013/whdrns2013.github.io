---
title: 리눅스 저장 장치 명명 규칙 - 디스크 및 파티션 # 제목 (필수)
excerpt: sda sdb1 sdb2 .. 이름의 규칙은? # 서브 타이틀이자 meta description (필수)
date: 2024-11-05 18:30:00 +0900      # 작성일 (필수)
lastmod: 2024-11-05 18:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-05 18:30:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 sda sdb sda1 sdb1 hda1 디스크 파티션 저장 장치 하드 드라이브 ssd            # 태그 복수개 가능 (필수)
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 연월일_00n-->  

## 리눅스 저장 장치 명명 규칙  

![](/assets/images/20241105_002_001.png)  

### (1) Device Files  

- 디바이스 디렉터리  
- 장치 및 드라이버와 관련된 파일을 저장하는 디렉터리  
- 장치를 접근하는 데 사용되는 디바이스파일이 위치함  

### (2) 저장 인터페이스의 종류  

|명칭|인터페이스 이름|설명|
|---|---|---|
|hd*|IDE|- IDE 규격의 이름 패턴<br>- hard drive 라는 이름의 첫 글자들을 땄다.<br>- 메인보드는 2개의 커넥터를 가지며, 각 커넥터는 2개 디스크 부착 가능<br>- hda:첫 번째 커넥터 마스터 / hdb:첫 번째 커넥터 슬레이브<br>- hdc:두 번째 커넥터 마스터 / hdd:두 번쨰 커넥터 슬레이브|
|sd*|SCSI|- SCSI 규격의 이름 패턴<br>- SCSI disk 라는 이름의 첫 글자들을 땄다.<br>- PATA, SATA, 하드디스크, 플래스메모리, USB 등<br>- 마스터, 슬레이브 개념이 없으며 연결 순서에 따라 알파벳 부여|
|sr*|CD/DVD|- 읽기 전용의 광학 드라이브 장치(CD/DVD)<br>- 알파벳 없이 뒤에 숫자 1, 2, 3... 을 붙인다.|
|sg*|CD/DVD|- 읽기와 쓰기가 가능한 광학 드라이브 장치(CD/DVD)<br>- 알파벳 없이 뒤에 숫자 1, 2, 3... 을 붙인다.|
|tty*|teletypewriter|- 가상 콘솔|
|pts|pseudo terminal slave|- 가상 터미널 장치|

### (3) 물리적 저장장치 순번  

**저장 장치의 종류가 hd / sd 인 경우**  

|명칭|설명|
|a|첫 번째 발견(=연결)된 물리적 저장장치|
|b|두 번째 발견(=연결)된 물리적 저장장치|
|c|세 번째 발견(=연결)된 물리적 저장장치|
|...|...|
|z|26번째 발견(=연결)된 물리적 저장장치|
|aa|27번째 발견(=연결)된 물리적 저장장치|
|...|...|

### (4) 파티션 순번  

|명칭|설명|
|---|---|
|1|해당 물리적 저장 장치의 첫 번째 파티션|
|2|해당 물리적 저장 장치의 두 번째 파티션|
|3|해당 물리적 저장 장치의 세 번째 파티션|
|...|...|
|10|해당 물리적 저장 장치의 열 번째 파티션|
|...|...|


## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
[tty, pts - quora](https://www.quora.com/What-is-the-difference-between-PTS-and-TTY-in-Linux)  
[데비안 - 리눅스 장치의 이름](https://www.debian.org/releases/stable/armhf/apcs04.ko.html)  
[sdz 이상의 저장장치 명명 규칙 - quora](https://www.quora.com/What-is-the-difference-between-PTS-and-TTY-in-Linux)  