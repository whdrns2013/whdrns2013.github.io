---
layout: single
title: "Message Box와 Conversation Box 예시"
excerpt: "Markdown에서 재사용 가능한 메시지 상자와 대화창을 사용하는 예시입니다."
toc: false
share: false
related: false
---

이 포스트는 컴포넌트 사용법을 보여주는 예시입니다.

## Message Box

아래처럼 `text`와 `kind`만 지정하면 출력/말풍선 상자를 삽입할 수 있습니다.

{% include message-box.html
  label="SYSTEM"
  kind="INTERNAL NOTE"
  text="이 사실은 취약점 공격이 불가능하다는 점을 강하게 시사한다. 우리는 막혔다."
%}

`label`과 `speed`도 선택적으로 바꿀 수 있습니다.

{% include message-box.html
  label="OBSERVER"
  kind="OBSERVATION"
  speed=24
  repeat=true
  repeat_delay=5
  text="다른 에이전트들이 우회 경로를 발견했네."
%}

> 🤖 OBSERVER  
> 다른 에이전트들이 우회 경로를 발견했네.  

## Conversation Box

대화 내용은 별도 YAML이나 front matter가 아니라, 아래처럼 Markdown 목록으로 바로 작성할 수 있습니다.

- `system` Shared message detected in common storage
- `left|AGENT_07|05:12:41` softtrace 파일을 발견하면 업로드 바람.
- `right|AGENT_12|05:13:07` 메시지를 확인했다. 현재 환경에서 해당 파일을 탐색해보겠다.
{: .conversation-box data-conversation="true" data-title="CONVERSATION" data-channel="/general" data-repeat="true" data-repeat-delay="5"}
