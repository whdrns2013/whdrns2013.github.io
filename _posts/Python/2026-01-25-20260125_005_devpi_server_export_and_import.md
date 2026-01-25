---
title: "[devpi] devpi-server 내보내기 및 가져오기 (백업과 복원)" # 제목 (필수)
excerpt: "사설 PyPI 서버를 파일로 저장하고, 불러오기" # 서브 타이틀이자 meta description (필수)
date: 2026-01-25 14:16:00 +0900      # 작성일 (필수)
lastmod: 2026-01-25 14:16:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-01-25 14:16:00 +0900   # 최종 수정일 (필수)
categories: Python       # 다수 카테고리에 포함 가능 (필수)
tags: python 파이썬 devpi 패키지 서버 package server 추출 내보내기 export 가져오기 불러오기 import 백업 backup 복원 restore                     # 태그 복수개 가능 (필수)
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
  nav: docs_python
pinned: 
---
<!--postNo: 20250125_005-->


## devpi-server 내보내기 및 가져오기 (백업과 복원)

### 사전 준비

- 이전 포스팅을 통해 devpi-server 를 띄웠고, 신규 인덱스를 생성한다.  
- `devpi-server`, `devpi-web`, `devpi-client` 패키지들을 설치한다.  
- 신규 유저 `tester`, 신규 인덱스 `tester_index` 를 생성한다.  
- devpi-server 참고 : [https://whdrns2013.github.io/python/20260122_001_devpi/](https://whdrns2013.github.io/python/20260122_001_devpi/)  
- 유저, 인덱스 생성 참고 : [https://whdrns2013.github.io/python/20260125_001_devpi_index/](https://whdrns2013.github.io/python/20260125_001_devpi_index/)  

### 실행 위치 참고

- 🤖 : devpi 가 설치된 서버  
- 🧑‍💻 : 사용자. devpi 로 패키지 설치 요청을 보내는 클라이언트  

### devpi-server 내보내기(export)

#### 기능  

- devpi-server 의 인스턴스 데이터를 내보낸다.  
- devpi-server의 저장소 데이터를 파일 시스템 기준으로 덤프(export)하는 기능  

#### 사용 방법  

- 🤖 `devpi-export` 명령어를 통해 내보내기를 수행한다.  

```bash
devpi-export <export 결과 데이터를 저장할 디렉터리>
```

#### 옵션  

| 옵션 | 명칭 | 설명 |
| --- | --- | --- |
| `-c`, `--configfile` | 설정 파일 | - devpi-server 실행시 사용하던 설정 파일 지정 <br> - 서버를 config 기반으로 운영 중이라면 지정하는 걸 권장 |
| `--serverdir` | devpi-server 데이터 경로 | - devpi-server 데이터가 저장된 실제 경로 <br> - devpi-server 실행시 별도로 server-dir을 지정한 경우 사용 |
| `--storage` | 저장소 백엔드 | - 대부분 기본값(sqlite) 사용 <br> - sqlite 혹은 pg8000 사용 가능 |
| `--include-mirrored-files` | PyPI 미러 패키지 포함 여부 | - PyPI 미러에서 다운로드 된 패키지 파일까지 포함할지 <br> - 옵션을 사용하면 미러 패키지까지 추출 |
| `--hard-links` | 파일 복사 대신 하드 링크 | - 파일 복사 대신 하드링크 사용 <br> - 같은 파일시스템에서만 가능 <br> - 백업 용량 감소, 하지만 위험성 있음 |

#### 예제  

```bash
mkdir ./export_dir
devpi-export --serverdir ./registry/ ./export_dir/
```

<br>

```bash
# 출력 (tester, tester_inde 는 유저 이름과 인덱스 이름)
2026-01-24 17:42:05,803 INFO  NOCTX Loading ...
2026-01-24 17:42:05,815 INFO  NOCTX wrote ...
creating /devpi/export_dir
dumped user 'tester'
copy file at tester/tester_index/my-package/0.3.0/my_package-0.3.0-py3-none-any.whl
dumped releasefile: tester/tester_index/my-package/0.3.0/my_package-0.3.0-py3-none-any.whl 
dumped index 'tester/tester_index'
dumped user 'root'
dumped index 'root/pypi'
writing dataindex.json, length 4072
```

<br>

```bash
ls -al ./export_dir

# >> Jan 24 17:42 dataindex.json
# >> Jan 24 17:42 tester
```

### devpi-server 가져오기(import)

#### 기능  

- 사전에 export 된 legacy devpi-server 데이터를 새로운 devpi-server 인스턴스로 가져옴

<br>

#### 사용 방법  

- 🤖 `devpi-import` 명령어를 통해 가져오기를 수행한다.

```bash
devpi-import <export 결과가 저장된 디렉터리>
```

<br>

#### 옵션  

| 옵션 | 명칭 | 설명 |
| --- | --- | --- |
| `-c`, `--configfile` | 설정 파일 | - devpi-server 실행 시 사용할 설정 파일을 지정 |
| `--serverdir` | devpi-server 데이터 경로 | - 새 devpi-server 인스턴스의 데이터가 생성될 경로를 지정 <br> - 기존 데이터가 없는 빈 디렉터리여야 안전 |
| `--storage` | 저장소 백엔드 | - export 당시 사용한 storage 타입과 동일하게 지정 <br> - `sqlite` 또는 `pg8000` |
| `--no-root-pypi` | root/pypi 생성 여부 | - 서버 초기화 시 기본으로 생성되는 `root/pypi` 인덱스를 생성하지 않는 옵션 <br> - export 데이터에 이미 존재하는 경우 중복 생성을 방지 |
| `--root-passwd` | root 초기 비밀번호 | - import 시 `root` 계정의 초기 비밀번호를 설정 |
| `--root-passwd-hash` | root 비밀번호 해시 | - 평문 대신 해시된 비밀번호를 지정 |
| `--skip-import-type` | 특정 인덱스 타입 제외 | - 지정한 인덱스 타입을 import 대상에서 제외 |
| `--no-events` | 이벤트 실행 지연 | - import 중 이벤트 실행을 생략하고 서버 기동 후 처리 |
| `--hard-links` | 파일 복사 대신 하드 링크 | - 파일 복사 대신 하드 링크를 사용 <br> - export 시 해당 옵션을 사용했다면 import 시에도 동일하게 지정 <br> - 동일 파일시스템에서만 가능 <br> -  운영상 위험성이 있음 |

<br>

#### import 예제  

- import  

```bash
mkdir import_dir
devpi-import --serverdir ./import_dir --no-root-pypi ./export_dir
```

```bash
# 출력
2026-01-24 17:53:21,164 INFO  NOCTX Loading node ...
...
******** Importing packages from /devpi/export_dir **********
Number of users: 2
Number of indexes: 2
Index tester/tester_index has 1 projects and 1 files
Index root/pypi has 0 projects and 0 files
Total number of projects: 1
Total number of files: 1
2026-01-24 17:53:21,469 INFO  setting password for user 'tester'
...
********* import_all: importing finished ***********
...
```

<br>

- import 결과 확인  

```bash
ls -al import_dir
# >>  Jan 24 17:53 +files
# >>  Jan 24 17:53 .
# >>  Jan 24 17:47 ..
# >>  Jan 24 17:53 .event_serial
# >>  Jan 24 17:53 .nodeinfo
# >>  Jan 24 17:53 .serverversion
# >>  Jan 24 17:53 .sqlite
```

<br>

### Import 한 데이터로 devpi-server 가동

#### devpi-server 가동  

- 🤖 `devpi-init` 할 필요 없이 바로 `devpi-server` 명령어로 가동이 가능하다.
- 🤖 기존의 3141번 포트가 아닌, 3142번 포트로 새롭게 서버를 실행시킨다.

```bash
devpi-server --host=0.0.0.0 --port 3142 --serverdir ./import_dir
```

<br>

#### 결과 확인  

- 🧑‍💻 devpi-client 로 사용할 인덱스를 지정하고 로그인한다.
- 🧑‍💻 로그인하는 계정은 원래 서버(3141번 포트)에서 사용하던 걸 그대로 사용하면 된다.

```bash
devpi use http://{HOST}:3142
devpi login {user} password='{password}'
```

<br>

- 🧑‍💻 사용 가능한 인덱스 리스트를 뽑아본다.

```bash
devpi index -l
```

```bash
# 출력.. 성공!
tester/tester_index
```

<br>

## Reference  

[devpi-stable Documentation - devpi_commands](https://devpi.net/docs/devpi/devpi/stable/+d/userman/devpi_commands.html)