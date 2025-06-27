---
title: "[Rust] 8-6. Rust 데이터타입 - 배열형 array" # 제목 (필수)
excerpt: "동일한 데이터타입 원소들을 가지는 compound tpye " # 서브 타이틀
date: 2025-06-27 15:50:00 +0900      # 작성일 (필수)
lastmod: 2025-06-27 15:50:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/08_06_rust_array
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

<!--postNo: 20250627_001-->

## array 배열형  

### array  

- **동일한 타입**의 여러 값을 묶어 하나의 **복합 타입(compound type)으로** 만드는 자료형  
- 튜플과 달리 동일한 데이터타입의 원소만 가질 수 있다!  
- 고정된 길이를 가지며 길이 수정 불가  

### 선언 방법  

- 대괄호로 원소값들을 묶으며, 각 원소는 쉼표로 구분한다.  
- compound type 이므로 `{:?}` 로 출력한다.  

```rust
let arr = [1, 2, 3, 4, 5];

println!("{:?}", arr);
>> [1, 2, 3, 4, 5]
```

- 명시적으로 데이터타입을 어노테이션 할 때에는 변수측에 `[데이터타입; 원소개수]` 와 같이 선언한다.  

```rust
let arr: [u8; 5] = [1, 2, 3, 4, 5];

println!("{:?}", arr);
>> [1, 2, 3, 4, 5]
```

- 동일한 값을 n개 가지는 배열은 `[데이터타입; 개수]` 와 같은 형식으로 간단하게 선언할 수 있다.  

```rust
let arr = [3; 5];

println!("{:?}", arr);
>> [5, 5, 5, 5, 5]
```

- 서로 다른 데이터타입의 원소를 가질 수 없다.  

```rust
let arr = ['가', 3, 3.14];

>> error: could not compile `datatype` (bin "datatype") due to 1 previous error; 2 warnings emitted
```

### 사용 방법  

- 원소에 접근할 때에는 대괄호 안에 인덱스 번호를 입력하는 `bracket syntax`를 사용한다.  

```rust
let arr: [u8; 5] = [1, 2, 3, 4, 5];

println!("{:?}", arr[0] + arr[4]);
>> 6
```

- 다수의 원소에 한 번에 접근할 때에는 슬라이싱 `[i..j]` 을 이용할 수 있다.  

```rust
let arr: [u8; 5] = [1, 2, 3, 4, 5];

println!("{:?}", &arr[0..3]);
>> [1, 2, 3]
println!("{:?}", &arr[2..]);
>> [3, 4, 5]
println!("{:?}", &arr[..2]);
>> [1, 2]
```

- 유효 범위를 벗어난 원소 접근은 런타임 패닉을 발생시킨다.  

```rust
let arr: [u8; 5] = [1, 2, 3, 4, 5];

println!("{:?}", &arr[7]);
>> index out of bounds: the length is 5 but the index is 7
```

## Reference  

[https://doc.rust-kr.org/ch03-02-data-types.html](https://doc.rust-kr.org/ch03-02-data-types.html)  
[https://doc.rust-lang.org/book/ch03-02-data-types.html](https://doc.rust-lang.org/book/ch03-02-data-types.html)  