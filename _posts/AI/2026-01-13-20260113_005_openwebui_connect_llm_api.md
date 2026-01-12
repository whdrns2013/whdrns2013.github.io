---
title: "[Open WebUI] 외부 LLM 모델 API 연결" # 제목 (필수)
excerpt: "Open WebUI에서 외부 LLM API 연결 설정하기(Gemini)" # 서브 타이틀이자 meta description (필수)
date: 2026-01-13 01:18:00 +0900      # 작성일 (필수)
lastmod: 2026-01-13 01:18:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-13 01:18:00 +0900   # 최종 수정일 (필수)
categories: AI         # 다수 카테고리에 포함 가능 (필수)
tags: OpenWebUI OpenAI ChatGPT Gemini API 연결 챗지피티 제미나이                    # 태그 복수개 가능 (필수)
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
permalink: 
sidebar:
  nav: docs_llm
pinned: 
---
<!--postNo: 20260113_005-->

## LLM 연결 설정 메뉴

- LLM 연결을 설정하기 위해서는 관리자로 접속 후 우측 상단 사용자 프로필 버튼을 클릭 후 설정을 클릭합니다.  

![](/assets/images/20260113_005_001.png)

- 관리자설정 메뉴로 들어갑니다.  

![](/assets/images/20260113_005_002.png)

- 연결 섹션에서 에서 확인할 수 있습니다.  

![](/assets/images/20260113_005_003.png)


## API 연결  

- ChatGPT, Gemini, Anthropic 의 모델들은 OpenAI API 설정 메뉴를 통해 설정할 수 있습니다.

![](/assets/images/20260113_005_004.png)

- 추가버튼을 누른 뒤, 아래와 같은 연결 정보를 넣고 저장합니다. 아래 예시는 Gemini 입니다.  

![](/assets/images/20260113_005_005.png)


> URL : https://generativelanguage.googleapis.com/v1beta/openai  
> 인증 : 자신의 Gemini API 키를 넣으면 됩니다.  

- 새 채팅으로 가보면 이제 모델을 선택해서 사용할 수 있습니다.

![](/assets/images/20260113_005_006.png)


## Reference

[https://toyourlight.tistory.com/127](https://toyourlight.tistory.com/127)  
[https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)  