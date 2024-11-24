---
title: 셸 명령어와 관련된 명령어 # 제목 (필수)
excerpt: 명령어와 관련된 명령어..? # 서브 타이틀이자 meta description (필수)
date: 2024-11-24 15:10:00 +0900      # 작성일 (필수)
lastmod: 2024-11-24 15:10:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-11-24 15:10:00 +0900   # 최종 수정일 (필수)
categories: Linux         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 셸 쉘 명령어 alias type which whereis man                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20241124_006-->



## 명령어와 관련된 명령어들  

명령어 그 자체와 관련된 명령어들이다.  

|명령어|설명|
|---|---|
|alias|단축 명령을 만드는 명령어|
|type|특정 명령을 어떻게 해석하는지 출력|
|which|실행 프로그램을 알아내는 명령어|
|whereis|명령의 실행 프로그램이 어디에 있는지 찾음|
|man|명령어에 대한 매뉴얼 페이지 출력|

### alias - 단축 명령 만들기  

단축 명령어를 만드는 명령어. 예를 들어 여러 옵션을 적용한 명령어를 단축 명령어로 만드는 등의 사용 방법이 있다.  

```bash
alias la='ls -A'   # 숨김파일까지 출력
alias rm='rm -i'   # 삭제 여부에 대해 interaction(대화식 재확인)
```

계속 유지하기 위해서는 셸의 환경 설정 파일에 기록해 두어야 한다.  

```bash
cat ~/.bashrc
>> ...
>> alias rm='rm -i'
>> alias cp='cp -i'
>> alias mv='mv -i'
```


### type - 명령의 해석방법 알기  

특정 명령을 어떻게 해석하는지 알려 주는 명령. 일반 명령의 경우 실행 파일의 위치를 보여준다. 명령이 어떤 alias 인지, 어떤 경로의 실행파일인지.. 등을 출력하는 명령어이다. 

```bash
# type
type cd
>> cd is a shell builtin

type case
>> case is a shell keyword

type rm
>> rm is /usr/bin/rm

# type -a 옵션 : 모든 경로를 출력한다.
type -a ls
>> ls is aliased to 'ls --color=auto'
>> ls is /usr/bin/ls

type -a cd
>> cd is a shell builtin
>> cd is /usr/bin/cd
```

### which - 실행 프로그램 찾기  

-셸 명령에 대한 실행 프로그램을 알아내기 위한 명령.  
-즉, PATH 환경변수를 기초로 상응하는 실행 프로그램이 어느 디렉터리에 존재하는지  
-절대경로 방식으로 출력한다.  

```bash
which rm
>> alias rm='rm -i'
>>         /usr/bin/rm

which cp
>> alias cp='cp -i'
>>         /usr/bin/cp

which docker
>> /usr/bin/docker
```

### whereis - 실행 프로그램 확인  

-명령의 실행 프로그램의 위치를 알려준다.  
-which 명령과 유사하나  
-소스와 매뉴얼 페이지가 존재하는 경우, 해당 파일도 찾아 출력한다.  

```bash
whereis which
>> which: /usr/bin/which /usr/share/man/man1/which.1.gz /usr/share/info/which.info.gz
whereis rm
>> rm: /usr/bin/rm /usr/share/man/man1/rm.1.gz
whereis cp
>> cp: /usr/bin/cp /usr/share/man/man1/cp.1.gz
whereis docker
>> docker: /usr/bin/docker /etc/docker /usr/libexec/docker /usr/share/man/man1/docker.1.gz
```

### man - 온라인 매뉴얼 페이지 보기  

-각종 프로그램의 사용법을 확인할 수 있는 매뉴얼 페이지를 출력  
-`man command` 와 같이 사용한다.  
-종료하려면 q를 입력하면 된다.  

```bash
man rm
```

![](/assets/images/20241124_006_001.png)


#### 매뉴얼 페이지 섹션 분류  

매뉴얼 페이지는 섹션이라는 게 있다.  

|섹션|내용|
|---|---|
|1|사용자 명령|
|2|커널의 시스템 호출|
|3|C 라이브러리 함수|
|4|디바이스 드라이버 정보|
|5|시스템의 설정 파일|
|6|게임|
|7|파일 포맷, 인코딩 등|
|8|시스템 관리 명령|

명령어에 대한 특정 섹션의 매뉴얼 페이지를 보기 위해서는 `man <섹션번호> <명령어>`와 같이 사용하면 된다. 이러한 섹션이 구분되는 이유는 `동일 이름의 실행프로그램이나 설정 파일이 존재할 수 있기 때문`이다. 만약 해당 섹션의 매뉴얼 페이지가 없는 경우, 없다는 출력이 반환된다.  

```bash
man 5 rm
>> No manual entry for rm in section 5
```


## Reference  

[UNIX시스템 - 김희천,김진욱 저 ](https://search.shopping.naver.com/book/catalog/41474371650)  
