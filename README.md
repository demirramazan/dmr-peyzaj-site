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

## Mağaza ve ödeme — şu anki durum: ÖRNEK (demo)

Mağaza açık (`SHOP.enabled: true`) ama ödeme `SHOP.payment.mode: 'demo'`: ürünler ve fiyatlar temsilî, ödeme simüle edilir, hiçbir yere veri gitmez. Sayfanın üstünde turuncu "Örnek gösterim" şeridi görünür. Mağazayı tamamen gizlemek için `enabled: false` yapın (o zaman örnek yalnızca `magaza.html?demo=1` adresinden görünür).

### Canlıya alma

1. `SHOP.products` içindeki örnek ürün ve fiyatları, `SHOP.delivery` içindeki teslimat tutarlarını gerçekleriyle değiştirin.
2. Ödeme modunu seçin (`SHOP.payment.mode`):
   - `'whatsapp'` — en basit: kart adımı yok, sipariş WhatsApp mesajı olarak gelir; ödemeyi havale ya da kapıda alırsınız. Sunucu gerekmez.
   - `'provider'` — kartla online ödeme. Bir ödeme sağlayıcısı (iyzico, PayTR, Param vb.) üyeliği ve küçük bir sunucu fonksiyonu gerekir (aşağıda).
3. `magaza.html` içindeki `noindex` satırını silin.
4. Yasal sayfaları ekleyin: Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu, İade/İptal koşulları, KVKK aydınlatma metni. Ödeme sağlayıcıları başvuruda bunları ve şirket/vergi bilgilerini ister.

### `'provider'` modu nasıl çalışır

Kart bilgisi bu siteye hiç gelmez; statik bir site gizli API anahtarı tutamayacağı için arada küçük bir sunucu fonksiyonu olmalıdır (Cloudflare Workers, Netlify/Vercel Functions gibi ücretsiz katmanlar yeterli):

1. Müşteri "Öde"ye basar → `js/shop.js` siparişi `SHOP.payment.endpoint` adresine JSON olarak POST eder (`no`, `items`, `total`, `customer` …).
2. Sunucu fonksiyonu fiyatları **kendi ürün listesinden yeniden hesaplar** (tarayıcıdan gelen tutara güvenilmez), sağlayıcının API'sinde ödeme oturumu açar ve `{ "url": "…" }` döndürür.
3. Site müşteriyi sağlayıcının güvenli ödeme sayfasına yönlendirir; 3D Secure orada yapılır.
4. Sağlayıcı ödeme sonucunu sunucu fonksiyonuna bildirir (callback/webhook) ve müşteriyi siteye geri gönderir.

Sitede değişecek tek yer `js/data.js` içindeki `payment` bloğudur (`mode`, `providerName`, `endpoint`, `iban`).
