const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  const root = __dirname;
  const dist = path.join(root, 'dist');
  const libSrc = path.join(root, 'lib');
  const distLib = path.join(dist, 'lib');

  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(distLib, { recursive: true });

  await esbuild.build({
    entryPoints: ['src/content.ts'],
    bundle: true,
    outfile: 'dist/content.js',
    format: 'iife',
    platform: 'browser',
  });

  await esbuild.build({
    entryPoints: ['src/app.ts'],
    bundle: true,
    outfile: 'dist/app.js',
    format: 'iife',
    platform: 'browser',
  });

  fs.copyFileSync(
    path.join(root, 'manifest.json'),
    path.join(dist, 'manifest.json')
  );

  const iconDir = path.join(root, 'icons');
  if (fs.existsSync(iconDir)) {
    const files = fs.readdirSync(iconDir);
    const destIcons = path.join(dist, 'icons');
    fs.mkdirSync(destIcons, { recursive: true });
    for (const f of files) {
      fs.copyFileSync(path.join(iconDir, f), path.join(destIcons, f));
    }
  }

  const libFiles = [
    'videojs/video.min.js',
    'videojs/video-js.min.css',
    'videojs/videojs-playlist.js',
    'videojs/hotkeys.min.js',
    'videojs-vjsdownload/videojs-vjsdownload.js',
    'videojs-vjsdownload/videojs-vjsdownload.css',
    'videojs-framebyframe/videojs.framebyframe.js',
    'videojs-framebyframe/videojs.framebyframe.css',
    'magnific-popup/jquery.magnific-popup.js',
    'magnific-popup/magnific-popup.css',
  ];

  for (const file of libFiles) {
    const src = path.join(libSrc, file);
    const dest = path.join(distLib, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  console.log('Build complete → dist/');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
