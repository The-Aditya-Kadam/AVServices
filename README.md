# AVServices (AVS) website

Custom-developed by Aditya Kadam using HTML, CSS and JavaScript; no website template was used (developer confirmation). No build step. On Vercel: Framework = "Other", no build command.

## Pages
| Page | File | Accent colour |
|---|---|---|
| Home | `index.html` | blue |
| Solar | `solar.html` (with savings calculator) | amber |
| Insurance | `insurance.html` | indigo |
| Seafood import/export | `seafood.html` (with buyer enquiry form) | teal |
| Digital marketing | `digital-marketing.html` | violet |
| About | `about.html` | blue |
| Contact | `contact.html` | blue |

Shared files: `assets/style.css`, `assets/script.js`, `assets/img/` (photos), `site.webmanifest`.

## Branding
- **Main logo (header and footer):** option E, a bold italic "AVS", a small four-colour square and "SERVICES". It's built from text and a tiny SVG inside each page, so it stays sharp and loads instantly.
- **Favicon and app icon:** option B, the four service tiles: `assets/favicon.svg`, `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.
- **Share preview (WhatsApp, Facebook, LinkedIn):** `assets/og-image.png` (1200×630).
- **Service colours:** Solar amber `#F59E0B` · Insurance indigo `#6366F1` · Seafood teal `#14B8A6` · Digital violet `#8B5CF6`.
- `assets/logo.svg` is the old blue AVS tile. It's no longer used and can be deleted.
- **Share previews need the live web address** in every page's `og:image` tag. Send it when the domain is ready.

## Confirmed business information
- Shashikant Kadam, CEO; Mumbai; +91 97686 20556.
- Business email and WhatsApp Business activation are not confirmed. No placeholder destination is published.
- To change business details, update both static page content/JSON-LD and the `SITE` block in `assets/script.js`.
- Insurance authorisation, insurer relationships, service coverage and genuine project evidence still need owner confirmation. No credentials should be invented.

## Photos (`assets/img/`)
- All photos are WebP (much smaller than JPG). Banner photos also have a `-sm.webp` phone-size version.
- Photo sourcing: the owner confirms the photos were found through Google Images. Google Images is a discovery service, not a photo licence.
- Original photo sources and commercial-use permissions have not yet been documented. No Unsplash licensing claim is made for these files. Verify rights individually or replace with documented licensed or owner-created photos.
- To swap in your own photo, send it over and it will be converted to WebP with the same name.

## Forms and enquiry handling
The Contact and Seafood forms prepare an enquiry summary locally. They do not submit to a server, send a message, store contact details or establish a received lead. A separate copy action uses the clipboard when available; manual copying is supported when clipboard access fails. Call links use the confirmed phone number.

A future delivery endpoint, business email/WhatsApp setup, privacy decisions and explicit channel integration are needed before enabling online submission or lead-receipt analytics. See `docs/seo-framework.md`.

## Speed, SEO and caching
- No current Lighthouse or field Core Web Vitals score is claimed. Measure the deployed site before publishing performance results.
- `vercel.json` sets browser caching. CSS and JS links carry a `?v=` version, so updates show straight away.
- `robots.txt` references the current seven-page sitemap. Canonicals use https://avsinfo.in; Vercel redirects www to the apex host and .html URLs to clean URLs.

## Upload
Upload everything in this folder to GitHub, keeping the folders as they are:
- `index.html`, `solar.html`, `insurance.html`, `seafood.html`, `digital-marketing.html`, `about.html`, `contact.html`
- `assets/` (with `img/` inside), `site.webmanifest`, `vercel.json`, `robots.txt`, `README.md`
