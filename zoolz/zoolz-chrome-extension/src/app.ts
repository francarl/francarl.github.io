declare var Refresh: (isAfterSearch?: boolean) => void;
declare var $: any;
declare var videojs: any;
declare var hotkeys: any;
interface ZoomRotate {
  rotate: number;
  zoom: number;
}

interface SourceItem {
  sources: Array<{ src: string; type: string; title: string }>;
  idx: string;
  obj: any;
}

let machineId: string;
let randomId: number;
let videoplayer: any = null;
let sources: SourceItem[] = [];
let autoAdvance = false;
let zoomrotate: ZoomRotate = { rotate: 0, zoom: 1 };

// ponytail: set page globals consumed by Zoolz site
(window as any)._pageLimit = 5000;
(window as any).UPLOAD_LIMIT = 1;

function init() {
  const vault = $('li[title="Vault"]');
  machineId = vault.attr('data-value');
  randomId = Math.floor(Math.random() * 200) + 1;

  injectCustomStyles();
  injectPlayerHTML();
  setupPlayer();
  overrideRefresh();
  fixFileNames();
  watchForElements();

  $('.ovBtns > a', '#viewerDiv').each(function (this: any) {
    attachVideo($(this));
  });
}

function injectCustomStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .player {
      width: 80%;
      margin-left: auto;
      margin-right: auto;
      background: black;
    }
    .fileDiv .ovBtns {
      display: inherit !important;
    }
    .fileDiv > div:first-child {
      width: 50% !important;
    }
    .ovCP {
      background: url(../MyComputers/imgs/right_click_move.png) no-repeat center center;
    }
    .zoolz-toast {
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.85);
      color: #fff;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 14px;
      font-family: sans-serif;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .zoolz-toast.show { opacity: 1; }
  `;
  document.head.appendChild(style);
}

function injectPlayerHTML() {
  const div = document.createElement('div');
  div.id = 'test-popup' + randomId;
  div.className = 'player mfp-hide';
  div.innerHTML = `
    <video id="zoolz-player${randomId}" class="video-js vjs-default-skin vjs-16-9" controls preload="auto">
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
      </p>
    </video>
    <span id="current-item-title" style="color: white;"></span>
  `;
  document.body.appendChild(div);
}

function setupPlayer() {
  const options = {
    controls: true,
    techOrder: ['html5'],
    plugins: {
      vjsdownload: {
        beforeElement: 'playbackRateMenuButton',
        textControl: 'Download video',
        name: 'downloadButton',
      },
      framebyframe: {
        fps: 60,
        steps: [
          { text: '< 1f', step: -1 },
          { text: '1f >', step: 1 },
        ],
      },
    },
    playbackRates: [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0, 1.5, 2.0, 4.0, 8.0],
    muted: true,
    controlBar: {
      pictureInPictureToggle: false,
    },
  };

  videoplayer = videojs('zoolz-player' + randomId, options);

  setupHotkeys();
  registerCustomButtons();

  videoplayer.on('playlistitem', () => {
    const currentItem = videoplayer.currentSource();
    const titleDisplay = document.getElementById('current-item-title');
    if (titleDisplay) {
      titleDisplay.textContent = decodeURIComponent(currentItem.title);
    }
  });

  const zoomPlugin = videoplayer.zoomPlugin({
    showZoom: true,
    showMove: true,
    showRotate: true,
    gestureHandler: true,
  });
  zoomPlugin.enablePlugin();

  const videoTech: HTMLVideoElement | null = videoplayer.el().querySelector('.vjs-tech');
  videoplayer.on('loadedmetadata', () => {
    const cur = videoplayer.currentSource();
    if (cur && videoTech && videoTech.videoHeight > videoTech.videoWidth) {
      const scale = videoTech.videoHeight / videoTech.videoWidth;
      zoomrotate.zoom = scale;
      zoomrotate.rotate = -90;
      zoomPlugin.rotate(-90);
      zoomPlugin.zoom(scale);
    } else {
      zoomrotate.zoom = 1;
      zoomrotate.rotate = 0;
      zoomPlugin.rotate(0);
      zoomPlugin.zoom(1);
    }
  });
}

function setupHotkeys() {
  hotkeys('alt+r,alt+z,alt+x,n,m,k,l', function (_event: any, handler: { key: string }) {
    const vi: HTMLElement = videoplayer.children()[0];
    switch (handler.key) {
      case 'alt+r':
        zoomrotate.rotate += 90;
        vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';
        break;
      case 'alt+z':
        zoomrotate.zoom += 0.1;
        vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';
        break;
      case 'alt+x':
        zoomrotate.zoom -= 0.1;
        vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';
        break;
      case 'n':
        videoplayer.currentTime(videoplayer.currentTime() - 10);
        videoplayer.play();
        break;
      case 'm':
        videoplayer.currentTime(videoplayer.currentTime() + 10);
        videoplayer.play();
        break;
      case 'k':
        videoplayer.pause();
        videoplayer.currentTime(videoplayer.currentTime() - 1 / 60);
        break;
      case 'l':
        videoplayer.pause();
        videoplayer.currentTime(videoplayer.currentTime() + 1 / 60);
        break;
    }
  });
}

function registerCustomButtons() {
  const Button = videojs.getComponent('Button');

  // Rotate
  const RotateButton = videojs.extend(Button, {
    constructor: function (this: any, player: any, options: any) {
      Button.call(this, player, options);
      this.controlText('Rotate +90');
    },
    handleClick: function (this: any) {
      const vi: HTMLElement = videoplayer.children()[0];
      zoomrotate.rotate += 90;
      vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';
    },
    buildCSSClass: function (this: any) {
      return 'vjs-icon-replay vjs-control vjs-button';
    },
  });
  videojs.registerComponent('customRotateButton', RotateButton);
  videoplayer.getChild('controlBar').addChild('customRotateButton', {});

  // Zoom out
  const ZoomOutButton = videojs.extend(Button, {
    constructor: function (this: any, player: any, options: any) {
      Button.call(this, player, options);
      this.controlText('Zoom out');
    },
    handleClick: function (this: any) {
      const vi: HTMLElement = videoplayer.children()[0];
      zoomrotate.zoom += 0.1;
      vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';
    },
    buildCSSClass: function (this: any) {
      return 'vjs-icon-circle-outline vjs-control vjs-button';
    },
  });
  videojs.registerComponent('customZoomoutButton', ZoomOutButton);
  videoplayer.getChild('controlBar').addChild('customZoomoutButton', {});

  // Zoom in
  const ZoomInButton = videojs.extend(Button, {
    constructor: function (this: any, player: any, options: any) {
      Button.call(this, player, options);
      this.controlText('Zoom in');
    },
    handleClick: function (this: any) {
      const vi: HTMLElement = videoplayer.children()[0];
      zoomrotate.zoom -= 0.1;
      vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';
    },
    buildCSSClass: function (this: any) {
      return 'vjs-icon-circle vjs-control vjs-button';
    },
  });
  videojs.registerComponent('customZoominButton', ZoomInButton);
  videoplayer.getChild('controlBar').addChild('customZoominButton', {});

  // Prev
  const PrevButton = videojs.extend(Button, {
    constructor: function (this: any, player: any, options: any) {
      Button.call(this, player, options);
      this.controlText('Prev');
    },
    handleClick: function (this: any) {
      videoplayer.playlist.previous();
    },
    buildCSSClass: function (this: any) {
      return 'vjs-icon-previous-item vjs-control vjs-button';
    },
  });
  videojs.registerComponent('customPrevButton', PrevButton);
  videoplayer.getChild('controlBar').addChild('customPrevButton', {});

  // Next
  const NextButton = videojs.extend(Button, {
    constructor: function (this: any, player: any, options: any) {
      Button.call(this, player, options);
      this.controlText('Next');
    },
    handleClick: function (this: any) {
      videoplayer.playlist.next();
    },
    buildCSSClass: function (this: any) {
      return 'vjs-icon-next-item vjs-control vjs-button';
    },
  });
  videojs.registerComponent('customNextButton', NextButton);
  videoplayer.getChild('controlBar').addChild('customNextButton', {});

  // Toggle autoadvance
  const ToggleAutoAdvanceButton = videojs.extend(Button, {
    constructor: function (this: any, player: any, options: any) {
      Button.call(this, player, options);
      this.controlText('Autoadvance OFF');
    },
    handleClick: function (this: any) {
      autoAdvance = !autoAdvance;
      if (autoAdvance) {
        videoplayer.playlist.autoadvance(0);
      } else {
        videoplayer.playlist.autoadvance();
      }
      this.controlText('Autoadvance ' + (autoAdvance ? 'ON' : 'OFF'));
    },
    buildCSSClass: function (this: any) {
      return 'vjs-icon-audio-description vjs-control vjs-button';
    },
  });
  videojs.registerComponent('toggleAutoAdvanceButton', ToggleAutoAdvanceButton);
  videoplayer.getChild('controlBar').addChild('toggleAutoAdvanceButton', {});
}

function attachVideo(newElem: any) {
  const originalURL = newElem.attr('onclick');
  const regex = /q=[\w=]+/g;
  const titleRegex = /filename%3D%22(.+)%22/;
  let m: RegExpMatchArray | null = null;
  try {
    m = originalURL.match(regex);
  } catch (_) { /* empty */ }
  if (!m) return;

  const newUrl = 'MyComputers/Download.aspx?' + m[0];

  $.ajax({
    url: newUrl,
    type: 'GET',
    async: true,
    headers: {
      PC_INDEX: machineId,
      S_KEY: 'Client',
      IS_FOR_COLD_STORAGE: false,
    },
    success: function (data: any, _textStatus: string, request: any) {
      const durl: string = request.getResponseHeader('downloadUrl');
      newElem.attr('href', durl);

      let title = 'N/D';
      try {
        const match = durl.match(titleRegex);
        if (match) title = match[1];
      } catch (_) { /* empty */ }

      sources.push({
        sources: [
          {
            src: durl,
            type: 'video/mp4',
            title: decodeURIComponent(title),
          },
        ],
        idx: newElem.attr('idx'),
        obj: newElem,
      });

      newElem
        .unbind('click')
        .attr('onclick', '')
        .each(function (this: any) {
          this.onclick = null;
        });

      newElem.children('div').removeClass('ovDF').addClass('ovVI').addClass('ovSel');

      // Copy button
      const aCP = $("<a href='#' title='Copy'><div class='ovCP'></div></a>");
      aCP.attr('href', durl);
      aCP.click(function (this: any, event: any) {
        event.stopPropagation();
        const url = $(this).attr('href') as string;
        navigator.clipboard.writeText(url).then(
          () => showToast('URL copied to clipboard'),
          () => showToast('Clipboard API not supported')
        );
        return false;
      });
      newElem.parent().append(aCP);

      // Click handler
      const ua = navigator.userAgent.toLowerCase();
      const isAndroid = ua.indexOf('android') > -1;

      if (isAndroid) {
        newElem.click(function (this: any, event: any) {
          event.stopPropagation();
          $('.ovSel').css('border', 'none');
          newElem.children('.ovSel').css('border', '1px solid red');

          let downloadUrl = newElem.attr('href') as string;
          downloadUrl =
            downloadUrl.replace('https:', 'intent:') +
            '#Intent;action=android.intent.action.VIEW;scheme=https;type=video/mp4;end';
          window.location.href = downloadUrl;
          return false;
        });
      } else {
        newElem.click(function (this: any, event: any) {
          event.stopPropagation();
          $('.ovSel').css('border', 'none');
          newElem.children('.ovSel').css('border', '1px solid red');

          sources.sort((a, b) => {
            const ka = +a.idx;
            const kb = +b.idx;
            return ka < kb ? -1 : ka > kb ? 1 : 0;
          });

          videoplayer.playlist(sources);
          const idx = videoplayer.playlist.indexOf(durl);
          videoplayer.playlist.currentItem(idx);
          videoplayer.play();

          videoplayer.off('playlistitem');
          videoplayer.on('playlistitem', function () {
            const curIdx = videoplayer.playlist.currentIndex();
            const curElem = sources[curIdx].obj;
            $('.ovSel').css('border', 'none');
            curElem.children('.ovSel').css('border', '1px solid red');
          });

          $.magnificPopup.open({
            items: { src: '#test-popup' + randomId, type: 'inline' },
            callbacks: {
              close: function () {
                videoplayer.pause();
                videoplayer.src('');
              },
            },
          });

          return false;
        });
      }
    },
    error: function (error: any) {
      console.log(error);
    },
  });
}

function overrideRefresh() {
  const originalRefresh = Refresh;
  Refresh = function (isAfterSearch?: boolean) {
    sources = [];
    originalRefresh(isAfterSearch);
  };
}

function fixFileNames() {
  $('.fileDiv').each(function (this: any) {
    const linkSpan = $(this).find('.LinkSpan');
    if (linkSpan.length) {
      const name = $(this).data('filename');
      linkSpan.text(name);
    }
  });
}

function watchForElements() {
  const viewerDiv = document.getElementById('viewerDiv');
  if (!viewerDiv) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const el = node as Element;

        if (el.matches && el.matches('.ovBtns > a')) {
          attachVideo($(el));
        }
        if (el.querySelectorAll) {
          el.querySelectorAll('.ovBtns > a').forEach((child) =>
            attachVideo($(child))
          );
        }

        if (el.matches && el.matches('.fileDiv')) {
          fixFileNameEl(el);
        }
        if (el.querySelectorAll) {
          el.querySelectorAll('.fileDiv').forEach((child) =>
            fixFileNameEl(child)
          );
        }
      }
    }
  });

  observer.observe(viewerDiv, { childList: true, subtree: true });
}

function fixFileNameEl(el: Element) {
  const linkSpan = $(el).find('.LinkSpan');
  if (linkSpan.length) {
    const name = $(el).data('filename');
    linkSpan.text(name);
  }
}

function showToast(message: string) {
  let $toast = $('#zoolz-toast');
  if ($toast.length === 0) {
    $('body').append('<div id="zoolz-toast" class="zoolz-toast"></div>');
    $toast = $('#zoolz-toast');
  }
  $toast.text(message).addClass('show');
  setTimeout(() => $toast.removeClass('show'), 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export {};
