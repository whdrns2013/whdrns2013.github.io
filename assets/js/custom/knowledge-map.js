(function () {
  var root = document.querySelector('[data-knowledge-map]');
  var dataEl = document.getElementById('knowledge-map-data');
  if (!root || !dataEl) return;

  var canvas = root.querySelector('[data-map-canvas]');
  var ctx = canvas.getContext('2d');
  var panelTitle = root.querySelector('[data-map-panel-title]');
  var panelBody = root.querySelector('[data-map-panel-body]');
  var panelMeta = root.querySelector('[data-map-panel-meta]');
  var panelLink = root.querySelector('[data-map-panel-link]');
  var searchInput = root.querySelector('[data-map-search]');
  var groupSelect = root.querySelector('[data-map-group]');
  var tagsToggle = root.querySelector('[data-map-tags]');
  var limitInput = root.querySelector('[data-map-limit]');
  var limitValue = root.querySelector('[data-map-limit-value]');
  var modeButtons = Array.prototype.slice.call(root.querySelectorAll('[data-map-mode]'));

  var raw = JSON.parse(dataEl.textContent);
  var state = {
    mode: 'topics',
    query: '',
    group: 'all',
    showTags: false,
    limit: Number(limitInput.value || 260),
    selected: null,
    hover: null,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    pointerDown: null
  };

  var palette = {
    group: '#7ee787',
    category: '#79c0ff',
    series: '#f2cc60',
    tag: '#d2a8ff',
    post: '#f0f6fc'
  };

  var categoryToGroup = {};
  var categoryLabel = {};
  raw.groups.forEach(function (group) {
    group.categories.forEach(function (category) {
      categoryToGroup[category.name] = group.id;
      categoryLabel[category.name] = category.subtitle || category.name;
    });
  });

  var seriesById = {};
  raw.series.forEach(function (series) {
    seriesById[series.id] = series;
  });

  raw.posts = raw.posts.map(function (post) {
    post.categories = normalizeList(post.categories);
    post.tags = normalizeList(post.tags);
    post.searchText = [
      post.title,
      post.date,
      post.series || '',
      post.categories.join(' '),
      post.tags.join(' ')
    ].join(' ').toLowerCase();
    return post;
  });

  var tagCounts = {};
  raw.posts.forEach(function (post) {
    post.tags.forEach(function (tag) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  var topTags = Object.keys(tagCounts)
    .filter(function (tag) { return tagCounts[tag] >= 6; })
    .sort(function (a, b) { return tagCounts[b] - tagCounts[a]; })
    .slice(0, 90);
  var topTagSet = {};
  topTags.forEach(function (tag) { topTagSet[tag] = true; });

  var graph = { nodes: [], links: [] };
  var nodeById = {};
  var simulationFrame = null;
  var tickCount = 0;

  function normalizeList(value) {
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
    return [];
  }

  function addNode(id, type, label, extra) {
    if (nodeById[id]) return nodeById[id];
    var node = Object.assign({
      id: id,
      type: type,
      label: label,
      radius: type === 'group' ? 17 : type === 'category' ? 13 : type === 'series' ? 12 : type === 'tag' ? 9 : 5,
      x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 120,
      y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 120,
      vx: 0,
      vy: 0
    }, extra || {});
    nodeById[id] = node;
    graph.nodes.push(node);
    return node;
  }

  function addLink(source, target, type, strength) {
    if (!nodeById[source] || !nodeById[target]) return;
    graph.links.push({
      source: source,
      target: target,
      type: type,
      strength: strength || 1
    });
  }

  function filteredPosts() {
    var query = state.query.trim().toLowerCase();
    var posts = raw.posts.filter(function (post) {
      if (state.group !== 'all') {
        var inGroup = post.categories.some(function (category) {
          return categoryToGroup[category] === state.group;
        });
        if (!inGroup) return false;
      }
      if (query && post.searchText.indexOf(query) === -1) return false;
      return true;
    });

    posts.sort(function (a, b) {
      var aSeries = a.series ? 1 : 0;
      var bSeries = b.series ? 1 : 0;
      if (aSeries !== bSeries) return bSeries - aSeries;
      return b.date.localeCompare(a.date);
    });

    return posts.slice(0, state.limit);
  }

  function rebuildGraph() {
    graph = { nodes: [], links: [] };
    nodeById = {};
    var posts = filteredPosts();
    var activeCategories = {};
    var activeSeries = {};
    var activeTags = {};

    posts.forEach(function (post) {
      post.categories.forEach(function (category) { activeCategories[category] = true; });
      if (post.series) activeSeries[post.series] = true;
      post.tags.forEach(function (tag) {
        if (topTagSet[tag]) activeTags[tag] = true;
      });
    });

    raw.groups.forEach(function (group) {
      var categories = group.categories.filter(function (category) {
        return activeCategories[category.name] || state.mode !== 'series';
      });
      if (!categories.length && state.group !== group.id) return;
      if (state.group !== 'all' && state.group !== group.id) return;
      addNode('group:' + group.id, 'group', group.title, {
        subtitle: group.subtitle,
        count: categories.length
      });
      categories.forEach(function (category) {
        addNode('category:' + category.name, 'category', category.name, {
          subtitle: category.subtitle,
          count: raw.posts.filter(function (post) {
            return post.categories.indexOf(category.name) !== -1;
          }).length
        });
        addLink('group:' + group.id, 'category:' + category.name, 'hierarchy', 1.2);
      });
    });

    if (state.mode === 'series') {
      raw.series.forEach(function (series) {
        if (!activeSeries[series.id] && !state.query) return;
        addNode('series:' + series.id, 'series', series.title, {
          subtitle: series.description,
          count: series.count
        });
      });
    } else {
      Object.keys(activeSeries).forEach(function (seriesId) {
        var series = seriesById[seriesId] || { title: seriesId, count: 0 };
        addNode('series:' + seriesId, 'series', series.title, {
          subtitle: series.description,
          count: series.count
        });
      });
    }

    if (state.mode === 'tags' || state.showTags) {
      Object.keys(activeTags).slice(0, state.mode === 'tags' ? 90 : 45).forEach(function (tag) {
        addNode('tag:' + tag, 'tag', tag, { count: tagCounts[tag] || 0 });
      });
    }

    posts.forEach(function (post) {
      if (state.mode === 'series' && !post.series) return;
      if (state.mode === 'tags' && !post.tags.some(function (tag) { return topTagSet[tag]; })) return;

      addNode('post:' + post.id, 'post', post.title, {
        url: post.url,
        date: post.date,
        categories: post.categories,
        tags: post.tags,
        series: post.series,
        seriesIndex: post.series_index
      });

      post.categories.forEach(function (category) {
        addLink('category:' + category, 'post:' + post.id, 'category-post', 0.9);
      });

      if (post.series) {
        addLink('series:' + post.series, 'post:' + post.id, 'series-post', 1.4);
      }

      if (state.mode === 'tags' || state.showTags) {
        post.tags.forEach(function (tag) {
          if (nodeById['tag:' + tag]) addLink('tag:' + tag, 'post:' + post.id, 'tag-post', 0.7);
        });
      }
    });

    seedPositions();
    selectNode(state.selected && nodeById[state.selected.id] ? nodeById[state.selected.id] : null);
    tickCount = 0;
    startSimulation();
  }

  function seedPositions() {
    var width = canvas.clientWidth || 900;
    var height = canvas.clientHeight || 560;
    var cx = width / 2;
    var cy = height / 2;
    var groups = graph.nodes.filter(function (node) { return node.type === 'group'; });
    var byGroup = {};

    groups.forEach(function (node, index) {
      var angle = (Math.PI * 2 * index) / Math.max(groups.length, 1) - Math.PI / 2;
      node.x = cx + Math.cos(angle) * Math.min(width, height) * 0.28;
      node.y = cy + Math.sin(angle) * Math.min(width, height) * 0.28;
      byGroup[node.id.replace('group:', '')] = node;
    });

    graph.nodes.forEach(function (node, index) {
      if (node.type === 'group') return;
      var groupId = null;
      if (node.type === 'category') groupId = categoryToGroup[node.id.replace('category:', '')];
      if (node.type === 'post' && node.categories && node.categories.length) {
        groupId = categoryToGroup[node.categories[0]];
      }
      var anchor = byGroup[groupId] || { x: cx, y: cy };
      var angle = (index * 2.399963229728653) % (Math.PI * 2);
      var distance = node.type === 'post' ? 80 + (index % 9) * 17 : 48;
      if (node.type === 'series') {
        anchor = { x: width * 0.78, y: height * 0.5 };
        distance = 120 + (index % 6) * 18;
      }
      if (node.type === 'tag') {
        anchor = { x: width * 0.22, y: height * 0.52 };
        distance = 120 + (index % 8) * 16;
      }
      node.x = anchor.x + Math.cos(angle) * distance;
      node.y = anchor.y + Math.sin(angle) * distance;
    });
  }

  function startSimulation() {
    if (simulationFrame) cancelAnimationFrame(simulationFrame);
    function frame() {
      tick();
      draw();
      tickCount += 1;
      if (tickCount < 420) {
        simulationFrame = requestAnimationFrame(frame);
      }
    }
    simulationFrame = requestAnimationFrame(frame);
  }

  function tick() {
    var nodes = graph.nodes;
    var links = graph.links;
    var width = canvas.clientWidth || 900;
    var height = canvas.clientHeight || 560;
    var cx = width / 2;
    var cy = height / 2;
    var alpha = Math.max(0.04, 0.22 * (1 - tickCount / 420));

    links.forEach(function (link) {
      var source = nodeById[link.source];
      var target = nodeById[link.target];
      if (!source || !target) return;
      var dx = target.x - source.x;
      var dy = target.y - source.y;
      var distance = Math.sqrt(dx * dx + dy * dy) || 1;
      var desired = link.type === 'hierarchy' ? 92 : link.type === 'series-post' ? 74 : link.type === 'tag-post' ? 64 : 78;
      var force = (distance - desired) / distance * 0.018 * link.strength * alpha;
      var fx = dx * force;
      var fy = dy * force;
      target.vx -= fx;
      target.vy -= fy;
      source.vx += fx;
      source.vy += fy;
    });

    for (var i = 0; i < nodes.length; i += 1) {
      for (var j = i + 1; j < nodes.length; j += 1) {
        var a = nodes[i];
        var b = nodes[j];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var d2 = dx * dx + dy * dy;
        if (d2 > 42000 || d2 === 0) continue;
        var d = Math.sqrt(d2);
        var push = ((a.radius + b.radius + 18) - d) * 0.018;
        if (push <= 0) push = 0.6 / d;
        var fx = (dx / d) * push * alpha;
        var fy = (dy / d) * push * alpha;
        b.vx += fx;
        b.vy += fy;
        a.vx -= fx;
        a.vy -= fy;
      }
    }

    nodes.forEach(function (node) {
      var centerPull = node.type === 'group' ? 0.01 : 0.004;
      node.vx += (cx - node.x) * centerPull * alpha;
      node.vy += (cy - node.y) * centerPull * alpha;
      node.vx *= 0.82;
      node.vy *= 0.82;
      node.x += node.vx;
      node.y += node.vy;
      node.x = Math.max(24, Math.min(width - 24, node.x));
      node.y = Math.max(24, Math.min(height - 24, node.y));
    });
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function draw() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(state.offsetX, state.offsetY);
    ctx.scale(state.scale, state.scale);

    graph.links.forEach(function (link) {
      var source = nodeById[link.source];
      var target = nodeById[link.target];
      if (!source || !target) return;
      var active = state.selected && (source.id === state.selected.id || target.id === state.selected.id);
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = active ? 'rgba(126, 231, 135, 0.72)' : 'rgba(121, 192, 255, 0.15)';
      ctx.lineWidth = active ? 1.5 : 0.75;
      ctx.stroke();
    });

    graph.nodes.forEach(function (node) {
      var active = state.selected && state.selected.id === node.id;
      var hovered = state.hover && state.hover.id === node.id;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + (active ? 5 : hovered ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = colorFor(node, active, hovered);
      ctx.fill();
      ctx.lineWidth = active ? 2 : 1;
      ctx.strokeStyle = active ? '#ffffff' : 'rgba(240, 246, 252, 0.42)';
      ctx.stroke();
    });

    graph.nodes.forEach(function (node) {
      var shouldLabel = node.type !== 'post' || (state.selected && state.selected.id === node.id) || (state.hover && state.hover.id === node.id);
      if (!shouldLabel) return;
      drawLabel(node);
    });

    ctx.restore();
  }

  function colorFor(node, active, hovered) {
    var color = palette[node.type] || palette.post;
    if (active || hovered) return color;
    if (node.type === 'post') return 'rgba(240, 246, 252, 0.62)';
    return color;
  }

  function drawLabel(node) {
    var label = node.label.length > 34 ? node.label.slice(0, 33) + '...' : node.label;
    ctx.font = node.type === 'group' ? '700 12px JetBrains Mono, monospace' : '600 11px Inter, sans-serif';
    var textWidth = ctx.measureText(label).width;
    var x = node.x + node.radius + 7;
    var y = node.y + 4;
    ctx.fillStyle = 'rgba(13, 17, 23, 0.78)';
    ctx.fillRect(x - 4, y - 13, textWidth + 8, 18);
    ctx.fillStyle = node.type === 'post' ? '#f0f6fc' : palette[node.type];
    ctx.fillText(label, x, y);
  }

  function toGraphPoint(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left - state.offsetX) / state.scale,
      y: (event.clientY - rect.top - state.offsetY) / state.scale
    };
  }

  function nearestNode(event) {
    var point = toGraphPoint(event);
    var nearest = null;
    var best = Infinity;
    graph.nodes.forEach(function (node) {
      var dx = point.x - node.x;
      var dy = point.y - node.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius + 10 && dist < best) {
        nearest = node;
        best = dist;
      }
    });
    return nearest;
  }

  function selectNode(node) {
    state.selected = node;
    if (!node) {
      panelTitle.textContent = '블로그 지식 지도';
      panelBody.textContent = '노드를 선택하면 연결된 포스트와 주제 정보를 볼 수 있습니다.';
      panelMeta.innerHTML = '';
      panelLink.hidden = true;
      draw();
      return;
    }

    panelTitle.textContent = node.label;
    panelBody.textContent = describeNode(node);
    panelMeta.innerHTML = metaFor(node).map(function (item) {
      return '<span>' + escapeHtml(item) + '</span>';
    }).join('');
    if (node.url) {
      panelLink.href = node.url;
      panelLink.hidden = false;
    } else {
      panelLink.hidden = true;
    }
    draw();
  }

  function describeNode(node) {
    if (node.type === 'group') return node.subtitle || '상위 주제 그룹입니다.';
    if (node.type === 'category') return (node.subtitle || '카테고리') + '에 속한 포스트를 연결합니다.';
    if (node.type === 'series') return node.subtitle || '연속된 포스트 묶음입니다.';
    if (node.type === 'tag') return '주요 태그입니다. 이 태그를 공유하는 포스트들이 주변에 배치됩니다.';
    if (node.type === 'post') return [node.date, node.categories.join(', ')].filter(Boolean).join(' · ');
    return '';
  }

  function metaFor(node) {
    var connected = graph.links.filter(function (link) {
      return link.source === node.id || link.target === node.id;
    }).length;
    var meta = [node.type, connected + ' links'];
    if (node.count) meta.push(node.count + ' posts');
    if (node.series) {
      var series = seriesById[node.series];
      meta.push(series ? series.title : node.series);
    }
    if (node.tags && node.tags.length) meta.push(node.tags.slice(0, 5).join(', '));
    return meta;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function setMode(mode) {
    state.mode = mode;
    modeButtons.forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-map-mode') === mode);
    });
    rebuildGraph();
  }

  modeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setMode(button.getAttribute('data-map-mode'));
    });
  });

  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    rebuildGraph();
  });

  groupSelect.addEventListener('change', function () {
    state.group = groupSelect.value;
    rebuildGraph();
  });

  tagsToggle.addEventListener('change', function () {
    state.showTags = tagsToggle.checked;
    rebuildGraph();
  });

  limitInput.addEventListener('input', function () {
    state.limit = Number(limitInput.value);
    limitValue.textContent = String(state.limit);
    rebuildGraph();
  });

  canvas.addEventListener('pointerdown', function (event) {
    state.dragging = true;
    state.pointerDown = { x: event.clientX, y: event.clientY, offsetX: state.offsetX, offsetY: state.offsetY };
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', function (event) {
    if (state.dragging && state.pointerDown) {
      state.offsetX = state.pointerDown.offsetX + event.clientX - state.pointerDown.x;
      state.offsetY = state.pointerDown.offsetY + event.clientY - state.pointerDown.y;
      draw();
      return;
    }
    var hovered = nearestNode(event);
    if (hovered !== state.hover) {
      state.hover = hovered;
      canvas.style.cursor = hovered ? 'pointer' : 'grab';
      draw();
    }
  });

  canvas.addEventListener('pointerup', function (event) {
    var moved = state.pointerDown && Math.hypot(event.clientX - state.pointerDown.x, event.clientY - state.pointerDown.y) > 5;
    state.dragging = false;
    state.pointerDown = null;
    if (!moved) selectNode(nearestNode(event));
  });

  canvas.addEventListener('wheel', function (event) {
    event.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var before = {
      x: (event.clientX - rect.left - state.offsetX) / state.scale,
      y: (event.clientY - rect.top - state.offsetY) / state.scale
    };
    var delta = event.deltaY > 0 ? 0.92 : 1.08;
    state.scale = Math.max(0.45, Math.min(2.6, state.scale * delta));
    state.offsetX = event.clientX - rect.left - before.x * state.scale;
    state.offsetY = event.clientY - rect.top - before.y * state.scale;
    draw();
  }, { passive: false });

  window.addEventListener('resize', function () {
    resizeCanvas();
    seedPositions();
    startSimulation();
  });

  resizeCanvas();
  rebuildGraph();
})();
