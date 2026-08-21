---
title: "Knowledge Map"
layout: single
permalink: /knowledge-map/
classes: wide
author_profile: false
excerpt: "카테고리, 시리즈, 태그, 포스트가 어떻게 연결되는지 한 화면에서 탐색합니다."
---

<section class="knowledge-map" data-knowledge-map>
  <header class="knowledge-map__header">
    <p class="knowledge-map__eyebrow">// graph view</p>
    <h1 class="knowledge-map__title">Knowledge Map</h1>
    <p class="knowledge-map__desc">
      블로그의 큰 주제, 카테고리, 시리즈, 포스트, 주요 태그를 노드로 묶어 탐색합니다.
    </p>
  </header>

  <div class="knowledge-map__stats" aria-label="Knowledge map stats">
    <span><strong>{{ site.posts | size }}</strong> posts</span>
    <span><strong>{{ site.categories | size }}</strong> categories</span>
    <span><strong>{{ site.tags | size }}</strong> tags</span>
    <span><strong>{{ site.data.series | size }}</strong> series</span>
  </div>

  <div class="knowledge-map__toolbar" aria-label="Knowledge map controls">
    <div class="knowledge-map__mode" role="group" aria-label="Graph mode">
      <button type="button" class="is-active" data-map-mode="topics">Topics</button>
      <button type="button" data-map-mode="series">Series</button>
      <button type="button" data-map-mode="tags">Tags</button>
    </div>

    <label class="knowledge-map__field">
      <span>Filter</span>
      <input type="search" data-map-search placeholder="post, tag, category">
    </label>

    <label class="knowledge-map__field">
      <span>Group</span>
      <select data-map-group>
        <option value="all">All groups</option>
        {% for group in site.data.category_hierarchy %}
          <option value="{{ group.key }}">{{ group.main_title }}</option>
        {% endfor %}
      </select>
    </label>

    <label class="knowledge-map__toggle">
      <input type="checkbox" data-map-tags>
      <span>show tags</span>
    </label>

    <label class="knowledge-map__range">
      <span>Nodes</span>
      <input type="range" data-map-limit min="80" max="520" step="20" value="260">
      <output data-map-limit-value>260</output>
    </label>
  </div>

  <div class="knowledge-map__workspace">
    <div class="knowledge-map__canvas-wrap">
      <canvas class="knowledge-map__canvas" data-map-canvas aria-label="Knowledge graph canvas"></canvas>
      <div class="knowledge-map__hint" data-map-hint>drag to pan · wheel to zoom · click a node</div>
    </div>

    <aside class="knowledge-map__panel" data-map-panel>
      <p class="knowledge-map__panel-kicker">Selected</p>
      <h2 data-map-panel-title>블로그 지식 지도</h2>
      <p data-map-panel-body>
        노드를 선택하면 연결된 포스트와 주제 정보를 볼 수 있습니다.
      </p>
      <div class="knowledge-map__panel-meta" data-map-panel-meta></div>
      <a class="knowledge-map__panel-link" data-map-panel-link href="#" hidden>Open post</a>
    </aside>
  </div>

  <div class="knowledge-map__legend" aria-label="Node legend">
    <span><i class="knowledge-map__swatch knowledge-map__swatch--group"></i>topic group</span>
    <span><i class="knowledge-map__swatch knowledge-map__swatch--category"></i>category</span>
    <span><i class="knowledge-map__swatch knowledge-map__swatch--series"></i>series</span>
    <span><i class="knowledge-map__swatch knowledge-map__swatch--tag"></i>tag</span>
    <span><i class="knowledge-map__swatch knowledge-map__swatch--post"></i>post</span>
  </div>
</section>

<script id="knowledge-map-data" type="application/json">
{
  "groups": [
    {% for group in site.data.category_hierarchy %}
      {
        "id": {{ group.key | jsonify }},
        "title": {{ group.main_title | jsonify }},
        "subtitle": {{ group.sub_title | jsonify }},
        "categories": [
          {% for category in group.categories %}
            {
              "name": {{ category.name | jsonify }},
              "subtitle": {{ category.sub_title | jsonify }}
            }{% unless forloop.last %},{% endunless %}
          {% endfor %}
        ]
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ],
  "series": [
    {% for item in site.data.series %}
      {% assign series_id = item[0] %}
      {% assign series_info = item[1] %}
      {% assign series_posts = site.posts | where: "series", series_id %}
      {
        "id": {{ series_id | jsonify }},
        "title": {{ series_info.title | jsonify }},
        "description": {{ series_info.description | jsonify }},
        "count": {{ series_posts | size }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ],
  "posts": [
    {% for post in site.posts %}
      {
        "id": {{ post.id | jsonify }},
        "title": {{ post.title | strip_html | jsonify }},
        "url": {{ post.url | relative_url | jsonify }},
        "date": {{ post.date | date: "%Y-%m-%d" | jsonify }},
        "categories": {{ post.categories | jsonify }},
        "tags": {{ post.tags | jsonify }},
        "series": {% if post.series %}{{ post.series | jsonify }}{% else %}null{% endif %},
        "series_index": {% if post.series_index %}{{ post.series_index | jsonify }}{% else %}null{% endif %}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>
<script src="{{ '/assets/js/custom/knowledge-map.js' | relative_url }}" defer></script>
