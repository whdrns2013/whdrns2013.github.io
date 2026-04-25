---
title: "[LangGraph] 카페 질문 답변 RAG 챗봇 만들기 실습" # 제목 (필수)
excerpt: "카페의 규정에 근거해서만 답변하는 챗봇" # 서브 타이틀이자 meta description (필수)
date: 2026-04-26 08:12:00 +0900      # 작성일 (필수)
lastmod: 2026-04-26 08:12:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-04-26 08:12:00 +0900   # 최종 수정일 (필수)
categories: AI       # 다수 카테고리에 포함 가능 (필수)
tags: ai llm langgraph 랭그래프 langchain 랭체인 graph 그래프 init 챗봇 실습 간단 코드                   # 태그 복수개 가능 (필수)
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
  nav: docs_llm
pinned: 
---

<!--postNo: 20260426_001-->

## LangGraph 에서 간단한 RAG 구축하기

![](/assets/images/20260426_001_001.png)

### 1. 실습 소개

- 공부한 LangGraph를 이용해서 가상의 카페 “오로라 카페”의 안내 챗봇을 만들어본다.
- 안내 챗봇은 제시된 카페의 규정 문서들을 참고해 고객의 질문에 답변을 한다.
- 이를 위해 `LangChain`, `Embedding API`, `Chroma`, `LangGraph` 등을 이용한다.
- 채팅 화면은 별도로 없으며, 터미널을 통해 채팅을 수행한다.
- 소스코드는 아래 링크를 참고

[study/03_AI/04_LLM/00_LangChainLangGraph/04_cafe_rag at main · whdrns2013/study](https://github.com/whdrns2013/study/tree/main/03_AI/04_LLM/00_LangChainLangGraph/04_cafe_rag)

### 2. RAG

- Retrieval-Augmented Generation 검색 증강 생성
- 모델이 학습하지 않은 외부 데이터를 실시간으로 검색(retrieval) 하고
- 이를 바탕으로 답변을 생성(generation) 하는 것
- 목표 : 기존 LLM 의 한계를 극복하고자 함

[RAG - Retriever 와 Reranker 검색기와 리랭커](https://whdrns2013.github.io/ai/20250720_001_retriever_and_reranker/)

### 3. 서비스 구조

#### (1) 서비스 관점

- 사용자는 챗봇에게 자유롭게 질문을 수행한다.
- 챗봇은 사용자의 질문 의도를 파악하고, 카페 이용과 관련된 질문인지, 그 외의 질문인지 판별한다.
- 사용자의 질문 의도가 카페 이용과 관련된 경우, 내부 규정문서에서 관련 내용을 찾아 답변한다.
- 사용자의 질문 의도가 카페 이용과 무관한 경우, "카페 이용과 관련된 질문만 가능합니다."라고 답변한다.
- 싱글턴 구조로, 대화 내용을 기억하지 않는다.

#### (2) 소프트웨어 관점

- LLM : Google GenAI API 를 사용하며, 코드단에서는 `langchain-google-genai` 라이브러리를 사용
- Vector DB : 저장과 검색에서 Chroma DB를 이용, 코드단에서는 `chromadb` 라이브러리를 사용
- Embedding : 의미 기반 검색을 위한 Embedding 은 Google 의 `gemini-embedding-2` 를 사용
- 워크플로우 : LangGraph 를 이용하여 그래프 구조의 워크플로우 구축
- Chat UI : 터미널

### 4. 그래프 설계

![](/assets/images/20260426_001_002.png)  

#### (1) State 상태

- query : 사용자의 질문 텍스트를 담는 채널
- intent : 사용자의 질문 의도 종류를 담는 채널
- intent_reason : 의도 분류 이유를 담는 채널
- document : 사용자의 질문에 답변하기 위한 참고자료를 담는 채널
- response : 사용자의 질문에 대한 답변 텍스트

#### (2) Node 노드

- intent_classifier : 사용자 질문 의도를 분류하는 노드
- retrieve : 답변에 필요한 관련 문서를 검색하는 노드
- llm : 사용자 질문과 관련 문서를 참고해 llm 답변을 생성하는 노드
- fallback : 서비스와 무관한 질문에 대한 안내성 답변을 반환하는 노드
- output : 최종 답변을 반환하는 노드

#### (3) Edge 엣지

- intent_classifier 이후, intent 에 따라 조건부 엣지 수행
- llm 과 fallback 노드의 출력이 output 노드로 fan-in
- 그 외로는 일반적인 1:1 매칭 엣지

### 5. 가상의 카페 규정 문서

- 총 5개의 가상의 카페 규정 문서를 생성하여 RAG 참고자료로 운용함  

<details>
<summary> cafe_menu.txt : 카페 메뉴와 가격, 옵션, 세트, 알레르기 안내 </summary>
<div markdown='1'>

```
# 오로라 카페 메뉴 안내

## 커피

### 에스프레소
- 에스프레소: 4,000원
- 아메리카노: 4,500원
- 카페라떼: 5,000원
- 바닐라라떼: 5,500원
- 카푸치노: 5,000원

### 디카페인 변경
- 모든 에스프레소 음료는 +500원으로 디카페인 변경이 가능합니다.
- 디카페인 원두는 산미가 적고 고소한 맛이 특징입니다.

## 시그니처 음료
- 오로라 크림 라떼: 6,500원
- 솔티드 카라멜 라떼: 6,300원
- 제주 말차 라떼: 6,000원
- 흑임자 크림 커피: 6,800원

## 티 / 논커피
- 얼그레이 티: 5,000원
- 캐모마일 티: 5,000원
- 제주 감귤차: 5,800원
- 초콜릿 라떼: 5,800원
- 딸기 우유: 5,800원

## 에이드 / 주스
- 레몬 에이드: 6,000원
- 자몽 에이드: 6,000원
- 청포도 에이드: 6,200원
- 오렌지 주스: 6,500원

## 디저트
- 플레인 스콘: 3,800원
- 초코 스콘: 4,200원
- 크루아상: 4,000원
- 치즈케이크: 6,500원
- 티라미수: 6,800원
- 말차 갸또: 7,000원

## 세트 안내
- 아메리카노 + 플레인 스콘 세트: 7,800원
- 카페라떼 + 크루아상 세트: 8,500원

## 알레르기 및 원재료 안내
- 우유가 포함된 메뉴: 카페라떼, 바닐라라떼, 카푸치노, 오로라 크림 라떼, 솔티드 카라멜 라떼, 제주 말차 라떼, 초콜릿 라떼, 딸기 우유, 치즈케이크, 티라미수
- 견과류가 포함될 수 있는 메뉴: 흑임자 크림 커피, 말차 갸또
- 메뉴별 상세 알레르기 정보는 직원에게 문의해 주세요.

## 온도 및 옵션
- 일부 음료는 HOT / ICE 선택이 가능합니다.
- ICE 음료는 기본적으로 큰 컵에 제공됩니다.
- 샷 추가: +500원
- 시럽 추가: +300원
- 오트밀크 변경: +700원
```

</div>
</details>

<details>
<summary> store_policy.txt : 매장 이용 안내, 와이파이, 반려동물, 화장실, 주차 등 </summary>
<div markdown='1'>

```
# 오로라 카페 매장 이용 안내

## 기본 정보
- 매장명: 오로라 카페
- 영업시간: 매일 10:00 ~ 22:00
- 라스트오더: 21:30
- 정기휴무: 없음

## 좌석 및 이용 시간
- 총 좌석 수: 42석
- 1인석: 10석
- 2인석: 12석
- 4인석: 8석
- 혼잡 시간대에는 1인 1음료 주문을 부탁드립니다.
- 만석 시 좌석 이용 시간은 최대 2시간입니다.

## 와이파이 및 전원
- 무료 와이파이 사용 가능
- 와이파이명: AuroraCafe_Guest
- 비밀번호: aurora2025
- 창가 좌석 일부와 중앙 바 좌석에서 콘센트 사용 가능

## 반려동물 안내
- 소형 반려동물은 이동가방 또는 유모차 이용 시 동반 가능합니다.
- 다른 고객에게 불편을 줄 경우 입장이 제한될 수 있습니다.

## 외부 음식 및 포장
- 외부 음식 반입은 불가합니다.
- 전 메뉴 포장 가능합니다.
- 디저트는 당일 구매 기준으로만 교환 가능합니다.

## 결제 수단
- 신용카드, 체크카드, 삼성페이, 애플페이 사용 가능
- 현금 결제 가능
- 지역화폐는 사용 불가

## 화장실 안내
- 매장 외부 복도 끝 공용 화장실 이용
- 비밀번호는 영수증 하단에 표시됩니다.

## 주차 안내
- 전용 주차장은 없습니다.
- 인근 민영주차장을 이용해 주세요.

## 금지 사항
- 매장 내 흡연 금지
- 고성방가 및 촬영 장비를 이용한 상업 촬영은 사전 문의 필요
- 좌석만 맡아두고 장시간 외출하는 행위는 제한될 수 있습니다.
```

</div>
</details>

<details>
<summary> reservation_event.txt : 예약 및 대관 안내 </summary>
<div markdown='1'>

```
# 오로라 카페 예약 및 대관 안내

## 일반 좌석 예약
- 일반 방문 좌석은 별도 예약을 받지 않습니다.
- 방문 순서대로 이용 가능합니다.

## 단체 방문
- 6인 이상 방문 시 매장으로 사전 연락 부탁드립니다.
- 단체 방문 가능 시간은 평일 14:00 ~ 17:00입니다.
- 주말 및 공휴일에는 단체 좌석 확보가 어렵습니다.

## 공간 대관
- 소규모 모임, 북클럽, 클래스 운영 목적의 공간 대관이 가능합니다.
- 대관 가능 시간: 평일 18:30 ~ 21:30
- 최대 수용 인원: 12명
- 대관료: 2시간 60,000원
- 음료 1인 1잔 주문 필수

## 예약 방법
- 인스타그램 DM 또는 매장 전화로 문의 가능합니다.
- 예약 신청 시 아래 정보를 전달해 주세요.
    - 이름
    - 연락처
    - 방문 날짜
    - 방문 시간
    - 인원수
    - 이용 목적

## 예약 확정
- 예약은 매장 확인 답변 이후 확정됩니다.
- 당일 예약은 불가능할 수 있습니다.

## 취소 및 변경
- 예약 시간 24시간 전까지 취소 가능
- 이후 취소 시 대관료 환불 불가
- 일정 변경은 1회만 가능합니다.
```

</div>
</details>

<details>
<summary> faq.txt : 자주묻는질문 </summary>
<div markdown='1'>

```
# 오로라 카페 자주 묻는 질문

## Q1. 디카페인 음료가 있나요?
A. 네, 모든 에스프레소 기반 음료는 +500원으로 디카페인 변경이 가능합니다.

## Q2. 오트밀크로 변경할 수 있나요?
A. 네, 일부 우유 기반 음료는 +700원으로 오트밀크 변경이 가능합니다.

## Q3. 케이크 예약이 가능한가요?
A. 홀케이크 예약 서비스는 현재 제공하지 않습니다. 조각 케이크는 매장 재고에 따라 판매됩니다.

## Q4. 콘센트가 있나요?
A. 네, 창가 좌석 일부와 중앙 바 좌석에서 콘센트를 사용할 수 있습니다.

## Q5. 와이파이 비밀번호가 무엇인가요?
A. 와이파이명은 AuroraCafe_Guest이며, 비밀번호는 aurora2025입니다.

## Q6. 반려동물 동반이 가능한가요?
A. 소형 반려동물에 한해 이동가방 또는 유모차 이용 시 가능합니다.

## Q7. 주차가 가능한가요?
A. 전용 주차장은 없으며, 인근 민영주차장을 이용해 주셔야 합니다.

## Q8. 단체석 예약이 가능한가요?
A. 일반 좌석 예약은 불가하지만, 6인 이상 단체 방문은 평일 14:00~17:00 사이 사전 문의를 권장합니다.

## Q9. 매장 휴무일이 있나요?
A. 정기휴무는 없습니다. 다만 임시 휴무는 별도 공지될 수 있습니다.

## Q10. 외부 음식 반입이 가능한가요?
A. 아니요, 외부 음식 반입은 불가합니다.

## Q11. 포장이 가능한가요?
A. 네, 전 메뉴 포장이 가능합니다.

## Q12. 애플페이 사용이 가능한가요?
A. 네, 애플페이 사용이 가능합니다.
```

</div>
</details>

<details>
<summary> brand_notice.txt : 브랜드 및 운영 관련 내용 </summary>
<div markdown='1'>

```
# 오로라 카페 브랜드 및 운영 안내

## 매장 소개
오로라 카페는 조용한 작업과 가벼운 대화를 모두 즐길 수 있는 공간을 목표로 운영됩니다.
시그니처 크림 음료와 수제 디저트를 중심으로 메뉴를 구성하고 있습니다.

## 추천 이용 고객
- 노트북 작업이 필요한 고객
- 조용한 미팅이 필요한 고객
- 디저트와 커피를 함께 즐기고 싶은 고객
- 2~4인 소규모 방문 고객

## 운영 원칙
- 모든 고객이 편안하게 이용할 수 있도록 기본 에티켓을 중요하게 생각합니다.
- 혼잡 시간에는 장시간 좌석 점유를 제한할 수 있습니다.
- 최신 공지사항, 임시 휴무, 시즌 메뉴 출시 일정은 공식 SNS를 통해 우선 안내됩니다.

## 시즌 메뉴 정책
- 시즌 메뉴는 별도 공지 후 판매를 시작합니다.
- 시즌 메뉴의 판매 기간과 재고는 실시간으로 변동될 수 있습니다.
- 시즌 메뉴 관련 최신 정보는 매장 공식 SNS 공지를 확인해 주세요.

## 브랜드 소개
오로라 카페는 차분한 분위기 속에서 커피, 디저트, 휴식, 작업이 자연스럽게 어우러지는 공간을 지향합니다.
브랜드의 핵심 이미지는 조용함, 따뜻함, 정돈된 감성, 일상 속 작은 여유입니다.

오로라 카페는 단순히 음료를 판매하는 공간이 아니라, 고객이 자신의 시간을 편안하게 보낼 수 있는 로컬 카페 브랜드로 운영됩니다.

## 브랜드 가치
오로라 카페는 다음 가치를 중요하게 생각합니다.

- 편안함: 고객이 부담 없이 머물 수 있는 분위기를 제공합니다.
- 일관성: 메뉴, 공간, 응대 방식에서 안정적인 경험을 제공합니다.
- 정성: 음료와 디저트의 품질을 꾸준히 관리합니다.
- 조화: 작업, 대화, 휴식이 서로 방해되지 않는 공간 운영을 지향합니다.
- 지역성: 지역 고객과 자연스럽게 연결되는 카페 문화를 만들어갑니다.

## 브랜딩 운영 원칙
오로라 카페의 모든 브랜딩 요소는 차분하고 따뜻한 이미지를 유지하는 방향으로 운영됩니다.

- 과도하게 자극적이거나 시끄러운 표현은 지양합니다.
- 메뉴명, 안내 문구, SNS 게시물은 부드럽고 명확한 톤을 사용합니다.
- 매장 분위기와 어울리는 색감, 사진, 문구를 우선 사용합니다.
- 고객에게 부담을 주는 홍보보다 자연스러운 정보 전달을 중요하게 생각합니다.
- 브랜드 이미지를 해칠 수 있는 무분별한 협업이나 이벤트는 진행하지 않습니다.

## 공식 커뮤니케이션 채널
오로라 카페의 공식 안내는 매장 내 고지와 공식 SNS를 기준으로 합니다.

다음 항목은 공식 채널을 통해 우선 안내될 수 있습니다.

- 시즌 메뉴 출시
- 신메뉴 소개
- 임시 휴무 및 운영 시간 변경
- 이벤트 및 프로모션
- 제휴 소식
- 매장 이용 안내 변경 사항

비공식 경로에서 확인한 정보는 실제 운영 상황과 다를 수 있으므로, 최신 정보는 공식 채널을 기준으로 확인해 주세요.

## 제휴 운영 정책
오로라 카페는 브랜드 이미지와 고객 경험에 부합하는 경우에 한해 제휴를 검토할 수 있습니다.

제휴 가능 항목은 다음과 같습니다.

- 지역 브랜드와의 공동 이벤트
- 디저트, 원두, 굿즈 관련 협업
- 문화 행사, 전시, 북클럽 등 공간 분위기와 어울리는 협업
- 기업 및 단체 대상 소규모 프로모션
- 멤버십, 쿠폰, 예약 서비스 관련 제휴

단, 카페의 조용하고 편안한 분위기를 해칠 수 있는 제휴는 진행하지 않을 수 있습니다.

## 제휴 문의 안내
제휴 문의는 공식 문의 채널을 통해 접수하는 것을 원칙으로 합니다.

제휴 문의 시 아래 정보를 함께 전달하면 검토에 도움이 됩니다.

- 제휴 제안자 또는 단체명
- 제휴 목적
- 제휴 형태
- 진행 희망 기간
- 예상 참여 대상
- 오로라 카페와의 적합성
- 참고 자료 또는 제안서

제휴 가능 여부와 세부 조건은 내부 검토 후 결정됩니다.
모든 제휴 제안이 진행되는 것은 아니며, 브랜드 방향성과 운영 상황에 따라 거절될 수 있습니다.

## 브랜드 자산 사용 안내
오로라 카페의 상호, 로고, 메뉴명, 사진, 소개 문구 등 브랜드 자산은 사전 동의 없이 사용할 수 없습니다.

브랜드 자산 사용이 필요한 경우에는 반드시 공식 문의 채널을 통해 사전 승인을 받아야 합니다.

승인 없이 다음 행위를 하는 것은 제한됩니다.

- 로고 또는 상호를 임의로 사용하는 행위
- 오로라 카페와 공식 제휴 관계인 것처럼 표현하는 행위
- 메뉴 사진이나 매장 이미지를 상업적으로 사용하는 행위
- 브랜드 이미지를 왜곡하거나 오해를 줄 수 있는 방식으로 홍보하는 행위

## 콘텐츠 및 홍보 협업 기준
오로라 카페는 매장 분위기와 브랜드 방향에 맞는 콘텐츠 협업을 검토할 수 있습니다.

협업 콘텐츠는 다음 기준을 따릅니다.

- 실제 방문 경험과 사실에 기반해야 합니다.
- 과장된 표현이나 허위 정보는 사용할 수 없습니다.
- 고객의 얼굴, 개인정보, 대화 내용이 노출되지 않도록 주의해야 합니다.
- 매장 운영에 방해가 되는 촬영이나 연출은 제한될 수 있습니다.
- 협찬 또는 제휴 콘텐츠인 경우, 관련 표시 기준을 준수해야 합니다.

## 브랜드 관련 외부 정보가 필요한 항목 예시
아래 항목은 내부 문서만으로 답변이 어려울 수 있습니다.

- 현재 진행 중인 제휴 가능 여부
- 특정 브랜드와의 제휴 확정 여부
- 로고 파일 제공 가능 여부
- 촬영 및 대관 가능 일정
- 제휴 제안 검토 결과
- 공식 SNS의 최신 이벤트 게시물 내용
- 외부 플랫폼에 등록된 브랜드 정보의 최신 상태
```

</div>
</details>

## 그래프 구축

### 1. 의존성

- 본 실습은 아래와 같은 의존성을 가짐

| 대상 | 버전 |
| --- | --- |
| python | 3.12 |
| langgraph | >=1.1.8 |
| langchain | >=1.2.15 |
| langchain-google-genai | >=4.2.2 |
| chromadb | >=1.5.8 |
| google-genai | >=1.73.1 |

### 2. 디렉터리 구조

```bash
/
├── config # 설정값
│    ├─ config.py
│    └─ secret.ini
├── documents # 규정 문서를 저장하는 디렉터리
│    ├─ cafe_menu.txt
│    ├─ store_policy.txt
│    ├─ reservation_event.txt
│    ├─ faq.txt
│    └─ brand_notice.txt
├── graph     # 랭그래프 코드 파일들
│    ├─ state.py
│    ├─ nodes.py
│    ├─ routers.py
│    └─ builder.py # 그래프 조립
├── llm       # llm 추론
│    ├─ chat_model.py
│    └─ embedding.py
├── retrieval # 검색 
│    ├─ __init__.py
│    ├─ ingest.py # 최초 1회 벡터스토어 생성 및 문서 저장
│    └─ vectorstore.py  # 벡터스토어와 인터페이스
├── prompts   # LLM 애플리케이션에 사용되는 프롬프트 파일들
├── vector_store # 임베딩된 내용 저장  
└── main.py   # 서비스 진입점
```

### 3. Vector DB 구축

- documents 디렉터리에 위치한 카페 규정 문서를 임베딩하고, Vector DB에 저장한다.
- 이를 위해 google 의 gemini embedding 모델을 이용해 문서를 임베딩하고 `Chroma` 를 이용해 Vector DB 를 구축한다.  
- `Chroma` 에 대한 자세한 내용은 [이전 포스팅](https://whdrns2013.github.io/vector_db/20260425_001_chroma/) 을 참고

```python
# 함수 선언 부
import chromadb
from google import genai
import os

# 규정문서 로딩
def read_documents(document_dir_path:str):
    documents = []
    for file in os.listdir(document_dir_path):
        file_path = os.path.join(document_dir_path, file)
        with open(file_path, "r", encoding="utf-8") as f:
            documents.append(f.read())
    return documents

# 벡터스토어 로딩
def get_chroma_collection(dir_path:str,
                          collection_name:str):
    client = chromadb.PersistentClient(path = dir_path)
    collection = client.get_or_create_collection(collection_name)
    return collection

# google 임베딩
def embedding(text:str, api_key:str):
    client = genai.Client(api_key = api_key)
    result = client.models.embed_content(
            model="gemini-embedding-2",
            contents=text
    )
    return result.embeddings[0].values

# 문서 저장
def upsert_document(collection:chromadb.Collection,
                    ids:list[str],
                    documents:list[str],
                    embeddings:list[list[float]]|None=None,
                    metadatas:list|None=None):
    parameters = {"ids":ids, "documents":documents}
    if embeddings is not None:
        parameters.update({"embeddings":embeddings})
    if metadatas is not None:
        parameters.update({"metadatas":metadatas})
    collection.upsert(**parameters)
    return collection
```

```python
# 실행 부

# (1) 문서 로딩
document_dir = "documents"
documents = read_documents(document_dir)

# (2) 임베딩
embeddings = [embedding(api_key = "MYAPIKEY..", text = doc) for doc in documents]

# (3) 벡터 DB 생성
vector_db_dir_path = "vector_store"
collection_name = "aurora_cafe_vector_db"
collection = get_chroma_collection(dir_path=vector_db_dir_path,
                                   collection_name=collection_name)
                                   
# (4) 데이터 업데이트
collection = upsert_document(collection = collection,
                             ids = [f"id_{i}" for i in range(len(documents))],
                             documents = documents,
                             embeddings = embeddings)

# (5) 문서 확인
print(collection.peek())
```

### 4. Vector DB에서 문서 검색

- RAG 서비스를 구축하기 위해 Vector DB에서 유사도 기반의 문서 검색 기능을 구현한다.
- 동일하게 `Chroma` 와 `gemini embedding` 모델을 이용한다.

```python
# 함수 선언 부

# 문서 검색
def retrieve(collection:chromadb.Collection,
             query_texts:list[str]|None=None,
             query_embeddings:list[list[float]]|None=None,
             num_result:int=10):
    if query_texts is not None:
        result = collection.query(query_texts=query_texts, n_results=num_result)
    elif query_embeddings is not None:
        result = collection.query(query_embeddings=query_embeddings, n_results=num_result)
    else:
        raise ValueError("필요한 값이 입력되지 않았습니다.")
    return result["documents"][0][0]
```

```python
# 실행 부

# 컬렉션 로딩
vector_db_dir_path = "vector_store"
collection_name = "aurora_cafe_vector_db"
collection = get_chroma_collection(dir_path=vector_db_dir_path,
                                   collection_name=collection_name)
                                   
# 질문 임베딩
query = "이 카페의 운영시간은 언제까지인가요?"
query_embedding = embedding(api_key="MYAPI..", text=query)

# 질문 수행
result = retrieve(collection=collection,
                  query_embeddings=query_embedding,
                  num_result=1)

# 질문 의도와 가장 비슷한 문서 출력
print(result)
```

```
# >>>>>> 검색결과 >>>>>> #

# 오로라 카페 매장 이용 안내

## 기본 정보
- 매장명: 오로라 카페
- 영업시간: 매일 10:00 ~ 22:00
- 라스트오더: 21:30
- 정기휴무: 없음

## 좌석 및 이용 시간
- 총 좌석 수: 42석
- 1인석: 10석
- 2인석: 12석
...
```

### 5. 검색된 문서를 기반으로 LLM 답변

- 사용자의 질문과 검색된 문서를 참고하여 LLM이 답변하도록 함
- 이를 위한 시스템 프롬프트 추가

```python
from langchain_google_genai import ChatGoogleGenerativeAI
import os

# 모델 로딩
def load_model(api_key:str|None="MYAPIKEY...", model_name:str|None="gemini-2.5-flash-lite"):
    os.environ["GOOGLE_API_KEY"] = api_key
    model = ChatGoogleGenerativeAI(model=model_name)
    return model
```

```python
# 프롬프트 생성
from langchain_core.prompts import PromptTemplate
system_prompt = """
    ◻Reference 문서들을 참고하여 ◻UserPrompt에 대해 답변하시오.\n\n 
    ◻Reference\n
    {reference}
    \n\n
    ◻UserPrompt\n
    {user_prompt}
    """
prompt = PromptTemplate.from_template(system_prompt)

# 파서
from langchain_core.output_parsers import StrOutputParser
parser = StrOutputParser()

# chain 생성
chain = prompt | load_model() | parser

# llm 답변
result = chain.invoke({"reference":result, "user_prompt":query})

# 답변 출력
print(result)
```

```
# >>>>>> 답변 >>>>>> #
'오로라 카페의 운영시간은 **매일 10:00부터 22:00까지**입니다.\n\n라스트 오더는 **21:30**까지이며, 정기 휴무일은 없습니다.'
```

### 5. 그래프 구축

- 앞서 설계하고 개발한 내용들을 토대로 랭그래프 구축

```python
# State
from typing import TypedDict, Annotated
from enum import Enum

class Intent(str, Enum):
    cafe:str = "cafe"
    other:str = "other"

class CafeState(TypedDict):
    query: Annotated[str, "사용자의 질문 텍스트"]
    intent: Annotated[Intent, "사용자의 질문 의도"]
    intent_reason: Annotated[str, "질문 의도 분류 이유"]
    document : Annotated[str, "질문에 답변하기 위한 참고자료 텍스트"]
    response : Annotated[str, "질문에 대한 답변 텍스트"]
```

```python
# Nodes
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

def intent_classify_node(state:CafeState):
    system_prompt = """
    당신은 사용자의 질문이 "카페에 대한 질문"인지 "그 외의 질문"인지 분류하는 역할을 합니다.
    ◻분류기준을 참고하여 질문의 의도를 분류한 뒤, ◻출력형식에 맞춰 답변하세요.
    ◻분류기준
    1. 사용자의 질문이 카페, 커피, 음료, 디저트, 메뉴, 매장, 좌석, 영업시간, 위치, 예약, 주문, 가격, 분위기, 콘센트, 와이파이, 주차, 반려동물 동반, 테이크아웃, 배달, 이벤트, 쿠폰, 멤버십 등 카페 이용과 직접 관련되어 있으면 "cafe"로 분류합니다.
    2. 사용자의 질문이 카페와 무관한 일반 지식, 코딩, 수학, 번역, 날씨, 정치, 뉴스, 의료, 법률, 금융, 개인 상담, 잡담, 창작 요청 등이라면 "other"로 분류합니다.
    \n
    ◻출력형식
    출력 형식은 반드시 아래 JSON만 사용합니다.
    \{\{
        "intent": "cafe" | "other",
        "reason": "분류 이유를 한 문장으로 설명"
    \}\}
    \n
    ◻U사용자 질문\n
    {query}
    """
    prompt = PromptTemplate.from_template(system_prompt)
    chain = prompt | load_model() | JsonOutputParser()
    response = chain.invoke({"query":state["query"]})
    return {"intent":response["intent"], "intent_reason":response["reason"]}

def retrieve_node(state:CafeState):
    query_embedding = embedding(api_key="MYAPIKEY...", text=state["query"])
    result = retrieve(collection=collection, query_embeddings=query_embedding)
    return {"document":result}

def llm_node(state:CafeState):
    system_prompt = """
    당신은 카페의 규정, 운영 안내, 소개 자료를 바탕으로 사용자의 질문에 답변하는 카페 안내 상담원입니다.
    당신의 목표는 사용자가 제공한 질문에 대해, 함께 전달되는 ◻참고자료만 근거로 정확하고 친절하게 ◻출력형식에 맞춰 답변하는 것입니다.
    ◻참고자료
    {reference}
    ◻출력형식
    출력 형식은 반드시 아래 JSON만 사용합니다.
    \{\{
        "response": "사용자 질문에 대한 답변"
    \}\}
    ◻사용자 질문
    {query}
    """
    prompt = PromptTemplate.from_template(system_prompt)
    chain = prompt | load_model() | JsonOutputParser()
    response = chain.invoke({"query":state["query"], "reference":state["document"]})
    # response = chain.stream({"query":state["query"], "reference":state["document"]})
    return {"response":response["response"]}

def fallback_node(state:CafeState):
    return {"response":"카페 이용 및 브랜드 관련 문의만 가능합니다. 다시 질문해주시기 바랍니다."}

def output_node(state:CafeState):
    return {"response" : state["response"]}
```

```python
# build
from langgraph.graph import StateGraph, START, END

graph = StateGraph(CafeState)

graph.add_node("intent", intent_classify_node)
graph.add_node("retrieve", retrieve_node)
graph.add_node("llm", llm_node)
graph.add_node("fallback", fallback_node)
graph.add_node("output", output_node)

graph.add_edge(START, "intent")
graph.add_conditional_edges("intent", lambda x:x["intent"], {"cafe":"retrieve", "other":"fallback"})
graph.add_edge("retrieve", "llm")
graph.add_edge("llm", "output")
graph.add_edge("fallback", "output")
graph.add_edge("output", END)

app = graph.compile()
```

### 6. 그래프 실행

- 카페와 관련된 질문

```python
for step in app.stream({"query" : "카페의 대표 메뉴를 소개해주세요."}):
    print(step)
```

```bash
{'intent': {'intent': 'cafe', 'intent_reason': '카페의 대표 메뉴에 대한 질문으로 카페 이용과 직접 관련되어 있습니다.'}}
{'retrieve': {'document': '# 오로라 카페 메뉴 안내\n\n## 커피\n\n### 에스프레소...'}}
{'llm': {'response': '저희 오로라 카페의 대표 메뉴로는 에스프레소, 아메리카노, 카페라떼, 바닐라라떼, 카푸치노와 같은 커피 메뉴와 오로라 크림 라떼, 솔티드 카라멜 라떼, 제주 말차 라떼, 흑임자 크림 커피와 같은 시그니처 음료가 있습니다. 또한, 얼그레이 티, 캐모마일 티, 제주 감귤차, 초콜릿 라떼, 딸기 우유 등 다양한 티와 논커피 메뉴도 준비되어 있습니다. 에이드와 주스 종류로는 레몬 에이드, 자몽 에이드, 청포도 에이드, 오렌지 주스가 있으며, 디저트로는 플레인 스콘, 초코 스콘, 크루아상, 치즈케이크, 티라미수, 말차 갸또가 있습니다. 특별히 아메리카노와 플레인 스콘 세트(7,800원), 카페라떼와 크루아상 세트(8,500원)도 준비되어 있으니 많은 이용 부탁드립니다.'}}
{'output': {'response': '저희 오로라 카페의 대표 메뉴로는 에스프레소, 아메리카노, 카페라떼, 바닐라라떼, 카푸치노와 같은 커피 메뉴와 오로라 크림 라떼, 솔티드 카라멜 라떼, 제주 말차 라떼, 흑임자 크림 커피와 같은 시그니처 음료가 있습니다. 또한, 얼그레이 티, 캐모마일 티, 제주 감귤차, 초콜릿 라떼, 딸기 우유 등 다양한 티와 논커피 메뉴도 준비되어 있습니다. 에이드와 주스 종류로는 레몬 에이드, 자몽 에이드, 청포도 에이드, 오렌지 주스가 있으며, 디저트로는 플레인 스콘, 초코 스콘, 크루아상, 치즈케이크, 티라미수, 말차 갸또가 있습니다. 특별히 아메리카노와 플레인 스콘 세트(7,800원), 카페라떼와 크루아상 세트(8,500원)도 준비되어 있으니 많은 이용 부탁드립니다.'}}
```

<br>

- 카페와 관련 없는 질문

```bash
for step in app.stream({"query" : "근처 공원이 있나요?"}):
    print(step)
```

```bash
{'intent': {'intent': 'other', 'intent_reason': "사용자의 질문은 카페 이용과 직접적인 관련이 없는 일반적인 정보에 대한 문의이므로 'other'로 분류됩니다."}}
{'fallback': {'response': '카페 이용 및 브랜드 관련 문의만 가능합니다. 다시 질문해주시기 바랍니다.'}}
{'output': {'response': '카페 이용 및 브랜드 관련 문의만 가능합니다. 다시 질문해주시기 바랍니다.'}}
```