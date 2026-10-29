(() => {
  const hostId = 'stake-floating-panel-host';
  let host = document.getElementById(hostId);

  if (host) return;

  host = document.createElement('div');
  host.id = hostId;
  host.style.cssText =
    'position:fixed;top:24px;right:24px;width:min(720px,calc(100vw - 48px));height:min(720px,calc(100vh - 48px));z-index:2147483647;border-radius:16px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.55);background:#071824;border:1px solid rgba(56,189,248,.35)';

  const frame = document.createElement('iframe');
  frame.src = chrome.runtime.getURL('index.html#panel');
  frame.title = 'Stake floating panel';
  frame.style.cssText =
    'width:100%;height:100%;border:0;background:#071824';

  host.appendChild(frame);
  document.documentElement.appendChild(host);

  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'MG_ALPHA_CLOSE_OVERLAY') {
      host.remove();
    }
  });
})();
