---
title: 리눅스 swap 오류 Dependency failed for swap.mount # 제목 (필수)
excerpt: Dependency failed for swap.mount # 서브 타이틀이자 meta description (필수)
date: 2024-10-02 11:00:00 +0900      # 작성일 (필수)
lastmod: 2024-10-02 11:00:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2024-10-02 11:00:00 +0900   # 최종 수정일 (필수)
categories: [TroubleShooting, Linux]         # 다수 카테고리에 포함 가능 (필수)
tags: linux 리눅스 swap 스왑 dependency failed for swap mount                     # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
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
<!--postNo: 20241002_001-->


## 에러 메시지  

```bash
user systemd[1]: dev-disk-by\x2duuid-[uuid].device: Job dev-disk-by\x2duuid-[uuid].device/start timed out
# >> 특정 디바이스를 시작하는 데 시간이 너무 오래걸렸음  
# >> 운영체제 부팅 시 인식하려는 하드웨어 장치나 파일 시스템이 응답하지 않거나 연결 실패
# >> 하드웨어 장치 오류, 디바이스 드라이버 문제, 디스크의 물리적 오류 등

user systemd[1]: Timed out waiting for device dev-disk-by\x2duuid-[uuid].device - /dev/disk/by-uuid/[uuid]
# >> 상동

user systemd[1]: Dependency failed for swap.mount - /swap.
# >> 스왑 파티션(/swap)을 마운트하는 데 실패했음
# >> 스왑 : 주 메모리(RAM) 가 부족할 때 디스크 공간을 임시로 사용하는 영역
# >> 이 에러는 스왑 파일 또는 스왑 파티션이 손상되었거나 설정 오류가 있음을 뜻함
# >> 주로 /etc/fstab에 정의된 파일 시스템 경로가 잘못되었거나, 파티션이 손상된 것이 원인

user systemd[1]: Dependency failed for local-fs.target - Local File Systems.
# >> 로컬 파일 시스템을 마운트하는 데 실패했음
# >> local-fs.target : 로컬 디스크에 있는 파일 시스템을 마운트하는 것을 담당하는 서비스
# >> 루트 파일 시스템이나 특정 파티션이 손상되었을 경우 발생하는 오류
```

## 원인  

### 예상 원인  

에러 메세지를 통해 파악한 예상 원인들을 체크 및 조치하기 쉬운 순서대로 나열하자면 아래와 같다.  

(1) 스왑 설정 오류 (fstab)  
(2) 스왑 파일의 손상  
(3) 스왑 파티션의 손상  
(4) 루트 파일 시스템 손상  
(5) 파티션 중 일부 손상  

4, 5번 원인일 경우 복구에 어려움을 겪을 것이 예상된다.  

### 현황 파악 - 파티션 리스트  

```bash
sudo lsblk
>> NAME    ...    TYPE    MOUNTPOINTS
>> sda            disk    
>> └─md0          raid1    
>>   └─md0p1      part    /home
>> sdb            disk
>> └─md0          raid1
>>   └─md0p1      part    /home
>> nvme0n1        disk
>> └─nvme0n1p1    part    /boot/efi
>> └─nvme0n1p2    part    /boot
>> └─nvme0n1p3    part    [SWAP]   # swap 파티션
>> └─nvme0n1p4    part    /
```


## 원인 파악 및 해결

### 원인 파악 (1) 스왑 설정 오류  

/etc/fstab에 파일 시스템 경로가 제대로 설정되어있는지 확인한다.  

```bash
cat /etc/fstab
>> /dev/nvme0n1p3    none    swap    sw    0    0
```

위 처럼 설정되어있다면 정상적으로 설정된 것이다. 문제 없으므로 패스.  

### 원인 파악 (2) 스왑 파일의 손상 및 스왑 파티션의 손상  

스왑 파일 및 스왑 파티션이 손상되었을 경우, 스왑 파티션을 다시 잡아줌으로써 해결할 수 있다.

```bash
# 스왑 파티션 비활성화
swapoff -a

# 스왑 파티션 다시 생성
mkswap /dev/nvme0n1p3

# 스왑 파티션 활성화
swapon /dev/nvme0n1p3
```

스왑이 정상적으로 잡혔는지 보려면 free 명령어 혹은 swapon --show 명령어로 확인할 수 있다.  

```bash
free -h
>>       total  used   free   shared  buff/cache  available
>> Mem:  123Gi  1.8Gi  120Gi  9Mi     1.6Gi       121Gi
>> Swap: 15Gi   0B     15Gi

swapon --show
>> NAME           TYPE       SIZE  USED PRIO
>> /dev/nvme0n1p3 partition  16G   0B   -2
```

재부팅 결과, 정상적으로 부팅됨을 확인했다.  