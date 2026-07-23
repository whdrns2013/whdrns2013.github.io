document.addEventListener('DOMContentLoaded', function () {
  var rows = Array.prototype.slice.call(document.querySelectorAll('.post-card--list[data-category]'));
  var years = Array.prototype.slice.call(document.querySelectorAll('.archive-year'));
  var indicator = document.getElementById('archive-active-filter');
  var indicatorName = document.getElementById('archive-active-filter-name');
  if (!rows.length || !indicator) return;

  var params = new URLSearchParams(window.location.search);
  var category = params.get('category');
  if (!category) return;

  rows.forEach(function (row) {
    var match = row.getAttribute('data-category') === category;
    row.parentElement.style.display = match ? '' : 'none';
  });

  years.forEach(function (year) {
    var visible = year.querySelectorAll('.list__item:not([style*="display: none"])').length > 0;
    year.style.display = visible ? '' : 'none';
  });

  indicatorName.textContent = category;
  indicator.hidden = false;
});
