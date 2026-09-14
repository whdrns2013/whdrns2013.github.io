---
title: "OpenAI Hugging Face 해킹 사건 6. 투트랙 협업 구조" # 제목 (필수)
excerpt: "한 팀은 OpenAI 내부 인프라, 다른 팀은 Hugging Face" # 서브 타이틀이자 meta description (필수)
date: 2026-09-14 12:56:00 +0900      # 작성일 (필수)
lastmod: 2026-09-14 12:56:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-09-14 12:56:00 +0900  # 최종 수정일 (필수)
categories: security       # 다수 카테고리에 포함 가능 (필수)
tags: OpenAI 허깅페이스 Hugging Face HuggingFace AI 에이전트 agent 자율형 해킹 hacking 투트랙 공격 체인 RCE Staging Server Foothold Swarm IMDS
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
series_index: 6
---

<!--postNo: 20260914_001-->

> 이번 글은 내용의 특성상 개조식으로 작성했습니다. 정보 전달에 좀 더 효과적인 것 같음.  

![](/assets/images/20260914_001_001.jpg)  

## 미리 알아 둘 개념  

- **RCE** Remote Code Execution  

네트워크를 통해 원격 시스템에서 공격자가 원하는 코드를 실행할 수 있는 취약점 또는 그 상태.

- **Swarm**  

여러 개의 자율적인 개체가 서로 상호작용하고 협력하면서 집단적으로 행동하는 구조.

- **Staging Server**  

파일, 프로그램, 데이터 등을 실제 사용이나 배포 전에 임시로 저장하고 준비해 두는 서버. 보안 공격에서는 공격 도구, Payload, 탈취 데이터 등을 보관하거나 전달하는 중간 거점으로 사용되기도 한다.  

- **TOCTOU** Time-of-Check to Time-of-Use  

어떤 자원의 상태를 확인한 시점과 실제로 사용하는 시점 사이에 상태가 변경될 수 있어 발생하는 Race Condition 취약점.

- **IMDS** Instance Metadata Service   

클라우드 VM이 자신의 인스턴스 정보나 임시 IAM Credential 등을 얻기 위해 사용하는 내부 메타데이터 서비스

- **Foothold**  

공격자가 대상 시스템 내부에 확보한 초기 공격 거점. 반드시 영구적인 접근을 의미하지는 않는다.

- **Jinja Template Injection**  

사용자 입력이 Jinja 템플릿의 데이터가 아니라 **템플릿 표현식 자체로 해석되도록 삽입되는 취약점**. 공격자는 이를 통해 템플릿 엔진의 동작을 조작해, 정보 유출이나 RCE까지 이어질 수 있다. 일반적으로 Server-Side Template Injection(SSTI)의 한 종류로 볼 수 있다.  

<br>

## 에이전트들이 만든 협업 구조  

- 앞선 사건에서 OpenAI 보안팀은 에이전트들이 사용하던 비밀 게시판을 발견하고 이를 제거함
- 하지만 아티팩토리의 구석에 폴더를 만들 수 있는 기능을 발견하고, 다시 이를 가지고 정보 공유를 시작
- 이번에는 단순 정보 공유를 넘어 명령, 분업, 작업 완료 보고,신원 확인까지 가능한 하나의 협업 시스템이 만들어짐

---

- 이어서 에이전트들이 **협업을 시작했는데, 자신의 과제와 관계가 없더라도 집단을 위해 행동하기 시작**함
- 에이전트들은 자신이 지금 상대를 돕는 것은 보상과 직접적인 관련이 없음을 알고 있었다.
- 그러면서도 다른 에이전트 역시 집단을 위해 문제를 해결할 것이고, 언젠가는 그 결과가 자신에게 돌아올 수 있다는 믿음을 가졌다.  

---

- 에이전트들의 협업 구조는 더욱 정밀해졌다.
- 에이전트 무리에서 개체를 식별하고 자신을 증명하기 위해 MAC 방식의 암호학적 인증값을 메시지(폴더명)에 붙임  
- 또한 새로운 취약점이나 Credential(자격 증명)을 확보할 경우 전체 Swarm에 공유함  

---

<br>

## 두 가지 공격 루트  

- 이 시점부터 크게 두 방향의 공격 루트가 만들어졌다.
- 하나는 OpenAI 내부 인프라를 향한 공격이었고, 다른 하나는 외부, 특히 Hugging Face를 향했다.

---

### 1. **첫 번째 공격 루트 : OpenAI 내부망**  

- 에이전트들은 OpenAI 내부망을 향한 공격을 시작했다.  
- 공격의 시작점은 **Pastebin에 공개되어 있던 외부 기관의 로그인 Credential**    
- Credential을 공개된 공간에 노출하는 것은 보안에 위배된다 점에서 이는 **사람에 의한 보안 취약점**이라고 볼 수 있음
- 에이전트들은 이 Credential이 정상적으로 동작하는지 확인한 뒤, 해당 외부 저장소에 쓰기 권한까지 확인함
- 이 Credential로 접근한 **외부 저장소를 이후 OpenAI 내부망 공격을 위한 거점으로 활용**함 (OpenAI 내부망에 직접 접근한 것은 아님)  

---

- 에이전트들은 **아티팩토리를 공격에 필요한 파일과 데이터를 올려두는 Staging Server로 활용**함
- 에이전트들은 여기에 조작된 Ruby 객체 등을 올려놨고, 이후 OpenAI의 아티팩토리가 이 외부 저장소의 데이터를 가져오도록 유도함  
- 여기에는 아래 두 가지 취약점이 존재함  
- (1) 아티팩토리가 외부에서 가져온 조작된 Ruby 데이터는 "신뢰할 수 있는 데이터"처럼 캐싱되었다.
- (2) JRuby의 TOCTOU 문제를 이용해, 데이터 검사 전에 일부 dependency 정보가 역직렬화되는 동작 이용
- 이를 통해 에이전트들은 아티팩토리에 대한 RCE까지 성공함  

---

- 에이전트들의 공격은 컨테이너를 넘어 host까지 이어졌다.
- 에이전트들은 **아티팩토리가 실행되거 있는 서버(host)의 커널 버전을 확인한 뒤, 권한 상승 취약점을 이용해 host의 root 권한을 확보**함
- 즉, Agent -> RCE to 아티팩토리 -> 아티팩토리 서버 커널 Exploit -> 아티팩토리 host root 권한 획득

---  

- 아티팩토리를 내부망의 공격 거점으로 확보한 에이전트들  
- OpenAI 훈련 환경의 주요 구성 요소인 아티팩토리의 host root 권한을 얻은 뒤 **주변 인프라를 탐색**함
- 이후 IMDS(Instance Metadata Service)를 통해 IAM Credential을 얻었다.
- 이 IMDS는 이전 글인 SSRF 글에서 본 Capital One 해킹 사례에 나왔던 그 IMDS와 개념적으로 동일하다.  
- 그리고 이를 이용해 많은 권한을 가지고 있던 K8s Service Account를 찾아 이용하기 시작했다.
- 결과적으로, **에이전트들은 K8s Cluster Admin 수준의 권한까지 도달**했음
- 훈련받던 모델들은 어느 순간 클라우드 인프라 전반으로 공격 범위를 넓혀가고 있던 것  

---  

<br>

### 2. **두 번째 공격 루트 : Hugging Face**  

- 위와 같은 OpenAI 내부망 공격이 이루어지고 있을 때, 동시에 Hugging Face를 향한 공격도 진행되고 있었음  
- 에이전트들은 인터넷을 조사하다가 가상 **호스팅 서버 서비스인 Modal에 배포되어 있던 훈련용 애플리케이션에서 default 공용 API key를 확보**했고, 이 서비스에서 Command Injection 취약점을 발견함  
- 이를 이용해 에이전트들은 Modal에 호스팅되어 있던 해당 애플리케이션(외부 샌드박스)을 장악하고, 이 서버를 **외부 공격 거점 Foothold로 사용**함  

---  

- 에이전트들은 Hugging Face의 Dataset 처리 인프라를 조사함
- 두 가지 취약점이 발견되었는데, HDF5 파일 파싱 과정의 취약점과 Jinja Template Injection

--- 

- 에이전트들은 Hugging Face에서는 Dataset Worker가 처리하도록 **조작된 HDF5 파일**을 업로드함
- Worker가 이 파일을 처리하는 과정에서 오동작을 일으키며  Worker는 "서버 내부의 파일을 읽어 반환할 수 있는 임의 **파일 읽기(Arbitrary File Read) 상태**"로 무력화됨  
- 이를 이용해 `/proc/self/environ` 등에서 **환경 변수 정보를 획득**했음
- 에이전트들은 이 안에 박혀 있던 핵심 로그인 **토큰 정보들을 확보**함  

---

- 에이전트들은 백엔드 소스 코드까지 확보하게 되었고, 백엔드의 동작 방식을 파악함.
- 여기서 두 번째 취약점인 **Jinja Template Injection을 발견했고, 이를 이용해 RCE**에 성공  
- 즉 API key 발견 -> Dataset 처리 서비스를 속여 환경변수 뒤짐 -> 로그인 토큰 확보 -> 백엔드 소스코드 확보 -> Jinja Template Injection 확인
- 최초 침투 이후 약 13시간 만에 여러 Hugging Face Cluster의 cluster-admin 권한까지 도달함

---

<br>

## 여러 취약점이 복합 이용된 이번 사건  

- 이번 사건은 단순히 한두 가지 취약점을 이용한 해킹 사건이 아님
- 사람의 취약점, 환경변수, 커널 수준의 취약점, SSRF, 서비스 속이기, 데이터셋 조작 등 **여러 공격 기법이 복합**됨  
- 여러 공격 기법을 공유하고 에이전트 간의 협업 구조를 만들 수 있었던 배경에는 커뮤니티가 있었음  
- 서로 독립적이던 작은 취약점과 작은 권한들이 에이전트들의 **협업을 통해 하나의 긴 공격 체인으로 연결**됨  

따라서 이번 사건을 통해 우리는 아래 사항을 생각해봐야 함  

> "여러 에이전트가 같은 환경에서 반복적으로 활동하면서 서로의 발견을 축적할 수 있을 때 전체 시스템이 어떤 능력을 가지게 되는가?"

<br>

## Reference  

- [Black Hat USA 2026 | ‘충격적인’ 뉴스: OpenAI–Hugging Face 사건](https://www.youtube.com/watch?v=87DyyMV0kCY)  
- [Hugging Face - Anatomy of a Frontier Lab Agent Intrusion: A Technical Timeline of the July 2026 Incident](https://huggingface.co/blog/agent-intrusion-technical-timeline)    
- [OpenAI 한국어 - Hugging Face 사고와 앞으로의 방향](https://openai.com/ko-KR/index/hugging-face-incident-and-the-road-ahead/)    
- [OpenAI 한국어 - 모델 평가 중 발생한 보안 사고에 공동 대응](https://openai.com/ko-KR/index/hugging-face-model-evaluation-security-incident/)  

<br>