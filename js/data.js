/* =========================================================
   DMR Peyzaj Mimarlık — site içeriği
   Yeni proje eklemek, iletişim bilgisi değiştirmek veya
   mağazayı açmak için SADECE bu dosyayı düzenlemeniz yeterli.
   ========================================================= */

const SITE = {
  name: 'DMR Peyzaj Mimarlık',
  slogan: 'Sürdürülebilir Tasarımlar, Kaliteli Yaşam Alanları.',
  instagram: 'dmrpeyzajmimarlik',
  address: 'Çarşı, Akkan Sk. No:4, 34876 Kartal / İstanbul',
  // Telefon ve WhatsApp numarasını girin (ör. phone: '+90 5xx xxx xx xx', whatsapp: '905xxxxxxxxx').
  // Boş bırakılırsa telefon/WhatsApp düğmeleri gizlenir ve form Instagram DM'e yönlenir.
  phone: '+90 534 981 00 18',
  whatsapp: '905349810018',
  email: '',
};

/* Görsel yolu yardımcıları: img('zekeriyakoy', 1) -> assets/img/zekeriyakoy-01.webp */
const pad = (n) => String(n).padStart(2, '0');
const img = (slug, n) => `assets/img/${slug}-${pad(n)}.webp`;
const thumb = (slug, n) => `assets/img/${slug}-${pad(n)}-s.webp`;

const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'konut', label: 'Villa & Konut' },
  { id: 'site', label: 'Site & Ortak Alan' },
  { id: 'ticari', label: 'Ticari Mekân' },
  { id: 'kamusal', label: 'Kamusal Alan' },
];

/* Projeler — en yeni en üstte. images: gösterim sırasıyla görsel numaraları */
const PROJECTS = [
  {
    slug: 'istinyepark',
    title: 'İstinyePark Residence Mini Bahçe',
    location: 'İstanbul',
    date: 'Ekim 2026',
    category: 'site',
    tags: ['Tasarım', 'Bitkilendirme', 'Adım taşı'],
    text: 'Rezidans avlusunda atıl duran küçük bir alanı; dairesel çakıl oturma zemini, adım taşları, renkli malç ve sarılıcı bitkilerle yukarıdan bakıldığında tablo gibi görünen bir mini bahçeye dönüştürdük. İstinyePark Residence yönetimine yeni bahçeleri hayırlı olsun.',
    images: [1, 7, 5, 6, 2, 4, 3],
    post: 'De9jSEajZpm',
  },
  {
    slug: 'acibadem-garaj',
    title: 'Acıbadem Garaj Bitki Düzenlemesi',
    location: 'İstanbul',
    date: 'Ekim 2026',
    category: 'ticari',
    tags: ['Saksı & bitki', 'İç mekân', 'Cephe'],
    text: 'Acıbadem Garaj için tasarladığımız bitki ve çiçek düzenlemesiyle mekâna canlılık ve sıcaklık kattık. Cephede doğal taş görünümlü saksılar, iç mekânda ise salon bitkileriyle showroom yeşille buluştu.',
    images: [2, 3, 1, 5, 6, 4, 7],
    post: 'De10UqDDe5T',
  },
  {
    slug: 'tecde',
    title: 'Bahçesaray Tecde Konakları',
    location: 'Malatya',
    date: 'Ekim 2026',
    category: 'konut',
    tags: ['Rulo çim', 'Bordür', 'Bitkilendirme'],
    text: 'Malatya’da yapımı devam eden projemiz. Rulo çim serimi, beyaz dere taşı bordürler ve mevsimlik çiçeklerle konak bahçesi adım adım şekilleniyor.',
    images: [1, 3, 2],
    post: 'DeteUGXjbLD',
  },
  {
    slug: 'nef96',
    title: 'Nef 96 Saksı İçi Bitkilendirme',
    location: 'İstanbul',
    date: 'Ekim 2026',
    category: 'site',
    tags: ['Saksı & bitki', 'Ortak alan'],
    text: 'Nef 96 sitesinin ticari cephesi boyunca saksı içi bitki dikimi yaptık. Siz de alanınızı yeşillendirmek isterseniz bize ulaşın.',
    images: [3, 4, 2, 1],
    post: 'Deb7D9ICjt-',
  },
  {
    slug: 'bahcesaray',
    title: 'Bahçesaray Konakları Peyzajı',
    location: 'Malatya',
    date: 'Eylül 2026',
    category: 'konut',
    tags: ['Çim', 'Sulama', 'Adım taşı'],
    text: 'Toprak hazırlığından otomatik sulamaya, rulo çimden adım taşı yollarına kadar konak bahçesinin tamamını baştan düzenledik. Müşterimize hayırlı olsun.',
    images: [9, 1, 6, 11, 12, 5, 8, 7, 3, 10, 4, 2],
    post: 'Dc09eT2jcaM',
  },
  {
    slug: 'zekeriyakoy',
    title: 'Zekeriyaköy Villa Bahçesi',
    location: 'Zekeriyaköy, İstanbul',
    date: 'Haziran 2026',
    category: 'konut',
    tags: ['Bahçe bakımı', 'Budama', 'Çim'],
    text: 'Havuzlu villa bahçesinde kapsamlı bakım ve yenileme: budama, bitkisel toprak takviyesi, yeni çim ve doğal adım taşı yolu. Bahçe sahibine hayırlı olsun.',
    images: [1, 11, 7, 10, 8, 9, 2, 3, 5, 6, 4],
    post: 'DZfG9KgjfZe',
  },
  {
    slug: 'yoo-pergola',
    title: 'Yoo İstanbul Iroko Pergola & Deck',
    location: 'İstanbul',
    date: 'Haziran 2026',
    category: 'site',
    tags: ['Ahşap pergola', 'Kompozit deck', 'Aylık bakım'],
    text: 'Aylık bakım işlerini yürüttüğümüz Yoo İstanbul sitesinin ortak alanlarında iroko ahşap pergola ve kompozit deck imalatını tamamladık.',
    images: [6, 3, 1, 2, 4, 5, 12, 10, 8, 7, 11],
    post: 'DZUkTKijfa6',
  },
  {
    slug: 'yoo-dikey',
    title: 'Yoo İstanbul Dikey Bahçe Yenileme',
    location: 'İstanbul',
    date: 'Nisan 2026',
    category: 'site',
    tags: ['Dikey bahçe', 'Yenileme', 'Bakım'],
    text: 'Sitenin eğimli yeşil cephelerinde dikey bahçe yenilemesi yaptık: eski bitki dokusu söküldü, sulama hatları elden geçirildi ve yüzeyler yeniden bitkilendirildi.',
    images: [2, 1, 12, 8, 10, 5, 3, 6, 7, 9, 11, 4],
    post: 'DWlHWOrDVFh',
  },
  {
    slug: 'bir-mimarlik',
    title: '1 Mimarlık Konut Projesi',
    location: 'İstanbul',
    date: 'Şubat 2026',
    category: 'konut',
    tags: ['Sert zemin', 'Beton parke', 'Doğal taş'],
    text: 'Hafriyattan teslime tüm çevre düzenlemesi: altyapı ve beton işleri, beton parke ve doğal taş kaplamalar, çim alanlar ve sınır bitkilendirmesi. Fotoğraflarda sürecin her aşamasını görebilirsiniz.',
    images: [1, 13, 12, 8, 7, 11, 10, 9, 6, 5, 4, 3, 2],
    post: 'DUVVaObDYnK',
  },
  {
    slug: 'ethem-efendi',
    title: 'Ethem Efendi Kahvaltı — Watergarden',
    location: 'Ataşehir, İstanbul',
    date: 'Ocak 2026',
    category: 'ticari',
    tags: ['Sert zemin', 'Doğal taş', 'Mekân peyzajı'],
    text: 'Ethem Efendi Kahvaltı’nın Ataşehir Watergarden AVM’deki yeni şubesinde sert zemin işlerini üstlendik. Doğal taş döşemeler, zeytin ve palmiyelerle sokak havasında bir mekân ortaya çıktı.',
    images: [11, 10, 16, 9, 15, 12, 7, 2, 1, 5, 13, 8, 6],
    post: 'DT-OH0hDdyp',
  },
  {
    slug: 'inonu-carsi',
    title: 'Malatya İnönü Kapalı Çarşı',
    location: 'Malatya',
    date: 'Eylül 2025',
    category: 'kamusal',
    tags: ['Tasarım', 'Uygulama', 'Proje yönetimi'],
    text: 'Alimoğlu Mermer bünyesinde tasarım, uygulama ve yönetimini gerçekleştirdiğimiz Malatya İnönü Kapalı Çarşı projesini tamamladık.',
    images: [2],
    video: 'assets/video/inonu-carsi.mp4',
    post: 'DOMLQvjjcDp',
  },
];

const SERVICES = [
  { title: 'Peyzaj Tasarımı & Projelendirme', text: 'Keşif, ölçü ve 3 boyutlu görsellerle bahçenizi uygulamadan önce görün.', image: img('istinyepark', 2) },
  { title: 'Bahçe Uygulama & Çim', text: 'Toprak hazırlığı, rulo çim, bitkilendirme ve otomatik sulama sistemleri.', image: thumb('bahcesaray', 6) },
  { title: 'Sert Zemin & Doğal Taş', text: 'Beton parke, doğal taş kaplama, adım taşı yolları ve bordürler.', image: thumb('ethem-efendi', 9) },
  { title: 'Ahşap Pergola & Deck', text: 'Iroko pergola, kompozit deck ve bahçe mobilyası imalatları.', image: thumb('yoo-pergola', 3) },
  { title: 'Dikey Bahçe', text: 'Yeşil duvar kurulumu, yenileme ve sulama altyapısı.', image: thumb('yoo-dikey', 12) },
  { title: 'Periyodik Bakım & Budama', text: 'Siteler ve villalar için aylık bakım, budama, gübreleme ve ilaçlama.', image: thumb('zekeriyakoy', 7) },
  { title: 'Saksı & Mekân Bitkilendirme', text: 'Ofis, showroom ve cepheler için saksılı bitki düzenlemeleri.', image: thumb('acibadem-garaj', 3) },
  { title: 'Botanik Fidanlık', text: 'Kartal’daki fidanlığımızda iç ve dış mekân bitkileri, sukulentler, mevsimlikler.', image: thumb('fidanlik', 3) },
];

const REFERENCES = [
  'İstinyePark Residence', 'Yoo İstanbul', 'Nef 96', 'Acıbadem Garaj',
  'Ethem Efendi Kahvaltı', 'Watergarden AVM', 'Bahçesaray Konakları',
  '1 Mimarlık', 'Alimoğlu Mermer', 'İnönü Kapalı Çarşı',
];

const NURSERY_IMAGES = [3, 6, 4, 10, 8, 5, 11, 12, 9, 2];

/* =========================================================
   MAĞAZA (fidan & çiçek satışı) — ALTYAPI HAZIR, ŞİMDİLİK KAPALI
   Açmak için: enabled: true yapın ve products listesini doldurun.
   - Menüde "Mağaza" bağlantısı kendiliğinden görünür.
   - magaza.html ürünleri listeler, sepet tarayıcıda saklanır,
     sipariş WhatsApp (SITE.whatsapp) üzerinden iletilir.
   - price: TL cinsinden sayı; null ise "Fiyat için sorun" yazar.
   ========================================================= */
const SHOP = {
  enabled: true,
  // true iken mağaza üstünde "ürünler ve fiyatlar örnektir" şeridi görünür. Gerçek ürün ve fiyatları girince false yapın.
  sampleCatalog: true,
  currency: '₺',
  categories: [
    { id: 'all', label: 'Tümü' },
    { id: 'ic-mekan', label: 'İç Mekân' },
    { id: 'dis-mekan', label: 'Dış Mekân' },
    { id: 'sukulent', label: 'Sukulent & Kaktüs' },
    { id: 'mevsimlik', label: 'Mevsimlik Çiçek' },
    { id: 'fidan', label: 'Fidan & Ağaç' },
  ],
  /* ÖDEME
     mode: 'demo'     -> ödeme SİMÜLE edilir; hiçbir yere veri gitmez, para çekilmez.
           'whatsapp' -> kartla ödeme yok; sipariş WhatsApp mesajı olarak iletilir, ödeme havale
                         veya kapıda alınır (ŞU ANKİ DURUM).
           'provider' -> canlı ödeme. Sipariş `endpoint` adresine POST edilir; sunucunuz ödeme
                         sağlayıcısında (iyzico, PayTR vb.) oturum açıp { url } döndürür ve müşteri
                         sağlayıcının güvenli ödeme sayfasına yönlenir. Kart bilgisi bu siteye
                         hiç gelmez. Ayrıntı: README.md
     Mağaza kapalıyken (enabled: false) örneği görmek için: magaza.html?demo=1 */
  payment: {
    mode: 'whatsapp',
    providerName: 'iyzico',
    endpoint: '',
    methods: ['transfer', 'cod'], // 'transfer' havale/EFT, 'cod' kapıda ödeme; kartla ödeme açılınca başa 'card' eklenir
    iban: '', // havale için; canlıya alırken doldurun
  },
  // Teslimat — ÖRNEK tutarlar
  delivery: { pickup: true, fee: 150, freeOver: 1500, area: 'İstanbul içi' },
  // ÖRNEK ürünler ve ÖRNEK fiyatlar — yayına almadan önce gerçek ürün, fiyat ve stokla değiştirin.
  products: [
    { id: 'sukulent', name: 'Karışık Sukulent', category: 'sukulent', price: 120, unit: 'adet', stock: true, image: thumb('fidanlik', 10), text: 'Saksılı karışık sukulent çeşitleri.' },
    { id: 'kaktus', name: 'Kaktüs & Aloe Seçkisi', category: 'sukulent', price: 180, unit: 'adet', stock: true, image: thumb('fidanlik', 4), text: 'Az su isteyen, güneş seven türler.' },
    { id: 'begonya', name: 'Begonya', category: 'mevsimlik', price: 90, unit: 'adet', stock: true, image: thumb('fidanlik', 3), text: 'Mevsimlik, bol çiçekli.' },
    { id: 'mevsimlik-kasa', name: 'Mevsimlik Çiçek Kasası', category: 'mevsimlik', price: 600, unit: 'kasa', stock: true, image: thumb('fidanlik', 6), text: 'Karışık renkli, bordür ve saksı için.' },
    { id: 'kalatea', name: 'Kalatea', category: 'ic-mekan', price: 450, unit: 'adet', stock: true, image: thumb('fidanlik', 8), text: 'Yarı gölge seven salon bitkisi.' },
    { id: 'askili', name: 'Askılı Saksı Bitkisi', category: 'ic-mekan', price: 350, unit: 'adet', stock: true, image: thumb('fidanlik', 11), text: 'Balkon ve teras için sarkan türler.' },
    { id: 'yesillik', name: 'Dış Mekân Yeşillik', category: 'dis-mekan', price: 750, unit: 'adet', stock: false, image: thumb('fidanlik', 12), text: 'Bahçe ve teras için saksılı bitki.' },
    { id: 'zeytin', name: 'Formlu Zeytin Ağacı', category: 'fidan', price: 4500, unit: 'adet', stock: true, image: thumb('fidanlik', 5), text: 'Bonsai formlu, saksılı.' },
  ],
};
