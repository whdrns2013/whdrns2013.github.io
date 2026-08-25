---
title: "[Nmap] 스캔 속도를 조절하는 타이밍 템플릿 (-T)" # 제목 (필수)
excerpt: "스캔 속도 조절 옵션. 속도와 정확성 사이의 트레이드오프, 그리고 가장 효율적인 옵션 찾기" # 서브 타이틀이자 meta description (필수)
date: 2026-08-25 21:32:00 +0900      # 작성일 (필수)
lastmod: 2026-08-25 21:32:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-08-25 21:32:00 +0900  # 최종 수정일 (필수)
categories: network       # 다수 카테고리에 포함 가능 (필수)
tags: nmap network scanning port scan timint template t 재전송 패킷 재전송 T4 T5 T3                   # 태그 복수개 가능 (필수)
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
  nav: 
pinned: 
series: 
series_index:
---
<!--postNo: 20260825_002-->


# nmap - Timing Template

## Timing Template `-T`

### 1. Timing Template이란  

Nmap은 네트워크 탐색을 위해 대상에게 수많은 패킷을 보내고 응답을 기다린다. 이때 효율적인 스캔을 위해서는 다음과 같은 사항들을 고려해야 한다.  

- 얼마나 빨리 패킷을 보낼까?
- 응답을 몇 초 기다릴까?
- 응답이 없으면 몇 번 재시도할까?
- 동시에 몇 개를 검사할까?

하지만 수많은 패킷을 보내면서 이러한 옵션들을 하나하나 세밀하게 조정하고 관리하는 것은 힘든 일이다. 이러한 번거로움을 해결하기 위해 Nmap이 미리 준비해놓은 **속도 정책 묶음**이 Timing Template이다.  

<br>

### 2. Timing Template의 종류  

| 항목                                                | T0                    | T1                    | T2                    | T3                    | T4                    | T5                    |
| ------------------------------------------------- | --------------------- | --------------------- | --------------------- | --------------------- | --------------------- | --------------------- |
| **Name**                                          | Paranoid              | Sneaky                | Polite                | Normal                | Aggressive            | Insane                |
| **min-rtt-timeout**   <br> 응답을 기다리는 최소 시간                            | 100 ms                | 100 ms                | 100 ms                | 100 ms                | 100 ms                | 50 ms                 |
| **max-rtt-timeout**   <br> 응답을 기다리는 최대 시간                            | 5 minutes             | 15 seconds            | 10 seconds            | 10 seconds            | 1250 ms               | 300 ms                |
| **initial-rtt-timeout**   <br> 처음에 응답을 얼마나 기다릴지                        | 5 minutes             | 15 seconds            | 1 second              | 1 second              | 500 ms                | 250 ms                |
| **max-retries**  <br> 최대 재시도 횟수                                 | 10                    | 10                    | 10                    | 10                    | 6                     | 2                     |
| **Initial / minimum scan delay** <br> (`--scan-delay`) <br> probe 사이 최소 지연시간| 5 minutes             | 15 seconds            | 400 ms                | 0                     | 0                     | 0                     |
| **Maximum TCP scan delay**   <br> TCP 스캔 지연시간 상한                     | 5 minutes             | 15 seconds            | 1 second              | 1 second              | 10 ms                 | 5 ms                  |
| **Maximum UDP scan delay**   <br> UDP 스캔 지연시간 상한                     | 5 minutes             | 15 seconds            | 1 second              | 1 second              | 1 second              | 1 second              |
| **host-timeout**    <br> 호스트 전체 스캔 제한시간                              | 0                     | 0                     | 0                     | 0                     | 0                     | 15 minutes            |
| **script-timeout**    <br> NSE 스크립트 제한시간                            | 0                     | 0                     | 0                     | 0                     | 0                     | 10 minutes            |
| **min-parallelism**   <br> 최소 병렬 probe 수 <br> 동시에 최소 몇 개의 요청을 날릴지                           | Dynamic               | "               | "               | "               | "               | "               |
| **max-parallelism**  <br> 최대 병렬 probe 수 <br> 동시에 최대 몇 개의 요청을 날릴지                             | 1                     | 1                     | 1                     | Dynamic               | Dynamic               | Dynamic               |
| **min-hostgroup**   <br> 최소 동시 호스트 그룹 크기  <br> 여러 호스트 스캔 시 최소 몇 대씩 묶어 처리할지                            | Dynamic               | "               | "               | "               | "               | "               |
| **max-hostgroup**   <br> 최대 동시 호스트 그룹 크기  <br> 여러 호스트 스캔 시 최대 몇 대씩 묶어 처리할지                              | Dynamic               | "               | "               | "               | "               | "               |
| **min-rate**  <br>  최소 패킷 전송률 <br> 초당 최소 몇 개의 패킷을 보내도록 강제                                   | No minimum rate limit | " | " | " | " | " |
| **max-rate**     <br> 최대 패킷 전송률                                 | No maximum rate limit | " | " | " | " | " |
| **defeat-rst-ratelimit**  <br> 대상 OS의 TCP 응답 제한을 고려한 속도 최적화                        | Not enabled by default           | "         | "         | "         | "         | "         |

[https://nmap.org/book/performance-timing-templates.html](https://nmap.org/book/performance-timing-templates.html)

요약해보자면 아래와 같다.  

| 옵션    | 이름         |    속도 | 일반적 성격            |
| ----- | ---------- | ----: | ----------------- |
| `-T0` | Paranoid   | 매우 느림 | 극단적으로 보수적         |
| `-T1` | Sneaky     | 매우 느림 | 매우 느린 탐색          |
| `-T2` | Polite     |    느림 | 네트워크 부하 감소        |
| `-T3` | Normal     |    보통 | 기본값               |
| `-T4` | Aggressive |    빠름 | 빠르고 안정적인 네트워크에 적합 |
| `-T5` | Insane     | 매우 빠름 | 지나치게 공격적일 수 있음    |

기본값은 `-T3`

<br>

### 3. 가장 빠른 `-T5` 가 좋은 게 아닐까?   

그렇지만은 않다. 너무 빠르게 스캔해버리면  

```plaintext
Nmap
 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
패킷 대량 전송
 ↓
네트워크 지연
 ↓
응답 늦음
 ↓
Nmap timeout
 ↓
실제로 열린 포트를 놓칠 가능성
```

위와 같이 젣로 된 탐색이 안될 수 있다.  

특히 인터넷, VPN, 느린 서버, 불안정한 네트워크, 방화벽 등이 있을 때 더 문제이다.  

따라서 속도를 높이는 것과 정확성 사이에는 **trade off** 가 있다.

<br>

### 4. 탐색에 적용해보기  

타이밍 템플릿에 따른 속도와 탐색 정확도를 알아보고자 교차실험을 진행했다. 아래 결과는 각 옵션별로 5회씩 반복 시행 후 성능과 정확성을 평균낸 결과이다.

- `T1` 옵션 : 측정 중단 (너무 오래 기다려야 해서 측정 중단)  


- `T2` 옵션 : 354.22초  

평균 : 354.22초  
중앙값 : 406.60초  

```bash
sudo nmap -T2 -Pn -p 1-1000 192.168.100.2

>> 포트 2개 탐지
>> Nmap done: 1 IP address (1 host up) scanned in 341.11 seconds
```

|구분|1회|2회|3회|4회|5회|평균|
|---|---|---|---|---|---|---|
|시간|341.11|410.38|406.72|406.60|233.29|354.22|
|탐지개수|2|2|2|2|2|2|

<br>

- `T3` 옵션 : 2.394초  

평균 : 2.394초  
중앙값 : 2.03초  

```bash
sudo nmap -T3 -Pn -p 1-1000 192.168.100.2

>> 포트 2개 탐지
>> Nmap done: 1 IP address (1 host up) scanned in 2.02 seconds
```

|구분|1회|2회|3회|4회|5회|평균|
|---|---|---|---|---|---|---|
|시간|2.02|1.94|2.03|3.27|2.71|2.374|
|탐지개수|2|2|2|2|2|2|

<br>

- `T4` 옵션 : 2.19초  

평군 : 2.19초  
중앙값 : 1.98초  

```bash
sudo nmap -T4 -Pn -p 1-1000 192.168.100.2

>> 포트 5개 탐지
>> Nmap done: 1 IP address (1 host up) scanned in 3.07 seconds
```

|구분|1회|2회|3회|4회|5회|평균|
|---|---|---|---|---|---|---|
|시간|3.07|2.03|1.97|1.98|1.90|2.19|
|탐지개수|2|2|2|2|2|2|

<br>

- `T5` 옵션 : 2.786초  

평균 : 2.786초  
중앙값 : 2.90초  

```bash
sudo nmap -T5 -Pn -p 1-1000 192.168.100.2

>> 포트 5개 탐지
>> Nmap done: 1 IP address (1 host up) scanned in 2.90 seconds
```

|구분|1회|2회|3회|4회|5회|평균|
|---|---|---|---|---|---|---|
|시간|2.90|3.19|2.74|3.16|1.94|2.786|
|탐지개수|2|2|2|2|2|2|

음...? 왜 더 느리지?  

<br>

### 5. 탐색 리뷰  

- 예상했던대로 T1 -> T5 방향으로 갈 수록 평균적인 처리 속도가 빨라짐을 볼 수 있다.
- 단, **T5에서는 오히려 T3, T4보다 평균 소요시간이 길게 나오며, 예상과 다른 결과**를 보여줬다.  

<br>

### 6. T5가 T3보다 느린 측정 속도를 보인 이유

T5 옵션이 T3보다 느린 처리 속도를 보이는 이 현상에 대한 ChatGPT의 해석은 아래와 같다.  

#### (1) 패킷 드롭과 재전송 발생  

* **T5(Insane)의 특성**: `-T5`는 극단적으로 패킷을 빠르게 쏟아붓고, 응답 대기 시간(Probe Timeout)을 수 밀리초(최대 300ms 이하) 수준으로 극도로 짧게 잡는다.  
* **병목 현상**: 가상 환경이나 로컬 네트워크(192.168.100.x)라 하더라도, 단일 호스트를 상대로 1,000개의 포트를 순식간에 찌르면 대상 시스템의 네트워크 스택(OS 커널/버퍼)이나 가상 스위치가 패킷을 감당하지 못하고 **패킷 유실(Drop)**이 발생함  
* **지연 원인**: Nmap은 응답을 받지 못하면 해당 포트가 열려 있는지 닫혀 있는지 확신할 수 없어 **패킷 재전송(Retry)**을 시도하고, 이게 반복되면서 오히려 전체 스캔 시간이 늘어나게 됨  

#### (2) 대상 호스트의 레이트 리미팅  

* 리눅스나 윈도우 등 대부분의 OS는 DoS 공격 방어를 위해 **초당 보낼 수 있는 RST(Closed 포트 응답) 또는 ICMP 패킷 수에 제한(Rate Limit)**을 둔다.  
* `-T3`는 적당한 간격으로 패킷을 보내 대상 OS가 정상적으로 RST 응답을 주어 포트가 닫혀 있음을 즉시 인지하는 데 반해,  
* 반면 `-T5`는 OS의 응답 한계를 초과하여 패킷을 보내기 때문에, 대상 OS가 응답을 버리게 되고 Nmap은 타임아웃까지 대기한 뒤 재시도를 거치게 된다.  

#### (3) RTT(왕복 시간) 계산 왜곡 및 너무 짧은 타임아웃  

* `-T5`는 최소/최대 RTT 타임아웃을 극단적으로 짧게 고정한다.  
* 하지만 순간적인 네트워크 큐잉(Queueing) 지연으로 인해 응답이 몇 밀리초만 늦어져도 Nmap은 패킷이 유실된 것으로 판단하고 타임아웃 처리 후 재전송 큐에 넣으면서 재시도가 일어난다.  

> 말은 길지만, 결론적으로는 **너무 짧은 요청 텀/ 응답 대기시간으로 인해 기존 요청을 실패로 간주하고 여러 번 재시도를 하다가 오히려 처리 속도가 느려진 것**이라고 요약할 수 있겠다.  

로컬 가상 환경이나 기가비트급 고성능 전용 회선망이 아니라면, 실무나 테스트 환경에서는 `-T4`가 **최적의 최대 속도**를 내며, `-T5`는 오히려 역효과가 나는 경우가 많다고 한다.  

<br>

### 7. T5 - T3간 속도차 가설 검증  

그렇다면 "너무 짧은 요청 텀/응답 대기시간으로 오히려 느려짐" 이라는 **가설을 검증**해 볼 차례이다.   

#### (1) 검증 방법  

- 탐색 대상 포트에 비해 over된 전송 패킷 개수를 각 타이밍 템플릿 옵션별로 정량적으로 비교  
- 전체 소요 시간을 정량적으로 비교  
- 총 10,000개 포트 (1-10,000) 에 `-Pn` 요청을 보낸다.  

#### (2) 검증 결과  

검증 결과, 모든 명령에서 탐색할 포트 개수(10,000)보다 많은 패킷을 전송했으며, 특히 T5에서 가장 많은 over 패킷을 보냈으며, 소요 시간도 가장 길었다.  

|차수|-T3|-T4|-T5|
|---|---|---|---|
|1|10,340 (20.07s)|10,118 (8.61s)|11,278 (29.82s)|
|2|10,715 (32.15s)|10,229 (13.17s)|11,344 (30.25s)|
|3|10,205(17.57s)|10,493 (18.07s)|12,085 (36.21s)|
|평균|10,420 (23.26s)|10,280 (13.28s)|11,596 (32.09s)|

패킷의 목적지 PORT에서 중복이 있는지 찾아본 결과는 아래와 같다.  

![](/assets/images/20260825_002_001.jpg)  

<br>

## Reference  

[https://nmap.org/book/man.html](https://nmap.org/book/man.html)  
[https://nmap.org/book/performance-timing-templates.html](https://nmap.org/book/performance-timing-templates.html)  
[https://www.wireshark.org/download.html](https://www.wireshark.org/download.html)