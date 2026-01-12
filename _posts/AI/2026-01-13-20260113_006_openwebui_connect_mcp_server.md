---
title: "[Open WebUI] MCP 서버 연결하기" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2026-01-13 01:28:00 +0900      # 작성일 (필수)
lastmod: 2026-01-13 01:28:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-13 01:28:00 +0900   # 최종 수정일 (필수)
categories: AI         # 다수 카테고리에 포함 가능 (필수)
tags: OpenWebUI MCP 서버 server tool                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20260113_006-->

## MCP 툴 연결

  

### MCP란?

MCP란, AI 애플리케이션을 외부의 시스템과 연결하는 오픈소스 표준 규격을 의미합니다. LLM 모델은 구조적으로 자신이 학습한 범위에서만 정답을 찾아낼 수 있고, 최신의 데이터나 학습하지 않은 데이터에 대해서는 약한 모습을 가질 수밖에 없습니다.  

이러한 LLM 모델의 구조적 한계를 극복하고자, 모델 외부의 정보를 끌어와 모델에게 힌트로 제공하거나, 모델이 중심이 되어 특정한 작업 워크플로우가 수행될 수 있게끔 여러 툴을 붙이는 연구가 활발해졌습니다. 그리고 이에 대해 Anthropic 이 제시한 표준이 바로 MCP입니다.  

MCP에 대한 개념을 소개한 이전 포스팅 링크를 첨부하니, 궁금하신 분은 한 번 살펴보시기 바랍니다.  

[https://whdrns2013.github.io/ai/20260108_001_mcp_concept/](https://whdrns2013.github.io/ai/20260108_001_mcp_concept/)  

### MCP 서버 구축하기

Open WebUI 에 외부 툴을 붙이기 위해서는 동작하고 있는 MCP 서버가 필요합니다. 이에 대한 포스팅을 이전에 한 바가 있으니, 참고해주시기 바랍니다.  

[https://whdrns2013.github.io/ai/20260113_002_mcp_server_quickstart](https://whdrns2013.github.io/ai/20260113_002_mcp_server_quickstart)  

### MCP 서버 가동하기

Open WebUI에서 MCP 서버를 사용하기 위해서는 몇 가지 사전 구성이 필요하며, 그중 핵심 구성 요소가 **MCPO(MCP Proxy)** 입니다. 현재 Open WebUI는 **MCP 서버를 직접 등록하는 기능을 제공하지 않고,** 브라우저 기반 UI 특성상 MCP 서버에 직접 연결하는 방식에는 제약이 존재합니다. 이 때문에 Open WebUI는 **MCPO를 활용하여 MCP 서버를 OpenAPI 형식으로 변환한 뒤 사용하는 구조를 권장**합니다.

이 방식으로 구성해야만 Open WebUI의 External Tools 메뉴에서 URL 기반 도구 등록 및 호출이 정상적으로 동작합니다.

#### MCPO 설치하기  

MCP 서버를 실행시키는 파이썬 환경에서 `mcpo` 라이브러리를 설치합니다.  

```bash
uv add mcpo # uv
pip install mcpo # pip
conda install mcpo # conda
```

#### MCP 서버 설정 변경  

MCP 서버를 MCPO 와 함께 사용할 때는 전송 방식을 "stdio" 로 지정합니다. 그 이유는, MCPO가 현재는 JSON-RPC 방식의 stdio 만 지원하기 때문입니다.  

```python
# 기존
def main():
    mcp.run(transport="sse")
    
# 변경
def main():
    mcp.run()
```

#### MCPO 를 통해 MCP 서버 실행

이후 아래와 같이 MCPO 를 통해 MCP 서버를 실행시킵니다.

```bash
uv run mcpo --port 8000 -- python main.py # uv
```

### Open WebUI에 MCP 서버 추가하기

- 관리자 패널로 이동합니다.  

![](/assets/images/20260113_006_001.png)

- 설정 → 외부 도구 → 추가 버튼을 클릭합니다.

![](/assets/images/20260113_006_002.png)

- 팝업 창에 MCP 서버 URL을 입력하고, 새로고침 버튼을 누릅니다. 성공적으로 연결되었다면 화면 우측 상단에 “연결 성공” 메세지가 뜨는 걸 볼 수 있습니다.  

![](/assets/images/20260113_006_003.png)


### MCP 서버 사용하기

- 다시 새 채팅으로 가봅니다. 여기서 통합 버튼(마름모 네개)을 누르고, 도구를 누릅니다.  

![](/assets/images/20260113_006_004.png)

- 신규로 추가한 도구를 활성화 시켜줍니다.  

![](/assets/images/20260113_006_005.png)

- 예시로 주소록 MCP 에 홍길동의 이메일 주소를 물어봤습니다. 출처가 server로 나오며, MCP 서버의 응답에 기반한 답변이라는 것을 알 수 있습니다.

![](/assets/images/20260113_006_006.png)


## Reference

[https://github.com/open-webui/mcpo](https://github.com/open-webui/mcpo)  
[https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)  