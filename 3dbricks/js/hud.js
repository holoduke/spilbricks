function Hud(){
	
	var canvas;
	var ctx;
	
	var init = function(){
		canvas = document.createElement('canvas');
		canvas.height = 600;
		canvas.width = 1000; 
		
		document.getElementById('2dcanvas').appendChild(canvas);
		
 		ctx = canvas.getContext("2d");
 		ctx.canvas.width  = 1000;
 		ctx.globalAlpha = 0.5;
 		ctx.canvas.height = 600;
	}
	
 	var clear = function(){
 		//ctx.fillStyle = "";
		
		ctx.fillRect(0, 0, 1000, 600);
		ctx.clearRect(0, 0, 1000, 600);
	}
	
 	this.drawGameStatistics = function(score,level,lives){
 		
 		clear();
 		
// 		ctx.fillStyle = "#333333";
//		ctx.fillRect(0, 0, 1000, 40);
 		 		
 		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 560, 1000, 40,0.5);
 		
 		ctx.fillStyle = "#333333";
		ctx.font = "normal 24pt sans-serif"
		ctx.fillText("score "+ score,20,588);
		ctx.fillText("level "+ level,880,588)
		
		var xstart = 20;
		for (var i=0; i < lives;i++){
			ctx.beginPath();
			ctx.arc(xstart, 20, 12, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#777777';
			ctx.fill();
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#222222';
			ctx.stroke();
			
			xstart+=28;
		}
		
 	}
	
	this.clear = function(){
		clear();
	}
	
	init();
}