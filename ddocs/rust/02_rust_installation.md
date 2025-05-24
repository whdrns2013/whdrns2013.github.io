---
title: "[Rust] 1. Rust 설치와 개발 환경 준비" # 제목 (필수)
excerpt: Rust 프로그래밍 환경을 준비해보자  # 서브 타이틀이자 meta description (필수)
date: 2025-05-24 16:00:00 +0900      # 작성일 (필수)
lastmod: 2025-05-24 16:00:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/02_rust_installation
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
<!--postNo: 20250524_002-->


## 설치  

### Rustup 을 사용하여 설치  

- 자세한 설치 방법은 Rust 사이트 참고  

[https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)  

- 권장 설치 방법  

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

- 설치 옵션 -> 모르면 1번  

```bash
Current installation options:

1) Proceed with standard installation (default - just press enter)
2) Customize installation
3) Cancel installation
```

- 아래와 같은 패키지들이 함께 설치됨  

```bash
info: downloading component 'cargo'      # Rust 패키지 관리 툴
info: downloading component 'clippy'
info: downloading component 'rust-docs'
info: downloading component 'rust-std'
info: downloading component 'rustc'
info: downloading component 'rustfmt'
```

|구성 요소|설명|
|---|---|
|**Cargo**|Rust의 패키지 관리자이자 빌드 시스템. 의존성 관리 및 프로젝트 빌드를 담당.|
|**Clippy**|Rust 코드에 대한 정적 분석 도구. 코드 품질 향상을 위한 권장 사항 제공.|
|**rust-docs**|Rust의 공식 문서. Rust 언어 및 표준 라이브러리에 대한 설명과 예제 포함.|
|**rust-std**|Rust의 표준 라이브러리. 기본 기능과 데이터 구조를 제공.|
|**rustc**|Rust 컴파일러. 소스 코드를 실행 가능한 바이너리 코드로 변환.|
|**rustfmt**|Rust 코드 포맷터. 코드를 일관된 스타일로 정렬하고 포맷팅.|


### 설치 확인  

- `rustc` 버전 확인으로 설치되었는지 확인 가능  

```bash
$ rustc --version
rustc 1.81.0 ...
```

### 어디에 설치되나?  

- Linux / Mac : `~/.cargo` , `~/.rustup`  
- Windows : `유저디렉터리/.cargo`, `유저디렉터리/.rustup`  

### 설치 용량은?  

```bash
# cargo
$ du -sh ./.cargo
>> 11M    ./.cargo

# rustup
$ du -sh ./.rustup
1.2G    ./.rustup
```

### 업데이트  

- `rustup update` 로 러스트 버전 업데이트 가능  
- 6주마다 새로운 안정화 버전이 나오므로, 주기적 업데이트 권장.  

```bash
rustup update
```


## 실행환경 준비  

### VScode  

- Microsoft 에서 만든 코드(텍스트) 에디터  
- 수많은 Extentions(확장기능)과 활성화된 마켓플레이스로 다양한 기능 추가 가능  
- 때문에 단순 코드 에디터를 넘어, IDE 로도 활용 가능  

[https://code.visualstudio.com/](https://code.visualstudio.com/)  

### VScode 에서 Rust 실행 환경 준비  

아래의 Extension 설치  

- rust-analyzer  

![](/assets/images/20250524_002_001.png)

### VScode 에서 효율적인 Rust 프로그래밍 하기  

- VScode 에는 효율적인 Rust 프로그래밍을 위한 여러 가지 기능이 준비되어 있다.  
- 자세한 내용은 VScode Doc 에 기재되어 있으므로 참고  

[https://code.visualstudio.com/docs/languages/rust](https://code.visualstudio.com/docs/languages/rust)  


## Reference  

[https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)  
[https://rust-kr.org/pages/install/](https://rust-kr.org/pages/install/)  
[https://code.visualstudio.com/docs/languages/rust](https://code.visualstudio.com/docs/languages/rust)  