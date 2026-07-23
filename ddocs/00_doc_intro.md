---
title: "Docs"
excerpt: "Docs"
last_modified_at: 2026-01-10 22:38:00 +0900
permalink: /docs/intro/
toc: false
layout: single
author_profile: true
---

주제별로 묶어 정리한 지식베이스입니다. 항목을 눌러 관련 포스트를 확인하세요.

<div class="docs-accordion">
  {% for doc in site.data.docs.meta %}
    {% assign doc_id = doc[0] %}
    {% assign info = doc[1] %}
    {% assign group_title = info.group %}
    {% for group in site.data.category_hierarchy %}
      {% if group.key == info.group %}{% assign group_title = group.main_title %}{% endif %}
    {% endfor %}
    {% assign doc_sections = site.data.docs[doc_id] %}

    <details class="docs-accordion__item" id="doc-{{ doc_id }}">
      <summary class="docs-accordion__header">
        <span class="docs-accordion__chip" data-group="{{ info.group }}">{{ group_title }}</span>
        <span class="docs-accordion__name">{{ info.title }}</span>
        <i class="fas fa-chevron-right docs-accordion__arrow" aria-hidden="true"></i>
      </summary>
      <div class="docs-accordion__body">
        {% if info.description %}<p class="docs-accordion__desc">{{ info.description }}</p>{% endif %}
        {% if doc_sections.size > 0 %}
          <div class="docs-accordion__tree">
            {% for section in doc_sections %}
              {% unless section.title contains "Doc으로 돌아가기" %}
                <div class="docs-accordion__section">
                  <div class="docs-accordion__section-title">{{ section.title }}</div>
                  {% if section.children.size > 0 %}
                    <ul class="docs-accordion__section-children">
                      {% for child in section.children %}
                        <li>
                          {% if child.url %}
                            <a href="{{ child.url | relative_url }}">{{ child.title }}</a>
                          {% else %}
                            <span class="docs-accordion__section-child--empty">{{ child.title }}</span>
                          {% endif %}
                        </li>
                      {% endfor %}
                    </ul>
                  {% endif %}
                </div>
              {% endunless %}
            {% endfor %}
          </div>
        {% endif %}
      </div>
    </details>
  {% endfor %}
</div>
