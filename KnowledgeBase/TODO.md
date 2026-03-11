# Norino Website — TODO per il lancio

> Aggiornato: 11 marzo 2026
> Stato attuale: sito strutturalmente completo. Le voci aperte sono necessarie prima del go-live in produzione.

---

## ✅ Già implementato (non toccare)

- GTM `GTM-5J2RDB59` installato su tutte le pagine HTML
- Google Consent Mode v2 con default `denied` prima di GTM
- Cookie banner GDPR custom (`js/cookie-consent.js`) con Accetta / Rifiuta / Personalizza
- `privacy-policy.html` — presente e completa (mancano solo i dati legali, vedi sotto)
- `cookie-policy.html` — presente e completa
- `termini.html` — presente e completo (mancano solo i dati legali, vedi sotto)
- `404.html` — presente
- `sitemap.xml` — presente con le 6 URL e `lastmod: 2026-03-10`
- `robots.txt` — corretto con link alla sitemap
- `og:image` meta già nelle tre pagine principali (`index`, `diradamento`, `punto-rosa`)
- Link footer a `privacy-policy.html` e `cookie-policy.html` già corretti (non più `href="#"`)
- Il form consulenza ha validazione frontend e step multipli funzionanti

---

## 🖼 Immagini & Asset — DA FORNIRE TU

- [ ] **Sostituire tutte le immagini placeholder** (nella cartella `/img/` ci sono solo `logonorino.png` e `NOR __ Hero GL.png`)
  - Hero gallery — index.html (Glamour Extension)
  - Hero immagine singola — diradamento.html
  - Hero immagine ritratto — punto-rosa.html
  - Banner dot images (tutte e 3 le pagine)
  - Before/After slider — immagini "prima" e "dopo"
  - Hotspot background images
  - Social proof avatars (6 foto clienti)
- [ ] **Creare le og:image** (1200×630px) per ogni pagina e caricarle nella cartella `/img/`:
  - `img/og-image.jpg` → index.html (meta già presente, manca il file)
  - `img/og-image-diradamento.jpg` → diradamento.html (meta già presente, manca il file)
  - `img/og-image-punto-rosa.jpg` → punto-rosa.html (meta già presente, manca il file)
- [ ] **Ottimizzare tutte le immagini** in formato WebP con fallback JPG

---

## 📝 Dati legali da compilare — DA FORNIRE TU

- [ ] **Sede legale e P.IVA** — sostituire i placeholder in:
  - `privacy-policy.html` righe 70-71: `[INDIRIZZO DA INSERIRE]` e `[P.IVA DA INSERIRE]`
  - `termini.html` riga 69: `[INDIRIZZO DA INSERIRE]` e `[P.IVA DA INSERIRE]`
- [ ] **URL social reali** — aggiornare i `href="#"` nel footer di tutte e 3 le pagine principali:
  - Instagram → `index.html`, `diradamento.html`, `punto-rosa.html`
  - Facebook → `index.html`, `diradamento.html`, `punto-rosa.html`
  - TikTok → `index.html`, `diradamento.html`, `punto-rosa.html`

---

## 🔗 Form consulenza — DA IMPLEMENTARE (codice)

- [ ] **Configurare il backend del form** — il form ha la gestione frontend completa (validazione, step, salone) ma fa solo `e.preventDefault()` senza inviare nulla. Scegliere una delle opzioni:
  - **[Formspree](https://formspree.io/)** — zero backend, gratis fino a 50 invii/mese (opzione più semplice)
  - **[Netlify Forms](https://www.netlify.com/products/forms/)** — se si usa Netlify per l'hosting
  - **WhatsApp Business API / CRM** — integrazione diretta
  - *Quando scegli, implemento io il codice in `js/main.js`*

---

## 📊 Google Tag Manager — Tag da creare dentro GTM

GTM `GTM-5J2RDB59` è già installato su tutte le pagine. Consent Mode v2 già configurato.
Da configurare all'interno della dashboard GTM:

| Tag | Tipo | Trigger |
|---|---|---|
| GA4 Configuration | Google Analytics: GA4 | All Pages |
| GA4 — Form Submit | GA4 Event `generate_lead` | Click su `[data-action="open-consult"]` |
| GA4 — Step 1 Complete | GA4 Event `consult_step1` | Avanzamento popup step 1→2 |
| GA4 — Prenotazione inviata | GA4 Event `form_submit` | Submit form consulenza |
| GA4 — Scroll 50% / 90% | GA4 Event `scroll` | Scroll Depth trigger |
| GA4 — Outbound clicks | GA4 Event `click` | Click su link `tel:` e social |

---

## ⚙️ SEO & Tecnico — DA IMPLEMENTARE (codice)

- [ ] **`<link rel="canonical">`** — mancante su tutte le pagine, da aggiungere in ogni `<head>`:
  ```html
  <link rel="canonical" href="https://norino.it/" />
  <link rel="canonical" href="https://norino.it/diradamento.html" />
  <link rel="canonical" href="https://norino.it/punto-rosa.html" />
  ```
- [ ] **Structured data JSON-LD** (`HairSalon`) — nessuna pagina ce l'ha, utile per Google locale. Da aggiungere una volta compilati indirizzo e telefono reali:
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "name": "Norino",
    "url": "https://norino.it",
    "address": { "@type": "PostalAddress", "streetAddress": "...", "addressLocality": "Bergamo", "addressCountry": "IT" },
    "telephone": "+39 XXX XXX XXXX",
    "openingHours": "Mo-Sa 09:00-19:00"
  }
  </script>
  ```

---

## ♿ Accessibilità — DA IMPLEMENTARE (codice)

- [ ] **Aggiungere `alt` descrittivi** alle immagini avatar nel social proof — attualmente tutti `alt=""`

---

## 🚀 Pre-lancio — operazioni esterne

- [ ] **Configurare dominio `norino.it`** con hosting e DNS
- [ ] **Verificare HTTPS** su tutte le pagine con redirect automatico da HTTP
- [ ] **Caricare il sito sull'hosting** e testare che tutti i file (CSS, JS, immagini) si carichino
- [ ] **Test su dispositivi reali**: iPhone (Safari), Android (Chrome), tablet
- [ ] **Test velocità** con [PageSpeed Insights](https://pagespeed.web.dev/) (fare dopo aver inserito le immagini reali)
- [ ] **Test condivisione social** con [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (fare dopo aver caricato le og:image)
- [ ] **Registrare il sito in Google Search Console** e inviare la sitemap (`https://norino.it/sitemap.xml`)

---

## 📋 Riepilogo priorità

| Priorità | Cosa | Chi |
|---|---|---|
| 🔴 Alta | Immagini reali (hero, banner, before/after) | Riccardo |
| 🔴 Alta | og:image (3 file JPG 1200×630) | Riccardo |
| 🔴 Alta | URL social reali nel footer | Riccardo |
| 🔴 Alta | Indirizzo sede e P.IVA in privacy-policy e termini | Riccardo |
| 🟡 Media | Backend form consulenza (es. Formspree) | Copilot (dopo scelta) |
| 🟡 Media | `<link rel="canonical">` su tutte le pagine | Copilot |
| 🟡 Media | Structured data JSON-LD HairSalon | Copilot (dopo indirizzo/tel) |
| 🟢 Bassa | `alt` descrittivi avatar social proof | Copilot |
| 🟢 Bassa | Tag GTM dentro la dashboard GTM | Riccardo |
| 🟢 Bassa | Test PageSpeed, Search Console, Facebook Debugger | Riccardo (post-deploy) |
