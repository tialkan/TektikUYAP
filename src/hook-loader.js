// Sayfa bağlamına ağ dinleyicisini enjekte eder (evrak listelerini yakalamak için).
(() => {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('src/hook.js');
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);
})();
