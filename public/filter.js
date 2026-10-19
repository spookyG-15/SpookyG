(function () {
  'use strict';

  var root = document.querySelector('[data-filter-root]');
  var counter = document.querySelector('[data-filter-count]');
  if (!root || !counter) return;

  var grid = document.querySelector('[data-review-grid]');
  if (!grid) return;

  var chips = Array.prototype.slice.call(root.querySelectorAll('[data-filter-chip]'));
  var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-review-card]'));
  var empty = document.querySelector('[data-filter-empty]');

  function singular(n, word) {
    return n === 1 ? n + ' ' + word : n + ' ' + word + 's';
  }

  function apply(category) {
    var visible = 0;

    cards.forEach(function (card) {
      var match = category === 'all' || card.getAttribute('data-category') === category;
      card.hidden = !match;
      if (match) visible += 1;
    });

    chips.forEach(function (chip) {
      var isActive = chip.getAttribute('data-category') === category;
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      chip.classList.toggle('bg-ink', isActive);
      chip.classList.toggle('text-bg', isActive);
      chip.classList.toggle('border-ink', isActive);
      chip.classList.toggle('bg-bg', !isActive);
      chip.classList.toggle('text-ink-soft', !isActive);
      chip.classList.toggle('border-line', !isActive);
    });

    if (empty) empty.hidden = visible !== 0;

    var label = chips.filter(function (c) {
      return c.getAttribute('data-category') === category;
    })[0];
    var name = label ? label.textContent.trim() : 'All';

    counter.textContent =
      category === 'all'
        ? 'Showing all ' + singular(visible, 'review') + '.'
        : 'Showing ' + singular(visible, 'review') + ' in ' + name + '.';
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      apply(chip.getAttribute('data-category') || 'all');
    });
  });
})();