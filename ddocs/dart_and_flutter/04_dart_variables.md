---
title: "Dart 변수의 선언"
excerpt: "Dart 변수 선언 방법"
last_modified_at: 2024-08-11 23:25:00 +0900
permalink: /docs/dart_and_flutter/04_dart_variables
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
  overlay_image: /assets/images/banners/banner.gif
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
---



## 변수의 선언  

Dart에서 변수 선언 방법은 두 가지입니다.  

|변수 선언 방법|특징|
|---|---|
|var로 선언하는 경우|모든 데이터타입의 값을 받을 수 있는 변수를 선언한다.|
|데이터타입을 명시하는 경우|특정 데이터타입의 값만 받을 수 있는 변수를 선언한다.|

### (1) var 변수명 선언

Dart에서 기본적인 변수 선언 방법은 `var 변수명 = 값;` 입니다. var 데이터타입으로 선언된 변수는, 값이 할당될 때 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>값의 데이터 타입을 자동으로 파악</span>해 변수의 데이터 타입을 선언해놓습니다.  

```dart
void main() {
  var name = 'some name';
  print(name + " | " + name.runtimeType.toString());
}
--------------------------
// >> some name | String
```

### (2) 데이터타입을 명시한 변수명 선언  

데이터타입을 명시하여 변수명을 선언할 수도 있습니다. 여타 프로그래밍 언어들에서 가장 기본적인 변수명 선언 방법이죠.  

```dart
void main() {
    String name = 'some name';
    print(name + " | " + name.runtimeType.toString());
}
--------------------------
// >> some name | String
```

### (3) 두 가지 변수 선언은 각각 언제 사용될까?  

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>관습적으로 var를 이용한 변수명 선언은 지역변수(Ex.함수 안쪽)로</span>, 그리고 <span style='background:linear-gradient(to top, #FF82B2 50%, transparent 50%)'>데이터타입을 명시한 변수명 선언은 전역변수에서 사용</span>합니다. 그리고 이 방식은 dart 의 스타일가이드에서도 권장하는 방식입니다.  


<br>

## 변수에 할당된 값 업데이트 하기  

동일한 변수명으로 안에 있는 값을 변경하는 방법을 알아보겠습니다. update 하려는 값이 동일한 데이터타입인 경우에는 문제 없이 변수 안의 값이 변경되는 걸 볼 수 있죠.  

```dart
void main() {
  var name = 'first name';
  name = 'second name';
  print(name + " | " + name.runtimeType.toString());
}
--------------------------
// >> second name | String
```

하지만 변수의 값을 다른 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>데이터타입으로 update 할 때에는 오류</span>가 생깁니다. 꼭 주의하세요!  

```dart
vodi main() {
    var name = 'some name';
    name = 2;
    print(name + " | " + name.runtimeType.toString());
}
--------------------------
// >> Error: A value of type 'String' can't be returned from a function with return type 'int'.
```

<br>

## Dynamic Variables  

변수의 값을 update 할 때에 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>데이터타입이 달라도 허용하는 변수</span>가 있는데, 바로 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Dynamic 타입</span> 변수입니다. `dynamic 변수명;` 또는 `var 변수명;` 형식으로 선언합니다.  

```dart
void main() {
    dynamic name;
    name = 'some name';
    name = 2;
    print(name.toString() + ' | ' + name.runtimeType.toString());
}
--------------------------
// >> 2 | int
```

변수 값의 데이터타입이 String에서 int로 변경됨을 볼 수 있습니다. 이는 변수 선언시에 `dynamic name;` 으로 변수를 Dynamic Type으로 선언해주었기 때문에 가능한 것입니다.  

![](/assets/images/20240121_004_001.png)

이렇게 Dynamic 타입으로 변수를 선언하는 것은 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>권장되지는 않는 방법이나, 때에 따라서 불가피하게 사용해야 할 때도 있으므로</span> 유용하게 사용하면 됩니다. 그리고 데이터타입을 명시할 때보다 사용할 수 있는 변수의 Attribute가 적다는 점도 주의하시기 바랍니다.  

|선언 방법|데이터타입|
|---|---|
|dynamic name;<br>name='some name';|dynamic|
|dynamic name='some name';|dynamic|
|var name;<br>name='some name';|dynamic|
|var name='some name';|String|

<br>

## Nullable Variables    

Dart에서는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>값이 null 일 수 있는 변수를 명시할 수</span> 있습니다. 기존 코드에서는 변수가 null 값을 참조해버리면 대부분의 경우 null 관련 오류로 프로그램의 흐름이 멈춰버리죠.(런타임 에러)  

먼저 일반적인 방식으로 선언한 변수에 null 값을 넣어주는 간단한 코드를 예시로 보겠습니다.  

```dart
void main() {
  String name = null;
  print(name.toString() + ' | ' + name.runtimeType.toString());
}
--------------------------
// >> Unhandled exception:
// >> type 'Null' is not a subtype of type 'String'
```

Null 타입은 String 타입의 변수에 할당될 수 없다는 오류가 발생합니다. 변수 자체에 Null 타입이 들어오는 순간 코드의 실행이 멈추게 되는 것이죠.  

하지만 프로그래밍에선 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>모든 경우에서 변수가 null이 아니라고 장담할 수 없습니다.</span> 그래서 만들어진 것이 바로 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>nullable variables</span> 즉, "Null 값일 수도 있는 변수" 입니다.  

nullable 변수의 선언은 의외로 간단합니다. <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>변수명 앞에 선언하는 변수 타입에 "?"를 붙여주는 것</span>이죠.  

```dart
void main() {
  String? name;
  name = null;
  print(name.toString() + ' | ' + name.runtimeType.toString());
}
--------------------------
// >> null | Null
```

위의 예시에서 name 변수는 String 타입임에도 null 값이 들어오는 것을 막지 않죠. 변수가 nullabe로 선언되었기 때문입니다. 또한 이렇게 nullable로 선언된 변수를 사용하는 경우, 에디터에서 해당 변수가 null 일 수도 있으니 주의하라는 문구를 보여줍니다.  

![](/assets/images/20240121_004_002.png)

추가로 dynamic 변수는 "?"를 붙이지 않더라도 null 값을 받을 수 있으니 참고하기 바랍니다.  

```dart
void main() {
  dynamic name;
  name = null;
  print(name.toString() + ' | ' + name.runtimeType.toString());
}
--------------------------
// >> null | Null
```

-- 정리해보자면, Dart에서 변수는 기본적으로 non-nullable 입니다.  
-- 하지만 변수의 값이 null이 아닐 경우를 대비해 nullable 변수를 선언할 수 있습니다.  
-- 선언은 데이터타입의 뒤에 "?"를 붙여주거나, dynamic 변수로 선언하면 됩니다.
{: .notice--success}

## Final Variables  

Dart에서 변수는 기본적으로 그 안의 값을 변경(Update)할 수 있습니다. 하지만 때에 따라서는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>값을 고정하여 변경할 수 없게</span> 해야될 경우도 있습니다. 이 때 사용하는 것이 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Final Variables</span> 즉, 최종 변수입니다.  

기본적인 방법으로 선언한 변수는 데이터타입이 일치하는 한 그 안의 값을 변경할 수 있습니다.  

```dart
void main() {
  String name = 'first name';
  name = 'second name';
  print(name.toString() + ' | ' + name.runtimeType.toString());
}
--------------------------
// >> second name | String
```

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>변수가 고정된 값을 가지게 하기 위해서는 변수를 final 타입으로 선언</span>합니다. final로 선언된 변수는 가장 처음 할당된 값을 고정적으로 가지고 있으며, 데이터타입은 Dart가 자동으로 파악하여 그에 해당하는 데이터타입으로 함께 선언해둡니다.  
(일부러 변수명을 명시해둘 수도 있습니다.)

```dart
void main() {
  final name2 = 'first name';  // final로 선언
  // 혹은 final String name2 = 'first name';
  name2 = 'second name';
  print(name.toString() + ' | ' + name.runtimeType.toString());
}
--------------------------
// >> Error: Can't assign to the final variable 'name2'.
```

final 로 선언한 변수의 값은 변경할 수 없으며(같은 데이터타입이라도), 변경하려고 하면 final variable은 변경할 수 없다는 오류 문구를 볼 수 있습니다. 이는 javascript나 typescript의 const와 동일한 개념입니다.  


## late  

변수 선언시 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>final 혹은 var 앞에 붙여줄 수 있는 수식어</span>로, <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>변수를 초기 데이터 없이(=초기화 없이)</span> 나중에 값을 할당를 선언할 수 있게 해주는 수식어입니다. "초기화 지연"이라고도 합니다.  

먼저, 사용법 부터 알아보도록 하겠습니다.  

```dart
void main() {
  late String a; // 변수를 먼저 선언
  // ~ Do Something ~
  a = 'some text';
}
```

late 수식어를 사용하는 이유는 아래와 같습니다.

**(1) non-nullable 임을 명시해준다**  

**(2) 명시적 초기화 지연**  
late를 사용하면 변수를 선언할 때 초기화하지 않아도 되므로, 일부 변수는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>필요한 시점에 초기화</span>할 수 있습니다. 이는 특히 클래스의 생성자에서 초기화 불가능한 값을 필요로 할 때 유용합니다.  

**(3) 가독성과 안정성 향상**  
코드의 가독성을 높이고 안정성을 향상시키는 데 도움이 됩니다. 코드 리더가 해당 변수가 나중에 초기화될 것이라는 것을 명시적으로 알 수 있습니다.  

즉, "나중에 사용할 변수다" 라는 것을 명시적으로 보여주기 위함입니다.  
지금 당장은 와닿지 않으나, 향후 class 를 이용할 경우 유용하다고 하니 일단 알아둡시다.  


(추가)  
당연하지만 late 수식어를 사용하든 사용하지 않든, 변수 사용을 위해서는 사용 전 항상 초기화 후 사용해야합니다.  

```dart
void main() {
  // final a;
  late String a;
  String result = func01(a); // a 변수를 초기화(값 할당)하지 않아 오류가 나는 부분
  print(result.toString() + ' | ' + result.runtimeType.toString());
}

String func01(String some) {
  some = 'Hello World!';
  return some;
}
--------------------------
// >> Error: Late variable 'a' without initializer is definitely unassigned.
```


## Constant Variables  

const 는 상수를 말하는데, javascript 나 typescript의 final과 같은 개녑입니다.  

Dart에서 const 는 'Compile Time Constant'를 의미하는데, 이는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>"컴파일 될 때에도 그 값을 유지하고 있는 변수"</span> 라는 의미입니다. 아래 예시를 통해 알아보죠.  

```dart
// 컴파일 후 변환되는 값을 보여주는 함수
String returnCompileResult(String text){
  result = // 대충 input 값이 compile 이후에 변경될 값을 보여주는 기능;
  return result
}

void main() {
  final String apiKey = 'SomeText';
  result = returnCompileResult(apiKey);
  print("(1) " + apiKey + " (2) " + result);
}
--------------------------
// >> (1) SomeText (2) [83, 111, 109, 101, 84, 101, 120, 116]
```

먼저, const가 아닌 변수를 이용하면 컴파일시 해당 변수의 값은 기계어에 맞게 번역기 됩니다.  
그러면 const 로 선언된 변수 값은 어떻게 되는지 살펴보도록 하죠.  

```dart
// 컴파일 후 변환되는 값을 보여주는 함수
String returnCompileResult(String text){
  result = // 대충 input 값이 compile 이후에 변경될 값을 보여주는 기능;
  return result
}

void main() {
  const String apiKey = 'SomeText';
  result = returnCompileResult(apiKey);
  print("(1) " + apiKey + " (2) " + result);
}
--------------------------
// >> (1) SomeText (2) SomeText
```

const로 선언된 값은 컴파일 할 때에도 동일한 값을 가지고 있습니다. 즉 컴파일시의 "하드코딩"과 비슷한 느낌으로 이해하면 좋을 것 같습니다.  
이는 컴파일 후에도 즉, 애플리케이션 상에도 그 값이 그대로 유지되어야 하는 값을 선언하기 위해 사용됩니다.  


## 복습  

|변수 선언 방법|설명|
|---|---|
|String 변수명|String 타입의 값을 받는 변수 선업 방법.|
|int 변수명|int 타입의 값을 받는 변수 선언 방법.|
|var 변수명|변수타입을 특정하지 않는 변수 선언 방법<br>데이터타입은 처음 변수에 할당되는 값의 데이터타입으로 고정된다.<br>지역변수에 사용할 때 많이 사용한다.|
|dynamic 변수명|변수타입을 특정하지 않는 변수 선언 방법<br>초기화 데이터타입에 상관 없이 이후에도 데이터타입을 변경할 수 있다.|
|final 변수명|값을 재할당하지 못하는 '고정값'을 변수에 할당하는 변수 선언 방법|
|데이터타입? 변수명|null 값을 받을 수 있는 변수를 선언하는 방법|
|late 데이터타입 변수명|지연 초기화 변수 선언 방법|


## Reference  

노마드코더 var declaration : https://nomadcoders.co/dart-for-beginners/lectures/4094  
노마드코더 dynamic : https://nomadcoders.co/dart-for-beginners/lectures/4095  
노마드코더 nullable : https://nomadcoders.co/dart-for-beginners/lectures/4096  
노마드코더 final : https://nomadcoders.co/dart-for-beginners/lectures/4097  
노마드코더 late : https://nomadcoders.co/dart-for-beginners/lectures/4098  
노마드코더 const : https://nomadcoders.co/dart-for-beginners/lectures/4099  
late 수식어 사용의 이유 : https://lucky516.tistory.com/185  
late 수식어 사용의 이유 : https://velog.io/@teddyjune/late%EB%8A%94-%EC%99%9C-%EC%93%B0%EB%82%98  