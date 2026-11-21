# TektikUYAP

**Avukat UYAP, Bilirkişi UYAP ve Vatandaş UYAP** portallarında açtığınız dosyanın **tüm evraklarını tek tıkla, tek bir ZIP dosyası olarak** bilgisayarınıza indiren, tamamen açık kaynaklı Chrome eklentisi.

## Özellikler
- 3 portalı da destekler (`*.uyap.gov.tr`).
- Dosyayı açıp evrak listesini görüntülediğinizde evraklar otomatik bulunur.
- Evrakları tek tek seçebilir ya da hepsini indirebilirsiniz.
- Dosyalar sıra numarası, evrak türü ve tarihle adlandırılır; PDF/UDF/TIFF/JPG türü otomatik tanınır.
- İndirilemeyen evraklar ZIP içindeki `_HATALAR.txt` dosyasına yazılır.
- **Gizlilik:** Hiçbir veri üçüncü bir sunucuya gönderilmez. Eklenti yalnızca sizin açık UYAP oturumunuzla, tarayıcınızın içinde çalışır. Bağımlılık yoktur; ZIP oluşturucu dahil tüm kod bu depodadır.

## Kurulum (geliştirici modu)
1. Bu depoyu indirin: **Code → Download ZIP** ya da `git clone https://github.com/tialkan/TektikUYAP.git`
2. Chrome'da `chrome://extensions` adresini açın, sağ üstten **Geliştirici modu**nu açın.
3. **Paketlenmemiş öğe yükle** deyip depo klasörünü seçin.

## Kullanım
1. Avukat / Bilirkişi / Vatandaş UYAP'a giriş yapın.
2. İlgili mahkeme dosyasını açın ve evrak listesini (evrak ağacını) görüntüleyin.
3. Sağ alttaki kırmızı **⬇** düğmesine tıklayın → **Seçilenleri ZIP olarak indir**.

## Nasıl çalışır?
- `src/hook.js` UYAP sayfasının kendi AJAX yanıtlarını dinleyip `evrakId`/`dosyaId` içeren kayıtları yakalar; `src/content.js` ayrıca sayfadaki öğeleri tarar.
- Her evrak, ayarlardaki adres şablonuyla (varsayılan: `/download_document_brd.uyap?evrakId={evrakId}&dosyaId={dosyaId}`) oturum çerezlerinizle indirilir ve `src/zip.js` ile tek ZIP'te birleştirilir.

## Sorun giderme
UYAP indirme adresleri zaman zaman değişebilir. Evraklar indirilemiyorsa:
1. Portalda bir evrakı normal yoldan indirin, Geliştirici Araçları (F12) → **Ağ** sekmesinde indirme isteğinin adresine bakın.
2. Eklenti **Ayarlar** sayfasında ilgili portalın şablonunu bu adrese göre güncelleyin (`{evrakId}`, `{dosyaId}` yer tutucularıyla).
3. Çalışan şablonu bir *issue* veya *pull request* ile paylaşın ki herkes faydalansın.

## Katkı
Pull request'ler memnuniyetle karşılanır. Özellikle portal güncellemelerine uyum için katkılarınızı bekliyoruz.

## Yasal uyarı
Bu eklenti UYAP veya Adalet Bakanlığı ile bağlantılı değildir. Yalnızca kullanıcının yetkili olduğu dosyalara, kendi oturumuyla erişir. Kullanım sorumluluğu kullanıcıya aittir.

## Lisans
[MIT](LICENSE)
