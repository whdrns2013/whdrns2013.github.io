---
title: "[Python] Base64 이미지 인코딩 - Data URL(URI) prefix 자동 붙이기" # 제목 (필수)
excerpt: "data:image/png;base64, 자동으로 붙이는 방법" # 서브 타이틀이자 meta description (필수)
date: 2026-05-11 01:10:00 +0900      # 작성일 (필수)
lastmod: 2026-05-11 01:10:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-05-11 01:10:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 이미지 인코딩 image encoding base64 url imageurl
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
series: 
series_index: 
---

<!--postNo: 20260511_001-->

## 이미지 인코딩  

이미지 파일은 내부적으로 **바이너리 데이터**로 이루어져 있다. 즉, 사람이 읽을 수 있는 문자열이 아니라 컴퓨터가 처리하는 바이트 데이터로 이루어져 있다.  

일반적으로 이미지는 파일 자체로 저장하거나 전송할 수 있지만, 경우에 따라 이미지를 문자열 형태로 변환해야 할 때가 있다. 예를 들면 아래와 같은 상황들이다.  

- API 응답으로 이미지를 문자열 형태로 변환해 보내야할 때  
- JSON 데이터 안에 이미지를 포함해야 할 때  
- HTML 문서 안에 이미지를 직접 포함할 때  

이 때 자주 사용하는 방식이 **Base64 인코딩**이다.  

### 1. 인코딩  

인코딩은 **데이터를 특정한 규칙에 따라 다른 형태로 변환하는 과정**을 말한다.  

이미지 인코딩에서는 이미지 파일의 바이너리 데이터를 문자열로 변환하는 경우가 많다. 예를 들어 이미지 파일은 원래 다음과 같은 바이너리 데이터이다.  

```python
with open("apple.png", "rb") as f:
    print(f.read())
```

```bash
b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x02\x04\x00\x00\x01\xf8\x08\x06\x00\...'
```

이 데이터를 문자열로 변환하면 텍스트 기반 환경에서도 이미지를 다룰 수 있다.  

```python
import base64

with open("apple.png", "rb") as f:
    image = f.read()
    encoded_image = base64.b64encode(image).decode("utf-8")
    print(encoded_image)
```

```bash
iVBORw0KGgoAAAANSUhEUgAAAgQAAAH4CAYAAAA1uvVpAAAMTWlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8k...
```

즉, 이미지 인코딩은 이미지 데이터를 다른 시스템이나 문서에서 다루기 쉽게 변환하는 과정이라고 볼 수 있다.  


### 2. Base64  

Base64는 **바이너리 데이터를 문자 데이터로 변환하는 인코딩 방식**이다. 이미지, 파일, 인증 정보, 이메일 첨부파일 등 다양한 **바이너리 데이터를 텍스트 기반 환경에서 안전하게 전달하기 위해 사용**한다.  

앞서 살펴봤듯 Base64로 인코딩하면 이미지 파일 자체가 다음과 같은 문자열로 변환된다.  

```bash
iVBORw0KGgoAAAANSUhEUgAAAgQAAAH4CAYAAAA1uvVpAAAMTWlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8k...
```

이 문자열은 일반 텍스트처럼 보이지만, 실제로는 이미지의 바이너리 데이터를 문자로 표현한 값이다.  

다만 Base64 인코딩은 원본보다 데이터 크기가 커질 수 있다는 단점이 있다. 따라서 큰 이미지를 무조건 Base64로 변환해 사용하는 것보다는, 아래와 같이 적절한 상황에 사용하는 것이 권장된다.  

- API에서 이미지 데이터를 JSON으로 전달해야 할 때   
- 별도 이미지 파일 경로 없이 이미지를 즉시 렌더링해야 할 때  
- 작은 아이콘 이미지를 HTML에 직접 포함할 때  


### 3. 파이썬에서 Base64로 이미지 인코딩하기  

- Python 에서는 내장 모듈인 `base64` 를 사용해 이미지를 Base64 문자열로 변환할 수 있다.  

```python
import base64

with open("apple.png", "rb") as f:
    image = f.read()
    encoded_image = base64.b64encode(image).decode("utf-8")
    print(encoded_image)
```

- 잊지 말아야 할 것은, 파일로 열 때는 반드시 바이트코드 방식(rb)로 읽어들여야 한다는 점.  
- rb 는 read binary의 약자  

```python
encoded_image = base64.b64encode(image).decode("utf-8")
```

- 위 코드가 가장 중요한 부분이라 따로 살펴보겠다.  
- `base64.b64encode()` 는 바이트 데이터를 Base64로 변환하는 부분이다.  
- `.decode("utf-8")` 은 바이트 타입인 `encode()` 의 결과물을 문자열로 변경해주는 부분이다.  


## Data URL Prefix  

앞선 내용에서는 파이썬에서 이미지를 Base64 문자열로 변경하는 방법을 살펴보았다.  

```bash
iVBORw0KGgoAAAANSUhEUgAAAgQAAAH4CAYAAAA1uvVpAAAMTWlDQ1BJQ0MgUHJvZmlsZQAASImVVwdYU8k...
```

하지만 이 값만으로는 브라우저가 이 문자열이 이미지인지, 어떤 이미지 타입인지 알 수가 없다. 때문에 이 문자열에 추가적인 정보를 더해야 한다.  

### 1. Data URL Prefix 란  

- `Data URL` 이란 외부 파일 경로를 참조하지 않고, 데이터 자체를 URL 형식 안에 포함하는 방식을 일컫는다.  
- 그리고 이 때, 데이터 앞에 붙어서 참고 설명을 하는 것이 바로 `Data URL Prefix`이다.  

```bash
data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

- 예를 들어 HTML에서는 다음과 같이 사용할 수 있다.  

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..." />
```

이때 브라우저는 이 내용을 보고 다음과 같이 해석한다.  

```plaintext
이 데이터는 PNG 이미지이고, Base64 방식으로 인코딩되어 있다.
```

### 2. Data URL Prefix의 구조  

Data URL Prefix의 기본 구조는 다음과 같다.  

```plaintext
data:[MIME 타입];base64,[Base64 문자열]
```

예를 들어 PNG 이미지는 다음과 같이 표현할 수 있다.  

```plaintext
data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

### 3. MIME  

MIME는 Multipurpose Internet Mail Extensions의 약자로, 데이터의 종류를 알려주는 타입 정보라고 보면 된다.  

브라우저나 서버는 MIME 타입을 보고 이 데이터가 이미지인지, HTML 문서인지, JSON인지, PDF인지 판단한다.  

자주 사용하는 MIME 타입은 다음과 같다.  

| 데이터 종류   | MIME 타입            |
| -------- | ------------------ |
| HTML     | `text/html`        |
| CSS      | `text/css`         |
| JSON     | `application/json` |
| PNG 이미지  | `image/png`        |
| JPEG 이미지 | `image/jpeg`       |
| GIF 이미지  | `image/gif`        |
| WebP 이미지 | `image/webp`       |


### 4. 확장자에 따라 MIME 타입을 자동으로 붙이는 함수  

매번 이미지 확장자에 따라 `image/png`, `image/jpeg` 를 직접 작성하는 것은 매우 번거로운 일이다.  

Python에서는 `mimetypes` 모듈을 사용하면 파일 확장자를 기준으로 MIME 타입을 추측해 반환할 수 있다. 이를 이용해 이미지를 변환한 Base64 데이터에 대해 Data URL 을 자동으로 붙여주는 코드를 아래와 같이 작성해봤다.  

```python
import base64
import mimetypes

def image_to_data_url(path: str) -> str:
    mime_type, _ = mimetypes.guess_type(path)

    if mime_type is None:
        mime_type = "application/octet-stream"

    with open(path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded}"
```

이 함수는 다음과 같은 순서로 동작한다.  

- (1) `mimetypes.guess_type()`으로 파일의 MIME 타입을 추측한다.  
- (2) 파일을 바이너리 모드로 읽는다.  
- (3) 이미지 데이터를 Base64로 인코딩한다.  
- (4) `data:{mime_type};base64,{encoded}` 형식으로 반환한다.  


### 5. 사용 예시 및 출력 결과  

- 사용 예시  

```python
data_url = image_to_data_url("image.png")

print(data_url)
```

- 출력 결과(png)  

```bash
data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

- 출력 결과(jpg)  

```bash
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...
```


