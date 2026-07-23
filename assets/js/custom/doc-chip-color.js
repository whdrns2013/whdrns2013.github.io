document.addEventListener('DOMContentLoaded', function () {
  var chips = document.querySelectorAll('.docs-accordion__chip[data-group]');
  if (!chips.length) return;

  // Stable string hash -> hue (0-359). Same group key always yields the
  // same hue, so any number of doc groups gets its own color with zero
  // manual upkeep — no per-group color map to maintain in SCSS.
  function hueFromString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 360;
  }

  chips.forEach(function (chip) {
    var group = chip.getAttribute('data-group');
    if (!group) return;
    chip.style.setProperty('--chip-hue', hueFromString(group));
  });
});
