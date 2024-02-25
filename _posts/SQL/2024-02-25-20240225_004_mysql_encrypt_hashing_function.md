---
title: MYSQL 함수 시리즈 5.암호화 및 해싱 함수 # 제목 (필수)
excerpt: AES_ENCRYPT, MD5, SHA2, PASSWORD ...  # 서브 타이틀이자 meta description (필수)
date: 2024-02-25 18:30:00 +0900      # 작성일 (필수)
lastmod: 2024-02-25 18:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-02-25 18:30:00 +0900   # 최종 수정일 (필수)
categories: SQL         # 다수 카테고리에 포함 가능 (필수)
tags:     # 태그 복수개 가능 (필수)
classes: MYSQL SQL 암호화 함수 해싱 AES_ENCRYPT MD5 SHA1 SHA2 PASSWORD ENCRYPT   # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png            # 헤더 이미지 (제목과 겹치게)
  # overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20240225_004-->


## 암호화 및 해싱 함수  

| 함수 | 설명 |
| ---- | ---- |
| AES_ENCRYPT(값, encrypt key) | AES 알고리즘을 사용해 값을 암호화 |
| AES_DECRYPT(해시값, key) | AES 알고리즘으로 암호화 된 값을 복호화 |
| MD5(값) | MD5 알고리즘으로 해싱 |
| SHA1(값) | SHA1 알고리즘으로 해싱 |
| SHA2(값, hash_length) | SHA2 알고리즘으로 해싱 |
| PASSWORD(값) | MySQL 비밀번호 해싱 |
| ENCRYPT(값, salt) | DES 알고리즘으로 해싱 |

<br>

### AES_ENCRYPT  

 AES 알고리즘을 사용해 값을 암호화하는 암호화 함수입니다. encrypt key에 따라 반환값이 다릅니다.  
 복호화 할 때 동일한 암호화 키를 통해 복호화하는 양방향 암호화입니다.  

```sql
SELECT (HEX(AES_ENCRYPT('my_password','encryption_key')));
-- >> A6A9215E95AFFEE453711ADA178DF662

SELECT (HEX(AES_ENCRYPT('my_password','another_key')));
-- >> 19E5CBCA6DCF9A61EB5D08568668E48D
```

<br>

### AES_DECRYPT  

AES 알고리즘으로 암호화 한 값을 복호화 하는 함수입니다.  
암호화 할 때 사용한 암호화 key 를 넣어줘야 제대로된 복호화가 가능합니다.  

```sql
SELECT AES_DECRYPT(UNHEX(
	'A6A9215E95AFFEE453711ADA178DF662'),
	'encryption_key'
	)
-- >> my_password
```

맞지 않는 암호화 key를 넣으면 제대로 복호화되지 않습니다.  

```sql
SELECT AES_DECRYPT(UNHEX(
	'A6A9215E95AFFEE453711ADA178DF662'),
	'another_key'
	)
-- >> NULL
```

<br>

### MD5  

MD5 알고리즘으로 해싱한 값을 반환합니다.  

```sql
SELECT MD5('my_password');
-- >> a865a7e0ddbf35fa6f6a232e0893bea4
```

<br>

### SHA1  

SHA1 알고리즘으로 해싱한 값을 반환합니다.  

```sql
SELECT SHA1('my_password');
-- >> 5eb942810a75ebc850972a89285d570d484c89c4
```

<br>

### SHA2  

SHA2 알고리즘으로 해싱한 값을 반환합니다.  
반환할 해시값 길이를 지정할 수 있습니다. (256비트, 512비트 등)  

```sql
SELECT SHA2('my_password', 256);
-- >> f6e248ea994f3e342f61141b8b8e3ede86d4de53257abc8d06ae07a1da73fb39
SELECT SHA2('my_password', 512);
-- >> dda8c3468860dcb24e228ab8ee44208d43eb2f5fd2a3a538bafbd39db4ff114c9829a64bd1a4710e0c021f8a4134b6a2f8b17eccc87ffe79d8459e2df294fb01
```

salt 를 적용하려면 아래와 같이 사용할 수 있습니다.  

```sql
SELECT SHA2(CONCAT('my_password','salt'), 256);
-- >> ee912d8d77e0dd6d9c58af1efc5514df5ce4d031caed3641c4524dd772b4c5c9
```

<br>

### PASSWORD  

MySQL 내부의 특정 알고리즘을 기반으로 해싱한 값을 반환합니다.  

```sql
SELECT PASSWORD('my_password');
-- >> *CCD3A959D6A004B9C3807B728BC2E55B67E10518
```

<br>

### ENCRYPT  

DES 알고리즘을 기반으로 해싱한 값을 반환합니다.  
salt를 추가할 수도 있습니다.  
(salt에 대한 설명 : https://whdrns2013.github.io/computerscience/20231231_005_hash/)  

```sql
SELECT ENCRYPT('my_password', 'the salt');
-- >> thh38EQpCLgcQ
SELECT ENCRYPT('my_password', 'whale');
-- >> wh934d0GgLzCI
```

또한 salt를 지정하지 않을 경우, MySQL에서 임의의 salt를 적용합니다.  
이 때문에 slat를 지정하지 않고 동일한 값을 넣고 함수를 실행해도 반환값이 달라집니다.  

```sql
SELECT ENCRYPT('my_password');
-- >> u3IH3kSHSaRWI
SELECT ENCRYPT('my_password');
-- >> i5.vTKYQRygg6
```

<br>

## Reference  

AES_ENCRYPT 함수 : [https://blog.naver.com/deersoul6662/222377000254](https://blog.naver.com/deersoul6662/222377000254)  