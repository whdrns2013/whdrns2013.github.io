---
layout: single
title: "Diary"
permalink: /diary/
---

{% for post in site.categories.diary %}
  <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
  <p>{{ post.date | date: "%Y-%m-%d" }}</p>
{% endfor %}
