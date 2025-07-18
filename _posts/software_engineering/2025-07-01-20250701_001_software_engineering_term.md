---
title: "[소프트웨어 공학] 용어 정리" # 제목 (필수)
excerpt: 시스템, 소프트웨어 설계와 관련된 용어 정리 # 서브 타이틀이자 meta description (필수)
date: 2025-07-01 11:30:00 +0900      # 작성일 (필수)
lastmod: 2025-07-01 11:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-07-01 11:30:00 +0900   # 최종 수정일 (필수)
categories: software_engineering        # 다수 카테고리에 포함 가능 (필수)
tags: 소프트웨어 공학 소프트웨어공학 용어 컴포넌트 모듈 클래스 아키텍처 시스템 펑션포인트 프로세스 워크플로우 서브시스템 인터페이스                     # 태그 복수개 가능 (필수)
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
<!--postNo: 20250701_001-->


<span class="ttag">#컴포넌트</span> <span class="ttag">#모듈</span> <span class="ttag">#클래스</span> <span class="ttag">#아키텍처</span> <span class="ttag">#시스템</span> <span class="ttag">#펑션포인트</span> <span class="ttag">#프로세스</span> <span class="ttag">#워크플로우</span> <span class="ttag">#서브시스템</span> <span class="ttag">#인터페이스</span>



## 용어 리스트  

### 시스템을 구성하는 구성 요소  

| 용어   | 설명     |
| ----- | ------ |
| `시스템`<br>System            | ✅ 정의<br>**> 특정 목표를 달성하기 위해 상호작용하는 모든 유무형 요소들의 총체적인 집합**<br>- 특정한 목적을 위해 상호작용하는 요소들의 집합<br>- **하드웨어, 소프트웨어, 사람 등**을 포함하는 광범위한 의미를 가짐.<br><br>✅ 예시<br>-  온라인 쇼핑몰 전체 시스템.<br>- 은행 업무 처리 시스템.<br>- 병원 관리 시스템.|
| `서브시스템`<br>Subsystem       | ✅ 정의<br>**> 시스템을 논리적으로 분할한, 독립적인 기능을 수행하는 자율적인 하위 시스템.**<br>- **자체적으로도 하나의 시스템처럼 동작 가능**해야 한다.<br>- 복잡한 시스템을 (관리가 가능한) 하위 단위로 나눈 것을 의미<br>- 기능이나 책임에 따라 나눈다.<br>- 시스템의 크기와 구조에 따라 서브시스템은 있을 수도, 없을 수도 있다.<br><br>✅ 예시<br>- 상품 관리 서브시스템 : 상품 등록, 수정, 삭제<br>- 주문 관리 서브시스템 : 주문 접수, 처리, 취소<br>- 고객 관리 서브시스템 : 회원 가입, 정보 수정, 탈퇴<br>- 결제 서브시스템 : 결제 처리, 환불  |
| `컴포넌트`<br>Component        | ✅ 정의<br>**> 독립적으로 배포될 수 있는, 재사용 가능한 소프트웨어의 단위**<br>- (1) 소프트웨어의 **독립적인 배포 단위**<br>- (2) 명확한 **인터페이스를 통해 접근할 수 있는 기능을 제공**해야 함.<br>- (3) 다른 페이지나 기능에서도 **재사용이 가능해야** 함<br>- (4) 내부 구현은 **캡슐화**되어있음.<br>- 모듈에 비해 **배포나 교체 단위**로 강조되는 용어<br>- **독립적**이어야 하므로, 다른 컴포넌트에 의존하면 안된다.<br>- 인터페이스를 통해 컴포넌트 간 통신을 수행한다.<br>- 서브시스템이 존재한다면, 컴포넌트는 서브시스템을 구성하는 단위다.<br>- 독립적으로 배포할 수 있는 가장 작은 단위<br><br>✅ 예시<br>- 장바구니 컴포넌트 : 상품 추가/삭제, 수량 조절 기능<br>- 추천 상품 컴포넌트 : 사용자 구매 이력 기반 추천 기능<br>- 로그인 컴포넌트 : 사용자 인증 처리 기능<br>- 상품 검색 컴포넌트 : 키워드 검색, 필터링 기능 등 |
| `모듈`<br>Module             | ✅ 정의<br>**> 특정 기능이나 데이터의 집합을 논리적으로 묶어 캡슐화한 논리적인 단위**<br>- 주로 개발자가 코드 정리/관리를 위해 특정 기능, 데이터를 논리적으로 묶은 것<br>- **특정 기능을 수행하는 코드의 묶음**<br>- 재사용 가능하고, 다른 모듈과 **느슨하게 결합**되도록 설계<br>- **하나의 컴포넌트가 여러 모듈로 구성될 수** 있음<br>- 컴포넌트보다 더 일반적인 용어로 사용될 수 있음<br>- 컴포넌트에 비해서 모듈은 **코드 조직화에 더 중점**을 둔다.<br><br>✅ 예시<br>- 가격 계산 모듈 : 상품 가격 할인율 적용, 배송비 계산<br>- 재고 확인 모듈 : 특정 상품의 현재 재고 수량 확인<br>- 문자 일림 모듈 : 특정 정보를 문자로 발송                                                                                            |
| `클래스`<br>Class             | ✅ 정의<br>**> 데이터(속성)와 그 데이터를 조작하는 함수(메서드)를 함께 정의한 청사진**<br>- 객체 지향 프로그래밍에서 사용되며, 객체 생성을 위한 틀을 제공한다.<br>- 가장 낮은 수준의 구현 단위이다.<br><br>✅ 예시<br>- Product 클래스 : 상품명, 가격, 재고, 이미지 등의 속성<br>- User 클래스 : 사용자 ID, 비밀번호, 주소 등 속성<br>- Order 클래스 : 주문 번호, 주문 날짜, 주문 상품 목록 등 속성    |

- 모듈과 컴포넌트는 명확하게 상하위의 개념은 아니지만, 굳이 따지자면 컴포넌트가 모듈의 상위 개념이다.  


### 구조의 기타 항목  

- 이 항목들은 추후에 다시 체계를 잡는다.  

| 용어   | 설명  |
| ------ | ------- |
| `아키텍처` <br>Architecture     | ✅ 정의<br>**> 시스템의 대략적인 구조와, 구성 요소 및 그들 간의 관계. 뼈대, 청사진**<br>- 시스템의 전체적인 구조와 구성 요소들 간의 관계를 정의한 청사진<br>- 시스템의 구성 요소와 이들 간의 관계를 정의하는 아키텍처 설계의 결과물<br>- 시스템을 구성하는 여러 개의 **컴포넌트(혹은 서브시스템들) 간의 관계 표현**    |
| `인터페이스`<br>Interface       | ✅ 정의<br>**> 두 개 이상의 구성 요소 간의 상호작용을 위한 접점, 그리고 규약을 이르는 말**<br>- 구성 요소 : 시스템, 서브시스템, 모듈, 클래스 ..<br>- 아래 사항들이 명세되어야 한다.<br>- (1) **어떤 기능**이 제공되는지<br>- (2) 해당 **기능을 어떻게 호출**하는지<br>- 또한, 인터페이스를 통해 **내부 구현을 몰라도 해당 기능을 사용할 수 있어야** 함<br><br>✅ 예시<br>- REST API : 쇼핑몰의 결제 서브시스템이  외부 PG사 시스템과 연동하는 API<br>- 장바구니 컴포넌트의 `addItem(prodId, quantity)` 메서드 호출 규약<br>- Java의 List 인터페이스: 사용처는 다르지만, "규약"이라는 점에서 동일한 의미<br>- 메서드 시그니처 : 메서드의 이름과 매개변수 목록으로 구성된 고유 식별 정보 |
| `펑션 포인트`<br>Function Point | ✅ 정의<br>**> 소프트웨어의 기능적 크기를 측정하는 단위.**<br>- 기능의 수와 복잡도에 기반함<br>- 프로젝트 견적 산정, 생산성 측정에 사용됨<br>- 구성 요소 : 입력, 출력, 질의, 내부 파일, 외부 인터페이스 등<br><br>✅ 예시<br>- 회원가입 기능, 주문 내역 조회 기능, 주문 완료 메일 발송 기능 ..   |

### 업무 수행 방식, 작동 방식과 관련된 용어  

- 일반적 정의  

| 용어   | 설명  |
| ----------------- | --------- |
| `프로세스` <br>Process  | ✅ 정의<br>**> 특정 목표를 달성하기 위해 수행되는 일련의 상호 연관된 활동들의 집합**<br>- (1) 무엇을 할 것인가<br>- (2) 어떻게 할 것인가<br>- 전체적인 흐름과 단계를 정의하며<br>- 일반적으로 시작과 끝이 명확하다.<br>- 입력(Input) 을 받고, 출력(Output)을 생성하는 변환 과정을 포함한다.<br><br>✅ 특징<br>- 목표 지향적 : 특정 목표, 결과물 산출에 중점<br>- 입-출력 : 정해진 입력을 받아 처리하며, 정해진 출력을 만들어낸다.<br>- 재현 가능성 : 반복 수행될 수 있고, 동일 조건에서는 동일 결과를 기대할 수 있음<br>- 광범위한 적용 : 부서, 개인 업무 뿐 아니라, 조직 전체, 시스템 간 상호작용 등<br><br>✅ 예시<br>- 제품 개발 프로세스 : 아이디어 구상 > 시장 조사 > 설계 > 개발 > 테스트 > 출시<br>- 고객 주문 처리 프로세스 : 재고 확인 > 결제 처리 > 상품 포장 > 배송 > 완료 |
| `워크플로우` <br>Workflow | ✅ 정의<br>**> 특정 프로세스 내에서 작업이 수행되고 진행되는 논리적 순서와 흐름**<br>- 작업 간 종속성, 담당자, 승인 절차 등 **작업의 흐름과 조율에 중점**<br>- (1) 누가<br>- (2) 어떤 작업을<br>- (3) 어떻게 수행하고 다음 단계로 넘길 것인지<br>- 와 같은 세부적인 작업의 흐름을 시각적으로 표현<br><br>✅ 특징<br>- 작업의 순서 : 작업 간의 선후 관계, 병렬 처리, 분기 등을 명시<br>- 담당자 지정 : 각 작업의 책임자나 부서를 명확히 함<br>- 진행 상태 관리 : 각 작업이 현재 어떤 상태에 있는지 추적<br>- 자동화 가능성 : 반복적, 정형화된 워크플로우는 자동화될 수 있음<br>- 세부적 : 프로세스보다는 더 세부적이고 구체적인 작업 단위의 흐름을 다룸<br><br>✅ 예시<br>- 온라인 쇼핑몰 주문 처리 워크플로우<br>1) 고객 주문 접수 (시스템 자동)<br>2) 재고 시스템 연동 (자동) → 재고 부족 시 고객에게 알림, 주문 취소 요청<br>3) 결제 시스템 연동 (자동) → 결제 실패 시 고객에게 알림, 재시도 요청<br>4) 결제 성공 시 창고에 출고 지시 (자동)<br>5) 창고 담당자 상품 피킹 및 포장 (수동)<br>6) 택배사에 배송 정보 전달 및 송장 출력 (자동)<br>7) 배송 시작 알림 발송 (자동) |

- 소프트웨어 관점에서의 정의  

| 용어                | 설명    |
| ----------------- | --------- |
| `프로세스` <br>Process  | ✅ 정의<br>**> 앞서 설명된 비즈니스 프로세스가 소프트웨어 시스템으로 구현된 논리적 흐름**<br>- 비즈니스 목표 달성을 위해 시스템 내 일련의 기능적 활동들의 나열<br>- 그리고  이 기능적 활동들의 순차적 또는 병렬적으로 실행되는 논리적 흐름<br>- 종종 여러 컴포넌트, 모듈 또는 서비스 간의 상호작용으로 구현됨<br><br>✅ 예시<br>- 온라인 결제 프로세스<br>1) 사용자 결제 요청<br>2) 재고 확인 서비스 호출<br>3) 결제 승인 서비스 호출<br>4) 주문 상태 업데이트 서비스 호출<br>5) 배송 정보 전송 서비스 호출 |
| `워크플로우` <br>Workflow | ✅ 정의<br>**> 비즈니스 프로세스의 단계를 자동화, 관리하기 위한 기술적 구현과 관련된 흐름**<br>1) 시스템 내에서 특정 작업들이 어떤 순서와 조건에 따라 실행되는지<br>2) 어떤 엔티티(사용자나 컴포넌트)에 의해 처리되는지 정의하고 제어하는<br>- 자동화된 흐름<br><br>✅ 예시<br>- CI/CD 파이프라인 : 개발자가 코드를 커밋 > 자동으로 빌드 > 테스트 > 배포 |
