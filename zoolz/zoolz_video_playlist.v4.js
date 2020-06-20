_pageLimit = 5000;


var vault = $('li[title="Vault"]');
var machineId = vault.attr("data-value");
var randomId = Math.floor(Math.random() * 200) + 1;
var videoplayer = null;
var rotated = false;


$("head").append("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/video.js/7.1.0/video-js.min.css' >");
$("head").append("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css' >");
//$("head").append("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@silvermine/videojs-chromecast@1.2.1/dist/silvermine-videojs-chromecast.css' >");
$("head").append("<link rel='stylesheet' href='https://francarl.github.io/videojs-chromecast/silvermine-videojs-chromecast.css' >");


$("head").append("<style>                   \
	.video-js .vjs-tech {  \
	  position: relative;  \
	  height: inherit;     \
	}                      \
	.player {              \
	  width: 80%;          \
	  margin-left: auto;   \
	  margin-right: auto;  \
	  background:black;    \
	}                      \
</style>");


$("body").append("<div id='test-popup" + randomId + "' class='player mfp-hide'>        \
    <video id='zoolz-player" + randomId + "' class='video-js vjs-default-skin' controls preload='auto'      \
      style='height:auto; width:100%'      \
      >      \
        <p class='vjs-no-js'>To view this video please enable JavaScript, and consider upgrading to a web browser that <a href='http://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a></p>  \
    </video>    \
</div>");

// data-setup='{ \"playbackRates\": [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0, 1.5, 2.0] }'
//$("#bcDivP").css("width", "470px")
//$("#controlsDiv").prepend("<a id='RefreshLink' href='javascript:void(0)' onclick='RefreshComputerFirst()' draggable='false' title='Refresh'>  <div id='RefreshButtonDiv' class='ctrlDiv ctrA'>  <div id='RefreshIn' class='icnR DownloadIcn'> </div>  <span class='LinkSpan'></span> </div> </a>");



var sources = [];

$.getScript('https://cdnjs.cloudflare.com/ajax/libs/video.js/7.1.0/video.min.js', function () {

	$.getScript('https://cdn.jsdelivr.net/npm/videojs-playlist@4.3.1/dist/videojs-playlist.js', function () {

    window.SILVERMINE_VIDEOJS_CHROMECAST_CONFIG = {
        preloadWebComponents: true,
    };	

	$.getScript('https://cdn.jsdelivr.net/npm/@silvermine/videojs-chromecast@1.2.1/dist/silvermine-videojs-chromecast.js', function () {

	$.getScript('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1', function () {	

		var options = {
		   controls: true,
		   techOrder: [ 'chromecast', 'html5' ], // You may have more Tech, such as Flash or HLS
		   plugins: {
			  chromecast: {
			  }
		   },
		   playbackRates: [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1.0, 1.5, 2.0],
		   muted: true
		};

		videoplayer = videojs('zoolz-player' + randomId, options);

        // rotate
		var vjsButton = videojs.getComponent("Button");
		var customRotateButton = videojs.extend(vjsButton, {
		   constructor: function(player, options) {
			vjsButton.call(this, player, options);
				this.controlText("Rotate 180");
		   },
		   handleClick: function() {
				//do something on click for example
				var vi = videoplayer.children()[0];

				if (rotated) {
					vi.style.transform = 'none';
					rotated = false;
				} else {
					vi.style.transform = 'rotate(180deg)';	
					rotated = true;
				}
		   },
		   buildCSSClass: function() {
				return "vjs-icon-replay vjs-control vjs-button";
		   }
		});

		videojs.registerComponent("customRotateButton", customRotateButton);
		videoplayer.getChild("controlBar").addChild("customRotateButton", {});

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
        
		$.getScript('https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.js', function () {

            $.getScript("https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js", function() {


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


            });
		});

	});
	});
	});	
});




function attachVideo(newElem) {
	// 'this' refers to the newly created element

    var originalURL = newElem.attr("href");

    $.ajax({
        url: originalURL,
        type: 'GET',
        async: true,
        headers: {
            'PC_INDEX': machineId,
            'S_KEY': 'Client',
            'IS_FOR_COLD_STORAGE': false
        },
        success: function(data, textStatus, request){
            var durl = request.getResponseHeader('DownloadURL');
            console.log(durl);
            newElem.attr("href", durl);

            sources.push(
                     {
                          sources: [{
                            src: durl,
                            type: 'video/mp4'
                          }],
                          //,poster: 'http://media.w3.org/2010/05/bunny/poster.png'
                          idx: newElem.attr("idx"),
                          obj: newElem
                      }
            );

            console.log("new elem: " + newElem.attr("idx"));

            newElem.unbind('click') // takes care of jQuery-bound click events
                .attr('onclick', '') // clears `onclick` attributes in the HTML
                .each(function() { // reset `onclick` event handlers
                    this.onclick = null;
                });

            newElem.children("div").removeClass("ovDF").addClass("ovVI").addClass('ovSel');

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

        },
        error: function (error) {
            console.log(error);
        }
    });

	

}




