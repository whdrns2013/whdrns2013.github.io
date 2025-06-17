---
title: "[Rust] 8-2. Rust 데이터타입 - 정수형과 부동소수형" # 제목 (필수)
excerpt: Rust 에서 수를 다루기  # 서브 타이틀이자 meta description (필수)
date: 2025-06-16 21:30:00 +0900      # 작성일 (필수)
lastmod: 2025-06-16 21:30:00 +0900   # 최종 수정일 (필수)
permalink: /docs/rust/08_02_rust_integer_float
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
<!--postNo: 20250616_002-->



## Integers 정수형  

### 정수형 데이터타입  

- 소수점이 없는 숫자  
- 표현할 수 있는 크기에 따라 8bit, 16bit, 32bit, 64bit, 128bit와 시스템 비트수인 arch 로 나뉘며  
- 부호 있음(signed; i), 부호 없음 (unsigned; u) 두 가지로 나뉜다.  
- 기본값은 `i32` : 속도와 메모리 사용량에서 균형이 가장 잘 맞기 때문  
- 각 타입은 2^n (n: 비트수) 개의 숫자를 표현 가능하며,   
- signed 는 -2^(n-1) ~ 2^(n-1) - 1 까지, unsigned 는 0 ~ 2^n - 1 까지 표현이 가능하다.   

| 크기 (Bit) | 부호 있음 (Signed) | 부호 없음 (Unsigned) |
| -------- | -------------- | ---------------- |
| 8-bit    | `i8`           | `u8`             |
| 16-bit   | `i16`          | `u16`            |
| 32-bit   | `i32`          | `u32`            |
| 64-bit   | `i64`          | `u64`            |
| 128-bit  | `i128`         | `u128`           |
| 시스템 크기   | `isize`        | `usize`          |

### 사용 예시  

```rust
// 기본 선언 방법 : 변수명 뒤에 콜론(:) 을 붙이고, 그 다음 데이터타입을 명시
let a_number: u8 = 7;
print!("{a_number}");
>> 7

// 타입 접미사를 붙여서 타입을 지정할 수 있음
let type_tail = 16u8;
print!("{type_tail}");
>> 16

// u32 : 0 ~ 2^32 - 1
let a_number: u32 = u32::pow(2, 31);
print!("{a_number}");
>> 2147483648

// max value of datatype
let max_number:u16 = u16::MAX;
print!("{max_number}");
>> 65535

// system architecture
system architecture
let arch_number: isize = 16;
print!("{arch_number}");
>> 16

system architecture
let arch_max: isize = isize::MAX;
print!("{arch_max}");
>> 9223372036854775807
```


### Overflow  

- 연산 결과가 해당 데이터타입이 표현할 수 있는 범위를 초과하는 현상  
- Rust 에서는 이 오버프로우를 엄격하게 검사한다.  
- Overflow 에 대한 처리는 하단 별도 섹션에서 다룬다.  

```rust
// u32 - 2^32 :: overflow

let a_number: u32 = u32::pow(2, 32);
print!("{a_number}");

>> attempt to multiply with overflow
>> note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```


## Float 부동소수점 타입  

### 부동소수점 타입  

- f32 와 f64 두 가지 타입이 있음  
- 두 가지 유형은 표현 가능 값(정밀도) 에서의 차이가 존재  
- 기본 타입은 f64  
- 현대 CPU 상에서 f64 와 f32 가 대략 비슷한 속도를 내면서 더 정밀한 값 표현 가능  
- Rust 에서 모든 부동소수점 타입은 signed (부호가 있음)  

### 사용 예시  

```rust
let float_1 = 0.34f32;
let float_2:f32 = 0.34;
let float_3:f32 = 0.34f32;
```

### Overflow  

- Flow 데이터타입의 경우 표현 가능 범위를 벗어나도 오버플로우가 발생하지 않음.  
- overflow 오류가 나지 않고 표시할 수 있는 정밀도까지만 표현함  
- 표시 못하는 부분들은 버림처리 됨 (반올림 아님)  

```rust
let float_overflow_1:f32 = 0.65352154754845354354;
print!("{float_overflow_1}");

>> 0.65352154
```



## 연산  

### 연산의 종류  

#### 정수형 연산  

- 정수형, 부동소수형 연산은 기본적으로 아래와 같은 연산이 존재한다.  
- 더하기, 빼기, 곱하기, 나누기(몫), 나누기(나머지)  

```rust
// 더하기 연산
let a :i8 = -5;
let b :i8 = 10;
let sum = a + b;
println!("{sum}");
>> 5

// 곱하기 연산
let multiply = a * b;
println!("{multiply}");
>> -50

// 나누기 연산 ==> 나누기 후 몫만 반환됨
let divide = a / b;
println!("{divide}");
>> 0

let divide_2 = b / a;
println!("{divide_2}");
>> -2

// 나머지 연산 (Modulation)
let modulation = a % b;
println!("{modulation}");
>> -5
```

#### 부동소수형 연산  

- 기본적으로 정수형 연산과 동일하다.  

```rust
let float_a : f32 = 3.523;
let float_b : f32 = 1.234575;
let modulation = float_b / float_a;
println!("{modulation}")

>> 0.35043287
```


### 서로 다른 데이터타입 간 연산

- u8 + u16, u8 + f32 와 같이 서로 다른 타입 간 연산은 불가능  

```rust
let a = 5u8;
let b = 10u16;
let sum = a + b;
println!("{sum}")
>> cannot add `u8` to `u16`

let a = 5u8;
let b = 10i8;
let sum = a + b;
println!("{sum}")
>> cannot add `i8` to `u8`

let a = 5u8;
let b = 3.41274f32;
let sum = a + b;
println!("{}", sum)
>> cannot add `f32` to `u8`
```

- 부동소수형간 에도 서로 다른 타입 간 연산은 불가능  

```rust
let float_a : f32 = 3.523;
let float_b : f64 = 1.234575;
let modulation = float_b / float_a;
println!("{modulation}")

>> cannot divide `f64` by `f32`
```


## 오버플로우 다루기  

### wrapping_*  

- 오버플로우가 발생해도 panic 없이 결과값을 래핑하는 메서드  
- 정수의 최대값을 넘으면 다시 최소값부터 시작하게 된다.  
- `wrapping_add`, `wrapping_sub`, `wrapping_mul`, `wrapping_div`, `wrapping_rem` 이 있다.  

```rust
// overflow
let int_a : u8 = 254;
let int_b : u8 = 4;
let sum = int_a + int_b;
println!("{sum}");
>> attempt to compute `254_u8 + 4_u8`, which would overflow

// wrapping_add
let int_a : u8 = 254;
let int_b : u8 = 4;
let sum = int_a.wrapping_add(int_b);
println!("{sum}");
>> 2

// warpping_mul
let int_a : u8 = 128;
let int_b : u8 = 4;
let mul = int_a.wrapping_mul(int_b);
println!("{}", mul)
>> 0

// wrapping_rem
let int_a : u8 = 128;
let int_b : u8 = 4;
let rem = int_a.wrapping_rem(int_b);
println!("{}", rem)
>> 0
```

### checked_*

- 오버플러우 발생시 None 값을 반환  

```rust
let int_a : u8 = 254;
let int_b : u8 = 4;
let sum = int_a.checked_add(int_b);
println!("{:?}", sum);

>> None
```

### saturating_*  

- 오버플로우시 최대값으로 고정  
- saturating : 포화  

```rust
let int_a : u8 = 254;
let int_b : u8 = 4;
let sum = int_a.saturating_add(int_b);
println!("{}", sum);

>> 255
```


### overflowing_*  

- 튜플 (값, 오버플로우 여부)를 반환  

```rust
let int_a : u8 = 254;
let int_b : u8 = 4;
let sum = int_a.overflowing_add(int_b);
println!("{:?}", sum);

>> (2, true)
```


## Reference  

[https://doc.rust-kr.org/ch03-02-data-types.html](https://doc.rust-kr.org/ch03-02-data-types.html)  
[https://doc.rust-lang.org/book/](https://doc.rust-lang.org/book/)  