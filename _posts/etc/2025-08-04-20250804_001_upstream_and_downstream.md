---
title: "업스트림(Upstream)과 다운스트림(Downstream)" # 제목 (필수)
excerpt: "개발, 통신, 제조 등 산업 전반에서 사용되는 용어인 업스트림과 다운스트림을 알아보자" # 서브 타이틀
date: 2025-08-04 07:00:00 +0900      # 작성일 (필수)
lastmod: 2025-08-04 07:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-08-04 07:00:00 +0900   # 최종 수정일 (필수)
categories: etc        # 다수 카테고리에 포함 가능 (필수)
tags:     # 태그 복수개 가능 (필수)
classes: wide    # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.gif     # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'      # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---

<!--postNo: 20250804_001-->

## 업스트림과 다운스트림  

### 정의  

![](/assets/images/20250804_001_001.png)  

'Upstream(업스트림)'과 'Downstream(다운스트림)'은 다양한 맥락에서 사용되는 용어로, **어떤 과정의 흐름에서의 특정 작업의 위치나 방향**을 설명할 때 사용됩니다. 두 용어는 일반적으로 서로 **반대되는 관계**를 의미하며, 전체 프로세스의 **시작과 끝**을 나타내는 중요한 개념입니다.  

#### 업스트림 Upstream  

- 일반적으로 **전체 과정의 초기 단계나 원천**을 의미합니다.  
- 산업에서는 **제품 생산을 위한 자원의 수집이나 공급망 초기 단계, 또는 데이터의 전송 시작**을 나타냅니다.  

#### 다운스트림  

- 일반적으로 과정의 **마지막 단계나 결과물**을 의미합니다.  
- 산업에서는 최종 **공급망의 최종 단계, 소프트웨어 배포, 데이터의 수신**을 나타냅니다.  

### 어원  

'업스트림(Upstream)'과 '다운스트림(Downstream)'이라는 용어의 어원은 **물의 흐름에서 유래**합니다.  

- **업스트림(Upstream)**
  물의 흐름에서 상류를 뜻하며 원천, 시작점이라는 위치적 특성과, 이곳에서 민들어진 물이 하류로 흘러가는 방향적 특성을 가집니다.  

- **다운스트림(Downstream)**  
  물의 흐름에서 하류를 뜻하며 종료점이라는 위치적 특성과 상류로부터 물이 흘러오는 방향적 특성을 가집니다.  

- 물은 상류(Upstream)에서 하류(Downstream)로 흐르는 순서가 존재합니다.  

## 분야별 Upstream과 Downstream  

### 산업 및 공급망  

- **Upstream** : 제품 생산을 위한 원자재 확보와 초기 생산 단계 (예: 원유 시추, 광물 채굴, 농수산물 수확, 제품 생산).  
- **Downstream** : 원자재가 가공된 뒤 제조, 유통, 판매 등 최종 소비자에게 도달하는 과정 (예: 정유 공정, 제품 포장, 유통망을 통한 판매).  

- Upstream 은 "공급의 시작점", Downstream 은 "소비자와의 접점" 입니다.  
- 공급사슬에서 Upstream은 제품의 제작 업체와 그 제작 원자재 공급업체를, Downstream은 최종 고객에게 제품을 유통하고 전달하는 조직과 프로세스를 포함합니다.  

### 소프트웨어 개발  

- **Upstream** : 현재 프로젝트 또는 구성 요소나 코드가 의존하고 있는 원본 소스, 초기 단계 또는 기본 구성 요소. 업스트림에서 이루어진 변경 사항은 일반적으로 다운스트림 영역에 영향을 미칩니다.  
- **Downstream** : 업스트림에 의존하고 있는 서비스, 모듈, 코드, 구성 요소 등. 사용자가 이용하는 소프트웨어 또한 다운스트림입니다.   

- 변경 사항은 보통 업스트림에서 다운스트림으로 흐릅니다. 예를 들어 원본 소스에서 새로운 업데이트나 버그 수정이 발생하면 소비자가 사용하는 소프트웨어에 영향을 미치는 것을 생각할 수 있습니다.  
- 다운스트림에서 업스트림으로 흐르는 경우도 있습니다. 예를 들어 원본 소스를 포크한 프로젝트에서 새로운 기능을 추가하거나 버그를 고치는 경우, 이것이 원본 소스에 합쳐지는 경우가 있습니다.  


### 오픈소스 소프트웨어 개발  

- **Upstream** : 오픈 소스 프로젝트의 원본 저장소와 직접 관련된 개발 활동, 원저작자 또는 유지보수자에게 코드를 제공하는 방향 (예: 리눅스 커널 공식 저장소에 버그 수정 코드 제공, 컨트리뷰트).  
- **Downstream** : 원본 프로젝트를 기반으로 하는 포크 배포판을 만들어 확장 또는 변형하여 배포하는 활동 (예: 우분투나 페도라 같은 리눅스 배포판 개발).  
- Downstream 활동은 Upstream의 결과물을 가져와 활용하거나 변형하고, 그 피드백이나 수정 사항은 다시 Upstream 에 영향을 끼칠 수 있습니다.  

### 데이터 통신  

- **Upstream** : 사용자가 데이터를 전송하는 과정 (클라이언트 → 서버) (예: 파일 업로드).  
- **Downstream** : 서버가 데이터를 사용자에게 전달하는 과정 (서버 → 클라이언트) (예: 웹 페이지 로딩, 비디오 스트리밍).  
- 일반적으로 가정용 통신에서는 Downstream 속도가 Upstream보다 높으며, 산업용 통신에서는 대칭적인 속도를 제공하기도 합니다 (예 : ADSL 및 케이블 모뎀은 비대칭, SDSL 및 T1은 대칭).  

### AI  

- **Upstream** : 사전 학습된(pre-trained) 모델을 만드는 과정.  
- **Downstream** : 사전 학습된 모델을 특정 작업에 맞게 조정하여 활용하는 최종적인 작업.  
- **전이 학습(Transfer Learning)** : 사전 학습된 모델(Upstream)을 활용하여 최종 모델(Downstream)을 만듭니다.  

### 생명공학 및 제약  

- **Upstream** : 초기 연구, 세포 배양 및 단백질 발현 등 생산 초기 과정.  
- **Downstream** : 정제, 품질 검사, 포장 등 최종 제품 준비 과정.  

### 에너지  

- **Upstream** : 에너지 자원의 탐사 및 추출 단계 (예: 천연가스 채굴, 원유 시추).
- **Downstream** : 자원 가공, 정제, 소비자에게 전달하는 과정 (예: 천연가스 정제 및 분배).

## Upstream과 Downstream의 관계

- Upstream과 Downstream은 항상 상대적인 개념이며, 어떤 흐름이나 과정에서의 위치와 방향을 나타냅니다.  
- **Upstream에서 발생한 변화나 개선은 Downstream에 영향을 미침**  
  예시 - Upstream 프로젝트의 버그 수정은 Downstream 배포판에 이점을 제공  
- **Downstream 활동에서 얻은 피드백이나 기여가 다시 Upstream으로 전달될 수 있음**  
  예시 - Downstream 사용자가 발견한 버그 패치를 Upstream 개발자에게 제공  


## Reference  

[https://en.wikipedia.org/wiki/Upstream_(networking)](https://en.wikipedia.org/wiki/Upstream_(networking))  
[https://en.wikipedia.org/wiki/Downstream_(networking)](https://en.wikipedia.org/wiki/Downstream_(networking))  
[https://en.wikipedia.org/wiki/Upstream_(software_development)](https://en.wikipedia.org/wiki/Upstream_(software_development))  
[https://en.wikipedia.org/wiki/Downstream_(software_development)](https://en.wikipedia.org/wiki/Downstream_(software_development))  
[https://itvc.tistory.com/entry/Upstream과Downstream의개념](https://itvc.tistory.com/entry/Upstream%EA%B3%BC-Downstream%EC%9D%98-%EA%B0%9C%EB%85%90#google_vignette)    
[https://andrewpage.tistory.com/190](https://andrewpage.tistory.com/190)  
[https://wikidocs.net/251764](https://wikidocs.net/251764)  
[https://chan-lab.tistory.com/31](https://chan-lab.tistory.com/31)  
[https://ko.wikipedia.org/wiki/%EA%B3%B5%EA%B8%89%EC%82%AC%EC%8A%AC](https://ko.wikipedia.org/wiki/%EA%B3%B5%EA%B8%89%EC%82%AC%EC%8A%AC)  
