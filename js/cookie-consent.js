/* ══════════════════════════════════════════════════
   NorinoConsent – GDPR Cookie Banner
   Google Consent Mode v2 — consent default già in <head>
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'norino_consent';

  /* ── gtag helper (dataLayer defined in <head>) ── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  /* ── Storage helpers (localStorage) ── */
  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function setConsent(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
    catch (_) { /* privacy mode */ }
  }

  /* ── Purge tracking cookies ── */
  function purgeTrackingCookies() {
    var names = ['_ga', '_gid', '_gat', '_fbp', '_fbc'];
    names.forEach(function (n) {
      document.cookie = n + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
    });
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga_') === 0) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
      }
    });
  }

  /* ────────────────────────────────────────────────
     Update Google Consent Mode v2 signals
     This is the KEY function — it tells Google
     whether each signal is 'granted' or 'denied'
     ──────────────────────────────────────────────── */
  function updateConsentSignals(prefs) {
    var analyticsGranted = prefs.analytics ? 'granted' : 'denied';
    var marketingGranted = prefs.marketing ? 'granted' : 'denied';

    gtag('consent', 'update', {
      analytics_storage:       analyticsGranted,
      ad_storage:              marketingGranted,
      ad_user_data:            marketingGranted,
      ad_personalization:      marketingGranted,
      personalization_storage: marketingGranted,
      functionality_storage:   'granted',
      security_storage:        'granted'
    });
  }

  /* ── Apply consent: update signals + purge if denied ── */
  function applyConsent(prefs) {
    updateConsentSignals(prefs);

    if (!prefs.analytics && !prefs.marketing) {
      purgeTrackingCookies();
    }
  }

  /* ────────────────────────────────────────────────
     Build banner + settings modal (injected once)
     ──────────────────────────────────────────────── */
  var uiRef = null;

  function injectUI() {
    if (uiRef) return uiRef;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">' +
          'Questo sito utilizza cookie tecnici necessari e, con il tuo consenso, cookie analitici per migliorare la tua esperienza. ' +
          'Puoi scegliere quali accettare. <a href="cookie-policy.html">Scopri di più</a>' +
        '</p>' +
        '<div class="cookie-banner__actions">' +
          '<button class="cookie-banner__btn cookie-banner__btn--accept" data-cc="accept">Accetta tutto</button>' +
          '<button class="cookie-banner__btn cookie-banner__btn--reject" data-cc="reject">Rifiuta</button>' +
          '<button class="cookie-banner__btn cookie-banner__btn--settings" data-cc="open-settings">Personalizza</button>' +
        '</div>' +
      '</div>';

    var overlay = document.createElement('div');
    overlay.className = 'cookie-modal-overlay';
    overlay.innerHTML =
      '<div class="cookie-modal" role="dialog" aria-label="Preferenze cookie">' +
        '<h2 class="cookie-modal__title">Preferenze cookie</h2>' +
        '<p class="cookie-modal__desc">Scegli quali categorie di cookie desideri attivare. I cookie necessari sono sempre attivi perché indispensabili al funzionamento del sito.</p>' +

        '<div class="cookie-modal__group">' +
          '<div class="cookie-modal__group-head">' +
            '<span class="cookie-modal__group-label">Necessari</span>' +
            '<label class="cookie-toggle">' +
              '<input type="checkbox" checked disabled>' +
              '<span class="cookie-toggle__track"></span>' +
            '</label>' +
          '</div>' +
          '<p class="cookie-modal__group-info">Cookie essenziali per la navigazione e le funzionalità di base del sito.</p>' +
        '</div>' +

        '<div class="cookie-modal__group">' +
          '<div class="cookie-modal__group-head">' +
            '<span class="cookie-modal__group-label">Analitici</span>' +
            '<label class="cookie-toggle">' +
              '<input type="checkbox" id="cc-analytics">' +
              '<span class="cookie-toggle__track"></span>' +
            '</label>' +
          '</div>' +
          '<p class="cookie-modal__group-info">Ci aiutano a capire come i visitatori interagiscono con il sito, raccogliendo dati in forma anonima.</p>' +
        '</div>' +

        '<div class="cookie-modal__group">' +
          '<div class="cookie-modal__group-head">' +
            '<span class="cookie-modal__group-label">Marketing</span>' +
            '<label class="cookie-toggle">' +
              '<input type="checkbox" id="cc-marketing">' +
              '<span class="cookie-toggle__track"></span>' +
            '</label>' +
          '</div>' +
          '<p class="cookie-modal__group-info">Utilizzati per mostrarti annunci pertinenti e misurare l\'efficacia delle campagne pubblicitarie.</p>' +
        '</div>' +

        '<button class="cookie-modal__save" data-cc="save">Salva preferenze</button>' +
      '</div>';

    document.body.appendChild(banner);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('is-open');
    });

    uiRef = { banner: banner, overlay: overlay };
    return uiRef;
  }

  /* ── Save + apply + hide UI ── */
  function save(prefs) {
    setConsent(prefs);
    applyConsent(prefs);
    if (uiRef) {
      uiRef.banner.classList.remove('is-visible');
      uiRef.overlay.classList.remove('is-open');
    }
  }

  /* ── Open settings modal ── */
  function openSettings() {
    var ui = injectUI();
    var prefs = getConsent() || { analytics: false, marketing: false };
    var a = document.getElementById('cc-analytics');
    var m = document.getElementById('cc-marketing');
    if (a) a.checked = !!prefs.analytics;
    if (m) m.checked = !!prefs.marketing;
    ui.overlay.classList.add('is-open');
  }

  /* ────────────────────────────────────────────────
     Init
     ──────────────────────────────────────────────── */
  function init() {
    var prefs = getConsent();

    if (prefs) {
      /* Consent già impostato nel <head> via localStorage,
         nessun consent update necessario — GTM parte
         con i valori corretti fin da subito. */
      if (!prefs.analytics && !prefs.marketing) {
        purgeTrackingCookies();
      }
    } else {
      /* Nessun consenso → default denied (già in <head>), mostra banner */
      purgeTrackingCookies();
      var ui = injectUI();
      setTimeout(function () { ui.banner.classList.add('is-visible'); }, 600);
    }

    /* Global click handler for all consent buttons */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cc]');
      if (!btn) return;
      var action = btn.getAttribute('data-cc');

      switch (action) {
        case 'accept':
          save({ necessary: true, analytics: true, marketing: true });
          break;
        case 'reject':
          save({ necessary: true, analytics: false, marketing: false });
          break;
        case 'open-settings':
          openSettings();
          break;
        case 'save':
          var a = document.getElementById('cc-analytics');
          var m = document.getElementById('cc-marketing');
          save({
            necessary: true,
            analytics: a ? a.checked : false,
            marketing: m ? m.checked : false
          });
          break;
      }
    });

    window.NorinoConsent = { openSettings: openSettings };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
