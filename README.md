# The Honeycomb Bakery — Website Project

## Student Information
- Full Name: [Ndugelo Junior Mulaudzi]

## Project Overview
A five-page website built for The Honeycomb Bakery, a fictional family-run
artisan bakery, as the target organisation for this Portfolio of Evidence.
The site showcases the bakery's story, daily menu, and allows visitors to
enquire about custom celebration cakes.

## Website Goals and Objectives
- Establish an online presence to showcase the daily menu and specials.
- Enable custom cake and event order enquiries through a dedicated form.
- Build a base of returning customers and grow local visibility.
- KPIs: custom order form submissions, newsletter sign-ups, referral
  traffic from social media.

## Key Features and Functionality
- Homepage with hero section, daily specials, and a call to action.
- About Us page with the bakery's history, mission/vision, and team.
- Products page with a categorised menu (bread, pastries, celebration cakes).
- Enquiry page with a custom cake/event order form.
- Contact page with two locations (main store and weekend market kiosk),
  embedded maps, a contact form, and a photo gallery.

## Timeline and Milestones
- Weeks 1–4: Planning, research, and HTML structure (Part 1) ✅
- Weeks 5–8: CSS styling and responsive design (Part 2) ✅
- Weeks 9–12: JavaScript functionality, SEO, and final testing (Part 3) ✅

## Part 1 Details
Part 1 delivered the HTML structure and basic content only:
- Five HTML pages (`index.html`, `about.html`, `products.html`,
  `enquiry.html`, `contact.html`), each using semantic tags
  (`header`, `nav`, `main`, `footer`, `section`).
- A consistent navigation menu linking all five pages.
- Placeholder images stored in `/images`.

## Part 2 Details — CSS Styling and Responsive Design
Part 2 adds a single external stylesheet (`css/style.css`), linked from
all five pages, covering:

- **Base styles & design tokens**: a CSS reset, and CSS custom properties
  (`:root` variables) for colour, type scale, and spacing, so the rest of
  the stylesheet only needs a small number of selectors (per the brief's
  "cascading nature of CSS" requirement).
- **Colour scheme**: cream (`#FBF3E1`), deep brown (`#3B2A1A`), mid brown
  (`#7A4A21`), and honey gold (`#C98A2B` / `#E8B33D`) — matching the logo.
- **Typography**: a serif heading family (Georgia) paired with a
  system sans-serif body family, using a defined rem-based type scale.
- **Layout**: Flexbox is used throughout (header, nav, hero, specials,
  the About page's story/mission/team sections, product grids, the
  contact gallery, and forms) to structure content for the desktop view.
- **Visual styling**: `background-color`, `border`, `border-radius`, and
  `box-shadow` are used on cards, images, and CTA bands; interactive
  states are styled with `:hover`, `:focus`, and `:active` on nav links,
  buttons, form fields, and the team photos.
- **Responsive design**: two breakpoints (900px and 600px) reflow the
  multi-column sections down to two columns, then one, and the header/nav
  restack vertically on mobile. Font sizes and spacing use `rem` units
  throughout (with the base `html` font-size reduced slightly at the
  mobile breakpoint, scaling every `rem` value with it), and images use
  `%`/`max-width: 100%` for fluid sizing.
- **Responsive images**: the homepage hero image uses a `<picture>`
  element with `<source>` breakpoints plus `srcset`/`sizes` on the
  fallback `<img>`; the About page's team photo uses `srcset`/`sizes`
  directly. Three resolutions of each (400w/800w/1200w for the hero,
  400w/800w for the team photo) are included in `/images`.

### Testing Evidence
Screenshots of each page at laptop (1024px), tablet (768px), and mobile
(425px and 320px) widths are included in `/screenshots`, confirming the layout
reflows correctly at each breakpoint. These were captured with a
Chromium-based headless browser.

Note: the two embedded Google Maps iframes on `contact.html` did not load
in the sandboxed environment used to generate these screenshots (no
outbound access to maps.google.com), so the map area appears blank in
the Contact screenshots. This is an environment restriction only — the maps load
normally in a regular browser with internet access, which is how the
site will actually be viewed.

## Part 3 Details — Enhancing Functionality and SEO
Part 3 adds `js/main.js` (linked with `defer` on all five pages), SEO
improvements on every page, working forms, and deployment files.

### JavaScript functionality (`js/main.js`)
- **Interactive elements**
  - Accordion FAQ on `enquiry.html` (keyboard accessible, `aria-expanded`).
  - Product details modal on `products.html` (native `<dialog>`).
  - Mobile menu toggle button (appears at 600px and below).
  - Scroll-reveal fade-in animation on page sections (disabled for users who
    prefer reduced motion), plus hover/transition effects on cards and buttons.
- **Interactive maps**: `contact.html` uses Leaflet with OpenStreetMap tiles to
  show both locations (main store and weekend kiosk) with markers, popups and a
  "Get directions" link. Map coordinates are approximate and should be confirmed.
- **Gallery lightbox**: the contact page gallery opens in a lightbox with
  previous/next buttons, arrow-key navigation, Esc to close, captions and a
  counter. Images are responsive and have alt text.
- **Dynamic content and search**: the product menu is generated from a
  JavaScript data array. Visitors can search by keyword, filter by category
  and sort by price or name, with a live results count and a "no results" message.

### Forms
- **Enquiry form (`enquiry.html`)**: text, email, tel, select, date, number,
  textarea, checkbox and radio controls with labels. JavaScript validation covers
  name format, email format, South African phone numbers, future event dates,
  guest numbers and message length, with inline error messages, `aria-invalid`
  and immediate feedback on blur/input. On submit the data is sent via
  `fetch` (AJAX) when `ENQUIRY_ENDPOINT` is set, and the page shows a
  response with an **estimated cost** (based on event type, guests and dietary
  options) and an **availability check** (lead time and Monday closure).
- **Contact form (`contact.html`)**: name, email, optional phone, message type
  and message, validated the same way. The valid input is compiled into an
  email preview and a **Send email** button opens it in the visitor's email
  app addressed to the recipient set in `CONTACT_RECIPIENT` in `js/main.js`.

### SEO
- Unique, keyword-rich `<title>` and `<meta name="description">` on every page.
- `<meta name="keywords">`, canonical links and Open Graph tags on every page.
- One `<h1>` per page with a logical H2/H3 hierarchy.
- Descriptive image file names and alt text (the three gallery images were
  renamed to `gallery-fresh-loaves.jpg`, `gallery-celebration-cake.jpg`,
  `gallery-pastry-display.jpg`).
- Clean URLs, internal links between pages (for example the custom cake link
  on the Products page), and `aria-current` on the active menu link.
- Local SEO: `Bakery` structured data (JSON-LD) with address, phone, hours and
  social profiles on the home page.
- Off-page: social media profile links in the footer of every page.
- `robots.txt` and `sitemap.xml` in the site root.
- Mobile friendliness: viewport tag, responsive layout from Part 2.

### Performance and security
- Scripts loaded with `defer`; below-the-fold images use `loading="lazy"`;
  the hero image uses `fetchpriority="high"`; all images keep width/height to
  prevent layout shift. Cache headers are set in `_headers`.
- External links use `rel="noopener noreferrer"`; Leaflet is loaded with
  Subresource Integrity hashes; user input is escaped before being written to
  the page; `_headers` sets a Content-Security-Policy, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy and HSTS (applied by Netlify).

### Deployment
The site is deployed on Netlify (drag-and-drop the project folder, or connect
the GitHub repository). Live URL: [ADD YOUR NETLIFY URL HERE]
Remember to update the URL in `sitemap.xml`, `robots.txt`, canonical links and
structured data once the final address is known.

## Sitemap
```
Home (index.html)
├── About Us (about.html)
├── Products (products.html)
├── Custom Orders (enquiry.html)
└── Contact (contact.html)
```

## File and Folder Structure
```
honeycomb-bakery/
├── index.html
├── about.html
├── products.html
├── enquiry.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── _headers
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
├── screenshots/
│   ├── Home Laptop 1024px.jpeg / Home Tablet 768px.jpeg
│   │   / Home mobile L 425px.jpeg / Home mobile S 320px.jpeg
│   ├── About Laptop 1024px.jpeg / About Tablet 768px.jpeg
│   │   / About mobile L 425px.jpeg / About mobile S 320px.jpeg
│   ├── Product Laptop 1024px.jpeg / Product Tablet 768px.jpeg
│   │   / Product mobile L 425px.jpeg / Product mobile S 320px.jpeg
│   ├── Enquiry   Laptop 1024px.jpeg / Enquiry  Tablet 768px.jpeg
│   │   / Enquiry mobile L 425px.jpeg / Enquiry mobile S 320px.jpeg
│   └── Contact  Laptop 1024px.jpeg / Contact Tablet 768px.jpeg
│       / Contact mobile L 425px.jpeg / Contact mobile S 320px.jpeg
└── images/
    ├── logo-icon.svg
    ├── hero-bakery.jpg 
    ├── about-team.jpg
    ├── product-bread.jpg, product-pastries.jpg, product-cakes.jpg
    ├── product-sourdough.jpg, product-wholewheat.jpg, product-ciabatta.jpg
    ├── product-croissant.jpg, product-cinnamonbun.jpg, product-fruittart.jpg
    ├── product-vanillacake.jpg, product-chocolatecake.jpg, product-customcake.jpg
    ├── team-naledi.jpg, team-sipho.jpg, team-amahle.jpg
    └── gallery-fresh-loaves.jpg, gallery-celebration-cake.jpg, gallery-pastry-display.jpg
```

## Changelog
- [05 August 2026]: Part 1 — created five-page HTML structure, navigation, and
  placeholder content/images.
- [06 August 2026]: Replaced the footer's duplicate page-navigation menu with
  functional Facebook, Instagram, and Twitter links (inline SVG icons)
  on all five pages.
- [08 August 2026]: Added a custom vector logo (honeycomb badge with wheat sheaf
  and bee accent) — full wordmark version and a compact icon version
  used in the site header.
- [10 August 2026]: Added an individual product photo for each menu item on
  `products.html`, in addition to each category's overview photo.
- [10 August 2026]: Added an individual photo for each team member on
  `about.html`, alongside the existing group team photo.
- [14 September 2026]: Part 2 — created `css/style.css` and linked it
  from all five pages. Added the full design system (colour tokens, type
  scale, spacing scale), Flexbox-based layout for every section, visual
  styling (borders, shadows, alternating section backgrounds), and
  `:hover`/`:focus`/`:active` states on interactive elements.
- [14 September 2026]: Added responsive design — two breakpoints (900px,
  600px), rem-based type scale, and fluid image sizing.
- [14 September 2026]: Added `<picture>`/`srcset` for the hero image and
  `srcset`/`sizes` for the About page team photo, with multiple image
  resolutions generated for each.
- [14 September 2026]: Added `/screenshots` with desktop/tablet/mobile
  evidence for every page, per the Part 2 testing requirement.
- [14 September 2026]: Wrapped the About page's story image/text and
  mission/vision content in small container `<div>`s so the new Flexbox
  layout could pair each heading with its correct content (a required
  structural fix, not a content change).

- [28 October 2026]: Part 3 — PART 2 FEEDBACK CORRECTIONS (add or adjust entries here to match your lecturer's actual feedback):
  - Fixed the broken logo on `index.html` (it pointed to `logo-icon.png`; now `logo-icon.svg`, matching the other pages).
  - Replaced the Google Maps iframes on `contact.html` with interactive Leaflet maps; removed the inline `style` attributes.
  - Restored a visible keyboard focus outline (`:focus-visible`) on links, buttons and form fields, which Part 2 had removed on inputs.
  - Added a skip-to-content link, `id="main"` on `<main>` and `aria-current="page"` on the active menu link.
  - Added a collapsible mobile menu button so the stacked nav no longer takes up the whole small screen.
- [28 October 2026]: Created `js/main.js` and linked it (deferred) on all five pages.
- [28 October 2026]: Added interactive elements: FAQ accordion (enquiry page), product details modal, mobile menu toggle, scroll-reveal animation and hover transitions, with `prefers-reduced-motion` support.
- [28 October 2026]: Added interactive Leaflet/OpenStreetMap maps for both locations on `contact.html`.
- [28 October 2026]: Added gallery lightbox on `contact.html`; renamed gallery images to descriptive file names and wrapped them in a responsive list.
- [28 October 2026]: Rebuilt the Products page to load items dynamically from JavaScript, with search, category filter and sort.
- [28 October 2026]: SEO — rewrote title tags and meta descriptions, added meta keywords, canonical and Open Graph tags, Bakery JSON-LD, lazy-loading images, `robots.txt` and `sitemap.xml`.
- [28 October 2026]: Enquiry form — added required select placeholder, checkboxes, radio buttons, error message containers, JavaScript validation and a response showing estimated cost and availability (AJAX-ready).
- [28 October 2026]: Contact form — added phone and message-type fields, JavaScript validation and email compilation with a Send email (mailto) button.
- [28 October 2026]: Security and performance — added `_headers` (CSP and security headers, caching), Subresource Integrity on Leaflet.
- [28 October 2026]: Added CSS for new components (accordion, modal, lightbox, maps, form errors/results, search controls) in a clearly marked "Part 3 additions" section of `css/style.css`.

## Author
- [Ndugelo Junior Mulaudzi]

## References
- Unsplash (n.d.) Free stock photos. Available at: https://unsplash.com (Accessed: 9 August 2026).
- Pexels (n.d.) Free stock photos and videos. Available at: https://pexels.com (Accessed: 9 August 2026).
- Google Fonts (n.d.) Available at: https://fonts.google.com (Accessed: 9 August 2026).
- MDN Web Docs (n.d.) HTML elements reference. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element (Accessed: 9 August 2026).
- MDN Web Docs (n.d.) CSS Flexible Box Layout. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout (Accessed: 14 September 2026).
- MDN Web Docs (n.d.) Responsive images. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images (Accessed: 14 September 2026).
- MDN Web Docs (n.d.) Using CSS custom properties (variables). Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties (Accessed: 14 September 2026).
- Leaflet (n.d.) Leaflet — an open-source JavaScript library for interactive maps. Available at: https://leafletjs.com (Accessed: 28 October 2026).
- OpenStreetMap contributors (n.d.) OpenStreetMap. Available at: https://www.openstreetmap.org (Accessed: 28 October 2026).
- MDN Web Docs (n.d.) The dialog element. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog (Accessed: 28 October 2026).
- MDN Web Docs (n.d.) Client-side form validation. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: 28 October 2026).
- Google Search Central (n.d.) SEO starter guide. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 28 October 2026).
- Schema.org (n.d.) Bakery. Available at: https://schema.org/Bakery (Accessed: 28 October 2026).
- Netlify (n.d.) Custom headers. Available at: https://docs.netlify.com/manage/routing/headers/ (Accessed: 28 October 2026).