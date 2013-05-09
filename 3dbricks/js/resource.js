	


Resources = function(){

	
	var loadedResources = {};
	var jsonloader = new THREE.JSONLoader();
	
	var resources = {
			
			"audio":['music/russia.mp3',
			         'music/GEFORCE.mp3',
			         'music/DJCLANTM.ogg'
			         ],
			"models":['models/object.js']
	}
	
	var totalResources = resources.audio.length + resources.models.length;
	
	var loadAudio = function(url,cb) {
		
		if (!window.AudioContext || !window.webkitAudioContext){
			cb();
			return;
		}
		
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
 
		var onError;
		// Decode asynchronously
		request.onload = function() {
			audioContext.decodeAudioData(request.response, function(buffer) {
				
				loadedResources[url] = buffer;										
				cb();


			}, onError);
		}
		request.addEventListener("progress", function(e){
			
			var percentComplete = e.loaded / e.total
			//console.log('iets anders',percentComplete,url)
			addProgress(url,e.loaded / e.total);
			
		},false);
		
		request.send();
	}
	
	var totals = [];
	var addProgress = function(url,perc){
		
		totals[url] = perc;
		var t = 0;
		
		for (var i in totals){
			t += totals[i];
		}
		
		
		document.getElementById('loadingText').innerHTML ="Loading "+Math.round(t/totalResources*100)+"%"
		
		if (t == totalResources){
			document.getElementById('loadingText').innerHTML ="Please wait....";
		}
		
		
		
	}
	
	var loadJSON = function(model,cb){
		 jsonloader.load(model, function( geometry ) {
				
			 addProgress(model,1);
			 loadedResources[model] = geometry;
			 cb();
		 });		
	}
	
	this.getResource = function(r){
		return loadedResources[r];
	}
	
	this.loadResources = function(cb){
	

		var loadedResources = 0;
		
		var evaluate = function(){
			loadedResources++;
			
			if (loadedResources == totalResources){
				document.getElementById('loadingContainer').style.display = 'none';
				cb();
			}
		}
		
		for (var i=0; i<resources.audio.length; i++){
			loadAudio(resources.audio[i],function(){
				
				evaluate();
			});
		}
		
		for (var i=0; i<resources.models.length; i++){
			loadJSON(resources.models[i],function(){
				
				evaluate();
			});
		}
	}
		
}