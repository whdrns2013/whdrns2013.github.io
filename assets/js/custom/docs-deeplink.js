document.addEventListener('DOMContentLoaded', function () {
  if (!location.hash) return;
  var target = document.querySelector(location.hash);
  if (target && target.tagName === 'DETAILS') {
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  }
});
