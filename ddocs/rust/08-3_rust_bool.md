---
title: "[Rust] 8-3. Rust 데이터타입 - 부울형" # 제목 (필수)
excerpt: Rust 에서 참과 거짓을 다루기  # 서브 타이틀이자 meta description (필수)
date: 2025-06-17 07:25:00 +0900      # 작성일 (필수)
lastmod: 2025-06-17 07:25:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/08_03_rust_bool
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
<!--postNo: 20250617_001-->



## Boolean 부울형  

### Boolean 부울형 데이터타입  

- 참(`true`) 혹은 거짓(`false`) 값을 나타내는 Boolean 데이터타입  

### 사용 예시  

#### 기본적인 변수 선언  

- 보통 타입을 명시하지 않고, 아래 예시의 첫 번째처럼 선언하여 사용한다.  

```rust
// bool 변수 선언
let the_true = true;
let the_false : bool = false; // 명시적 타입 어노테이션
```

### 연산  

#### bool 논리 연산  

- `&&` : AND 연산  
- `||` : OR 연산  
- `!` : NOT 연산  

```rust
// bool 논리 연산

let bool_and = true && false;
let bool_or = true || false;
let bool_not = !true;

println!("AND: {}", bool_and);
>> AND: false

println!("OR: {}", bool_or);
>> OR: true

println!("NOT: {}", bool_not);
>> NOT: false
```

#### 단락 평가  

- bool 연산은 **단락평가(short-circuit evaluation)** 을 수행한다.  
- 단락평가란, 두 개 이상의 bool 값을 이용한 논리연산에서 결과가 정해지면, 나머지 연산을 생략하는 것이다.  
- 예를 들어, 거짓인 a 와 참인 b를 AND 연산을 하면, a 만 연산을 하고, b는 연산을 하지 않는다.  

```rust
fn some_func()-> bool{
	println!("This is some func!!"); // 이 함수가 실행되면 문구 출력
	true // true 값을 반환
}

fn main() {

	/* try 1 */
	let short_circuit_eval = true && some_func();
	println!("short circuit eval : {}", short_circuit_eval);
	// >> This is some func!!
	// >> short circuit eval : true

	/* try 2 */
	let short_circuit_eval = false && some_func();
	println!("short circuit eval : {}", short_circuit_eval);
	// >> short circuit eval : false
}
```

- 위 예시를 살펴보자  
- `some_func()`는 `"This is some func!!"`을 출력하고 `true`를 반환한다.  
- **try 1**에서는 출력이 발생한 것으로 보아, `some_func()`가 실행되었다.  
- **try 2**에서는 출력이 없으므로, 함수가 실행되지 않은 것을 알 수 있다.  
- 이는 AND 연산에서 앞 항이 `false`면 뒷 항을 평가하지 않기 때문이다.  
- 이에 `some_func()`는 생략되었고, 출력도 없었던 것이다.  

#### 비트 연산

- boolean 값들도 **비트연산이 가능**하다.  
- 그 이유는, ture 와 false  가 각각 `0b000001`, `0b000000` 값을 가지기 때문이다.  
- 기본적으로 0과 1의 연산이기 때문에 논리연산과 같은 결과를 가진다.  
- 하지만 **분명한 이유가 없다면, 목적에 맞는 연산을 하는 걸 권장**한다.  
- 또한 비트 연산은 논리 연산과 달리 단락평가를 하지 않는다는 점을 참고.  

```rust
// bool 비트 연산
let bool_and = true & false;
let bool_or = true | false;

println!("AND: {}", bool_and);
>> AND: false
// 0b00000001
// 0b00000000
// ---------- AND
// 0b00000000

println!("OR: {}", bool_or);
>> OR: true
// 0b00000001
// 0b00000000
// ---------- OR
// 0b00000001
```


## 🔍 Rust에서 `bool`은 왜 1바이트인가?  

### ✅ 결론 먼저  

- Rust의 `bool` 타입은 **1비트 정보만 필요하지만, 내부적으로는 1바이트(8비트)를 사용**함.  
- -> 이는 **성능, 메모리 정렬, 안전성 측면에서 의도된 설계**이다.  

### 1 바이트에 들어가는 값은?

- Rust에서 `bool` 타입은 다음과 같이 값이 정의된다.  

| 의미      | 값                 |
| ------- | ----------------- |
| `false` | `0x00` (00000000) |
| `true`  | `0x01` (00000001) |

### 왜 1비트가 아닌 1바이트인가?

#### 💡 정렬(alignment) 문제  

- CPU는 보통 **1바이트 단위로 메모리를 읽고 씀**  
- 만약 여러 개의 bool 값을 1비트씩 저장하려면 **비트 단위로 조작**해야 함  
- -> 이는 **성능과 구현 난이도** 측면에서 불리  

#### 💡 구조체 패딩(padding) 이슈  

- Rust 구조체에서는 정렬 규칙 때문에 패딩이 자동으로 삽입됨  
- `bool`이 1바이트 단위여야 다른 필드들과의 **정렬도 자연스럽**고  
- **메모리 낭비를 줄이기** 쉬움  

#### 💡 안전성(safety)  

- Rust는 명확하고 예측 가능한 동작을 추구함.  
- 만약 `bool`이 1비트라면, **비트 연산 실수나 포인터 연산에서 문제가 생길 가능성** 큼.  
- 1바이트로 고정하면 이런 모호성이 사라짐.  


## Reference  

[https://doc.rust-kr.org/ch03-02-data-types.html](https://doc.rust-kr.org/ch03-02-data-types.html)  
[https://doc.rust-lang.org/book/](https://doc.rust-lang.org/book/)  