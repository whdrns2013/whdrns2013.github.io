document.addEventListener('DOMContentLoaded', function () {
  var tocMenu = document.querySelector('.toc__menu');
  if (!tocMenu) return;

  var links = Array.prototype.slice.call(tocMenu.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  var headings = links.map(function (a) {
    return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
  });

  var activeLink = null;
  function setActive(link) {
    if (activeLink === link) return;
    if (activeLink) activeLink.classList.remove('is-active');
    activeLink = link;
    if (activeLink) activeLink.classList.add('is-active');
  }

  // A section stays "active" from the moment its heading crosses OFFSET
  // until the next heading does — not just while a heading briefly sits in
  // some thin observation band, which fails for sections taller than the
  // viewport (the common case here).
  var OFFSET = 120;

  function updateActive() {
    var current = links[0];
    for (var i = 0; i < headings.length; i++) {
      var h = headings[i];
      if (!h) continue;
      if (h.getBoundingClientRect().top - OFFSET <= 0) {
        current = links[i];
      } else {
        break;
      }
    }
    setActive(current);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateActive();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateActive();
});
