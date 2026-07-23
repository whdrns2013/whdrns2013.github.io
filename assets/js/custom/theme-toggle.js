// theme toggle: flips [data-theme] on <html>, persists to localStorage
(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    var toggle = document.getElementById('theme-toggle');
    var label = document.getElementById('theme-toggle-label');
    if (toggle) toggle.setAttribute('aria-checked', theme === 'dark');
    if (label) label.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current);

    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }
  });
})();
