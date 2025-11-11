---
title: "[C언어] 선행처리 2.매크로" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-02 02:05:00 +0900      # 작성일 (필수)
lastmod: 2025-11-02 02:05:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-02 02:05:00 +0900   # 최종 수정일 (필수)
categories: clang        # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 선행처리 선행처리기 preprocessing preprocess preprocessor 매크로 macro 상수 함수                    # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20251102_014-->


## 매크로  

### 정의   

- `#define` 으로 정의된 이름을 해당 값 또는 코드 패턴으로 **단순 치환**한다.  
- 자주 사용되는 명령이나 수식 또는 상수에 대해 이를 대표하는 이름(=매크로 이름)을 붙여 사용한다.  
- 매크로를 해제할 때에는 `#undef` 지시어를 사용한다.  

### 표현  

| 표현                         | 설명     |
| -------------------------- | ------ |
| `#define 매크로명 상수값`         | 매크로 상수 |
| `#define 매크로명(인수리스트) (수식)` | 매크로 함수 |
| `#undef`                   | 매크로 해제 |

### 예시  

#### (1) 기본적인 매크로 정의  

```c
#include <stdio.h>
#include <stdlib.h>
#define MACRO_VALUE 5 // 매크로 상수 (전역)
#define MACRO_FUNC(a, b) (MACRO_VALUE * (a) * (b)) // 매크로 함수 (전역)

int main(){
	int x = 10;
	int y = 20;
	printf("MACRO RESULT : %d\n", MACRO_FUNC(x, y));
	return EXIT_SUCCESS;
}
-------------------------------------------------------
>> MACRO RESULT : 1000
```

```c
// 원리 : 중간파일이 아래와 같이 생성됨 (파일 포함 부분은 제외하고 설명)
int main(){
	int x = 10;
	int y = 20;
	printf("MACRO RESULT : %d\n", (5 * (x) * (y)));
	return EXIT_SUCCESS;
}
```

#### (2) 매크로 재정의  

- 매크로를 다시 정의하면 덮어씌워진다.  

```c
#include <stdio.h>
#include <stdlib.h>
#define MACRO_VALUE 5 // 매크로 상수 (전역)
#define MACRO_FUNC(a, b) (MACRO_VALUE * (a) * (b)) // 매크로 함수 (전역)

int main(){
	#define MACRO_VALUE 1000 // 경고가 발생(redefine 되었다는 경고), 에러는 아님.
	int x = 10;
	int y = 20;
	printf("REDEFINE_MACRO : %d\n", MACRO_FUNC(x, y));
	return EXIT_SUCCESS;
}
-------------------------------------------------------
>> REDEFINE_MACRO : 200000
```

```c
// 원리 : 중간파일이 아래와 같이 생성됨 (파일 포함 부분은 제외하고 설명)
int main(){
	int x = 10;
	int y = 20;
	printf("MACRO RESULT : %d\n", (1000 * (x) * (y)));
	return EXIT_SUCCESS;
}
```

#### (3) 매크로는 모두 전역이다.  

- 매크로는 전역과 지역을 나누지 않는다.  
- 단순히 텍스트 치환만을 수행한다.  

```c
#include <stdio.h>
#include <stdlib.h>
#define MACRO_VALUE 5 // 매크로 상수 (전역)
#define MACRO_FUNC(a, b) (MACRO_VALUE * (a) * (b)) // 매크로 함수 (전역)

void after_re_define_in_block(){
	int x = 10;
	int y = 20;
	printf("AFTER REDEFINE : %d\n", MACRO_FUNC(x, y));
}

int main(){
	#define MACRO_VALUE 1000
	int x = 10;
	int y = 20;
	printf("REDEFINE_MACRO : %d\n", MACRO_FUNC(x, y));
	after_re_define_in_block();
	return EXIT_SUCCESS;
}
-------------------------------------------------------
>> REDEFINE_MACRO : 200000
>> AFTER REDEFINE : 200000
```

#### (5) 매크로 해제  

- 해제된 매크로 값은 더이상 사용할 수 없다.  

```c
#include <stdio.h>
#include <stdlib.h>
#define MACRO_VALUE 5 // 매크로 상수 (전역)
#define MACRO_FUNC(a, b) (MACRO_VALUE * (a) * (b)) // 매크로 함수 (전역)

int main(){
	#undef MACRO_VALUE
	int x = 10;
	int y = 20;
	printf("UNDEFINE MACRO : %d\n", MACRO_FUNC(x, y)); // -> 오류발생
	return EXIT_SUCCESS;
}
```

```bash
# 오류 내용
"식별자 "MACRO_VALUE"이(가) 정의되어 있지 않습니다."
```

#### (4) 매크로와 변수의 이름 충돌  

- 매크로로 선언된 이름은 변수로 사용할 수 없다.  

```c
#include <stdio.h>
#include <stdlib.h>
#define MACRO_VALUE 5 // 매크로 상수 (전역)
#define MACRO_FUNC(a, b) (MACRO_VALUE * (a) * (b)) // 매크로 함수 (전역)

int main(){
	int MACRO_VALUE = 5000; // --> 오류 발생 : 식별자가 필요합니다.
	return EXIT_SUCCESS;
}
```

```bash
# 오류 내용
"식별자가 필요합니다."
```

#### (5) 매크로 함수를 사용할 때 괄호의 중요성  

- 매크로 함수를 사용할 때에는 적극적으로 괄호를 써 주는 게 좋다.  

```c
void caution_at_using_macro(){
	#define MACRO_VALUE 1000
	#define MACRO_FUNC(a, b) (MACRO_VALUE * a * b)
	int x = 5;
	int y = 15;
	printf("CAUTION AT USING MACRO [WRONG]: %d\n", MACRO_FUNC(x+5, y+5));
	
	#define MACRO_FUNC(a, b) (MACRO_VALUE * (a) * (b))
	printf("CAUTION AT USING MACRO [CORRECT]: %d\n", MACRO_FUNC(x+5, y+5));
};
```

```bash
# 출력
CAUTION AT USING MACRO [WRONG]: 5080
CAUTION AT USING MACRO [CORRECT]: 200000
```

```c
// 원리 : 아래와 같이 중간파일이 만들어지
void caution_at_using_macro(){
	#define MACRO_VALUE 1000
	#define MACRO_FUNC(a, b) (MACRO_VALUE * a * b)
	int x = 5;
	int y = 15;
	printf("CAUTION AT USING MACRO [WRONG]: %d\n", (1000 * 5 + 5 * 15 + 5));
	
	#define MACRO_FUNC(a, b) (MACRO_VALUE * (a) * (b))
	printf("CAUTION AT USING MACRO [CORRECT]: %d\n", (1000 * (5 + 5) * (15 + 5)));
};
```


## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
