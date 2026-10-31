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

## Add your real details
1. **Phone, WhatsApp, email, address:** edit the `SITE` block at the top of `assets/script.js`. Every page updates from there.
2. **Insurance licence:** search for `[authorised agent / POSP` in `insurance.html` and in the footer of every page, and replace it with the real registration details.
3. **About page story:** search for `Add your own story here` in `about.html`.

Yellow-highlighted text on the site marks a placeholder.

## Photos (`assets/img/`)
- All photos are WebP (much smaller than JPG). Banner photos also have a `-sm.webp` phone-size version.
- Photo sourcing: the owner confirms the photos were found through Google Images. Google Images is a discovery service, not a photo licence.
- Original photo sources and commercial-use permissions have not yet been documented. No Unsplash licensing claim is made for these files. Verify rights individually or replace with documented licensed or owner-created photos.
- To swap in your own photo, send it over and it will be converted to WebP with the same name.

## Forms
Forms open WhatsApp or the email app with the message filled in. No server or form service is needed.

## Speed, SEO and caching
- Lighthouse (mobile, local test): Accessibility 100, Best Practices 100, SEO 100 on every page; Performance 87–94 before Vercel's compression.
- `vercel.json` sets browser caching. CSS and JS links carry a `?v=` version, so updates show straight away.
- `robots.txt` allows all search engines. Add a `sitemap.xml` once the domain is known.

## Upload
Upload everything in this folder to GitHub, keeping the folders as they are:
- `index.html`, `solar.html`, `insurance.html`, `seafood.html`, `digital-marketing.html`, `about.html`, `contact.html`
- `assets/` (with `img/` inside), `site.webmanifest`, `vercel.json`, `robots.txt`, `README.md`
