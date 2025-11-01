---
title: "[C언어] 변수 고려사항 3.초기화" # 제목 (필수)
excerpt: "" # 서브 타이틀이자 meta description (필수)
date: 2025-11-02 01:50:00 +0900      # 작성일 (필수)
lastmod: 2025-11-02 01:50:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-11-02 01:50:00 +0900   # 최종 수정일 (필수)
categories: clang        # 다수 카테고리에 포함 가능 (필수)
tags: c clang 언어 c언어 변수 variable 초기화 initial initialize initialization 쓰레기 값 쓰레기값 garbagevalue garbage value                    # 태그 복수개 가능 (필수)
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
<!--postNo: 20251102_011-->


## 변수의 초기화  

### 정의  

- 선언한 변수에 대해 처음으로 값을 할당하는 과정  
- 변수에 의미 있는 첫 번째 값을 부여하는 과정이다.  

```c
// 변수 선언 후 초기화
int a;
a = 10;

// 변수 선언과 동시에 초기화
int b = 20;
```

### 변수의 초기화를 하지 않으면  

- 지역변수 : `쓰레기 값`이 해당 변수의 초기 값으로 할당됨.  
- 전역변수/정적변수 : 자동으로 `0` 또는 `0.0` 또는 `널 포인터`로 초기화 된다.  

```c
int global_var;
void global_not_initialized(){
	printf("not initialized global var : %d\n", global_var);
}

void local_not_initialized() {
	int local_var;
	printf("not initialized local var : %d\n", local_var);
}

int main() {
	global_not_initialized();
	local_not_initialized();
	return EXIT_SUCCESS;
}
```

```bash
# 출력
not initialized global var : 0
not initialized local var : 2
```

### 쓰레기 값 Garbage Value  

- 지역 변수를 명시적으로 초기화하지 않았을 때 해당 변수에 할당되는 의미 없는 값.  
- 쓰레기 값의 정체는 `메모리의 잔재` 이다.  
- `메모리의 잔재` : 변수가 할당된 메모리 공간에 이전에 저장되어 있던 데이터.  

```c
void not_initialized_sum(){
	int i, sum;
	for (i=1; i<=10; i++){
		sum = sum + i;
	}
	printf("초기화 안됨 : 1부터 10까지의 합 = %d\n", sum);
}

void initialized_sum(){
	int i, sum = 0; // 초기화 (같은 자료형에 같은 값을 넣을 경우 이런 식으로도 초기화 가능)
	for (i=1; i<=10; i++){
		sum = sum + i;
	}
	printf("초기화 됨 : 1부터 10까지의 합 = %d\n", sum);
}

int main() {
	not_initialized_sum();
	initialized_sum();
	return EXIT_SUCCESS;
}
```

```bash
# 출력
초기화 안됨 : 1부터 10까지의 합 = 17047831
초기화 됨 : 1부터 10까지의 합 = 55
```


## Reference  

C 프로그래밍 (김형근, 곽덕훈, 정재화 공저)  
C 프로그래밍 강의 (방송통신대 - 이병래)  
