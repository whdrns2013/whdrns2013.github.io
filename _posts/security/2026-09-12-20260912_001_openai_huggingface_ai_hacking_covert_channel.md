---
title: "OpenAI HuggingFace 해킹 사건 4.의도하지 않은 기능이 통신 수단이 될 때: 은닉 채널(Covert Channel)" # 제목 (필수)
excerpt: "크루세이더 킹즈 채팅 모드와 OpenAI 사례로 이해하는 은닉 채널(Covert Channel)" # 서브 타이틀이자 meta description (필수)
date: 2026-09-12 00:49:00 +0900      # 작성일 (필수)
lastmod: 2026-09-12 00:49:00 +0900   # 최종 수정일 (필수)
last_modified_at: 2026-09-12 00:49:00 +0900  # 최종 수정일 (필수)
categories: security       # 다수 카테고리에 포함 가능 (필수)
tags: OpenAI 허깅페이스 Hugging Face HuggingFace AI 에이전트 agent 자율형 해킹 hacking 은닉 채널 은닉채널 covert channel 크루세이더 킹즈 3 크루세이더킹즈3 Crusader Kings III DNS 터널링 Tunneling 스테가노그래피 Steganography
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
series: openai_huggingface_hacking
series_index: 4
---

<!--postNo: 20260912_001-->

## 은닉 채널 Covert Channel  

이전 글에서는 OpenAI HuggingFace 해킹 사건에서 모델들이 비공식 커뮤니티를 만들고, 그 안에서 집단지성과 협업 구조를 구축해 나간 사례를 자세히 살펴보았다.  

에이전트들이 만들어낸 비공식 커뮤니티는 보안 분야에서 **Covert Channel(은닉 채널)**이라고 부르는 개념과 매우 유사하다. 이는, 원래 **정보 전달을 위해 만들어진 게 아닌 시스템의 기능이나 공유 자원을 통신 수단으로 사용하는 것**을 의미한다.  

이 은닉 채널과 관련해서 직장 동료와 이야기하다 알게 된 재밌는 사례가 있어 소개해보려고 한다.

## Crusader Kings III  

### Crusader Kings III  

크루세이더 킹즈는 패러독스 인터랙티브에서 개발한 전략 게임이다. 이 게임은 서기 1066년부터 1453년까지의 중세 유럽과 중동 등을 배경으로 한다. 동료에게 들은 바로는 상당히 어려운 게임이라고 하는데, 나는 직접 플레이해 보지는 않았다.

![](/assets/images/20260912_001_001.jpg)  

이미지 출처 : [https://www.paradoxinteractive.com/games/crusader-kings-iii/about](https://www.paradoxinteractive.com/games/crusader-kings-iii/about)

이 게임은 싱글플레이모드 뿐 아니라 멀티플레이 모드도 제공했는데, 문제가 한 가지 있었다. 바로 **멀티플레이 모드에서 유저 간 채팅 기능이 없었던 것**. 많은 유저들이 이에 불편함을 느끼던 와중, 한 유저가 채팅모드를 만들어 배포하기 시작했다.

### 채팅 모드의 등장

![](/assets/images/20260912_001_002.jpg)  

이미지 출처 : [Crusader Kings III sharedfiles - In-game Chat](https://steamcommunity.com/sharedfiles/filedetails/?id=2259037199)

채팅 모드가 등장하자 사용자들은 모드를 만들어 준 사람에게 감사를 표하면서 잘 사용했다. 그러던 어느 날, 한 유저가 우연하게 kill list를 보다가 이 채팅 모드의 원리를 알게 되었는데, 그 원리는 바로..

![](/assets/images/20260912_001_003.jpg)  

이미지 출처 : [https://bbs.ruliweb.com/etcs/board/300781/read/58106917](https://bbs.ruliweb.com/etcs/board/300781/read/58106917)  

원리는 변방의 벵골 지역에 캐릭터를 태어나게 한 뒤, 그 캐릭터의 이름을 사용자가 작성한 메시지를 이름으로 붙이는 방식이었다. 크루세이더 킹즈에서는 게임 안에서 아이가 태어나면 그 이름을 화면 하단에 메시지로 보여준다. 모드 개발자는 이 시스템을 이용해 사용자가 입력한 메시지를 이름으로 가진 캐릭터를 생성하고, 이를 통해 멀티플레이 채팅을 구현한 것이다.  

이후 이렇게 생긴 캐릭터를 죽여 정리했기 때문에, 킬 리스트에는 채팅 메시지들이 남게 된 것이다.  

### 해당 채팅 모드를 살펴보자    

아래의 모드로 추정된다.

![](/assets/images/20260912_001_004.jpg)  

이미지 출처 : [Crusader Kings III sharedfiles - In-game Chat](https://steamcommunity.com/sharedfiles/filedetails/?id=2259037199)  

이 모드가 커뮤니티 글에서 언급된 바로 그 모드인지는 확실하지 않지만, 모드 개발자가 소개 글에 직접 "채팅 메시지는 킬 리스트에 포함된다"고 적어 둔 것을 보면, 아마 맞지 않을까 싶다.  

![](/assets/images/20260912_001_006.jpg)  

이미지 출처 : [Crusader Kings III sharedfiles - In-game Chat](https://steamcommunity.com/sharedfiles/filedetails/?id=2259037199)  

> chat messages will show up in your kill list...  
> 채팅 메시지는 당신의 킬 리스트에 보일 겁니다...

하지만 이 모드를 만든 사용자는 이후 킬 리스트를 이용하지 않는 다른 방식을 고민했고, 그 결과 채팅 메시지가 더 이상 킬 리스트에 표시되지 않도록 변경했다고 한다. 따라서 지금은 과거와 같은 현상을 확인하기 어려울 것으로 추측된다.

![](/assets/images/20260912_001_007.jpg)  

이미지 출처 : [Crusader Kings III sharedfiles - In-game Chat](https://steamcommunity.com/sharedfiles/filedetails/?id=2259037199)   

그런데 이 사용자는 2020년에 이 모드를 처음 개발한 뒤, 2026년 최근까지도 업데이트를 이어 오고 있다. 굉장히 책임감 있는 사람이지 않을까 생각한다.  

## Covert Channel과 Covert Storage Channel  

### 1. 정의  

NIST(미국 국립 표준기술연구소)에서는 Covert Channel과 Covert Storage Channel에 대해 이렇게 정의하고 있다.  

- Covert Channel  

> An unintended or unauthorized intra-system channel that enables two cooperating entities to transfer information in a way that violates the system's security policy but does not exceed the entities' access authorizations.
> 두 주체가 시스템의 **보안 정책을 위반하는 방식**으로 정보를 전송할 수 있게 하면서, 해당 개체들의 접근 권한은 초과하지 않는, "의도하지 않거나 승인되지 않은 시스템 내부 채널"  

- Covert Storage Channel

> A system feature that enables one system entity to signal information to another entity by directly or indirectly writing a storage location that is later directly or indirectly read by the second entity.
> 한 시스템 개체가 **특정 저장 공간에** 직접 또는 간접적으로 데이터를 쓰고, 이후 다른 개체가 이를 직접 또는 간접적으로 읽음으로써 정보를 전달할 수 있도록 지원하는 시스템 기능.

### 2. 크루세이더 킹즈 채팅 모드 사례는 Covert Channel일까?  

그렇다면 앞에서 살펴본 크루세이더 킹즈 채팅 모드 사례는 Covert Channel에 해당할까? 이에 대해 명확하게 판단할 수 있는 근거는 찾기 어렵다.

NIST의 정의를 기준으로 엄밀하게 말하자면, 이 채팅 모드는 **보안 정책을 위반하지는 않는 것으로 보인다**. 다만 원래 통신을 목적으로 만들어지지 않은 저장 공간인 캐릭터 이름에 메시지를 기록하고, 이를 통해 정보를 전달했다는 점에서는 **Covert Storage Channel과 유사**하다고 볼 수 있지 않을까 싶다.

### 3. OpenAI의 에이전트들이 만든 커뮤니티는 Covert Channel일까?  

그러다면 이전 글에서 살펴본, OpenAI의 에이전트들이 아티팩토리에 구축한 커뮤니티는 어떨까? 이건 **의심의 여지 없이 Covert Channel** 이라고 생각한다.  

- 에이전트들이 인터넷에 접속하거나 다른 에이전트와 통신할 수 없도록 격리했다.
- 아티팩토리는 통신 수단이 아니라, 패키지를 받아 제공해주는 역할을 한다.
- 에이전트들은 아티팩토리에 파일 내용 또는 폴더명으로 서로 메시지를 주고 받았다.  

위 세 가지를 사실을 봣을 때, 에이전트들은 **보안상 위배되는 방법으로 의도되지 않은 정보 전송 채널을 만들었기 때문**에 이것은 Covert Channel에 해당한다.

## 비슷한 사례들  

이와 비슷한 사례들은 무엇이 있는지 짧고 간단하게 살펴보도록 하자.  

### 1. DNS Tunneling  

DNS Tunneling은 DNS 요청·응답 안에 원래 DNS와 관계없는 데이터를 숨겨서 통신하는 방식이다. (DNS가 무엇인지에 대한 설명은 생략한다.) 대표적으로는 인터넷 통신은 막혀 있으면서 DNS 요청은 허용되는 환경에서, 보내고 싶은 데이터를 도메인 이름에 끼워 넣어 외부로 전달하는 방법이 있다.  

```plaintext
Client
  │ www.736563726574.example.com
  ▼
DNS Server
  │ 93.184.216.34 + 736563726574
  ▼
Client
  │ Decoding
  ▼
'secret'
```

### 2. Steganography  

스테가노그래피는 전달하려는 메시지를 다른 사람이 알아채기 어렵게 숨겨 전달하는 기법이다. 과거에는 논문으로 위장한 글에 특정 패턴을 이용해 암호화된 메시지를 삽입하거나, 일반적으로 눈에 보이지 않는 투명 잉크를 사용해 메시지를 기록하는 방식이 있었다.  

현대에는 이미지, 음성, 비디오와 같은 디지털 매체에 메시지를 숨기는 스테가노그래피 기술도 개발되었다. 이미지의 픽셀을 일정한 규칙에 따라 변경하거나, 음성 파일의 에코를 수정하는 등의 작업을 통해 매체 안에 숨겨진 메시지를 추출할 수 있다.

![](/assets/images/20260912_001_008.jpg)  

아래는 “SECRET”이라는 글자가 쓰인 이미지를 오디오 파일로 변환한 뒤, 이 오디오 파일을 다시 스펙트로그램으로 변환해 원본 이미지에 있던 글자를 확인하는 실습이다.

![](/assets/images/20260912_001_009.jpg)  

먼저 이미지를 하나 준비하고(직접 준비하면 된다.), 아래 코드를 통해 음성 파일로 변환한다. 내 경우, Secret 이라는 문자가 쓰여진 이미지를 변환하니 "뚜~" 하는 일정한 소음 오디오 파일로 변환되었다.   


```python
from PIL import Image
import numpy as np
from scipy.io.wavfile import write

# 이미지 로드
img = Image.open("secret.png").convert("L")

# 크기를 줄여 계산량 감소
img = img.resize((300, 100))

pixels = np.array(img) / 255.0

sample_rate = 44100
duration_per_column = 0.01

min_freq = 500
max_freq = 8000

frequencies = np.linspace(
    max_freq,
    min_freq,
    pixels.shape[0]
)

samples_per_column = int(sample_rate * duration_per_column)

audio = []

for x in range(pixels.shape[1]):

    t = np.arange(samples_per_column) / sample_rate
    signal = np.zeros(samples_per_column)

    for y in range(pixels.shape[0]):

        amplitude = pixels[y, x]

        if amplitude > 0.1:
            signal += amplitude * np.sin(
                2 * np.pi * frequencies[y] * t
            )

    # clipping 방지
    if np.max(np.abs(signal)) > 0:
        signal /= np.max(np.abs(signal))

    audio.extend(signal)

audio = np.array(audio)

write(
    "secret.wav",
    sample_rate,
    (audio * 32767).astype(np.int16)
)
```

그 다음엔 이 오디오파일을 스펙토그램으로 그려본다.  

```python
from scipy.io.wavfile import read
import matplotlib.pyplot as plt

sample_rate, audio = read("secret.wav")

plt.figure(figsize=(12, 5))

plt.specgram(
    audio,
    Fs=sample_rate,
    NFFT=1024,
    noverlap=900
)

plt.ylim(500, 8000)
plt.xlabel("Time")
plt.ylabel("Frequency")

plt.show()
```

그 결과 아래와 같이 원래 “Secret”이라고 적혀 있던 이미지의 형태를 (연하게) 다시 확인할 수 있다.

![](/assets/images/20260912_001_010.jpg)  

## Reference  

[https://ko.wikipedia.org/wiki/크루세이더_킹즈](https://ko.wikipedia.org/wiki/%ED%81%AC%EB%A3%A8%EC%84%B8%EC%9D%B4%EB%8D%94_%ED%82%B9%EC%A6%88)  
[https://www.paradoxinteractive.com/games/crusader-kings-iii/about](https://www.paradoxinteractive.com/games/crusader-kings-iii/about)  
[https://steamcommunity.com/sharedfiles/filedetails/?id=2259037199](https://steamcommunity.com/sharedfiles/filedetails/?id=2259037199)  
[https://bbs.ruliweb.com/etcs/board/300781/read/58106917](https://bbs.ruliweb.com/etcs/board/300781/read/58106917)  
[https://en.wikipedia.org/wiki/Covert_channel](https://en.wikipedia.org/wiki/Covert_channel)  
[https://csrc.nist.gov/glossary/term/covert_channel](https://csrc.nist.gov/glossary/term/covert_channel)  
[https://csrc.nist.gov/glossary/term/covert_storage_channel](https://csrc.nist.gov/glossary/term/covert_storage_channel)  
[https://core-research-team.github.io/2020-05-01/DNS-Tunneling](https://core-research-team.github.io/2020-05-01/DNS-Tunneling)  
[https://en.wikipedia.org/wiki/Steganography](https://en.wikipedia.org/wiki/Steganography)