---
title: "Dart Main Function"
excerpt: "Dart 프로그램의 시작 Main Function"
last_modified_at: 2024-08-11 23:15:00 +0900
permalink: /docs/dart_and_flutter/03_dart_main_function
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
sidebar:
  nav: "docs_dart_and_flutter"
---


## Main Function  

main function은 Dart 로 작성한 프로그램의 EntryPoint(진입점)가 되는 코드 파일입니다.  

프로젝트 내에서 연관된 Class나 .dart파일들은 이 main Function을 시작점으로 호출됩니다.  

다시 말해, Main Function이 없다면 Dart로 작성한 프로그램은 실행되지 않습니다. 아래 예시를 통해 자세히 알아보겠습니다.  

먼저, main Function을 제대로 선언한 뒤 실행을 해보겠습니다.  


![](/assets/images/20240121_003_001.png)


하지만 "main" 을 something으로 바꾸면, 실행버튼이 사라져서 실행할 수 없는 것을 볼 수 있습니다.  

![](/assets/images/20240121_003_002.png)

이처럼 Main Function이 없다면 Dart 프로그램이 실행조차 할 수 없다는 것을 알 수 있습니다.   
앞으로 Dart와 Flutter 모두에서 이 Main Function은 프로그램의 시작점으로 자주 볼 수 있을 것이니 꼭 기억해둡시다!  
