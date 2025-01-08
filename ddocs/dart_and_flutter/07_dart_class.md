---
title: "Dart의 클래스"
excerpt: "dart에서 가장 공들여 봐야 할, class."
last_modified_at: 2024-01-22 21:30:00 +0900
permalink: /docs/dart_and_flutter/07_dart_class
classes: wide
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_dart_and_flutter"
---


## 클래스 작성법

Dart의 기본적인 클래스 작성법은 Java 등 다른 객체지향 언어들과 비슷합니다. class 라는 말을 쓰고, 대문자로 시작하는 클래스명을 적어주고, 중괄호 안에 클래스의 내용을 적어주죠.  

`class 클래스명 { 클래스 내용 }`

그리고 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>property와 method들을 가질</span> 수 있습니다. 하지만 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>class 안에 또 다른 class는 선언할 수 없습</span>니다.  

```dart
class Player {
    String name = 'default name';
    int level = 0;
    final job = 'magician';
}
```

### class 인스턴스(객체) 생성  

클래스를 작성한 뒤, 함수에서 사용할 때에는 `var 인스턴스명 = 클래스명();` 혹은 `클래스명 인스턴스명 = 클래스명();` 과 같이 작성해주면 됩니다.  

```dart
class Player {
    String name = 'default name';
    int level = 0;
    final job = 'magician';
}

void main() {
    var player01 = Player();
    Player player02 = Player();
    print(player01.name);
    print(player02.name);
}
// ==============================
// >> default name
// >> default name
```


### class의 property  

클래스의 property는 클래스 필드 안의 변수를 의미합니다.  

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>property를 선언할 때에는 데이터타입을 명시해주는 것이 권장됩니다. var나 dynamic과 같은 데이터타입은 권장되지 않습</span>니다. 이는 가독성 있게 명확한 자료형을 추론할 수 있도록 하고, 데이터타입을 명시해줌으로써 프로그래밍 상의 오류를 방지하기 위함입니다.  

final로 선언된 변수가 아니라면 인스턴스를 생성하면 property는 기본적으로 수정할 수 있습니다. <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>property를 수정할 수 없게 하고 싶다면 final 변수로 선언</span>해주면 됩니다.  

```dart
class Player {
    String name = 'default name';  // 데이터타입을 명시해주는 것이 권장됨
    int level = 0;                 // 데이터타입을 명시해주는 것이 권장됨
    final job = 'magician';        // 값을 변경할 수 없게 final로 선언
}

void main() {
    var player01 = Player();
    print(player01.name);     // >> default name
    player01.name = 'jongya';
    print(player01.name);     // >> jongya
    player01.job = 'warrior'; // >> 오류 발생
}
```


### 같은 클래스의 서로 다른 인스턴스

동일한 클래스의 서로 다른 두 개 이상의 인스턴스가 있다고 해보죠. 둘은 서로 영향을 미칠까요?  

그렇지 않습니다. 동일한 클래스로 생성된 인스턴스들이라도 각각은 서로 독립된 객체입니다. 예시를 들어보겠습니다.  

```dart
class Player {
    String name = 'default name';  // 데이터타입을 명시해주는 것이 권장됨
    int level = 0;                 // 데이터타입을 명시해주는 것이 권장됨
    final job = 'magician';        // 값을 변경할 수 없게 final로 선언
}

void main() {
    var player01 = Player();
    print(player01.name);     // >> default name
    player01.name = 'jongya';
    print(player01.name);     // >> jongya

    Player player02 = Player();
    print(player02.name);     // >> default name
}
```


### 클래스 안의 method  

클래스는 method 즉 함수를 가질 수 있습니다. 그리고 인스턴스를 통해 이를 활용할 수 있습니다. 앞서 살펴 본 property의 사용법과 동일하죠.  

```dart
class Player {
    String name = 'default name';  // 데이터타입을 명시해주는 것이 권장됨
    int level = 0;                 // 데이터타입을 명시해주는 것이 권장됨
    final job = 'magician';        // 값을 변경할 수 없게 final로 선언

    void introduction() {
        print('Hi. my name is $name');
    }
}

void main() {
    Player player01 = Player();
    player01.introduction();
    player01.name = 'jongya';
    player01.introduction();
}
// ==============================
// >> Hi. my name is default name
// >> Hi. my name is jongya
```

### 클래스의 property를 가리키는 'this'  

클래스 안의 property 이름과 클래스의 함수 안의 지역변수의 이름이 동일하다면 어떻게 될까요? <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>`this.property명`과 `지역변수명`으로 구분지어 사용</span>할 수 있습니다. 물론 이러한 상황이 이상적이지는 않습니다.  

*겹치는 변수명이 없다면 $name 만 사용해도 class property를 가리킵니다.*  


|구분|설명|
|---|---|
|$변수명|함수 안의 변수를 가리킴|
|${this.변수명}|클래스의 property 를 가리킴|


```dart
class Player {
    String name = 'default name';  // 데이터타입을 명시해주는 것이 권장됨
    int level = 0;                 // 데이터타입을 명시해주는 것이 권장됨
    final job = 'magician';        // 값을 변경할 수 없게 final로 선언

    void introduction() {
        var name = 'name in method';
        print('Hi. my name is $name');
        print('Hi. my name is ${this.name}');
    }
}

void main() {
    Player player01 = Player();
    player01.introduction();
    player01.name = 'jongya';
    player01.introduction();
}
// ==============================
// >> Hi. my name is name in method
// >> Hi. my name is default name
// >> Hi. my name is name in method
// >> Hi. my name is jongya
```

### <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Dart의 클래스 정리</span>  

-- `class 클래스명 { 클래스 내용 }` 식으로 선언한다.  
-- 클래스명은 대문자로 시작하게 작성한다.  
-- property와 method를 가질 수 있다.  
-- class 안에 class 는 선언할 수 없다.  
-- 인스턴스 생성 : `var 인스턴스명 = 생성자();` 혹은 `클래스명 인스턴스명 = 생성자();`  
-- property는 기본적으로 수정 가능, final은 수정 불가능.  
-- property와 method의 변수명이 겹친다면 `this.property명`과 `지역변수명`으로 구분.  



## Constructor  

### Constructor Method

Constructor Method 는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>인스턴스를 생성하는 "생성 함수" 즉 "생성자"를 의미</span>합니다. 클래스 안에 선언하면 되죠. 아래 예시를 살펴보겠습니다.  

```dart
class Player {

    late String name;
    late int level;
    late final String job;
    
     // --- Constructor Method --- //
    Player(String name, int level, String job){
        this.name = name;
        this.level = level;
        this.job = job;
    }
    // --------------------------- //

    void introduction() {
        print('Hi. my name is $name. level is $level and my job is $job');
    }
}

void main() {
    Player player01 = Player('jongya', 10, 'magician');
    print(player01.name);
    player01.introduction();
}
// ==============================
// jongya
// Hi. my name is jongya. level is 10 and my job is magician
```

가장 먼저 눈여겨 볼 것은 Player calss 안의 Player 라는 method 입니다. <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>이것이 바로 Constructor Method로, 인스턴스를 만드는 역할</span>을 하죠.  

그리고 두 번째로 눈여겨 볼 것은 아래 main 함수에서 사용된 인스턴스 생성 부분입니다. 앞서 살펴본 것들과는 다르게 인스턴스 생성시 Player() 안에 파라미터들이 있는 것을 볼 수 있습니다. 이러한 작성 방식이 바로 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Constructor Method 를 통해 인스턴스를 만드는 방식</span>입니다.  

세 번째로는 `late 수식어`입니다. late는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>변수의 초기화를 지연시키는 수식</span>어로, 위 코드에서 late가 없다면 class 안의 Constructor Method는 초기화되지 않은 변수를 받게 되고, 이는 (할당된 값이 없는 null 이므로) 오류로 이어지게 됩니다. 즉 컴파일 자체가 불가능해지는 것이죠.  

이 late 변수를 사용함으로 인해서 "이 변수(property) 들은 나중에 초기화될 것이니 안심하고 써" 가 되는 것입니다. 물론 late 없이 좀 더 간략하게 만들 수도 있습니다. 일반적으로 dart 에서는 아래와 같이 class 를 만듭니다.  

```dart
class Player {

  String name;
  int level;
  String job;

  Player(this.name, this.level, this.job);

  void introduction() {print('Hi. my name is $name. level is $level and my job is $job');}

}

void main() {
    Player player01 = Player('jongya', 10, 'magician');
    print(player01.name);
    player01.introduction();
}
// ==============================
// jongya
// Hi. my name is jongya. level is 10 and my job is magician
```

### Named Constructor Parameters  

function에서 Named Parameter 와 동일하게 class의 Constructor에도 Named Parameter를 적용할 수 있습니다.  

function의 Named Parameter와 동일하게 Constructor Parameter에 default value를 줌으로써 선언할 수도 있고  

```dart
class Player {
  String name;
  int level;
  String job;

  Player({this.name = 'default name',
          this.level = 0,
          this.job = 'non'});
}

void main() {
  Player player01 = Player(level: 50);
  player01.introduction();
}
// >> Hi. my name is default name. level is 50 and my job is non
```

또는 required 수식어를 써줌으로써 선언할 수도 있습니다.  

```dart
class Player {
  String name;
  int level;
  String job;

  Player({required this.name,
          required this.level,
          required this.job});
}

void main() {
  Player player01 = Player(name:'jongya', level:10, job:'magician');
  player01.introduction();
}
// >> Hi. my name is jongya. level is 10 and my job is magician
```

### Named Constructor ★★★  

하나의 클래스를 여러 유형으로 만들고 싶으면 어떻게 해야할까요? 예를 들어, 앞서 본 Player 들이 직업별로 다른 특성을 가지고 있고, 또 일부 특성은 공통적이라면? 이럴 때 사용할 수 있는 것이 `Named Constructor` 입니다.  

Named Constructor 는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>동일한 클래스에서 서로 다른 방식으로 인스턴스를 생성할 수 있도록 하는 Constructor</span> 입니다. 각각의 생성자(Constructor)에 이름을 붙여 생성자를 특정하고, 인스턴스를 생성할 때 그 이름을 사용합니다.  

-- `클래스명.ConstructorName` 의 방식으로 선언을 시작합니다.  
-- required 값은 Named Parameter로 받습니다.  
-- 인스턴스 생성 룰(초기화 룰)은 Constructor의 `괄호() 뒤 콜론 : 을 붙인 뒤 작성`합니다.  
-- 콜론 뒤의 내용은 변수 초기화 부분입니다. this.변수명에 '값'을 할당하는 하는 곳이죠.  

다음은 warrior, magician 두 가지 직업 인스턴스를 만들 수 있는 Named Constructor 예시입니다.  

```dart
class Player {
  String name, job, skill;
  int level, str, inteli;

  Player(
      {this.name = 'default name',
      this.level = 0,
      this.job = 'non',
      this.str = 5,
      this.inteli = 5,
      this.skill = 'non'});

  Player.creatWarrior({required String name, required String skill})
      : this.name = name,     // 생성시 값을 받음
        this.level = 10,      // 일부 값은 고정도 할 수 있음
        this.job = 'warrior',
        this.str = 25,
        this.inteli = 5,
        // this.skill = this.skill; >> 이렇게는 사용 불가
        this.skill = skill;

  Player.createMagician({required String name, required String skill})
      : this.name = name,
        this.level = 10,
        this.job = 'magician',
        this.str = 5,
        this.inteli = 25,
        this.skill = skill;

  void introduction() {
    print(this.name + "/" + this.job);
    print("level : " + this.level.toString() + "/ skill : " + this.skill);
  }
}
```

### Named Constructor 예시  

Named Constructor는 정말 중요한 개념이자 기능입니다. 이에 한 가지 예시를 더 들어보도록 하겠습니다.  
API 통신으로부터 일기예보를 받아오는 예시를 들어보겠습니다.  

```dart

typedef ForecastData = List<Map<String,dynamic>>;

class ForecastDaily {
  String date, weather;
  int temp;
  double hum;

  ForecastDaily.fromJson(Map<String, dynamic> forecastJson)
      : this.date = forecastJson['date'],
        this.weather = forecastJson['weather'],
        this.temp = forecastJson['temp'],
        this.hum = forecastJson['hum'];

  void announceTodaysWeather(){
    print('today is $date. weather is $weather and $temp temp, $hum hum.');
  }
}

void main() {
  // ~ get some Json datas ~ //
  ForecastData forecastData = [
    {'date':'2024-01-21','weather':'fine', 'temp':25, 'hum':0.5},
    {'date':'2024-01-22','weather':'cloud','temp':10,'hum':0.75},
    {'date':'2024-01-23','weather':'rain','temp':15,'hum':0.95},
    {'date':'2024-01-24','weather':'snow','temp':1,'hum':0.9},
  ];

  // make ForecastDaily instance and announce
  forecastData.forEach((forecastJson){
    var forecast = ForecastDaily.fromJson(forecastJson);
    forecast.announceTodaysWeather();
  });
}
// ==============================================================
// >> today is 2024-01-21. weather is fine and 25 temp, 0.5 hum.
// >> today is 2024-01-22. weather is cloud and 10 temp, 0.75 hum.
// >> today is 2024-01-23. weather is rain and 15 temp, 0.95 hum.
// >> today is 2024-01-24. weather is snow and 1 temp, 0.9 hum.
```

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Named Consturctor는 정말 자주, 그리고 중요하게 사용되는 개념이자 기능</span>이므로 꼭 익히고 넘어가도록 합시다.  

### <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Constructor 정리</span>  

-- <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Constructor Method : 인스턴스를 생성하는 함수. 생성자.</span>  
-- Constructor Method 는 클래스 안에 `클래스명(파라미터){초기화부분}` 과 같이 선언한다.  
-- 클래스 바깥에서 Constructor Method 를 통해 인스턴스를 생성할 수 있다.  
-- Class Field 의 property 에 `late` 수식어를 달아 초기화 지연을 할 수 있다.  
-- 초기화 지연을 한 property 는 나중에 인스턴스를 생성할 때 값을 할당해줄 수 있다.  
-- Constructor Method 선언시 파라미터를 Named Parameter 형식으로 작성할 수 있다.  
-- 동일한 클래스를 서로 다른 여러 방식으로 인스턴스를 생성하는 Constructor Method를 선언할 수 있으며, 이를 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>Named Constructor ★</span> 라고 한다.  


## 잠깐! 편리한 기능들  

### Cascade Notation (..) ★★  

Cascade Notation : 계단식 표기법. 또는 연쇄 호출 표기법.  

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>동일한 객체를 닷닷(..)으로 편리하게 여러 번 호출하는 간편한 방법</span>입니다. 표기법은 닷닷 `..` 이고, 문장의 끝을 알리는 세미콜론은 이 표기법이 끝나는 부분에서 한 번만 작성해주면 됩니다.  

예시로 Player 클래스 인스턴스를 생성해봅시다. 이 인스턴스의 property 들의 값을 바꾸고 싶다면 어떻게 해야 할까요? 지금까지 배운 것을 토대로는 아래와 같이 작성할 수 있을 것입니다.  

```dart
class Player{
  String name, job;
  int level;

  Player({required this.name, required this.job, required this.level});
  void introduction(){print('my name is $name, $level level, and $job');}
}

void main() {
  Player player01 = Player(name:'jongya', level:10, job:'magician');
  player01.name = 'changed name';
  player01.level = 15;
  player01.job = 'thief';
  player01.introduction();  
}
// >> my name is changed name, 15 level, and thief
```

하지만 구글에서는 이를 길다고 느껴졌는지.. Cascade Notation 이라는 문법을 만들었습니다. 아래와 같이 더 짧게 쓸 수 있죠.  

```dart
class Player{
  String name, job;
  int level;

  Player({required this.name, required this.job, required this.level});
  void introduction(){print('my name is $name, $level level, and $job');}
}

void main() {
  Player player02 = Player(name:'jongya', level:10, job:'magician')
  ..name = 'changed name'
  ..level = 15
  ..job = 'thief';
  player02.introduction();
}
// >> my name is changed name, 15 level, and thief
```

그리고 아래와 같이 property의 변경 뿐 아니라, 인스턴스의 메서드를 호출해 사용하는 활용법도 있습니다. 와우..  

```dart
class Player{
  String name, job;
  int level;

  Player({required this.name, required this.job, required this.level});
  void introduction(){print('my name is $name, $level level, and $job');}
}

void main() {
  Player player = Player(name: 'default', job: 'non', level: 1);

  Player potato = player
  ..name = 'potato'
  ..level = 0
  ..job = 'potato'
  ..introduction();
}
// >> my name is potato, 0 level, and potato
```



### enum  

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>enum 은 특정 값들의 집합 즉 '상수의 집합'</span>을 나타내는 유형입니다.  

enum은 코드에서 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>사용 가능한 값의 범위를 제한</span>함으로써 프로그래머가 값 입력에 있어 실수하지 않도록 도와줄 수 있습니다.  

typedef와 비슷하게 작성하는데요, `enum 이름 {값1, 값2 ...}` 와 같은 방식으로 선언하며, 중괄호 안의 값들은 무조건 따옴표 없이 사용합니다. 아래 예시를 보시죠.  

```dart
// 실수가 발생하는 경우
class Player {
  String name;
  String job;
  Player({required this.name, required this.job});
}

void main() {
  Player player01 = Player(name: 'jongya', job: 'megician');
}
```

위 코드에서 이상한 점이 있습니다. 아주 작은 부분입니다. Player 인스턴스를 생성할 때 job 에 할당되는 값에 오타가 있습니다.  

단순히 오타로 치부할 수도 있지만, 실제 프로그래밍에서는 이 오타가 치명적인 오류를 만들어낼 수도 있습니다. 그리고 이런 오타는 찾기도 쉽지 않죠.  

enum 은 이러한 오류들을 미연에 방지할 수 있게 해줍니다. enum에 할당된 값만을 프로그래머가 사용할 수 있도록 제한하는 기능을 통해서요.  

```dart
// --- enum --- //
enum Job {warrior, magician, thief}
// ------------ //

class Player {
  String name;
  Job job;
  Player({required this.name, required this.job});
}

void main() {
  Player player01 = Player(name: 'jongya', job: Job.magician);
}
```

--enum 은 '특정 상수의 집합' 입니다.  
--이를 통해 프로그래머가 제한된 값 내에서 선택을 할 수 있게 하며, 실수를 줄일 수 있습니다.  
--enum 은 `enum 이름 {값1, 값2 ...}` 과 같은 방식으로 선언합니다.  
--enum 을 사용해 변수를 선언할 때에는 일반 데이터타입을 명시하는 것과 같이 사용합니다. 위 코드의 `Job job` 과 같이요.  
--enum 을 사용할 때에는 `enum.상수명` 과 같이 사용합니다.  

enum을 사용하게 되면, 이에 맞지 않는 문법을 사용하게 될 떄 아래와 같은 오류를 발생합니다.  

![](/assets/images/20240122_001_001.png)  

그리고 enum을 사용해야 하는 부분에서는 enum을 사용할 수 있게, 그리고 사용자가 무엇을 사용할 수 있는지와 함께 추천됩니다.  

![](/assets/images/20240122_001_002.png)  

### <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>편리한 기능들 정리</span>  

-- Cascade Notation 은 동일한 객체를 여러 번 호출하는 간편한 방법입니다.  
-- Cascade Notation 의 표현법인 닷닷 `..` 으로 객체명을 대신합니다.  
-- enum 은 '특정 상수들의 집합' 으로 `enum 이름 {값1, 값2 ...}` 와 같이 선언합니다.  
-- enum 을 통해 프로그래머가 선택할 수 있는 값을 제한할 수 있습니다.  



## Abstract Classes 추상화 클래스  

추상화 클래스는 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>다른 클래스들이 작성해야 할 내용의 청사진</span>이라고 보면 이해가 쉽습니다. 프로그래머가 선언할 클래스의 생김새가 이래야 한다~ 를 정해놓는 것이죠. 물론 여러 추상화 클래스를 만들 수도 있습니다.  

추상화 클래스에는 property, method, return... 등 일반 클래스와 동일한 항목들을 선언할 수 있습니다. 하지만 보통 해당 메서드가 어떠한 작동을 하는지, 해당 프로퍼티가 어떤 값을 가지고 있는지 등은 명시하지 않습니다. <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>그저 추상화 클래스인 A 를 따르는 클래스는 a, b, c 라는 메서드를 가져야 한다.. 라는 가이드라인만을</span> 명시합니다.  

이 청사진을 사용하는 실제 클래스들은 이들을 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>상속, 확장 (extends) 하여 사용</span>합니다. (Java 의 상속과 비슷) 실제 클래스들은 상속받는 추상화 클래스의 메서드를 반드시 선언해야 하죠. 필수적으로 선언해줘야 하는 것을 제외하고는 추상화 클래스와 다르게 추가로 선언해줘도 상관이 없습니다.  

```dart
// 추상화 클래스인 Car 클래스
abstract class Car{
  late int fuel;
  late String type;

  void start();
  void stop();
}

// Car 를 상속받은 Damas 클래스
class Damas extends Car{
  void start() { print('start this car'); }
  void stop() { print('stop this car'); }
  void somethingNew() { print("it's something new!!");}
}

// Car 를 상속받은 Rambo 클래스
class Rambo extends Car{

  String engine;
  String type;

  Rambo({required this.engine, required this.type});

  void start() { print("It's $type. Boorng Boorng~"); }
  void stop() { print('Kiiiick~'); }
}

void main() {

  Damas damas1 = Damas();
  damas1.start();          // >> start this car
  damas1.stop();           // >> stop this car
  damas1.somethingNew();   // >> it's something new!!

  Rambo rambo1 = Rambo(engine: 'Turbo', type: 'Huracán');
  rambo1.start();          // >> It's Huracán. Boorng Boorng~
  rambo1.stop();           // >> Kiiiick~
}
```

--추상화 클래스는 이를 상속하는 다른 클래스들의 '청사진' 이다.  
--추상화 클래스는 `abstract class 클래스명 { }` 과 같은 형식으로 선언한다.  
--추상화 클래스는 이를 상속받는 자식 클래스가 자신의 메서드를 사용하도록 강제한다.  
--상속받는 클래스는 `class 클래스명 extends 추상화클래스명` 과 같은 형식으로 선언한다.  
--추상화 클래스에 property 또한 선언될 수 있으나, 상속시 재선언이 강제되지 않는다.  
--상속받은 클래스에서는 추상화 메서드 외로 property나 다른 메서드를 선언할 수 있따.  

만약 상속받는 클래스가 추상화 클래스의 메서드를 선언하지 않았을 경우, 아래와 같은 오류를 만나볼 수 있습니다.  

![](/assets/images/20240122_001_003.png)


## Inheritance 상속  

상속은 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>이미 선언된 다른 클래스의 특징을 그대로 가져와 새로운 클래스를 만드는 것을 의미</span>합니다.  

이 때 이미 선언되어 자신의 것을 내어주는 클래스를 '부모 클래스' 그리고 부모 클래스의 특징을 가져와 새로이 만들어지는 클래스가 '자식 클래스' 가 됩니다.  

기본적인 선언법은 `class 자식클래스명 extends 부모클래스명` 입니다. 아래 예시를 살펴보죠.  

```dart
enum SuperPower { defenceMaster, infinityMana, pickPocket }
enum Job { Warrior, Magician, Theif, whiteHand }

class Player {
  String name; Job job; int level;

  Player({required this.name, required this.job, required this.level});

  void introduction() {
    print("i'm $name, the $job. and my level is $level");
  }
}

class WhiteHand extends Player {
  WhiteHand({required String name, required Job job, required int level})
      : super(name: name, job: job, level: level); // super constructor
}

void main() {
  WhiteHand player00 = WhiteHand(name: 'player00', job: Job.whiteHand, level: 1);
  player00.introduction();
  print(player00.name);
}
// >> i'm player00, the Job.whiteHand. and my level is 1
// >> player00
```

예시에서 확인할 수 있듯이, 'WhiteHand' 클래스는 'Player' 클래스를 상속받았습니다. 따라서 WhiteHand 클래스에는 별도로 introduction 메서드를 선언하지 않았음에도 불구하고, 이 메서드를 실행할 수 있습니다.  

또한 동일한 이유로 WhiteHand 클래스에 name이라는 필드를 별도로 선언하지 않았음에도 player00.name을 호출할 때 "player00"이라는 이름이 반환되는 것을 확인할 수 있습니다.  

상속을 받는 자식 클래스는 부모 클래스의 property 그리고 method 를 별도의 선언 없이도 상속받게 됩니다. (값이 할당되지 않은 property는 반드시 초기화를 해줘야 합니다. -> 다음 단락 참고)  

### Super Constructor  

이런 상속에서 주의할 점이 있습니다. 바로 상속을 할 때에는 자식 클래스에서 부모 클래스 생성자를 실행하고, 그 안의 변수를 초기화해줘야 한다는 것이죠.  

```dart
// ... (전략) ...
class WhiteHand extends Player {
  WhiteHand({required String name, required Job job, required int level})
      : super(name: name, job: job, level: level); // super constructor
}
// ... (후략) ...
```

위 예시를 보면 WhiteHand 클래스 안의 Constructor 부분에서 : super(...) 라는 초기화 부분을 볼 수 있을 것입니다.  

이 부분은 부모 클래스의 Constructor 즉 `Player(name: $name, job: $job, level: $level)` 과 같은 뜻으로 보면 됩니다. 즉 부모 클래스를 만들어주는 것이죠. 그리고 여기서 사용되는 `: super(...)` 부분을 바로 Super Constructor 라고 합니다.  

자식 클래스에서 생성자를 만들어주면서, <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>부모 클래스 부분은 Super Constructor를 통해 손쉽게 초기화</span>해주는 것입니다.

### Override  

Override는 자식 클래스에서 부모 클래스의 메서드와 동일한 이름을 가진 함수를 선언할 때 사용됩니다. "대체" 의 의미로 보면 되는데요, <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>부모 클래스의 메서드를 이어받아 그 내용을 수정하거나 완전히 새로운 내용으로 대체</span>하는 것을 의미합니다.  

```dart
enum SuperPower { defenceMaster, infinityMana, pickPocket }
enum Job { Warrior, Magician, Theif, whiteHand }

// Parent Class : Player
class Player {
  String name; Job job; int level;

  Player({required this.name, required this.job, required this.level});

  void introduction() {
    print("i'm $name, the $job. and my level is $level");
  }
}

// Child Class : Magician
class Magician extends Player {

  Magician({required String name, required int level})
      : super(name: name, job: Job.Magician, level: level);

  @override // 부모 쿨래스의 메서드와 동일한 이름의 메서드를 사용할 때에는 @override 어노테이션 사용을 권장한다.
  void introduction() {
    super.introduction();
    print("HaHa, i'm the best ${this.job} in this World!");
    print("my name is ${this.name}, and ${this.level} level");
  }
}

// Child Class : Theif
class Theif extends Player {
  String somethingNew = 'something new';  // 부모 class에는 없던 property도 추가할 수 있다.

  Theif({required String name, required int level})
      : super(name: name, job: Job.Theif, level: level);

  // 하지만 동일한 이름의 메서드를 사용할 때 어노테이션을 사용하지 않아도 컴파일시 자동으로 오버라이드로 인식은 된다.
  void introduction() {
    print("HeHe... what's wrong with you?");
    print("i do not tell you any $somethingNew");
  }
}

// main
void main() {

  WhiteHand player00 = WhiteHand(name: 'player00', job: Job.whiteHand, level: 1);
  player00.introduction();

  Warrior player01 = Warrior(name: "player01", level: 10);
  player01.introduction();

  Magician player02 = Magician(name: "player02", level: 15);
  player02.introduction();

  Theif player03 = Theif(name: 'player03', level: 50);
  player03.introduction();
}
```

사용 시에는 메서드 위에 `@override` 어노테이션을 붙이지 않아도 컴파일러가 오버라이드를 자동으로 인식하지만, 가독성을 높이고 실수를 방지하기 위해 웬만하면 `@override` <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>어노테이션을 사용하는 것이 권장</span>됩니다.    


## Mixin Class  

mixin class는 생성자(Constructor)가 없는 클래스로, `mixin 클래스명 {}` 혹은 `mixin class 클래스명 {}` 과 같은 방식으로 선언합니다.  

<span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>mixin 클래스는 이들의 프로퍼티나 메서드를 다른 클래스에서 끌어와 사용하게끔 하는 목적</span>으로 생성합니다. 즉, 일종의 <span style='background:linear-gradient(to top, #FFE400 20%, transparent 20%)'>"보관함" 클래스</span>라고 보면 됩니다.  

mixin 클래스는 두 가지가 있는데요, `mixin` 로 선언하는 경우는 mixin 클래스로만 사용할 경우에 사용하며, `mixin class` 는 mixin 클래스와 일반 클래스 둘 모두로 사용할 수 있습니다. (`mixin class` 는 dart 3.0 이후 버전에서 사용이 가능합니다.)  

다른 클래스에서 mixin 의 프로퍼티나 메서드를 끌어와 사용할 때에는 `with` 수식어를 사용합니다. 일반 클래스를 선언할 때 `class 클래스명 with 참조클래스1, 참조클래스2 ..{}` 와 같이 with로 묶여 사용되죠.  

이렇게 with로 끌어온 mixin 클래스의 property 와 method 는 어떠한 강제성 없이 사용할 수 있습니다. inheritance(상속)의 경우는 강제성이 있지만, mixin 은 강제사항 없이 가져올 뿐입니다. 매우 유용하고 Flutter에서 매우 많이 사용되므로, 꼭 알고 있도록 합시다.  

```dart
mixin class Strong {
  final double strength = 10000;
}

mixin Speed {
  final double speed = 10000;
  void skillRunQuick() {
    print('run fast!');
  }
}

class Player with Strong, Speed {
  String name, job;
  Player({required String name, required String job})
      : this.name = name,
        this.job = job;
}

void main() {
  Player player01 = Player(name: 'jongya', job: 'magician');
  player01.skillRunQuick();
  print(player01.strength);
  print(player01.name);
}
// ===================================
// >> run fast!
// >> 10000.0
// >> jongya
```


하지만 아래와 같이 Mixin 클래스들 끼리는 with를 사용할 수가 없습니다. 누군가는 Constructor를 가져야 한다는 것!.  

```dart
class Strong {
  final double strength = 10000;
}

class Speed {
  final double speed = 10000;
  void skillRunQuick(){ print('run fast!'); }
}

class Player with Strong, Speed{
  String name = 'jongya';
  String job = 'magician';
}
```

![](/assets/images/20240122_001_004.png)

또한 inheritance 와 mixin을 동시에 사용할 수도 있으니 참고!  

```dart
class ParentClass{
    // ~ some content of this class ~ //
}

mixin MixinClass{
    // ~ some content of this class ~ //
    // ~ without Constructor ~ //
}

class ChildClass extends ParentClass with MixinClass{
    // ~ some content of this class ~ //
    // this class can use property and methods of ParentClass and MixinClass
}
```


## Reference

https://nomadcoders.co/dart-for-beginners/lectures/4113  
https://nomadcoders.co/dart-for-beginners/lectures/4114  
https://nomadcoders.co/dart-for-beginners/lectures/4115  
https://nomadcoders.co/dart-for-beginners/lectures/4116  
https://nomadcoders.co/dart-for-beginners/lectures/4117  
https://nomadcoders.co/dart-for-beginners/lectures/4118  
https://nomadcoders.co/dart-for-beginners/lectures/4119  
https://nomadcoders.co/dart-for-beginners/lectures/4120  
https://nomadcoders.co/dart-for-beginners/lectures/4121  
https://nomadcoders.co/dart-for-beginners/lectures/4122  
https://nomadcoders.co/dart-for-beginners/lectures/4123  
dart - mixin : https://dart-ko.dev/language/mixins  