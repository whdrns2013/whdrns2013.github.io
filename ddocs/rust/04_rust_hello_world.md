---
title: "[Rust] 3. Hello World!" # 제목 (필수)
excerpt: 역시 프로그래밍의 첫 시작은 Hello World! # 서브 타이틀이자 meta description (필수)
date: 2025-05-24 17:00:00 +0900      # 작성일 (필수)
lastmod: 2025-05-24 17:00:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/04_rust_hello_world
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
<!--postNo: 20250524_004-->


## Hello Wrold!  

### main.rs 파일 열어보기  

- 이전 포스팅에서 만든 프로젝트 디렉터리의 `main.rs` 파일을 열어보면  
- 아래와 같이 Hello World! 를 출력하는 main 함수가 정의되어 있을 것이다.  

```rust
fn main() {
	println!("Hello World!");
}
```

### Hello World! 로 알아보는 기본 문법  

- 함수 정의시에는 `fn` 키워드를 사용한다.  
- 함수는 여타 프로그래밍 언어와 동일하게 이름과 파라미터 부로 작성한다.  
- 함수의 내용을 정의하는 블록은 중괄호(`{ }`) 로 표시한다.  
- 라인 종료는 세미콜론(`;`) 으로 표시한다.  

### main.rs 실행시키기  

- 코드 에디터에서 main.rs 를 열면, main 함수 위에  `Run | Debug` 버튼이 있을 것이다.  
- 이 중 Run 버튼을 누르면 된다.  

![](/assets/images/20250524_004_001.png)  

- 그러면 코드가 빌드 된 뒤  
- 실행 결과가 아래의 터미널 창에 표시될 것이다.  

![](/assets/images/20250524_004_002.png)  