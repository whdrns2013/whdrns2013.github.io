(function () {
  function normalizeList(value) {
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
    return [];
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function parseReason(reason) {
    var parts = String(reason).split(':');
    return {
      type: parts.shift(),
      value: parts.join(':')
    };
  }

  function friendlyReason(reason) {
    var parsed = parseReason(reason);
    if (parsed.type === 'series') return '시리즈';
    if (parsed.type === 'category') return parsed.value;
    if (parsed.type === 'tag') return '#' + parsed.value;
    if (parsed.type === 'recent') return '최신';
    return parsed.value || reason;
  }

  function orbitLabel(orbit) {
    if (orbit === 'tag') return 'tag-match';
    return orbit;
  }

  function setup(root) {
    var dataEl = root.querySelector('[data-post-neighborhood-data]');
    var canvas = root.querySelector('[data-post-neighborhood-canvas]');
    var list = root.querySelector('[data-post-neighborhood-list]');
    var countEl = root.querySelector('[data-post-neighborhood-count]');
    if (!dataEl || !canvas || !list) return;

    var data = JSON.parse(dataEl.textContent);
    var indexUrl = root.getAttribute('data-post-index-url');
    data.current.categories = normalizeList(data.current.categories);
    data.current.tags = normalizeList(data.current.tags);

    fetch(indexUrl, { credentials: 'same-origin' }).then(function (response) {
      return response.json();
    }).then(function (index) {
      data.candidates = scoreCandidates(data.current, index.posts || []);
      countEl.textContent = String(data.candidates.length);
      renderList(root, list, data.candidates);
      createCompass(root, canvas, data).start();
    }).catch(function () {
      list.innerHTML = '<li class="post-neighborhood__empty">관련 글 인덱스를 불러오지 못했습니다.</li>';
      countEl.textContent = '0';
    });
  }

  function scoreCandidates(current, posts) {
    var prepared = posts.map(function (post) {
      return Object.assign({}, post, {
        categories: normalizeList(post.categories),
        tags: normalizeList(post.tags)
      });
    }).filter(function (post) {
      return post.id !== current.id;
    });
    var recencyRank = {};
    prepared.slice().sort(function (a, b) {
      return b.date.localeCompare(a.date);
    }).forEach(function (post, index) {
      recencyRank[post.id] = index + 1;
    });

    function sharedCategories(post) {
      return current.categories.filter(function (category) {
        return post.categories.indexOf(category) !== -1;
      });
    }

    function sharedTags(post) {
      return current.tags.filter(function (tag) {
        return post.tags.indexOf(tag) !== -1;
      });
    }

    function recencyScore(post) {
      var rank = recencyRank[post.id] || 9999;
      if (rank <= 10) return 4;
      if (rank <= 30) return 2;
      if (rank <= 60) return 1;
      return 0;
    }

    return prepared.map(function (post) {
      var categoryMatches = sharedCategories(post);
      var tagMatches = sharedTags(post);
      var reasons = [];
      var score = 0;
      var orbit = 'recent';
      var recent = recencyScore(post);

      if (current.series && post.series === current.series) {
        score += 12;
        orbit = 'series';
        reasons.push('series:' + (current.series_title || current.series));
      }

      if (categoryMatches.length) {
        score += categoryMatches.length * 6;
        if (orbit === 'recent') orbit = 'category';
        categoryMatches.slice(0, 3).forEach(function (category) {
          reasons.push('category:' + category);
        });
      }

      if (tagMatches.length) {
        score += Math.min(tagMatches.length, 6) * 3;
        if (orbit === 'recent') orbit = 'tag';
        tagMatches.slice(0, 4).forEach(function (tag) {
          reasons.push('tag:' + tag);
        });
      }

      if (recent) {
        score += recent;
        reasons.push('recent:최신 ' + (recencyRank[post.id] || '') + '위');
      }

      if (score <= 0) return null;

      return Object.assign({}, post, {
        orbit: orbit,
        score: score,
        reasons: reasons,
        shared_tag_count: tagMatches.length,
        shared_category_count: categoryMatches.length,
        recency_rank: recencyRank[post.id] || null
      });
    }).filter(Boolean).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return b.date.localeCompare(a.date);
    }).slice(0, 24);
  }

  function renderList(root, list, candidates) {
    if (!candidates.length) {
      list.innerHTML = '<li class="post-neighborhood__empty">아직 연결 후보가 충분하지 않습니다.</li>';
      return;
    }

    list.innerHTML = candidates.map(function (post, index) {
      var reasons = post.reasons.slice(0, 4).map(function (reason) {
        return '<span>' + escapeHtml(friendlyReason(reason)) + '</span>';
      }).join('');
      return [
        '<li data-related-node="post:' + escapeHtml(post.id) + '">',
        '<div class="post-neighborhood__rank">' + String(index + 1).padStart(2, '0') + '</div>',
        '<div class="post-neighborhood__item-main">',
        '<a href="' + escapeHtml(post.url) + '">' + escapeHtml(post.title) + '</a>',
        '<div class="post-neighborhood__item-meta">',
        '<time datetime="' + escapeHtml(post.date) + '">' + escapeHtml(post.date) + '</time>',
        '<span class="post-neighborhood__orbit post-neighborhood__orbit--' + escapeHtml(post.orbit) + '">' + escapeHtml(orbitLabel(post.orbit)) + '</span>',
        '<span class="post-neighborhood__score">' + post.score + '</span>',
        '</div>',
        '<div class="post-neighborhood__reasons">' + reasons + '</div>',
        '</div>',
        '</li>'
      ].join('');
    }).join('');

    list.querySelectorAll('[data-related-node]').forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        root.dispatchEvent(new CustomEvent('post-neighborhood:hover', {
          detail: { id: item.getAttribute('data-related-node') }
        }));
      });
      item.addEventListener('mouseleave', function () {
        root.dispatchEvent(new CustomEvent('post-neighborhood:hover', {
          detail: { id: null }
        }));
      });
      item.addEventListener('focusin', function () {
        root.dispatchEvent(new CustomEvent('post-neighborhood:hover', {
          detail: { id: item.getAttribute('data-related-node') }
        }));
      });
    });
  }

  function createCompass(root, canvas, data) {
    var ctx = canvas.getContext('2d');
    var nodes = buildNodes(data);
    var hoverId = null;
    var pinnedId = null;
    var phase = 0;
    var lastTime = performance.now();
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function start() {
      resize();
      bind();
      requestAnimationFrame(frame);
    }

    function bind() {
      canvas.addEventListener('mousemove', function (event) {
        var node = nearestNode(event);
        setHover(node ? node.id : null);
        canvas.style.cursor = node && node.type === 'post' ? 'pointer' : 'default';
      });

      canvas.addEventListener('mouseleave', function () {
        setHover(null);
      });

      canvas.addEventListener('click', function (event) {
        var node = nearestNode(event);
        if (!node || node.type !== 'post') return;
        pinnedId = pinnedId === node.id ? null : node.id;
        highlightCard(pinnedId);
        if (pinnedId) {
          var card = findCard(root, pinnedId);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      root.addEventListener('post-neighborhood:hover', function (event) {
        setHover(event.detail.id);
      });

      window.addEventListener('resize', resize);
    }

    function frame(now) {
      var delta = Math.min(48, now - lastTime);
      lastTime = now;
      if (!reducedMotion && !hoverId && !pinnedId) phase += delta * 0.00012;
      draw();
      requestAnimationFrame(frame);
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function setHover(id) {
      if (hoverId === id) return;
      hoverId = id;
      if (!pinnedId) highlightCard(id);
    }

    function highlightCard(id) {
      root.querySelectorAll('[data-related-node]').forEach(function (item) {
        item.classList.toggle('is-active', item.getAttribute('data-related-node') === id);
      });
    }

    function nearestNode(event) {
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var best = null;
      var bestDistance = Infinity;
      nodes.forEach(function (node) {
        if (!node.x || !node.y) return;
        var dx = x - node.x;
        var dy = y - node.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < node.radius + 12 && distance < bestDistance) {
          best = node;
          bestDistance = distance;
        }
      });
      return best;
    }

    function draw() {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      var center = { x: width * 0.5, y: height * 0.5 };
      var maxRadius = Math.min(width, height) * 0.42;
      var maxScore = nodes.reduce(function (max, node) {
        return node.type === 'post' ? Math.max(max, node.score) : max;
      }, 1);
      var scoreSpace = {
        inner: maxRadius * 0.28,
        outer: maxRadius,
        maxScore: Math.max(maxScore, 28)
      };

      layoutNodes(nodes, center, scoreSpace, phase);

      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx, center, scoreSpace);
      drawLinks(ctx, nodes, center, activeId());
      drawNodes(ctx, nodes, activeId());
      drawLabels(ctx, nodes, activeId(), width);
    }

    function activeId() {
      return pinnedId || hoverId;
    }

    return { start: start };
  }

  function buildNodes(data) {
    var nodes = [{
      id: 'current',
      type: 'current',
      orbit: 'current',
      label: data.current.title,
      radius: 20,
      score: 0
    }];

    data.candidates.slice(0, 24).forEach(function (post, index) {
      nodes.push({
        id: 'post:' + post.id,
        type: 'post',
        orbit: post.orbit,
        label: post.title,
        url: post.url,
        score: post.score,
        reasons: post.reasons,
        radius: Math.max(7, Math.min(12, 6 + post.score / 4)),
        index: index
      });
    });

    return nodes;
  }

  function scoreToRadius(score, scoreSpace) {
    var normalized = Math.max(0, Math.min(1, score / Math.max(scoreSpace.maxScore, 1)));
    return scoreSpace.outer - normalized * (scoreSpace.outer - scoreSpace.inner);
  }

  function layoutNodes(nodes, center, scoreSpace, phase) {
    var posts = nodes.filter(function (node) {
      return node.type === 'post';
    }).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    });

    nodes.forEach(function (node) {
      if (node.type === 'current') {
        node.x = center.x;
        node.y = center.y;
      }
    });

    posts.forEach(function (node, index) {
      var normalized = Math.max(0, Math.min(1, node.score / Math.max(scoreSpace.maxScore, 1)));
      var radius = scoreToRadius(node.score, scoreSpace);
      var angle = -Math.PI / 2 + index * 2.399963229728653 + phase * (0.14 + (1 - normalized) * 0.28);
      node.x = center.x + Math.cos(angle) * radius;
      node.y = center.y + Math.sin(angle) * radius;
    });
  }

  function drawBackground(ctx, center, scoreSpace) {
    var thresholds = [24, 16, 8, 1].filter(function (score, index, list) {
      return score <= scoreSpace.maxScore && list.indexOf(score) === index;
    });
    if (thresholds.indexOf(1) === -1) thresholds.push(1);

    thresholds.forEach(function (score) {
      var radius = scoreToRadius(score, scoreSpace);
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(121, 192, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '700 10px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(240, 246, 252, 0.72)';
      ctx.fillText('score ' + score + '+', center.x + radius + 8, center.y - 6);
    });
  }

  function drawLinks(ctx, nodes, center, activeId) {
    nodes.forEach(function (node) {
      if (node.type !== 'post') return;
      var active = activeId === node.id;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(node.x, node.y);
      ctx.strokeStyle = active ? colorFor(node.orbit, 0.78) : colorFor(node.orbit, 0.22);
      ctx.lineWidth = active ? 1.8 : 0.9;
      ctx.stroke();
    });
  }

  function drawNodes(ctx, nodes, activeId) {
    nodes.forEach(function (node) {
      var active = activeId === node.id || node.type === 'current';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + (active && node.type !== 'current' ? 4 : 0), 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'current' ? '#7ee787' : colorFor(node.orbit, active ? 1 : 0.82);
      ctx.fill();
      ctx.lineWidth = active ? 2 : 1;
      ctx.strokeStyle = active ? '#ffffff' : 'rgba(240, 246, 252, 0.42)';
      ctx.stroke();
    });
  }

  function drawLabels(ctx, nodes, activeId, width) {
    nodes.forEach(function (node) {
      var active = activeId === node.id || node.type === 'current';
      if (!active && node.type === 'post') return;
      var label = node.label.length > 34 ? node.label.slice(0, 33) + '...' : node.label;
      ctx.font = node.type === 'current' ? '700 12px JetBrains Mono, monospace' : '700 11px Inter, sans-serif';
      var textWidth = ctx.measureText(label).width;
      var x = Math.min(width - textWidth - 10, node.x + node.radius + 8);
      var y = node.y + 4;
      ctx.fillStyle = 'rgba(13, 17, 23, 0.78)';
      ctx.fillRect(x - 4, y - 13, textWidth + 8, 18);
      ctx.fillStyle = node.type === 'current' ? '#7ee787' : '#f0f6fc';
      ctx.fillText(label, x, y);
    });
  }

  function colorFor(type, alpha) {
    var colors = {
      series: [242, 204, 96],
      category: [121, 192, 255],
      tag: [210, 168, 255],
      'tag-match': [210, 168, 255],
      recent: [126, 231, 135]
    };
    var color = colors[type] || [240, 246, 252];
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + alpha + ')';
  }

  function findCard(root, id) {
    var found = null;
    root.querySelectorAll('[data-related-node]').forEach(function (item) {
      if (item.getAttribute('data-related-node') === id) found = item;
    });
    return found;
  }

  document.querySelectorAll('[data-post-neighborhood]').forEach(setup);
})();
