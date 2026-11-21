# Chrome Web Store başvuru metinleri

Yükleme dosyası: `dist/TektikUYAP-1.0.0.zip` (oluşturmak için: `zip -qr dist/TektikUYAP-1.0.0.zip manifest.json src icons LICENSE`)

## Mağaza girişi
**Ad:** TektikUYAP
**Kategori:** Verimlilik (Productivity) → İş Akışı ve Planlama
**Dil:** Türkçe

**Kısa açıklama (≤132 karakter):**
UYAP Avukat, Bilirkişi ve Vatandaş portallarında dosyanın tüm evraklarını tek tıkla ZIP olarak indirin. Açık kaynak.

**Ayrıntılı açıklama:**
TektikUYAP, Avukat UYAP, Bilirkişi UYAP ve Vatandaş UYAP portallarında açtığınız mahkeme dosyasının tüm evraklarını tek tek indirme zahmetinden kurtarır.

• Dosyayı açıp evrak listesini görüntüleyin, sağ alttaki ⬇ düğmesine tıklayın.
• Evrakların hepsini ya da seçtiklerinizi tek bir ZIP dosyası olarak indirin.
• Dosyalar sıra numarası, evrak türü ve tarihle adlandırılır; PDF, UDF, TIFF, JPG türleri otomatik tanınır.
• İndirilemeyen evraklar ZIP içinde ayrı bir listede raporlanır.

Gizlilik: Hiçbir veri toplanmaz ve hiçbir sunucuya gönderilmez. Eklenti yalnızca sizin UYAP oturumunuzla, tarayıcınızın içinde çalışır.
Açık kaynak (MIT): https://github.com/tialkan/TektikUYAP

Bu eklenti UYAP veya T.C. Adalet Bakanlığı ile bağlantılı değildir.

## Gizlilik sekmesi
**Tek amaç (Single purpose):**
UYAP portallarında kullanıcının açtığı dosyanın evraklarını toplu olarak tek bir ZIP dosyası halinde indirmek.

**İzin gerekçeleri:**
- `storage`: Kullanıcının Ayarlar sayfasında belirlediği evrak indirme adresi şablonlarını ve istekler arası bekleme süresini saklamak için.
- Ana makine izni `https://*.uyap.gov.tr/*`: Eklenti düğmesini yalnızca UYAP portallarında göstermek, açık dosyanın evrak listesini okumak ve evrakları kullanıcının oturumuyla UYAP'tan indirmek için. Başka hiçbir siteye erişilmez.
- Uzaktan kod (Remote code): **Hayır**, uzaktan kod kullanılmıyor. Tüm JavaScript paketin içindedir.

**Veri kullanımı beyanı:** Hiçbir veri türü işaretlenmez (kişisel, sağlık, finans, kimlik doğrulama, konum, web geçmişi vb. toplanmıyor). Üç onay kutusunun üçü de işaretlenir (veriler satılmıyor / amaç dışı kullanılmıyor / kredi değerliliği için kullanılmıyor).

**Gizlilik politikası URL'si:**
https://github.com/tialkan/TektikUYAP/blob/main/PRIVACY.md

## Görseller (sizin hazırlamanız gerekenler)
- Mağaza simgesi 128×128: `icons/icon128.png` kullanılabilir.
- En az 1 ekran görüntüsü, 1280×800 veya 640×400 (PNG/JPEG). Öneri:
  1. UYAP dosya sayfası + sağ altta ⬇ düğmesi
  2. Açık panel: evrak listesi ve onay kutuları
  3. İndirilen ZIP'in içeriği (Finder'da)
  ⚠ Ekran görüntülerinde gerçek taraf adı, T.C. kimlik no, dosya no gibi kişisel verileri bulanıklaştırın.
- İsteğe bağlı küçük tanıtım görseli 440×280.

## İnceleme notu (Reviewer notes)
UYAP portallarına yalnızca e-imza / e-Devlet ile giriş yapılabildiği için inceleme ekibine test hesabı verilemez. Eklenti yalnızca *.uyap.gov.tr üzerinde çalışır; kaynak kod GitHub'da açıktır.
