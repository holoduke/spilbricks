function level(){
	
	var grid = {x:6, y: 5};
	var gameSize;
	var bricksToRemove = [];

	var explosions = [];
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

		explosions = [];
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

		for(var w = explosions.length; w > 0; w--)
		{
			
			if(explosions[w-1].update())
			{
				explosions[w - 1].destroy();
				explosions.splice(w - 1, 1);
			}
		}
	}

	this.addExplosion = function(elem)
	{
		var expl = new Explosion();
		expl.init(elem.x, elem.y, elem.width, elem.height);
		expl.setColor(elem.color, 1);
		if(explosions == undefined)
		{
			explosions = [expl];
		}else{
			explosions.push(expl);
		}
	}

	this.draw = function(view){
		for(var i=0; i < this.elements.length; i++)
		{	
			view.draw(this.elements[i]);
		}

		for(var w = explosions.length; w > 0; w--)
		{
			for(var t = 0; t < explosions[w - 1].parts.length; t++)
			{
				view.draw(explosions[w - 1].parts[t]);
			}
		}
	}

	// PRIVATE FUNCTIONS

	this.removeBrick = function(index){
		this.addExplosion(this.elements[index]);
		bricksToRemove.push(index);
	}
}

function collisionCheck(){

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

	var canvas;
	var ctx;

 	this.init = function(id){
 		canvas = document.getElementById(id);
 		ctx = canvas.getContext("2d");
 		ctx.canvas.width  = _width;
 		ctx.canvas.height = _height;
 	}
 	
 	this.clear = function(){
 		ctx.fillStyle = _bgColor;
		ctx.fillRect(0, 0, _width, _height);
	}

	this.draw = function(object){
		switch (object.shape)
		{
			case "rectangle":
				ctx.fillStyle = object.color;
				ctx.fillRect(object.x, object.y, object.width, object.height);
				ctx.fillStyle = "hsla(0, 0%, 0%, .3)";
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
			case "score":
				ctx.fillStyle = object.color;
				ctx.font = "bold 32pt sans-serif"
				ctx.fillText("score "+(object.points || 0),10,40);
				ctx.fillText("level "+(object.level || 0),_width-200,40)
			default:
				break;
		}	
	}
	
	this.drawSplash = function(object){
		switch (object.shape)
		{
			case "rectangle":
				ctx.fillStyle = object.rgb
				ctx.fillRect(object.x, object.y, object.width, object.height);
			default:
				break;
		}			
	}
	
	this.drawText = function(o){
		var context = ctx;
		context.fillStyle="hsla(322, 64%, 49%, 1)";
		context.lineStyle="hsla(274, 53%, 37%, 1)";
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