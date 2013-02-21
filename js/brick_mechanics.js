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
		}else{
			this.removeBrick(index);
		}
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
	var animationCanvas = document.getElementById("anibrick");
	var ctx = canvas.getContext("2d");
	var anictx = animationCanvas.getContext("2d");
  	ctx.canvas.width  = _width;
 	ctx.canvas.height = _height;
  	anictx.canvas.width  = _width;
 	anictx.canvas.height = _height;
 	
 	this.clear = function(){
 		ctx.fillStyle = _bgColor;
		ctx.fillRect(0, 0, _width, _height);
	}
 	
 	this.clearAni = function(){
 		anictx.fillStyle = _bgColor;
		anictx.fillRect(0, 0, _width, _height);
		anictx.clearRect(0, 0, _width, _height)
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
	
	this.drawAni = function(object){
		switch (object.shape)
		{
			case "rectangle":
				anictx.fillStyle = object.rgb
				anictx.fillRect(object.x, object.y, object.width, object.height);
			default:
				break;
		}			
	}
	
	this.drawText = function(o){
		var context = anictx;
		context.fillStyle="#5CADE9";
		context.lineStyle="#5CADE9";
		context.font=o.font;
		context.shadowOffsetX=4;
		context.shadowOffsetY=4;
		context.shadowBlur=3;
		context.fillText(o.text, o.x, o.y);
		context.strokeText(o.text, o.x, o.y);
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