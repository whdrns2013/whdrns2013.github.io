---
title: git 레퍼런스를 푸시하는데 실패했습니다. # 제목 (필수)
excerpt: src refspec main does not match any # 서브 타이틀이자 meta description (필수)
date: 2023-06-27 02:33:00 +0900      # 작성일 (필수)
lastmod: 2023-06-27 02:33:00 +0900   # 최종 수정일 (필수)
categories: TroubleShooting         # 다수 카테고리에 포함 가능 (필수)
tags: git 레퍼런스를 푸시하는데 실패했습니다 src refspec main does not match any                     # 태그 복수개 가능 (필수)
classes:         # wide : 넓은 레이아웃 / 빈칸 : 기본 //// wide 시에는 sticky toc 불가
toc: true        # 목차 표시 여부
toc_label:       # toc 제목
toc_sticky: true # 이동하는 목차 표시 여부 (toc:true 필요) // wide 시에는 sticky toc 불가
header: 
  image:         # 헤더 이미지 (asset내 혹은 url)
  teaser:        # 티저 이미지??
  overlay_image:             # 헤더 이미지 (제목과 겹치게)
  overlay_color: '#333'            # 헤더 배경색 (제목과 겹치게) #333 : 짙은 회색 (필수)
  video:
    id:                      # 영상 ID (URL 뒷부분)
    provider:                # youtube, vimeo 등
sitemap :                    # 구글 크롤링
  changefreq : daily         # 구글 크롤링
  priority : 1.0             # 구글 크롤링
author: # 주인 외 작성자 표기 필요시
---
<!--postNo: 20230627_001-->


# 에러메세지  

```terminal
error: src refspec main does not match any
error: 레퍼런스를 'https://192.168.0.77:9000/example'에 푸시하는데 실패했습니다
```

# 원인  

Git remote 설정했던 repository의 URL의 IP 주소가 변경이 되었다.  
그래서 원래의 IP에 접근할 수 없는 것. (해당 주소가 없음)  

# 해결  

(1) remote 연결정보(URL)를 변경해준다.  
혹은  
(2) remote 연결정보를 삭제 후 재연결한다.  

```terminal
(1) remote 연결정보(URL)를 변경해준다.

git remote set-url [alias] [새로운URL]
```

```terminal
(2) remote 연결정보를 삭제 후 재연결한다.

git remote remove [alias]
git remote add [alias] [새로운URL]
```

**alias**  
remote repository를 지칭하는 별칭