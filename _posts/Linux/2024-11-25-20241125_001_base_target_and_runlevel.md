---
title: 기본 타깃과 런레벨 - 부팅 모드 선택하기 # 제목 (필수)
excerpt: 리눅스의 부팅 모드의 과거와 현재. 런레벨과 기본 타깃  # 서브 타이틀이자 meta description (필수)
date: 2024-11-25 00:27:00 +0900      # 작성일 (필수)
lastmod: 2024-11-25 00:27:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-25 00:27:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 기본타깃 기본 타깃 basic target runlevel 런레벨 부팅모드 부팅 모드                     # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20241125_001-->


## 리눅스의 부팅 모드  

### 런레벨  

-전통적인 system V 기반의 리눅스에서 시스템의 실행 상태와 동작 모드를 정의하는 단계  
-쉽게 말해서 전통적인 부팅 모드라고 보면 된다.  

### 기본 타깃  

-systemd 가 등장하면서 런레벨 개념이 기본 타깃(basic.target)으로 대체되었다.  
-타깃이란 여러 systemd 유닛을 그룹화하기 위한 개념이며  
-부팅 모드에 적용하여 A부팅 모드일 때 실행할 유닛들, B부팅 모드일 떄 실행할 유닛들 과 같이 그룹화를 해놓은 것이다.  

### 런레벨과 기본 타깃  

|런레벨|타깃 유닛|설명|
|---|---|---|
|0|runlevel0.target, poweroff.target|시스템 종료하고 전원을 끔|
|1|runlevel1.target, rescue.target|단일 사용자 모드로 복구 셸을 설정|
|2~4|runlevel2~4.target, multi-user.target|그래픽이 없는 다중 사용자 시스템|
|5|runlevel5.target, graphical.target|그래픽 다중 사용자 시스템|
|6|runlevel6.target, reboot.target|시스템을 종료하고 재부팅|


## 부팅 모드 확인과 변경  

### 부팅 모드 확인과 변경 방법  

**부팅 모드 확인**

|부팅 모드 확인 방법|사용방법|설명|
|---|---|---|
|systemctl get-default|`systemctl get-default`|현재 기본 부팅 모드(타깃) 확인|
|runlevel|`runlevel`|현재 런레벨과 이전 런레벨 확인<br>systemd에서는 대체로 사용되지 않음|

**부팅 모드 변경**

|부팅 모드 변경 방법|사용방법|설명|
|---|---|---|
|systemctl set-default|`systemctl set-default [타깃 이름]`|기본 부팅 모드를 변경<br>다음 부팅 시 설정한 타깃이 기본값으로 사용됨|
|systemctl isolate|`systemctl isolate [타깃 이름]`|현재 시스템을 지정한 타깃으로 즉시 전환|
|telinit|`telinit [런레벨 번호]`|현재의 runlevel 을 즉시 변경함<br>전통적인 systemV init에서 사용되는 명령어<br>하지만 systemd 에서도 호환성을 제공하여 사용 가능|

<i>isolate : 격리하다</i>

### 예시  

**런레벨 확인**  

```bash
systemctl get-default
>> multi-user.target

runlevel
>> N 3
```

**런레벨 변경**  

```bash
systemctl set-default graphical.target

systemctl isolate multi-user.target

telinit 3
```


## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
