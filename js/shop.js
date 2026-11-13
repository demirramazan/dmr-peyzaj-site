/* DMR Peyzaj Mimarlık — mağaza: ürünler, sepet, teslimat ve ödeme akışı.
   Ayarlar js/data.js içindeki SHOP nesnesinde. Ödeme modu: SHOP.payment.mode */
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const active = SHOP.enabled || new URLSearchParams(location.search).has('demo');
  if (!active) { $('#shopSoon').hidden = false; return; }
  const PAY = SHOP.payment;
  const DEL = SHOP.delivery;
  const isDemo = PAY.mode === 'demo';
  $('#demoBar').hidden = !isDemo;
  document.body.classList.toggle('has-demo-bar', isDemo);
  $('#cartBtn').hidden = false;

  const KEY = 'dmr-sepet';
  const money = (n) => `${n.toLocaleString('tr-TR')} ${SHOP.currency}`;
  const byId = (id) => SHOP.products.find((p) => p.id === id);
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  Object.keys(cart).forEach((id) => byId(id) || delete cart[id]);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* gizli sekme */ } };

  /* ---------- Görünümler ---------- */
  const views = { catalog: $('#viewCatalog'), checkout: $('#viewCheckout'), done: $('#viewDone') };
  const go = (name) => {
    Object.entries(views).forEach(([k, v]) => (v.hidden = k !== name));
    $('#cartBtn').hidden = name !== 'catalog';
    $('#cart').hidden = true;
    window.scrollTo(0, 0);
  };

  /* ---------- Ürünler ---------- */
  $('#deliveryNote').textContent = `${DEL.area} adrese teslimat ${money(DEL.fee)}; ${money(DEL.freeOver)} ve üzeri siparişlerde ücretsiz.${DEL.pickup ? ' Fidanlıktan teslim alabilirsiniz.' : ''}`;
  const grid = $('#productGrid');
  const renderProducts = (cat) => {
    grid.innerHTML = SHOP.products
      .filter((p) => cat === 'all' || p.category === cat)
      .map((p) => `
        <article class="product">
          <div class="product-img"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy">${p.stock ? '' : '<span class="product-flag">Tükendi</span>'}</div>
          <div class="product-body">
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.text || '')}</p>
            <div class="product-foot">
              <b>${p.price != null ? `${money(p.price)}<small> / ${esc(p.unit || 'adet')}</small>` : 'Fiyat için sorun'}</b>
              <button class="btn btn-primary" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'Sepete ekle' : 'Tükendi'}</button>
            </div>
          </div>
        </article>`).join('') || '<p class="muted">Bu kategoride ürün yok.</p>';
  };
  const filters = $('#shopFilters');
  filters.innerHTML = SHOP.categories
    .filter((c) => c.id === 'all' || SHOP.products.some((p) => p.category === c.id))
    .map((c, i) => `<button class="chip" role="tab" aria-selected="${i === 0}" data-cat="${c.id}">${esc(c.label)}</button>`).join('');
  filters.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $$('#shopFilters .chip').forEach((c) => c.setAttribute('aria-selected', c === chip));
    renderProducts(chip.dataset.cat);
  });
  renderProducts('all');

  /* ---------- Sepet ---------- */
  const cartEl = $('#cart');
  const ids = () => Object.keys(cart);
  const subtotal = () => ids().reduce((a, id) => a + (byId(id).price || 0) * cart[id], 0);
  const renderCart = () => {
    $('#cartCount').textContent = ids().reduce((a, id) => a + cart[id], 0);
    $('#cartItems').innerHTML = ids().map((id) => {
      const p = byId(id);
      return `<li>
        <img src="${p.image}" alt="">
        <div><b>${esc(p.name)}</b><span>${p.price != null ? money(p.price * cart[id]) : 'Fiyat sorulacak'}</span></div>
        <div class="qty"><button data-dec="${id}" aria-label="Azalt">−</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Artır">+</button></div>
      </li>`;
    }).join('') || '<li class="muted cart-empty">Sepetiniz boş.</li>';
    $('#cartTotal').textContent = ids().length ? money(subtotal()) : '—';
    $('#cartCheckout').disabled = !ids().length;
    save();
  };
  const change = (id, d) => { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; renderCart(); };
  grid.addEventListener('click', (e) => { const b = e.target.closest('[data-add]'); if (b) { change(b.dataset.add, 1); cartEl.hidden = false; } });
  cartEl.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]'); const dec = e.target.closest('[data-dec]');
    if (inc) change(inc.dataset.inc, 1);
    if (dec) change(dec.dataset.dec, -1);
  });
  $('#cartBtn').addEventListener('click', () => (cartEl.hidden = !cartEl.hidden));
  $('#cartClose').addEventListener('click', () => (cartEl.hidden = true));

  /* ---------- Teslimat & ödeme ---------- */
  const form = $('#coForm');
  const note = $('#coNote');
  const state = { delivery: DEL.pickup ? 'pickup' : 'ship', pay: PAY.methods[0] };
  const shipping = () => (state.delivery === 'pickup' || subtotal() >= DEL.freeOver ? 0 : DEL.fee);
  const DELIVERY = [
    DEL.pickup && { id: 'pickup', title: 'Fidanlıktan teslim al', sub: `${SITE.address} · Ücretsiz` },
    { id: 'ship', title: 'Adrese teslimat', sub: `${DEL.area} · ${money(DEL.fee)}, ${money(DEL.freeOver)} üzeri ücretsiz` },
  ].filter(Boolean);
  const METHODS = {
    card: { title: 'Kredi / Banka kartı', sub: 'Tek çekim, 3D Secure' },
    transfer: { title: 'Havale / EFT', sub: 'Ödeme sonrası sipariş hazırlanır' },
    cod: { title: 'Kapıda ödeme', sub: 'Teslimatta nakit veya kart' },
  };
  const optHtml = (name, list, current) => list.map((o) => `
    <label class="opt"><input type="radio" name="${name}" value="${o.id}" ${o.id === current ? 'checked' : ''}>
      <span><b>${esc(o.title)}</b><small>${esc(o.sub)}</small></span></label>`).join('');

  const renderSummary = () => {
    $('#sumItems').innerHTML = ids().map((id) => { const p = byId(id); return `<li><img src="${p.image}" alt=""><span>${cart[id]} × ${esc(p.name)}</span><b>${money((p.price || 0) * cart[id])}</b></li>`; }).join('');
    $('#sumSub').textContent = money(subtotal());
    $('#sumShip').textContent = shipping() ? money(shipping()) : 'Ücretsiz';
    $('#sumTotal').textContent = money(subtotal() + shipping());
  };
  const renderPayPanel = () => {
    const panel = $('#payPanel');
    const btn = $('#payBtn');
    if (state.pay === 'card') {
      btn.textContent = `${money(subtotal() + shipping())} öde`;
      panel.innerHTML = isDemo ? `
        <div class="card-mock" aria-label="Örnek kart formu">
          <label>Kart üzerindeki ad<input value="ÖRNEK MÜŞTERİ" readonly tabindex="-1"></label>
          <label>Kart numarası<input value="4242 4242 4242 4242" readonly tabindex="-1"></label>
          <div class="co-grid"><label>Son kullanma<input value="12 / 30" readonly tabindex="-1"></label><label>CVC<input value="123" readonly tabindex="-1"></label></div>
        </div>
        <p class="pay-info">Bu alan yalnızca örnektir ve değiştirilemez; kart bilgisi istenmez. Canlıda kart bilgileri ${esc(PAY.providerName)} güvenli ödeme sayfasında girilir, bu siteye hiç ulaşmaz.</p>`
        : `<p class="pay-info">“Öde” dediğinizde ${esc(PAY.providerName)} güvenli ödeme sayfasına yönlendirilirsiniz. Kart bilgileriniz bu sitede tutulmaz.</p>`;
    } else if (state.pay === 'transfer') {
      btn.textContent = 'Siparişi onayla';
      panel.innerHTML = `<p class="pay-info">${PAY.iban ? `IBAN: <b>${esc(PAY.iban)}</b><br>` : ''}Açıklamaya sipariş numaranızı yazın. ${PAY.iban ? '' : 'Hesap bilgileri sipariş onayında iletilir. '}Ödeme ulaşınca siparişiniz hazırlanır.</p>`;
    } else {
      btn.textContent = 'Siparişi onayla';
      panel.innerHTML = '<p class="pay-info">Ödemeyi teslimat sırasında nakit ya da kartla yaparsınız.</p>';
    }
  };
  const setStep = (n) => {
    $('#stepDelivery').hidden = n !== 1;
    $('#stepPayment').hidden = n !== 2;
    $$('#coSteps li').forEach((li, i) => { li.classList.toggle('on', i < n); li.toggleAttribute('aria-current', i === n - 1); });
    note.textContent = '';
  };
  const syncDelivery = () => {
    $('#addressFields').hidden = state.delivery === 'pickup';
    renderSummary();
    renderPayPanel();
  };
  $('#deliveryOpts').innerHTML = optHtml('teslimat', DELIVERY, state.delivery);
  $('#payOpts').innerHTML = optHtml('odeme', PAY.methods.map((id) => ({ id, ...METHODS[id] })), state.pay);
  $('#deliveryOpts').addEventListener('change', (e) => { state.delivery = e.target.value; syncDelivery(); });
  $('#payOpts').addEventListener('change', (e) => { state.pay = e.target.value; renderPayPanel(); });

  $('#cartCheckout').addEventListener('click', () => { if (!ids().length) return; go('checkout'); setStep(1); syncDelivery(); });
  $('#backToShop').addEventListener('click', () => go('catalog'));
  $('#backToDelivery').addEventListener('click', () => setStep(1));
  $('#toPayment').addEventListener('click', () => {
    const need = ['ad', 'tel', ...(state.delivery === 'ship' ? ['adres', 'ilce'] : [])];
    let first = null;
    ['ad', 'tel', 'adres', 'ilce'].forEach((n) => {
      const inp = form.elements[n];
      const bad = need.includes(n) && !inp.value.trim();
      inp.classList.toggle('invalid', bad);
      if (bad && !first) first = inp;
    });
    if (first) { first.focus(); note.textContent = 'Lütfen işaretli alanları doldurun.'; return; }
    setStep(2);
    renderPayPanel();
  });

  /* ---------- Siparişi tamamlama ---------- */
  const buildOrder = () => {
    const f = new FormData(form);
    return {
      no: `DMR-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      items: ids().map((id) => ({ id, name: byId(id).name, qty: cart[id], price: byId(id).price })),
      subtotal: subtotal(), shipping: shipping(), total: subtotal() + shipping(),
      delivery: state.delivery, payment: state.pay,
      customer: { name: f.get('ad'), phone: f.get('tel'), address: f.get('adres'), district: f.get('ilce'), note: f.get('not') },
    };
  };
  const orderText = (o) => [
    `Merhaba, web sitenizden sipariş verdim. Sipariş no: ${o.no}`,
    ...o.items.map((i) => `• ${i.qty} × ${i.name} (${money((i.price || 0) * i.qty)})`),
    `Teslimat: ${o.delivery === 'pickup' ? 'Fidanlıktan teslim' : `Adrese — ${o.customer.address}, ${o.customer.district}`}`,
    `Ödeme: ${METHODS[o.payment].title}`,
    `Toplam: ${money(o.total)}`,
    `Ad: ${o.customer.name} · Tel: ${o.customer.phone}`,
    o.customer.note ? `Not: ${o.customer.note}` : '',
  ].filter(Boolean).join('\n');
  const finish = (o) => {
    cart = {}; renderCart();
    $('#doneTag').textContent = isDemo ? 'Örnek sipariş — gerçek değildir' : 'Teşekkürler';
    $('#doneText').textContent = isDemo
      ? 'Ödeme simüle edildi; para çekilmedi ve hiçbir bilgi gönderilmedi. Canlıda müşteri bu ekranı ödeme onayından sonra görür.'
      : (o.payment === 'card' ? 'Ödemeniz alındı. Siparişinizi hazırlayıp sizi arayacağız.' : 'Siparişinizi aldık; teslimat için sizi arayacağız.');
    $('#doneBox').innerHTML = [
      ['Sipariş no', o.no], ['Toplam', money(o.total)],
      ['Teslimat', o.delivery === 'pickup' ? 'Fidanlıktan teslim' : 'Adrese teslimat'], ['Ödeme', METHODS[o.payment].title],
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
    const waBtn = $('#doneWa');
    waBtn.hidden = isDemo || !SITE.whatsapp;
    if (!waBtn.hidden) waBtn.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(orderText(o))}`;
    go('done');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!ids().length) return;
    const o = buildOrder();
    const btn = $('#payBtn');
    btn.disabled = true;
    try {
      if (isDemo) {
        // ÖRNEK: gerçek ödeme yok, hiçbir yere veri gönderilmez.
        btn.textContent = o.payment === 'card' ? 'Ödeme işleniyor…' : 'Sipariş oluşturuluyor…';
        await new Promise((r) => setTimeout(r, 1400));
        finish(o);
      } else if (PAY.mode === 'provider' && o.payment === 'card') {
        // CANLI: sunucunuz ödeme oturumu açar ve sağlayıcının ödeme sayfası adresini döndürür.
        btn.textContent = 'Ödeme sayfasına yönlendiriliyor…';
        const res = await fetch(PAY.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { url } = await res.json();
        if (!url) throw new Error('Ödeme adresi alınamadı');
        save();
        location.href = url;
      } else {
        // WhatsApp modu ya da havale / kapıda ödeme: sipariş mesajla iletilir.
        if (SITE.whatsapp) window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(orderText(o))}`, '_blank', 'noopener');
        finish(o);
      }
    } catch (err) {
      note.textContent = 'Ödeme başlatılamadı. Lütfen tekrar deneyin ya da bize WhatsApp’tan yazın.';
      console.error(err);
      renderPayPanel();
    } finally {
      btn.disabled = false;
    }
  });

  renderCart();
  go('catalog');
})();
