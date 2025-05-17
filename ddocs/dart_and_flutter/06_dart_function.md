---
title: "Dart의 함수 선언"
excerpt: "함수를 선언(정의) 해보자"
last_modified_at: 2024-01-21 03:45:00 +0900
permalink: /docs/dart_and_flutter/06_dart_function
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

## Function defining  

### 기본적인 함수 선언 방법  

Dart의 함수 작성법은 아래와 같습니다.  

```dart
반환할데이터타입 함수명(파라미터타입 파라미터,){
  함수내용
  return 반환값;
}
```

```dart
// 반환할데이터타입 : String, int, List..
// 함수명 : 영문으로 시작. 영문 대소 및 숫자.
// 파라미터 : 함수의 요소로 사용될 변수.
// 파라미터의 개수 : 0개 이상을 사용할 수 있음.
// 반환값 : 함수명 앞에 쓴 데이터타입과 일치해야.
```

### 예시  

함수의 반환 데이터 타입에 따라 몇 가지 예시를 들어보겠습니다.  

```dart
// void : 반환할 값이 없음
void func01(String input) {
  String someText = "Hello $input";
  print(someText);
}

// String : 반환할 값이 문자열
String func02(String input) {
  return "Hello $input";
}

// int : 반환할 값이 정수형임
int plus(int a, int b){
  int result = a + b;
  return result;
}

// main
void main() {
  func01("jongya");
  print(func02("jongya"));
  print(plus(1, 3));
}
// >>> Hello jongya
// >>> Hello jongya
// >>> 4
```

### main() function

또한 main() 도 함수입니다. dart로 이루어진 프로그램에서 가장 먼저 실행된다는 특수성이 있는 함수죠. 그렇다면 main 함수 또한 return 데이터타입을 지정해줄 수도 있겠죠. 아래 예시를 보자.  

```dart

var name = "jongya";

String func02(String input) {
  return "Hello $input";
}

String main() {
    return func02(name);
}
// >> Exited.
// >> 별도 출력값이 없이 프로그램의 결과값으로 func02("jongya")의 String 결과값을 넘겨주고 끝남
```



## Fat Arrow Syntax  

함수 선언시 중괄호와 return을 명시하지 않고 fat arrow(=>)로 대체하는 표현 방법입니다.  

```dart
// fat areow syntax
int plus1(int a, int b) => a + b;

// normal func syntax
int plus2(int a, int b) {
  int result = a + b;
  return result;
}

// main
void main(){
  print(plus1(1, 2));
  print(plus2(1, 2));
}
// >> 3
// >> 3
```


## 파라미터 선언의 두 가지 방법  

함수 선언시 파라미터를 명시하는 방법은 두 가지가 있습니다.  

-- Positional Parameter  
-- Named Parameter  

두 가지 방식의 선언 방법을 비교해보도록 하겠습니다.


### (1) Positional Parameter  

일반적인 파라미터 명시 방식입니다. 데이터타입을 명시해줘야 하고, 함수의 선언과 사용시에 파라미터의 순서를 꼭 지켜줘야 합니다. 또한 positional 방식으로 선언된 파라미터들은 함수 사용시 모두 입력되어야 합니다. 즉 기본값이 없습니다.  

-- 일반적인 파라미터 명시 방식  
-- 함수 선언과 사용시에 파라미터 순서 지켜야 함  
-- 함수 사용시에 모든 파라미터가 입력 되어야 함  

```dart
// Positional Parameter : 일반적인 방식의 파라미터 명시 방식
String introduction01(
  String name,
  int level,
  String job) {
  return "Hi $name. your level is $level, and you are $job";
}

// 사용시
void main() => print(introcution("jongya", 10, "magicain"));
// >> Hi jonghyuk. your level is 10, and you are magician
```

### (2) Named Parameter  

Named Parameter에는 몇 가지 기능과 사용시의 요구사항을 먼저 살펴보겠습니다.  

**기능**  
-- 함수 사용시 입력되지 않은 파라미터의 값을 대체할default value를 지정할 수 있다.  
-- 함수 사용시 파라미터를 순서대로 사용하지 않아도 된다. 이 때는 `파라미터명: 값`  형식으로 작성한다.  

**요구사항**  
-- 함수 선언시 파라미터들을 중괄호{}로 묶어주어야 한다.  
-- 함수 선언시 파라미터의 default value를 지정하거나, not null 변수로 선언하거나, required modifier를 사용해야 한다.  

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>파라미터 입력의 순서를 잊어버렸을 경우에도 편리하게 함수를 사용할 수도 있으며, 더불어 자신이 아닌 다른사람이 작성한 코드를 해석할 때에도 가독성이 올라가는 좋은 표현법</span>입니다.  

```dart
// default value 를 사용하는 경우
String introduction02(
    {String name = 'default name',
    int level = 1,
    String job = 'unemployed'}) {
  return "Hi $name. your level is $level, and you are $job";
}

void main() => print(introduction02(level: 10));
// >> Hi default name. your level is 10, and you are unemployed
```

default value를 사용하는 경우엔, 함수 사용시 입력하지 않은 파라미터는 사전에 함수 선언시 명시해놓은 default value가 파라미터에 할당되어 함수가 실행된다.  

```dart
// required modifier 를 사용하는 경우
String introduction03(
    {required name,
    required level,
    required job}) {
  return "Hi $name. your level is $level, and you are $job";
}

void main() => print(introduction03(level: 10, job: 'magician', name: 'jongya'));
// >> Hi jongya. your level is 10, and you are magician
```

required modifier를 사용할 경우, 함수 선언시에 default value를 할당하지 않아도 됩니다. 그리고 함수 사용시에는 각 파라미터의 순서를 지켜주지 않아도 되나, 꼭 모든 파라미터와 값을 입력해줘야 합니다.  

그리고 아래와 같이 default value 와 required 를 혼용해서 사용할 수도 있습니다.  

```dart
String introduction04(
    {String name = 'default name',
    required level,
    required job}) {
  return "Hi $name. your level is $level, and you are $job";
}

void main() => print(introduction04(level: 10, job: 'magician'));
// >> Hi default name. your level is 10, and you are magician
```


### (추가) Optional Positional Parameters  

Positional Parameter 명시 방법에서 default value 를 지정해주는 방식입니다.  

```dart
String introduction02(
  int level,
  String job,
  [String? name='default name']) {
  return "Hi $name. your level is $level, and you are $job";
  }

void main() => print(introduction02(10, 'thief'));
// >> Hi default name. your level is 10, and you are thief
```

함수에 특정 파라미터에 대해 nullable과 default value를 선언해줌으로써, 사용시에 특정 파라미터를 입력하지 않아도 되게끔 할 수 있습니다.  

Optional Positional Parameter는 파라미터 중 가장 뒷쪽에 명시해야 하며, 만약 여러 개의 Optional Positional Parameter를 사용할 경우, 리스트[] 안쪽에 콤마(,)로 구분하여 명시해주면 되니 사용시 꼭 참고하시기 바랍니다.  

-- positional 방식에서 파라미터에 옵션을 줄 수 있는 기능  
-- 함수 선언 시 파라미터 중 가장 뒤에 명시한다.  
-- 여러개일 경우 리스트 한에 콤마로 구분하여 명시한다.  

```dart
String introduction02(
  String job,
  [String? name='default name', int? level = 20]) {
  return "Hi $name. your level is $level, and you are $job";
  }

void main() => print(introduction02('thief'));
// >> Hi default name. your level is 10, and you are thief
```


## null-aware Operator  

null-aware Operator는 Null 값인지를 확인하는 연산자입니다. QQ Operator(Question Qeustion Operator) 라고도 불립니다.  

아래 이름을 대문자로 바꿔주는 함수를 예시로 설명해보겠습니다.  
우선 정석적인 선언 방법부터.  

```dart
// 이름을 대문자로 바꿔주는 정석적인 표현
String makeUpperName01(String? name) {  // 파라미터는 nullable
  if (name != null) {                   // 만약 name이 null이 아니라면
    return name.toUpperCase();          // 대문자로 바꿔준다.
  }
  return 'Null';                        // name이 null 이라면 'Null'을 리턴한다.
}

// 혹은 3항 연산자로 더 짧게 표현도 가능하다.  
String makeUpperName02(String? name) =>
    name != null ? name.toUpperCase() : 'Null';
```

이러한 정석적인 표현 방식을 Dart에서는 null-aware Operator(QQ Operator)를 통해 좀 더 짧게 작성이 가능합니다.  

```dart
String makeUpperName03(String? name) =>
    name?.toUpperCase() ?? 'Null';
```

null-aware Operator는 `<좌측 항> ?? <우측 항>` 과 같이 작성을 하는데, 이는 "좌측항이 null이 아니면 좌측항을 실행하고, 그렇지 않다면 우측항을 실행한다" 와 같이 실행됩니다.  


## null-aware Assignment  

null-aware 표현법(QQ 표현법)은 변수에도 사용할 수 있습니다. null-aware Assignment 라고 하는 방법인데, 아래 예시를 통해 이해해보도록 하겠습니다.    

```dart
void main() {
  String? name;
  name ??= 'jongya';       // name이 null 이면 jongya 라는 값을 할당한다.
  name ??= 'another name'; // name이 null 이면 another name 이라는 값을 할당한다.
  print(name);
  // >> jongya
}
// Warning: Operand of null-aware operation '??=' has type 'String' which excludes null.
//  name ??= 'another name';
```

QQ Assignment 는 특정 변수가 null 인지를 체크하고, null 일 경우에는 '어떠한 값'을 할당하는 기능을 가지고 있습니다. 위 예시에서는 nullable 인 name 변수를 선언해준 뒤, null 인지를 체크하고 값을 할당하고 있습니다.  

그리고 main 함수를 실행했을 때 주의 문구가 하나 발생하는데, 이를 해석해보자면 "'??=' null-aware operation 의 피연산자 중에 null값을 포함하지 않는 String 데이터타입이 있다." 입니다.  

즉, 앞서서 name 변수에 jongya 라는 값이 할당되었기 때문에 발생한 경고문인데, Warning 이므로 함수의 실행에는 문제가 없긴 합니다.  

하지만 이미 null 값에 대한 대처가 되어있는 상황에서 불필요한 null-aware operation 은 필요가 없습니다. 아래와 같은 상황이라면 두 개의 null-aware operation을 사용할 수도 있겠죠.  

```dart
void main() {
  String? name;
  name ??= 'jongya';
  print(name);
  
  name = null; // ~ 혹은 대충 name 변수의 값을 null로 만드는 상황 ~ //
  name ??= 'another name';
  print(name);
}
// >> jongya
// >> another name
```


## Typedef  

typedef 는 자료형을 정의하는 함수입니다.  

Map<String, String> 자료형을 이용하여 유저의 Id 와 Passwd 를 불러오는 는 아래와 같은 코드를 예시로 들어보겠습니다.    

```dart
Map<String, String> getIdPasswd(String username){

  Map<String, Map<String, String>> userData;
  Map<String, String> kim = {"imsuperman" : "passwd1234"};
  Map<String, String> lee = {"lovelovelove" : "fjnsdfuqb"};
  Map<String, String> park = {"dkdlelanjffhgo" : "qlalfqjsgh"};

  userData = {"kim" : kim, "lee" : lee, "park" : park};
  Map<String, String>? result = userData[username];
  result ??= {'fail' : 'no data'};

  return result;
}
```

코드에서 "자료형" 을 지정하는 텍스트의 비율이 너무 높죠. 자료형을 짧게 줄여서 사용할 수 있는 방법은 없을까요?  
이럴 때 바로 Typedef 를 사용할 수 있습니다. 위의 코드를 typedef를 이용하여 작성해보았습니다.  

```dart
typedef userInfo = Map<String, String>;

userInfo getIdPasswd2(String username){

  Map<String, userInfo> userData;
  userInfo kim = {"imsuperman" : "passwd1234"};
  userInfo lee = {"lovelovelove" : "fjnsdfuqb"};
  userInfo park = {"dkdlelanjffhgo" : "qlalfqjsgh"};

  userData = {"kim" : kim, "lee" : lee, "park" : park};
  userInfo? result = userData[username];
  result ??= {'fail' : 'no data'};

  return result;
}
```

훨씬 정돈되고 가독성도 높아진 것을 볼 수 있습니다. 실제 글자수를 비교해보면 아래와 같습니다.  

|typedef 미사용|typedef 사용|차이|비율|
|---|---|---|---|
|442|418|34|7.7%|

34자를 줄였고, 이는 전체 코드 길이의 7.7%에 해당하네요. 
코드를 작성하는 사람의 능력에 따라 다르겠지만, typedef를 적절하게 이용한다면 가독성 좋고 짧은 코드의 작성이 가능할 것입니다.  

## Reference

https://nomadcoders.co/dart-for-beginners/lectures/4107  
https://nomadcoders.co/dart-for-beginners/lectures/4108  
https://nomadcoders.co/dart-for-beginners/lectures/4109  
https://nomadcoders.co/dart-for-beginners/lectures/4110  
https://nomadcoders.co/dart-for-beginners/lectures/4111  
https://nomadcoders.co/dart-for-beginners/lectures/4112  
