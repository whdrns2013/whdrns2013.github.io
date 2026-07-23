document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('search');
  var resultsEl = document.getElementById('results');
  var scrim = document.querySelector('.search-content');
  if (!searchInput || !resultsEl || typeof lunr === 'undefined' || typeof store === 'undefined') return;

  var idx = lunr(function () {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('categories');
    this.field('excerpt');

    store.forEach(function (doc, i) {
      this.add({
        id: i,
        title: doc.title,
        categories: (doc.categories || []).join(' '),
        excerpt: doc.excerpt
      });
    }, this);
  });

  var recentDefaults = store.slice(0, 6);

  function renderResults(list) {
    resultsEl.innerHTML = '';
    if (!list.length) {
      resultsEl.innerHTML = '<p class="search-empty">No results.</p>';
      return;
    }
    var ul = document.createElement('ul');
    ul.className = 'search-results-list';
    list.forEach(function (doc) {
      var category = doc.categories && doc.categories.length ? doc.categories[0] : null;
      var li = document.createElement('li');
      li.innerHTML =
        '<a href="' + doc.url + '">' +
          '<span class="search-results-list__title">' + doc.title + '</span>' +
          (category ? '<span class="search-results-list__chip">' + category + '</span>' : '') +
        '</a>';
      ul.appendChild(li);
    });
    resultsEl.appendChild(ul);
  }

  function search(query) {
    if (!query) {
      renderResults(recentDefaults);
      return;
    }
    var matches = [];
    try {
      matches = idx.search(query + '*').map(function (r) { return store[Number(r.ref)]; });
    } catch (e) {
      matches = idx.search(query).map(function (r) { return store[Number(r.ref)]; });
    }
    renderResults(matches);
  }

  searchInput.addEventListener('input', function () {
    search(searchInput.value.trim());
  });

  document.querySelectorAll('.search__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTimeout(function () { search(searchInput.value.trim()); }, 50);
    });
  });

  if (scrim) {
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) {
        scrim.classList.remove('is--visible');
      }
    });
  }
});
