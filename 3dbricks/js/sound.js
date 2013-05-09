var Sound = function(){
	
	
	// Fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	if (AudioContext){
		var context = new AudioContext();
		window.audioContext = context;
	}
	
	var source;
	var currentMusic = null;
	
	
	
	
	this.playBrickHit = function(){
		
		if (!context) return;
		
		var dogBarkingBuffer = null;

		function loadDogSound(url) {
		  var request = new XMLHttpRequest();
		  request.open('GET', url, true);
		  request.responseType = 'arraybuffer';

		  var onError
		  // Decode asynchronously
		  request.onload = function() {
		    context.decodeAudioData(request.response, function(buffer) {
		      dogBarkingBuffer = buffer;
		      
			  source = context.createBufferSource(); // creates a sound source
			  source.buffer = buffer;                    // tell the source which sound to play
			  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
			  source.start(0);                           // play the source now
			                     
		      
		    }, onError);
		  }
		  request.send();
		}
		
		loadDogSound("music/hit.ogg");		
	}
		
	
	var sounds = {};
	
	this.playTheme = function(){
		
		if (!context) return;
		//return;
		if (sounds["theme"]) sounds["theme"].stop(0);
		
		var buffer = resource.getResource("music/russia.mp3");
		
		if (!buffer) return;
				
		source = audioContext.createBufferSource(); // creates a sound
			// source
		source.buffer = buffer; // tell the source which sound to play
		source.connect(audioContext.destination); // connect the source to	
		source.loop = true;
		sounds["theme"] = source;
	
		source.start(0);		
	}
	
	this.playLevelMusic = function(level){
		
		if (!context) return;
		
		if (sounds[level]) sounds[level].stop(0);
		if (sounds[level-1]) sounds[level-1].stop(0); //hack to stop previous level
		if (sounds["theme"]) sounds["theme"].stop(0);
	
		var buffer = resource.getResource(levels.getLevel(level).music);
		
		if (!buffer) return;
				
		source = audioContext.createBufferSource(); // creates a sound
			// source
		source.buffer = buffer; // tell the source which sound to play
		source.connect(audioContext.destination); // connect the source to	
		source.loop = true;
		sounds[level] = source;
	
		source.start(0);			
	}
	
	
	
	
}