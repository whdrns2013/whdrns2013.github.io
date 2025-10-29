---
title:  Pydantic BaseSettings 를 이용해 파이썬 설정값 똑똑하게 관리하기 # 제목 (필수)
excerpt: 요새는 ConfigParser 말고 이걸 많이 쓴다고 하네 # 서브 타이틀이자 meta description (필수)
date: 2025-10-29 17:00:00 +0900      # 작성일 (필수)
lastmod: 2025-10-29 17:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-10-29 17:00:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 pydantic 설정값 설정 config setting basesetting                      # 태그 복수개 가능 (필수)
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
---
<!--postNo: 20251029_001-->

## Intro  

그동안 파이썬에서 설정값을 관리할 때에는 configparser + config.ini 파일 조합을 많이 했고, 보안이 중요한 정보는 env 파일에서 불러오도록 dotenv 를 활용했다.  
그런데 요즘에는 pydantic 의 base settings 를 사용한다고 한다. 이게 과연 무엇인지, 어떻게 사용하는지 알아보자.  

> 설명을 보조하기 위해 github에 코드를 올려놨다.  
> <붙이기!>


## BaseSettings  

### 정체가 뭘까  

pydantidc-settings 라이브러리에 포함된 모듈이다.  
환경변수나 secret 파일들을 읽어와서 이를 애플리케이션에서 설정값으로 사용할 수 있게 해준다.
pydantic 은 ~~

### 주요 기능과 사용 이유  

pydantic_settings 모듈의 main.py 파일을 살펴보면 `BaseSettings` 클래스에 대한 정의와 설명이 기재되어있다.  
요약하면 다음과 같다.  

- BaseSettings 클래스는 애플리케이션의의 설정(settings)을 관리하기 위한 클래스이다.  
- 환경 변수나 `.env` 파일 또는 `secret 파일`에서 값을 불러와 사용할 수 있다.  

|구분|주요 기능과 사용 이유|
|---|---|
|보안|코드에 민감한 정보(API키, 비밀번호)를 직접 저장하지 않고, 환경 변수나 별도의 secrets 파일에서 불러올 수 있다.|
|유연성|Docker, Heroku 등과 같이 12팩터 앱 디자인 원칙을 따르는 현대적인 애플리케이션 배포 환경과 매우 잘 맞다. 개발, 테스트, 프로덕션 환경마다 다른 설정 값을 쉽게 주입할 수 있다.|
|편의성|- `.env`파일 지원<br>- 타입 자동 파싱(parsing; 변환)<br>- 중첩된 설정(계층화된 설정) 지원 등|


## 기본적인 사용법  

### 설치  

pydantic-settings 라이브러리와 pydantic 라이브러리를 설치해주면 된다.  

```bash
# pip
pip install pydantic-settings pydantic
# uv
uv add pydantic-settings pydantic
# conda
conda install -c conda-forge pydantic-settings pydantic
```

### 클래스 설명 doc 살펴보기  

클래스의 설명 docstring 을 우선 살펴보자. 읽기 쉽게 번역을 추가해놓았다.  

```python
# site-packages/pydantic_settings/main.py
class BaseSettings(BaseModel):
    """
    Base class for settings, allowing values to be overridden by environment variables.
    설정을 위한 기본 클래스로, 환경변수들을 가져와 기존에 정의되어 있는 값들을 덮어쓸 수 한다.
    ...
    All the below attributes can be set via `model_config`.
    'model_config' 를 통해 아래의 모든 속성값을 설정할 수 있다.
    
    Args:
        _case_sensitive: Whether environment and CLI variable names should be read with case-sensitivity.
        ...
    """
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        extra='forbid',
        arbitrary_types_allowed=True,
        ...)
        ... 이하 생략
```

클래스 설명을 살펴보니, 일단 이 클래스는 환경변수를 읽어와 이미 정의된 애플리케이션의 설정값을 덮어쓰는(바꾸는) 역할을 해주는 클래스로 보인다.  
더불어, BaseSettings 클래스를 상속받아 사용할 때, model_config 속성을 다시 정의함으로써 (아마 작동 방식에 영향을 끼칠) BaseSettings 클래스의 속성값을 조정할 수 있을 것으로 보인다.  

### 사용해보기  

- 기본적인 선언 방법은 아래와 같다.  
- BaseSettings 클래스를 상속받은 세팅 클래스(예시에서는 AppSettings)를 선언한 뒤, 이를 이용한 객체를 만들고, 그 객체의 속성값을 사용한다는 개념이다.  

```python
# 01_BaseSettings_declare.py
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppSettings(BaseSettings):
    config_1:int = 1
    service_port:int = 8080
    model_config = SettingsConfigDict()

settings = AppSettings()

print(settings.service_port)
```

```bash
uv run study/01_BaseSettings_declare.py
>> 8080
```


## OS에 설정된 환경변수 불러오기  

### BaseSettings 를 이용해 OS/User 환경변수 불러오기  

위의 예시만 보면 그냥 세팅 클래스를 선언하고, 객체를 생성하여 그 객체 안의 속성값을 가져다가 쓰는 것에 불과하다.  
그런데 BaseSettings 클래스는 자동적으로 OS나 User의 환경변수를 불러오는 기능을 가지고 있다.  

윈도우나 맥, 리눅스 모두에서 가지고 있는 Path 라는 환경변수를 BaseSettings 클래스를 통해 블러와보도록 하겠다.  
(Path 환경변수는 실행 가능한 프로그램을 찾기 위해 운영 체제가 탐색하는 디렉터리 목록이다.)  

```python
# 02_from_os_env.py
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppSettings(BaseSettings):
    Path:str
    model_config = SettingsConfigDict()

settings = AppSettings()

print(settings.Path)
```

위와 같이 작성한 코드를 실행시켜주면, OS 혹은 User 레벨에서 정의된 Path 환경변수가 출력된다.  

```bash
uv run stduy/02_from_os_env.py
/Users/user/Desktop/... (이하 생략)
```

여기서 눈여겨 볼 것은, AppSettings 에서 Path 에 대한 기본값을 따로 정해주지 않았는데도 OS/User 레벨에서 정의된 환경변수 값을 불러왔다는 점이다.  
이처럼 BaseSettings 는 미리 정의된 환경변수를 불러와서 사용할 수 있다.  

### 환경변수를 직접 선언하여 사용하기  

그렇다면, 직접 환경변수를 선언한 뒤, 이를 BaseSettings 로 불러와 사용할 수도 있을 것이다.  
혹은, BaseSettings의 프로세스와 다른 프로세스에서 설정된 환경변수 또한 적용하여 사용할 수 있을 것이다.  

```python
# 03_export_custom_env.py
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class AppSettings(BaseSettings):
    TEST_ENV_VARIABLE:str       # 하단 os.environ 으로 추가하는 환경변수
    EXPORT_FROM_TERMINAL:str    # 터미널에서 직접 추가하는 환경변수
    model_config = SettingsConfigDict()

os.environ['TEST_ENV_VARIABLE'] = "base_setting_custom_env_test" # export custom env
settings = AppSettings()

print(settings.TEST_ENV_VARIABLE)
print(settings.EXPORT_FROM_TERMINAL)
```

```bash
# 터미널에서 사용
export EXPORT_FROM_TERMINAL=custom_env_from_terminal

# 코드파일 실행
uv run study/03_export_custom_env.py
>> base_setting_custom_env_test
>> custom_env_from_terminal
```


## .env 파일에서 값 불러오기  

### .env 파일  

`.env` 파일은 환경 변수를 저장하는 데 사용되는 간단한 텍스트 파일이다. `키=값` 쌍들로 파일이 구성되며 Docker, 코드파일 등이 이 환경 변수 파일에서 설정값을 읽어와 사용하곤 한다.  
`.env` 파일은 정보들을 코드로부터 분리하여 노출되면 안되는 민감한 정보를 안전하게 보관하면서도, 유연하게 코드에서 값이 사용될 수 있게 한다.  

### 디렉터리 구조  

아래와 같이 코드파일과 환경 변수 파일이 속한 디렉터리가 다른 경우를 가정한다.  
명령줄에서의 명령 실행은 프로젝트 루트 디렉터리에서 수행한다.  

```bash
/
├─ .venv 
├─ core
│   ├─ ...
│   └─ 04.env # 환경 변수 파일
└─ study
    ├─ ...
    └─ 04_from_env_file.py # 코드파일
```

### .env 파일 작성하기  

아래와 같이 예시 환경 변수 파일을 작성해본다.  

```ini
# 04.env
DEV__TIMEOUT=10
DEV__LOG_LEVEL=DEBUG

TEST__TIMEOUT=3
TEST__LOG_LEVEL=DEBUG

PROD__TIMEOUT=3
PROD__LOG_LEVEL=INFO
```

### BaseSettings 에서 사용하기  

- BaseSettings 를 상속받은 세팅 클래스를 선언할 때, 내부에 사용할 속성(env 파일과 동일한 명칭으로)을 선언해둔다.  
- SettingsConfigDict 를 통해 model_config 를 만들어줄 떄, `env_file` 파라미터에 환경변수 파일의 위치를 지정해준다.  
- 그러면 BaseSettings가 자동으로 해당 환경변수 파일을 읽어와, AppSettings 의 속성에 해당하는 값을 **덮어쓸** 것이다.  
- 이쯤에서 값을 **덮어쓴**다는 의미가 무엇인지 이해할 수 있을 것이다.  

```python
# 04_from_env_file.py
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class AppSettings(BaseSettings):
    
    DEV__TIMEOUT:int
    DEV__LOG_LEVEL:str
    
    TEST__TIMEOUT:int
    TEST__LOG_LEVEL:str
    
    PROD__TIMEOUT:int
    PROD__LOG_LEVEL:str
    
    model_config = SettingsConfigDict(
        env_file="core/04.env",
        env_file_encoding='utf-8'
    )

settings = AppSettings()

print(settings.DEV__TIMEOUT)
print(settings.TEST__LOG_LEVEL)
```

```bash
uv run study/04_from_env.py
>> 10
>> DEBUG
```


## Secret 파일 값 불러오기  

### Secret 파일  

- Secret 파일은 보안적으로 민감한 정보들(비밀번호, 키 등) 을 내용으로 담고 있는 파일을 의미한다.  
- `.env` 파일은 하나의 파일에 여러 가지 정보를 담고 있다고 한다면, `Secret` 파일은 하나의 파일에 한 가지의 민감정보만을 담고 있다.  
- Docker Swarm 이나 K8s와 같은 컨테이너 오케스트레이션 환경에서 보안을 위해 많이 사용하고 있다.  
- BaseSettings 사용시에는 Secret 파일의 이름이 KEY, 파일의 내용이 VALUE 가 되는 KEY-VALUE 쌍으로 관리가 될 것이다.  

### 디렉터리 구조  

아래와 같이 코드파일과 Secret 파일이 속한 디렉터리가 다른 경우를 가정한다.  
명령줄에서의 명령 실행은 프로젝트 루트 디렉터리에서 수행한다.  

```bash
/
├─ .venv 
├─ core
│   └─ secrets
│        ├─ dummy_secret_1
│        └─ dummy_secret_2
└─ study
    ├─ ...
    └─ 05_from_secret_file.py # 코드파일
```

### secret 파일 작성하기  

- 테스트용 secret 파일 두 개를 작성해보겠다.  

```bash
# dummy_secret_1
1_secret_hey_ho
```

```bash
# dummy_secret_2
this_is_very_important_key
```

### BaseSettings 에서 사용하기  

- model_config 를 만들 때 SettingsConfigDict 에 `secrets_dir` 파라미터를 사용한다.  
- `secrets_dir` 파라미터는, Secret 파일들이 위치한 경로를 지정해준다.  
- 이후, 세팅 클래스 안에 Secret 파일들의 이름과 동일한 속성값을 선언해둔다.(e.g. dummy_secret_1)  

```python
# 05_from_secret_file.py
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class AppSettings(BaseSettings):
    
    model_config = SettingsConfigDict(
        secrets_dir="core/secrets/"
    )
    
    dummy_secret_1: str
    dummy_secret_2: str

settings = AppSettings()

print(settings.dummy_secret_1)
print(settings.dummy_secret_2)
```

```bash
uv run study/05_from_secret_file.py
>> 1_secret_hey_ho
>> this_is_very_important_key
```



## 중첩 구조(nested) 로 관리하기  

### 중첩 구조  

- 이제 BaseSettings 의 대부분의 주요 기능에 대해 알아보았다.  
- 중첩(계층) 구조란, 상위 그룹 - 하위 항목으로 구성된 구조를 의미한다.  
- 회사의 조직도, 혹은 웹사이트 URL을 비슷한 예로 들 수 있다.  

```bash
# 회사 조직도
- 가장 위에 사장이 있고, 그 아래 부서장들이 있다.
- 각 부서장들 아래에는 부서원들이 있다.

# URL
- www.sub_domain.domain.com
- sub_domain : 하위 / domain : 상위
```

- 이처럼 설정값을 다룰 때에도 중첩 구조로 다루는 경우가 있다.  
- 개각각 다른 주제에 대한 설정값을 구분하여 명시적으로 관리하기 위해 중첩 구조를 사용한다.  

```bash
# SERVICE
SERVICE.PORT    = 8080
# LOG
LOG.LEVEL       = DEBUG
```

### BaseSettings 에서 중첩 구조 사용하기  

- BaseSettings 에서 중첩 구조를 사용하는 가장 기본적인 방법은, 세팅 클래스의 속성 값에 다른 클래스 객체를 넣어두는 것이다.  
- 이 때에는 가장 최상위의 세팅 클래스만 BaseSettings 를 상속하며, 하위 클래스들은 꼭 BaseSettings 클래스를 상속하지는 않아도 된다.  
- 동시에 model_config 에서 env_nested_delimiter를 사용하여 환경변수 항목의 이름 패턴을 기준으로 분리하도록 한다.  
- 예시를 보면서 설명하겠다.  

```ini
# 06.env
SERVICE__TIMEOUT=10
SERVICE__MULTIPROCESSOR_NUM=18

LOGGING__EXPIRE_DAY=100
LOGGING__LOG_LEVEL=INFO
```

```python
# 06_nested_structure
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class ServiceSettings(BaseSettings):
    TIMEOUT: int
    MULTIPROCESSOR_NUM: int

class LoggingSettings(BaseSettings):
    EXPIRE_DAY: int
    LOG_LEVEL: str

class AppSettings(BaseSettings):
    
    service: ServiceSettings
    logging: LoggingSettings
    
    model_config = SettingsConfigDict(
        env_file="core/06.env",
        env_file_encoding='utf-8',
        env_nested_delimiter='__' # __로 구분
    )

settings = AppSettings()

print(settings.service.TIMEOUT)
print(settings.logging.LOG_LEVEL)
```

```bash
run study/06_nested_structure.py
>> 10
>> INFO
```

### BaseSettings 에서 중첩 구조 사용하기(여러 env 파일을 읽어야 할 경우 - 권장되지 않음)  

- 여러 환경 변수 파일을 읽어들여야 할 때도 있고, Secret 디렉터리가 여러개일 수도 있는데, 이 경우 아래와 같은 방식을 사용할 수 있을 것이다.  
- 단, 이 경우 12팩터 앱 원칙 중 "모든 설정을 환경에서 한 번에 주입한다"를 위배하므로, 환경 변수를 통합하는 것이 오히려 권장된다.  

```python
# 07_nested_structure_multi_env_file_1.py
# 첫 번째 방식 : 여러 BaseSettings 들을 가지는 상위 클래스 만들기
# 장점 : 명확함, 유연함 / 단점 : 환경 변수 파일을 여러 번 읽어들여 비효율적
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class ServiceSettings(BaseSettings):
    TIMEOUT: int
    MULTIPROCESSOR_NUM: int
    model_config = SettingsConfigDict(
        env_file="core/07.env",
        env_file_encoding='utf-8',
        env_prefix='SERVICE__', # DEV__ 로 시작하는 항목만 읽어들임
        extra='ignore'      # 그 외의 항목은 무시함 (다른 값이 있다면 필수!)
    )

class LoggingSettings(BaseSettings):
    EXPIRE_DAY: int
    LOG_LEVEL: str
    model_config = SettingsConfigDict(
        env_file="core/07.env",
        env_file_encoding='utf-8',
        env_prefix='LOGGING__', # PRDO 로 시작하는 항목만 읽어들임
        extra='ignore'       # 그 외의 항목은 무시함 (다른 값이 있다면 필수!)
    )

class AppSettings(BaseSettings):
    
    service: ServiceSettings = ServiceSettings()
    logging: LoggingSettings = LoggingSettings()

settings = AppSettings()

print(settings.service.TIMEOUT)
print(settings.logging.LOG_LEVEL)
```



## BaseSettings 설정   

### model_config  

model_config 는 BaseSettings 가 가지고 있는 속성으로, SettingsConfigDict 클래스를 구현한 객체이다. BaseSettings 가 정의된 코드를 보면 아래와 같이 model_config 를 선언하는 것을 볼 수 있다.  

```python
# site-packages/pydantic_settings/main.py
class BaseSettings(BaseModel):
    """
    ...
    All the below attributes can be set via `model_config`.
    'model_config' 를 통해 아래의 모든 속성값을 설정할 수 있다.
    ...
    """
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        extra='forbid',
        arbitrary_types_allowed=True,
        ...)
        ... 이하 생략
```

### SettingsConfigDict 로 model_config 설정값 바꿔보기  

```python
class AppSettings(BaseSettings):
  ...
  model_config = SettingsConfigDict(
    ...
  )
```

> 주의 : model_config 에서 속성값을 정의할 때에는 앞에 언더바를 쓰지 않는다.  

### 주요 속성값 살펴보기  

pydantic-settings 2.11.0 버전을 기준으로 26개의 속성값이 있으며, 이 중에서 주요할 것으로 보이는 속성값만 살펴보도록 하겠다.  

|속성값|설명|자료형|예시|
|---|---|---|---|
|env_file|읽어들일 환경변수 파일의 경로|STR|"core/.env"|
|env_file_encoding|환경변수 파일의 인코딩|STR|"utf-8"|
|env_prefix|특정한 접두사로 시작되는 환경변수 항목만 읽어들임|STR|"DEV__"|
|extra|파라미터 조건들에 맞지 않는 환경변수 항목은 무시함|Bool|True|
|env_ignore_empty|값이 빈 환경변수는 무시함|Bool|True|
|case_sensitive|대소문자 구분을 할지 여부. True 면 구분한다.|Bool|False|
|env_nested_delimiter|중첩된 환경 변수 값의 구분자.|STR|"__"|
|secrets_dir|시크릿 파일이 있는 디렉터리 경로|STR|core/secrets|


## 선언 위치와 사용 위치  

### 선언 위치  

- 설정 코드파일은 보통 `core/settings.py` 에 위치시키면 적당할 것으로 보인다.  
- 코드파일 내용은 아래와 같이 클래스에 대한 인스턴스를 생성하는 것까지 포함하도록 한다.  
- 그 이유는 **'설정의 단일 인스턴스(Singleton) 보장'**과 **'빠른 실패(Fail-Fast)' 원칙**을 지키기 위해서이다.  

```python
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class ServiceSettings(BaseSettings):
    TIMEOUT: int
    MULTIPROCESSOR_NUM: int

class LoggingSettings(BaseSettings):
    EXPIRE_DAY: int
    LOG_LEVEL: str

class AppSettings(BaseSettings):
    
    service: ServiceSettings
    logging: LoggingSettings
    
    model_config = SettingsConfigDict(
        env_file="core/06.env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_nested_delimiter="__" 
    )

settings = AppSettings() # 인스턴스 생성까지
```

> (1) 설정의 단일 인스턴스 보장 : settings.py 파일에 인스턴스를 미리 생성해두면, 애플리케이션의 다른 어떤 모듈에서 import를 하더라도 항상 동일한 설정 객체(인스턴스)를 사용하게 된다.  
> (2) 빠른 실패 원칙 : 설정 오류를 "설정 사용 시점"이 아니라, "애플리케이션 시작 시점"에 즉시 발견할 수 있다.  


### 사용 위치  

- 어떤 파일에서든 **인스턴스 자체를** `import` 하여 사용하면 된다.  

```python
# main.py
from core.settings import settings # 이렇게 인스턴스 자체를 import

def main():
    print(settings)
    print(settings.service.TIMEOUT + 5)
    print(settings.logging.LOG_LEVEL)

if __name__ == "__main__":
    main()
```

```bash
uv run main.py
>> 15
>> INFO
```


## 특징  

- 타입 자동 변환이 가능하다.  
- 원래 환경 변수 파일에서 읽어들이는 값은 String 자료형이 기본인데, BaseSettings 에서는 읽어들이면서 자료형 지정이 가능하다.  

```python
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class ServiceSettings(BaseSettings):
    TIMEOUT: int
    MULTIPROCESSOR_NUM: int
```

## 리뷰  

### 쓸만한가?  

- 아주 좋다고 생각한다.  
- 기존에 dot-env 와 os, with open 을 섞어서 썼어야 하는 것을 이제는 BaseSettings 하나로 해결이 가능하다.  
- 또한 환경변수를 중첩해 사용하거나, 환경 변수 이름의 패턴을 기준으로 그루핑하는 기능 또한 좋다.  
- 더불어 String 으로만 읽히는 환경변수를 내가 지정한 타입으로 미리 변환해 저장해두는 것 또한 환상적이다.  

### 좋기만 한가?  

- 다만, 다소 직관적이지 않다고 생각이 된다. 개념이 잡혀있어야만 제대로 사용이 가능할 것 같다는 생각이 든다.  

