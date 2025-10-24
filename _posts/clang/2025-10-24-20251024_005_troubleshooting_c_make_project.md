---
title: "[C언어] Trouble Shooting - VS Code의 C 컴파일러 오류" # 제목 (필수)
excerpt: "cl.exe build and debug active file is only usable when VS Code is run from the Developer Command Prompt for VS"  # 서브 타이틀이자 meta description (필수)
date: 2025-10-24 17:24:00 +0900      # 작성일 (필수)
lastmod: 2025-10-24 17:24:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-10-24 17:24:00 +0900   # 최종 수정일 (필수)
categories: clang         # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 프로그램 개발 컴파일 트러블 슈팅 trouble shooting 트러블슈팅 troubleshooting 컴파일러 cl exe build and debug active file is only usable when VS Code is run from the Developer Command Prompt for VS                  # 태그 복수개 가능 (필수)
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
<!--postNo: 20251024_005-->

## Trouble Shooting  

### 현상  

- VSCode 에서 C 컴파일시 아래 에러 발생  

```bash
cl.exe build and debug active file is only usable when VS Code is run from the Developer Command Prompt for VS.
```

### 원인  

- VSCode에서 cl.exe(MSVC 컴파일러)를 사용하려고 할 때 Visual Studio의 Developer Command Prompt 환경이 잡혀있지 않기 때문  
- MSVC 컴파일러(cl.exe)는 일반 터미널에서 바로 사용할 수 없고, Visual Studio에서 제공하는 Developer Command Prompt 나 x64 Native Tools Command Prompt에서만 사용이 가능하다. (이 환경에서만 `INCLUDE`, `LIB`, `PATH` 등이 자동으로 설정되기 때문)  
- 쉽게 말해, VSCode 에서 사용하려고 하는 컴파일러가 Visual Studio IDE에 맞춰져 있다 보니, VSCode에서 바로 사용할 수가 없는 상황  

### 해결 방안  

- (1) Developer Command Prompt에서 VS Code를 실행  
- (2) VS Code에 MSVC 환경 설정하기  
- (3) GCC (컴파일러) 사용 : VS Code와 바로 연결 가능 ★ 선택  

### 해결  

- GCC 설치 : [https://winlibs.com/#download-release](https://winlibs.com/#download-release)  
- 다운받은 압축파일을 적절한 곳(잘 삭제하지 않을 곳)에 압축 풀기  
- 압축 푼 폴더 내 bin 경로를 환경변수 Path에 등록  

![](/assets/images/20251024_005_001.png)  

- VS Code를 기동하고, 팔레트에서 `C/C++:Edit Configurations (UI)` 선택  

![](/assets/images/20251024_005_002.png)  

- 세팅창에서 컴파일러를 GCC로 선택 (관련해서 추가적인 설정이 필요할 수 있으며, 눈치껏 설정하면 된다.)  

![](/assets/images/20251024_005_003.png)  

- 성공!  

## Reference  

[https://iefef.tistory.com/3](https://iefef.tistory.com/3)  
[https://winlibs.com/#download-release](https://winlibs.com/#download-release)  
[https://seonghyuk.tistory.com/367](https://seonghyuk.tistory.com/367)  
[https://velog.io/@watermeloncrane/vscode%EC%97%90%EC%84%9C-CC-%EC%84%B8%ED%8C%85-%EC%89%AC%EC%9B%80](https://velog.io/@watermeloncrane/vscode%EC%97%90%EC%84%9C-CC-%EC%84%B8%ED%8C%85-%EC%89%AC%EC%9B%80)  