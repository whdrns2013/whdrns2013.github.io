---
title: "[DeepFM] DeepFM 모델의 설치와 기본 사용 방법" # 제목 (필수)
excerpt: "DeepFM 설치와 예제 실습" # 서브 타이틀이자 meta description (필수)
date: 2026-06-24 22:30:00 +0900      # 작성일 (필수)
lastmod: 2026-06-24 22:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-06-24 22:30:00 +0900   # 최종 수정일 (필수)
categories: recommend_system         # 다수 카테고리에 포함 가능 (필수)
tags: machine learning deep deepfm deep fm lightfm factorization ctr 클릭률 추천 모델 딥러닝 머신러닝                     # 태그 복수개 가능 (필수)
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
series_index: 2
---
<!--postNo: 20260624_001-->

## 준비

### (1) 패키지 설치

DeepCTR에는 Tensorflow 가 필요하며, 별도로 설치를 해줘야 한다. Python, Numpy, CPU, GPU에 맞는 Tensorflow 버전을 설치해주자.  

```bash
# pip
pip install tensorflow-io-gcs-filesystem==0.31.0 \
            tensorflow==2.10.0 \
            deepctr==0.9.3 \
            pandas scikit-learn

# uv
uv add tensorflow-io-gcs-filesystem==0.31.0 \
       tensorflow==2.10.0 deepctr==0.9.3 \
       pandas \
       scikit-learn
```

> 참고 : python-3.10 버전 환경에서 수행함, 의존성 충돌이 있을 수 있으니 버전 및 설치 순서 준수


### (2) 필요 준비물과 패키지 매치

| 준비물 | 용도 | 패키지 |
| --- | --- | --- |
| encoder | 희소한 범주형 피처를 임베딩 |   • label encoder : sklearn.preprocessing.LabelEncoder <br>• hash encoder : sklearn.preprocessing.HashEncoder  |
| scaler | 밀집된 수치형 피처를 정규화 |   • MinMax Scaler : sklearn.preprocessing.MinMaxScaler  |
| model | DeepFM 모델 |   • deepctr.models.DeepFM |

### (3) 훈련용 데이터

이번 DeepFM 실습에 사용할 데이터는 직접 만들어보았다.  

```python
# generate data

import pandas as pd
import numpy as np

def generate_deepfm_ctr_data(n_samples=100000, seed=42):
    np.random.seed(seed)
    
    n_user = n_samples//100
    n_item = n_samples//1000

    user_data = pd.DataFrame(
        {
            "user_id": [i for i in range(n_user)],
            "gender" : np.random.choice(["M", "F"], n_user),
            "region" : np.random.choice(["서울", "경기", "경상", "전라", "충청", "강원"], size=n_user,
                                        p=[0.25, 0.25, 0.2, 0.15, 0.1, 0.05]),
            "age"    : np.random.randint(11, 50, n_user),
        }
    )
    
    item_data = pd.DataFrame(
        {
            "item_id"    : [i for i in range(n_item)],
            "category"   : np.random.choice(["fashion", "food", "electronics", "book", "sports"], n_item),
            "price"      : np.random.uniform(5, 500, n_item).round(2),
            "click_count": np.random.poisson(5, n_item)
        }
    )
    
    interaction_data = pd.DataFrame(
        {
            "user_id": np.random.randint(0, n_user, n_samples),
            "item_id": np.random.randint(0, n_item, n_samples),
            "device" : np.random.choice(["mobile", "pc", "tablet"], size=n_samples,
                                        p=[0.5, 0.4, 0.1]),
            "time"   : np.random.randint(0, 24, n_samples),
            "TARGET" : [1] * n_samples
        }
    )

    return user_data, item_data, interaction_data

```

| Feature | Group | Type | 비고 |
| --- | --- | --- | --- |
| gender | USER | 범주형 | M / F |
| region | USER | 범주형 | 서울, 경기, 경상, 전라, 충청, 강원. 지역별 데이터량 차등 |
| age | USER | 연속형 | 11세 이상 ~ 50세 미만 |
| category | ITEM | 범주형 | fasion 등 5가지 |
| price | ITEM | 연속형 | 5 ~ 500 사이 |
| click_count | ITEM | 연속형 | 평균 5회, 포아송 분포 |
| device | INTERACTION | 범주형 | 구매 방법. 차등 적용. |
| time | INTERACTION | 연속형 | 구매 시간 |

## 훈련

### (1) 프리뷰

DeepFM 모델의 전반적인 훈련과 추론 과정을 한눈에 살펴보자.  

| No | 단계 | 작업 |
| --- | --- | --- |
| 1 | 데이터 준비 | 데이터 로딩 |
| 2 | 데이터 준비 | 범주형 피처와 연속형 피처 구분 |
| 3 | 전처리 | 결측치 대치, 타입 변환, 데이터 merge 등 일반적 전처리 |
| 4 | 전처리 | 범주형 피처 → 인코딩. 범주값을 정수로 바꿈. label 또는 hashing |
| 5 | 전처리 | 수치형 피처 → 구간화 또는 정규화 |
| 6 | 피처 컬럼 생성 | 범주형 피처 → 임베딩을 통해 dense vector로 변환 |
| 7 | 피처 컬럼 생성 | 수치형 피처 → 완전연결층 입력 텐서에 그대로 이어 붙임 |
| 8 | 피처 컬럼 생성 | DNN, Linear 피처 컬럼 지정. |
| 9 | 훈련 | 훈련 준비 : train-test split, 모델 입력구조에 맞춰 변환 등 |
| 10 | 훈련 | DeepFM 모델 생성 및 컴파일 |
| 11 | 훈련 | 하이퍼 파라미터 지정 및 훈련 수행 |
| 12 | 훈련 | 테스트 데이터에 대한 추론, 성능 평가 |

> 주의 : DNN 부분과 Linear 부분은 범주형 / 수치형을 각각 담당하는 게 아니다. DNN 쪽에도 전체 피처가 들어가고, Linear 쪽에도 전체 피처가 들어간다. 중요한 것은 “피처의 종류”가 아니라 “훈련 방식”이다.

여기서 Linear는 별도 구성 요소로 제시된 층이라기보다, 구현체에서 1차 효과를 계산하기 위해 분리해 둔 입력 경로로 이해하는 편이 정확하다. 즉, 각 피처가 결과에 주는 단독 영향은 Linear 경로에서 반영되고, 피처 간 2차 상호작용은 FM component에서, 더 복잡한 고차 조합은 DNN component에서 학습된다.  

모델의 “생성”과 “컴파일” 단계의 의미에 대해 짚어보자. 모델 생성은 기계를 조립하는 행위에 비유할 수 있다. 그리고 모델 컴파일은 “이 모델을 어떤 방식으로 학습할지 설정하는 단계” 라고 볼 수 있다. 아래 코드를 살펴보자. 

```python
model = DeepFM(linear_feature_columns,dnn_feature_columns,task='binary')
model.compile("adam", "binary_crossentropy",
              metrics=['binary_crossentropy'], )
```

모델의 구조와 큰 틀은 모델 생성 부 (`DeepFM(…)`) 에서 처리가 되었으며, compile 부에서는 어떻게 가중치를 업데이트할지, 무엇을 목표로 학습할지 등을 설정한다. 주요 사항은 크게 세 가지이다.  

```python
optimizer = 어떻게 가중치를 업데이트할 것인가
loss = 무엇을 줄이는 방향으로 학습할 것인가
metrics = 학습 중 무엇을 관찰할 것인가
```

### (2) 설정값

설정값을 별도 파일에 정의해둔다.  

```python
# model_config.py
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# FEATURES / COLUMNS
SPARSE_FEATURES = ["gender", "region", "category"]
DENSE_FEATURES = ["age", "price", "click_count"]
USER_KEY_COL_NAME = "user_id"
ITEM_KEY_COL_NAME = "item_id"
TARGET_KEY_COLS = ["TARGET"]

# PREPROCESSING  
ENCODER = LabelEncoder
SCALER = MinMaxScaler
# SCALER = "HASH"

# HYPER PARAMS
BATCH_SIZE = 256
EPOCHS = 10
EMBEDDING_DIMS=4                  # 8, 16, 32, ...
OPTIMIZER = "adam"                # "rmsprop" ... See tf.keras.optimizers
LOSS = "binary_crossentropy"      # See tf.keras.losses.LOSS
METRICS = ["binary_crossentropy"] # See tf.keras.metrics

# OTHER
TEST_RATIO = 0.2
VALID_RATIO = 0.2
VERBOSE = 2

# INFERENCE
TOP_N = 10
SCORE_COL_NAME = "score"
```

### (3) 데이터 준비

훈련용 데이터 준비 코드는 앞선 1번 섹션에서 소개했다. 이렇게 생성한 데이터를 준비하고, 범주형 피처와 수치형 피처로 나누는 부분을 만들어보자. 우선 인터페이스를 아래와 같이 정의했다.  

```python
## Input  
- 데이터 원천 정보
- 로딩할 데이터 정보

## Output
- 유저, 아이템, 인터랙션 데이터
- 범주형, 수치형 컬럼 정보
```

코드로는 아래와 같이 작성한다. 간단한 처리를 이렇게 함수로 나누는 게 다소 비효율적이게 보일 수도 있지만, 추후 데이터를 교체하거나 데이터 원천이 수정되는 등의 유지보수에서 이러한 인터페이스를 세워두는 것은 큰 도움이 된다고 생각한다.  

```python
def load_data(sparse_features:list[str]=SPARSE_FEATURES,
              dense_features:list[str]=DENSE_FEATURES):
    
    # 데이터 로딩
    user_data, item_data, interaction_data = generate_deepfm_ctr_data()
    
    # 범주형 피처와 수치형 피처
    sparse_features = sparse_features
    dense_features  = dense_features
    
    return user_data, item_data, interaction_data, sparse_features, dense_features
```

### (4) 데이터 전처리

불러온 데이터를 가지고 학습 전 전처리를 수행한다. 보통 이 단계에서는 아래와 같은 작업들을 수행한다.  

```python
## 데이터 결합
- user_data, item_data를 interaction을 기준으로 결합한다.

## 결측치 제거 및 대치
- 분석 및 정의해둔 결측치 제거 및 대치 전략을 적용한다.

## 인코딩, 정규화, 범주화
- Sparse Features 에 대해서는 인코딩을  
- Dense Features 에 대해서는 정규화 또는 범주화를 수행한다.  
```

범주형 피처의 인코딩 방법과 정규화 방법에는 선택지들이 존재한다. 가장 기본적으로 레이블 인코딩 + MinMax Scaling 을 적용한 코드는 아래와 같다.    

```python
def data_preprocess(user_data, item_data, interaction_data, sparse_features, dense_features,
                    user_key_col_name:str=USER_KEY_COL_NAME, item_key_col_name:str=ITEM_KEY_COL_NAME,
                    encoder=ENCODER, scaler=SCALER):
    
    # 데이터 결합
    data = interaction_data.copy()
    data = data.merge(user_data, how="left", on=user_key_col_name)
    data = data.merge(item_data, how="left", on=item_key_col_name)
    
    # 결측치 처리 (NOTE:예시임, 추후 프로젝트에서는 알맞은 전처리 도입)
    data[sparse_features] = data[sparse_features].fillna("-1")
    data[dense_features]  = data[dense_features].fillna(0)
    
    # 전처리 : 범주형 피처 인코딩
    encoders = dict()
    for feat in sparse_features:
        lbe = encoder()
        data[feat] = lbe.fit_transform(data[feat])
        encoders[feat] = lbe
        
    # 전처리 : 수치형 피처 정규화 (유저, 아이템 각각)
    scalers = dict()
    
    dense_scaler = scaler(feature_range=(0, 1))
    user_dense_features = [col for col in user_data.columns if col in DENSE_FEATURES]
    data[user_dense_features] = dense_scaler.fit_transform(data[user_dense_features])
    scalers["user"] = dense_scaler
    
    dense_scaler = scaler(feature_range=(0, 1))
    item_dense_features = [col for col in item_data.columns if col in DENSE_FEATURES]
    data[item_dense_features] = dense_scaler.fit_transform(data[item_dense_features])
    scalers["item"] = dense_scaler
    
    return data, encoders, scalers
```

> 주의! 이 코드에서는 연습용으로 흐름을 알려주기 위해 train_test split 전에 scaling을 진행하였지만, 실무에서는 반드시 split 후 scaling을 하는 걸 권장한다. 위 코드처럼 하면 데이터 누수로 인해 모델 훈련이 낙관적으로 수행될 수 있다.  

더불어, 전처리에서 고려할 수 있는 선택지는 아래와 같다.  

#### 1) 범주형 변수 인코딩 - 레이블 인코딩과 해시 인코딩

DeepCTR에서 Sparse Features를 인코딩하는 방법은 두 가지로 제시하고 있다.  

- 첫 번째 : Label Encoding

각 범주값을 `0~(고유값 개수 - 1)` 사이의 정수로 변환하는 방식. 이번에는 이 방식을 채택한다.  

```python
from sklearn.preprocessing import LabelEncoder

for feat in sparse_features:
    lbe = LabelEncoder()
    data[feat] = lbe.fit_transform(data[feat])
```

- 두 번째 : Hash Encoding

범주값을 정해진 범위의 숫자로 매핑하는 방식. 예를 들어 `0~9999` 범위 안쪽으로 지정하여 인코딩을 수행할 수 있다. Hash Encoding은 별도 전처리를 하지 않고, 다음 섹션인 피처 컬럼 생성 과정에서 실시간으로 처리한다.(학습시 `use_hash=True` )    

```python
fixlen_feature_columns = [
    SparseFeat(
        feat,
        vocabulary_size=1000,
        embedding_dim=4,
        use_hash=True,
        dtype='string'
    )
    for feat in sparse_features
]
```

#### 2) 수치형 변수 처리 - 구간화 또는 정규화

수치형 변수는 보통 구간화해서 사용하기도 하지만, 이 예제에서는 정규화를 사용한다.  

```python
from sklearn.preprocessing import MinMaxScaler

mms = MinMaxScaler(feature_range=(0, 1))
data[dense_features] = mms.fit_transform(data[dense_features])
```

### (5) 피처 컬럼 생성

범주형 피처는 임베딩을 통해 dense vector로 변환한다. 반면, 수치형 피처는 완전연결층의 `input tensors` 에 그대로 이어붙인다. 범주형 피처는 `deepctr.feature_columns.SparseFeat` 을 이용해서, 수치형 피처는 `deepctr.feature_columns.DenseFeat` 를 이용해서 피처 컬럼을 생성한다.  

```python
from deepctr.feature_column import SparseFeat, DenseFeat, get_feature_names

def generate_feature_columns(data, sparse_features:list[str]=SPARSE_FEATURES, dense_features:list[str]=DENSE_FEATURES):
    fixlen_feature_columns = [
        SparseFeat(feat, vocabulary_size=data[feat].max() + 1, embedding_dim=4)
        for i, feat in enumerate(sparse_features)
    ] + [
        DenseFeat(feat, 1)
        for feat in dense_features
    ]

    dnn_feature_columns = fixlen_feature_columns
    linear_feature_columns = fixlen_feature_columns
    feature_names = get_feature_names(linear_feature_columns + dnn_feature_columns)
    return feature_names, linear_feature_columns, dnn_feature_columns

```

이 때, Embedding Dimension은 피처의 Unique 개수에 따라 다르게 유동적으로 설정한다. 또한 Label Encoding을 사용하는지, Hash Encoding을 사용하는지에 따라 사용법이 살짝 다른데, 자세한 사항은 아래를 참고.  

#### 1) Encoding에 따른 활용 코드

- Label Encoding을 사용한 경우

기본적인 사용방법 그대로 사용하면 된다.  

```python
fixlen_feature_columns = [
    SparseFeat(feat, vocabulary_size=data[feat].max() + 1, embedding_dim=4)
    for i, feat in enumerate(sparse_features)
] + [
    DenseFeat(feat, 1)
    for feat in dense_features
]
```

- Hash Encoding을 사용한 경우

Label Encoding과 거의 동일하고, `use_hash=True` 옵션을 추가하여 여기서 바로 인코딩이 실행되게끔 한다.  

```python
fixlen_feature_columns = [
    SparseFeat(feat, vocabulary_size=1e6,embedding_dim=4, use_hash=True, dtype='string')  # the input is string
    for feat in sparse_features
] + [
    DenseFeat(feat, 1, )
    for feat in dense_features
]
```

#### 2) Embedding Dimension

범주형 피처의 `embedding_dim`은 보통 고유값 개수(`nunique`) 기준으로 작게 잡는다.  

### (6) 모델 Train-Test 코드

일반적인 모델 훈련과 전개방식이 동일하다. 필요시 Train, Test Split을 수행하고, 모델에 맞게 데이터 구조를 변환한 뒤, 하이퍼파라미터를 설정하여 훈련을 진행한다.  

```python
from sklearn.model_selection import train_test_split
from deepctr.models import DeepFM

def train_deepfm_model(data, feature_names, linear_feature_columns, dnn_feature_columns, target_key_cols=TARGET_KEY_COLS,
                       test_ratio:float=TEST_RATIO, valid_ratio:float=VALID_RATIO, batch_size:int=BATCH_SIZE, epochs:int=EPOCHS,
                       verbose=VERBOSE, optimizer:str=OPTIMIZER, loss:str=LOSS, metrics:list[str]=METRICS):
    
    # Train Test Split
    train, test = train_test_split(data, test_size=test_ratio)

    # Train, Test 데이터
    train_model_input = {name:train[name].values for name in feature_names}
    test_model_input = {name:test[name].values for name in feature_names}

    # DeepFM 모델 생성 및 컴파일
    model = DeepFM(linear_feature_columns,dnn_feature_columns,task='binary')
    model.compile(optimizer, loss, metrics=metrics, )

    # 훈련
    history = model.fit(train_model_input, train[target_key_cols].values,
                        batch_size=batch_size, epochs=epochs, verbose=verbose, validation_split=valid_ratio, )
    
    return model, test
```

### (7) 훈련의 전체 과정

```python
user_data, item_data, interaction_data, sparse_features, dense_features = load_data(SPARSE_FEATURES, DENSE_FEATURES)
data, encoders, scalers = data_preprocess(user_data, item_data, interaction_data, SPARSE_FEATURES, DENSE_FEATURES)
feature_names, linear_feature_columns, dnn_feature_columns = generate_feature_columns(data, SPARSE_FEATURES, DENSE_FEATURES)
model, test, pred_ans = train_deepfm_model(data, feature_names, linear_feature_columns, dnn_feature_columns)
```

### (8) 아티팩트 저장

```python
# Artifact 저장

# 유저 데이터, 아이템 데이터를 저장해둬, 추론시 재활용
for feat in [col for col in user_data.columns if col in SPARSE_FEATURES]:
    user_data[feat] = encoders[feat].transform(user_data[feat])
user_dense_features = [col for col in user_data if col in DENSE_FEATURES]
user_data[user_dense_features] = scalers["user"].transform(user_data[user_dense_features])

for feat in [col for col in item_data.columns if col in SPARSE_FEATURES]:
    item_data[feat] = encoders[feat].transform(item_data[feat])
item_dense_features = [col for col in item_data if col in DENSE_FEATURES]
item_data[item_dense_features] = scalers["item"].transform(item_data[item_dense_features])

# 하이퍼파라미터
hyper_params = {
    "batch_size" : BATCH_SIZE,
    "epochs" : EPOCHS
}

artifacts = {
    "model" : model,
    "encoders" : encoders,
    "scalers" : scalers,
    "sparse_features" : SPARSE_FEATURES,
    "dense_features" : DENSE_FEATURES,
    "feature_names" : feature_names,
    "processed_user_data" : user_data,
    "processed_item_data" : item_data,
    "hyper_params" : hyper_params
}
```

### (9) 추론

```python
def predict(user_id, artifacts):
    
    # 추론에 필요한 데이터 로딩
    user_data = artifacts["processed_user_data"].copy()
    infer_item_data = artifacts["processed_item_data"].copy()
    
    # 추론용 데이터셋 생성
    infer_user_data = user_data[user_data["user_id"] == user_id]
    infer_user_data["merge_col"] = 1    
    infer_item_data["merge_col"] = 1
    infer_data = infer_user_data.merge(infer_item_data, on="merge_col")
    infer_data = infer_data.drop(columns="merge_col")
    
    # 추론용 input data
    feature_names = artifacts["feature_names"]
    model_input = {feat:infer_data[feat].values for feat in feature_names}
    
    # 추론
    scores = model.predict(model_input, batch_size=artifacts["hyper_params"]["batch_size"])
    
    # item_id와 결합 및 추천 개수 슬라이싱
    result = pd.DataFrame({ITEM_KEY_COL_NAME:infer_data[ITEM_KEY_COL_NAME], SCORE_COL_NAME:[score[0] for score in scores]})
    result = result.sort_values(by=SCORE_COL_NAME, ascending=False)
    
    return result
```

### (10) 추론 테스트

```python
# test 에 있는 랜덤 유저 기준, 아이템 추천해보기

# 테스트 유저 선정
test_user = test.sample(1).iloc[0]["user_id"]
print(f"user_id : {test_user}")

# 추론
result = predict(test_user, artifacts)

print(result)
```

```bash
# 추천 점수. 추천된 순서를 매핑하면 실제 item_id 와 매칭할 수 있다.  

array([[1.        ],
       [1.        ],
       [1.        ],
       [1.        ],
       [1.        ],
       [0.9999999 ],
       [0.99999976],
       [1.        ],
       [1.        ],
       [0.9999999 ],
       [0.99999994],
       ...
      ])
```

## Reference

[https://deepctr-doc.readthedocs.io/en/latest/Quick-Start.html#getting-started-4-steps-to-deepctr](https://deepctr-doc.readthedocs.io/en/latest/Quick-Start.html#getting-started-4-steps-to-deepctr)  
[https://www.kaggle.com/competitions/criteo-display-ad-challenge/data](https://www.kaggle.com/competitions/criteo-display-ad-challenge/data)  
