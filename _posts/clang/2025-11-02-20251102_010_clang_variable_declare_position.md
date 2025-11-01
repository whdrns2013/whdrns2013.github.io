---
title: "[C언어] 변수 고려사항 2.선언 위치" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-02 01:45:00 +0900      # 작성일 (필수)
lastmod: 2025-11-02 01:45:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-02 01:45:00 +0900   # 최종 수정일 (필수)
categories: clang        # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 변수 variable 지역변수 지역 local 전역변수 전역 global                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251102_010-->


## 변수의 선언 위치  

### 정의  

- 전역변수 : 함수 밖, 보통 소스 파일의 최상단에 선언되는 변수. 프로그램 종료시까지 유지된다.  
- 지역변수 : 특정 블록(주로 함수)에 선언되는 변수로, 해당 블록이 실행되는 동안에만 메모리에 할당된다.  

| 구분             | 전역변수                                    | 지역변수                                              |
| -------------- | --------------------------------------- | ------------------------------------------------- |
| 선언 위치          | 모든 함수 밖.                                | 특정 블록(주로 함수) 내부                                   |
| 스코프<br>(접근 범위) | 프로그램 전체 영역.<br>다른 파일이나 함수 안에서도 접근 가능.   | 변수가 선언된 블록 내부에서만 접근 가능.<br>블록을 벗어나면 해당 변수에 접근 불가. |
| 생존 기간          | 프로그램이 시작될 때 할당되어<br>프로그램이 종료될 때까지 유지된다. | 변수가 선언된 블록이 실행되는 동안                               |
| 초기화            | 명시적으로 초기화하지 않으면 **자동으로 0**              | 명시적으로 초기화하지 않으면 **쓰레기값**                          |
| 사용             | 프로그램 전체에서 공유되는 값                        | 특정 블록에서만 필요한 데이터<br>코드 독립성 높임                     |

### 선언 위치에 따른 예시  

```c
int a = 1; // 전역변수

void local_function(){
	int a = 3; // 지역변수
	printf("local function 에서의 지역변수 a : %d\n", a);
};

int main() {
	printf("전역변수 a : %d\n", a);
	
	local_function();
	
	int a = 2;
	printf("main 에서의 지역변수 a : %d\n", a);
	
	return EXIT_SUCCESS;
}
```

```bash
전역변수 a : 1
local function 에서의 지역변수 a : 3
main 에서의 지역변수 a : 2
```

## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
