---
title: "[Pandas] Best Practice - 딕셔너리 캐싱 Dictionary Caching" # 제목 (필수)
excerpt: "for loop 반복량 감소를 통해 프로그램 성능 향상시키기" # 서브 타이틀이자 meta description (필수)
date: 2025-12-17 06:56:00 +0900      # 작성일 (필수)
lastmod: 2025-12-17 06:56:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-12-17 06:56:00 +0900   # 최종 수정일 (필수)
categories: Python          # 다수 카테고리에 포함 가능 (필수)
tags: typography 파이썬 pandas 판다스 성능 향상 감소 best practice for loop 반복문 딕셔너리 캐싱 dictionary caching                 # 태그 복수개 가능 (필수)
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
  nav: docs_pandas
---
<!--postNo: 20251217_002-->

## 딕셔너리 캐싱을 통한 성능 향상  

### Intro  

이전 포스팅에서는 반복문의 횟수를 줄임으로써 pandas 의 Dataframe 을 이용한 연산의 성능을 소폭 향상시켜봤다. 이번 포스팅에서는 딕셔너리 캐싱을 통해 더욱 큰 성능 향상을 노려본다.  

### 라이브러리  

```python
import pandas as pd
import random
import time
```

### 실험 데이터셋  

- df_a : user_id, some_data 두 컬럼으로 이루어져 있다.  
- df_a의 some_data 는 약 20% 가량이 NaN 값을 가진다.  
- df_b : user_id, alt_data 두 컬럼으로 이루어져 있다.  
- df_a와 df_b의 user_id 집합은 동일하다.  
- df_b 의 alt_data 에는 결측치가 없다.  

```python
qnt = 10000 # 데이터 수
df_a_origin = pd.DataFrame({
    "user_id" : [str(x) for x in range(1, qnt+1)],
    "some_data" : [random.randint(0, qnt) if random.randint(0, qnt) < qnt*4/5 else None
                   for _ in range(qnt)]
})
df_b = pd.DataFrame({
    "user_id" : [str(x) for x in range(1, qnt+1)],
    "alt_data" : [random.randint(0, qnt) for _ in range(qnt)]
})
```

### 실험의 목표  

- df_a 의 NaN 인 some_data 값을 찾아, df_b 의 동일 user_id 의 alt_data 로 대체한다.  

### 대조군  

- 작동 방식 : df_a 의 각 row 를 순회하며 NaN값 여부를 확인하고, alt_data로 대체한다.  

|순서|작동|시간복잡도|
|---|---|---|
|1|df_a의 각 row를 순회하며, some_data가 NaN인지 확인한다.|O(N_a)|
|2|NaN값인 경우, df_b에서 동일한 user_id 에 해당하는 alt_data를 찾는다.|O(N_b)|
|3|row의 some_data 를 찾은 alt_data로 대체한다.|O(1)|

> 전체 시간복잡도 : O(N_a * N_b)  
> 또한 매 반복마다 boolean mask 를 생성하므로 메모리 비용이 발생  

```python
df_a = df_a_origin.copy()
start = time.time()
for i, row in df_a.iterrows(): #-------- (1)
    if pd.isna(row["some_data"]): #----- (1)
        df_a.at[i, "some_data"] = df_b.loc[df_b["user_id"] == row["user_id"], "alt_data"].iloc[0] #----(2)(3)
print(f"time check 1 ::: {time.time() - start}")
```

```bash
time check 1 ::: 0.7818460464477539
```

### 문제 포착  

- 매 반복마다 수행되는 df_b에서 user_id 에 해당되는 row를 찾는 연산은 위 코드에서 가장 큰 시간복잡도를 일으킨다.  


### 실험군 1  

- 작동 방식 : df_b 를 dictionary로 만든 뒤, 반복문에서 이 dictionary에서 user_id 를 lookup 하도록 대체한다.  

|순서|작동|시간복잡도|
|---|---|---|
|1|df_b를 dictionary로 변환해 캐싱한다. > b_dict|O(N_b)|
|2|df_a를 순환하면서 some_data 가 NaN인지 여부를 검사한다.|O(N_a)|
|3|b_dict 에서 user_id 를 찾는다.|**O(1)**|
|4|해당 row의 some_data를 b_dict의 동일 user_id의 alt_data로 대체한다.|O(1)|

> 전체 시간복잡도 : O(N_b) + O(N_a * 1)  
> =  O(N_b + N_a)  

```python
df_a = df_a_origin.copy()
start = time.time()
b_dict = {uid : row for uid, row in df_b.set_index("user_id").iterrows()}
for i, row in df_a.iterrows():
    if (pd.isna(row["some_data"])):
        df_a.at[i, "some_data"] = b_dict[row["user_id"]]["alt_data"]
print(f"time check 2 ::: {time.time() - start}")
```

```bash
time check 2 ::: 0.21245098114013672
```

### 실험군 2  

- 작동 방식 : 이전 포스팅에서 살펴본 "반복 횟수 감소" 방법과 이번 포스팅의 "딕셔너리 캐싱"을 함께 사용한다.  

|순서|작동|시간복잡도|
|---|---|---|
|1|df_a 에서 some_data가 NaN인 인덱스들을 미리 뽑는다.|O(N_a)|
|2|df_b를 dictionary로 변환해 캐싱한다. > b_dict|O(N_b)|
|3|미리 뽑은 인덱스에 해당하는 row 들만 순환한다.|O(K), K≈0.2*N_a|
|4|b_dict 에서 user_id 를 찾는다.|**O(1)**|
|5|해당 row의 some_data를 b_dict의 동일 user_id의 alt_data로 대체한다.|O(1)|

> 전체 시간복잡도 : O(N_a) + O(N_b) + O(K * 1)  
> =  O(N_b + N_a)  

```python
df_a = df_a_origin.copy()
start = time.time()
target_idx = df_a[df_a["some_data"].isna()].index
b_dict = {uid : row for uid, row in df_b.set_index("user_id").iterrows()}
for i, row in df_a.loc[target_idx].iterrows():
    df_a.at[i, "some_data"] = b_dict[row["user_id"]]["alt_data"]
print(f"time check 3 ::: {time.time() - start}")
```

```bash
time check 3 ::: 0.11246085166931152
```

### 결과 리뷰  

- dictionary caching 을 통해 큰 폭의 성능 향상을 얻을 수 있었다.  
- 반복문 내부의 로직 성능 향상이므로, 반복 횟수가 커질수록 그 이득도 커질 것이다.  
- 반복문 감소 + dictionary caching 을 조합할 경우 추가적인 성능 향상이 가능하다.  
- 시간복잡도는 실험군2와 실험군1이 같지만, 실행속도는 실험군 2가 더 빠르다. 이에 대해서는 아래 원리에서 살펴본다.  

### 원리  

#### 캐싱  

- 접근 빈도가 높거나 계산 비용이 큰 데이터의 결과를 임시 저장소에 보관하고, 이후 동일한 요청이 들어왔을 때 다시 계산하거나 조회하지 않고, 임시 저장한 값을 즉시 반환하는 성능 최적화 기법  
- 응답 속도를 개선하고, 시스템의 IO / 연산 / 네트워크 부하를 줄이는 게 핵심 목표이다.  
- 캐싱은 무조건 "메모리"에 올리는 게 아니며, 보조기억장치에 저장할 수도 있다. 다만, 현실적으로 가장 빠른 캐시는 메모리 캐시이기 때문에 "캐시 == 메모리 캐시"로 말하는 경우가 많다.  

#### 딕셔너리 해시  

- Dictionary / Hash Table  
- 딕셔너리 해시는 key-value 쌍으로 데이터를 저장하며, 평균적으로 O(1)의 시간복잡도로 값을 조회(lookup)할 수 있는 자료구조이다.  
- 내부적으로는 해시 함수(hash function)을 사용해 key를 정수값(=해시값)으로 변환하고, 이 해시값을 인덱스 삼아 배열 내의 저장 위치에 직접 접근한다.  
- 때문에 딕셔너리는 캐시 구현 시 가장 많이 사용되는 자료 구조이다.  

```python
print(hash("some_data"))
print(hash("alt_data"))
# >> -2155841253351233556
# >> 701232581478664499
```

- 해시 함수는 다음 성질을 가진 함수이다.  
  - 입력: 문자열, 숫자, 객체 등 임의의 데이터  
  - 출력: 정해진 범위의 정수값(해시값)  

- 해시 함수가 없으면, 딕셔너리(맵)에서 값을 찾기 위해 처음부터 끝까지 비교해야 한다.  
  - 배열 검색: O(n)  
  - 리스트 검색: O(n)  

- 하지만 해시를 쓰면:  
  - key → 해시 함수 → 숫자  
  - 숫자 → 배열 인덱스 → 즉시 접근  
  - → 평균 시간복잡도 O(1)  

#### 실험군2가 더 빠른 이유  

- 시간복잡도는 실험군2와 실험군1가 같지만, 실행속도는 실험군 2가 더 빠르다.  
- 이는 시간복잡도(Big-O)가 아니라 실제 실행 비용(constant factor)과 반복 횟수 차이 때문이다.  
- 즉, Big-O 계산법에서는 다루지 않는 실행 비용 때문인 것이다.  
- 실험군1, 2에서는 df_a에 대해 아래와 같이 숨겨진 연산이 존재한다.  

> • iterrows() → 매 row마다 pandas Series 생성 (비쌈)  
> • 모든 row에서 isna 검사 수행  
> • NaN이 아닌 row에서도 if 판단 수행  

- 실험군 2는, 감소된 반복횟수(K≈0.2*N_a)만큼만 순회하기 때문에, 위 연산들이 더 적게 수행된다.  
- 따라서 실제 작업량이 줄어들며, 실행속도가 개선되는 것잉다.  

**시간복잡도는 "상한선"만 알려준다는 것을 명심하자**  

### Outro  

다음에는 가장 효율적인 방식으로, 해시 기반 join 을 이용해 반복문을 아예 제거하는 방법을 살펴본다.

