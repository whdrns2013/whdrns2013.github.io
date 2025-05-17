---
title: "Flutter와 Dart 소개"
excerpt: "Flutter와 Dart 소개"
last_modified_at: 2024-01-21 04:00:00 +0900
permalink: /docs/dart_and_flutter/intro
classes: wide
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_dart_and_flutter"
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image: /assets/images/banners/banner.png
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---

  

## Flutter 란?  

- 구글이 만든 프레임워크  
- 하나의 언어로 멀티 플랫폼 어플리케이션 구축이 가능하다.  
- 2024년 현재 Android, iOS, Web Browser, Windows, Linux, macOS .. 그리고 그 외 많은embedded device 에서 작동이 가능  
- 언어는 Dart 를 이용한다. (Dart 또한 구글에서 만든 프로그래밍 언어이다.)  
- JIT 컴파일 뿐만 아니라 AOT (ahead of time) 컴파일을 지원한다.  

### 장점
- 플러터로 만든 애플리케이션은 멀티 플랫폼에서 사용이 가능하다.  
- 자체 그래픽 엔진을 사용하기 때문에 서로 다른 플랫폼에서도 동일한 디자인과 기능을 장담할 수 있다.  
- 관련 커뮤니케이션이 크고 활동적이며, 커뮤니티에서 공유되는 패키지 또한 많다.  


### 단점  
- 다른 멀티 플랫폼 어플리케이션과 같이, 당연히 네이티브 프레임워크보다는 제어할 수 있는 범위가 좁다.  
- 일반적인 다른 앱보다 무겁다 : 자체 그래픽 엔진을 사용하기 때문에 앱을 배포할 때 코드와 그래픽 엔진 코드가 함께 패키징되어 무겁다.  
- 위와 같은 문제점으로 네이티브 프레임워크에서 사용할 수 있는 UI 컴포넌트, 애니메이션, 제스처 등을 사용하지 못한다.  


### JIT 컴파일과 AOT 컴파일  

아래 포스트를 참고해주세요.  

[JIT 컴파일과 AOT 컴파일](https://whdrns2013.github.io/computerscience/20240113_004_jit_aot_compile/ ) 


## Why Dart?  

![](/assets/images/20240120_001_001.png)

## Portable and fast on adll platforms  

-- 다트는 두 개의 컴파일러를 가지고 있음.  
-- 다트 웹과 다트 네이티브임  
-- 다트 웹 : dart로 작성한 코드를 javascript로 변환하는 컴파일러  
-- 다트 네이티브 : dart로 작성한 코드를 여러 CPU의 아키텍처에 맞게 변환하는 컴파일러  

<b><font color="008080">=> 즉, 다트만으로 거의 모든 기기에서 작동하는 애플리케이션을 만들 수가 있음</font></b>  

![](/assets/images/20240120_001_002.png)


## JIT 컴파일과 AOT 컴파일을 모두 지원  

다트는 JIT, AOT 컴파일을 모두 지원합니다.  
<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>개발시에는 Dart VM을 이용해 JIT 컴파일 방식을 채택 </span>하여 디버깅 등 편리한 개발 환경을 제공하며 그리고 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>배포시에는 AOT 컴파일 방식</span>을 사용하여 기계에서 빠른 작동시간이라는 장점을 함께 취할 수 있습니다.  
따라서 Dart는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>JIT 와 AOT 컴파일의 장점을 모두 취해</span> 개발환경과 실제 작동환경에서 모두 좋은 경험을 얻을 수 있을 것입니다.  

(참고) JIT 컴파일과 AOT 컴파일  
https://whdrns2013.github.io/computerscience/20240113_004_jit_aot_compile/  


## Null Safety  

또한 Dart에서는 Null Safety 를 지향합니다.  
null safety 란, "null" 값에 대한 안전한 프로그래밍을 의미하는데요,  

프로그래밍에서 어떤 함수를 실행시킬 때, 함수가 사용하는 변수가 null 인 경우 runtime 에러가 발생하게 됩니다. 어떨 때에는 어느 변수가 문제를 일으키는지 찾기 위해서 몇 시간을 보내기도 하죠.  

dart는 코드 작성 당시에 이를 막기 위해 함수에 null 값이 들어가지 않도록 하는 여러 가지 문법적 특징을 만들었습니다. <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>nullable 변수, 그리고 Named Parameter, null-aware Operation</span> 등이 그것이죠.  

다음의 포스트들에서 차차 만나보겠지만, 이해를 돕기 위해 몇 가지 예시를 들어보겠습니다.    

### (1) nullable  

첫 번째는 nullable 변수로, 변수를 생성할 때 값이 null 일 수 있는지 여부를 명시적으로 지정할 수 있는 기능입니다.  

```dart
// 값이 Null이 아닌 변수의 선언 (기본)
String nonNullableString = "Hello, Dart";    // -> 정상 처리
String nonBullableString = null;             // -> 비정상 오류

// 값이 Null일 수 있는 변수의 선언 (Null Safety)
String? nullableString = "Hello, Dart";      // -> 정상 처리
String? nullableString = null;               // -> 정상 처리
```

### (2) Named Parameter

두 번째는 함수 Named Parameter 입니다.  
dart에서 함수 선언시에는 두 가지 파라미터 명시 방법이 있습니다. Positional Parameter와 Named Parameter가 그것이죠.  

Positional Parameter는 여타 다른 언어의 파라미터 명시 방법과 동일합니다. 차이가 있는 것은 Named Parameter 인데요,  

이 Named Parameter 방식은 (1)파라미터의 default value를 명시해주거나 (2)파라미터를 required modifier 즉 함수 사용시 입력이 필수적임을 명시하여 코드 작성 당시 파라미터가 입력되지 않으면 경고를 발생시키는 방법으로 구현합니다.  

```dart
String introduction(
    {String name = 'default name',
    required level,
    required job}) {
  return "Hi $name. your level is $level, and you are $job";
}

void main() => print(introduction(level: 10, job: 'magician'));
// >> Hi default name. your level is 10, and you are unemployed
// >> name 변수는 함수 사용시 입력하지 않을 경우 default name 이라는 값이 할당됨
// >> level, job 변수는 함수 사용시 입력하지 않을 경우 compile이 불가능하며, 경고가 발생됨
```

## Flutter 에서 Dart를 선택한 이유  

Dart와 Flutter는 모두 구글에서 개발한 언어와 프레임워크입니다. 이는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Flutter의 성능과 편의성 향상을 위해 Dart의 문법을 수정할 수도 있다는 것을 의미</span>하죠.  Flutter가 Dart를 선택한 이유는 문법적 장점 뿐만 아니라 두 기술이 동일한 주체인 구글에서 개발되었기 때문일 것입니다.  

예를 들어, Flask의 경우 Python의 문법을 변경하여 성능을 향상시킬 수 없습니다. 그러나 Flutter와 Dart는 구글이 만든 것으로, 두 기술 간의 긴밀한 관계 덕분에 Dart의 문법을 수정하는 것이 가능합니다.  

실제로, Dart 처음 개발 당시에는 AOT 컴파일 방식을 지원하지 않았지만, Flutter에서 AOT 컴파일을 필요로 하자 Dart는 해당 기능을 개선하여 지원하기 시작했습니다. 이 예시는 두 기술이 동일한 주체에 의해 개발되어 유연하게 협력할 수 있다는 것을 보여줍니다.  

*관련 FAQ 원문*  

```plaintext
In addition, we have the opportunity to work closely with the Dart community, which is actively investing resources in improving Dart for use in Flutter. For example, when we adopted Dart, the language didn’t have an ahead-of-time toolchain for producing native binaries, which is instrumental in achieving predictable, high performance, but now the language does because the Dart team built it for Flutter. Similarly, the Dart VM has previously been optimized for throughput but the team is now optimizing the VM for latency, which is more important for Flutter’s workload.
```


## Reference  

플러터를 배워야 하는 이유 : https://www.youtube.com/watch?v=l05wkkCCe2Y  
AOT 컴파일 : https://ko.wikipedia.org/wiki/AOT_%EC%BB%B4%ED%8C%8C%EC%9D%BC  
AOT 컴파일 : https://selfish-developer.com/entry/AOTAhead-Of-Time-Compiler  
노마드코더 why dart : https://nomadcoders.co/dart-for-beginners/lectures/4091  
Dart Docs - overview : https://dart.dev/overview  
Dart Docs - null safety : https://dart.dev/null-safety  
Flutter Docs : https://docs.flutter.dev/resources/faq  