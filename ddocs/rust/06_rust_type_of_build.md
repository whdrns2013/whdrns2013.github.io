---
title: "[Rust] 6. Rust 의 빌드 종류" # 제목 (필수)
excerpt: 디버깅 빌드 릴리즈 빌드 테스트 빌드 # 서브 타이틀이자 meta description (필수)
date: 2025-05-24 18:30:00 +0900      # 작성일 (필수)
lastmod: 2025-05-24 18:30:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/06_rust_type_of_build
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
<!--postNo: 20250524_007-->


## Rust 빌드의 종류  

### 빌드 종류 요약  

| 빌드 종류 | 명령어                   | 설명             | 산출물 위치             | 최적화 |
| ----- | --------------------- | -------------- | ------------------ | --- |
| 디버그   | cargo build           | 개발 디버그용 빌드     | target/debug/      | ❌   |
| 릴리즈   | cargo build --release | 애플리케이션 배포용 빌드  | target/release/    | ✅   |
| 문서    | cargo doc             | 애플리케이션 설명문서 빌드 | target/doc/        | N/A |
| 테스트   | cargo test            | 코드 정확성 테스트     | target/debug/deps/ | ❌   |
| 벤치마크  | cargo bench           | 코드 성능 테스트      | target/release/    | ✅   |

---

### 디버그 빌드 (Debug Build)  

#### 목적  

- 빠른 컴파일  
- 개발시 디버그 용으로 빌드.  

#### 명령어  

```bash
cargo build
cargo run
```

#### 특징  

✅ 컴파일 속도 빠름  
✅ 심볼 정보 포함 (디버깅 가능)  
✅ 실행 속도 느림 (최적화 안 됨)  
✅ 산출물 위치: `target/debug/`  

---

### 릴리즈 빌드 (Release Build)  

#### 목적  

- 실행에 최적화된 실행 파일 생성  
- 애플리케이션 배포용 빌드  

#### 명령어  

```bash
cargo build --release
cargo run --release
```

#### 특징  

✅ 컴파일 속도 느림   
✅ 최적화 수준 높음 (`opt-level = 3`)  
✅ 실행 속도 빠름  
✅ 산출물 위치: `target/release/`  

---

### 문서 빌드(Documentation Build)  

#### 목적  

- Rust 문서 자동 생성  

#### 명령어  

```bash
cargo doc
cargo doc --open
```

![](/assets/images/20250524_007_001.png)  


#### 특징  

✅ `target/doc/`에 HTML 문서 생성  
✅ `--open` 옵션으로 브라우저에서 바로 열기  

---

### 테스트 빌드 (Test Build)  

#### 목적  

- 프로젝트 내 테스트 실행용  

#### 명령어  

```bash
cargo test
```

```bash
# test 결과 출력
   Compiling hello_world v0.1.0 (/..../hello_world)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.69s
     Running unittests src/main.rs (target/debug/deps/hello_world-87fa2baacdcc66af)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

#### 특징  

✅ 테스트 코드 포함 빌드  
✅ `target/debug/deps/`에 산출물 생성  

---

### 벤치마크 빌드 (Benchmark Build)  

#### 목적  

- 성능 벤치마크용 빌드  

#### 명령어  

```bash
cargo bench
```

```bash
# 결과 출력
   Compiling hello_world v0.1.0 (/.../hello_world)
    Finished `bench` profile [optimized] target(s) in 0.43s
     Running unittests src/main.rs (target/release/deps/hello_world-39bc61f259f238ba)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```
#### 특징  

✅ 벤치마크 코드 빌드 및 실행  
✅ 릴리즈 빌드로 컴파일 (최적화 포함)  

---

## Reference  

[https://doc.rust-lang.org/book/](https://doc.rust-lang.org/book/)  
[https://doc.rust-lang.org/cargo/](https://doc.rust-lang.org/cargo/)  