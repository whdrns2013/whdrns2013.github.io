---
title: python string 모듈 - 난수로 비밀번호 생성하기 # 제목 (필수)
excerpt: 난수로 비밀번호를 생성해보자  # 서브 타이틀이자 meta description (필수)
date: 2024-01-07 17:30:00 +0900      # 작성일 (필수)
lastmod: 2024-01-07 17:30:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-01-07 17:30:00 +0900   # 최종 수정일 (필수)
categories: Python         # 다수 카테고리에 포함 가능 (필수)
tags: python string random 난수 비밀번호 password                     # 태그 복수개 가능 (필수)
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20240107_001-->



## string 모듈에서 문자열 집합 가져오기

- ascii_uppercase : 영 대문자
- ascii_lowercase : 영소문자
- ascii_letters: 영 대소문자
- digits : 숫자

```python
import string

# ascii_uppercase
print(string.ascii_uppercase)
>>> 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

# ascii_lowercase
print(string.ascii_lowercase)
>>> 'abcdefghijklmnopqrstuvwxyz'

# ascii_letters
print(string.ascii_letters)
>>> 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

# ascii_digits
print(string.digits)
>>> '0123456789'

# printable
print(string.printable)
>>> '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c'
```

<br>

## 비밀번호에 사용할 문자 list 만들기

```python
# 영대소문자 + 숫자 list
passwd_charset = list(set(string.ascii_letters + string.digits))

# 특수문자 추가
passwd_charset.extend(set(string.printable[62:67]))
passwd_charset.extend(["_", "-"])

# 확인
print(passwd_charset)
>>> ['Z', 'p', 'o', 'K', 'D', 'e', '0', 'h', '4', 'H', 'y', 'U', 'v', 's', '6', '8', 'Y', 'E', 'g', 'O', 'V', '7', 'a', 'm', 't', 'M', 'j', 'N', '1', 'r', '2', '3', 'T', 'x', 'W', '5', 'R', 'F', 'k', 'G', 'c', 'u', 'A', 'I', 'J', 'i', 'P', 'L', 'Q', 'd', 'w', 'n', 'b', 'f', 'z', 'S', 'q', 'B', 'l', 'X', 'C', '9', '#', '%', '!', '"', '$', '_', '-']

```

<br>

## random 뽑기

random.choice() 메서드를 이용해서 list에서 랜덤한 원소를 뽑아옵니다.

```python
import random

passwd = ""

for i in range(15):
    passwd += random.choice(passwd_charset)

print(passwd)
>>> 'x681GnDOLLL$uMR'
```

<br>

## Reference

- https://wikidocs.net/176586  