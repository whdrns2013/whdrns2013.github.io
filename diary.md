---
layout: archive
title: "Diary"
permalink: /diary/
---

{% assign entries_layout = page.entries_layout | default: 'list' %}
<div class="entries-{{ entries_layout }}">
  {% for post in site.categories.diary reversed %}
    {% include archive-single.html type=entries_layout %}
  {% endfor %}
</div>
