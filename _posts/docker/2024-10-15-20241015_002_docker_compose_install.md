---
title: Docker Compose 2. Docker Compose 설치 # 제목 (필수)
excerpt: 도커 컴포즈 설치해보기 # 서브 타이틀이자 meta description (필수)
date: 2024-10-15 13:30:00 +0900      # 작성일 (필수)
lastmod: 2024-10-15 13:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-10-15 13:30:00 +0900   # 최종 수정일 (필수)
categories: docker         # 다수 카테고리에 포함 가능 (필수)
tags:  docker dockercompose compose 도커 컴포즈 도커 컴포즈                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20241015_002-->

## Docker Compose 설치하기  

바이너리를 직접 다운로드 받는 방법과, 패키지 관리 툴을 통한 설치 방법이 있습니다.  

### 1번 방법. 바이너리를 직접 다운로드  

```bash
# 바이너리 다운로드
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 설치 확인 (버전 확인)
docker-compose --version    # 설치 확인
>> Docker Compose version v2.29.7
```

### 2번 방법. 패키지 관리 툴을 통한 설치  

```bash
# Ubuntu
sudo apt update
sudo apt install docker-compose

# 설치 확인 (버전 확인)
docker-compose --version    # 설치 확인
>> Docker Compose version v2.29.7
```

