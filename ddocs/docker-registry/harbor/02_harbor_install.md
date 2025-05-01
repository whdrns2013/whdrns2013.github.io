---
title: "2. Harbor 설치하기"
excerpt: "호스트의 Nginx가 있는 상태에서 Harbor 설치하기"
date: 2025-05-02 13:20:00 +0900      # 작성일 (필수)
lastmod: 2025-05-02 13:20:00 +0900   # 최종 수정일 (필수)
permalink: /docs/docker_registry/harbor/02_harbor_install
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_docker_registry"
---

<!--postNo: 20250502_002-->


## Harbor 설치하기  

### 환경 소개  

본 포스팅에서 Harbor 를 설치하는 환경은 아래와 같습니다.  

- OS : Rocky Linux 9.3  

포스팅 일자 기준 가장 최근 버전인 2.13.0 의 필요 사양입니다.  

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| CPU      | 2 CPU   | 4 CPU       |
| Mem      | 4 GB    | 8 GB        |
| Disk     | 40 GB   | 160 GB      |

아래 패키지가 필수적으로 설치되어있어야 합니다. openssl 은 인증을 위해 필요한 것으로, 만약 도메인이 있다면 lets encrypt 와 같은 대체 패키지를 사용해도 무방합니다.    

| Software       | Version              | Description                                                           |
| -------------- | -------------------- | --------------------------------------------------------------------- |
| Docker Engine  | Version > 20.10      | [Docker Engine Installation](https://docs.docker.com/engine/install/) |
| Docker Compose | Docker compose > 2.3 | Docker Compose is part of Docker Engine                               |
| OpenSSL        | Latest (optional)    | Used to generate certificate and keys for Harbor                      |

아래 두 개의 포트를 서비스 포트로 사용합니다. 이는 추후 설정파일에서 변경할 수 있습니다.  

| Port | Protocol | Description                                                                                                        |
| ---- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| 443  | HTTPS    | Harbor portal and core API accept HTTPS requests on this port. You can change this port in the configuration file. |
| 80   | HTTP     | Harbor portal and core API accept HTTP requests on this port. You can change this port in the configuration file.  |


### Harbor 의 구조  

Harbor 는 기본적으로 `docker-compose` 를 사용해 여러 개의 컨테이너로 구성되는 멀티 컨테이너 애플리케이션 구조를 하고 있습니다. 따라서 `docker` 와 `docker-compose` 가 설치되어 있어야 하며, 이에 대한 기본지식이 필요합니다.  

Harbor 의 구조는 아래와 같습니다.  

| 컨테이너 이미지 이름            | 설명                                          |
| ---------------------- | ------------------------------------------- |
| **nginx**              | 프록시 서버. 외부 요청을 내부 서비스로 라우팅                  |
| **harbor-core**        | 핵심 API 서비스. 프로젝트, 사용자, 레지스트리 등 핵심 로직 처리     |
| **harbor-portal**      | 웹 UI (React 기반 SPA)                         |
| **harbor-db**          | PostgreSQL. 사용자, 프로젝트 정보 등 메타데이터 저장         |
| **harbor-jobservice**  | 비동기 작업 처리 (복제, 삭제, 스캔 등)                    |
| **registry**           | 실제 이미지가 저장되는 Docker Registry (기본 레지스트리)     |
| **registryctl**        | registry 설정 관리. 정책 기반 접근 제어 지원              |
| **harbor-log**         | 로그 수집 서비스. 다른 컴포넌트의 로그를 수집해 파일로 저장          |
| **redis**              | 캐시 및 큐 처리 용도 (jobservice 등에서 사용)            |
| **notary-server**      | (선택) 이미지 서명을 위한 Notary 서버                   |
| **notary-signer**      | (선택) Notary 개인키 관리                          |
| **trivy** 또는 **clair** | (선택) 이미지 취약점 스캔 도구. Trivy가 기본 디폴트 (2023 기준) |

### 설치 방법 소개  

Harbor 는 Github 에서 Release 를 통해 설치 패키지를 제공합니다. 아래 Harbor 깃헙에서 최신 버전 설치 패키지를 다운로드 받을 수 있습니다.  

[Github - Harbor Releases](https://github.com/goharbor/harbor/releases)  


## 설치하기  

### 설치 파일 다운로드  

wget 을 통해 설치파일을 다운로드 받겠습니다. 포스팅 기준 가장 최신 버전인 2.13.0 입니다.  
설치 디렉터리는 사용자의 home 디렉터리로 하겠습니다.  

```bash
wget -O ~/harbor-offline-installer-v2.13.0.tgz https://github.com/goharbor/harbor/releases/download/v2.13.0/harbor-offline-installer-v2.13.0.tgz
```

### 설치 파일 압축 해제  

설치파일을 압축 해제해줍니다.  

```bash
tar xzvf ~/harbor-offline-installer-v2.13.0.tgz -C .
```

압축을 해제하면 harbor 라는 디렉터리가 만들어져 있을 것입니다.  

### 도메인 만들기  

Harbor 를 잘 사용하려면 도메인을 만들어두는 게 좋습니다. duckdns 등의 서비스를 통해 손쉽게 도메인을 만들 수 있습니다. (도메인을 만드는 방법은 생략합니다.)  

[https://www.duckdns.org/](https://www.duckdns.org/)  

또한 도메인을 만든 후, 서버에 웹서버(nginx 를 권장)가 실행되고 있고, 그 웹서버가 80포트 및 443 포트를 수신할 수 있도록 `nginx.conf` 와 `방화벽` 을 설정하시기 바랍니다. (이 부분 역시 생략합니다.)  

### 도메인 기반 인증서 발급  

certbot 을 통해 도메인 기반 인증서를 발급하고, 자동으로 인증서가 갱신되게 세팅해보겠습니다.  

certbot 설치  

```bash
sudo dnf install epel-release -y
sudo dnf install certbot python3-certbot-nginx -y
```

도메인 기반 인증서 생성 (nginx)  

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

여기까지 실행했을 때 오류가 나지 않고, 인증서의 위치가 출력된다면 정상적으로 인증서가 설치된 것입니다.  

```bash
Successfully received certificate.

Certificate is saved at: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
Key is saved at: /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

참고로, 현재 harbor 를 서빙 하기 위해 구축중인 웹서버 구성도를 아래와 같이 첨부합니다.  

![](/assets/images/20250502_002_001.png)  

이 구조에서는 호스트에 설치된 Nginx 가 유저의 요청을 받고, 이를 Harbor Nginx 로 보내게 됩니다. 조금 복잡하지만, 이렇게 구성하면 하나의 머신에서도 Harbor 뿐만 아니라 다른 서비스들을 함께 서빙할 수 있습니다.   

### harbor.yml.tmpl 파일 수정  

앞서 압축을 해제한 harbor 디렉터리에는 `harbor.yml.tmpl` 이라는 파일이 있습니다. 이 파일은 harbor 를 빌드하고 배포할 때 사용되는 주요한 설정값들이 명세된 파일입니다. 이 파일을 복사한 뒤, 수정해보도록 하겠습니다.  

```bash
cp ~/harbor/harbor.yml.tmpl ~/harbor/harbor.yml
sudo vi ~/harbor/harbor.yml
```

아래 항목들을 수정합니다.  

```yaml
# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: yourdomain.com

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 10080
  
# https related config --> https 블록 주석합니다.
# https:
  # https port for harbor, default is 443
  # port: 443
  # The path of cert and key files for nginx
  # certificate: /dev/null
  # private_key: /dev/null
  # enable strong ssl ciphers (default: false)
  # strong_ssl_ciphers: false

...

# The initial password of Harbor admin
# It only works in first time to install harbor
# Remember Change the admin password from UI after launching Harbor.
harbor_admin_password: Harbor12345

...

# The default data volume
data_volume: /path/to/harbor/data

```

| 항목                         | 설명                                                                         | 값                        |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------ |
| hostname                   | harbor 에 접속할 때 사용할 도메인 이름                                                  | 발급한 도메인이름을 입력            |
| http                       | 요청을 받을  http포트 (외부를 향하는 포트)<br>호스트 nginx 가 요청을 보낼 포트입니다.                   | 임의의 포트를 입력               |
| https                      | https 설정<br>                                                               | 사용하지 않을 것이므로<br>해당 블록 주석 |
| harbor_admin_password      | harbor 어드민 비밀번호                                                            | 잘 설정해줍니다.                |
| data_volume                | harbor가 사용하는 데이터를 저장할 path<br>호스트에 저장되므로 호스트의 경로 입력                        | e.g. /data/harbor        |
| certificate<br>private_key | SSL 인증에 사용될 키파일 경로<br>harbor 에서 https 를 사용하지 않더라도<br>내부 에러 방지를 위해 경로 설정 필수 | /dev/null                |

### 빌드하기 prepare  

`harbor.yml` 파일의 수정까지 완료했다면 이제 harbor 를 빌드해줄 차례입니다. ~/harbor 디렉터리에 있는 `prepare` 파일을 실행시켜보겠습니다. docker.sock 에 접근이 가능해야 하므로 반드시 `sudo` 옵션을 사용해야 합니다.    

```bash
sudo ~/harbor/prepare
```

해당 파일은 도커 이미지를 pull 하고, 여러 가지 환경 설정 들을 할 것입니다. 완료되면 아래와 같은 메세지를 볼 수 있습니다.  

```bash
Successfully called func: create_root_cert
Generated configuration file: /compose_location/docker-compose.yml
Clean up the input dir
```

prepare 가 완료됐다면, `~/harbor` 디렉터리에 `docker-compose.yml` 파일이 생성되었을 것입니다. 설정대로 잘 빌드되었는지 확인하려면 proxy 서비스의 port-forwarding 정책을 살펴보면 됩니다.   

```yaml
    proxy:
        ...
        ports:
          - <harbor.yml에 설정한 포트>:8080
```

### 실행하기  

자 이제 실행해보도록 하겠습니다. docker-compose 명령어를 통해 실행합니다.  

```bash
sudo docker compose up -d
```

아래와 같이 모두 Running 되면, 성공적으로 기동된 것입니다.  

```bash
[+] Running 9/9
 ✔ Container harbor-log         Running     0.0s
 ✔ Container harbor-portal      Running     0.0s
 ✔ Container registry           Running     0.0s
 ✔ Container registryctl        Running     0.0s
 ✔ Container redis              Running     0.0s
 ✔ Container harbor-db          Running     0.0s
 ✔ Container harbor-core        Running     0.0s
 ✔ Container harbor-jobservice  Running     0.0s
 ✔ Container nginx              Started     0.4s
```

### 호스트 nginx 설정  

호스트의 nginx 에서 프록시를 제대로 설정해줍니다. `yourdomain.com` 으로 들어오는 요청이 harbor 서비스를 제대로 향할 수 있도록 아래 설정들을 점검해주세요.  

```bash
sudo vi /etc/nginx/nginx.conf
```

우선은 수정할 블록을 찾아줍니다. 새로 발급받은 도메인이 `yourdomain.com` 이라고 한다면, `server_name  yourdomain.com;` 이라는 내용이 있는 블럭을 찾아주면 됩니다. 해당 블럭을 아래와 같이 수정해주세요.  

```yaml
...
server {
	server_name yourdomain.com;
	...
	location / {
		proxy_pass http://127.0.0.1:10080    # harbor.yml 에 선언한 포트
		...
		proxy_set_header X-Forwarded-Proto $scheme;    # 꼭 추가하기
		...
	}
}
```

주요 변경점은 아래와 같습니다.  

| 항목               | 설명                                       | 값                                         |
| ---------------- | ---------------------------------------- | ----------------------------------------- |
| proxy_pass       | 요청받은 내용을 전달할 곳                           | http://127.0.0.1:<harbor.yml에 쓴 harbor포트> |
| proxy_set_header | 프록시 대상에게 원래 요청이 http 인지 https 인지 알려주는 설정 |                                           |
nginx 서비스를 재기동해줍니다.  

```bash
sudo systemctl restart nginx
```

## 접속해보기  

### 접속해보기  

이제 브라우저 주소창에 harbor 도메인을 입력해 접속해봅니다.  

![](/assets/images/20250502_002_002.png)  

위와 같이 harbor 로그인페이지가 나온다면 성공입니다.  

### 로그인하기  

먼저 최초로는 admin 으로 로그인을 해야합니다. 사용자 이름은 `admin` 이고, 비밀번호는 `harbor.yml` 파일에 기재한 비밀번호를 사용하면 됩니다.  

| 구분           | 값                         |
| ------------ | ------------------------- |
| 어드민계정 사용자 이름 | admin                     |
| 비밀번호         | `harbor.yml` 파일에 설정한 비밀번호 |

```yaml
# ~/harbor/harbor.yml

# The initial password of Harbor admin
# It only works in first time to install harbor
# Remember Change the admin password from UI after launching Harbor.
harbor_admin_password: <여기에 입력한 비밀번호>
```

접속하면 아래와 같이 프로젝트 페이지를 볼 수 있습니다.  

![[Pasted image 20250502024810.png]]  


## Reference  

[Harbor Installation Prerequisites](https://goharbor.io/docs/2.13.0/install-config/installation-prereqs/)  
[Download the Harbor Installer](https://goharbor.io/docs/2.13.0/install-config/download-installer/)    
[Configure HTTPS Access to Harbor](https://goharbor.io/docs/2.13.0/install-config/configure-https/)   
[Configure the Harbor YML File](https://goharbor.io/docs/2.13.0/install-config/configure-yml-file/)  
[Run the Installer Script](https://goharbor.io/docs/2.13.0/install-config/run-installer-script/)  

