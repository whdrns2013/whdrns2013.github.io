---
title: "[C언어] 선행처리 1.파일 포함" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-02 02:00:00 +0900      # 작성일 (필수)
lastmod: 2025-11-02 02:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-02 02:00:00 +0900   # 최종 수정일 (필수)
categories: clang        # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 선행처리 선행처리기 preprocessing preprocess preprocessor 파일포함 파일 포함 헤더파일 헤더 소스파일 소스 include header source file                    # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20251102_013-->



## (헤더)파일 포함  

### 정의  

- 지정된 헤더 파일이나 코드 파일의 내용을 현재 소스 코드의 해당 `#include` 지시어 위치에 그대로 **복사해 붙여넣는 작업**  

### 표현  

| 표현               | 설명                                               |
| ---------------- | ------------------------------------------------ |
| `#include <파일명>` | 표준 디렉터리에서  헤더 파일을 찾아 복사해 붙여넣는다.                  |
| `#include "파일명"` | 현재 사용중인 디렉터리나 직접 지정한 경로의 소스 파일을<br>찾아 복사해 붙여넣는다. |

### 예시  

#### 헤더파일  

```c
#include <stdio.h>
#include <stdlib.h>

int main(){
	printf("printf 는 <stdio.h>의 함수입니다.\n");
}
```

```bash
# 출력
printf 는 <stdio.h>의 함수입니다.
```

#### 소스파일  

```c
// 파일명 : source_sample.c
#include <stdio.h>

char* source_sample(){
	printf("header_sample.c 파일이 실행되었습니다.\n");
	char* return_value = "header sample 함수 리턴값";
	return return_value;
}
```

```c
// 파일명 : main.c
#include <stdio.h>
#include "source_sample.c"

int main(){
	char* header_sample_result = header_sample();
	printf("header sample 함수로부터 리턴받은 값입니다. : %s\n", header_sample_result);
	return EXIT_SUCCESS;
}
```

```c
// 중간 파일 (소스코드만 예시로 붙여넣음)
#include <stdio.h>
char* source_sample(){
	printf("header_sample.c 파일이 실행되었습니다.\n");
	char* return_value = "header sample 함수 리턴값";
	return return_value;
}

int main(){
	char* header_sample_result = header_sample();
	printf("header sample 함수로부터 리턴받은 값입니다. : %s\n", header_sample_result);
	return EXIT_SUCCESS;
}
```

```bash
# 출력
header_sample.c 파일이 실행되었습니다.
header sample 함수로부터 리턴받은 값입니다. : header sample 함수 리턴값
```


## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
