const alanlar = ['avukat', 'bilirkisi', 'vatandas'];
async function yukle() {
  const s = await chrome.storage.sync.get({ templates: TEKTIK_DEFAULTS.templates, delayMs: TEKTIK_DEFAULTS.delayMs });
  alanlar.forEach(k => (document.getElementById(k).value = s.templates[k] || TEKTIK_DEFAULTS.templates[k]));
  document.getElementById('delayMs').value = s.delayMs;
}
document.getElementById('kaydet').onclick = async () => {
  const templates = {};
  alanlar.forEach(k => (templates[k] = document.getElementById(k).value.trim()));
  await chrome.storage.sync.set({ templates, delayMs: Number(document.getElementById('delayMs').value) || 0 });
  document.getElementById('durum').textContent = 'Kaydedildi.';
};
document.getElementById('sifirla').onclick = async () => { await chrome.storage.sync.clear(); yukle(); };
yukle();
