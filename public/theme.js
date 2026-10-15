// Light is the default for every visitor. The footer button switches to dark; the choice is saved
// in this browser for colliedesk.com only; the app keeps its own setting on its own origin.
(function () {
  var key = 'colliedesk.theme';
  var root = document.documentElement;
  try { if (localStorage.getItem(key) === 'dark') root.dataset.theme = 'dark'; } catch (e) { /* storage blocked: stay light */ }
  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    var sync = function () { button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark')); };
    button.hidden = false;
    sync();
    button.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, root.dataset.theme); } catch (e) { /* remembered for this page only */ }
      sync();
    });
  });
})();
