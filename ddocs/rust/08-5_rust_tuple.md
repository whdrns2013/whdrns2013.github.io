---
title: "[Rust] 8-5. Rust 데이터타입 - 튜플형 tuple" # 제목 (필수)
excerpt: "각기 다른 데이터타입의 원소를 가질 수 있는 compound datatype" # 서브 타이틀
date: 2025-06-25 12:52:00 +0900      # 작성일 (필수)
lastmod: 2025-06-25 12:52:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/08_05_rust_tuple
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
<!--postNo: 20250625_002-->

## tuple 튜플형  

### tuple  

- **다양한 타입**의 여러 값을 묶어 하나의 **복합 타입**으로 만드는 자료형  
- 복합 타입은 compound type 이라고 한다.  
- 고정된 길이(length)를 가지며, 한 번 선언되면 길이를 변경할 수 없다.  

### 선언 방법  

- 괄호 안에 원소값을 넣으며, 각 원소는 쉼표로 구분한다.  
- 튜플과 같은 compound type은 `{:?}` 로 출력이 가능하다.  

```rust
let tup: (i32, f64, u8) = (32213, 2.41242, 254);

println!("{:?}", tup);
>> (32213, 2.41242, 254)
```

- 선언 시 데이터타입을 생략하면 자동적으로 어울리는 데이터타입이 설정된다.  

```rust
let tup = (123, 1.232, "러스트");

println!("{:?}", tup);
>> (123, 1.232, "러스트")
```

### 사용 방법  

- `구조해제 바인딩` : 튜플 내 각 원소를 한 번에 여러 변수에 바인딩 할 수 있다.  

```rust
let tup = (123, 1.232, "러스트");
let (a, b, c) = tup;

println!("{}", a);
>> 123
println!("{}", b);
>> 1.232
println!("{}", c);
>> 러스트
```

- 튜플 내 각 원소에 접근할 때에는 `필드접근방식(dot syntax)` 를 사용한다.  
- 원소 번호는 0부터 시작된다.  

```rust
let tup: (f64, f64, &str) = (123.0, 1.232, "러스트");

println!("{}", tup.2);
>> 러스트
println!("{}", tup.0 + tup.1);
>> 124.232
```

### 유닛 Unit  

- 아무 원소도 가지고 있지 않은 튜플  
- Rust 에서 특별한 의미를 가지는데,  
- **함수의 반환값이 없을 때**나 **부작용 중심의 연산**을 표현할 때 사용된다.  
- 즉, "의미있는 값을 전달하지 않는다" 라는 의미.  

```rust
let unit = ();

println!("{:?}", unit);
>> ()
```


## 정리하기  

- 튜플 : 다양한 데이터타입의 원소를 묶어 만드는 하나의 복합 데이터 타입    
- 괄호 안에 원소값들을 쉼표로 구분하여 사용한다.  
- 내부 원소에 접근할 때에는 필드 접근 방식 (dot syntax) 를 이용한다.  
- 원소가 없는 튜플을 유닛이라고 하며, 반환값이 없는 경우 등을 표현할 때 사용한다.  


## Reference  

[https://doc.rust-kr.org/ch03-02-data-types.html](https://doc.rust-kr.org/ch03-02-data-types.html)  
[https://doc.rust-lang.org/book/ch03-02-data-types.html](https://doc.rust-lang.org/book/ch03-02-data-types.html)  

