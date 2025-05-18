---
title: 셸 명령어의 기본 구조와 사용법 # 제목 (필수)
excerpt: 그리고 긴 옵션 짧은 옵션  # 서브 타이틀이자 meta description (필수)
date: 2024-11-24 14:00:00 +0900      # 작성일 (필수)
lastmod: 2024-11-24 14:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-24 14:00:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 셸 쉘 명령어 구조 사용법 기본 옵션 인수 긴옵션 짧은옵션 긴 짧은 유닉스 GNU 스타일             # 태그 복수개 가능 (필수)
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
<!--postNo: 20241124_004-->


옵션 인수 긴 짧은 긴옵션 짧은옵션 

## 셸 명령어의 구조와 종류    

### 셸 명령어의 구조  

```bash
$  chsh        -s      /bin/bash
#  ----        --      ---------
# command  [options]  [arguments]
#  명령어       옵션         인수
```  

- 셸 명령어의 구조 : `command [options] [arguments]`  
- command : 명령어  
- \[options\] : 명령의 옵션. 필수적일 수도, 선택적일 수도 있음.  
- \[arguments\] : 인수. 명령에 따라 필요할 경우 파라미터 혹은 입력값 처럼 사용.  
- \[\] : 앞으로 이 표시는 '선택적인' 의 의미로 사용될 것임  

## 옵션과 인수  

### 옵션과 인수의 개념  

|구분|설명|
|---|---|
|옵션|- 명령어의 동작을 세부적으로 조정하거나 추가적인 기능을 활성화하기 위해 사용|
|인수|- 명령의 수행 대상을 지정하는 것<br>- 명령어는 0개 이상의 인수를 가질 수 있음<br>- 옵션도 인수를 가질 수 있다.|

### 옵션의 표현 방법   

옵션은 명령어의 동작을 세부적으로 조정하거나 추가적인 기능을 활성화하기 위해 사용하는 것으로 대시(-) 및 영문자나 영단어 등으로 표현한다. 옵션의 표현 방법에는 유닉스 스타일의 옵션(짧은 옵션) 과 GNU스타일의 옵션(긴 옵션)이 있다.  

|표현 방법|설명|
|---|---|
|짧은 옵션|- 유닉스 스타일의 옵션<br>- 대시(-) 하나와 옵션의 약어 하나 이상을 붙여 사용한다.<br>- ex. `ls -a`의 -a<br>- `ls -lat`와 같이 합쳐서 사용할 수 있음|
|긴 옵션|- GNU 스타일의 옵션<br>- 보통은 온전한 한 단어가 옵션명인 경우가 대부분이다.<br>- ex. `ls -all`의 --all|

```bash
# 유닉스 스타일의 옵션 (짧은 옵션)
$ ls -lat

# GNU 스타일의 옵션 (긴 옵션)
$ ls --all --long --time=modified
```

### 인수의 표현 방법  

인수는 명령의 수행 대상이라고 볼 수 있다. 인수는 없거나 한 개 이상일 수 있으며, 명령어 뿐만 아니라 옵션 또한 인수를 가질 수 있다.  

**(1) 명령어가 인수를 가질 때**  
-whitespace 를 중간에 두고 `명령어 [옵션] 인수` 와 같이 사용.

**(2) 옵션이 인수를 가질 때**  
-옵션과 인수 사이에 `=` 문자를 두면서 공백을 두지 않음.  
-`명령어 옵션=인수` 와 같이 사용.  

```bash
$ cat -n /etc/passwd
#        -----------  명령어에 대한 인수

$ grep "KilDong Hong" /etc/passwd
#      -------------- -----------   2개의 인수

$ chsh -s /bin/sh kdhong  
#         -------         옵션의 인수

$ chsh --shell=/bin/bash kdhong
#              ----------        옵션의 인수
```

**주의**  
CLI는 White Space(공백)을 분리의 기준으로 받아들이므로, 인수에 공백이 있는 경우 하나의 인수로 받아들이지 않습니다. 공백을 포함한 인수는 `쌍따옴표("") 사이에 인수를 입력`하여, 하나의 인수임을 명확하게 표현해줘야 합니다.  
{: .notice--warning}  



## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
