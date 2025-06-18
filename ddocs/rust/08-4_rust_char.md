---
title: "[Rust] 8-4. Rust 데이터타입 - 문자형 char" # 제목 (필수)
excerpt: "한 글자, 문자"  # 서브 타이틀이자 meta description (필수)
date: 2025-06-18 22:00:00 +0900      # 작성일 (필수)
lastmod: 2025-06-18 22:00:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/08_04_rust_char
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
<!--postNo: 20250618_001-->

## char 문자형  

- char 는 문자형 데이터타입이다.  
- 문자형, 즉 한 글자를 나타낼 수 있다.  
- 문자형은 작은따옴표로 감싸 표현한다. (문자열은 큰따옴표로)  
- 4바이트의 크기를 가지며, 유니코드 스칼라 값을 표현한다.  
- 유니코드 스칼라 값의 범위는 `U+0000`에서 `U+D7FF`, 그리고 `U+E000`에서 `U+10FFFF`.  
- 영대소문자, 한글, 이모지 등을 표현할 수 있다.  

```rust
// 문자형 데이터타입으로, `char` 라고 쓴다.
// 문자형은 작은따옴표로 감싼다. (문자열은 큰따옴표로 감쌈)
// 4바이트의 크기를 가진다.

let character = 'z';
let korean: char = '한';
let some_imozy: char = '😊';

println!("{}", character);
>> z

println!("{}", korean);
>> 한

println!("{}", some_imozy);
>> 😊
```

## Reference  

[https://doc.rust-kr.org/ch03-02-data-types.html](https://doc.rust-kr.org/ch03-02-data-types.html)  
[https://doc.rust-lang.org/book/](https://doc.rust-lang.org/book/)  