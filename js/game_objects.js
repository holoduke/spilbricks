// GAME BALL

function ball(){
	var gameSize;

	var accel = 5;
	var speed = {x:accel, y:accel};
	var gameSize;
	var hue = 0;

	this.x = 0;
	this.y = 0;
	this.radius = 12;
	this.color = "hsla(322, 64%, 49%, 1)";
	this.shape = "circle";

	//PUBLIC FUNCTIONS

	this.init = function(_gameSize){
		gameSize = _gameSize;
		this.x = gameSize.width/2;
		this.y = gameSize.height/2;
	}

	this.update = function(){

		this.x += speed.x;
		this.y += speed.y;

		if( this.x - this.radius < 0 || this.x + this.radius > gameSize.width ) {
			speed.x *= -1;
		}

		if(this.y - this.radius < 0) {
		
			speed.y *= -1;
		}else if(this.y + this.radius > gameSize.height){
			
			this.x = gameSize.width/2;
			this.y = gameSize.height/2;
			event.pub("gameover");
		}
	}

	this.draw = function(view){
		view.draw(this);
	}

	this.hitBrick = function(Dist){
		var hyp = Math.sqrt( (Dist.x * Dist.x) + (Dist.y * Dist.y) );

		var dirX = 1;
		var dirY = 1;
		if(Dist.x < 0){ dirX = -1 };
		if(Dist.y < 0){ dirY = -1 };

		speed.y = dirY * Math.abs( (Dist.x/hyp) * accel );
		speed.x = dirX * Math.abs( (Dist.y/hyp) * accel );
	}

	this.destroy = function(){
		
	}
}

// GENERIC GAME BRICK

function aBrick(){

	this.x = 0;
	this.y = 0;
	this.width = 100;
	this.height = 20;
	this.color = "#AAAAAA";
	this.shape = "rectangle";
	this.hasCollisionHanler = false;

	this.setColor = function(_c){
		this.color = _c;
	}

	this.setSize = function(_w, _h){
		this.width = _w;
		this.height = _h;
	}

	this.setCollisionHandler = function(handler){
		this.hasCollisionHanler = true;
		this.hitBall = handler;
	}

	this.init = function(_x, _y){
		this.x = _x;
		this.y = _y;
	}

	this.draw = function(view){
		view.draw(this);
	}

	this.update = function(){
		
	}

	this.hitBall = function(){

	}

	this.destroy = function(){
		
	}
}

// PLAYER BAR

function pBar(){
	
	var isLeft = false;
	var isRight = false;
	var dir = 0;

	var speed = 0;
	var maxSpeed = 4;
	var accel = 2;
	var atr = 1;
	var borderLimit = 200;

	var myBrick = new aBrick();

	myBrick.x = this.x =  0;
	myBrick.y = this.y = 0;
	myBrick.width = this.width = 100;
	myBrick.height = this.height = 20;
	this.color = "hsla(274, 53%, 37%, 1)";
	myBrick.setColor(this.color);
	
	var setIsLeft = function(value){
		isLeft = value;
	}

	var setISRight = function(value){
		isRight = value;
	}

	//GET USER INPUT

	var getKeyDownInput = function(event) {
	    if(event.keyCode == 37 || event.keyCode == 65) {
	        setIsLeft(true);
	    } else if(event.keyCode == 39 || event.keyCode == 68) {
	        setISRight(true);
	    }
	}

	var getKeyUpInput = function(event) {
		if(event.keyCode == 37 || event.keyCode == 65) {
	        setIsLeft(false);
	    } else if(event.keyCode == 39 || event.keyCode == 68) {
        	setISRight(false);
	    }
	}

	var addListeners = function(){
		document.addEventListener('keydown', getKeyDownInput);
		document.addEventListener('keyup', getKeyUpInput);	
	}

	var removeListeners = function(){
		document.removeEventListener('keydown', getKeyDownInput);
		document.removeEventListener('keyup', getKeyUpInput);
	}

	var getDir = function(){
		var result = 0;
		
		if(isRight) ++result;
		if(isLeft) --result;

		return result;
	}

	//PUBLIC FUNCTIONS

	this.init = function(_gameSize){
		borderLimit = _gameSize.width;
		this.x = _gameSize.width/2 - this.width/2;
		this.y = _gameSize.height * 5/6;
		myBrick.width = this.width = _gameSize.width/8;
		myBrick.height = this.height = _gameSize.height/30;
		
		addListeners();
	}

	this.update = function(){
		
		var dir = getDir();

		if (dir > 0) {
			speed += dir;
			if (speed < 0) speed = 0;
		}
		else if (dir < 0){
			speed += dir;
			if (speed > 0) speed = 0;
		}
		else if (speed > 0){
			speed = Math.max(0,speed -= 3)
		}
		else if (speed < 3){
			speed = Math.min(0,speed += 3)
		}
		else{
			speed = 0;
		}
	
		this.x += speed;
		
		if(this.x < 0) 
		{
			this.x = 0;
			speed *= 0;
		}else if(this.x + this.width > borderLimit){
			this.x = borderLimit - this.width; 
			speed *= 0;
		}

		myBrick.x = this.x;
		myBrick.y = this.y;
	}

	this.draw = function(view){
		view.draw(myBrick);
	}

	this.hitBall = function(){

	}

	this.destroy = function(){
		removeListeners();
	}
}

// SCORE BAR

function Score(){

	this.points = 0;
	this.level = 0;
	var view;

	this.addPoint = function(){
		this.points++;
		if(view != null) this.draw(view);
	}

	this.setView = function(_view){
		view = _view;
		this.draw(view);
	}

	this.draw = function(_view){
		view = _view;
		view.clear();

		view.draw({shape:'rectangle', x:0, y:0, width:800, height:50, color:"rgba(11,34,34,0.7)"});
		view.draw({shape:'score', color:"#ffffff", lvl:this.level, points:this.points} );
	}
}