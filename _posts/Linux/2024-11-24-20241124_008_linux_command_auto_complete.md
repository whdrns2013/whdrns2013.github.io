---
title: 명령 행 완성 기능 자동완성 # 제목 (필수)
excerpt: tab으로 편하게 자동완성 # 서브 타이틀이자 meta description (필수)
date: 2024-11-24 15:50:00 +0900      # 작성일 (필수)
lastmod: 2024-11-24 15:50:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-24 15:50:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 명령행 완성 기능 자동완성                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20241124_008-->


## 명령 행 완성 기능  

### 명령 행 완성 기능  

-명령어의 일부만 입력하고 나머지를 자동으로 완성하는 기능  
-사용법 : 처음 몇 자 입력 후 `tab` 키를 눌러 실행  
-정보가 충분하지 않은 경우 `tab` 키를 한 번 더 누르면, 모든 경우의 수를 보여주고 원래의 명령 행이 유지됨  

### 자동 완성 기능 대상  

|대상|설명|
|---|---|
|명령어, alias, 함수|- 보통 문자로 시작하는 경우 이들을 우선순위로 판단한다.|
|변수|- 달러($) 기호로 시작하는 경우, 현재 셸의 변수로 판단한다.|
|디렉터리|- 틸드(~) 문자로 시작하는 경우 디렉터리로 판단한다.<br>- ~username 은 지정된 사용자의 홈 디렉터리<br>- 마이너스(-) 기호는 이전 작업 디렉터리를 표시한다.|
|호스트 이름|- at(@) 기호로 시작하는 경우, /etc/hosts 파일에 기록된 호스트 이름으로 판단한다.|

### 예시  

(1) 자동 완성 기능 대상들의 자동 완성  

```bash
# 명령어
whoa + tab + enter
>> <user>

# 변수
echo $HISTS + tab + enter
>> 1000

# 디렉터리
ls ~us + tab + enter
>> docker   docker-compose  docker_mounts ..

# 호스트 이름
@loc + tab + enter
-bash: @localhost: command not found
```

(2) 자동 완성 기능 대상이 다수인 경우  

```bash
wh + tab + tab
>> whatis         which          who
>> whatis.man-db  while          whoami
>> whereis        whiptail 
```

(3) 자동 완성 기능 대상이 없는 경우  

```bash
heywhatis +tab +tab +tab ...
# 반응 없음
```


## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
