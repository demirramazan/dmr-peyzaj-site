/* DMR Peyzaj Mimarlık — mağaza altyapısı (data.js içindeki SHOP.enabled ile açılır) */
(() => {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (!SHOP.enabled) { $('#shopSoon').hidden = false; return; }
  $('#shopOpen').hidden = false;
  $('#cartBtn').hidden = false;

  const KEY = 'dmr-sepet';
  const money = (n) => `${n.toLocaleString('tr-TR')} ${SHOP.currency}`;
  const byId = (id) => SHOP.products.find((p) => p.id === id);
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { cart = {}; }
  Object.keys(cart).forEach((id) => byId(id) || delete cart[id]);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* gizli sekme */ } };

  /* Ürün listesi */
  const grid = $('#productGrid');
  const renderProducts = (cat) => {
    grid.innerHTML = SHOP.products
      .filter((p) => cat === 'all' || p.category === cat)
      .map((p) => `
        <article class="product">
          <div class="product-img"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"></div>
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
    filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-selected', c === chip));
    renderProducts(chip.dataset.cat);
  });
  renderProducts('all');

  /* Sepet */
  const cartEl = $('#cart');
  const renderCart = () => {
    const ids = Object.keys(cart);
    const count = ids.reduce((a, id) => a + cart[id], 0);
    $('#cartCount').textContent = count;
    $('#cartItems').innerHTML = ids.map((id) => {
      const p = byId(id);
      return `<li>
        <img src="${p.image}" alt="">
        <div><b>${esc(p.name)}</b><span>${p.price != null ? money(p.price * cart[id]) : 'Fiyat sorulacak'}</span></div>
        <div class="qty"><button data-dec="${id}" aria-label="Azalt">−</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Artır">+</button></div>
      </li>`;
    }).join('') || '<li class="muted">Sepetiniz boş.</li>';
    const total = ids.reduce((a, id) => a + (byId(id).price || 0) * cart[id], 0);
    const unknown = ids.some((id) => byId(id).price == null);
    $('#cartTotal').textContent = ids.length ? (unknown ? (total ? `${money(total)} + fiyatı sorulacak ürünler` : 'Fiyat sorulacak') : money(total)) : '—';
    $('#cartOrder').disabled = !ids.length;
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

  /* Sipariş: WhatsApp varsa oradan, yoksa Instagram DM (mesaj panoya kopyalanır) */
  $('#cartOrder').addEventListener('click', async () => {
    const lines = Object.keys(cart).map((id) => { const p = byId(id); return `• ${cart[id]} × ${p.name}${p.price != null ? ` (${money(p.price * cart[id])})` : ''}`; });
    const text = `Merhaba, web sitenizden sipariş vermek istiyorum:\n${lines.join('\n')}\nToplam: ${$('#cartTotal').textContent}`;
    if (SITE.whatsapp) { window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener'); return; }
    try { await navigator.clipboard.writeText(text); } catch { /* yoksay */ }
    window.open(`https://ig.me/m/${SITE.instagram}`, '_blank', 'noopener');
  });
  renderCart();
})();
