/* ==========================================================================
   THE HONEYCOMB BAKERY — main.js (Part 3)
   Sections:
   1. Helpers
   2. Mobile navigation toggle
   3. Scroll-reveal animation
   4. Accordion (FAQ)
   5. Dynamic product menu + search / filter / sort + details modal
   6. Gallery lightbox
   7. Interactive maps (Leaflet + OpenStreetMap)
   8. Form validation (shared)
   9. Enquiry form: processing + quote/availability response
   10. Contact form: compile email
   ========================================================================== */
(function () {
    'use strict';

    /* ---------- 1. HELPERS ---------- */
    document.documentElement.classList.add('js');

    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
    var escapeHTML = function (s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 2. MOBILE NAVIGATION TOGGLE ---------- */
    function initNav() {
        var nav = $('body > nav');
        if (!nav) return;
        var list = $('ul', nav);
        list.id = 'main-menu';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-toggle';
        btn.textContent = 'Menu';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'main-menu');
        nav.insertBefore(btn, list);
        btn.addEventListener('click', function () {
            var open = list.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(open));
            btn.textContent = open ? 'Close' : 'Menu';
        });
    }

    /* ---------- 3. SCROLL-REVEAL ANIMATION ---------- */
    function initReveal() {
        var targets = $$('main > section, main > h2');
        if (reduceMotion || !('IntersectionObserver' in window)) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        targets.forEach(function (t) { t.classList.add('reveal'); io.observe(t); });
    }

    /* ---------- 4. ACCORDION ---------- */
    function initAccordion() {
        $$('.accordion').forEach(function (acc) {
            var triggers = $$('.accordion-trigger', acc);
            function setState(btn, open) {
                btn.setAttribute('aria-expanded', String(open));
                document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
            }
            triggers.forEach(function (btn) {
                setState(btn, false);
                btn.addEventListener('click', function () {
                    var wasOpen = btn.getAttribute('aria-expanded') === 'true';
                    triggers.forEach(function (b) { setState(b, false); });
                    if (!wasOpen) setState(btn, true);
                });
            });
        });
    }

    /* ---------- 5. DYNAMIC PRODUCT MENU ---------- */
    var CATEGORIES = {
        bread: { title: 'Bread', img: 'product-bread.jpg', alt: 'Freshly baked sourdough and farmhouse loaves' },
        pastries: { title: 'Pastries', img: 'product-pastries.jpg', alt: 'Assorted pastries including croissants and cinnamon buns' },
        cakes: { title: 'Celebration Cakes', img: 'product-cakes.jpg', alt: 'Decorated celebration and wedding cakes' }
    };

    var PRODUCTS = [
        { id: 'sourdough', cat: 'bread', name: 'Sourdough Farmhouse Loaf', price: 45, img: 'product-sourdough.jpg', alt: 'Sourdough farmhouse loaf', desc: 'Naturally leavened, crusty on the outside and soft inside.', allergens: 'Gluten (wheat)' },
        { id: 'wholewheat', cat: 'bread', name: 'Whole Wheat Loaf', price: 38, img: 'product-wholewheat.jpg', alt: 'Whole wheat loaf', desc: 'A hearty everyday loaf made with stone-ground whole wheat flour.', allergens: 'Gluten (wheat)' },
        { id: 'ciabatta', cat: 'bread', name: 'Ciabatta', price: 32, img: 'product-ciabatta.jpg', alt: 'Ciabatta loaf', desc: 'Light and airy Italian-style bread, perfect for sandwiches.', allergens: 'Gluten (wheat)' },
        { id: 'croissant', cat: 'pastries', name: 'Butter Croissant', price: 28, img: 'product-croissant.jpg', alt: 'Butter croissant', desc: 'Flaky, buttery layers baked golden brown every morning.', allergens: 'Gluten, milk, egg' },
        { id: 'cinnamonbun', cat: 'pastries', name: 'Cinnamon Honey Bun', price: 32, img: 'product-cinnamonbun.jpg', alt: 'Cinnamon honey bun', desc: 'Soft dough rolled with cinnamon and finished with a honey glaze.', allergens: 'Gluten, milk, egg' },
        { id: 'fruittart', cat: 'pastries', name: 'Seasonal Fruit Tart', price: 40, img: 'product-fruittart.jpg', alt: 'Seasonal fruit tart', desc: 'Buttery pastry shell filled with custard and fresh seasonal fruit.', allergens: 'Gluten, milk, egg' },
        { id: 'vanillacake', cat: 'cakes', name: 'Classic Vanilla Celebration Cake', price: 450, from: true, img: 'product-vanillacake.jpg', alt: 'Classic vanilla celebration cake', desc: 'Layered vanilla sponge with buttercream, customisable for any occasion.', allergens: 'Gluten, milk, egg' },
        { id: 'chocolatecake', cat: 'cakes', name: 'Chocolate Fudge Cake', price: 480, from: true, img: 'product-chocolatecake.jpg', alt: 'Chocolate fudge cake', desc: 'Rich chocolate sponge with a decadent fudge filling.', allergens: 'Gluten, milk, egg; may contain nuts' },
        { id: 'customcake', cat: 'cakes', name: 'Custom Wedding & Event Cakes', price: null, img: 'product-customcake.jpg', alt: 'Custom wedding and event cake', desc: 'Fully custom design, flavour and tiering for weddings and special events.', allergens: 'Varies \u2014 tell us about any allergies when you enquire', link: true }
    ];

    function priceLabel(p) {
        if (p.price === null) return 'price on request';
        return (p.from ? 'from ' : '') + 'R' + p.price;
    }

    function productCard(p) {
        return '<li class="product-card">' +
            '<img src="images/' + p.img + '" alt="' + escapeHTML(p.alt) + '" width="350" height="280" loading="lazy">' +
            '<h4>' + escapeHTML(p.name) + ' &mdash; ' + priceLabel(p) + '</h4>' +
            '<p>' + escapeHTML(p.desc) +
            (p.link ? ' <a href="enquiry.html">Enquire about a custom cake</a>.' : '') + '</p>' +
            '<button type="button" class="btn-small" data-product="' + p.id + '">View details</button>' +
            '</li>';
    }

    function initProducts() {
        var results = $('#product-results');
        if (!results) return;
        var search = $('#product-search'), cat = $('#product-category'), sort = $('#product-sort');
        var count = $('#product-count'), form = $('#product-controls');

        function render() {
            var q = search.value.trim().toLowerCase();
            var list = PRODUCTS.filter(function (p) {
                var inCat = cat.value === 'all' || p.cat === cat.value;
                var hay = (p.name + ' ' + p.desc + ' ' + CATEGORIES[p.cat].title).toLowerCase();
                return inCat && (!q || hay.indexOf(q) !== -1);
            });
            if (sort.value === 'price-asc' || sort.value === 'price-desc') {
                var dir = sort.value === 'price-asc' ? 1 : -1;
                list.sort(function (a, b) {
                    if (a.price === null) return 1;
                    if (b.price === null) return -1;
                    return (a.price - b.price) * dir;
                });
            } else if (sort.value === 'name') {
                list.sort(function (a, b) { return a.name.localeCompare(b.name); });
            }

            var html = '';
            if (sort.value === 'default') {
                Object.keys(CATEGORIES).forEach(function (key) {
                    var items = list.filter(function (p) { return p.cat === key; });
                    if (!items.length) return;
                    var c = CATEGORIES[key];
                    html += '<section id="' + key + '"><h3>' + c.title + '</h3>' +
                        '<img src="images/' + c.img + '" alt="' + escapeHTML(c.alt) + '" width="500" height="400" loading="lazy">' +
                        '<ul>' + items.map(productCard).join('') + '</ul></section>';
                });
            } else if (list.length) {
                // sorted views are shown as one combined list
                html = '<section id="bread"><h3>Sorted results</h3><ul>' + list.map(productCard).join('') + '</ul></section>';
            }
            results.innerHTML = html || '<p class="no-results">No items match your search. Try a different word or clear the filters.</p>';
            count.textContent = list.length + (list.length === 1 ? ' item' : ' items') + ' shown';
        }

        form.addEventListener('submit', function (e) { e.preventDefault(); });
        search.addEventListener('input', render);
        cat.addEventListener('change', render);
        sort.addEventListener('change', render);

        /* Details modal (native <dialog>) */
        var dlg = document.createElement('dialog');
        dlg.className = 'modal';
        dlg.setAttribute('aria-labelledby', 'modal-title');
        document.body.appendChild(dlg);
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

        results.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-product]');
            if (!btn) return;
            var p = PRODUCTS.filter(function (x) { return x.id === btn.dataset.product; })[0];
            dlg.innerHTML = '<button type="button" class="dialog-close" aria-label="Close details">&times;</button>' +
                '<img src="images/' + p.img + '" alt="' + escapeHTML(p.alt) + '" width="350" height="280">' +
                '<h3 id="modal-title">' + escapeHTML(p.name) + '</h3>' +
                '<p><strong>' + priceLabel(p) + '</strong></p>' +
                '<p>' + escapeHTML(p.desc) + '</p>' +
                '<p><strong>Allergens:</strong> ' + escapeHTML(p.allergens) + '</p>' +
                '<p>Available fresh daily in store. ' + (p.cat === 'cakes' ? '<a href="enquiry.html">Place a custom order enquiry</a>.' : 'Ask us about gluten-free and vegan options.') + '</p>';
            $('.dialog-close', dlg).addEventListener('click', function () { dlg.close(); });
            dlg.showModal();
        });

        render();
    }

    /* ---------- 6. GALLERY LIGHTBOX ---------- */
    function initLightbox() {
        var links = $$('a[data-lightbox]');
        if (!links.length) return;
        var index = 0;
        var dlg = document.createElement('dialog');
        dlg.className = 'modal lightbox';
        dlg.setAttribute('aria-label', 'Image viewer');
        dlg.innerHTML =
            '<button type="button" class="dialog-close" aria-label="Close image viewer">&times;</button>' +
            '<img src="" alt="">' +
            '<p class="lightbox-caption" aria-live="polite"></p>' +
            '<div class="lightbox-nav">' +
            '<button type="button" class="btn-small" data-dir="-1">&larr; Previous</button>' +
            '<span class="lightbox-count"></span>' +
            '<button type="button" class="btn-small" data-dir="1">Next &rarr;</button></div>';
        document.body.appendChild(dlg);
        var img = $('img', dlg), cap = $('.lightbox-caption', dlg), cnt = $('.lightbox-count', dlg);

        function show(i) {
            index = (i + links.length) % links.length;
            var a = links[index], thumb = $('img', a);
            img.src = a.getAttribute('href');
            img.alt = thumb ? thumb.alt : '';
            cap.textContent = a.dataset.caption || img.alt;
            cnt.textContent = (index + 1) + ' / ' + links.length;
        }
        links.forEach(function (a, i) {
            a.addEventListener('click', function (e) { e.preventDefault(); show(i); dlg.showModal(); });
        });
        dlg.addEventListener('click', function (e) {
            if (e.target === dlg) dlg.close();
            var d = e.target.closest('[data-dir]');
            if (d) show(index + Number(d.dataset.dir));
        });
        $('.dialog-close', dlg).addEventListener('click', function () { dlg.close(); });
        dlg.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') show(index + 1);
            if (e.key === 'ArrowLeft') show(index - 1);
        });
    }

    /* ---------- 7. INTERACTIVE MAPS (Leaflet) ---------- */
    // NOTE: coordinates are approximate placeholders - replace with the real store locations.
    var SITES = [
        { el: 'map-main', lat: -26.1180, lng: 27.9990, name: 'The Honeycomb Bakery \u2014 Main Store', addr: '123 Main Road, Rosewood' },
        { el: 'map-kiosk', lat: -26.0890, lng: 28.0310, name: 'Weekend Kiosk \u2014 Riverside Farmers Market', addr: '4 Market Lane, Riverside' }
    ];

    function initMaps() {
        if (!$('#map-main')) return;
        SITES.forEach(function (s) {
            var el = document.getElementById(s.el);
            if (!window.L) { el.innerHTML = '<p class="map-fallback">The map could not be loaded. Please check your connection.</p>'; return; }
            var map = L.map(el, { scrollWheelZoom: false }).setView([s.lat, s.lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            L.marker([s.lat, s.lng]).addTo(map).bindPopup(
                '<strong>' + s.name + '</strong><br>' + s.addr + '<br>' +
                '<a href="https://www.google.com/maps/dir/?api=1&destination=' + s.lat + ',' + s.lng + '" target="_blank" rel="noopener noreferrer">Get directions</a>'
            ).openPopup();
            // allow scroll-zoom only after the visitor clicks the map (avoids scroll-trapping)
            map.on('click', function () { map.scrollWheelZoom.enable(); });
            map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
        });
    }

    /* ---------- 8. FORM VALIDATION (shared) ---------- */
    var validators = {
        name: function (v) { return /^[A-Za-z\u00C0-\u024F' -]{2,60}$/.test(v) ? '' : 'Enter your full name (letters only, 2\u201360 characters).'; },
        email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address, e.g. name@example.com.'; },
        phone: function (v) {
            var digits = v.replace(/[\s()-]/g, '');
            return /^(\+27|0)[1-9]\d{8}$/.test(digits) ? '' : 'Enter a valid South African number, e.g. 011 555 0192 or +27 11 555 0192.';
        },
        date: function (v) {
            var d = parseDate(v), t = today();
            if (!d) return 'Enter a valid date.';
            if (d <= t) return 'Please choose a date in the future.';
            var max = new Date(t); max.setFullYear(max.getFullYear() + 2);
            return d > max ? 'Please choose a date within the next two years.' : '';
        },
        guests: function (v) { return /^\d+$/.test(v) && +v >= 1 && +v <= 1000 ? '' : 'Enter a whole number between 1 and 1000.'; },
        message: function (v) {
            if (v.length < 10) return 'Please write at least 10 characters so we can help you.';
            return v.length > 1000 ? 'Please keep your message under 1000 characters.' : '';
        }
    };

    function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
    function parseDate(v) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
        if (!m) return null;
        var d = new Date(+m[1], +m[2] - 1, +m[3]);
        return d.getMonth() === +m[2] - 1 ? d : null;
    }

    function fieldError(input) {
        var v = input.value.trim();
        if (!v) return input.required ? (input.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.') : '';
        var rule = validators[input.dataset.validate];
        return rule ? rule(v) : '';
    }

    function showError(input, msg) {
        var out = document.getElementById(input.id + '-error');
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        input.classList.toggle('invalid', !!msg);
        if (out) out.textContent = msg;
    }

    function validateForm(form) {
        var firstBad = null;
        $$('input[data-validate], select[required], textarea[data-validate]', form).forEach(function (inp) {
            var msg = fieldError(inp);
            showError(inp, msg);
            if (msg && !firstBad) firstBad = inp;
        });
        if (firstBad) firstBad.focus();
        return !firstBad;
    }

    function liveValidate(form) {
        $$('input[data-validate], select[required], textarea[data-validate]', form).forEach(function (inp) {
            inp.addEventListener('blur', function () { showError(inp, fieldError(inp)); });
            inp.addEventListener('input', function () { if (inp.classList.contains('invalid')) showError(inp, fieldError(inp)); });
        });
    }

    /* ---------- 9. ENQUIRY FORM ---------- */
    // Set to a real endpoint (e.g. a Formspree URL) to POST enquiries via AJAX.
    var ENQUIRY_ENDPOINT = '';

    var PRICING = {
        birthday: { base: 450, perGuest: 25, lead: 5, label: 'Birthday' },
        wedding: { base: 1800, perGuest: 45, lead: 30, label: 'Wedding' },
        corporate: { base: 900, perGuest: 35, lead: 10, label: 'Corporate event' },
        other: { base: 600, perGuest: 30, lead: 7, label: 'Event' }
    };
    var DIETARY_FEE = 50;

    function buildResponse(data) {
        var p = PRICING[data.type];
        var guests = data.guests || 10;
        var total = p.base + Math.max(0, guests - 10) * p.perGuest + (data.dietary.length ? DIETARY_FEE : 0);
        var date = parseDate(data.date);
        var days = Math.round((date - today()) / 86400000);
        var dateText = date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        var notes = [], ok = true;

        if (days < p.lead) {
            ok = false;
            notes.push('Your date is only ' + days + ' day' + (days === 1 ? '' : 's') + ' away and we usually need ' + p.lead + ' days for ' + p.label.toLowerCase() + ' orders. We may still be able to help \u2014 we will confirm when we reply.');
        } else {
            notes.push('Good news \u2014 ' + dateText + ' gives us enough lead time, so it is provisionally available.');
        }
        if (date.getDay() === 1) {
            notes.push('We are closed on Mondays, so collection would be arranged for the Sunday before or the Tuesday after.');
        }
        if (data.dietary.length) {
            notes.push('Dietary adaptations requested (' + data.dietary.join(', ') + ') are included at +R' + DIETARY_FEE + '.');
        }
        return { total: total, ok: ok, notes: notes, guests: guests, label: p.label };
    }

    function postJSON(payload) {
        if (!ENQUIRY_ENDPOINT) return Promise.resolve({ local: true });
        return fetch(ENQUIRY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (r) { if (!r.ok) throw new Error('Request failed'); return r; });
    }

    function initEnquiry() {
        var form = $('#enquiry-form form');
        if (!form) return;
        var out = $('#enquiry-result');
        var dateInput = $('#event-date');
        var t = today(); t.setDate(t.getDate() + 1);
        dateInput.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
        liveValidate(form);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            out.className = 'form-result';
            out.innerHTML = '';
            if (!validateForm(form)) {
                out.className = 'form-result error-box';
                out.textContent = 'Please correct the highlighted fields and try again.';
                return;
            }
            var data = {
                name: $('#full-name').value.trim(),
                email: $('#email').value.trim(),
                phone: $('#phone').value.trim(),
                type: $('#event-type').value,
                date: $('#event-date').value,
                guests: parseInt($('#guests').value, 10) || 0,
                dietary: $$('input[name="dietary"]:checked', form).map(function (c) { return c.value; }),
                fulfilment: ($('input[name="fulfilment"]:checked', form) || {}).value || 'collect',
                message: $('#message').value.trim()
            };
            var btn = $('button[type="submit"]', form);
            btn.disabled = true; btn.textContent = 'Sending\u2026';

            postJSON(data).then(function () {
                var r = buildResponse(data);
                out.className = 'form-result ' + (r.ok ? 'ok' : 'warn');
                out.innerHTML =
                    '<h3>Thank you, ' + escapeHTML(data.name.split(' ')[0]) + '!</h3>' +
                    '<p>We have received your ' + r.label.toLowerCase() + ' enquiry for about <strong>' + r.guests + ' guests</strong>.</p>' +
                    '<p class="estimate">Estimated cost: <strong>from R' + r.total.toLocaleString('en-ZA') + '</strong></p>' +
                    '<ul>' + r.notes.map(function (n) { return '<li>' + escapeHTML(n) + '</li>'; }).join('') + '</ul>' +
                    '<p>This is an estimate only. Our team will email <strong>' + escapeHTML(data.email) + '</strong> within two working days with a final quote and design options.</p>';
                form.reset();
                $$('.invalid', form).forEach(function (i) { showError(i, ''); });
                out.setAttribute('tabindex', '-1'); out.focus();
            }).catch(function () {
                out.className = 'form-result error-box';
                out.textContent = 'Sorry, something went wrong sending your enquiry. Please try again or call (011) 555-0192.';
            }).then(function () {
                btn.disabled = false; btn.textContent = 'Send Enquiry';
            });
        });
    }

    /* ---------- 10. CONTACT FORM ---------- */
    var CONTACT_RECIPIENT = 'hello@honeycombbakery.co.za'; // recipient of the compiled email

    function initContact() {
        var form = $('#contact-form form');
        if (!form) return;
        var out = $('#contact-result');
        liveValidate(form);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            out.className = 'form-result'; out.innerHTML = '';
            if (!validateForm(form)) {
                out.className = 'form-result error-box';
                out.textContent = 'Please correct the highlighted fields and try again.';
                return;
            }
            var name = $('#contact-name').value.trim();
            var type = $('#contact-type').value;
            var phone = $('#contact-phone').value.trim();
            var subject = '[' + type + '] Website message from ' + name;
            var body = 'Message type: ' + type + '\n' +
                'Name: ' + name + '\n' +
                'Email: ' + $('#contact-email').value.trim() + '\n' +
                'Phone: ' + (phone || 'not provided') + '\n\n' +
                $('#contact-message').value.trim();
            var href = 'mailto:' + CONTACT_RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

            out.className = 'form-result ok';
            out.innerHTML =
                '<h3>Your email is ready</h3>' +
                '<p>Check the details below, then press <strong>Send email</strong> to open it in your email app, addressed to <strong>' + escapeHTML(CONTACT_RECIPIENT) + '</strong>.</p>' +
                '<pre class="email-preview">Subject: ' + escapeHTML(subject) + '\n\n' + escapeHTML(body) + '</pre>' +
                '<a class="btn" href="' + escapeHTML(href) + '">Send email</a>';
            out.setAttribute('tabindex', '-1'); out.focus();
        });
    }

    /* ---------- INIT ---------- */
    function init() {
        initNav(); initReveal(); initAccordion();
        initProducts(); initLightbox(); initMaps();
        initEnquiry(); initContact();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();