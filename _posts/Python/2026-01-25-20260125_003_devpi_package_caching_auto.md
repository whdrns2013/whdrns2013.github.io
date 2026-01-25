---
title: "[devpi] 패키지 캐싱 자동화 스크립트" # 제목 (필수)
excerpt: "여러 패키지, 여러 파이썬 버전, 여러 OS 플랫폼에 대비한 캐싱 자동화" # 서브 타이틀이자 meta description (필수)
date: 2026-01-25 14:02:00 +0900      # 작성일 (필수)
lastmod: 2026-01-25 14:02:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-25 14:02:00 +0900   # 최종 수정일 (필수)
categories: Python       # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 devpi 패키지 서버 package server 캐싱 caching 인덱스 index 캐시 자동화 스크립트                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20250125_003-->

## 패키지 캐싱 자동화 스크립트

### 목적

- devpi 인덱스에 패키지 + 모든 의존성 wheel/sdist를 미리 캐시해두기 위함
- CI, 서버 초기화, 개발 환경을 폐쇄망으로 이전하기 전에 1회 실행하는 작업

### 기본 스크립트

```bash
#!/usr/bin/env bash
set -e

DEVPI_INDEX="http://{HOST}:{PORT}/{user}/{index}/+simple"
PKG_LIST="pandas pydantic numpy scipy"

python -m venv .warmup-venv
source .warmup-venv/bin/activate

pip install -U pip

pip download \
  --index-url "$DEVPI_INDEX" \
  --dest ./wheelhouse \
  $PKG_LIST
```

- `wheelhouse/`에 **모든 결과물 보존**
- devpi 서버에 **캐시**

### requirements 파일 사용시

```bash
# requirements.txt
pandas
requests
pydantic
fastapi
```

```bash
#!/usr/bin/env bash
set -e

DEVPI_INDEX="http://{HOST}:{PORT}/{user}/{index}/+simple"
REQ_FILE="./requirements.txt"

python -m venv .warmup-venv
source .warmup-venv/bin/activate

pip install -U pip

pip download \
  --index-url "$DEVPI_INDEX" \
  --dest ./wheelhouse \
  -r $REQ_FILE
```

### 파이썬 버전 및 플랫폼 고려

```bash
# requirements.txt
pandas
requests
pydantic
fastapi
```

```bash
#!/usr/bin/env bash
set -e

DEVPI_INDEX="http://{HOST}:{PORT}/{user}/{index}/+simple"
DEST_DIR="./wheelhouse"

# 캐싱 대상 패키지 (버전 고정 권장)
REQ_FILE="./requirements.txt"

# Python 버전 (cp 태그 기준)
PY_VERSIONS=(39 310 313)

# 플랫폼 목록
PLATFORMS=(
  "manylinux2014_x86_64"
  "win_amd64"
  "macosx_11_0_arm64"
)

python -m venv .warmup-venv
source .warmup-venv/bin/activate
pip install -U pip

mkdir -p "$DEST_DIR"

for PLATFORM in "${PLATFORMS[@]}"; do
  for PY in "${PY_VERSIONS[@]}"; do
    echo ">>> platform=${PLATFORM}, python=cp${PY}"
    pip download \
      --index-url "$DEVPI_INDEX" \
      --platform "$PLATFORM" \
      --python-version "$PY" \
      --implementation cp \
      --abi "cp${PY}" \
      --only-binary=:all: \
      --dest "$DEST_DIR" \
      -r $REQ_FILE
  done
done
```

## 캐싱 자동화 스크립트 사용

- 자동화 스크립트의 이름은 [`devpi-warm-up.sh`](http://devpi-warm-up.sh) 라고 가정한다.
- 아래 명령어들을 실행시킨 뒤, 패키지들이 성공적으로 모두 설치되는지 확인한다.

```bash
chmod 755 devpi-warm-up.sh
./devpi-warm-up.sh
```