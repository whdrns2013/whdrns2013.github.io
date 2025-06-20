---
title: "[컴퓨터보안] 8. 웹 보안 과 모바일 보안" # 제목 (필수)
excerpt: "가장 많은 사용자와 상호작용 하는 웹과 모바일 보안"  # 서브 타이틀이자 meta description (필수)
date: 2025-06-20 22:15:00 +0900      # 작성일 (필수)
lastmod: 2025-06-20 22:15:10 +0900   # 최종 수정일 (필수)
last_modified_at: 2025-06-20 22:15:00 +0900   # 최종 수정일 (필수)
categories: security      # 다수 카테고리에 포함 가능 (필수)
tags: 보안시스템 침입방지시스템 웹보안 SQLInjection 크로스사이트스크립팅 XSS 저장된XSS 반사된XSS 접근제어실패 모바일보안 WEP RSN       # 태그 복수개 가능 (필수)
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
<!--postNo: 20250620_001-->

<span class="ttag">#웹보안</span> <span class="ttag">#SQLInjection</span> <span class="ttag">#크로스사이트스크립팅</span> <span class="ttag">#XSS</span> <span class="ttag">#저장된XSS</span> <span class="ttag">#반사된XSS</span> <span class="ttag">#접근제어실패</span> <span class="ttag">#모바일보안</span> <span class="ttag">#WEP</span> <span class="ttag">#RSN</span> 

## 웹 보안의 개요  

### 웹 보안  

- 웹 서비스 상에서 일어날 수 있는 다양한 공격으로부터 웹 서비스를 지키는 것  
- **네트워크 부분은 SSL/TLS 를 적용해 해결** 가능  
- **나머지 구성 요소에 대해서는 별도의 보안 기법 필요**  

---

## 웹 보안 위협 요소  

### 웹 보안 위협 요소  

- SQL Injection  
- 크로스 사이트 스크립팅 (XSS)  
- 접근제어 실패  
- 웹 서버 공격  

---

### SQL Injection  

- **SQL 문에 추가적인 SQL 을 삽입(Injection)** 함으로써 악의적인 행위를 가능케 하는 공격  
- e.g. 로그인 페이지에 ID/PW 부분에 SQL 문을 넣어 인증 우회  
- 따옴표 이용 (구문에서 사용하는 예약된 특수문자를 사용) / 더블 하이픈 이용 (주석처리) 등  
- 방어 방법 : 사용자 입력값 미리 검사, 매개변수화된 SQL 쿼리 사용, APP 의 DB 권한 최소화 등    

![](/assets/images/20250620_001_001.png)  

---

### 크로스 사이트 스크립팅 (XSS)  

#### 크로스 사이트 스크립팅  

- 메일이나 웹페이지에 추가적인 **악성 스크립트**를 포함시킴  
- 웹 클라이언트가 메일이나 웹페이지를 열면 자동으로 악성 스크립트가 실행되게 하는 공격  
- 사용자 정보가 공격자의 사이트로 넘어가게 됨  
- 저장된 XSS, 반사된 XSS 가 있음  

#### 저장된 XSS  

- 공격자가 악성 스크립트를 **특정 게시판에 등록**  
- 사용자가 게시물을 열면 그 안에 포함된 악성 스크립트가 실행됨  

#### 반사된 XSS  

- 공격자가 **악성 스크립트가 포함된 URL 링크**를 사용자에게 메일로 보냄  
- 수신자가 이 링크를 누르면 해당 사이트에서 오류로 처리되면서 악성 스크립트가 실행됨  

```bash
http://신뢰받는정상적인사이트/경로?q=<script>악의적인내용수행</script>
```

#### 방어 방법  

- 사용자의 **입력값을 미리 검사** : 길이, 문자, 형식 에 대한 유효성  
- 사용자로 보낼 **출력값을 미리 검사** : `<script>` 태그 제거, 꺽쇠를 `&lt;` 와 같이 **일반문자화**  

---

### 접근제어 실패  

- 사용자와 자원에 대한 접근제어가 완벽하지 못한 경우, 이를 통한 공격  
- e.g. 링크를 만들어두지 않은 관리자 페이지  
- e.g. URL 에 사용자 ID 를 포함하는 경우  

```bash
# 링크를 만들어두지 않은 관리자 페이지
http://사이트이름/admin

# URL 에 사용자 ID를 포함하는 경우  
http://사이트이름/...?id=userid
```

- 방어 방법 : 올바른 접근제어를 적용  
- e.g. 관리자 페이지 자체에 **접근권한 설정**  

---

## 모바일 보안의 개요  

### 모바일 보안  

- 모바일 환경은 편의성이 좋고, 보안이 취약(전파에 대한 도청)하다는 특징이 있음  

---

## 모바일 보안 기법  

### WEP (Wired Equivalent Privacy)  

- 무선 LAN 환경에서 기밀성을 제공하기 위한 알고리즘  
- **현재는 취약성**이 드러나 사용하지 않음  
- 스트림 암호 방식 : RC4 알고리즘  
- 키 분배 메커니즘 없음  

---

### RSN (Robust Security Network)  

- IEEE 802.11i 표준  
- 인증, 키 관리, 키 교환, 기밀성, 무결성 등의 보안서비스를 포함한다.  

| 서비스      | 프로토콜   | 설명                                                                                                         |
| -------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| 기밀성, 무결성 | TKIP   | - Temporal Key Integrity Protocol<br>- 임시 키 무결성 프로토콜<br>- **WEP로 구현된 하드웨어의 펌웨어 업데이트**를 위해 사용<br>- 외워야겠는데.. |
| 기밀성, 무결성 | CCMP   | - CTR mode with CBC-MAC Protocol<br>- 기밀성 : 카운터(CTR) 모드와 AES 알고리즘 이용<br>- 무결성 : AES를 사용하는 CBC-MAC 을 이용     |
| 접근제어     | 802.1X | - 포트 기반 네트워크 접근제어 표준<br>- 모바일 장치와 엑세스 포인트 외 인증 서버가 필요함                                                     |
| 인증, 키 교환 | EAP    | - 확장형 인증 프레임워크<br>- 모바일 장치가 인증을 받을 때 사용되는 프로토콜                                                             |


## Reference  

[컴퓨터 보안 - 김진욱, 유대현, 김희천 저](https://search.shopping.naver.com/book/catalog/37553634631)  