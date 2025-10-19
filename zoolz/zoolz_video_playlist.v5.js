_pageLimit = 5000;
UPLOAD_LIMIT = 1


var vault = $('li[title="Vault"]');
var machineId = vault.attr("data-value");
var randomId = Math.floor(Math.random() * 200) + 1;
var videoplayer = null;


$("head").append("<link href='https://francarl.github.io/zoolz/lib/videojs/video-js.min.css' rel='stylesheet' >");
$("head").append("<link href='https://francarl.github.io/zoolz/lib/magnific-popup/magnific-popup.css' rel='stylesheet'  >");
$("head").append("<link href='https://francarl.github.io/zoolz/lib/videojs-chromecast/silvermine-videojs-chromecast.css' rel='stylesheet' >");
$("head").append("<link href='https://francarl.github.io/zoolz/lib/videojs-vjsdownload/videojs-vjsdownload.css' rel='stylesheet'>");
$("head").append("<link href='https://francarl.github.io/zoolz/lib/videojs-framebyframe/videojs.framebyframe.css' rel='stylesheet'>");
$("head").append("<link href='https://francarl.github.io/zoolz/lib/videojs-xr/videojs-xr.css' rel='stylesheet'>");
$("head").append("<link href='https://francarl.github.io/zoolz/lib/videojs-zoom/videojs-zoom.css' rel='stylesheet'>");



var newStyle = `<style>  
	.video-js .vjs-tech {  
	  position: relative;  
	  height: inherit;     
	}                      
	.player {              
	  width: 80%;          
	  margin-left: auto;   
	  margin-right: auto;  
	  background:black;    
	}                      
	.fileDiv .ovBtns {     
      display: inherit !important; 
	} 
    .fileDiv > div:first-child {     
      width: 50% !important; 
	}
	.ovCP
    {
	  background: url(../MyComputers/imgs/right_click_move.png) no-repeat center center;
    }
</style>`;

$("head").append(newStyle);


$("body").append("<div id='test-popup" + randomId + "' class='player mfp-hide'>        \
    <video id='zoolz-player" + randomId + "' class='video-js vjs-default-skin' controls preload='auto'      \
      style='height:auto; width:100%'      \
      >      \
        <p class='vjs-no-js'>To view this video please enable JavaScript, and consider upgrading to a web browser that <a href='http://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a></p>  \
    </video>    \
	<span id=\"current-item-title\" style=\"color: white;\"></span>  \
</div>");

// data-setup='{ \"playbackRates\": [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0, 1.5, 2.0] }'
//$("#bcDivP").css("width", "470px")
//$("#controlsDiv").prepend("<a id='RefreshLink' href='javascript:void(0)' onclick='RefreshComputerFirst()' draggable='false' title='Refresh'>  <div id='RefreshButtonDiv' class='ctrlDiv ctrA'>  <div id='RefreshIn' class='icnR DownloadIcn'> </div>  <span class='LinkSpan'></span> </div> </a>");


// use in chrome console: sources.map(i => i.sources[0].src) to extract all urls
var sources = [];

var autoAdvance = false;

$.getScript('https://francarl.github.io/zoolz/lib/videojs/video.min.js', function () {

	$.getScript('https://francarl.github.io/zoolz/lib/videojs/videojs-playlist.js', function () {

    window.SILVERMINE_VIDEOJS_CHROMECAST_CONFIG = {
        preloadWebComponents: true,
    };	

	$.getScript('https://francarl.github.io/zoolz/lib/videojs-chromecast/silvermine-videojs-chromecast.js', function () {

	$.getScript('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1', function () {

	$.getScript('https://francarl.github.io/zoolz/lib/videojs-vjsdownload/videojs-vjsdownload.js', function () {	

	$.getScript('https://francarl.github.io/zoolz/lib/videojs-framebyframe/videojs.framebyframe.js', function () {	

	$.getScript('https://francarl.github.io/zoolz/lib/videojs-xr/videojs-xr.js', function () {	

	$.getScript('https://francarl.github.io/zoolz/lib/videojs/hotkeys.min.js', function () {	

	$.getScript('https://francarl.github.io/zoolz/lib/videojs-zoom/videojs-zoom.js', function () {	

		var options = {
		   controls: true,
		   techOrder: [ 'chromecast', 'html5' ], // You may have more Tech, such as Flash or HLS
		   plugins: {
			  chromecast: {
			  },
			  vjsdownload:{
	              beforeElement: 'playbackRateMenuButton',
	              textControl: 'Download video',
	              name: 'downloadButton'
	          },
			  framebyframe: {
                  fps: 60,
			      steps: [
			        { text: '< 1f', step: -1 },
			        { text: '1f >', step: 1 }
			      ]
			  }
		   },
		   playbackRates: [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0, 1.5, 2.0, 4.0, 8.0],
		   muted: true,
		   controlBar: {
		       pictureInPictureToggle: false
		   }
		};

		var zoomrotate = { 
			rotate: 0, 
			zoom: 1
		};

		hotkeys('alt+r,alt+z,alt+x,n,m,k,l', function (event, handler){
		  	var vi = videoplayer.children()[0];
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
					var dist = -1/60;
					videoplayer.currentTime(videoplayer.currentTime() + dist);
					break;
				case 'l':
					videoplayer.pause();
					var dist = 1/60;
					videoplayer.currentTime(videoplayer.currentTime() + dist);
					break;	
			    default: 
			  }
		});

		videoplayer = videojs('zoolz-player' + randomId, options);

        // rotate
		var vjsButton = videojs.getComponent("Button");
		var customRotateButton = videojs.extend(vjsButton, {
		   constructor: function(player, options) {
			vjsButton.call(this, player, options);
				this.controlText("Rotate +90");
		   },
		   handleClick: function() {
				//do something on click for example
				var vi = videoplayer.children()[0];
				// var poster = videoplayer.el_; // div vjs-poster

				zoomrotate.rotate += 90;
				vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';	
				// poster.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';	
		   },
		   buildCSSClass: function() {
				return "vjs-icon-replay vjs-control vjs-button";
		   }
		});
		videojs.registerComponent("customRotateButton", customRotateButton);
		videoplayer.getChild("controlBar").addChild("customRotateButton", {});


		// zoom out
		var vjsButton = videojs.getComponent("Button");
		var customZoomoutButton = videojs.extend(vjsButton, {
		   constructor: function(player, options) {
			vjsButton.call(this, player, options);
				this.controlText("Zoom out");
		   },
		   handleClick: function() {
				//do something on click for example
				var vi = videoplayer.children()[0];
				var poster = videoplayer.el_; // div vjs-poster

				zoomrotate.zoom += 0.1;
				vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';	
				// poster.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';	
		   },
		   buildCSSClass: function() {
				return "vjs-icon-circle-outline vjs-control vjs-button";
		   }
		});
		videojs.registerComponent("customZoomoutButton", customZoomoutButton);
		videoplayer.getChild("controlBar").addChild("customZoomoutButton", {});

		// zoom in
		var vjsButton = videojs.getComponent("Button");
		var customZoominButton = videojs.extend(vjsButton, {
		   constructor: function(player, options) {
			vjsButton.call(this, player, options);
				this.controlText("Zoom in");
		   },
		   handleClick: function() {
				//do something on click for example
				var vi = videoplayer.children()[0];
				var poster = videoplayer.el_; // div vjs-poster

				zoomrotate.zoom -= 0.1;
				vi.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';	
				// poster.style.transform = 'scale(' + zoomrotate.zoom + ') rotate(' + zoomrotate.rotate + 'deg)';	
		   },
		   buildCSSClass: function() {
				return "vjs-icon-circle vjs-control vjs-button";
		   }
		});
		videojs.registerComponent("customZoominButton", customZoominButton);
		videoplayer.getChild("controlBar").addChild("customZoominButton", {});

        // prev 
        var customPrevButton = videojs.extend(vjsButton, {
		   constructor: function(player, options) {
			vjsButton.call(this, player, options);
				this.controlText("Prev");
		   },
		   handleClick: function() {
				videoplayer.playlist.previous();
		   },
		   buildCSSClass: function() {
				return "vjs-icon-previous-item vjs-control vjs-button";
		   }
		});

		videojs.registerComponent("customPrevButton", customPrevButton);
		videoplayer.getChild("controlBar").addChild("customPrevButton", {});

        // next 
        var customNextButton = videojs.extend(vjsButton, {
		   constructor: function(player, options) {
			vjsButton.call(this, player, options);
				this.controlText("Next");
		   },
		   handleClick: function() {
				videoplayer.playlist.next();
		   },
		   buildCSSClass: function() {
				return "vjs-icon-next-item vjs-control vjs-button";
		   }
		});

		videojs.registerComponent("customNextButton", customNextButton);
		videoplayer.getChild("controlBar").addChild("customNextButton", {});

		 // toggle autoadvance 
        var toggleAutoAdvanceButton = videojs.extend(vjsButton, {
		   constructor: function(player, options) {
				vjsButton.call(this, player, options);
				this.controlText("Autoadvance OFF");
		   },
		   handleClick: function() {
			   autoAdvance = !autoAdvance;
			   if (autoAdvance) {
					videoplayer.playlist.autoadvance(0);
			   } else {
				   videoplayer.playlist.autoadvance();
			   }
			   this.controlText("Autoadvance " + (autoAdvance ? "ON" : "OFF"));
		   },
		   buildCSSClass: function() {
				return "vjs-icon-audio-description vjs-control vjs-button";
		   }
		});

		videojs.registerComponent("toggleAutoAdvanceButton", toggleAutoAdvanceButton);
		videoplayer.getChild("controlBar").addChild("toggleAutoAdvanceButton", {});

		videoplayer.on('playlistitem', () => {
		    const currentItem = videoplayer.currentSource();
		    const titleDisplay = document.getElementById('current-item-title');
		    titleDisplay.textContent = decodeURIComponent(currentItem.title);
		  });

		var zoomPlugin = videoplayer.zoomPlugin({
			showZoom: true,
			showMove: true,
			showRotate: true,
			gestureHandler: true
		});
		zoomPlugin.enablePlugin();

		$.getScript('https://francarl.github.io/zoolz/lib/magnific-popup/jquery.magnific-popup.js', function () {

            $.getScript("https://francarl.github.io/zoolz/lib/videojs/arrive.min.js", function() {


				$("#viewerDiv .ovBtns > a").each(function() {
					var elem = $(this);

					attachVideo(elem);
				});

				$("#viewerDiv").arrive(".ovBtns > a", function ()  {
					var newElem = $(this);
					attachVideo(newElem);
			    });

			    // replace original Refresh for clean sources
                var _refreshOriginal = Refresh;

                Refresh = function(isAfterSearch) {
                	 sources = [];
                	 _refreshOriginal(isAfterSearch);
                }

				// fix name file
				$(".fileDiv").each(function() {
					  const linkSpan = $(this).find('.LinkSpan');
					  if (linkSpan) {
					    const dataFilename = $(this).data("filename");
					    linkSpan.text(dataFilename);
					  }
				});

				$("#viewerDiv").arrive(".fileDiv", function() {
					  const linkSpan = $(this).find('.LinkSpan');
					  if (linkSpan) {
					    const dataFilename = $(this).data("filename");
					    linkSpan.text(dataFilename);
					  }
				});
				


            });
		});

	});
	});
	});
	});
	});	
	});	
	});	
	});	
});




function attachVideo(newElem) {
	// 'this' refers to the newly created element

    var originalURL = newElem.attr("onclick");

	var regex = /q=[\w=]+/g;
	var titleRegex = /filename%3D%22(.+)%22/
	var m = null;
	try {
		m = originalURL.match(regex);
	} catch(ex) {
	}
	if (m) {
		var newUrl = "MyComputers/Download.aspx?" + m[0];
	
		$.ajax({
			url: newUrl,
			type: 'GET',
			async: true,
			headers: {
			    'PC_INDEX': machineId,
			    'S_KEY': 'Client',
			    'IS_FOR_COLD_STORAGE': false
			},
			success: function(data, textStatus, request){
			    var durl = request.getResponseHeader('downloadUrl');
			    // setTimeout(console.log.bind(console, durl));
	
			    newElem.attr("href", durl);

				var title = durl.match(titleRegex)[1];
				setTimeout(console.log.bind(console, title));

			    sources.push(
				     {
					  sources: [{
					    src: durl,
					    type: 'video/mp4',
						title: decodeURIComponent(title)
					  }],
					  idx: newElem.attr("idx"),
					  obj: newElem
				      }
			    );

			    // console.log("new elem: " + newElem.attr("idx"));

			    newElem.unbind('click') // takes care of jQuery-bound click events
				.attr('onclick', '') // clears `onclick` attributes in the HTML
				.each(function() { // reset `onclick` event handlers
				    this.onclick = null;
				});

			    newElem.children("div").removeClass("ovDF").addClass("ovVI").addClass('ovSel');
				
				var aCP = $("<a href='#' title='Copy'><div class='ovCP'></div></a>");
				aCP.attr("href", durl);
				aCP.click(function(event){
					event.stopPropagation();
					var downloadUrl = $(this).attr("href");
					navigator.clipboard.writeText(downloadUrl).then(
					    function() {
					      /* clipboard successfully set */
					      window.alert('Success! The text was copied to your clipboard') 
					    }, 
					    function() {
					      /* clipboard write failed */
					      window.alert('Opps! Your browser does not support the Clipboard API')
					    }
					  );
					return false;
				});
				newElem.parent().append(aCP);
				
				var ua = navigator.userAgent.toLowerCase();
				var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
				if (isAndroid) {
					console.log("ua: " + ua);

					newElem.click(function(event) {

						event.stopPropagation();

						$('.ovSel').css('border', 'none');
						newElem.children('.ovSel').css('border', '1px solid red');

						var downloadUrl = newElem.attr("href");

						downloadUrl = downloadUrl.replace("https:", "intent:") + "#Intent;action=android.intent.action.VIEW;scheme=https;type=video/mp4;end";

						window.location.href = downloadUrl;

						return false;
					});
					
				} else {
				    newElem.click(function(event) {
	
						event.stopPropagation();
		
						$('.ovSel').css('border', 'none');
						newElem.children('.ovSel').css('border', '1px solid red');
		
						var downloadUrl = newElem.attr("href");
		
						// TODO ordinamento
						sources.sort(function(a,b) {
						    var keyA = +a.idx,
							keyB = +b.idx;
								     if (keyA < keyB) return -1;
								     if (keyA > keyB) return 1;
								     return 0;
						});
		
						console.log(sources);
		
						videoplayer.playlist(sources);
		
						var idx = videoplayer.playlist.indexOf(downloadUrl);
		
						videoplayer.playlist.currentItem(idx); 
						videoplayer.play();
		
						videoplayer.on('playlistitem', function() {
		
						  var curIdx = videoplayer.playlist.currentIndex();
		
						  var curElem = sources[curIdx].obj;
		
						  $('.ovSel').css('border', 'none');
						  curElem.children('.ovSel').css('border', '1px solid red');
		
						});
		
						$.magnificPopup.open({
						    items: {
							src: '#test-popup' + randomId,
							type: 'inline'
						    },
		
						    callbacks: {
							close: function() {
								//videoplayer.reset();
								videoplayer.pause();
							    videoplayer.src('');
							}
						    }
						});
		
						return false;
				    });
				}

			},
			error: function (error) {
			    console.log(error);
			}
		    });

	}

}
