---
title: Java ProcessBuilder, Process - 자바로 외부 프로세스 제어하기 # 제목
excerpt: # 서브 타이틀
date: 2023-06-05 11:33:00 +0900      # 작성일
lastmod: 2023-06-05 11:33:00 +0900   # 최종 수정일 : 구글 사이트등록 관련 필요
categories: Java         # 다수 카테고리에 포함 가능
tags: Java java processbuilder process builder 프로세스 콘솔 커맨드 command 다른 언어 # 태그 복수개 가능
classes: wide        # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20230605_001-->

<blockquote>
표준적인 ProcessBuilder 사용법은 아래 펼치기를 참고
<details>
<summary> 펼치기/접기 </summary>
<div markdown='1'>

```java
// Process 관련 설정
File path = new File("프로세스가/실행될/디렉토리/경로");
ArrayList<String> commandList = new ArrayList<>();

// 명령어 설정
commandList.add("명령어1");
commandList.add("명령어2");
commandList.add("명령어3");

// ProcessBuilder 생성
ProcessBuilder pb = new ProcessBuilder();

// ProcessBuilder 설정
pb.directory(path);
pb.command(commandList);

// Process 실행
Process p = pb.start();

// Buffered Reader로 실행 내용 읽어오기
BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), "UTF-8"));
String line;
while ((line = br.readLine()) != null){
    System.out.println(">>> " + line);
}
```
</div>
</details>
</blockquote>


<br>

# 1. Process Builder, Process

<span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>Process Builder 클래스</span>는 자바에서 외부 프로세스를 생성하고 제어할 수 있는 도구입니다.  
쉽게 말해 자바로 외부 프로그램을 실행시킬 수 있는 방법 중 하나입니다.    

<span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>그리고 Process 클래스</span>는 Process Builder 를 통해 생성된 프로세스를 나타내는 추상 클래스입니다.  
Process Builder를 통해 생성된 프로세스의 상태 제어, 입출력 등의 관리가 가능합니다.  

아래에 간단한 예시를 들겠습니다.

## 1-1. 예시

먼저, 자바를 통해 실행시킬 간단한 python 파일을 만듭니다.  
이 파일은 두 개의 문장을 출력합니다.  

```python
# ** 파일명 : python_ex.py
print("test 입니다.")
print("process builder가 정상적으로 실행되었습니다.")
```

java에서 ProcessBuilder를 통해 python 파일을 실행시키는 Process를 생성하고,  
이 프로세스를 실행 시킵니다.  
그리고 BufferReader로 실행 결과를 받도록 합니다.  
자세한 내용은 아래에서 다룰테니, 지금은 작동과 결과만 보도록 합니다.  

```java
// ** 파일명 : example_processbuilder.java

// 파이썬 경로를 path 변수에 저장
String path = "User/Desktop/python_ex.py"

// Process Builder로 실행될 프로세스 선언
ProcessBuilder pb = new ProcessBuilder("python", path);

// 외부 프로세스 시작
Process p = pb.start();

// 프로세스 실행 결과를 받아오기
BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), "UTF-8"));
String line;
while ((line = br.readLine()) != null){
    System.out.println(">>> " + line);
}

// 자바가 실행됐다는 증거로 print
System.out.println("process 실행이 완료되었습니다.")
```

자바파일을 실행시킨 결과는 아래와 같습니다.  

```terminal
// 실행 결과
>>> 파이썬 파일을 실행합니다.
>>> test입니다.
>>> process 실행이 완료되었습니다.
```

## 1-2. Process Builder 와 Process 의 관계

위 예시에서 사용된 Process Builder와 Process의 관계를 추가로 설명해보도록 하겠습니다.  

ProcessBuilder 클래스는 Java 파일이 실행되는 것 외적으로 프로세스를 생성하기 위해 사용하는 툴입니다.  
이 클래스 객체는 terminal에 입력하는 명령어들을 파라미터로 갖을 수 있습니다.  

그리니까.. "터미널에서 입력할 내용을 담고 있는 그릇" 이라고 생각하면 편할 것입니다.  
다르게 말해보자면 "실행할 프로세스 명령어를 담고있는 그릇"으로도 말할 수 있겠습니다.    

예를 들어 `ProcessBuilder("python", "/User/Desktop/python_ex.py")` 라는 ProcessBuilder 객체는  
`Desktop에 있는 python_ex.py 파이썬 파일을 실행`하는 명령어를 담고 있는 것이죠.  

![](/assets/images/20230605_001_001.png)

Process 클래스는 ProcessBuilder 클래스를 시작(.start()) 하는 것으로 만들어지게 됩니다.  
이 클래스 객체는 현재 Java 파일이 실행되는 외부에 만들어진 Process를 가리키고(=추상화하고) 있습니다.  

위에서 예를 든 ProcessBuilder("python", "/User/Desktop/python_ex.py") 객체를 `.start()하여 만들어진 Process 객체`는  
`python_ex.py 파일이 실행되는 작업 자체`를 의미합니다.  

![](/assets/images/20230605_001_002.png)

<span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>
정리해보자면 ProcessBuilder 객체는 "앞으로 실행할 작업의 정보를 담고 있는" 객체이고,<br>
Process 객체는 "실행되고 있는 작업을 추상화한" 객체입니다.  
</span>

<br>
<br>

# 2. ProcessBuilder 클래스 설명  

앞서 설명했듯 **"앞으로 실행할 작업(Process)의 정보를 담고 있는"** 객체입니다.  
그리고, .start() 메서드를 통해 그 작업을 실행시킬 수도 있습니다.  

## 2-1. ProcessBuilder 클래스 선언

ProcessBuilder 클래스의 선언은 일반적인 객체 선언과 동일한 형태로 진행됩니다.  
그리고 선언될 때의 파라미터는 String 형태와 List 형태 두 가지를 사용할 수 있습니다.  

```java
// String 형태의 파라미터를 사용하는 경우
ProcessBuilder pb1 = new ProcessBuilder("명령어1", "명령어2", "명령어3" ...)
```

```java
// List 형태의 파라미터를 사용하는 경우
ArrayList<String> l1 = new ArrayList<>();
l1.add("명령어1")
l1.add("명령어2")
l1.add("명령어3")
...
ProcessBuilder pb2 = new ProcessBuilder(l1);
```

```java
// 그리고 ProcessBuilder 객체를 먼저 생성하고,
// 나중에 command 를 설정할 수도 있습니다.
ProcessBuilder pb3 = new ProcessBuilder();
pb3.command("명령어1", "명령어2" ...);
```

두 방법 중 무엇이 좋고 나쁜 것은 없어 보입니다. 단지 상황에 맞춰 사용하면 되겠습니다.  
명령어가 짧고 적을 경우 String 형태를, 명령어가 길거나 많을 경우 ArrayList 형태를 사용하면 좋겠습니다.  

## 2-2. ProcessBuilder 클래스의 메서드

다음은 ProcessBuilder 클래스의 메서드(method)들입니다.  
여기서 '외부 Process'란 ProcessBuilder.start()를 통해 만들어진 Process를 의미합니다.  

|Method|파라미터타입|설명|반환값|
|---|---|---|---|
|start()||설정된 명령어와 인수, 작업 디렉토리 등을 바탕으로<br>외부 Process를 시작합니다.|Process 객체|
|command(String ...)|String/ArrayList|외부 Process를 실행하기 위한 명령어와<br>인수를 설정합니다.||
|directory(file)|File|외부 Process가 실행될 작업 디렉토리를 설정합니다.||
|environment()||외부 Process가 실행될 때 사용되는 환경 변수를<br>설정하기 위한 Map 객체를 반환|Map<String, String>|
|inheritIO()||현재 자바 프로세스의 표준 입출력, 에러 스트림을<br>외부 프로세스와 공유해 리디렉션||
|redirectInput()|ProcessBuilder.Redirect<br>source|외부 Process의 표준 입력을 지정된 소스로 리디렉션||
|redirectOutput()|ProcessBuilder.Redirect<br>destination|외부 Process의 표준 출력을 지정된 대상으로 리디렉션||
|redirectError()|ProcessBuilder.Redirect<br>destination|외부 Process의 표준 에러를 지정된 대상으로 리디렉션||

directory 클래스에서 사용되는 file 클래스에 대해서는 아래 포스트를 참고해주세요.  
[포스트 링크 : Java file class](https://whdrns2013.github.io/Java/20230601_002_file_class)

## 2-3. ProcessBuilder 클래스의 속성

다음은 ProcessBuilder 클래스의 속성(attribute)들입니다.  
여기서 '외부 Process'란 ProcessBuilder.start()를 통해 만들어진 Process를 의미합니다.  

|Attribute|설명|타입|
|---|---|---|
|command()|외부 Process의 명령어와 인수를 저장한 리스트|List|
|directory()|외부 Process가 실행될 작업 디렉토리|File|
|environment()|외부 Process가 실행될 때 사용되는 환경 변수|Map<String, String>|
|redirectErrorStream()|표준 에러 스트림을 표준 출력 스트림으로 리디렉션할지 여부|Boolean|

## 2-4. ProcessBuilder method와 attribute 예시

```java
public class example{
  public static void main(String[] args) throws IOException{

    ProcessBuilder pb = new ProcessBuilder(); // ProcessBuilder 생성

    File path = new File("/User/Desktop/");   // Process 실행될 경로
    String fileName = "./example.py";         // 실행시킬 파일명

    pb.directory(path);                       // Process 가 실행되는 경로 지정
    pb.command("python", fileName);           // Process command 지정

    Process p = pb.start();                   // Process 실행

    System.out.println("커맨드 : " + pb.command());
    // >>> 커맨드 : [python, ./example.py]
    System.out.println("디렉토리 : " + pb.directory());
    // >>> 디렉토리 : /User/Desktop
    System.out.println("환경변수 : " + pb.environment());
    // >>> 환경변수 : {LOCAL_GIT_DIRECTORY:/APPLICATION .... 생략}
    System.out.println("에러스트림 리디렉션 : " + pb.redirectErrorStream());
    // >>> 에러스트림 리디렉션 : false (지정하지 않음)
  }
}
```

## 2-5. Exception이 필요한 이유

ProcessBuilder 클래스를 사용할 때에는 <span style='background:linear-gradient(to top, #FFE400 50%, transparent 50%)'>꼭 예외처리를 사용해야</span> 합니다.  
예외처리가 되지 않는 경우엔 unhandeled exception이 발생하게 되며, 실행이 불가합니다.  

![](/assets/images/20230605_001_003.png)  

예외처리를 하는 이유는, 실행시키려는 프로세스가 어떤 오류를 발생했을 경우에 Java 프로세스의 향방을 정해야 하기 때문이죠.

예외처리는 (1) ProcessBuilder 의 실행부(.start()) 에서 try-catch 문을 사용하거나  
(2) ProcessBuilder를 사용하는 클래스의 main 메서드에서 throws Exception을 사용하면 됩니다.  

두 가지 방법 중 하나를 상황에 맞게 사용하면 되겠습니다.  

```java
// try-catch 문 사용
public class example_processbuilder{
  public static void main(Stinrg[] args){

    ProcessBuilder pb = new ProcessBuilder("cd", "User/Desktop");

    // try-catch
    try {
      Process p = pb.start();
    } catch (IOException | InterruptedException e){
      e.printStackTrace();
    }
  }
}
```

```java
// throws Exception 사용
public class example_processbuilder{
  // throws Exception
  public static void main(String[] args) throws IOException{
    
    ProcessBuilder pb = new ProcessBuilder("cd", "User/Desktop");

    Process p = pb.start();
  }
}
```

<br>
<br>

# 3. Process 클래스 설명  

Process 클래스는 현재 Java가 실행되는 프로세스와 다른, 외부의 Process를 바라보는 추상 클래스입니다.  
이 클래스로 외부 Process의 상태를 제어하고, 입출력, 에러 스트림 관리를 할 수 있습니다.  

## 3-1. Process 클래스 선언  

Process 클래스는 일반적으로 ProcessBuilder.start() 메서드 혹은 Runtime.exec() 메서드를 통해 생성됩니다.  
ProcessBuilder는 위에서 설명했는데, Runtime은 뭐냐.  
Runtime.exec()은 Java 1.7 미만의 버전에서 사용된 외부 프로세스 실행 메서드입니다.  

```java
ProcessBuilder pb = new ProcessBuilder("명령어1","명령어2"...);
Process p = ProcessBuilder.start();
```

## 3-2. Process 클래스의 속성

|Attribute|설명|타입|
|---|---|---|
|Process.getInputStream()|외부 Process의 표준 출력에 대한 입력 스트림|InputStream|
|Process.getOutputStream()|외부 Process의 표준 입력에 대한 출력 스트림|OutputStream|
|Process.getErrorStream()|외부 Process의 표준 에러에 대한 입력 스트림|InputStream|

## 3-3. Process 클래스의 메서드

|Method|파라미터타입|설명|반환값|
|---|---|---|---|
|.waitFor()||외부 Process의 종료를 기다리고, 종료 코드를 반환|int|
|.destory()||외부 Process를 강제 종료시킨다.|void|
|.isAlive()||외부 Process가 실행중인지 여부 반환|boolean|
|.exitValue()||외부 Process의 종료 코드를 반환<br>이 메서드 전에 .waitFor()메서드를 사용해<br>Process가 종료되기를 기다려야 한다.|int|

## 3-4. Process method와 attribute 예시

```java
public class example{
  public static void main(String[] args) throws IOException{

    ProcessBuilder pb = new ProcessBuilder("명령어1", "명령어2"); // ProcessBuilder 생성
    Process p = pb.start(); // Process 실행, 생성

    System.out.println(p.getInputStream());
    // >>> java.lang.ProcessImpl$ProcessPipeInputStream@27c170f0
    System.out.println(p.getOutputStream());
    // >>> java.lang.ProcessImpl$ProcessPipeOutputStream@5451c3a8
    System.out.println(p.getErrorStream());
    // >>> java.lang.ProcessImpl$ProcessPipeInputStream@2626b418
    System.out.println(p.isAlive());
    // >>> false : 프로세스가 종료됨

    p.destroy();            // 프로세스를 강제 종료
  }
}
```

```java
public class example{
  public static void main(String[] args) throws IOException, InterruptedException{

    // 계속 켜져있는 블로그 프로세스를 외부 프로세스로 바라보도록 하고
    Process p = Runtime.getRuntime().exec(file);

    // While : 프로세스가 살아있다면(true) 그리고 i 가 5 이하라면
    while (p.isAlive()){
      System.out.println("External process is running..."); // 정해진 문구 출력
      Thread.sleep(1000);                                   // 1000ms (1초) 대기
    }

    // 프로세스가 종료되었을 때 종료코드 출력
    System.out.println("External process exited with code: " + p.exitValue());

  }
}

// 출력 내용
// >>> External process is running...
// >>> External process is running...
// >>> External process is running...
// >>> ...
// >>> External process exited with code : 0 (프로세스 종료되었을 때)
```


<br>
<br>



# 4. Reference

개인 실험  
Java의 정석 (남궁성)  
자바로 외부 프로그램 실행시키기 : https://yangyag.tistory.com/55  
Java 파일 입출력, 파일 경로 : https://chb2005.tistory.com/57  
ProcessBuilder 클래스 : https://happygrammer.github.io/java/processbuilder/  
chatGPT (교차검증)  