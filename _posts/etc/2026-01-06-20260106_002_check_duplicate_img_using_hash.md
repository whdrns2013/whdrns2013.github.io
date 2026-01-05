---
title: "해시(hash)를 이용해 중복 이미지 찾기" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2026-01-06 07:43:00 +0900      # 작성일 (필수)
lastmod: 2026-01-06 07:43:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-06 07:43:00 +0900   # 최종 수정일 (필수)
categories: etc        # 다수 카테고리에 포함 가능 (필수)
tags: hash 해시 hashlib python 중복 이미지 중복이미지                     # 태그 복수개 가능 (필수)
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
  nav: 
pinned: 
---
<!--postNo: 20260106_002-->

## Hash를 이용해 중복 이미지 찾기  

### Intro  

앞선 포스팅에서 해시의 개념과 함께 해시를 이용해 텍스트, 숫자, 이미지를 고정된 길이의 문자열(해시)로 변환하는 방법을 살펴봤다. 

이러한 특성을 활용하면 이미지 파일의 내용이 완전히 동일한지 비교하여 중복 이미지를 정확하게 찾아낼 수 있다.  

### 이미지 준비  

![](/assets/images/20260106_002_001.png)  

- 총 3개의 사과, 배 이미지 파일을 준비했다.  
- 이 중 2개는 같은 사과 이미지이며, 1개는 배 이미지이다.  
- 3개의 이미지 파일은 모두 파일명이 다르다.  

### 코드  

```python
import hashlib
import os
from collections import defaultdict

def file_hash(path, algo="md5", chunk_size=8192):
    h = hashlib.new(algo)
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()

def hash_files_in_directory(directory_path):
    hash_map = defaultdict(list)
    for root, _, files in os.walk(directory_path):
        for name in files:
            if name.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp")):
                path = os.path.join(root, name)
                hash_map[file_hash(path)].append(path)
    return hash_map

def check_duplicates(directory_path):
    hash_map = hash_files_in_directory(directory_path)
    duplicates = {h:paths for h, paths in hash_map.items() if len(paths) > 1}
    for paths in duplicates.values():
        print("중복 이미지 : ")
        for p in paths:
            print(" ", p)

directory_path = "/data/img"
check_duplicates(directory_path)
```

```bash
중복 이미지 : 
  /data/img/img01.png
  /data/img/img02.png
```
