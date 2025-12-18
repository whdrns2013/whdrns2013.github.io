---
title: "[Python] Best Practice - 딕셔너리에서 특정 조건의 서브 딕셔너리 만들기" # 제목 (필수)
excerpt: "dictionary comprehension으로 조건에 맞는 key-value만 깔끔하게 필터링하는 방법" # 서브 타이틀이자 meta description (필수)
date: 2025-12-18 17:30:00 +0900      # 작성일 (필수)
lastmod: 2025-12-18 17:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-18 17:30:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python dictionary 딕셔너리 서브                 # 태그 복수개 가능 (필수)
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
permalink: 
sidebar:
  nav: 
---
<!--postNo: 20251218_001-->

## 서브 딕셔너리 만들기  

### 예제  

- 아래 딕셔너리 dict_a 에서 key가 list_a에 포함되는 것만 추출해 서브 딕셔너리로 만들어야 한다.  

```python
aa = {"A":0.1, "B":0.5, "C":0.7, "D":0.5, "E":0.1}
list_a = ["A", "B"]
```

### best practice  

- 간단하다. dictionary comprehension 을 이용하면 된다.  

```python
sub_aa = {k:v for k,v in aa.items() if k in list_a}
print(sub_aa)

# >> {'A': 0.1, 'B': 0.5}
```