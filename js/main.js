/* DMR Peyzaj Mimarlık — ana sayfa davranışları */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, attrs = {}, html = '') => {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => (v === true ? e.setAttribute(k, '') : v !== false && v != null && e.setAttribute(k, v)));
    e.innerHTML = html;
    return e;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- İletişim bilgileri ---------- */
  // ig.me kısa bağlantısı her cihazda açılmıyor; profil sayfası (Mesaj düğmesiyle) her yerde çalışır.
  const igDm = `https://www.instagram.com/${SITE.instagram}/`;
  const wa = (text) => `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  const mapQuery = encodeURIComponent(`${SITE.name}, ${SITE.address}`);
  $$('[data-address]').forEach((e) => (e.textContent = SITE.address));
  $$('[data-map-link]').forEach((e) => (e.href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`));
  const mapFrame = $('[data-map-frame]');
  if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`;
  if (SITE.phone) {
    $('[data-phone-row]').hidden = false;
    const a = $('[data-phone]');
    a.textContent = SITE.phone;
    a.href = `tel:${SITE.phone.replace(/[^\d+]/g, '')}`;
  }
  if (SITE.email) {
    $('[data-mail-row]').hidden = false;
    const a = $('[data-mail]');
    a.textContent = SITE.email;
    a.href = `mailto:${SITE.email}`;
  }
  const fab = $('[data-fab]');
  fab.href = SITE.whatsapp ? wa('Merhaba, peyzaj hizmetleriniz hakkında bilgi almak istiyorum.') : igDm;
  $('[data-fab-label]').textContent = SITE.whatsapp ? 'WhatsApp’tan yazın' : 'Instagram’dan yazın';
  $('#year').textContent = new Date().getFullYear();
  if (typeof SHOP !== 'undefined' && SHOP.enabled) $$('[data-shop-link]').forEach((e) => (e.hidden = false));

  /* ---------- Başlık & menü ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  const menuBtn = $('#menuBtn');
  const nav = $('#nav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));

  /* ---------- Referans şeridi ---------- */
  const refs = REFERENCES.map((r) => `<span>${esc(r)}</span>`).join('');
  $('#refsTrack').innerHTML = refs + refs;
  $('#refsTrack').setAttribute('aria-label', REFERENCES.join(', '));

  /* ---------- Projeler ---------- */
  const grid = $('#projectGrid');
  PROJECTS.forEach((p) => {
    const cat = CATEGORIES.find((c) => c.id === p.category);
    const card = el('button', { class: 'card reveal', type: 'button', 'data-cat': p.category, 'data-slug': p.slug, 'aria-label': `${p.title} projesini aç` }, `
      <img src="${img(p.slug, p.images[0])}" alt="${esc(p.title)}" loading="lazy" decoding="async">
      <span class="card-count">${p.video ? '▶ Video' : `${p.images.length} fotoğraf`}</span>
      <span class="card-body">
        <span class="card-meta">${esc(p.location)} · ${esc(cat.label)}</span>
        <h3>${esc(p.title)}</h3>
        <span class="card-more">Projeyi incele →</span>
      </span>`);
    grid.append(card);
  });
  const cards = $$('.card', grid);
  const layout = () => {
    const visible = cards.filter((c) => !c.hidden);
    cards.forEach((c) => c.classList.remove('wide'));
    if (visible.length % 3 === 2) visible[0].classList.add('wide');
  };
  const filters = $('#filters');
  CATEGORIES.forEach((c, i) => {
    const n = c.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === c.id).length;
    if (!n) return;
    filters.append(el('button', { class: 'chip', type: 'button', role: 'tab', 'aria-selected': i === 0 ? 'true' : 'false', 'data-cat': c.id }, `${esc(c.label)}<sup>${n}</sup>`));
  });
  filters.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('.chip', filters).forEach((c) => c.setAttribute('aria-selected', c === chip ? 'true' : 'false'));
    cards.forEach((c) => {
      c.hidden = chip.dataset.cat !== 'all' && c.dataset.cat !== chip.dataset.cat;
      if (!c.hidden) c.classList.add('in');
    });
    layout();
  });
  layout();

  /* ---------- Proje penceresi ---------- */
  const modal = $('#modal');
  const mImg = $('#mImg');
  const mVideo = $('#mVideo');
  let cur = null;
  let idx = 0;
  const show = (i) => {
    const n = cur.images.length;
    idx = (i + n) % n;
    mImg.src = img(cur.slug, cur.images[idx]);
    mImg.alt = `${cur.title} — fotoğraf ${idx + 1}`;
    $('#mCount').textContent = `${idx + 1} / ${n}`;
    $$('#mThumbs button').forEach((b, k) => b.setAttribute('aria-current', k === idx ? 'true' : 'false'));
    const next = new Image();
    next.src = img(cur.slug, cur.images[(idx + 1) % n]);
  };
  const openProject = (p) => {
    cur = p;
    const cat = CATEGORIES.find((c) => c.id === p.category);
    $('#mMeta').textContent = [p.location, p.date, cat && cat.label].filter(Boolean).join(' · ');
    $('#mTitle').textContent = p.title;
    $('#mText').textContent = p.text;
    $('#mTags').innerHTML = (p.tags || []).map((t) => `<li>${esc(t)}</li>`).join('');
    const post = $('#mPost');
    post.hidden = !p.post;
    if (p.post) post.href = `https://www.instagram.com/p/${p.post}/`;
    const isVideo = !!p.video;
    mVideo.hidden = !isVideo;
    mImg.hidden = isVideo;
    const multi = !isVideo && p.images.length > 1;
    ['#mPrev', '#mNext', '#mCount'].forEach((s) => ($(s).hidden = !multi));
    const thumbs = $('#mThumbs');
    thumbs.innerHTML = '';
    thumbs.hidden = !multi;
    if (isVideo) {
      mVideo.src = p.video;
      mVideo.poster = img(p.slug, p.images[0]);
      mVideo.muted = true;
      mVideo.play().catch(() => {});
    } else {
      if (multi) p.images.forEach((n, k) => {
        const b = el('button', { type: 'button', 'aria-label': `Fotoğraf ${k + 1}` }, `<img src="${thumb(p.slug, n)}" alt="" loading="lazy">`);
        b.addEventListener('click', () => show(k));
        thumbs.append(b);
      });
      show(0);
    }
    modal.showModal();
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => modal.close();
  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
    mVideo.pause();
    mVideo.removeAttribute('src');
    mVideo.load();
  });
  $('#mClose').addEventListener('click', closeModal);
  $('#mCta').addEventListener('click', closeModal);
  $('#mPrev').addEventListener('click', () => show(idx - 1));
  $('#mNext').addEventListener('click', () => show(idx + 1));
  modal.addEventListener('click', (e) => e.target === modal && closeModal());
  modal.addEventListener('keydown', (e) => {
    if (!cur || cur.video) return;
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  let sx = null;
  const stage = $('.modal-stage');
  stage.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (sx == null || !cur || cur.video) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
  grid.addEventListener('click', (e) => {
    const c = e.target.closest('.card');
    if (c) openProject(PROJECTS.find((p) => p.slug === c.dataset.slug));
  });
  $$('[data-open]').forEach((b) => b.addEventListener('click', () => openProject(PROJECTS.find((p) => p.slug === b.dataset.open))));

  /* ---------- Hizmetler ---------- */
  const sg = $('#serviceGrid');
  const sel = $('#serviceSelect');
  sel.append(el('option', { value: 'Genel bilgi / keşif' }, 'Genel bilgi / keşif'));
  SERVICES.forEach((s, i) => {
    sg.append(el('article', { class: 'service reveal', style: `--d:${(i % 4) * 0.07}s` }, `
      <div class="service-img"><img src="${s.image}" alt="" loading="lazy" decoding="async"></div>
      <div class="service-body"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`));
    sel.append(el('option', { value: s.title }, esc(s.title)));
  });

  /* ---------- Fidanlık ---------- */
  const nursery = {
    slug: 'fidanlik', title: 'DMR Botanik Fidanlık', location: 'Kartal, İstanbul', date: '', category: null,
    tags: ['İç mekân', 'Dış mekân', 'Sukulent', 'Mevsimlik'],
    text: 'Bahçe tasarımından profesyonel peyzaj uygulamalarına, en özel botanik bitkilerden iç ve dış mekân fidanlık ürünlerine kadar aradığınız her şey tek çatı altında. Sizi fidanlığımıza bekliyoruz.',
    images: NURSERY_IMAGES, post: 'DfJ6HJ_ERLt',
  };
  const strip = $('#nurseryStrip');
  NURSERY_IMAGES.forEach((n, k) => {
    const b = el('button', { type: 'button', 'aria-label': `Fidanlık fotoğrafı ${k + 1}` }, `<img src="${thumb('fidanlik', n)}" alt="Fidanlıktan bitkiler" loading="lazy" decoding="async">`);
    b.addEventListener('click', () => { openProject(nursery); show(k); });
    strip.append(b);
  });

  /* ---------- Önce / Sonra ---------- */
  const ba = $('#ba');
  $('#baRange').addEventListener('input', (e) => ba.style.setProperty('--pos', `${e.target.value}%`));

  /* ---------- Video: görünür olunca oynat ---------- */
  const pv = $('#projVideo');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver(([en]) => (en.isIntersecting ? pv.play().catch(() => {}) : pv.pause()), { threshold: 0.5 }).observe(pv);
  }

  /* ---------- Form ---------- */
  const form = $('#contactForm');
  const note = $('#formNote');
  $('#formSubmit').textContent = SITE.whatsapp ? 'WhatsApp ile gönder' : 'Talebi gönder';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    let ok = true;
    ['ad', 'tel'].forEach((n) => {
      const inp = form.elements[n];
      const bad = !inp.value.trim();
      inp.classList.toggle('invalid', bad);
      if (bad && ok) { inp.focus(); ok = false; }
    });
    if (!ok) { note.textContent = 'Lütfen adınızı ve telefonunuzu yazın.'; return; }
    const text = `Merhaba, web sitenizden yazıyorum.\nAd: ${f.get('ad')}\nTelefon: ${f.get('tel')}\nHizmet: ${f.get('hizmet')}\n${f.get('mesaj') ? `Not: ${f.get('mesaj')}` : ''}`.trim();
    if (SITE.whatsapp) {
      window.open(wa(text), '_blank', 'noopener');
      note.textContent = 'WhatsApp açılıyor; mesajı göndermeniz yeterli.';
      return;
    }
    try { await navigator.clipboard.writeText(text); note.textContent = 'Mesajınız kopyalandı. Açılan Instagram sohbetine yapıştırıp gönderin.'; }
    catch { note.textContent = 'Instagram sohbeti açılıyor; bilgilerinizi oradan iletebilirsiniz.'; }
    window.open(igDm, '_blank', 'noopener');
  });

  /* ---------- Kaydırınca belirme ---------- */
  $$('.section-head, .ba-wrap > *, .video-wrap > *, .steps li, .contact > *, .nursery-foot').forEach((e) => e.classList.add('reveal'));
  const rev = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rev.forEach((e) => io.observe(e));
  } else rev.forEach((e) => e.classList.add('in'));
})();
