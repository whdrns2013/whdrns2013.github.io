---
title: "4-1. 보안 강화 - 인증 절차 구현하기"
excerpt: "htpasswd 를 이용한 사용자 인증"
last_modified_at: 2024-01-13 18:25:00 +0900
permalink: /docs/docker/registry/04_authentication
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker"
---



## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Docker Registry 보안 강화</span>

Docker registry 를 "개인화 도커 이미지 저장소" 목적으로 이용한 만큼, 보안을 강화하는 것은 중요한 문제입니다. 다양한 방법 중에서도 사용자 인증 절차와 HTTPS 통신 두 가지를 중점적으로 살펴보겠습니다.  

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>사용자 인증 절차 구축</span>  

사용자 인증을 통해 Docker registry의 보안성을 높일 수 있습니다. Docker registry는 silly, token, htpasswd 세 가지 사용자 인증 방법을 지원하고 있습니다.    

### 인증 방법 세 가지

<b><font color="FF82B2">(1) silly</font></b>    

silly는 기본적으로 모든 요청을 허용하며, HTTP 요청에 Authorization 헤더가 없는 경우에만 접근을 거부합니다. (헤더 자체가 있는지 여부만 확인) 약한 보안 방법이고, 주로 테스트 환경에서만 사용됩니다.  

```yaml
auth:
  silly:
    realm: silly-realm # 인증 하려는 범위 (혹은 인증 대상 서비스)
```

<b><font color="FF82B2">(2) token</font></b>    

각 사용자에게 고유한 토큰을 부여하여 인증하는 방식입니다. 토큰은 일정 기간 동안 유효하며, 유효 기간이 지나면 다시 갱신해야 합니다.  

```yaml
auth:
  token:
    realm: token-realm # 인증 하려는 범위 (혹은 인증 대상 서비스)
    issuer: my-registry # 토큰 발급자
    rootcertbundle: /path/to/root/ca.crt # 토큰 발급자의 루트 인증서 파일 경로
```

<b><font color="FF82B2">(3) htpasswd</font></b>    

Apache의 htpasswd 파일 형식을 사용하여 사용자를 관리하고 인증하는 방법입니다. 높은 보안 수준을 제공합니다.  

```yaml
auth:
  htpasswd:
    realm: basic-realm # 인증 하려는 범위 (혹은 인증 대상 서비스)
    path: /path/to/htpasswd # 인증자료(htpasswd)의 경로
```

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>htpasswd</span>

세 가지 방법 중, 가장 권장할 수 있는 'htpasswd' 방식을 구현해보도록 하겠습니다.  

`htpasswd` 명령어는 Apache 웹 서버에서 사용자를 관리하는 도구로, Apache HTTP Server 패키지에 포함되어 있습니다. 이 도구를 사용하려면 먼저 Apache 패키지를 설치해야 합니다.   

### (1) apache2-utils 설치

registry 컨테이너 안쪽에서 htpasswd 이용을 위해 apache2-utils 를 설치합니다.  

```terminal
$ apk add apache2-utils
```

### (2) 사용자와 비밀번호 저장 파일 생성  

특정 사용자(계정) 의 비밀번호 정보를 가지고 있을 파일을 만들어줍니다.  
-B 옵션은 bcrypt 알고리즘을 이용해 비밀번호를 해싱하는 옵션입니다.  
-c 옵션은 파일을 새로 생성하는 옵션입니다. (기존 파일이 있는 경우엔 이 옵션을 사용할지 말지 살펴야 합니다.)  

```terminal
$ htpasswd -Bc /path/to/htpasswd user-name

>>> New password : user-name 계정에 대한 비밀번호 입력
>>> Re-type new password : 비밀번호 한 번 더 입력
>>> Adding password for user user-name : 계정, 비밀번호 생성 완료
```

### (3) docker registry 설정 수정  

docker registry 설정에 htpasswd 를 이용한 인증을 추가해줍니다.  

```terminal
$ vi /etc/docker/registry/config.yml
```

```yml
#...(전략)

auth:
  htpasswd:
	realm: basic-realm
	path: /path/to/htpasswd

#...(후략)
```


### (4) 재시작  

설정 적용을 위해 docker registry 컨테이너를 재실행합니다.  
이 작업은 registry 컨테이너 바깥, host 머신에서 진행해주세요.  

```terminal
$ docker restart <registry 컨테이너 이름 혹은 id>
```

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>테스트 해보기</span>  

docker registry에 접근해보겠습니다.  

먼저 브라우저로 접근해보면 아래와 같이 로그인을 요구하고, 로그인을 성공하면 컨텐츠를 보여줍니다.  

![](/assets/images/20240113_001_001.png)  

![](/assets/images/20240113_001_002.png)  


curl 을 통해 접근시에는 아래와 같이 유저명과 패스워드를 명시해줘야 접근이 가능합니다.  

```terminal
# 유저명과 패스워드 명시하여 접근

$ curl http://유저명:패스워드@서버IP:포트/v2/_catalog
>>> {"repositories":["my_docker",ubuntu"]}
```

```terminal
# 유저명과 패스워드 명시 없이 접근

$ curl http://서버IP:5000/v2/_catalog
>>> {"errors":[{"code":"UNAUTHORIZED","message":"authentication required","detail":[{"Type":"registry","Class":"","Name":"catalog","Action":"*"}]}]}

```

이미지 push, pull을 할 때에는 docker login을 한 뒤에 진행해야 합니다.  
아래를 참고해주세요.  

```terminal
$ docker login 서버ip:포트번호
>>> Username:
>>> Password

# Username과 Password를 순차적으로 입력해주시면 됩니다.
```

```terminal
>>> docker push 서버ip:포트번호/repository명:버전
```

<br>

## <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Reference</span>  

docker registry config : https://gdevillele.github.io/registry/configuration/  
docker 사용자 인증 방법 : https://arisu1000.tistory.com/27799  