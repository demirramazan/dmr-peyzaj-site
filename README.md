# DMR Peyzaj Mimarlık — Web Sitesi

Statik site (HTML/CSS/JS). Derleme adımı yok; klasörü herhangi bir statik barındırmaya (Netlify, GitHub Pages, Cloudflare Pages, klasik hosting) yüklemek yeterli.

## Yerelde açmak

```bash
npx serve .
```

## İçerik nerede?

Her şey `js/data.js` içinde:

| Ne | Nerede |
|---|---|
| Telefon, WhatsApp, e-posta, adres | `SITE` |
| Projeler (başlık, metin, foto sırası) | `PROJECTS` |
| Hizmet kartları | `SERVICES` |
| Referans şeridi | `REFERENCES` |
| Fidanlık fotoğrafları | `NURSERY_IMAGES` |
| Mağaza (fidan & çiçek satışı) | `SHOP` |

**İlk yapılacak:** `SITE.phone` ve `SITE.whatsapp` alanlarını doldurun. Boşken telefon satırı gizlenir, form ve "Bize yazın" düğmesi Instagram DM'e yönlenir; doldurunca WhatsApp'a geçer.

## Yeni proje eklemek

1. Fotoğrafları `assets/img/` içine `slug-01.webp`, `slug-02.webp` … (büyük, ~1400 px genişlik) ve `slug-01-s.webp` … (küçük, ~640 px) adlarıyla koyun.
2. `PROJECTS` dizisinin başına yeni bir kayıt ekleyin; `images` gösterim sırasıdır, ilk numara kapak olur.

## Mağazayı açmak

Altyapı hazır, şimdilik kapalı (`SHOP.enabled: false`). Açmak için:

1. `SHOP.products` içindeki örnek ürünleri gerçek ürün, fiyat ve stokla değiştirin.
2. `SHOP.enabled: true` yapın — menüde "Mağaza" bağlantısı kendiliğinden görünür.
3. `magaza.html` içindeki `noindex` satırını silin.

Sepet tarayıcıda saklanır, sipariş WhatsApp mesajı olarak iletilir (online ödeme yok). İleride online ödeme istenirse `js/shop.js` içindeki sipariş adımı bir ödeme sağlayıcısına bağlanabilir.

## Görseller

Fotoğraf ve video [@dmrpeyzajmimarlik](https://www.instagram.com/dmrpeyzajmimarlik/) Instagram hesabından alınmıştır.
