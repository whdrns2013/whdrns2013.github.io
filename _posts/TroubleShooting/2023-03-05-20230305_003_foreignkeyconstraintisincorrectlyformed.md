---
title: MySQL Foreign key constraint is incorrectly formed # 제목
excerpt: 외래키 지정시 form 오류 # 서브 타이틀
date: 2023-03-05 04:55:00 +0900      # 작성일
lastmod: 2023-03-05 04:55:00 +0900   # 최종 수정일 : 구글 사이트등록 관련 필요
categories: TroubleShooting         # 다수 카테고리에 포함 가능
tags: MySQL Foreignkey constraints 외래키 오류                     # 태그 복수개 가능
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: '#333'            # 헤더 이미지 (제목과 겹치게)
  overlay_color:             # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20230305_003-->

# 에러 메세지

```sql
ERROR 1005 (HY000): Can't create table `DB명`.`테이블명` (errno: 150 "Foreign key constraint is incorrectly formed")
```

# 문제 상황

테이블의 CHAR SET 변경을 위해 외래키들을 모두 끊어준 뒤, 다시 연결하려는 상황에 이번 오류가 발생했다.  

기존에는 정상적으로 외래키 설정이 됐기 때문에 변경된 CHAR SET 이 원인일 것이라는 추측을 쉽게 할 수 있었다.  

# 오류 분석

Foreign key constraint is incorrectly formed.  
직역하면 외래 키 제약 조건이 잘못 구성됨.  

# 원인

이 문구는 크게 네 가지 원인으로 발생한다고 함.  

**1.테이블간 CHAR SET이 다른 경우**  

테이블간 CHAR SET (캐릭터셋;허용하는 문자 집합. 인코딩 방식)이 다르면 외래키 설정이 불가능하다.  
예를 들어 부모 테이블은 한글을 허용하는 utf-8 인데, 이를 참조하는 칼럼은 한글이 없는 latin-1 이라면 표현할 수 있는 문자가 맞지 않게 된다.  
이런 경우 두 테이블의 CHAR SET을 맞춰줘야 한다.  

**2. 테이블간 COLLATION이 다른 경우**

COLLATION은 데이터를 정렬하고 비교하는 방식을 뜻한다.  
해결 방법은 CHAR SET의 문제와 동일하게, 두 테이블의 COLLATION을 맞춰주면 된다.  

**3. 참조하는 칼럼과 자료형이 다른 경우**

부모 테이블의 칼럼이 자료형이 VARCHAR 형인데, 이를 참조하는 칼럼의 자료형은 INT 형이라면 이 또한 호환이 불가능하다.  
이 경우 두 칼럼의 데이터타입을 맞춰줘야 한다.  

**4. 참조하는 칼럼이 PK 혹은 FK가 아닌 경우**

참조할 칼럼이 유니크한 값을 갖지 않는 경우(=중복값을 허용할 경우) 도 문제가 된다.  
이 경우, 참조할 칼럼을 PK 등 중복을 허용하지 않는 칼럼으로 지정하는 등의 조치가 필요하다.  

# 해결

예상대로 CHAR SET 변경에 따른 문제였기 때문에 쉽게 해결할 수 있었다.  

```sql

ALTER TABLE log CONVERT TO CHARACTER SET uft8;
-- log 테이블의 CHAR SET을 utf8로 변경

ALTER TABLE log ADD FOREIGN KEY (cam_id) REFERENCES cam(cam_id) ON UPDATE CASCADE;
-- (오류났던 시도에 대한 재시도)
-- log 테이블의 cam_id 칼럼이
-- cam 테이블의 cam_id 칼럼을 참조하도록 외래키 설정

```

# Reference

https://algorithmstudy-mju.tistory.com/154  
https://devonce.tistory.com/36  