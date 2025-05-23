---
title: 데이터베이스 시스템의 이해 # 제목 (필수)
excerpt: 데이터와 데이터베이스, 데이터베이스 시스템과 데이터베이스 관리 시스템. 그 기초에 대해 알아보자. # 서브 타이틀이자 meta description (필수)
date: 2024-12-22 23:40:00 +0900      # 작성일 (필수)
lastmod: 2024-12-22 23:40:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-12-22 23:40:00 +0900   # 최종 수정일 (필수)
categories: database_system       # 다수 카테고리에 포함 가능 (필수)
tags: database 데이터베이스 dbms 관리 시스템 데이터베이스관리시스템 데이버테이스시스템 management system 스키마 내부 개념 외부 단계 물리적 데이터 종속 논리적 파일처리시스템 파일 처리 시스템 일관성 보안성 경제성 무결성 동시 접근 사상 mapping 아키텍처 중앙 집중식 중앙집중식 클라이언트 서버 클라이언트-서버   # 태그 복수개 가능 (필수)
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
<!--postNo: 20241211_002-->


## 데이터베이스  

### 데이터베이스의 등장  

데이터베이스가 무언지 알아보기 전에, 데이터베이스의 등장 배경부터 살펴보자. 데이터베이스의 등장 배경에는 바로 `"많은 데이터의 발생"` 이 있다. 현대 사회에서는 전통적으로 발생하던 업무와 관련된 데이터에 더해, 스마트폰이나 IoT 기술의 등장, 인터넷 발달로 인해 수많은 데이터가 생성되고 있다.  

이렇게 많은 데이터가 발생하면서 자연스럽게 데이터를 효율적이고 문제 없게 관리하는 방법의 필요성이 부각되었다. 수많은 데이터 중에서 원하는 정보를 신속하고 정확하게 찾고, 데이터의 완전함과 무결함을 유지하는 방법이 필요했고, 이러한 필요에 의해 데이터베이스가 등장하게 되었다.  

### 데이터베이스, 데이터베이스 관리 시스템, 데이터베이스 시스템  

|용어|영문|설명|
|---|---|---|
|`데이터베이스`|database|데이터를 구조화하여 체계적으로 저장한 데이터의 집합. 데이터의 효율적인 저장, 검색 및 관리를 위해 사용됨.|
|`데이터베이스 관리 시스템`|database management system|DBMS. 데이터베이스(데이터의 집합)을 다수의 사용자가 공용으로 문제없이 사용하기 위한 통합 관리 패키지. 데이터베이스를 생성, 관리, 조작하기 위한 소프트웨어.|
|`데이터베이스 시스템`|database system|데이터베이스 + DBMS + 이들에 더해 응용프로그램이나 애플리케이션을 포함하는 전체 시스템.|

![](/assets/images/20241211_002_001.png)  




## 데이터 관리의 역사  

### 데이터 관리의 역사  

![](/assets/images/20241211_002_002.png)  

### 파일 처리 시스템  

데이터베이스 관리 시스템이 등장하기 전, 전통적인 데이터 관리 방식은 바로 `파일 처리 시스템` 이었다. 파일 처리 시스템은 업무처리에 사용되는 데이터를 여러 파일들에 저장하고 운영하는 시스템을 의미한다.  

파일 처리 시스템이 데이터 관리의 주류이던 때엔 각 업무에 해당하는 각 애플리케이션마다 각각의 데이터 파일을 가지고 운용을 하였다. 예를 들어 학교의 경우 학적관리 업무에 해당하는 파일, 성적처리 업무에 해당하는 파일, 수강관리 업무에 해당하는 파일을 각각 유지하면서 데이터를 처리하였다.  

### 파일 처리 시스템의 한계   

이러한 파일 처리 시스템은 하에서는 그 특징상 아래와 같은 4가지 문제가 발생하였고, 이에 따라 업무상에 문제가 일어나거나, 업무를 처리하는 애플리케이션 프로그램을 유지보수하는 데 많은 비용이 발생하는 원인을 제공하기도 했다.  

|발생 가능한 문제|설명|
|---|---|
|데이터 종속 문제|데이터가 데이터 외부의 상황에 종속되어 발생하는 문제들<br>`물리적 데이터 종속`<br>- 데이터가 하드웨어에 종속됨.<br>- 디스크의 교체 등 하드웨어 변경사항에 대해 영향을 받음<br>`논리적 데이터 종속`<br>- 데이터가 업무 혹은 데이터의 논리적 구조에 종속됨<br>- 데이터 구조의 변경, 업무 프로세스 변경시 데이터 수정 작업 발생|
|데이터 중복 문제|동일한 데이터가 여러 위치에 존재함으로써 발생하는 문제들.<br>`일관성 문제`<br>동일 데이터가 여러 위치에 중복으로 저장된 경우,<br>모든 위치의 데이터 값이 동일하다(=업데이트 되었다)는 것을 보장 못함.<br>`보안성 문제`<br>동일 데이터는 동일 보안 수준을 갖춰야 하나<br>파일이 분산되어있을 경우 동일 수준의 보안 유지가 어려움.<br>`경제성 문제`<br>중복 저장을 위해서는 추가적인 저장 공간이 필요함.|
|무결성 훼손 문제|`무결성 문제` : 데이터의 정확성, 제약조건을 만족하는가<br>- 중복된 데이터가 서로 일치하지 않는 문제<br>- 부정확한 데이터의 저장 문제<br>- 현실세계에 있는 제약 조건(최대 수강신청 학점수 등) 반영 불가|
|동시 접근의 문제|`동시 접근의 문제` : 동일 데이터를 동시에 수정할 때 발생하는 문제<br>다양한 현상의 비정상적인 수정이 일어날 수 있다.<br>일부 수정 내역이 적용되지 않거나, 수정의 선후가 바뀌거나 하는 등|

### 데이터베이스 관리 시스템  

전통적인 데이터 관리 방식인 파일 처리 시스템에서 발생하는 데이터 관리 측면에서의 문제가 발생하지 않도록, 데이터베이스 관리 시스템(DBMS)는 새로운 기능과 장치를 제공한다.  

DBMS는 프로그램과 데이터 사이, 혹은 사용자와 데이터 사이를 중재하는 에이전트 역할을 하면서, 사용자가 직접 데이터에 접근할 수 없고 `자신을 통해서만 데이터에 접근할 수 있게` 하여 여러 가지 문제를 방지한다. 관련된 자세한 내용은 다음 섹션에서 살펴보자.  

## 데이터베이스 관리 시스템  

### 데이터베이스 관리 시스템 사용의 의미  

데이터베이스 관리 시스템(이하 DBMS)은 사용자(혹은 프로그램)와 데이터 사이에서 중재자 역할을 하며, `데이터에 직접 접근할 수 있는 권한을 오직 DBMS로 한정`한다. 이를 통해 사용자나 프로그램은 반드시 DBMS를 통해서만 데이터에 접근할 수 있다.  

이러한 구조 덕분에 DBMS는 `데이터의 독립성을 보장`하며, 파일 처리 시스템에서 발생했던 여러 문제를 효과적으로 방지할 수 있다. 또한, 데이터 관리의 효율성과 일관성을 높이는 다양한 기술적 지원을 제공한다. 이러한 특징은 DBMS를 사용하는 주요 이유 중 하나로 꼽힌다.  

### 데이터베이스의 개념과 특징  

|특징|설명|
|---|---|
|`자기 기술성`|데이터 뿐 아니라, 데이터를 설명하는 데이터(메타데이터)도 함께 저장<br>메타데이터 : 데이터 구조, 제약 조건, 접근 권한 등<br>이러한 메타데이터는 시스템 카탈로그 또는 데이터 사전에 저장되어 관리된다.<br>self-describing|
|`데이터의 독립성 및 추상화`|데이터 파일이 프로그램(애플리케이션, 혹은 사용자)와 격리됨<br>오직 DBMS를 통해서만 데이터(데이터파일)에 접근 가능.<br>데이터에 대한 개념적인 표현을 통해 필요한 데이터에만 접근할 수 있도록 데이터에 대한 접근성을 향상시킨다.|
|`다중 뷰 제공`|사용자 혹은 프로그램마다 필요한 데이터는 달라진다.<br>이런 서로 다른 관점마다 필요한 데이터만을 추출해서 보여주는 뷰 기능이 제공된다.|
|`다수 사용자 요청 처리`|다수의 데이터 조작 요청에 대해 동시성 제어 기능을 통해 수행.<br>단일 작업을 수행하는 일련의 명령의 집합인 트랜잭션 동시성 제어 기법.<br>이를 통해 데이터의 일관성을 보장하면서 동시에 작업을 수행한다.|

### 데이터베이스 시스템의 구성  

![](/assets/images/20241211_002_003.png)  

앞서 데이터베이스 시스템에 대해 정의할 떄 `데이터베이스` + `DBMS` + `응용프로그램` 을 포함하는 전체 시스템임을 알아보았다. 위는 이를 도식화한 그림이다. 한 가지 눈여겨 볼 점은 바로 실제 저장되는 자료들이 무엇인가이다. 첫 번째로 실제 저장하려는 값이 저장되는 "저장된 데이터베이스" 공간이 있으며, 두 번째로는 이 저장된 데이터베이스의 값들을 설명하는 메타데이터가 있다.  


### DBMS의 3단계 구조  

데이터베이스 관리 시스템에서는 `일반 사용자가 데이터에 접근하는 것`과, 그 `데이터를 관리하는 과정`을 분리하여 시스템을 더 효율적이고 유연하게 설계할 수 있도록 했다. 또한 일반 사용자가 편리하게 사용할 수 있도록 저장된 데이터를 추상화하고, 내부의 복잡성을 감추도록 설계하여 사용의 편리성을 높였다. 이러한 데이터베이스 관리 시스템의 특징은 `DBMS의 3단계 구조` 로 잘 나타난다.  

![](/assets/images/20241211_002_004.png)  

|구조|설명|역할|담당자|
|---|---|---|---|
|`내부 단계`|- 데이터가 실제로 물리적으로 저장되는 방식과 관련된 단계<br>- 저장 구조, 데이터 압축, 인덱스, 파일 구조 등을 정의<br>- 내부 스키마로 기술된다.|- 데이터의 효율적인 저장<br>- 데이터 검색 성능 최적화|- 데이터베이스 관리자(DBA)<br>- 시스템 프로그래머|
|`개념 단계`|- 물리적인 상세사항을 배제한 데이터베이스의 전체 구조를 추상화하는 단계<br>- 데이터베이스에 무엇이 저장되는지와 데이터 간의 관계를 기술<br>- 데이터베이스의 모든 엔티티, 속성, 관계를 정의<br>- 개념 스키마(concept schema)를 통해 기술됨|- 전체 데이터베이스를 추상화<br>- 데이터 구조 이해하기 쉬워짐|- 데이터 설계자|
|`외부 단계`|- 각 사용자 혹은 애플리케이션이 데이터를 보는 방식을 정의<br>- 뷰(view)를 생성하여 사용자가 필요로 하는 데이터베이스의 일부분만을 기술한다.<br>- 그 외의 부분은 은폐하여 보이지 않게 한다.<br>- 이를 통해 사용자가 복잡한 시스템 지식 없이 시스템을 사용할 수 있도록 한다.<br>- 뷰 = 외부 스키마 이다.|- 사용자별 맞춤형 뷰 제공<br>- 이에 따른 보안 강화<br>- 이에 따른 편리성 강화|<br>- 일반 사용자<br>- 데이터 분석가|

말로만 설명하면 이해하기 어려울 수 있다. 이를 보완하기 위해 쇼핑몰을 운영하는 회사가 고객의 주문과 관련된 다양한 데이터를 처리하는 과정을 비유적인 예시로 들어 살펴보자.  

|단계|예시|
|---|---|
|데이터 설명|- 쇼핑몰에서는 상품 정보, 입출고 정보, 고객 정보, 주문 정보, 배송 정보 등을 데이터로 관리한다.<br>|
|1단계|- 고객 정보를 하디 디스크의 어떤 섹터에 저장할지 결정<br>- 그 외 상품, 재고, 주문, 배송 정보 등의 데이터 저장 위치를 결정<br>- 인덱스를 사용해서 검색을 빠르게 처리하는 방법 결정|
|2단계|- 상품 정보를 담고 있는 상품 정보 테이블을 구성한다.<br>상품 정보 테이블에는 상품번호, 상품명, 생산자, 상품기술, 상품이미지 데이터가 포함된다.<br>- 그 외로 재고 정보, 고객 정보, 주문 정보, 배송 정보 테이블을 구성한다.<br>- 또한 테이블간의 관계, 예를 들어 고객과 주문 정보는 1:N의 관계를 가진다라는 것 등을 결정|
|3단계|- 쇼핑몰의 각 직원들에게 필요한 데이터뷰를 생성한다.<br>- 예를 들어 재고관리 담당자는 상품 정보와 입출고 정보를 결합한 뷰를 받는다.<br>- 쇼핑몰의 주문조회 애플리케이션은 상품, 주문, 배송 정보를 결합한 뷰를 받는다.|

![](/assets/images/20241211_002_005.png)  

각각의 외부, 개념, 내부 단계라고 이름이 붙여진 이유는 데이터베이스 설계와 사용 과정에서의 역할과 위치를 반영하는 네이밍이기 때문이다.  

(1) 외부 단계 : "외부" 는 데이터베이스 설계 외부의 사용자, 애플리케이션의 관점을 의미한다.  
(2) 개념 단계 : "개념" 은 데이터베이스의 논리적인 설계, 추상화를 의미하는 단어이다.   
(3) 내부 단계 : "내부" 는 데이터베이스 내부에 실제로 데이터가 저장되고 처리되는 방식을 다룬다는 뜻으로 사용된다.   

### 사상  

사상(mapping)이란 원래 수학에서 한 집합의 원소를 다른 집합의 원소에 대응시키는 규칙을 의미한다. 데이터베이스 시스템에서도 비슷한 의미를 가진다. 내부 스키마, 개념 스키마, 외부 스키마로 대표되는 `내부 단계, 개념 단계, 외부 단계`에 각각 속하는 구성 항목들을 `다른 단계의 구성 항목과 대응시키는 규칙`을 의미한다.  

DBMS 에서는 두 개의 사상(규칙)이 있다. 외부 단계와 개념 단계를 연결하는 `외부 - 개념 사상`, 개념 단계와 내부 단계를 연결하는 `개념 - 내부 사상`이 그 두 가지이다.  

|종류|설명|
|---|---|
|`외부-개념 사상`|- 외부 스키마(뷰) 와 개념 스키마 간의 대응 관계<br>- 개념 스키마에 변화가 생기더라도 외부-개념 사상에 반영시키면 외부 스키마에 아무런 영향도 미치지 않는다.<br>- 이를 통해 `논리적 데이터 독립성`이 확보된다.|
|`개념-내부 사상`|- 개념 스키마와 내부 스키마의 대응 관계<br>- 물리적 저장장치의 변경, 데이터의 이동 등 물리적 변화가 발생해도 이를 개념-내부 사상에 반영시키면<br>개념 스키마에는 아무런 영향도 미치지 않는다.<br>- 이를 통해 `물리적 데이터 독립성`이 확보된다.|

|개념|설명|
|---|---|
|물리적 데이터 독립성|물리적 저장장치의 변경, 혹은 데이터 저장 위치의 변경이 있더라도<br>개념 단계(개념 스키마)에는 아무런 영향도 주지 않는 것|
|논리적 데이터 독립성|개념 스키마에 변경 사항이 생기더라도 외부 스키마에 아무런 영향도 미치지 않는 것|


## 데이터베이스 시스템 아키텍처  

### 중앙집중식과 클라이언트-서버 구조  

|아키텍처 종류|설명|
|---|---|
|`중앙집중식 방식`|- 메인프레임 컴퓨터가 DBMS, 사용자의 프로그램, 인터페이스 등을 모두 처리하는 구조<br>- 초기에 발달된 데이터베이스 시스템의 구조<br>- 대부분의 사용자(로컬 머신)이 자체적인 데이터 처리 능력이 없었기 때문에 자연스럽게 나타난 구조<br>- 중앙의 고성능 단일 서버가 다수의 클라이언트(로컬 머신)를 대신하여 작동하는 구조다.<br>- 중앙 서버의 과부하, 이에 따른 병목현상 발생, 성능 저하 등의 문제가 있다.<br>- 또한 하드웨어나 소프트웨어의 오류가 발생한다면 전체 시스템이 중단되는 문제가 있다.|
|`클라이언트 - 서버 방식`<br>(분산 시스템 방식)|- 클라이언트(로컬 머신)은 계산, 표현, 연결, 데이터베이스 서비스 요청 등을 자체적으로 수행<br>- 서버는 다중 사용자 컴퓨터로서 계산, 연결, 데이터베이스 서비스를 제공<br>- 하드웨어 제조기술을 발달로 일반 사용자의 단말장치(로컬 머신)의 평균 성능이 올라감에 따라 나타난 아키텍처<br>- 중앙 서버의 부하를 분산시키고, 시스템의 성능을 향상시킬 수 있다.<br>- 또한 프로그램의 유지보수 비용이 절감되며, 이식성이 증가된다.<br>- 쉽게 말해 기존에 중앙 서버에서 처리하던 작업 일부를 클라이언트에서 처리하도록 분배한 구조|

### 2계층, 3계층 클라이언트 - 서버 구조  

|구분|설명|
|---|---|
|`2계층 클라이언트-서버 구조`|- 중앙 서버는 데이터베이스 시스템의 운영을 맡고, 클라이언트에서는 애플리케이션의 동작을 맡는다.<br>- 클라이언트에서 데이터 접근이 필요할 때, 프로그램이 서버 쪽의 DBMS에 연결을 설정하고 통신하는 방식으로 동작한다.<br>- 따라서 DBMS 서버를 흔히 질의 서버나 트랜잭션 서버, SQL 서버라고 부른다.|
|`3계층 클라이언트-서버 구조`|- 중앙 서버에 데이터베이스 시스템과 함께 애플리케이션-데이터베이스의 중단 단계인 `애플리케이션 서버`가 추가된 구조이다.<br>- 애플리케이션 서버 (Application Server) 는 데이터에 접근하는 데 사용되는 비즈니스 규칙을 저장하는 중간 역할을 수행<br>- 즉, 클라이언트의 애플리케이션 클라이언트 단의 요청을 중앙 서버의 애플리케이션 서버에서 받고, 이를 번역하여 중앙 서버의 데이터베이스 시스템에 요청하여 데이터를 받아오거나 데이터를 조작하는 방식을 의미한다.|

![](/assets/images/20241211_002_006.png)  


## Reference  

[데이터베이스시스템 (정재화 저)](https://search.shopping.naver.com/book/catalog/3247843974)  