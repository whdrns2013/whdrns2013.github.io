---
title: "Docs"
excerpt: "Docs"
last_modified_at: 2026-01-10 22:38:00 +0900
permalink: /docs/intro/
toc: false
toc_sticky: true
toc_icon: "columns"
layout: single
classes: wide
sidebar:
  nav: "docs"
---

<span class="ttag">#지식체계화</span>

Docs 게시판은 포스팅들을 엮어 지식을 체계화하는 공간입니다.  

<div class="series-grid">
  {% for doc in site.data.docs.meta %}
    {% assign doc_id = doc[0] %}
    {% assign info = doc[1] %}
    
    {% comment %} 
      해당 문서 그룹의 첫 번째 실제 포스트 링크를 찾습니다. 
      "<-Doc으로 돌아가기" 링크는 제외합니다.
    {% endcomment %}
    {% assign target_url = "#" %}
    {% for item in site.data.docs[doc_id] %}
      {% if item.url != nil and item.url != "" and item.url != "/docs/intro" and item.url != "/docs/intro/" %}
        {% assign target_url = item.url %}
        {% break %}
      {% elsif item.children %}
        {% for child in item.children %}
          {% if child.url != nil and child.url != "" %}
            {% assign target_url = child.url %}
            {% break %}
          {% endif %}
        {% endfor %}
        {% if target_url != "#" %}{% break %}{% endif %}
      {% endif %}
    {% endfor %}

    <a href="{{ target_url | relative_url }}" class="series-card">
      <div class="series-card__image-wrapper">
        {% if info.cover %}
          <img src="{{ info.cover | relative_url }}" alt="{{ info.title }}">
        {% else %}
          <div class="no-image">
            <i class="fas fa-book"></i>
          </div>
        {% endif %}
      </div>
      <div class="series-card__content">
        <h4 class="series-card__title">{{ info.title }}</h4>
        {% if info.description %}
          <p class="series-card__description">{{ info.description }}</p>
        {% endif %}
        <div class="series-card__footer">
          <span class="post-count">지식 체계 바로가기 <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </a>
  {% endfor %}
</div>
