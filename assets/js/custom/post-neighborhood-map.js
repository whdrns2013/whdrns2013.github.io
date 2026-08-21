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
    if (parsed.type === 'prev') return '이전';
    if (parsed.type === 'next') return '다음';
    return parsed.value || reason;
  }

  function orbitFor(post) {
    if (post.reasons.some(function (reason) {
      var type = parseReason(reason).type;
      return type === 'prev' || type === 'next';
    })) return 'sequence';
    if (post.reasons.some(function (reason) { return parseReason(reason).type === 'series'; })) return 'series';
    if (post.reasons.some(function (reason) { return parseReason(reason).type === 'category'; })) return 'category';
    return 'tag';
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
    return posts.map(function (post) {
      post.categories = normalizeList(post.categories);
      post.tags = normalizeList(post.tags);
      post.reasons = [];
      post.score = 0;

      if (post.id === current.id) return null;

      if (current.series && post.series === current.series) {
        post.score += 10;
        post.reasons.push('series:' + (current.series_title || current.series));
      }

      if (current.previous_id && post.id === current.previous_id) {
        post.score += 7;
        post.reasons.push('prev:이전 글');
      }

      if (current.next_id && post.id === current.next_id) {
        post.score += 9;
        post.reasons.push('next:다음 글');
      }

      current.categories.forEach(function (category) {
        if (post.categories.indexOf(category) !== -1) {
          post.score += 4;
          post.reasons.push('category:' + category);
        }
      });

      var sharedTags = 0;
      current.tags.forEach(function (tag) {
        if (post.tags.indexOf(tag) !== -1) {
          sharedTags += 1;
          post.score += 1;
          if (sharedTags <= 4) post.reasons.push('tag:' + tag);
        }
      });

      if (post.score <= 0) return null;
      post.orbit = orbitFor(post);
      return post;
    }).filter(Boolean).sort(function (a, b) {
      var rank = { sequence: 0, series: 1, category: 2, tag: 3 };
      if (rank[a.orbit] !== rank[b.orbit]) return rank[a.orbit] - rank[b.orbit];
      if (b.score !== a.score) return b.score - a.score;
      return b.date.localeCompare(a.date);
    }).slice(0, 20);
  }

  function renderList(root, list, candidates) {
    if (!candidates.length) {
      list.innerHTML = '<li class="post-neighborhood__empty">아직 연결 후보가 충분하지 않습니다.</li>';
      return;
    }

    list.innerHTML = candidates.slice(0, 10).map(function (post, index) {
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
        '<span class="post-neighborhood__orbit post-neighborhood__orbit--' + escapeHtml(post.orbit) + '">' + escapeHtml(post.orbit) + '</span>',
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
      var orbitMap = {
        sequence: maxRadius * 0.34,
        series: maxRadius * 0.54,
        category: maxRadius * 0.74,
        tag: maxRadius * 0.94
      };

      layoutNodes(nodes, center, orbitMap, phase);

      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx, center, orbitMap);
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

    data.candidates.slice(0, 16).forEach(function (post, index) {
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

  function layoutNodes(nodes, center, orbitMap, phase) {
    var grouped = { sequence: [], series: [], category: [], tag: [] };
    nodes.forEach(function (node) {
      if (node.type === 'current') {
        node.x = center.x;
        node.y = center.y;
        return;
      }
      grouped[node.orbit].push(node);
    });

    Object.keys(grouped).forEach(function (orbitName) {
      var ringNodes = grouped[orbitName];
      var radius = orbitMap[orbitName];
      var speed = orbitName === 'sequence' ? 0.7 : orbitName === 'series' ? 0.45 : orbitName === 'category' ? 0.28 : 0.18;
      ringNodes.forEach(function (node, index) {
        var spread = (Math.PI * 2 * index) / Math.max(ringNodes.length, 1);
        var angle = -Math.PI / 2 + spread + phase * speed + (node.score % 5) * 0.08;
        node.x = center.x + Math.cos(angle) * radius;
        node.y = center.y + Math.sin(angle) * radius;
      });
    });
  }

  function drawBackground(ctx, center, orbitMap) {
    var labels = [
      ['sequence', orbitMap.sequence],
      ['series', orbitMap.series],
      ['category', orbitMap.category],
      ['tag', orbitMap.tag]
    ];

    labels.forEach(function (item) {
      ctx.beginPath();
      ctx.arc(center.x, center.y, item[1], 0, Math.PI * 2);
      ctx.strokeStyle = colorFor(item[0], 0.22);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '700 10px JetBrains Mono, monospace';
      ctx.fillStyle = colorFor(item[0], 0.86);
      ctx.fillText(item[0], center.x + item[1] + 8, center.y - 6);
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
      sequence: [126, 231, 135],
      series: [242, 204, 96],
      category: [121, 192, 255],
      tag: [210, 168, 255]
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
