---
title: "[Streamlit] 파이썬 앱을 가장 쉽게 배포하는 방법 - Streamlit Community Cloud" # 제목 (필수)
excerpt: "GitHub과 연동하여 10분 안에 파이썬 웹앱을 배포하기" # 서브 타이틀이자 meta description (필수)
date: 2026-05-25 02:38:00 +0900      # 작성일 (필수)
lastmod: 2026-05-25 02:38:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-05-25 02:38:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 streamlit 스트림릿 웹앱 만들기 앱 app webapp community cloud 커뮤니티 클라우드 배포 deploy                   # 태그 복수개 가능 (필수)
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
  nav: docs_python
pinned: 
series: streamlit-cloud-deploy
series_index: 3
---
<!--postNo: 20260525_001-->

## Streamlit Community Cloud로 웹앱 배포하기

### 1. 무료 배포와 Pro 배포

streamlit 홈페이지 메인에서 무료 배포와 Pro 배포 차이에 대해 확인할 수 있다.  

![](/assets/images/20260525_001_001.jpg)  

**무료 배포(Free)**는 커뮤니티, 개인이 사용하는 목적으로 사용할 수 있으며, “반드시 공개되어야”한다. GitHub과 연동하여, 리포지토리에 올라온 코드를 기반으로 배포함 앱을 빌드하여 배포가 수행된다. 기본적인 secret 관리도 가능하며, 외부 DB나 API 연결 등 제약이 없다.  

**Pro**에서는 Snowflake 안에서 Streamlit을 실행하는 구조로, Snowflake에 적재된 데이터와 앱 코드를 외부로 옮기지 않고 처리할 수 있어 기업에서는 이쪽을 선호할 것으로 보인다.   

쉽게 말해서, **개인이 사용하기엔 free로도 충분**하다.  

### 2. GitHub 연동 및 로그인

먼저 Streamlit 배포를 위해 로그인을 해보자. Streamlit 홈페이지 우측 상단의 `Deployng? Try Free` 부분 호버링을 통해 로그인페이지로 접근할 수 있다.  

![](/assets/images/20260525_001_002.jpg)  

GitHub 계정으로 로그인 후 Streamlit에 대한 권한 승인을 수행한다.  

![](/assets/images/20260525_001_003.jpg)  

로그인을 하고 보면 App Limit에 대해 확인해볼 수 있다. 앱당 리소스는 2.7GBs, 개인 앱은 1개, 공개 앱 개수는 무제한이다.    

![](/assets/images/20260525_001_004.jpg)  

### 3. Create app 메뉴

앱을 어떻게 만드는지 살펴보기 위해 로그인 후 우측 상단에 있는 `Create app` 버튼을 눌러보자.

![](/assets/images/20260525_001_005.jpg)  

가운데 있는 Deploy a public app from a template 을 눌러 들어가보면  

![](/assets/images/20260525_001_006.jpg)  

여러 기본 템플릿을 제공하고 있는 것을 볼 수 있다. 이 템플릿을 베이스로 하여 여러 나만의 앱들을 만들어볼 수 있을 것이다.  

![](/assets/images/20260525_001_007.jpg)  

이번에는 Deploy a public app from GitHub를 들어가보자  

![](/assets/images/20260525_001_008.jpg)  

화면에는 배포와 관련하여 선택해야 하는 사항들이 나열되어있다.  

![](/assets/images/20260525_001_009.jpg)  

- (1) 배포할 웹앱의 소스코드가 저장되어있는 Repository를 지정하고
- (2) 배포할 Branch를 지정하고
- (3) 프로그램의 실행 진입점이 되는 py파일을 지정하고
- (4) 배포할 URL을 지정하면 앱 배포가 되는 것으로 보인다.

이제 대강 어떻게 해야하는지 알겠으니 배포할 앱을 만들러 가보자.  

### 4. GitHub Repository 준비

Streamlit 앱을 배포하기 위한 리포지토리를 만들어준다.  

![](/assets/images/20260525_001_010.jpg)  

해당 리포지토리의 구조를 다음과 같이 만들어준다. **진입점 py파일**과 **의존성 목록** 파일은 필수이다.  

```bash
.
├── README.md
├── pyproject.toml
├── streamlit_app.py # 프로그램 실행 진입점이자 스트림릿 코드
└── uv.lock          # 의존성 라이브러리 목록
```

의존성 목록은 공식적으로 `requirements.txt` 를 권장하고 있다. 다만 여러 가지 package manager에 대응해 대체(alternative) 의존성 목록 파일도 인식한다.  

<i>(이 포스팅은 `uv` 패키지 매니저를 기준으로 구성하였다.)</i>  

| Recognized Filename | Python Package Manager | 설명 |
| --- | --- | --- |
| `requirements.txt` | pip | Streamlit이 가장 추천하는 방식 |
| `uv.lock`  | uv |  |
| `environment.yml`  | conda |  |
| `pyproject.toml` | poetry | Poetry 프로젝트로 처리됨 |
| `Pipfile` | pipenv | 버전 고정에 유리 |
| 두 가지 이상을 혼합 사용 |  | 우선순위에 따라 하나만 사용됨 |

해당 리포지토리에 올릴 **스트림릿 코드**를 작성한다. 아래는 유저 목록을 표 형태로 조회하고 수정하는  단순한 형태의 웹앱이다.  

```python
# streamlit_app.py
import streamlit as st
import pandas as pd

st.title("Streamlit App Deploy Test")
st.write("유저 목록을 조회, 수정하는 웹앱")

# 01. 유저 목록 조회 함수
def get_user_list() -> list[dict]:
    return None

# 02. 유저 목록 조회
user_data = get_user_list()
if user_data is None:
    user_data = [
        {
            "id": 1,
            "name": "김철수",
            "email": "cskim@example.com"
        },
        {
            "id": 2,
            "name": "남궁철수",
            "email": "ngcs@example.com"
        }
    ]

# 03. 세션에 유저 목록 초기화  
st.session_state.user_data = user_data

# 04. 데이터프레임 표출
if st.toggle("편집 모드"):
    edit_data = st.data_editor(pd.DataFrame(st.session_state.user_data),
                               use_container_width=True)
else:
    st.dataframe(pd.DataFrame(st.session_state.user_data),
                 use_container_width=True)

```

이번 포스팅은 uv를 패키지 매니저로 사용했다. 따라서 의존성 목록이 자동으로 `uv.lock` 및 `pyproject.toml` 에 기록, 관리된다. `pyproject.toml` 의 내용은 다음과 같다. (적용 우선선위는 uv.lock가 높음)  

```toml
[project]
...
requires-python = ">=3.13"
dependencies = [
    "streamlit>=1.57.0",
]

```

`deploy` 라는 이름의 배포용 브랜치를 만들고 커밋과 푸시를 수행한다.  

```bash
git switch -c deploy
git add .
git commit -m "[feat] streamlit deploy test"

git push origin deploy
```

GitHub에 들어가보면 잘 푸시가 된 것을 볼 수 있다.  

![](/assets/images/20260525_001_011.jpg)  

### 5. 앱 배포

다시 Streamlit 사이트로 들어와, `Create app` 메뉴로 진입하고, `Deploy a public app from GitHub` 을 통해 앱 배포 화면으로 들어간다. 그리고 앞서 만든 GitHub Repository를 기반으로 배포 내용을 채워준다.  

![](/assets/images/20260525_001_012.jpg)  

- (1) Repository : 배포할 프로그램 소스코드가 있는 리포지토리
- (2) Branch : 배포할 소스코드 커밋에 해당하는 브랜치
- (3) Main file path : 프로그램 진입점
- (4) App URL : 배포할 앱 URL

위 4가지를 모두 작성하였다면 `Deploy` 를 눌러 배포한다.  

### 6. 웹앱 확인

Deploy가 에러 없이 완료되었다면, 자동적으로 배포된 URL로 이동된다.  

![](/assets/images/20260525_001_013.jpg)  

모바일에서도 사용 가능하며, 아이폰이라면 `공유 → 홈 화면에 추가` 를 통해 일반 앱처럼 사용할 수도 있다.  

![](/assets/images/20260525_001_014.jpg)  

### 7. 앱 수정

앱 수정도 매우 쉽다. **수정된 소스코드를 GitHub에 그냥 Push하기만 하면** 된다.  
예로, 위 앱에 “누르면 풍선이 나오는 버튼”을 추가해보도록 하겠다.  

```python
# streamlit_app.py
import streamlit as st
import pandas as pd

st.title("Streamlit App Deploy Test")
st.write("유저 목록을 조회, 수정하는 웹앱")

# 01. 유저 목록 조회 함수
def get_user_list() -> list[dict]:
    return None

# 02. 유저 목록 조회
user_data = get_user_list()
if user_data is None:
    user_data = [
        {
            "id": 1,
            "name": "김철수",
            "email": "cskim@example.com"
        },
        {
            "id": 2,
            "name": "남궁철수",
            "email": "ngcs@example.com"
        }
    ]

# 03. 세션에 유저 목록 초기화  
st.session_state.user_data = user_data

# 04. 데이터프레임 표출
if st.toggle("편집 모드"):
    edit_data = st.data_editor(pd.DataFrame(st.session_state.user_data),
                               use_container_width=True)
else:
    st.dataframe(pd.DataFrame(st.session_state.user_data),
                 use_container_width=True)

# 05. 누르면 풍선이 나오는 버튼 추가
st.button(label="풍선", on_click=st.balloons, type="primary")
```

GitHub에 Push 한다.  

```bash
git add .
git commit -m "[feat] 누르면 풍선이 나오는 버튼 추가"
git push origin deploy
```

배포 URL로 접속해보면 별도로 재배포 등을 하지 않았는데도 변경사항이 적용된 것을 볼 수 있다.  

![](/assets/images/20260525_001_015.jpg)  

## Advanced

다시 Streamlit의 배포 화면으로 돌아가보자. Deploy 버튼 바로 위에 `Advanced Settings` 를 볼 수 있다.  

![](/assets/images/20260525_001_016.jpg)  

여기서는 다음과 같은 추가 기능을 이용할 수 있다.  

| 기능 | 설명 |
| --- | --- |
| Python version | 파이썬 버전 지정 |
| Secrets | 여러가지 설정값, 특히 외부로 노출되면 안되는 액세스 토큰 정보 등을 toml 형식에 맞춰 넣어놓을 수 있다. 여기에 입력된 정보는 streamlit에서 가져와 사용이 가능하다. |

![](/assets/images/20260525_001_017.jpg)  

이 부분은 다음 포스팅인 “스트림릿 앱과 Supabase 연결하기”에서 사용할 기능이니, 꼭 기억하도록 하자.  

## Reference

[Streamlit • A faster way to build and share data apps](https://streamlit.io/)
