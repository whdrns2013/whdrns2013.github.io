
버전관리시스템 버전관리 버전 관리 시스템 version control system 중앙 집중형 분산형 cvs svn mercurial bazzar git


## 버전 관리 시스템 version control system  

### 버전 관리의 개념  

버전 관리란 파일이나 여러 파일 집합의 변경 이력을 추적하고, 기록하며 관리하는 것을 뜻한다. 버전 관리를 통해 크게 세 가지 기능을 얻을 수 있다.  

(1) 과거 어떤 시점의 파일 내용을 확인  
(2) 파일의 상태를 과거의 특정 시점으로 되돌림  
(3) 누가 언제 어떤 내용을 수정했는지 확인  

### 버전 관리의 필요성  

문서나 프로그램을 작성할 때에는 한 번에 작성을 시작하여 완성하는 경우는 드물고, 계속적인 수정 작업을 거치면서 완성을 해 나가게 된다. 프로젝트를 수행하면서 문서 또는 프로그램 소스 등을 관리해야 하는데, 특히나 다수의 사람이 참여하고 수많은 프로그램과 산출물을 관리해야 하는 소프트웨어 프로젝트에서는 그러한 변경 이력 관리가 특히나 필요하다. 하지만 수많은 문서의 변경 사항을 수작업으로 관리하는 것은 불가능에 가깝고, 가능하다 하더라도 생산성이 극도로 떨어진다.  

버전 관리의 필요성과, 수작업을 통한 버전 관리의 극악의 효율성을 극복하고 소프트웨어 개발 프로젝트에서 협업시 변경사항의 충돌 등을 방지하고자을 문서나 소스 코드의 변경 이력을 자동으로 관리하는 버전 관리 소프트웨어 혹은 버전 관리 시스템이 등장하였다.  

### 버전 관리 시스템(소프트웨어)의 역사  

|시대|버전 관리 시스템|내용|
|---|---|---|
|1972년|SCCS|Source Code Control System. 벨 연구소에서 개발된 최초의 VCS. 파일의 변경 이력을 기록하고 기본적인 버전 관리를 제공.|
|1982년|RCS|Revision Control System. SCCS보다 효율적인 파일 관리와 저장 방식을 도입한 VCS. 처음엔 프로그램을 위해 개발됐으나, 텍스트 문서나 구성 파일에 적용해도 유용하다.|
|1990년|CVS|Concurrent Versions System. RCS를 기반으로, 여러 사용자가 동시에 작업할 수 있는 기능이 추가됨. 협업 가능 중앙 집중형 모델의 대표적 시스템.|
|2000년|BitKeeper|소스 코드의 분산 버전 관리를 위한 소프트웨어로, 처음에는 사유 소프트웨어로 개발되었지만 2016년 오픈 소스 소프트웨어로 출시되었다. 더 이상 개발되고 있지 않다.|
|2000년|SVN|Subversion. CVS의 단점을 보완하고자 개발된 중앙 집중형 VCS. 보다 신뢰성이 높고 기능이 강화되었다.|
|2005년|Git|리눅스 커널의 창시자인 리누스 토르발스가 BitKeeper의 라이선스 논란에 대한 대안으로 개발함. 속도와 효율성을 강조한 분산형 VCS의 대표 주자.|
|2005년|Mercurial|크로스 플랫폼 분산 버전 관리 도구로, 대부분 파이썬을 사용해 개발되었다. CLI 기반 프로그램이다.|
|2007년|Bazaar|우분투를 담당하고 있는 캐노니컬이 지원하는 분산 VCS. 자유 소프트웨어이다.|


### 주요 버전 관리 시스템(소프트웨어)  

|구분|버전 관리 소프트웨어|
|---|---|
|중앙 집중형|CVS, SVN|
|분산형|Mercurial, Bazzar, Git|



## 버전 관리 시스템 유형 비교 (중앙집중형과 분산형)  

### 중앙집중형 버전 관리 시스템  

![](/assets/images/2024-11-28-20241128_001_001.png)



### 분산형 버전 관리 시스템  

![](/assets/images/2024-11-28-20241128_001_002.png)


### 중앙집중형과 분산형의 비교  

|구분|중앙집중형|분산형|
|---|---|---|
|저장소 위치|중앙 서버에만 존재|중앙 서버 : 원격 저장소<br>지역 컴퓨터 : 지역 저장소(클라이언트)|
|복사본 복사 방법|||
|장점|||
|단점|||
||||
||||




### 버전 관리 시스템과 소스 코드 관리 그리고 소프트웨어 형상 관리  

https://imgeeae.tistory.com/5

https://stackoverflow.com/questions/4127425/whats-the-difference-between-vcs-and-scm


## Reference  

[Wikipedia - RCS](https://ko.wikipedia.org/wiki/%EB%A6%AC%EB%B9%84%EC%A0%84_%EC%BB%A8%ED%8A%B8%EB%A1%A4_%EC%8B%9C%EC%8A%A4%ED%85%9C)  
[Wikipedia - CVS](https://ko.wikipedia.org/wiki/CVS)  
[Wikipedia - BitKeeper](https://ko.wikipedia.org/wiki/%EB%B9%84%ED%8A%B8%ED%82%A4%ED%8D%BC)  
[Wikipedia - Git](https://ko.wikipedia.org/wiki/%EA%B9%83_(%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4))  
[Wikipedia - Mercurial](https://ko.wikipedia.org/wiki/%EB%A8%B8%ED%81%90%EB%A6%AC%EC%96%BC)  
[Wikipedia - Bazaar](https://ko.wikipedia.org/wiki/Bazaar_(%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4))  