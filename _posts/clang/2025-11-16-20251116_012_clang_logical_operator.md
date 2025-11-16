---
title: "[C언어] 연산자 03. 논리 연산자"  # 제목 (필수)
excerpt: "불 값(boolean value)를 대상으로 참, 거짓을 구하는 연산자" # 서브 타이틀이자 meta description (필수)
date: 2025-11-16 23:55:00 +0900      # 작성일 (필수)
lastmod: 2025-11-16 23:55:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-16 23:55:00 +0900   # 최종 수정일 (필수)
categories: clang      # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 논리 연산자 AND OR NOT                    # 태그 복수개 가능 (필수)
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
  nav: docs_clang
---
<!--postNo: 20251116_012-->  



## 논리 연산자  

### 정의  

- 불 값(boolean value)를 대상으로 참, 거짓을 구하는 연산자  
- 즉, 피연산자가 불 값이다.  

### 종류  

| 연산자    | 기능        | 사용 예       |
| ------ | --------- | ---------- |
| `&&`   | 논리곱 (AND) | `a && b`   |
| `\|\|` | 논리합 (OR)  | `a \|\| b` |
| `!`    | 부정 (NOT)  | `!a`       |

> 논리곱과 논리합은 기호를 두 개연속으로 사용한다.  
> 뒤에서 살펴볼 비트 연산은 동일한 기호를 한 개만 사용하는데..  
> 이렇게 기억할 수도 있다.  
> "논리 연산자는 논리를 연산하는 `&`( 혹은 `|`) 하나와, 단축연산 여부를 검사하는 검사자 `&`(혹은 `|`) 하나가 붙어 두 개로 표현한다."  
> 정설이 아니라, 그냥 기억하기 위한 방법이다.  

### 예시  

```c
void logical_operation(){
    // && : 논리곱 (AND : 두 가지 모두 참이어야 참)
    if ((8 > 3) && (9 < 2) ) println("(1) both are true");
    else println("(1) someone is false");
    if ((8 > 3) && (9 > 2) ) println("(2) both are true");
    else println("(2) someone is false");

    // || : 논리합 (OR : 둘 중 하나라도 참이면 참)
    if ((8 > 3) || (9 > 2) ) println("(1) both are true");
    if ((8 > 3) || (9 < 2) ) println("(2) someone is true");
    if ((8 < 3) || (9 < 2) ) println("(3) both are false");

    // ! : 부정 (NOT : 단항연산, 참->거짓 / 거짓->참)
    int a = 2 > 1;
    printf("a : %d\n", a);
    printf("not a : %d\n", !a);
}
```

```bash
# 논리곱
(1) someone is false # 둘 중 하나 거짓 --> false 부분 출력
(2) both are true    # 모두 참 --> true 부분 출력

# 논리합
(1) both are true    # 둘 다 참 --> ture
(2) someone is true  # 둘 중 하나 참 --> true
                     # 둘 다 거짓 --> 출력되지 않음

# 부정
a : 1       # 참
not a : 0   # 거짓
```

### 단축 연산  

#### 정의  

- 논리 연산 과정에서 참이나 거짓이 확정되면, 논리식의 나머지 부분은 실행하지 않는 특성  
- 단축 연산으로 인한 아래와 같은 장점들이 있다.  
- (1) 불필요한 연산을 하지 않음  
- (2) 나머지 피연산자 수식으로 인한 오류도 방지할 수 있다.  

#### AND 연산에서의 단축 연산  

- 좌측의 피연산자가 거짓이면 전체 식의 결과는 거짓이 됨  
- 이 때 오른쪽 피연산자는 연산할 필요가 없다.  
- 따라서 좌측의 피연산자가 거짓이라면 오른쪽 피연산자는 연산되지 않는다.  

```c
// AND 연산에서 좌측이 거짓이면 전체 식의 결과는 거짓이 된다.
int a = 0;
int b = 10;
if (a != 0 && b / a > 10){
	println("참입니다.");
}

// 연산이 되지 않기 때문에 증감연산자 또한 계산되지 않는다.
int c = 1;
int d = 2;
if (c > d && ++c == d){
	println("c의 값은 d와 같습니다.");
}
printf("c : %d\n", c);  // 여기만 출력됨
```

```bash
# 출력
c : 1
```

#### OR 연산에서의 단축 연산  

- 좌측의 피연산자가 참이면 전체 식의 결과는 참이 됨  
- 이 때 오른쪽 피연산자는 연산할 필요가 없다.  
- 따라서 좌측의 피연산자가 참이라면 오른쪽 피연산자는 연산되지 않는다.  

```c
    // OR 연산에서 좌측이 참이면 전체 식의 결과는 참이 된다.
    int e = 1;
    int f = 20;
    if (e == 1 || f / e > 10){
        println("참입니다.");
    }

    // 연산이 되지 않기 때문에 증감연산자 또한 계산되지 않는다.
    int g = 3;
    int h = 2;
    if (g > h || --g == h){
        println("g의 값은 h와 같습니다.");
    }
    printf("g : %d\n", g);
```

```bash
참입니다.
g의 값은 h와 같습니다.
g : 3
```


## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
