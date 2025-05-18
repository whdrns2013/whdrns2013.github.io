---
title: 리눅스 그룹 계정 관리 파일 # 제목 (필수)
excerpt: group gshadow  # 서브 타이틀이자 meta description (필수)
date: 2024-11-26 02:54:00 +0900      # 작성일 (필수)
lastmod: 2024-11-26 02:54:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-26 02:54:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 그룹 group gshadow                     # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 2041126_004-->


## 그룹 계정 관리 파일  

|파일|설명|
|---|---|
|/etc/group|그룹 계정의 정보를 가진 텍스트 파일|
|/etc/gshadow|그룹 계정의 암호화된 비밀번호가 저장된 파일|


### /etc/group  

-그룹 계정의 정보를 가진 텍스트 파일  
-라인마다 그룹 계정의 정보가 저장됨  
-각 라인은 콜론(:)으로 구분되는 4개의 필드를 가짐  

```bash
cat /etc/group | grep tu_01
>> tu_01:x:1002:
```

|필드|예시|
|---|---|
|그룹이름|tu_01|
|그룹비밀번호|x|
|gid|1002|
|구성원 리스트||


### /etc/gshadow  

-그룹의 암호화된 비밀번호를 저장한 파일  

```bash
cat /etc/gshadow | grep tu_01
>> tu_01:!::
```


## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
