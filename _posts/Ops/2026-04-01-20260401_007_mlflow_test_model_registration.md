---
title: "[MLflow] 테스트 실험 및 아티팩트 등록해보기" # 제목 (필수)
excerpt: "Tracking Server에 실험을 등록해보자" # 서브 타이틀이자 meta description (필수)
date: 2026-04-01 02:51:00 +0900      # 작성일 (필수)
lastmod: 2026-04-01 02:51:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-04-01 02:51:00 +0900   # 최종 수정일 (필수)
categories: Ops         # 다수 카테고리에 포함 가능 (필수)
tags: AI 인공지능 머신러닝 ML machine learning mlflow 테스트 실험 등록 아티팩트 모델                    # 태그 복수개 가능 (필수)
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
  nav: docs_mlflow
pinned: 
---
<!--postNo: 20260401_007-->


## 테스트 실험(모델) 등록하기  

### 1. 테스트 실험(모델) 코드  

- 아래 코드는 더미 실험(모델)을 mlflow 에 등록하는 코드이다.  
- 추가로, 더미 artifact도 생성하여 등록하는 코드도 포함되어있다.  
- `os.environ` 부분의 mlflow tracking server URL이나 아티팩트 스토어 계정은 알맞게 수정해준다.  

```python
# mlflow_run_test.py
import mlflow
import os

# 1. 환경 변수 설정 (호스트 PC 기준 포트 사용)
# .env의 MLFLOW_PORT(5000)와 POSTGRES_PORT(5432)가 호스트에 노출되어 있어야 함
os.environ["MLFLOW_S3_ENDPOINT_URL"] = "http://localhost:9000" # RustFS 외부 포트
os.environ["AWS_ACCESS_KEY_ID"] = "mlflow"
os.environ["AWS_SECRET_ACCESS_KEY"] = "mlflow"

# 2. MLflow 서버 연결
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("artifact-test")

with mlflow.start_run():
    # 파라미터 및 메트릭 기록 (DB 테스트)
    mlflow.log_param("status", "testing")
    mlflow.log_metric("accuracy", 0.95)
    
    # 3. 아티팩트 생성 및 업로드 (S3/RustFS 테스트)
    with open("test_artifact.txt", "w") as f:
        f.write("MLflow Artifact Storage Test Success!")
    
    mlflow.log_artifact("test_artifact.txt")
    
    print("Run completed. Check MLflow UI at http://localhost:5000")
```

### 2. 테스트 코드 실행  

- python 코드를 실행시켜준다.  

```bash
python .\mlflow_run_test.py
```

```bash
# 출력
2026/03/31 13:21:47 INFO mlflow.tracking.fluent: Experiment with name 'artifact-test' does not exist. Creating a new experiment.

Run completed. Check MLflow UI at http://localhost:5000
🏃 View run selective-goat-696 at: http://localhost:5000/#/experiments/1/runs/bd628892f60a41c8a539e8731a1c4cbb
🧪 View experiment at: http://localhost:5000/#/experiments/1
```

### 3. MLflow Tracking Server 에서 확인하기  

- MLflow Tracking Server Web UI (http://localhost:5000)에서 등록된 모델을 확인한다.  
- `artifact-test` 실험이 생성된 것을 볼 수 있고, 클릭해서 드러가면 실험에 해당하는 실행(Run) 목록을 볼 수 있다.  

![](/assets/images/20260401_007_001.png)
![](/assets/images/20260401_007_002.png)

### 4. Artifact Store 에서 확인하기  

- Artifact Store Web UI (http://localhost:9001)에서 아티팩트가 잘 등록, 저장되었는지 확인한다.  
- `mlflow` 버킷에 `1`및 RUN ID에 해당하는 프리픽스가 생성되었으며, 그 하위에 아티팩트가 등록된 걸 볼 수 있다.  

![](/assets/images/20260401_007_003.png)  
<br>
![](/assets/images/20260401_007_004.png)  
<br>
![](/assets/images/20260401_007_005.png)  
<br>
![](/assets/images/20260401_007_006.png)

- 아티팩트를 클릭하고 미리보기를 누르면, 아티팩트의 내용을 볼 수 있다.  
- 잘 등록된 것을 확인한다.  

![](/assets/images/20260401_007_007.png)  
<br>
![](/assets/images/20260401_007_008.png)


