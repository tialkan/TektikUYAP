// Sayfa (MAIN world) içinde çalışır. UYAP'ın AJAX yanıtlarındaki evrak kayıtlarını
// yakalar ve content script'e postMessage ile iletir. Hiçbir veri dışarı gönderilmez.
(() => {
  if (window.__tektikHooked) return;
  window.__tektikHooked = true;

  const post = (url, text) => {
    if (!text || text.length > 20_000_000) return;
    const t = text.trim();
    if (t[0] !== '{' && t[0] !== '[') return;
    if (!/evrak/i.test(t)) return;
    try {
      window.postMessage({ __tektik: true, url: String(url), data: JSON.parse(t) }, '*');
    } catch (_) {}
  };

  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await origFetch.apply(this, args);
    try { res.clone().text().then(t => post(res.url, t)).catch(() => {}); } catch (_) {}
    return res;
  };

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__tektikUrl = url;
    this.addEventListener('load', () => {
      try {
        if (this.responseType === '' || this.responseType === 'text') post(this.__tektikUrl, this.responseText);
        else if (this.responseType === 'json') post(this.__tektikUrl, JSON.stringify(this.response));
      } catch (_) {}
    });
    return origOpen.call(this, method, url, ...rest);
  };
})();
