declare const chrome: any;

const BASE = chrome.runtime.getURL('');

function loadCSS(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`CSS load failed: ${url}`));
    document.head.appendChild(link);
  });
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Script load failed: ${url}`));
    document.head.appendChild(s);
  });
}

async function init() {
  const lib = (p: string) => `${BASE}lib/${p}`;

  const cssFiles = [
    'videojs/video-js.min.css',
    'magnific-popup/magnific-popup.css',
    'videojs-vjsdownload/videojs-vjsdownload.css',
    'videojs-framebyframe/videojs.framebyframe.css',
    'videojs-zoom/videojs-zoom.css',
  ];

  await Promise.all(cssFiles.map(f => loadCSS(lib(f))));

  const urls = [
    lib('videojs/video.min.js'),
    lib('videojs/videojs-playlist.js'),
    lib('videojs-vjsdownload/videojs-vjsdownload.js'),
    lib('videojs-framebyframe/videojs.framebyframe.js'),
    lib('videojs/hotkeys.min.js'),
    lib('videojs-zoom/videojs-zoom.js'),
    lib('magnific-popup/jquery.magnific-popup.js'),
  ];

  for (const url of urls) {
    await loadScript(url);
  }

  await loadScript(`${BASE}app.js`);
}

init().catch(console.error);

export {};
