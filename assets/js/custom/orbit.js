(function () {
  var root = document.querySelector('[data-knowledge-map]');
  var dataEl = document.getElementById('knowledge-map-data');
  if (!root || !dataEl) return;

  var canvas = root.querySelector('[data-map-canvas]');
  var ctx = canvas.getContext('2d');
  var panelKicker = root.querySelector('.knowledge-map__panel-kicker');
  var panelTitle = root.querySelector('[data-map-panel-title]');
  var panelBody = root.querySelector('[data-map-panel-body]');
  var panelMeta = root.querySelector('[data-map-panel-meta]');
  var panelLink = root.querySelector('[data-map-panel-link]');
  var searchInput = root.querySelector('[data-map-search]');
  var centerSelect = root.querySelector('[data-map-center]');
  var resetButton = root.querySelector('[data-map-reset]');
  var typeButtons = Array.prototype.slice.call(root.querySelectorAll('[data-center-type]'));

  var raw = JSON.parse(dataEl.textContent);
  var DPR = window.devicePixelRatio || 1;
  var TAU = Math.PI * 2;
  var MAX_ORBIT_NODES = 46;

  var palette = {
    current: '#7ee787',
    category: '#79c0ff',
    series: '#f2cc60',
    tag: '#d2a8ff',
    post: '#f0f6fc'
  };

  var state = {
    centerType: 'category',
    centerId: '',
    query: '',
    hoverId: null,
    activeId: null,
    phase: 0,
    nodes: [],
    links: [],
    center: null
  };

  var indexes = createIndexes(raw);
  state.centerId = pickDefaultCategory();

  function normalizeList(value) {
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === 'string') return value.split(/\s+/).filter(Boolean);
    return [];
  }

  function createIndexes(data) {
    var posts = data.posts.map(function (post, index) {
      post.categories = normalizeList(post.categories);
      post.tags = normalizeList(post.tags);
      post.series = post.series || null;
      post.recencyRank = index + 1;
      post.searchText = [
        post.title,
        post.date,
        post.series || '',
        post.categories.join(' '),
        post.tags.join(' ')
      ].join(' ').toLowerCase();
      return post;
    });

    var categoryToGroup = {};
    var categorySubtitles = {};
    var categoryCounts = {};
    var tagCounts = {};
    var seriesById = {};
    var postsById = {};
    var seriesPosts = {};

    data.groups.forEach(function (group) {
      group.categories.forEach(function (category) {
        categoryToGroup[category.name] = group.id;
        categorySubtitles[category.name] = category.subtitle || '';
      });
    });

    data.series.forEach(function (series) {
      seriesById[series.id] = series;
      seriesPosts[series.id] = [];
    });

    posts.forEach(function (post) {
      postsById[post.id] = post;
      post.categories.forEach(function (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      post.tags.forEach(function (tag) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      if (post.series) {
        if (!seriesPosts[post.series]) seriesPosts[post.series] = [];
        seriesPosts[post.series].push(post);
      }
    });

    var categoryOptions = Object.keys(categoryCounts).sort(function (a, b) {
      return categoryCounts[b] - categoryCounts[a] || a.localeCompare(b);
    }).map(function (category) {
      return {
        id: category,
        type: 'category',
        label: category,
        subtitle: categorySubtitles[category],
        count: categoryCounts[category] || 0,
        searchText: [category, categorySubtitles[category] || ''].join(' ').toLowerCase()
      };
    });

    var seriesOptions = data.series.filter(function (series) {
      return (series.count || 0) > 0;
    }).sort(function (a, b) {
      return (b.count || 0) - (a.count || 0) || String(a.title).localeCompare(String(b.title));
    }).map(function (series) {
      return {
        id: series.id,
        type: 'series',
        label: series.title || series.id,
        subtitle: series.description || '',
        count: series.count || 0,
        searchText: [series.id, series.title || '', series.description || ''].join(' ').toLowerCase()
      };
    });

    var tagOptions = Object.keys(tagCounts).filter(function (tag) {
      return tagCounts[tag] >= 2;
    }).sort(function (a, b) {
      return tagCounts[b] - tagCounts[a] || a.localeCompare(b);
    }).map(function (tag) {
      return {
        id: tag,
        type: 'tag',
        label: tag,
        count: tagCounts[tag] || 0,
        searchText: tag.toLowerCase()
      };
    });

    var postOptions = posts.map(function (post) {
      return {
        id: post.id,
        type: 'post',
        label: post.title,
        url: post.url,
        date: post.date,
        count: 1,
        searchText: post.searchText
      };
    });

    return {
      posts: posts,
      postsById: postsById,
      categoryToGroup: categoryToGroup,
      categorySubtitles: categorySubtitles,
      categoryCounts: categoryCounts,
      tagCounts: tagCounts,
      seriesById: seriesById,
      seriesPosts: seriesPosts,
      options: {
        category: categoryOptions,
        series: seriesOptions,
        tag: tagOptions,
        post: postOptions
      }
    };
  }

  function pickDefaultCategory() {
    var first = indexes.options.category[0];
    return first ? first.id : '';
  }

  function getOption(type, id) {
    return (indexes.options[type] || []).find(function (option) {
      return option.id === id;
    }) || null;
  }

  function updateCenterOptions() {
    var query = state.query.trim().toLowerCase();
    var options = indexes.options[state.centerType] || [];
    var allMatches = options.filter(function (option) {
      return !query || option.searchText.indexOf(query) !== -1;
    });
    var filtered = allMatches.slice(0, state.centerType === 'post' ? 140 : 90);
    var selectedOption = getOption(state.centerType, state.centerId);

    if (selectedOption && allMatches.indexOf(selectedOption) !== -1 && filtered.indexOf(selectedOption) === -1) {
      filtered.unshift(selectedOption);
    }

    if (!filtered.length) {
      centerSelect.innerHTML = '<option value="">No matches</option>';
      centerSelect.disabled = true;
      return;
    }

    centerSelect.disabled = false;
    if (!filtered.some(function (option) { return option.id === state.centerId; })) {
      state.centerId = filtered[0].id;
    }

    centerSelect.innerHTML = filtered.map(function (option) {
      var label = option.label + (option.count ? ' (' + option.count + ')' : '');
      return '<option value="' + escapeHtml(option.id) + '">' + escapeHtml(label) + '</option>';
    }).join('');
    centerSelect.value = state.centerId;
  }

  function setCenter(type, id) {
    if (!getOption(type, id)) return;
    state.centerType = type;
    state.centerId = id;
    state.hoverId = null;
    state.activeId = null;
    typeButtons.forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-center-type') === type);
    });
    updateCenterOptions();
    rebuildOrbit();
  }

  function rebuildOrbit() {
    var center = getOption(state.centerType, state.centerId);
    if (!center) return;
    state.center = makeCenterNode(center);

    var items = [];
    if (state.centerType === 'category') items = scoreFromCategory(center.id);
    if (state.centerType === 'series') items = scoreFromSeries(center.id);
    if (state.centerType === 'tag') items = scoreFromTag(center.id);
    if (state.centerType === 'post') items = scoreFromPost(center.id);

    items = items
      .filter(function (item) { return item.score > 0 && item.id !== state.center.id; })
      .sort(function (a, b) {
        return b.score - a.score || typeWeight(a.type) - typeWeight(b.type) || a.label.localeCompare(b.label);
      })
      .slice(0, MAX_ORBIT_NODES);

    layoutOrbit([state.center].concat(items));
    state.nodes = [state.center].concat(items);
    state.links = items.map(function (item) {
      return { source: state.center.id, target: item.id, score: item.score };
    });
    updatePanel(state.center, true);
    draw();
  }

  function makeCenterNode(option) {
    return {
      id: option.type + ':' + option.id,
      rawId: option.id,
      type: option.type,
      label: option.label,
      subtitle: option.subtitle || '',
      count: option.count || 0,
      url: option.url || null,
      date: option.date || null,
      score: 999,
      reasons: ['center'],
      current: true,
      radius: 18
    };
  }

  function addCandidate(bucket, type, rawId, label, score, reason, extra) {
    if (!rawId || !label || score <= 0) return;
    var id = type + ':' + rawId;
    if (id === state.centerType + ':' + state.centerId) return;
    if (!bucket[id]) {
      bucket[id] = Object.assign({
        id: id,
        rawId: rawId,
        type: type,
        label: label,
        score: 0,
        reasons: [],
        radius: nodeRadius(type)
      }, extra || {});
    }
    bucket[id].score += score;
    if (reason && bucket[id].reasons.indexOf(reason) === -1) bucket[id].reasons.push(reason);
  }

  function scoreFromCategory(category) {
    var bucket = {};
    var inCategory = indexes.posts.filter(function (post) {
      return post.categories.indexOf(category) !== -1;
    });
    var categoryTags = {};

    inCategory.forEach(function (post) {
      addPost(bucket, post, 14 + recencyScore(post), 'same category');
      post.tags.forEach(function (tag) {
        categoryTags[tag] = (categoryTags[tag] || 0) + 1;
      });
      if (post.series) addSeries(bucket, post.series, 9, 'series in category');
    });

    Object.keys(categoryTags).sort(function (a, b) {
      return categoryTags[b] - categoryTags[a];
    }).slice(0, 16).forEach(function (tag) {
      addTag(bucket, tag, Math.min(14, 3 + categoryTags[tag] * 2), categoryTags[tag] + ' posts here');
    });

    Object.keys(indexes.categoryCounts).forEach(function (other) {
      if (other === category) return;
      var sharedTags = sharedCategoryTags(category, other);
      if (sharedTags > 0) addCategory(bucket, other, Math.min(11, sharedTags), sharedTags + ' shared tags');
    });

    return Object.keys(bucket).map(function (id) { return bucket[id]; });
  }

  function scoreFromSeries(seriesId) {
    var bucket = {};
    var posts = indexes.seriesPosts[seriesId] || [];
    var categoryHits = {};
    var tagHits = {};

    posts.forEach(function (post) {
      addPost(bucket, post, 18 + recencyScore(post), 'same series');
      post.categories.forEach(function (category) {
        categoryHits[category] = (categoryHits[category] || 0) + 1;
      });
      post.tags.forEach(function (tag) {
        tagHits[tag] = (tagHits[tag] || 0) + 1;
      });
    });

    Object.keys(categoryHits).forEach(function (category) {
      addCategory(bucket, category, 8 + categoryHits[category] * 2, categoryHits[category] + ' series posts');
    });

    Object.keys(tagHits).sort(function (a, b) {
      return tagHits[b] - tagHits[a];
    }).slice(0, 18).forEach(function (tag) {
      addTag(bucket, tag, 3 + tagHits[tag] * 3, tagHits[tag] + ' series tags');
    });

    indexes.posts.forEach(function (post) {
      if (post.series === seriesId) return;
      var sharedTags = countShared(post.tags, Object.keys(tagHits));
      var categoryOverlap = countShared(post.categories, Object.keys(categoryHits));
      var score = sharedTags * 3 + categoryOverlap * 5 + recencyScore(post);
      if (score >= 7) addPost(bucket, post, score, sharedTags + ' shared tags');
    });

    return Object.keys(bucket).map(function (id) { return bucket[id]; });
  }

  function scoreFromTag(tag) {
    var bucket = {};
    var taggedPosts = indexes.posts.filter(function (post) {
      return post.tags.indexOf(tag) !== -1;
    });
    var categoryHits = {};
    var seriesHits = {};
    var coTags = {};

    taggedPosts.forEach(function (post) {
      addPost(bucket, post, 15 + recencyScore(post), 'same tag');
      post.categories.forEach(function (category) {
        categoryHits[category] = (categoryHits[category] || 0) + 1;
      });
      if (post.series) seriesHits[post.series] = (seriesHits[post.series] || 0) + 1;
      post.tags.forEach(function (otherTag) {
        if (otherTag !== tag) coTags[otherTag] = (coTags[otherTag] || 0) + 1;
      });
    });

    Object.keys(categoryHits).forEach(function (category) {
      addCategory(bucket, category, 6 + categoryHits[category] * 2, categoryHits[category] + ' tagged posts');
    });

    Object.keys(seriesHits).forEach(function (seriesId) {
      addSeries(bucket, seriesId, 8 + seriesHits[seriesId] * 3, seriesHits[seriesId] + ' tagged posts');
    });

    Object.keys(coTags).sort(function (a, b) {
      return coTags[b] - coTags[a];
    }).slice(0, 18).forEach(function (otherTag) {
      addTag(bucket, otherTag, 4 + coTags[otherTag] * 3, coTags[otherTag] + ' co-tags');
    });

    return Object.keys(bucket).map(function (id) { return bucket[id]; });
  }

  function scoreFromPost(postId) {
    var bucket = {};
    var current = indexes.postsById[postId];
    if (!current) return [];

    current.categories.forEach(function (category) {
      addCategory(bucket, category, 9, 'current category');
    });
    current.tags.forEach(function (tag) {
      addTag(bucket, tag, 6, 'current tag');
    });
    if (current.series) addSeries(bucket, current.series, 14, 'current series');

    indexes.posts.forEach(function (post) {
      if (post.id === current.id) return;
      var score = 0;
      var reasons = [];
      if (current.series && post.series === current.series) {
        score += 12;
        reasons.push('same series');
      }
      var sharedCategories = countShared(current.categories, post.categories);
      if (sharedCategories) {
        score += sharedCategories * 6;
        reasons.push(sharedCategories + ' shared categories');
      }
      var sharedTags = countShared(current.tags, post.tags);
      if (sharedTags) {
        score += sharedTags * 3;
        reasons.push(sharedTags + ' shared tags');
      }
      var recent = recencyScore(post);
      if (recent) {
        score += recent;
        reasons.push('recent');
      }
      if (score > 0) addPost(bucket, post, score, reasons.join(' · '));
    });

    return Object.keys(bucket).map(function (id) { return bucket[id]; });
  }

  function addPost(bucket, post, score, reason) {
    addCandidate(bucket, 'post', post.id, post.title, score, reason, {
      url: post.url,
      date: post.date,
      categories: post.categories,
      tags: post.tags,
      series: post.series,
      recencyRank: post.recencyRank
    });
  }

  function addCategory(bucket, category, score, reason) {
    addCandidate(bucket, 'category', category, category, score, reason, {
      subtitle: indexes.categorySubtitles[category] || '',
      count: indexes.categoryCounts[category] || 0
    });
  }

  function addSeries(bucket, seriesId, score, reason) {
    var series = indexes.seriesById[seriesId] || { id: seriesId, title: seriesId, count: 0 };
    addCandidate(bucket, 'series', seriesId, series.title || seriesId, score, reason, {
      subtitle: series.description || '',
      count: series.count || 0
    });
  }

  function addTag(bucket, tag, score, reason) {
    addCandidate(bucket, 'tag', tag, tag, score, reason, {
      count: indexes.tagCounts[tag] || 0
    });
  }

  function recencyScore(post) {
    if (post.recencyRank <= 10) return 4;
    if (post.recencyRank <= 30) return 2;
    if (post.recencyRank <= 60) return 1;
    return 0;
  }

  function sharedCategoryTags(a, b) {
    var aTags = {};
    var bTags = {};
    indexes.posts.forEach(function (post) {
      if (post.categories.indexOf(a) !== -1) {
        post.tags.forEach(function (tag) { aTags[tag] = true; });
      }
      if (post.categories.indexOf(b) !== -1) {
        post.tags.forEach(function (tag) { bTags[tag] = true; });
      }
    });
    return Object.keys(aTags).filter(function (tag) { return bTags[tag]; }).length;
  }

  function countShared(a, b) {
    var lookup = {};
    b.forEach(function (item) { lookup[item] = true; });
    return a.filter(function (item) { return lookup[item]; }).length;
  }

  function typeWeight(type) {
    return ({ category: 0, series: 1, tag: 2, post: 3 })[type] || 4;
  }

  function nodeRadius(type) {
    if (type === 'category') return 12;
    if (type === 'series') return 11;
    if (type === 'tag') return 8;
    return 5;
  }

  function layoutOrbit(nodes) {
    var width = canvas.clientWidth || 900;
    var height = canvas.clientHeight || 560;
    var cx = width / 2;
    var cy = height / 2;
    var maxScore = Math.max(34, nodes.slice(1).reduce(function (max, node) {
      return Math.max(max, node.score);
    }, 0));
    var maxRadius = Math.min(width, height) * 0.43;
    var minRadius = Math.min(width, height) * 0.14;
    var byBand = {};

    nodes[0].x = cx;
    nodes[0].y = cy;
    nodes[0].orbitRadius = 0;
    nodes[0].angle = -Math.PI / 2;

    nodes.slice(1).forEach(function (node, index) {
      var band = scoreBand(node.score);
      byBand[band] = (byBand[band] || 0) + 1;
      var laneOffset = (byBand[band] % 4) * 14;
      var closeness = Math.min(1, node.score / maxScore);
      var radius = maxRadius - (maxRadius - minRadius) * closeness + laneOffset;
      var angle = (index * 2.399963229728653 + typeWeight(node.type) * 0.38) % TAU;
      node.orbitRadius = radius;
      node.angle = angle;
      node.x = cx + Math.cos(angle) * radius;
      node.y = cy + Math.sin(angle) * radius * 0.82;
    });
  }

  function scoreBand(score) {
    if (score >= 30) return 30;
    if (score >= 20) return 20;
    if (score >= 10) return 10;
    return 0;
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    DPR = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * DPR));
    canvas.height = Math.max(1, Math.floor(rect.height * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    rebuildOrbit();
  }

  function draw() {
    var width = canvas.clientWidth || 900;
    var height = canvas.clientHeight || 560;
    ctx.clearRect(0, 0, width, height);
    drawSpace(width, height);
    drawRings(width, height);
    drawLinks();
    drawNodes();
  }

  function drawSpace(width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(6, 11, 22, 0.92)';
    ctx.fillRect(0, 0, width, height);
    for (var i = 0; i < 76; i += 1) {
      var x = (i * 83 + 31) % width;
      var y = (i * 47 + 19) % height;
      var alpha = 0.18 + ((i * 13) % 45) / 100;
      ctx.fillStyle = 'rgba(240, 246, 252, ' + alpha + ')';
      ctx.beginPath();
      ctx.arc(x, y, i % 9 === 0 ? 1.35 : 0.8, 0, TAU);
      ctx.fill();
    }
    drawSpaceObjects(width, height);
    ctx.restore();
  }

  function drawRings(width, height) {
    var cx = width / 2;
    var cy = height / 2;
    var maxRadius = Math.min(width, height) * 0.43;
    var rings = [0.32, 0.54, 0.76, 0.98];
    ctx.save();
    ctx.setLineDash([3, 8]);
    rings.forEach(function (ratio, index) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, maxRadius * ratio, maxRadius * ratio * 0.82, 0, 0, TAU);
      ctx.strokeStyle = 'rgba(240, 246, 252, ' + (0.18 - index * 0.018) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawLinks() {
    if (!state.center) return;
    var hovered = getNode(state.hoverId || state.activeId);
    ctx.save();
    state.links.forEach(function (link) {
      var target = getNode(link.target);
      if (!target) return;
      var active = hovered && (hovered.id === target.id || hovered.id === state.center.id);
      ctx.beginPath();
      ctx.moveTo(state.center.x, state.center.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = active ? 'rgba(126, 231, 135, 0.62)' : 'rgba(121, 192, 255, 0.17)';
      ctx.lineWidth = active ? 1.4 : 0.8;
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawNodes() {
    state.nodes.forEach(function (node) {
      var active = node.id === state.activeId;
      var hovered = node.id === state.hoverId;
      var pulse = node.current ? Math.sin(state.phase * 0.06) * 1.6 : 0;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + pulse + (active ? 4 : hovered ? 3 : 0), 0, TAU);
      ctx.fillStyle = node.current ? palette.current : colorFor(node);
      ctx.fill();
      ctx.lineWidth = node.current || active || hovered ? 2 : 1;
      ctx.strokeStyle = node.current ? '#ffffff' : 'rgba(240, 246, 252, 0.42)';
      ctx.stroke();

      var shouldLabel = node.current || active || hovered || node.type !== 'post' || node.score >= 20;
      if (shouldLabel) drawLabel(node);
    });
  }

  function colorFor(node) {
    if (node.type === 'post') return 'rgba(240, 246, 252, 0.72)';
    return palette[node.type] || palette.post;
  }

  function drawLabel(node) {
    var label = node.label.length > 34 ? node.label.slice(0, 33) + '...' : node.label;
    var x = node.x + node.radius + 8;
    var y = node.y + 4;
    ctx.font = node.current ? '700 12px JetBrains Mono, monospace' : '600 11px Inter, sans-serif';
    var textWidth = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(6, 11, 22, 0.72)';
    ctx.fillRect(x - 4, y - 13, textWidth + 8, 18);
    ctx.fillStyle = node.current ? palette.current : colorFor(node);
    ctx.fillText(label, x, y);
  }

  function drawSpaceObjects(width, height) {
    var t = state.phase / 60;
    drawSatellite(width * 0.18 + Math.cos(t * 0.7) * 12, height * 0.23 + Math.sin(t * 0.9) * 8, t);
    drawShip(width * 0.77 + Math.cos(t * 0.55) * 15, height * 0.28 + Math.sin(t * 0.6) * 10, t);
    drawAstronaut(width * 0.78 + Math.cos(t * 0.42) * 12, height * 0.78 + Math.sin(t * 0.5) * 9, t);
  }

  function drawSatellite(x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.35 + Math.sin(t) * 0.08);
    ctx.strokeStyle = 'rgba(240, 246, 252, 0.68)';
    ctx.fillStyle = 'rgba(121, 192, 255, 0.62)';
    ctx.lineWidth = 1;
    ctx.fillRect(-7, -4, 14, 8);
    ctx.strokeRect(-7, -4, 14, 8);
    ctx.fillStyle = 'rgba(126, 231, 135, 0.35)';
    ctx.fillRect(-24, -8, 13, 16);
    ctx.fillRect(11, -8, 13, 16);
    ctx.strokeRect(-24, -8, 13, 16);
    ctx.strokeRect(11, -8, 13, 16);
    ctx.restore();
  }

  function drawShip(x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.48 + Math.sin(t * 0.8) * 0.08);
    ctx.fillStyle = 'rgba(242, 204, 96, 0.72)';
    ctx.beginPath();
    ctx.moveTo(17, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(240, 246, 252, 0.86)';
    ctx.beginPath();
    ctx.arc(4, 0, 3, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawAstronaut(x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(t * 0.7) * 0.16);
    ctx.strokeStyle = 'rgba(240, 246, 252, 0.72)';
    ctx.fillStyle = 'rgba(240, 246, 252, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -8, 5, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-5, -2, 10, 13);
    ctx.beginPath();
    ctx.moveTo(-5, 1);
    ctx.lineTo(-13, 7);
    ctx.moveTo(5, 1);
    ctx.lineTo(13, -5);
    ctx.moveTo(-3, 11);
    ctx.lineTo(-8, 20);
    ctx.moveTo(3, 11);
    ctx.lineTo(9, 18);
    ctx.stroke();
    ctx.restore();
  }

  function getNode(id) {
    if (!id) return null;
    return state.nodes.find(function (node) { return node.id === id; }) || null;
  }

  function nearestNode(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var nearest = null;
    var best = Infinity;
    state.nodes.forEach(function (node) {
      var dx = x - node.x;
      var dy = y - node.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius + 12 && dist < best) {
        nearest = node;
        best = dist;
      }
    });
    return nearest;
  }

  function updatePanel(node, isCenter) {
    if (!node) return;
    panelKicker.textContent = isCenter ? 'Center' : 'Selected';
    panelTitle.textContent = node.label;
    panelBody.textContent = describeNode(node, isCenter);
    panelMeta.innerHTML = metaFor(node, isCenter).map(function (item) {
      return '<span>' + escapeHtml(item) + '</span>';
    }).join('');
    if (node.url) {
      panelLink.href = node.url;
      panelLink.hidden = false;
    } else {
      panelLink.hidden = true;
    }
  }

  function describeNode(node, isCenter) {
    if (isCenter) {
      if (node.type === 'category') return '이 카테고리를 기준으로 직접 속한 글, 자주 등장한 태그, 연결된 시리즈를 가까운 궤도에 둡니다.';
      if (node.type === 'series') return '이 시리즈의 글과 반복되는 태그, 같은 범주의 확장 글을 중심 주변에 배치합니다.';
      if (node.type === 'tag') return '이 태그가 붙은 글, 함께 자주 쓰인 태그, 관련 카테고리와 시리즈를 보여줍니다.';
      if (node.type === 'post') return '이 글과 같은 시리즈, 같은 카테고리, 겹치는 태그, 최신도를 점수화해 주변에 둡니다.';
    }
    if (node.type === 'category') return (node.subtitle || '카테고리') + '에 속한 글과 태그 흐름으로 연결됩니다.';
    if (node.type === 'series') return node.subtitle || '연속해서 읽기 좋은 포스트 묶음입니다.';
    if (node.type === 'tag') return '여러 글을 가로지르는 키워드입니다.';
    if (node.type === 'post') return [node.date, (node.categories || []).join(', ')].filter(Boolean).join(' · ');
    return '';
  }

  function metaFor(node, isCenter) {
    var meta = [node.type];
    if (!isCenter && node.score !== undefined) meta.push(node.score + ' score');
    if (node.count) meta.push(node.count + (node.type === 'tag' ? ' uses' : ' posts'));
    if (node.reasons && node.reasons.length) meta = meta.concat(node.reasons.slice(0, 3));
    if (node.series) {
      var series = indexes.seriesById[node.series];
      meta.push(series ? (series.title || series.id) : node.series);
    }
    if (node.tags && node.tags.length) meta.push(node.tags.slice(0, 4).join(', '));
    return meta;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  typeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var type = button.getAttribute('data-center-type');
      var option = indexes.options[type][0];
      if (!option) return;
      state.query = '';
      searchInput.value = '';
      setCenter(type, option.id);
    });
  });

  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    updateCenterOptions();
    rebuildOrbit();
  });

  centerSelect.addEventListener('change', function () {
    setCenter(state.centerType, centerSelect.value);
  });

  resetButton.addEventListener('click', function () {
    state.query = '';
    searchInput.value = '';
    setCenter('category', pickDefaultCategory());
  });

  canvas.addEventListener('pointermove', function (event) {
    var hovered = nearestNode(event);
    var nextId = hovered ? hovered.id : null;
    if (nextId !== state.hoverId) {
      state.hoverId = nextId;
      canvas.style.cursor = hovered ? 'pointer' : 'default';
      if (hovered) updatePanel(hovered, hovered.current);
      else updatePanel(getNode(state.activeId) || state.center, !state.activeId);
      draw();
    }
  });

  canvas.addEventListener('pointerleave', function () {
    state.hoverId = null;
    canvas.style.cursor = 'default';
    updatePanel(getNode(state.activeId) || state.center, !state.activeId);
    draw();
  });

  canvas.addEventListener('click', function (event) {
    var node = nearestNode(event);
    if (!node) return;
    state.activeId = node.current ? null : node.id;
    updatePanel(node, node.current);
    draw();
    if (!node.current && getOption(node.type, node.rawId)) {
      window.setTimeout(function () {
        state.query = '';
        searchInput.value = '';
        setCenter(node.type, node.rawId);
      }, 180);
    }
  });

  window.addEventListener('resize', function () {
    resizeCanvas();
  });

  function animate() {
    state.phase += 1;
    draw();
    window.requestAnimationFrame(animate);
  }

  updateCenterOptions();
  resizeCanvas();
  animate();
})();
