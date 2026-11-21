// Portal başına varsayılan evrak indirme adresi şablonları.
// {evrakId}, {dosyaId} yer tutucuları doldurulur. Adres göreli ise açık olan portalın alan adı kullanılır.
// UYAP adresleri değişirse Ayarlar sayfasından güncellenebilir.
const TEKTIK_DEFAULTS = {
  templates: {
    avukat: '/download_document_brd.uyap?evrakId={evrakId}&dosyaId={dosyaId}',
    bilirkisi: '/download_document_brd.uyap?evrakId={evrakId}&dosyaId={dosyaId}',
    vatandas: '/download_document_brd.uyap?evrakId={evrakId}&dosyaId={dosyaId}'
  },
  delayMs: 400
};
function tektikPortal(host) {
  if (/avukat/i.test(host)) return 'avukat';
  if (/bilirkisi/i.test(host)) return 'bilirkisi';
  if (/vatandas/i.test(host)) return 'vatandas';
  return 'avukat';
}
