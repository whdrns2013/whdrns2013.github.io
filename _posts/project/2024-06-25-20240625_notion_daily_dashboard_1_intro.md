---
title: 아이폰 홈 화면에 노션 페이지 띄우기 (1) 기획
excerpt: 노션에 기록한 내용, 아이폰 홈 화면에서 볼 수는 없을까?
date: 2024-06-25 14:32:00 +0900
lastmod: 2024-06-25 14:32:00 +0900
last_modified_at: 2024-06-25 14:32:00 +0900
categories: project
tags: 아이폰 홈화면 노션 일정 보기 iPhone home screen Notion schedule scriptable notionapi api
classes: 
toc: true
toc_label: 
toc_sticky: true
header: 
  image: 
  teaser: 
  overlay_image: /assets/images/banners/banner.png
  # overlay_color: '#333'
  video:
    id: 
    provider: 
sitemap : 
  changefreq : daily
  priority : 1.0
author: 
---
<!--postNo: 20240625_001-->

## 프로젝트를 시작하게 된 이유. 

현재 나는 모든 일정을 노션을 이용해 관리중이다. 이전에는 구글 캘린더로 일정 관리를 했으나, 캘린더는 시간 순서로 볼 수 있다는 장점이 있지만, To Do List 처럼 일정의 완료 여부를 표시하거나, 일정에 대한 컨텐츠를 기록하기 힘들다는 단점이 있었다. 그렇다고 여러 앱을 사용하자니 번거롭기도 하고, 서로간 연동에 아쉬움이 있다. 그래서 노션에 정착을 했다.  

![](/assets/images/20240625_001_001.png)  
<center>노션 일정관리 포맷 이미지</center>  

이 결정에 대해서 대체적으로 만족하지만, 아쉬운 점이 있다. 구글 캘리더는 앱에 들어가지 않더라도, 위젯을 통해 아이폰 홈 화면에서 일정을 확인할 수 있었지만, 노션은 그러한 위젯 기능을 제공하지 않는다는 점이다.  

![](/assets/images/20240625_001_002.png)  
<center>Google Calendar 위젯 이미지</center>  

![](/assets/images/20240625_001_003.png)  
<center>Notion 위젯 선택 화면 이미지</center>  

그래서 일정을 확인하려면 노션 앱을 실행해야 하는 번거로움이 있고, 또한 노션 앱을해실행하지 않으면 일정을 잘 체크하지 않게 된다는 아쉬움도 있었다.  



## 그래서

그래서 이번 소규모 프로젝트를 기획하게 되었다. 만들려고 하는 것은 간단하고 명확하다. 아이폰 홈 화면에서 노션 일정관리에 기록한 "오늘"의 일정들을 바로 볼 수 있게 만들려고 한다. 앞으로 6~7개의 포스트를 통해 진행 사항을 기록하겠다.  

개발 완료 코드는 아래 깃허브에서 확인할 수 있다.  

[https://github.com/whdrns2013/small_projects/tree/2199b7c22d06ee2d90ecef3f8c6aa41d63b50440/scriptable/notion_daily_dashboard](https://github.com/whdrns2013/small_projects/tree/2199b7c22d06ee2d90ecef3f8c6aa41d63b50440/scriptable/notion_daily_dashboard)
