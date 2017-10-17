var debug = false,
	audio_debug = false,
	loader_one,
	first_loaded = false,
	play_random = false,
	fade_in = 1500,
	fade_out = 1000,
	sounds = [],
	bg_audio;

$(document).ready(function(){
	sound_init();
	
	$('li').on("click", function(e){
		e.preventDefault();
		
		if(bg_audio.playState == 0) {
			bg_audio.play();
		}
		
		var id_to_play = $(this).attr("id");
		var id_in_array = parseInt(id_to_play.replace ( /[^\d.]/g, '' ));
		
		sounds[id_in_array] = soundManager.getSoundById(id_to_play);
		sounds[id_in_array].play({
			onplay: function(){
				$('#' + this.id).addClass("playing");
			},
			multiShotEvents: false,
			onfinish: function() {
				$('#' + this.id).removeClass("playing");
			}
		});
	});
});

//SOUND SETUP
function sound_init(){
	soundManager.setup({
		url: "/js/swf/",
		useHTML5Audio: true,
		preferFlash: false,
		flashVersion: 9,
		useHighPerformance: true,
		debugMode: audio_debug,
		debugFlash: false,
		flashLoadTimeout: 1000
	});
	
	soundManager.ontimeout(function(status) {
		soundManager.flashLoadTimeout = 0;
  		soundManager.onerror = {};
    	soundManager.reboot(); 
	});

	soundManager.onready(function() {
		preload();
	});
	
	function preload(){
		var loader_one = new PxLoader();
		
		loader_one.addImage("/imgs/mushroom_bg.jpg");
		
		if(Modernizr.audio.mp3) {
			var audio_format_key = ".mp3";
		} else if(Modernizr.audio.ogg) {
			var audio_format_key = ".ogg";
		}
		
		bg_audio = soundManager.createSound({
			id: 'bg_audio_track',
			url: '/audio/spirit_in_the_sky' + audio_format_key,
			volume: 10,
			autoLoad: true,
			autoPlay: true,
			loops: 5
		});
		
		for (i = 0; i < number_of_songs; i++) {
			var track_id = "track_" + (i+1);
			
			if(Modernizr.audio.mp3) {
				var audio_format_key = ".mp3";
			} else if(Modernizr.audio.ogg) {
				var audio_format_key = ".ogg";
			}
			
			loader_one.addSound(track_id,"/audio/" + (i+1) + audio_format_key);
		}
		
		loader_one.addProgressListener(function(e) {
			var log_percentage = Math.round(e.completedCount / e.totalCount * 100);
			
			if(debug){
				console.log("Loader One: " + log_percentage + "%");
			}
		});
		
		loader_one.addCompletionListener(function(e) {
		    first_loaded = true;
		    
		    $('.preloader').fadeOut(fade_out, function(){
				$('.soundboard').css("display", "flex").hide().fadeIn(fade_in);  
				
				if(!isMobile.apple.phone && play_random) {
					var random_track = "track_" + getRandomInt(1, number_of_songs);
					$('#' + random_track).click();
				}
		    });
		    
		    if(debug){
				console.log("Loader One: Completed");
			}
		});
		
		$('.preloader').css("display", "flex").hide().fadeIn(fade_in, function() {
			loader_one.start();
		});
	}
}

//FIXING FOREACH IN IE8
if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback){
      for (var i = 0; i < this.length; i++){
        callback.apply(this, [this[i], i, this]);
      }
    };
}

//RANDOM NUMBER IN RANGE
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//MOBILE DETECTION
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/Windows Phone/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");if("undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window)return this},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);