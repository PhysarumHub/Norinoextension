/* ══════════════════════════════════════════════════
   Facebook Pixel — Norino
   Pixel ID: 406180763726252

   • Si inizializza SOLO se marketing consent = true
   • Se il consenso arriva dopo (banner), si attiva
     in risposta all'evento custom 'norino:consent'
   • Gli eventi in coda prima del consenso vengono
     inviati non appena il pixel è pronto
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PIXEL_ID    = '406180763726252';
  var initialized = false;
  var eventQueue  = [];

  /* ── Legge il consenso marketing da localStorage ── */
  function hasMarketingConsent() {
    try {
      var raw = localStorage.getItem('norino_consent');
      if (!raw) return false;
      return !!JSON.parse(raw).marketing;
    } catch (_) { return false; }
  }

  /* ── Carica il pixel e invia PageView ── */
  function initPixel() {
    if (initialized) return;
    initialized = true;

    /* Base code ufficiale Facebook Pixel */
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');

    /* Svuota la coda degli eventi in attesa */
    eventQueue.forEach(function (item) {
      fbq(item[0], item[1], item[2] || {});
    });
    eventQueue = [];
  }

  /* ── Wrapper sicuro: accoda l'evento se il pixel non è ancora pronto ── */
  window.fbq_safe = function (method, event, params) {
    if (initialized) {
      fbq(method, event, params || {});
    } else {
      eventQueue.push([method, event, params || {}]);
      if (hasMarketingConsent()) initPixel();
    }
  };

  /* ── Init immediato se il consenso era già stato dato ── */
  if (hasMarketingConsent()) {
    initPixel();
  }

  /* ── Init differito: scatta quando l'utente dà il consenso dal banner ── */
  document.addEventListener('norino:consent', function (e) {
    if (e.detail && e.detail.marketing) {
      initPixel();
    }
  });

})();
