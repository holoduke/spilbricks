function level(){
	
	var grid = {x:6, y: 5};
	var gameSize;
	var bricksToRemove = [];

	this.explosions = [];
	this.elements = [];

	//PUBLIC FUNCTIONS

	this.init = function(_gameSize, intLvl){
		gameSize = _gameSize;
		
		for (var ind in intLvl)
		{
			var block = intLvl[ind];
			var brick = new aBrick();
			brick.init(gameSize.width/2 + block.x - block.width/2, gameSize.height/4 + block.y - block.height/2);
			brick.setSize(block.width, block.height);
			brick.setColor(block.color);
			if(block.collisionHanler) brick.setCollisionHandler(block.collisionHanler);
			this.elements.push(brick);
		}

		this.explosions = [];
	}

	this.hitBrick = function(index){
		if(this.elements[index].hasCollisionHanler){
			this.elements[index].hitBall();
			return true;
		}else{
			this.removeBrick(index);
			return true;
		}
		
		return false;
	}

	this.update = function(){

		for(var i = bricksToRemove.length; i > 0; i--)
		{
			this.elements.splice(bricksToRemove[i - 1], 1);
			bricksToRemove.pop();
		}
	}

	this.addExplosion = function(elem)
	{
		var expl = new Explosion();
		expl.init(elem.x, elem.y, elem.width, elem.height);
		expl.setColor(elem.color, 1);
		if(this.explosions == undefined)
		{
			this.explosions = [expl];
		}else{
			this.explosions.push(expl);
		}
	}

	// PRIVATE FUNCTIONS

	this.removeBrick = function(index){
		this.addExplosion(this.elements[index]);
		bricksToRemove.push(index);
	}
}

function CollitionManager(){
	
	var objs = [];
	
	this.add = function(o){
		objs.push(o);
	}
	
	this.update = function(){
		
	for (var i=0; i < objs.length; i++){
		
		for (var k=0; k < objs.length; k++){
			
			if (objs[k] == objs[i]) continue;
			
			
		}
		
		
	}
//		for (var k=0; k=objs.length;k++){
//		//	console.log(k)
//			//for (var j=0; j=objs.length; j++){
//				
//				//if (objs[j] == objs[i]) continue;
//				
//			//}
//			
//		}
//		
	}
	
	var testSphereBoxHit = function(){
		
	}	
}

function collisionManager(){

	this.hasCollided = function(ball, brick){
		var result = false;

		if( ball.y + ball.radius > brick.y &&
			ball.y - ball.radius < brick.y + brick.height &&
			ball.x + ball.radius > brick.x &&
			ball.x - ball.radius < brick.x + brick.width ){

			result = true;
		}

		return result;
	}

	this.hitDist = function(ball, brick){
		var xDist = ball.x - (brick.x + brick.width/2);
		var yDist = ball.y - (brick.y + brick.height/2);
		return { x:xDist , y:yDist };
	}
}

function gameView(){
	var _width = 800;
	var _height = 600;

	var _bgColor = "rgba(220, 220, 220, .9)";

	var canvas = document.getElementById("brick");
	var splashCanvas = document.getElementById("splash");
	var scoreCanvas = document.getElementById("score");
	
	var ctx = canvas.getContext("2d");
	var splashctx = splashCanvas.getContext("2d");
	var scorectx = scoreCanvas.getContext("2d");
	
  	ctx.canvas.width  = _width;
 	ctx.canvas.height = _height;
  	
 	splashctx.canvas.width  = _width;
 	splashctx.canvas.height = _height;
 	
 	scorectx.canvas.width  = _width;
 	scorectx.canvas.height = _height;
 	
 	this.clear = function(){
 		ctx.fillStyle = _bgColor;
		ctx.fillRect(0, 0, _width, _height);
	}
 	
 	this.clearSplash = function(){
 		splashctx.fillStyle = _bgColor;
		splashctx.fillRect(0, 0, _width, _height);
		splashctx.clearRect(0, 0, _width, _height)
	}
 	
 	this.clearScore = function(){
 		scorectx.fillStyle = _bgColor;
		scorectx.fillRect(0, 0, _width, _height);
		scorectx.clearRect(0, 0, _width, _height) 		
 	}

	this.draw = function(object){
		switch (object.shape)
		{
			case "rectangle":
				ctx.fillStyle = object.color;
				ctx.fillRect(object.x, object.y, object.width, object.height);
				ctx.fillStyle = "hsla(0, 0%, 0%, .9)";
				ctx.fillRect(object.x, object.y + object.height - 2, object.width, 2);
				ctx.fillRect(object.x, object.y, 2, object.height - 2);
				break;
			case "circle":
				ctx.fillStyle = object.color;
				ctx.beginPath();
				ctx.arc(object.x, object.y, object.radius, 0, 2 * Math.PI, false);
				ctx.closePath();
				ctx.fill();
				break;
			case "rectangle2":
				ctx.fillStyle = object.rgb
				ctx.fillRect(object.x, object.y, object.width, object.height);
			default:
				break;
		}	
	}
	
	this.drawSplash = function(object){
		switch (object.shape)
		{
			case "rectangle":
				splashctx.fillStyle = object.rgb
				splashctx.fillRect(object.x, object.y, object.width, object.height);
			default:
				break;
		}			
	}
	
	this.drawText = function(o){
		var context = splashctx;
		context.fillStyle="#5CADE9";
		context.lineStyle="#5CADE9";
		context.font=o.font;
		context.shadowOffsetX=4;
		context.shadowOffsetY=4;
		context.shadowBlur=3;
		context.fillText(o.text, o.x, o.y);
		context.strokeText(o.text, o.x, o.y);
	}
	
	this.drawScore = function(score,lvl){
		
		this.clearScore();
		
		scorectx.fillStyle = "rgba(11,34,34,0.7)";
		scorectx.fillRect(0, 0, _width,50);
		
		scorectx.fillStyle = "#ffffff";
		scorectx.font = "bold 32pt sans-serif"
		scorectx.fillText("level "+(lvl || 0),10,40);
		
		scorectx.fillStyle = "#ffffff";
		scorectx.font = "bold 32pt sans-serif"
		scorectx.fillText("score "+(score || 0),_width-200,40)
	}

	this.bgColor = function(value){
		_bgColor = value;
	}

	this.size = function(width, height){
		_width = width;
		_height = height;

		ctx.canvas.width  = _width;
 		ctx.canvas.height = _height;
	}
}