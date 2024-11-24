---
title: 셸 명령어의 종류 # 제목 (필수)
excerpt: 에일리어스 예약어 함수 내장명령 일반명령 # 서브 타이틀이자 meta description (필수)
date: 2024-11-24 14:40:00 +0900      # 작성일 (필수)
lastmod: 2024-11-24 14:40:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-24 14:40:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 명령어 종류 에일리어스 예약어 함수 내장명령 일반명령        # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20241124_005-->

## 명령의 종류  

### 명령의 종류  

|유형|영문|설명|
|---|---|---|
|에일리어스|Alias|특정 명령어를 단축어로 정의한 사용자 정의 명령어|
|셸 예약어|Keywords|셸 언어에서 사용할 것으로 예약된 단어<br>do, while, case .. 등이 있다.|
|함수|Shell function|사용자가 정의한 함수로, 셸에서 실행이 가능하다.|
|내장 명령|Built-in commands|셸 내부에 존재하는 내장 명령어<br>별도 실행 파일을 필요로 하지 않고, 셸이 직접 실행.<br>주로 셸 환경 설정이나 셸 동작과 관련|
|일반 명령|External commands|외부 명령어<br>독립 실행 파일로 존재하는 명령어<br>`/bin`, `/usr/bin` 등에 위치한다.|


### 일반 명령(외부 명령)의 실행  

-원칙적으로는 해당 실행 파일의 절대 경로를 사용해서 실행 가능  
-환경변수 PATH에 실행 파일의 절대 경로를 등록한 경우, 경로 없이 명령의 이름만으로 실행 가능  
-`echo $PATH` 로 저장된 경로 확인 가능.  

![](/assetc/images/20241124_005_001.png)  
<i>~/.bashrc에 등록된 환경변수 PATH</i>

```bash
$ echo $PATH
>> /config/miniconda3/bin:/config/miniconda3/condabin:/lsiopy/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```
<i>echo $PATH</i>

## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  

