---
title: "[Rust] 8-7. Rust 의 튜플과 배열에서 원소 접근 방법이 다른 이유" # 제목 (필수)
excerpt: "튜플은 필드 접근 방식, 배열은 인덱스 접근 방식인 이유" # 서브 타이틀
date: 2025-06-28 09:50:00 +0900      # 작성일 (필수)
lastmod: 2025-06-28 09:50:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/08_07_rust_tuple_array_syntax
toc: true
toc_sticky: true
toc_icon: "columns"
layout: single
classes: wide
sidebar:
  nav: "docs_rust"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

<!--postNo: 20250628_001-->


## 튜플과 배열의 원소 접근 방식 차이  

### 튜플과 배열의 원소 접근 방식 차이  

- 튜플은 `.`(닷) 연산자를 이용해서 원소에 접근한다.  
- 배열은 `[]`(대괄호) 연산자를 이용해서 원소에 접근한다.  
- 이 차이는 자료구조의 성격 차이와 언어 설계 철학에 따른 것  

### 튜플  

- 각 원소의 타입과 위치가 고정되어있음  
- `컴파일 타임(시전)`에 크기와 타입이 결정됨  
- 이에 따라 `tuple.0`, `tuple.1` 과 같이 **필드 접근 방식(dot syntax)** 가 적합함  

### 배열  

- 배열이나 슬라이스는 모든 원소가 동일한 타입이며  
- 인덱스로 동적으로 접근하는 것이 일반적임  
- 이에 따라 `arr[0]`, `arr[1]` 처럼 **인덱스 기반 접근 (bracket syntax)** 를 사용하는 것이 자연스러움  
- 이 접근 방식은 C 나 Pthon 등대부분의 언어에서 사용되는 전통적인 배열 접근 방식과 일치  

### 결론  

- **튜플**: 정적, heterogenous (서로 다른 타입 가능), 필드 접근 중심 → dot syntax  
- **배열/슬라이스**: 동적, homogenous (같은 타입), 인덱스 기반 접근 → bracket syntax  


```rust
let tup = (1, 2, 3, "한", 3.123);
let arr = [5, 6, 7, 8, 9];

println!("{}", tup.1);
>> 2
println!("{}", arr[1]);
>> 6
println!("{:?}", &arr[1..3]);
>> [6, 7]
```