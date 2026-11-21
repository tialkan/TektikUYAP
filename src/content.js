// TektikUYAP — açık dosyanın evraklarını toplar ve tek ZIP olarak indirir.
// Tüm işlemler kullanıcının tarayıcısında, kendi UYAP oturumuyla yapılır; veri hiçbir sunucuya gönderilmez.
(() => {
  const portal = tektikPortal(location.hostname);
  const evraklar = new Map(); // evrakId -> {evrakId, dosyaId, ad, tarih}
  let sonDosyaId = null;
  let dosyaAdi = null;
  let dosyaBasligi = null; // ekranda görünen "2026/113 - ... Mahkemesi - ..." başlığı

  const ID_KEYS = ['evrakId', 'evrakID', 'evrak_id', 'evrakid'];
  const DOSYA_KEYS = ['dosyaId', 'dosyaID', 'dosya_id', 'dosyaid'];
  const AD_KEYS = ['evrakTuru', 'evrakTuruAciklama', 'aciklama', 'evrakAdi', 'turu', 'name', 'isim', 'text', 'tur'];
  const TARIH_KEYS = ['onayTarihi', 'sistemeGonderildigiTarih', 'evrakTarihi', 'tarih', 'olusturmaTarihi'];
  const NO_KEYS = ['dosyaNo', 'dosyaNumarasi', 'esasNo'];
  const BIRIM_KEYS = ['birimAdi', 'mahkemeAdi', 'yerelBirimAd'];

  const pick = (o, keys) => { for (const k of keys) if (o[k] != null && o[k] !== '') return o[k]; };

  let sonYargiTuru = null;
  const tirnaksiz = (v) => String(v).trim().replace(/^["']+|["']+$/g, '');

  function ekle(evrakId, dosyaId, ad, tarih, yargiTuru) {
    evrakId = tirnaksiz(evrakId);
    if (!/^[\w\-=+/@.]{3,}$/.test(evrakId)) return;
    if (dosyaId) dosyaId = tirnaksiz(dosyaId);
    // Başka bir dosya açıldıysa eski dosyanın evraklarını listeden çıkar
    if (dosyaId && sonDosyaId && dosyaId !== sonDosyaId) { evraklar.clear(); dosyaAdi = null; }
    if (dosyaId) sonDosyaId = dosyaId;
    if (yargiTuru) sonYargiTuru = String(yargiTuru);
    const eski = evraklar.get(evrakId) || {};
    evraklar.set(evrakId, {
      evrakId,
      dosyaId: dosyaId || eski.dosyaId,
      yargiTuru: yargiTuru ? String(yargiTuru) : eski.yargiTuru,
      ad: ad || eski.ad || 'evrak',
      tarih: tarih || eski.tarih || ''
    });
    guncelle();
  }

  // 1) Ağ yanıtlarından toplama
  function gez(node, ctxDosya, derinlik = 0) {
    if (!node || typeof node !== 'object' || derinlik > 25) return;
    if (Array.isArray(node)) { node.forEach(n => gez(n, ctxDosya, derinlik + 1)); return; }
    const d = pick(node, DOSYA_KEYS) || ctxDosya;
    const no = pick(node, NO_KEYS), birim = pick(node, BIRIM_KEYS);
    if (no || birim) dosyaAdi = [birim, no].filter(Boolean).join(' ') || dosyaAdi;
    const id = pick(node, ID_KEYS);
    if (id != null && typeof id !== 'object') ekle(id, d, pick(node, AD_KEYS), pick(node, TARIH_KEYS), node.yargiTuru);
    for (const v of Object.values(node)) if (v && typeof v === 'object') gez(v, d, derinlik + 1);
  }
  window.addEventListener('message', (e) => {
    if (e.source !== window || !e.data || e.data.__tektik !== true) return;
    gez(e.data.data, null);
  });

  // 2) Sayfadaki öğelerden toplama (ağaç düğümleri, bağlantılar, onclick)
  const RE = /evrak_?id["'\s:=]+["']*([\w\-=+/@.]{3,})/i;
  const RE_D = /dosya_?id["'\s:=]+["']*([\w\-=+/@.]{3,})/i;
  // Vatandaş/Bilirkişi portalı: evrak ağacı (span.file[evrak_id]); dosyaId ve yargı türü
  // ağacın yanındaki satır içi betikte downloadDoc($(this).attr('evrak_id'), '"<dosyaId>"', '<yargiTuru>') olarak bulunur.
  const RE_DL = /downloadDoc\(\s*\$\(this\)\.attr\(['"]evrak_id['"]\)\s*,\s*['"]+([^'"]+)['"]+\s*,\s*['"](\w+)['"]/;
  function agacTara() {
    const dugumler = document.querySelectorAll('[evrak_id]');
    if (!dugumler.length) return false;
    let dosyaId = null, yargiTuru = null;
    for (const sc of document.scripts) {
      const m = !sc.src && sc.textContent.match(RE_DL);
      if (m) { dosyaId = m[1]; yargiTuru = m[2]; }
    }
    // Dosya başlığı: "2026/113 - Bor 3. Asliye Ceza Mahkemesi - Talimat Dosyası" biçimindeki görünür başlık
    const baslik = [...document.querySelectorAll('.modal-title, h4, .caption')]
      .map(b => ({ b, t: b.textContent.trim().replace(/\s+/g, ' ') }))
      .find(({ b, t }) => b.getClientRects().length && t.length < 200 && /^\d{4}\/\d+\s*-/.test(t));
    dosyaBasligi = baslik ? baslik.t : null;
    // "Dosyaya Eklenen Son 20 Evrak" klasörü "Tüm Evraklar"ın kopyasıdır; tekrar indirmemek için atlanır
    const kopyaKlasor = (el) => {
      for (let li = el.closest('li'); li; li = li.parentElement && li.parentElement.closest('li')) {
        const k = li.querySelector(':scope > span.folder, :scope > span');
        if (k && /son\s*\d+\s*evrak/i.test(k.textContent)) return true;
      }
      return false;
    };
    const tumuVar = [...document.querySelectorAll('span.folder')].some(f => /t[üu]m evraklar/i.test(f.textContent));
    dugumler.forEach(el => {
      if (tumuVar && kopyaKlasor(el)) return;
      const li = el.closest('li');
      const ad = (li && li.getAttribute('data-sid')) || el.textContent;
      const parca = String(ad || '').trim().replace(/\s+/g, ' ');
      const t = parca.match(/(\d{2}\/\d{2}\/\d{4})$/);
      ekle(el.getAttribute('evrak_id'), dosyaId, t ? parca.slice(0, -t[1].length).trim() : parca.slice(0, 80), t ? t[1] : '', yargiTuru);
    });
    // Ağaç bulunduysa, dosyaya bağlanamayan (genel taramadan gelen) kayıtları at
    if (dosyaId) for (const [k, v] of evraklar) if (!v.dosyaId) evraklar.delete(k);
    guncelle();
    return true;
  }
  function domTara() {
    if (agacTara()) return;
    document.querySelectorAll('[data-evrak-id],[evrakid],[data-evrakid],a[href*="evrakId" i],[onclick*="evrak" i],[id*="evrak" i]').forEach(el => {
      const attrs = Array.from(el.attributes).map(a => `${a.name}=${a.value}`).join(' ');
      const m = attrs.match(RE) || (el.dataset.evrakId && [0, el.dataset.evrakId]);
      if (!m) return;
      const dm = attrs.match(RE_D);
      const ad = (el.getAttribute('title') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      ekle(m[1], dm && dm[1], ad);
    });
  }

  // Arayüz
  const kok = document.createElement('div');
  kok.id = 'tektik-root';
  kok.innerHTML = `
    <button id="tektik-fab" title="TektikUYAP: Evrakları indir">⬇ <span id="tektik-sayi">0</span></button>
    <div id="tektik-panel" hidden>
      <div class="tk-bas"><b>TektikUYAP</b><button id="tektik-kapat" aria-label="Kapat">×</button></div>
      <p class="tk-ipucu">Dosyayı UYAP'ta açın ve evrak listesini görüntüleyin. Bulunan evraklar burada listelenir.</p>
      <div class="tk-arac">
        <label><input type="checkbox" id="tektik-hepsi" checked> Tümü</label>
        <button id="tektik-tara">Sayfayı tara</button>
        <button id="tektik-temizle">Listeyi temizle</button>
      </div>
      <ul id="tektik-liste"></ul>
      <button id="tektik-indir" class="tk-ana">Seçilenleri ZIP olarak indir</button>
      <div id="tektik-durum"></div>
    </div>`;
  document.documentElement.appendChild(kok);
  const $ = (s) => kok.querySelector(s);

  function guncelle() {
    $('#tektik-sayi').textContent = evraklar.size;
    if ($('#tektik-panel').hidden) return;
    const ul = $('#tektik-liste');
    // Liste değişmediyse yeniden çizme (kullanıcının işaretlemeleri korunur)
    const imza = [...evraklar.keys()].join('|');
    if (ul.dataset.imza === imza) return;
    const oncekiler = new Set([...ul.querySelectorAll('input')].map(i => i.value));
    ul.dataset.imza = imza;
    const secili = new Set([...ul.querySelectorAll('input:checked')].map(i => i.value));
    const ilk = ul.children.length === 0;
    ul.innerHTML = '';
    for (const e of evraklar.values()) {
      const li = document.createElement('li');
      const cb = document.createElement('input');
      cb.type = 'checkbox'; cb.value = e.evrakId;
      cb.checked = ilk || secili.has(e.evrakId) || (!oncekiler.has(e.evrakId) && $('#tektik-hepsi').checked);
      const sp = document.createElement('span');
      sp.textContent = `${e.ad}${e.tarih ? ' — ' + e.tarih : ''}`;
      li.append(cb, sp);
      ul.appendChild(li);
    }
  }

  $('#tektik-fab').onclick = () => { domTara(); $('#tektik-panel').hidden = !$('#tektik-panel').hidden; guncelle(); };
  $('#tektik-kapat').onclick = () => { $('#tektik-panel').hidden = true; };
  $('#tektik-tara').onclick = () => { domTara(); guncelle(); };
  $('#tektik-temizle').onclick = () => { evraklar.clear(); dosyaAdi = null; const ul = $('#tektik-liste'); ul.innerHTML = ''; delete ul.dataset.imza; guncelle(); };
  $('#tektik-hepsi').onchange = (e) => $('#tektik-liste').querySelectorAll('input').forEach(i => (i.checked = e.target.checked));

  const durum = (t) => ($('#tektik-durum').textContent = t);
  const temiz = (s) => String(s).replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 120) || 'evrak';

  function uzanti(res, bytes) {
    const cd = res.headers.get('content-disposition') || '';
    const m = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)/i);
    if (m) { const x = decodeURIComponent(m[1]).match(/\.(\w{2,5})$/); if (x) return x[1].toLowerCase(); }
    const h = String.fromCharCode(...bytes.slice(0, 5));
    if (h.startsWith('%PDF')) return 'pdf';
    if (h.startsWith('PK')) return 'udf'; // UYAP UDF belgeleri ZIP tabanlıdır
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpg';
    if (h.startsWith('\x89PNG')) return 'png';
    if (h.startsWith('II*') || h.startsWith('MM')) return 'tif';
    const ct = res.headers.get('content-type') || '';
    if (/udf|octet/.test(ct)) return 'udf';
    if (/xml/.test(ct)) return 'xml';
    return 'bin';
  }

  async function ayarlar() {
    const s = await chrome.storage.sync.get({ templates: TEKTIK_DEFAULTS.templates, delayMs: TEKTIK_DEFAULTS.delayMs });
    return { tpl: s.templates[portal] || TEKTIK_DEFAULTS.templates[portal], delayMs: Number(s.delayMs) || 0 };
  }

  $('#tektik-indir').onclick = async () => {
    const ids = [...$('#tektik-liste').querySelectorAll('input:checked')].map(i => i.value);
    if (!ids.length) return durum('Seçili evrak yok.');
    const btn = $('#tektik-indir');
    btn.disabled = true;
    const { tpl, delayMs } = await ayarlar();
    const dosyalar = [], hatalar = [];
    const kullanilan = new Set();
    for (let i = 0; i < ids.length; i++) {
      const e = evraklar.get(ids[i]);
      durum(`İndiriliyor ${i + 1}/${ids.length}: ${e.ad}`);
      const yt = e.yargiTuru || sonYargiTuru || '1';
      let adres = tpl;
      // UYAP, Danıştay (2) ve Yargıtay (3) evrakları için ayrı indirme servisleri kullanır
      if (yt === '2') adres = adres.replace('download_document_brd', 'download_document_danistay_brd');
      if (yt === '3') adres = adres.replace('download_document_brd', 'download_document_yargitay_brd');
      const url = new URL(
        adres.replace('{evrakId}', encodeURIComponent(e.evrakId))
          .replace('{dosyaId}', encodeURIComponent(e.dosyaId || sonDosyaId || ''))
          .replace('{yargiTuru}', encodeURIComponent(yt)),
        location.origin
      );
      try {
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const bytes = new Uint8Array(await res.arrayBuffer());
        const bas = new TextDecoder().decode(bytes.slice(0, 200)).trim().toLowerCase();
        if (bas.startsWith('<!doctype html') || bas.startsWith('<html')) throw new Error('evrak yerine sayfa döndü (oturum süresi dolmuş ya da adres şablonu hatalı olabilir)');
        let ad = `${String(i + 1).padStart(3, '0')} - ${temiz(e.ad)}${e.tarih ? ' - ' + temiz(e.tarih) : ''}`;
        let tam = `${ad}.${uzanti(res, bytes)}`;
        for (let n = 2; kullanilan.has(tam); n++) tam = `${ad} (${n}).${uzanti(res, bytes)}`;
        kullanilan.add(tam);
        dosyalar.push({ name: tam, data: bytes });
      } catch (err) {
        hatalar.push(`${e.ad} (${e.evrakId}): ${err.message}`);
      }
      if (delayMs) await new Promise(r => setTimeout(r, delayMs));
    }
    if (!dosyalar.length) {
      btn.disabled = false;
      return durum(`Hiçbir evrak indirilemedi. İlk hata: ${hatalar[0] || '-'}. Ayarlar'dan adres şablonunu kontrol edin.`);
    }
    const basarili = dosyalar.length;
    if (hatalar.length) dosyalar.push({ name: '_HATALAR.txt', data: new TextEncoder().encode(hatalar.join('\r\n')) });
    const zip = TektikZip.build(dosyalar);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zip);
    a.download = `${temiz(dosyaBasligi || dosyaAdi || 'UYAP Dosya ' + (sonDosyaId || ''))} - evraklar.zip`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
    btn.disabled = false;
    durum(`Tamamlandı: ${basarili} evrak indirildi${hatalar.length ? `, ${hatalar.length} hata (_HATALAR.txt)` : ''}.`);
  };

  // Sayfa sürekli değiştiği (saat vb.) için erteleme yerine en fazla 700 ms'de bir tara
  // Ek güvence: bazı tarayıcılarda gözlemci tetiklenmeyebildiği için sekme görünürken düzenli tara
  setInterval(() => { if (!document.hidden) domTara(); }, 1500);
  let bekleyen = false;
  new MutationObserver(() => {
    if (bekleyen) return;
    bekleyen = true;
    setTimeout(() => { bekleyen = false; domTara(); }, 700);
  })
    .observe(document.documentElement, { childList: true, subtree: true });
  domTara();
})();
