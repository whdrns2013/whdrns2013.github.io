---
title: "[Python] with 구문에서 사용하는 컨텍스트 매니저 만들어보기" # 제목 (필수)
excerpt: "직접 컨텍스트 매니저를 만들어보자" # 서브 타이틀이자 meta description (필수)
date: 2026-03-23 04:23:00 +0900      # 작성일 (필수)
lastmod: 2026-03-23 04:23:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-03-23 04:23:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 context manager 컨텍스트 매니저 with 구문 실습 원리                     # 태그 복수개 가능 (필수)
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
  nav: docs_python
pinned: 
---
<!--postNo: 20260323_001-->


## Context Manager

### 개념

- 지난 포스팅에서 살펴봤듯 특정 작업 전후에 필요한 작업을 자동으로 처리하는 것을 의미한다.
- `__enter__()` 메서드와 `__exit__()` 메서드가 각각 사전작업, 사후작업을 맡아 처리한다.
- 엄밀히 구분하면 with 구문에서 직접 쓰이는 것은 **컨텍스트 매니저 인스턴스** , 그리고 이를 만들어내는 클래스는 **컨택스트 매니저 클래스** 라고 할 수 있다.

### 구조

```python
class ClassName:
    
    def __enter__(self, params):
        # ... 사전 처리 ...

    def __exit__(self, exc_type, exc_value, traceback):
        # ... 사후 처리 ...
```

### 예시

- 단순히 프린트를 출력하고, 컨텍스트가 닫히면 프린트 내역을 파일로 저장하는 클래스

```python
class PrintRecorder:
    
    def __enter__(self):
        from datetime import datetime
        self.start_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.print_history = list()
        return self

    def print(self, text):
        print(text)
        self.print_history.append(text)
    
    def __exit__(self, exc_type, exc_value, traceback):
        with open(f"{self.start_time}.txt", "w", encoding="utf-8") as f:
            for text in self.print_history:
                f.write(text + '\n')
```

- 사용

```python
with PrintRecorder() as p:
    p.print("안녕하세요")
    p.print("반갑습니다")
    p.print("프린트 기록 컨텍스트 매니저 테스트입니다.")
```

- `2026-03-20 01:52:26.txt` 파일 내용

```python
안녕하세요
반갑습니다
프린트 기록 컨텍스트 매니저 테스트입니다.

```