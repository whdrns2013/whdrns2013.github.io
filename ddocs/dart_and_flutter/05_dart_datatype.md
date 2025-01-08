---
title: "Dart의 자료형"
excerpt: "dart 데이터 타입"
last_modified_at: 2024-01-21 03:30:00 +0900
permalink: /docs/dart_and_flutter/05_dart_datatype
classes: wide
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_dart_and_flutter"
---



## dart 의 기본적인 데이터타입  

|데이터타입|설명|
|---|---|
|String|문자열 데이터타입을 의미한다.<br>선언시 값은 큰 따옴표 "" 혹은 작은 따옴표 '' 로 묶어준다.|
|bool|true or false 데이터타입을 의미한다.<br>값의 모든 문자를 소문자로 사용해야 한다.|
|int|정수형 데이터타입을 의미한다.|
|double|소수점 이하 자리를 커버할 수 있는 숫자형 데이터타입이다.|
|num|Dart 에는 num 이라는 데이터타입이 있다.<br>그리고 이 num 클래스는 int와 double의 부모 클래스이다.<br>다르게 말하면, num은 int형과 double형을 모두 커버할 수 있는 것이다.|
|List|iterable 데이터타입의 하나이다.<br>리스트의 모든 원소는 동일한 데이터타입이어야 한다.|
|Map<key,value>|iterable 데이터타입의 하나이다.<br>key와 value는 다른 데이터타입일 수 있으나<br>하나의 Map 안의 모든 key는 동일한 데이터타입이어야 하고<br>하나의 Map 안의 모든 value 또한 동일한 데이터타입이어야 한다.|


## Dart 의 자료형의 특징 : 모두 class 이다.  

여타 언어와 다르게 Dart의 데이터타입은 모두 class 입니다.    

예를 들어 Java에서는 정수를 나타내는 데이터타입으로 int와 Integer가 있죠.  
int는 데이터타입이고, Integer는 wrapper class인데, 이에 Integer는 필드를 포함하고 있습니다.  

Dart는 모든 데이터타입이 모두 class 이고, 이러한 특징 때문에 다양한 Attribute와 Method를 가질 수 있습니다.  



## String

### String Interpolation ★★  

번역해보면 "문자열 보간" 입니다.  

![](/assets/images/20240121_005_001.png)


String Interpolation 은 String 문자열에 변수를 넣어 유동적으로 사용하는 방법입니다.  
사용 방법은 간단합니다. String 문자열의 표현법인 따옴표 안쪽에 달러($)표시를 쓰고, 그 다음에 비로 변수명을 적어주면 됩니다.  

아래 예시를 보겠습니다.  

```dart
void main(){
  String name = "Jongya";
  String introduction = "Hi, my name is $name. nice to meet you.";
  print(introduction);
}
// ====================
// >> Hi, my name is Jongya. nice to meet you.
```

그리고 수식 계산이나 메서드 사용이 필요한 경우엔 달러($) 표시 다음 중괄호{}로 묶어주면 됩니다.  

```dart
void main(){
  String name = "Jongya";
  int age = 10;
  String introduction = "Hi, my name is $name. im ${age + 5} years old. nice to meet you.";
  print(introduction);
}
// ====================
// >> Hi, my name is Jongya. im 15 years old. nice to meet you.
```

```dart
void main(){
  String name = "Jongya";
  String introduction = "Hi, my name is ${name.toUpperCase()}. nice to meet you.";
  print(introduction);
}
// ====================
// >> Hi, my name is JONGYA. nice to meet you.
```

수식 계산이 필요 없더라도 중괄호{} 로 묶어줘도 되니, 헛갈리지 않도록 무조건 중괄호로 묶어주는 것도 좋은 습관이라고 생각됩니다.  

```dart
void main(){
  String name = "Jongya";
  String introduction = "Hi, my name is ${name}. nice to meet you.";
  print(introduction);
}
// ====================
// >> Hi, my name is Jongya. nice to meet you.
```



## List 데이터타입  

List 데이터타입은 동일한 데이터타입 값을 여러 개 배열로 가지고 있는 자료형을 의미합니다. 먼저 List 데이터타입의 변수 선언 방법부터 알아보겠습니다.  

```dart
// List 데이터타입 변수 선언 방법

void main() {
    var list1 = [1, 2, 3, 4];
    List<int> list2 = [1, 2, 3, 4];
}
```

List 데이터타입은 여러 가지 Attribute와 Method를 가지고 있는데요, 그 중 주요한 몇 가지를 살펴보겠습니다.  

### List 데이터타입의 주요 Attribute와 Method  

**(1) add : 값 추가**  

```dart
void main() {
    // add : 리스트에 값을 추가한다.
    var list1 = [1, 2, 3, 4];
    list1.add(5);
    print(list1);

    // addAll: 리스트에 여러 값을 더한다.
    List<int> list2 = [5, 6, 7, 8];
    list2.addAll([7, 8, 9, 10]);
    print(list2);
}
====================
// >> [1, 2, 3, 4, 5]
// >> [5, 6, 7, 8, 7, 8, 9, 10]
```

**(2) first, last : 첫 번째와 마지막 값 반환**  

```dart
void main() {
    // first : 리스트의 첫 번째 값을 반환한다.  
    List<int> list3 = [9, 10, 11, 12];
    print(list3.first);

    // last : 리스트의 마지막 값을 반환한다.  
    List<int> list4 = [13, 14, 15, 16];
    print(list4.last);
}
====================
// >> 9
// >> 16
```

**(3) isEmpty, isNotEmpty : 비어있는지 아닌지**  

```dart
void main() {
    // isEmpty, isNotEmpty : 비어있는지 아닌지
    List<int> list5 = [17, 18, 19, 20];
    print(list5.isEmpty);
    print(list5.isNotEmpty);
}
====================
// >> false
// >> true
```

**(4) clear : 리스트 안의 값 비우기**  

```dart
void main() {
    // clear : 리스트 안을 모두 비운다.
    List<String> list6 = ["안녕", "이건", "리스트야"];
    print(list6);
    list6.clear();
    print(list6);
}
====================
// >> [안녕, 이건, 리스트야]
// >> []
```

**(5) contains : 특정 값이 포함되어있는지**  

```dart
void main() {
  // contains : 특정 값이 포함되어있는지 여부를 체크한다.  
    List<String> list7 = ["이", "값이", "포함되어 있나?"];
    print(list7.contains("이"));
    print(list7.contains("없는값"));
}
====================
// >> true
// >> false
```

**(6) 리스트 인덱싱**  

```dart
void main() {
    // 인덱싱 : list 에서 특정 순서에 있는 값을 반환받을 때
    List<String> list8 = ['첫 번째', '두 번째', '세 번째'];
    print(list8[1]);
    print(list8[list8.length -2]);
}
====================
// >> 두 번째
// >> 두 번째
```

**(7) 리스트 슬라이싱**  

```dart
void main() {
    // slicing
    List<int> list9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    print(list9.sublist(2, 6));
}
====================
// >> [3, 4, 5, 6]
```

### Collection If  

collection if 는 "존재 할 수도, 안할 수도 있는 값" 을 리스트의 원소로 할당해두는 것을 의미합니다. 좀 다르게 표현해보면 "리스트 안의 조건문" 이라고도 말해볼 수 있겠습니다.  

글로는 설명이 어려우니, 예시로 이해해보도록 하겠습니다.  

```dart
void main() {
    bool giveMeFive = false;
    bool giveMeSix = true;

    List<int> list10 = [
        1,
        2,
        3,
        4,
        if(giveMeFive) 5,
        if(giveMeSix) 6,
        ];

    print(list10);
}
====================
// >> [1, 2, 3, 4, 6]
```

list10 변수 리스트에 할당되는 값들을 살펴보면 1, 2, 3, 4 와 같은 일반적인 정수형 값도 있지만, if로 시작하는 조건문을 원소값으로도 가지고 있는 것을 볼 수 있습니다.  

해석하면 아래와 같습니다.  

(1) if(giveMeFive) 5: giveMeFive가 참이면 5를 원소로 갖는다.  
(2) if(giveMeSix) 6: giveMeSix가 참이면 6을 원소로 갖는다.  

그러므로 giveMeFive 가 false 이므로 5는 리스트에 추가되지 못하였고, 조건문이 true인 6은 리스트의 값으로 추가될 수 있었던 것이죠.  

Collection If를 사용하지 않은 기본 표현법으로 이를 풀어 쓰자면 아래와 같습니다.  

```dart
void main() {
    bool giveMeFive = false;
    bool giveMeSix = true;
    List<int> list11 = [1, 2, 3, 4];
    if (giveMeFive == true) {list11.add(5);}
    if (giveMeSix == true) {list11.add(6);}
    print(list11);
}
====================
// >> [1, 2, 3, 4, 6]
```


### Collection For

Collection For 는 list 자료형에 for 문을 추가해 원소를 추가하는 방법입니다.  
예시부터 살펴보겠습니다.  

```dart
void main() {
  var newMenues = ['Cart', 'HotDeal'];
  // 원래 메뉴에 새로운 메뉴 추가. 별까지!
  var navBar = ['Home', 'Dashboard', 'MyPage', 'Admin Setting', for(menu in newMenuews) '⭐️$menu'];
  print(navBar);
}
==================
// >> [Home, Dashboard, MyPage, Admin Setting, ⭐️Cart, ⭐️HotDeal]
```

앞 단락에서 살펴본 Collection If와 함께 사용해보도록 하겠습니다.  

```dart
void main() {
  // 1 ~ 20 까지 홀수를 구하기 
  var numberRange = Iterable<int>.generate(20, (index) => index +1);
  List<int> oddNumber = [ for(int number in numberRange) if (number % 2 != 0) number ];
  print(oddNumber);
}
==================
// >> [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
```

## map  

JavaScript 나 TypeScript 의 Object, 그리고 파이썬의 Dictionary와 같습니다. 즉, Key:Vale 쌍 한 개 이상으로 이루어진 데이터 집합이죠.  
Map의 선언 방식은 var로 선언하는 방식, 그리고 데이터타입을 명시해서 선언하는 방식 두 가지가 있습니다.  

```dart
void main() {
    
    // Declaration with var
    var player = {
        'name' : 'jongya',
        'level' : 20,
        'job' : 'magician',
        'superUser' : false,
    };
    
    // Declaration with dataType
    map<String, String> keyValue = {
        'key' : 'value',
        'name' : 'some name',
    };
}

```

그리고 map 데이터타입 안에는 또다른 Object 형식이 들어갈 수 있는데요, Key와 value 모두에 들어갈 수 있습니다.  

```dart
void main() {
    // can input any object in key or value or both
    Map<List<String>, String> auth = {
        ['Home', 'DashBoard'] : 'guest',
        ['Home', 'AdminPage'] : 'admin',
    };

    Map<String, List<int>> nums = {
        'underFive' : [1, 2, 3, 4],
        'underTen' : [5, 6, 7, 8, 9],
    };
    
    // also can contain several types of obejcts
    var someMap = {
        'first' : 'dragon',
        'second' : 100,
        'third' : [10, 20, 30],
        'real' : true,
    };
}
```

맵에는 유용한 메서드들이 많이 있습니다. 몇 가지만 살펴보겠습니다.  

```dart
void main() {
  
  // Methods
  Map<int, String> someMap= {1:'first', 2:'second', 3:'third'};

  // is it Empty?
  print(someMap.isNotEmpty);  // >> true
  print(someMap.isEmpty);     // >> false

  // contains
  print(someMap.containsKey(2));          // >> true
  print(someMap.containsValue('fifth'));  // >> false

  // get keys or values
  print(someMap.keys);    // >> (1, 2, 3)
  print(someMap.values);  // >> (first, second, third)

  // addAll : 
  someMap.addAll({1 : "change first", 4 : "four"});
  print(someMap);   // >> {1: change first, 2: second, 3: third, 4: four}

  // remove and clear
  someMap.remove(2);
  print(someMap);   // >> {1: change first, 3: third, 4: four}
  someMap.clear();
  print(someMap);   // >> {}
}

```


## Set

set은 집합으로, 다른 여타 언어들의 set과 동일합니다. 중복값을 허용하지 않는 Unique Value 특징이 있고, 원소의 순서가 없는 특징이 있다.  

```dart
void main() {
    // declaration set
    var numbers01 = {1, 2, 3, 4};
    Set<int> numbers02 = {5, 6, 7, 8};

    // set has unique values
    var numbers03 = {1, 2, 3};
    numbers03.add(1);
    numbers03.add(2);
    numbers03.add(4);
    numbers03.add(5);
    print(numbers03);  // >> {1, 2, 3, 4, 5}

    // 순서는 없다.  
    print({1, 2, 3}.containsAll({1, 2, 3}));  // >> true
    print({1, 2, 3}.containsAll({3, 2, 1}));  // >> true

    // methods
    //    add
    Set<String> text01 = {"a", "b", "c"};
    text01.add("d");
    print(text01);  // >> {"a", "b", "c", "d"}

    text01.addAll({"z", "y"});
    print(text01);  // >> {"a", "b", "c", "d", "z", "y"}

    //    contains
    print(text01.contains("b"));    // true

    //    
    print(text01.union({"a","b", "t"}));                // {a, b, c, d, z, y, t}
    print(text01.intersection({"c", "d", "안녕하세요"}));  // {c, d}

    //    remove
    print("== remove ==");
    print(text01.remove({"c", "d"}));    // >> false
    
    //    clear
    print("== clear ==");
    text01.clear();
    print(text01);    // >> {}

    // Attributes
    text01.addAll({"a", "b", "c", "d"});
    print(text01);               // >> {a, b, c, d}
    print(text01.first);         // >> a
    print(text01.length);        // >> 6
    print(text01.isEmpty);       // >> true
    print(text01.runtimeType);   // >> _Set<Strign>

}

```


## Reference  

노마드코더 - basic datatype : https://nomadcoders.co/dart-for-beginners/lectures/4101  
노마드코더 - lists : https://nomadcoders.co/dart-for-beginners/lectures/4102  
노마드코더 - String Interpolation : https://nomadcoders.co/dart-for-beginners/lectures/4103  
노마드코더 - String Interpolation : https://nomadcoders.co/dart-for-beginners/lectures/4104  
노마드코더 - String Interpolation : https://nomadcoders.co/dart-for-beginners/lectures/4105  
노마드코더 - String Interpolation : https://nomadcoders.co/dart-for-beginners/lectures/4106  
