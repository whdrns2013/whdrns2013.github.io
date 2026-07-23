document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('site-sidebar');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', function () {
    sidebar.classList.toggle('is-collapsed');
  });
});
