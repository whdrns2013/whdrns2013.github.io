document.addEventListener('DOMContentLoaded', function () {
  var browser = document.querySelector('[data-tag-browser]');
  var rows = Array.prototype.slice.call(document.querySelectorAll('.post-card--list[data-tags]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-tag-chip]'));
  var searchInput = document.querySelector('[data-tag-search]');
  var indicator = document.getElementById('tag-active-filter');
  var indicatorName = document.getElementById('tag-active-filter-name');
  var title = document.querySelector('[data-tag-results-title]');
  var empty = document.querySelector('[data-tag-empty]');
  if (!browser || !rows.length) return;

  var params = new URLSearchParams(window.location.search);
  var activeTag = params.get('tag') || '';

  function tagLabel(slug) {
    var chip = chips.find(function (item) {
      return item.getAttribute('data-tag') === slug;
    });
    return chip ? chip.getAttribute('data-tag-label') : slug;
  }

  function applyPostFilter(slug) {
    var visibleCount = 0;
    rows.forEach(function (row) {
      var tags = row.getAttribute('data-tags') || '';
      var match = !slug || tags.indexOf('|' + slug + '|') !== -1;
      row.parentElement.style.display = match ? '' : 'none';
      if (match) visibleCount += 1;
    });

    chips.forEach(function (chip) {
      chip.classList.toggle('is-active', Boolean(slug) && chip.getAttribute('data-tag') === slug);
    });

    if (slug) {
      var label = tagLabel(slug);
      if (indicatorName) indicatorName.textContent = label;
      if (indicator) indicator.hidden = false;
      if (title) title.textContent = label + ' 포스트';
    } else {
      if (indicator) indicator.hidden = true;
      if (title) title.textContent = '전체 포스트';
    }

    if (empty) empty.hidden = visibleCount > 0;
  }

  function applyTagSearch(query) {
    var needle = query.trim().toLowerCase();
    chips.forEach(function (chip) {
      var label = (chip.getAttribute('data-tag-label') || '').toLowerCase();
      var slug = chip.getAttribute('data-tag') || '';
      chip.parentElement.style.display = !needle || label.indexOf(needle) !== -1 || slug.indexOf(needle) !== -1 ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      applyTagSearch(searchInput.value);
    });
  }

  applyPostFilter(activeTag);
});
