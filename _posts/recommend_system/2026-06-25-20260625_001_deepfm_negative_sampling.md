---
title: "[DeepFM] DeepFM 성능 향상을 위한 Negative Sampling" # 제목 (필수)
excerpt: "암묵적 피드백을 이용하는 추천에서 Negative Sample을 만들기" # 서브 타이틀이자 meta description (필수)
date: 2026-06-25 00:01:00 +0900      # 작성일 (필수)
lastmod: 2026-06-25 00:01:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-06-25 00:01:00 +0900   # 최종 수정일 (필수)
categories: recommend_system         # 다수 카테고리에 포함 가능 (필수)
tags: machine learning deep deepfm deep fm lightfm factorization ctr 클릭률 추천 모델 딥러닝 머신러닝 negative sampling sample 네거티브 샘플링                    # 태그 복수개 가능 (필수)
classes: wide         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
  nav: 
pinned: 
series: deepfm
series_index: 3
---
<!--postNo: 20260625_001-->

#### 3줄 요약  

```plaintext
1. 선호(Positive) 데이터만 학습하면 모델은 "다 좋아요!"라고 말하기 쉽다.  
2. 그래서 비교용으로 “아마 덜 좋아했을” 가짜 비선호(Negative) 샘플을 만들어 살짝 섞어 준다.  
3. 이렇게 모델에게 “좋은 것과 덜 좋은 것”을 구분하게 만드는 게 Negative Sampling이다.  
```

## Negative Sampling 기법

### 1. Intro

앞선 포스팅에서는 DeepFM의 설치 방법과 기본적인 사용 방법에 대해 살펴보았다. 이를 이용해서 추천 시스템을 만들 때 마주하게 되는 몇 가지 중요한 이슈를 다뤄보려고 한다.   

DeepFM이 다루는 데이터는 근본적으로 `User`, `Item`, 그리고 이들 간의 `Interaction`이다. User와 Item의 feature, 그리고 사용자의 클릭, 관심 등록, 구매, 지원, 조회 같은 상호작용 이력을 바탕으로 특정 user가 특정 item을 선호할 가능성을 예측하는 것이 목적이다.  

하지만 현실 세계의 데이터를 마주하면 곧바로 한 가지 문제가 발생한다. 바로 모든 user와 모든 item이 각각 상호작용하지 않는다는 점이다. **세상에는 수많은 user와 item이 있고, 실제로 관측되는 상호작용은 그중 극히 일부에 불과**하다.  

예를 들어 어떤 사용자가 특정 아이템을 관심 등록했다고 하자. 이 경우 우리는 해당 user-item pair를 positive sample로 볼 수 있다. 그런데 이 사용자가 **관측하지 않은, 또는 상호작용하지 않은 수많은 다른 아이템들은 어떻게 해석해야** 할까?

이 item들을 모두 싫어했다고 볼 수는 없다. 사용자가 보지 못했을 수도 있고, 노출되지 않았을 수도 있으며, 아직 행동으로 이어지지 않았을 수도 있다. 즉, implicit feedback(암묵적 피드백) 기반 추천 시스템에서는 “관측되지 않음”이 곧 “싫어함”을 의미하지 않는다.  

그럼에도 불구하고 DeepFM을 binary classification 방식으로 학습하려면 positive와 비교할 negative sample이 필요하다. Positive sample만으로 학습하면 모델은 모든 user-item pair에 대해 높은 점수를 주는 방향으로 학습될 수 있기 때문이다.  

이 문제를 해결하기 위해 사용하는 기법이 바로 **Negative Sampling**이다.

### 2. 왜 Negative Sampling이 필요한가?

좀 더 모델, 기술적으로 살펴보자. DeepFM을 `task="binary"` 로 학습할 때, 모델은 기본적으로 입력된 User와 Item 쌍이 Positive인지 Negative인지 구분하는 `binary classification` 문제를 학습한다.  

추천에서는 보통 사용자가 관심을 등록했거나, 클릭했거나, 구매한 것과 같이 명시적/암묵적 행동을 한 데이터만 존재하는 경우가 많다. 즉, 관측된 interaction은 대부분 Positive인 경우가 많다.  

예를 들어 다음과 같은 데이터만 있다면:  

```plaintext
USER_ID | ITEM_ID | TARGET
U1      | A       | 1
U1      | B       | 1
U2      | C       | 1
```

모델은 “어떤 User-Item 쌍이 선호되지 않는지”를 배울 수 없다. 이 상태로 학습되면 **모델은 모든 User-Item 쌍에 높은 점수를 주는 방향으로 학습될 가능성**이 크다.  

따라서 binary DeepFM에서는 positive pair 뿐만 아니라, 사용자가 관측하지 않은 Item 중 일부를 Negative Sample로 만들어 학습에 포함하여, 사용자가 선호할 아이템을 분별하는 데 더 좋은 성능을 발휘하게 할 수 있다.  

### 3. Negative Sample의 의미

Negative Sample은 “사용자가 진짜 싫어한 아이템”을 뜻하는 게 아니다.  

추천 시스템의 implicit feedback(암묵적 피드백) 환경에서 사용자가 어떤 Item을 클릭하지 않았다고 해서, 이를 반드시 “싫어함”의 의미로 볼 수는 없다. 단지 다음과 같이 해석할 수 있다.  

```plaintext
관측된 positive item보다 선호도가 낮을 가능성이 있는 item
```

즉, Negative Sample은 명시적 Negative Label이라기보다, **모델이 Positive와 Non-Positive를 구분하도록 돕는 비교 기준**인 것이다. 따라서 Negative Sample에는 보통 Positive보다 낮은 Sample Weight를 부여하여 그 믿음의 강도를 약하게 준다.  

예시:  

```python
POSITIVE_TARGET_VALUE  = 1.0  # 조회, 관심, 클릭 등은 Positive로 봄
POSITIVE_SAMPLE_WEIGHT = 1.0  # 강하게 반영함

NEGATIVE_TARGET_VALUE  = 0.0  # → positive 방향은 아님
NEGATIVE_SAMPLE_WEIGHT = 0.1  # → 단, 강한 negative로 믿지는 않음
```

### 4. Positive-only 학습의 문제

그러면 Negative Sample 없이 Positive-only로 학습을 수행하면 어떻게 될까? 이 때에는 DeepFM 모델이 다음과 같은 방향으로 수렴할 가능성이 크다.  

```plaintext
모든 user-item pair의 예측 점수 → 1.0 (Positive) 근처
```

이 경우, 학습의 loss는 낮을 수 있다. 학습 데이터에 positive sample만 존재하고, 모델이 모든 예측값을 높게 주면 대부분의 학습 sample에 대해 정답을 맞히는 것처럼 보이기 때문이다.  

또한 추천 시스템 관점에서는 큰 문제인데, **모든 Item에 대한 점수가 높게 나오면 Item 간 순위를 제대로 정할 수 없기 때문**이다. 즉, binary classification 관점의 loss는 낮아 보일 수 있지만, 실제 추천에서 중요한 ranking 품질은 매우 낮아질 수 있다.  

추천 시스템에서 중요한 것은 단순히 “선호한다/선호하지 않는다”를 맞추는 게 아니라, 수많은 후보 Item 중에서 어떤 Item을 더 위에 올릴 것인가이다. 따라서 모델이 Positive와 비교할 Negative를 함께 학습하고, 이를 통해 Item간 점수가 **분별력** 있게 나오도록 해야한다.  

정리하자면 Positive-only 에서는 다음과 같은 문제가 발생한다.  

```plaintext
1. 대부분의 item score가 1.0 근처로 몰린다.
2. user별 추천 결과가 비슷해진다.
3. item 간 선호도 차이를 학습하지 못한다.
4. 학습 loss는 낮지만 Recall@K, MAP@K, MRR@K는 낮을 수 있다.
5. 모델이 “무엇을 추천하지 말아야 하는지”를 배우지 못한다.
```

따라서 DeepFM을 binary 추천 모델로 사용할 경우 negative sampling은 사실상 필수에 가깝다고 생각한다.  

### 5. Negative Sampling의 기본 방식

가장 기본적인 방식은, 각 User의 Positive Item을 제외한 나머지 Item 중 일부를 무작위로 뽑는 것이다. 예를 들어 User `U1` 이 Item `A`, `B` 를 Positive로 가지고 있고, 전체 Item이 `A, B, C, D, E` 라면 Negative 후보는 다음과 같다.  

```plaintext
positive item: A, B
candidate negative item: C, D, E
```

이 중 일부를 Negative Sample로 선택한다.  

```plaintext
U1 - C - TARGET 0
U1 - D - TARGET 0
```

이렇게 하면 모델은 다음과 같은 사실을 학습할 수 있다.  

```plaintext
U1-A, U1-B는 높은 점수
U1-C, U1-D는 상대적으로 낮은 점수
```

### 6. Negative Ratio

Negative ratio는 positive 1개당 negative를 몇 개 만들 것인지 결정하는 값이다. 예를 들어, Positive Interaction이 100만 건일 때 Negative Ratio를 2로 잡으면, 200만 건의 Negative Sample을 생성하는 것이다.  

예:  

```python
NEGATIVE_RATIO = 2  # → positive 1건당 negative 2건 생성

-------------------
positive 1건당 negative 2건 생성
positive 100만 건
negative 200만 건
총 300만 건
```

경험상으로는 일반적으로 처음에는 Negative Ratio = 2 정도로 시작해보고, 이후 실험을 통해 좋은 성능을 내는 Negative Ratio를 결정하는 것이 적당했다.  

```python
NEGATIVE_RATIO = 2  # --> base line

NEGATIVE_RATIO = 1
NEGATIVE_RATIO = 3
NEGATIVE_RATIO = 4
...
```

단, Negative를 너무 많이 넣으면 모델이 전체적으로 낮은 점수를 주는 방향으로 치우칠 수 있다. 따라서 Negative Ratio는 Recall@K, MAP@K, MRR@K 등을 기준으로 실험을 통해 비교해가며 정하는 게 좋다.  

### 7. Sampling 방법

#### (1) Random Negative Sampling

가장 단순한 샘플링 방법으로, User가 Interaction 하지 않은 Item 중, 랜덤으로 추출하는 방법이다. 이 방법은 가장 단순한 방법으로 구현은 쉽지만, 한계가 있다. 바로 **Negative 가 너무 쉬울 수 있다**는 점이다.  

예를 들어서, 고등학생에게 대학교 컨텐츠를 추천한다고 가정해보자. 2026년 기준으로 고3인 학생은, 2027학년도의 대학 정보가 궁금할 가능성이 높다.(일반적으로 생각해보면) 하지만, Random Sampling을 할 경우, Negative로 전혀 다른 년도나 혹은 2027학년도를 Negative로 뽑는 문제가 발생한다.  

이 경우 다음과 같은 현상이 생길 수 있다.  

```plaintext
train binary_crossentropy는 빠르게 낮아짐
val binary_crossentropy도 어느 정도 낮아짐
하지만 Recall@10, MAP@10, MRR@10은 낮음
```

즉, 모델이 **“쉬운 Negative”는 잘 구분하지만, 실제 추천 상황에서 중요한 피처를 고려하지 않거나, 추천 후보 아이템 후보들 사이의 순위는 잘 잡지 못하는 문제**가 발생하는 것이다.  

따라서 Negative Sampling을 할 때에는 “현실에 맞는” 샘플링을 할 필요가 있으며, 이 관점에서 Random Negative Sampling은 구조적 한계를 가지기 때문에 큰 성능 향상을 기대하기 어렵다는 한계를 가진다.  

#### (2) Hard Negative Sampling

Hard Negative Sampling은, **Positive와 비슷하지만, 실제로는 관측되지 않은 Item을 Negative로 사용하는 방식**을 가리킨다.  

앞서 예를 든 “수험생에게 대학교 추천”에서는 다음과 같은 Item이 Hard Negative를 만드는 데 기준으로 이용할 수 있다.  

```plaintext
같은 학년도
같은 지역
비슷한 대학 유형
비슷한 성적대
인기 있는 대학
```

```python
def filter_univ(data, col, value):
    return data[data[col] == value]

for user in all_user_list:
    nsc = filter_univ(data, "학년도", user.학년도) # nsc : negative_sample_candidates
    nsc = filter_univ(nsc, "지역", user.거주지)
    nsc = filter_univ(nsc, "대학유형", user.선호대학유형)
    nsc = filter_univ(nsc, "입시결과", user.성적)
```

이렇게, 사용자 입장에서 Positive의 이유로 생각될만한 Feature들을 이용해 Negative Sample을 만들면 **모델 입장에서는 구분하기 어려워진다**. 그만큼 “쉬운 판단이 아닌, 어려운 판단을 하는” 모델이 만들어질 수 있는 것이다.  

그렇다고 해서 모든 Negative Sample을 모두 Hard Sampling으로 만드는 것도 좋지 않은 것 같다. (개인 의견) User가 선호할 가능성이 높은데 단순히 지나쳤을 가능성을 낮춰잡을 수도 있기 때문이다. 따라서 좋은 Negative Sample 은 Random과 Hard를 적절하게 잘 섞는 것으로 보인다.  

```plaintext
random negative        50%
same-year negative     20%
same-region negative   20%
popular negative       10%
```

이렇게 하면 모델은 단순히 말도 안 되는 후보를 거르는 것이 아니라, 실제 후보군 안에서 선호도 차이를 학습할 수 있을 것이다.  

#### (3) rule-base 조건이 있는 경우

샘플링을 할 때 고려하면 좋은 것이 또 있다. 바로 rule-base 즉, **어떠한 규칙이나 당연한 순리에 따라 User가 선호할 가능성만 있는 후보군에서 샘플링하는 방법**이다.  

쉽게 예를 들어, 2026년의 고3 수험생은 2027학년도 대학 컨텐츠를 선호할 확률이 높다. 따라서, 수험생이 “자신에게 해당되지 않아서 지나친 == 과거의” 대학을 Negative로 뽑을 필요는 없는 것이다.  

```plaintext
item.YEAR > user.EXAM_YEAR
```

이러한 조건을 **반영하지 않으면, 학습 데이터에는 “실제로는 후보군에도 포함되면 안되는 Item”이 Negative Sample로 들어갈 수** 있다. 이는 모델이 **운영 상황과 다른 분포를 학습하게 하는 악영향**을 끼친다.  

따라서 Negative 후보군을 만들 때에는 반드시 다음 조건을 확인해야 한다.  

```plaintext
1. 해당 유저가 이미 positive로 가진 item은 제외
2. 추천 시점에 노출 가능한 item만 포함
```

### 8. Sample Weight와 Negative Sampling의 관계

Negative Sample에 대해서는, **모델이 “작게” 학습하도록 설정**해야 한다. 앞서 설명했 듯, 선별된 Negative Sample들이 “명시적으로 사용자가 싫어하는” 아이템이 아니기 때문이다. 이를 위해 **보통 낮은 Sample Weight를** 줘서 label 신뢰도를 약하게 반영할 수 있다.   

```python
POSITIVE_TARGET_VALUE  = 1.0  # 조회, 관심, 클릭 등은 Positive로 봄
POSITIVE_SAMPLE_WEIGHT = 1.0  # 강하게 반영함

NEGATIVE_TARGET_VALUE  = 0.0  # → positive 방향은 아님
NEGATIVE_SAMPLE_WEIGHT = 0.1  # → 단, 강한 negative로 믿지는 않음
```

종합적으로 Negative Ratio와 Negative Sample Weight는 아래와 같은 초기값으로 실험을 시작하는 게 적당해 보인다.  

```python
NEGATIVE_RATIO = 2
NEGATIVE_TARGET_VALUE  = 0.0
NEGATIVE_SAMPLE_WEIGHT = 0.1
```

### 9. Train/Test Split 과 Negative Sampling 순서

Negative Sampling을 할 때에는 시점에 주의를 해야 한다. 아래와 같이 진행하는 것이 좋다.  

```plaintext
1. positive interaction만 준비
2. positive interaction을 train/test로 split
3. train positive에만 negative sampling 적용
4. test positive는 ground truth로 보존
5. 평가 시 train에서 본 item은 추천 후보에서 제외
```

나쁜 순서는 아래와 같다.  

```plaintext
1. positive interaction 준비
2. negative sampling 추가
3. 전체 데이터를 random train/test split
```

위 나쁜 방식은 test에 sampled negative가 섞이고, 평가 ground truth 구성이 애매해질 수 있다. 또한 test positive item이 train negative로 들어가는 문제도 생길 수 있다.  

### 10. Negative Sampling이 성능에 미치는 영향

Negative Sampling은 단순히 학습 데이터 개수를 늘리는 방법이 아니다. 모델이 어떤 Item을 덜 추천해야하는지 알려주는 핵심적인 데이터 설계 방법이다. 이 과정에서는 꼭 현실에 맞는 Negative Sampling을 수행하여, 모델이 분별력 있는 추천을 수행하도록 해야한다.  

negative sampling이 너무 쉬우면:

```plaintext
loss는 낮아짐
binary_crossentropy도 낮아질 수 있음
하지만 Recall@K는 낮을 수 있음
```

negative sampling이 너무 어렵거나 잘못되면:

```plaintext
학습이 불안정해짐
positive와 negative 구분이 어려움
정답 item까지 낮게 예측할 수 있음
```

좋은 negative sampling은 다음 조건을 만족해야 한다.

```plaintext
1. positive item은 제외한다
2. test positive item은 train negative에서 제외한다
3. 추천 가능한 후보군에서만 negative를 뽑는다
4. random negative와 hard negative를 섞는다
5. negative sample에는 낮은 sample weight를 준다
6. 최종 평가는 Recall@K, MAP@K, MRR@K로 확인한다
```

## 요약

Negative Sampling은 DeepFM 추천 모델에서 positive-only 학습 문제를 해결하기 위한 데이터 구성 방법이며, 핵심은 다음과 같다.  

```plaintext
Negative sample은 진짜 negative가 아니라 weak negative이다.
Negative는 train에만 생성한다.
Random negative만으로는 부족할 수 있으므로 hard negative를 섞는다.
Negative sample에는 낮은 sample weight를 준다.
```