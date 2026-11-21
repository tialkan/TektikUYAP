// Portal başına varsayılan evrak indirme adresi şablonları.
// {evrakId}, {dosyaId}, {yargiTuru} yer tutucuları doldurulur. Adres göreli ise açık olan portalın alan adı kullanılır.
// UYAP adresleri değişirse Ayarlar sayfasından güncellenebilir.
// Not: Avukat portalı yargiTuru parametresini yok sayar; Vatandaş/Bilirkişi portalı kullanır.
const TEKTIK_DEFAULTS = {
  templates: {
    avukat: '/download_document_brd.uyap?evrakId={evrakId}&dosyaId={dosyaId}&yargiTuru={yargiTuru}',
    bilirkisi: '/download_document_brd.uyap?evrakId={evrakId}&dosyaId={dosyaId}&yargiTuru={yargiTuru}',
    vatandas: '/download_document_brd.uyap?evrakId={evrakId}&dosyaId={dosyaId}&yargiTuru={yargiTuru}'
  },
  delayMs: 400
};
function tektikPortal(host) {
  if (/avukat/i.test(host)) return 'avukat';
  if (/bilirkisi/i.test(host)) return 'bilirkisi';
  if (/vatandas/i.test(host)) return 'vatandas';
  return 'avukat';
}
