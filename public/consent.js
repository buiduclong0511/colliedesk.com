// Cookie consent for Google Analytics on colliedesk.com. Google Analytics sets cookies, so it
// loads only after the visitor clicks Accept; nothing from Google loads before that. The choice
// is kept in localStorage under "colliedesk-consent" ("granted" or "denied"). Any element with
// data-consent-open (the footer "Cookie settings" button) reopens the banner, and declining after
// an earlier accept deletes the Google Analytics cookies. PostHog (analytics.js) is cookieless and
// does not depend on this choice. scripts/check.mjs fails if Google Analytics can load another way.
(function () {
  var KEY = 'colliedesk-consent';
  var GA_ID = 'G-7VBE3TER7E';
  var live = location.hostname === 'colliedesk.com';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* private mode: ask again next visit */ }
  }

  function loadAnalytics() {
    if (!live || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function clearAnalyticsCookies() {
    var domain = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=.' + domain;
        document.cookie = name + '=; Max-Age=0; path=/';
      }
    });
  }

  var banner;
  function hide() { if (banner) banner.hidden = true; }
  function choose(value) {
    var before = read();
    store(value);
    hide();
    if (value === 'granted') loadAnalytics();
    else if (before === 'granted') { clearAnalyticsCookies(); location.reload(); }
  }
  function show() {
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'consent-banner';
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', 'Cookie choice');
      banner.innerHTML =
        '<p>We would like to use Google Analytics cookies to see which pages help people. ' +
        'Nothing loads unless you accept. <a href="/privacy#cookies">Privacy</a></p>' +
        '<div class="consent-actions">' +
        '<button type="button" class="btn btn-sm" data-consent="denied">Decline</button>' +
        '<button type="button" class="btn btn-sm btn-primary" data-consent="granted">Accept</button>' +
        '</div>';
      banner.addEventListener('click', function (event) {
        var button = event.target.closest('[data-consent]');
        if (button) choose(button.getAttribute('data-consent'));
      });
      document.body.appendChild(banner);
    }
    banner.hidden = false;
  }

  var choice = read();
  if (choice === 'granted') loadAnalytics();

  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-consent-open]')) show();
    });
    if (live && choice !== 'granted' && choice !== 'denied') show();
  });
})();
