/* AVServices – shared script
   ---------------------------------------------------------------
   EDIT YOUR DETAILS HERE. Every page reads these values, so you
   only change them in one place.
   - whatsapp: country code + number, digits only (e.g. 919876543210)
   - Leave whatsapp empty ('') until you have the number.
   --------------------------------------------------------------- */
const SITE = {
  name: 'AVServices',
  phone: '+91 XXXXX XXXXX',        // shown on the site
  phoneLink: '',                   // digits for tel: link, e.g. +919876543210
  whatsapp: '',                    // digits only, e.g. 919876543210
  email: 'your-email@example.com',
  address: 'Office address to be added'
};

document.documentElement.classList.remove('no-js');

/* Fill contact details everywhere */
document.querySelectorAll('[data-site]').forEach(el => {
  const key = el.dataset.site;
  if (key === 'phone') {
    el.textContent = SITE.phone;
    if (el.tagName === 'A') el.href = SITE.phoneLink ? 'tel:' + SITE.phoneLink : '#contact';
  } else if (key === 'email') {
    el.textContent = SITE.email;
    if (el.tagName === 'A') el.href = 'mailto:' + SITE.email;
  } else if (key === 'address') {
    el.textContent = SITE.address;
  }
});
document.querySelectorAll('[data-wa]').forEach(el => {
  const text = el.dataset.wa || 'Hello AVServices, I would like to know more.';
  el.href = SITE.whatsapp
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
    : 'contact.html';
});

/* Year in footer */
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* Mobile menu */
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* Reveal on scroll */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    io.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* Enquiry forms: open WhatsApp or email with the message filled in.
   No server needed. */
document.querySelectorAll('form[data-enquiry]').forEach(form => {
  const msg = form.querySelector('.form-msg');
  const say = t => { if (msg) msg.textContent = t; };

  // Preselect service from ?service=solar etc.
  const svc = new URLSearchParams(location.search).get('service');
  const sel = form.querySelector('select[name="service"]');
  if (svc && sel) {
    const opt = [...sel.options].find(o => o.dataset.key === svc);
    if (opt) sel.value = opt.value;
  }

  const build = () => {
    const lines = [`Hello ${SITE.name}, I'd like to make an enquiry.`, ''];
    form.querySelectorAll('input, select, textarea').forEach(f => {
      if (!f.name || !f.value.trim()) return;
      const label = form.querySelector(`label[for="${f.id}"]`);
      lines.push(`${label ? label.textContent.replace('*', '').trim() : f.name}: ${f.value.trim()}`);
    });
    return lines.join('\n');
  };

  form.querySelectorAll('[data-send]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!form.reportValidity()) return;
      const text = build();
      if (btn.dataset.send === 'whatsapp') {
        if (!SITE.whatsapp) { say('WhatsApp number is not added yet. Please use email for now.'); return; }
        window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      } else {
        const subject = `Website enquiry – ${sel ? sel.value : SITE.name}`;
        location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      }
      say('Thank you! Your message is ready to send in the app that just opened.');
    });
  });
  form.addEventListener('submit', e => e.preventDefault());
});

/* Solar savings calculator (solar page only) */
const calc = document.getElementById('solar-calc');
if (calc) {
  const $ = id => document.getElementById(id);
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const UNITS_PER_KW_MONTH = 120;  // about 4 units per kW per day
  const COST_PER_KW = 55000;       // rough installed price per kW, before subsidy
  let type = 'home';

  calc.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => {
    calc.querySelectorAll('.seg button').forEach(x => {
      x.classList.toggle('active', x === b);
      x.setAttribute('aria-pressed', x === b);
    });
    type = b.dataset.type;
    run();
  }));

  // PM Surya Ghar central subsidy for homes: ₹30,000/kW up to 2 kW, ₹18,000 for the 3rd kW (max ₹78,000)
  const subsidy = kw => type === 'home'
    ? Math.min(kw, 2) * 30000 + Math.min(Math.max(kw - 2, 0), 1) * 18000
    : type === 'society' ? kw * 18000 : 0;

  function run() {
    const bill = +$('bill').value, tariff = +$('tariff').value;
    $('bill-out').textContent = inr(bill);
    $('tariff-out').textContent = '₹' + tariff + '/unit';
    const units = bill / tariff;
    const kw = Math.max(1, Math.round((units / UNITS_PER_KW_MONTH) * 2) / 2);
    const cost = kw * COST_PER_KW;
    const sub = Math.min(subsidy(kw), cost);
    const monthly = Math.min(kw * UNITS_PER_KW_MONTH, units) * tariff;
    const payback = (cost - sub) / (monthly * 12);
    $('r-kw').textContent = kw + ' kW';
    $('r-panels').textContent = Math.ceil(kw * 1000 / 550) + ' panels';
    $('r-roof').textContent = '~' + Math.round(kw * 100) + ' sq ft';
    $('r-cost').textContent = inr(cost);
    $('r-sub').textContent = sub ? inr(sub) : 'Not applicable';
    $('r-month').textContent = inr(monthly);
    $('r-payback').textContent = payback.toFixed(1) + ' years';
  }
  ['bill', 'tariff'].forEach(id => $(id).addEventListener('input', run));
  run();
}

/* Typing effect on the AI answer card (digital page) */
const typing = document.querySelector('[data-type-text]');
if (typing && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const full = typing.dataset.typeText;
  typing.textContent = '';
  typing.classList.add('typing');
  const start = () => {
    let i = 0;
    const tick = () => {
      typing.textContent = full.slice(0, ++i);
      if (i < full.length) setTimeout(tick, 22);
      else typing.classList.remove('typing');
    };
    tick();
  };
  const io2 = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { start(); io2.disconnect(); }
  });
  io2.observe(typing);
} else if (typing) {
  typing.textContent = typing.dataset.typeText;
}

/* ---------- Solar page: calculator tabs ---------- */
document.querySelectorAll('.calc-tabs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.calc-tabs button').forEach(x => {
    x.classList.toggle('active', x === b);
    x.setAttribute('aria-selected', x === b);
  });
  document.querySelectorAll('[data-calc-panel]').forEach(p => { p.hidden = p.dataset.calcPanel !== b.dataset.calc; });
}));

/* ---------- Solar page: battery backup calculator ---------- */
const bcalc = document.getElementById('battery-calc');
if (bcalc) {
  const $ = id => document.getElementById(id);
  let btype = 'lithium';
  bcalc.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => {
    bcalc.querySelectorAll('.seg button').forEach(x => {
      x.classList.toggle('active', x === b);
      x.setAttribute('aria-pressed', x === b);
    });
    btype = b.dataset.type;
    runB();
  }));
  bcalc.querySelectorAll('.chips button').forEach(b => b.addEventListener('click', () => {
    const load = $('load');
    load.value = b.dataset.add === 'reset' ? load.min : Math.min(+load.max, +load.value + +b.dataset.add);
    runB();
  }));
  function runB() {
    const load = +$('load').value, hours = +$('hours').value;
    $('load-out').textContent = load.toLocaleString('en-IN') + ' W';
    $('hours-out').textContent = hours + (hours === 1 ? ' hr' : ' hrs');
    const need = load * hours;                         // Wh used
    const dod = btype === 'lithium' ? 0.9 : 0.5;       // how deep the battery can be drained
    const cap = need / (dod * 0.9);                    // 0.9 = inverter losses
    const volt = load > 2500 || cap > 6000 ? 48 : load > 800 || cap > 2000 ? 24 : 12;
    let config;
    if (btype === 'lead') {
      const series = volt / 12, strings = Math.ceil(cap / (1800 * series));
      config = `About ${series * strings} × 150Ah, 12V tubular batteries`;
    } else {
      config = `About a ${Math.ceil(cap / volt / 50) * 50}Ah lithium pack at ${volt}V`;
    }
    const inv = Math.max(1, Math.ceil((load * 1.25) / 0.8 / 500) * 0.5);
    const solar = Math.max(0.5, Math.ceil((cap / (4 * 1000 * 0.85)) * 2) / 2);
    $('b-kwh').textContent = (cap / 1000).toFixed(1) + ' kWh';
    $('b-config').textContent = config;
    $('b-wh').textContent = Math.round(need).toLocaleString('en-IN') + ' Wh';
    $('b-volt').textContent = volt + ' V';
    $('b-inv').textContent = inv + ' kVA';
    $('b-solar').textContent = solar + ' kW';
  }
  ['load', 'hours'].forEach(id => $(id).addEventListener('input', runB));
  runB();
}

/* ---------- Solar page: how-solar-works power-flow diagram ---------- */
const diagram = document.getElementById('flow-diagram');
if (diagram) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NODES = {
    sun:      { icon: 'i-sun',      label: 'Sunlight',     sub: 'Free energy' },
    panels:   { icon: 'i-panel',    label: 'Solar panels', sub: 'Make DC power' },
    inverter: { icon: 'i-inverter', label: 'Inverter',     sub: 'DC → AC' },
    home:     { icon: 'i-home',     label: 'Your home',    sub: 'Uses AC power' },
    meter:    { icon: 'i-meter',    label: 'Net meter',    sub: 'Counts units' },
    grid:     { icon: 'i-grid',     label: 'Power grid',   sub: 'Electricity board' },
    battery:  { icon: 'i-battery',  label: 'Battery',      sub: 'Hybrid systems' }
  };
  const LAYOUTS = {
    wide: { w: 1120, h: 500, r: 48, pos: { sun: [80, 120], panels: [315, 120], inverter: [560, 120], home: [805, 120], meter: [1040, 120], grid: [1040, 400], battery: [560, 400] } },
    tall: { w: 400, h: 860, r: 38, pos: { sun: [95, 50], panels: [95, 225], inverter: [95, 400], home: [95, 575], meter: [95, 750], grid: [295, 750], battery: [295, 400] } }
  };
  // each wire: from, to, colour, what it does by day / by night ('fwd', 'rev' or off), label
  const WIRES = [
    { a: 'sun', b: 'panels', cls: 'f-sun', day: 'fwd', night: '', tag: ['Light', ''] },
    { a: 'panels', b: 'inverter', cls: 'f-dc', day: 'fwd', night: '', tag: ['DC', ''] },
    { a: 'inverter', b: 'home', cls: 'f-ac', day: 'fwd', night: 'fwd', tag: ['AC', 'Backup'] },
    { a: 'home', b: 'meter', cls: 'f-grid', day: 'fwd', night: 'rev', tag: ['Extra', 'Import'] },
    { a: 'meter', b: 'grid', cls: 'f-grid', day: 'fwd', night: 'rev', tag: ['Export', 'Import'] },
    { a: 'inverter', b: 'battery', cls: 'f-bat', day: 'fwd', night: 'rev', tag: ['Charge', 'Discharge'] }
  ];
  const CAPTIONS = {
    day: 'Daytime: the sun powers your home, charges the battery, and sends extra units to the grid as bill credit.',
    night: 'Night-time: the battery covers essentials and the grid supplies the rest, paid for with the credit you earned by day.'
  };
  let mode = 'day', layoutName = '';

  function build() {
    const name = window.innerWidth < 700 ? 'tall' : 'wide';
    if (name === layoutName) return;
    layoutName = name;
    const L = LAYOUTS[name], r = L.r, P = L.pos;
    let wires = '', flows = '', tags = '', nodes = '';
    WIRES.forEach((w, i) => {
      const [x1, y1] = P[w.a], [x2, y2] = P[w.b];
      const len = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / len, dy = (y2 - y1) / len;
      const down = dy > 0.5;                       // downward wires start below the label text
      const so = down ? r + 54 : r + 6;
      const sx = x1 + dx * so, sy = y1 + dy * so, ex = x2 - dx * (r + 6), ey = y2 - dy * (r + 6);
      const d = `M${sx} ${sy} L${ex} ${ey}`;
      wires += `<path class="wire" d="${d}"/>`;
      flows += `<path class="flow ${w.cls}" data-i="${i}" d="${d}"/>`;
      const mx = (sx + ex) / 2, my = (sy + ey) / 2;
      tags += `<g class="label-pill" data-i="${i}" data-x="${mx}" data-y="${my}" data-side="${down ? 1 : 0}" transform="translate(${mx} ${my})"><rect x="-38" y="-13" width="76" height="26" rx="13"/><text y="4.5"></text></g>`;
    });
    Object.entries(P).forEach(([key, [x, y]]) => {
      const n = NODES[key], s = r * 0.95;
      nodes += `<g class="node n-${key}" data-node="${key}">` +
        (key === 'sun' ? `<circle class="sun-halo" cx="${x}" cy="${y}" r="${r + 16}"/>` : '') +
        `<circle class="bg" cx="${x}" cy="${y}" r="${r}"/>` +
        `<use href="#${n.icon}" x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}"/>` +
        `<text x="${x}" y="${y + r + 24}">${n.label}</text>` +
        `<text class="sub" x="${x}" y="${y + r + 42}">${n.sub}</text></g>`;
    });
    diagram.innerHTML = `<svg viewBox="0 0 ${L.w} ${L.h}" role="img" aria-label="Sun to panels to inverter to home, with net meter, grid and battery">${wires}${flows}${tags}${nodes}</svg>`;
    setMode(mode, true);
  }

  function setMode(m, quiet) {
    mode = m;
    diagram.classList.toggle('mode-day', m === 'day');
    diagram.classList.toggle('mode-night', m === 'night');
    WIRES.forEach((w, i) => {
      const state = w[m];
      const flow = diagram.querySelector(`.flow[data-i="${i}"]`);
      const tag = diagram.querySelector(`.label-pill[data-i="${i}"]`);
      flow.classList.toggle('on', !!state);
      flow.classList.toggle('rev', state === 'rev');
      const text = w.tag[m === 'day' ? 0 : 1];
      tag.classList.toggle('on', !!text);
      tag.querySelector('text').textContent = text;
      const width = Math.max(52, text.length * 8 + 22);
      tag.querySelector('rect').setAttribute('x', -width / 2);
      tag.querySelector('rect').setAttribute('width', width);
      const shift = tag.dataset.side === '1' ? width / 2 + 10 : 0;   // labels on vertical wires sit beside them
      tag.setAttribute('transform', `translate(${+tag.dataset.x + shift} ${tag.dataset.y})`);
    });
    const cap = document.getElementById('flow-caption');
    if (quiet) { cap.textContent = CAPTIONS[m]; }
    else { cap.style.opacity = 0; setTimeout(() => { cap.textContent = CAPTIONS[m]; cap.style.opacity = 1; }, 200); }
    document.querySelectorAll('.ex-d').forEach(d => d.classList.toggle('now', d.dataset.mode === m));
    document.querySelectorAll('.mode-switch button').forEach(b => {
      const on = b.dataset.mode === m;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
  }
  document.querySelectorAll('.mode-switch button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  build();
  window.addEventListener('resize', build);

  // Parts explorer under the diagram: one part at a time, synced with the diagram
  const explore = document.getElementById('explore');
  const tabs = explore ? [...explore.querySelectorAll('.ex-tab')] : [];
  const items = explore ? [...explore.querySelectorAll('.ex-item')] : [];
  let cur = 0, auto = !reduce, seen = false;
  const select = (i, user) => {
    cur = (i + tabs.length) % tabs.length;
    const key = tabs[cur].dataset.key;
    tabs.forEach((t, k) => { t.classList.toggle('on', k === cur); t.setAttribute('aria-selected', k === cur); });
    items.forEach((it, k) => it.classList.toggle('on', k === cur));
    diagram.querySelectorAll('.node').forEach(n => n.classList.toggle('hl', n.dataset.node === key));
    const bar = tabs[cur].querySelector('.ex-prog');
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    if (user) { auto = false; explore.classList.add('manual'); }
  };
  const syncPause = () => explore && explore.classList.toggle('paused', !auto || !seen);
  if (explore) {
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => select(k, true));
      t.querySelector('.ex-prog').addEventListener('animationend', () => { if (auto && k === cur) select(cur + 1); });
    });
    diagram.addEventListener('click', e => {
      const n = e.target.closest('.node');
      if (!n) return;
      const k = tabs.findIndex(t => t.dataset.key === n.dataset.node);
      if (k >= 0) { select(k, true); if (innerWidth < 900) explore.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; syncPause(); }, { threshold: 0.3 }).observe(explore);
    select(0);
    syncPause();
  }
  // re-apply the highlight whenever the diagram is rebuilt (layout change)
  window.addEventListener('resize', () => { if (explore) setTimeout(() => select(cur), 0); });
}

/* =========================================================
   EFFECTS
   ========================================================= */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll progress bar + header shadow + solar hero parallax */
const bar = document.createElement('div');
bar.className = 'progress';
document.body.prepend(bar);
const header = document.querySelector('.site-header');
const heroImg = document.querySelector('.hero-bg img');
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  if (header) header.classList.toggle('scrolled', scrollY > 10);
  if (heroImg && !calm && scrollY < innerHeight) heroImg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.08)`;
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();

/* Hero headline: split into words that rise in one by one */
const h1 = document.querySelector('.hero h1');
if (h1 && !calm) {
  let n = 0;
  const wrap = node => {
    [...node.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const s = document.createElement('span');
          s.className = 'w';
          s.style.animationDelay = (n++ * 70) + 'ms';
          s.textContent = part;
          frag.append(s);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1 && ch.classList.contains('hl')) {
        ch.classList.add('w');                     // keep the highlighted word whole so its gradient survives
        ch.style.animationDelay = (n++ * 70) + 'ms';
      } else if (ch.nodeType === 1) {
        wrap(ch);
      }
    });
  };
  wrap(h1);
}

/* Floating sparkle dots in the hero */
const heroEl = document.querySelector('.hero');
if (heroEl && !calm) {
  const sp = document.createElement('div');
  sp.className = 'sparks';
  sp.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 14; i++) {
    const d = document.createElement('i');
    d.style.left = Math.random() * 100 + '%';
    d.style.top = 20 + Math.random() * 70 + '%';
    d.style.animationDelay = (Math.random() * 7).toFixed(2) + 's';
    d.style.animationDuration = (5 + Math.random() * 5).toFixed(2) + 's';
    sp.append(d);
  }
  heroEl.prepend(sp);
}

/* Cards: spotlight follows the mouse, with a gentle 3D tilt */
if (!calm && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transitionDelay = '0ms';
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
      card.style.transform = `perspective(800px) translateY(-4px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 6}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

/* ===== Solar journey: auto-plays through the steps (works for every .journey on the page) ===== */
document.querySelectorAll('.journey').forEach(j => {
  const steps = [...j.querySelectorAll('.jr-step')];
  const n = steps.length;
  if (!n) return;
  const panel = j.querySelector('.jr-panel');
  const bars = [...j.querySelectorAll('.jr-bars span')];
  const $ = k => j.querySelector('[data-jr="' + k + '"]');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, hover = false, seen = false;

  function sync() { j.classList.toggle('paused', hover || !seen || still); }

  function go(i) {
    cur = (i + n) % n;
    steps.forEach((s, k) => {
      s.classList.toggle('done', k < cur);
      s.classList.toggle('active', k === cur);
      s.querySelector('.jr-node').setAttribute('aria-current', k === cur ? 'step' : 'false');
    });
    j.style.setProperty('--p', (cur / (n - 1) * 100) + '%');
    bars.forEach((b, k) => { b.className = k < cur ? 'done' : k === cur ? 'now' : ''; });
    const bar = bars[cur].firstElementChild;
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    const s = steps[cur];
    $('ico').innerHTML = s.querySelector('.jr-ring > .ico').outerHTML;
    $('title').innerHTML = s.querySelector('.jr-title').innerHTML;
    $('text').innerHTML = s.querySelector('.jr-desc').innerHTML;
    $('tag').textContent = s.dataset.tag;
    $('count').textContent = 'Step ' + (cur + 1) + ' of ' + n;
    panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
  }

  // When a step's progress bar fills up, move on to the next step
  bars.forEach((b, k) => b.firstElementChild.addEventListener('animationend', () => { if (k === cur && !still) go(cur + 1); }));
  steps.forEach((s, k) => s.querySelector('.jr-node').addEventListener('click', () => go(k)));
  j.addEventListener('mouseenter', () => { hover = true; sync(); });
  j.addEventListener('mouseleave', () => { hover = false; sync(); });
  j.addEventListener('focusin', () => { hover = true; sync(); });
  j.addEventListener('focusout', () => { hover = false; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { seen = es[0].isIntersecting; sync(); }, { threshold: .35 }).observe(j);
  } else { seen = true; }
  sync();
  go(0);
});
