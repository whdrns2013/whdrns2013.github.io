document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('site-sidebar');
  if (!btn || !sidebar) return;

  var autoCollapseQuery = window.matchMedia('(max-width: 900px)');

  function shouldAutoCollapse() {
    return autoCollapseQuery.matches && !document.body.classList.contains('layout--home');
  }

  function syncSidebarMode() {
    if (shouldAutoCollapse()) {
      sidebar.classList.add('is-auto-collapsed', 'is-collapsed');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      if (sidebar.classList.contains('is-auto-collapsed')) {
        sidebar.classList.remove('is-collapsed');
      }
      sidebar.classList.remove('is-auto-collapsed');
      btn.removeAttribute('aria-expanded');
    }
  }

  btn.addEventListener('click', function () {
    sidebar.classList.toggle('is-collapsed');

    if (shouldAutoCollapse()) {
      btn.setAttribute('aria-expanded', !sidebar.classList.contains('is-collapsed'));
    }
  });

  if (autoCollapseQuery.addEventListener) {
    autoCollapseQuery.addEventListener('change', syncSidebarMode);
  } else if (autoCollapseQuery.addListener) {
    autoCollapseQuery.addListener(syncSidebarMode);
  }

  syncSidebarMode();
});
