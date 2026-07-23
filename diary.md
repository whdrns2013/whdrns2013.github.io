---
layout: archive
title: "Diary"
permalink: /diary/
author_profile: true
---

기술 이야기를 벗어난 짧은 일상 기록입니다.

<div class="diary-timeline">
  {% for post in site.categories.diary reversed %}
    {% assign stripped_excerpt = post.excerpt | newline_to_br | replace: "<br />", " " | replace: "</p>", " " | strip_html | strip_newlines | strip %}
    {% if stripped_excerpt != empty %}
      {% assign entry_text = stripped_excerpt | truncate: 200 %}
    {% else %}
      {% comment %} diary posts open with "## {{ title }}" — drop that leading heading so it isn't repeated right below the bold title above. {% endcomment %}
      {% assign content_after_heading = post.content | split: "</h2>" %}
      {% if content_after_heading.size > 1 %}
        {% assign body_source = content_after_heading[1] %}
      {% else %}
        {% assign body_source = post.content %}
      {% endif %}
      {% assign entry_text = body_source | newline_to_br | replace: "<br />", " " | replace: "</p>", " " | replace: "</h1>", " " | replace: "</h3>", " " | strip_html | strip_newlines | strip | truncate: 200 %}
    {% endif %}
    <a class="diary-entry" href="{{ post.url | relative_url }}">
      <span class="diary-entry__dot" aria-hidden="true"></span>
      <span class="diary-entry__date">{{ post.date | date: "%Y-%m-%d" }}</span>
      <span class="diary-entry__body">
        <span class="diary-entry__title">{{ post.title }}</span>
        <span class="diary-entry__text">{{ entry_text }}</span>
      </span>
    </a>
  {% endfor %}
</div>
