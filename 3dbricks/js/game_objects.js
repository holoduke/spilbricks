function Ball(){
	var gameSize;

	var accel = 10;
	var speed = {x:accel, y:accel};
	var v = {x:10,y:10}
	var gameSize = {'x':800,'y':800};
	var hue = 0;

	this.x = 0;
	this.y = 0;
	this.radius = 32;
	this.color = "hsla(322, 64%, 49%, 1)";
	this.shape = "circle";

	//PUBLIC FUNCTIONS

	var mesh;
	this.getMesh = function(){
		
		if (mesh) return mesh;
		
		var geometry = new THREE.SphereGeometry( this.radius, 16, 8 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true} );

        mesh = new THREE.Mesh( geometry, material );
     
        return mesh;
	}
	
	this.init = function(_gameSize){
		gameSize = _gameSize;
		this.x = gameSize.width/2;
		this.y = gameSize.height/2;
	}

	this.update = function(){

		mesh.position.x -= speed.x;
		mesh.position.y -= speed.y;

		if( mesh.position.x - this.radius < -800 || mesh.position.x + this.radius > gameSize.x ) {
			speed.x *= -1;
		}

		if(mesh.position.y - this.radius < -800 || mesh.position.y + this.radius > 800) {
		
			speed.y *= -1;
		}else if(mesh.position.y + this.radius > gameSize.y){
			
			//mesh.position.x = gameSize.width/2;
			//mesh.position.y = gameSize.height/2;
			event.pub("gameover");
		}
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

	this.update = function(){
		
	}

	this.hitBall = function(){

	}

	this.destroy = function(){
		
	}
}

function pBar(){
	
	var isLeft = false;
	var isRight = false;
	var dir = 0;

	var speed = 0.01;
	var maxSpeed = 0.4;
	var borderLimit = 100;

	this.x =  0;
	this.y = 0;
	this.width = 100;
	this.height = 20;
	this.color = "hsla(274, 53%, 37%, 1)";
	this.shape = "rectangle";
	
	var mesh;
	this.getMesh = function(){
		
		if (mesh) return mesh;
		
        geometry = new THREE.CubeGeometry( 1, 0.2, 0.2 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000} );

        mesh = new THREE.Mesh( geometry, material );
        mesh.position.y = -4
        mesh.position.z = 0;
        return mesh;
	}
	
	function setIsLeft(value){
		isLeft = value;
	}

	function setISRight(value){
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

	var init = function(_borderLimit){
		borderLimit = _borderLimit;
		this.x = borderLimit/2 - this.width/2;
		addListeners();
	}

	this.update = function(){
		
		
		var dir = getDir();
		console.log('update ',dir)
		if (dir > 0) {
			this.boxmodel.ApplyImpulse(new Box2D.Common.Math.b2Vec2(2.2,0),this.boxmodel.GetWorldCenter())
			
			speed += dir/100;
			if (speed < 0) speed += dir/60;
		}
		else if (dir < 0){
			this.boxmodel.ApplyImpulse(new Box2D.Common.Math.b2Vec2(-2.2,0),this.boxmodel.GetWorldCenter())
			speed += dir/100;
			if (speed > 0) speed +=dir/60;
		}
	}

	this.hitBall = function(){

	}

	this.destroy = function(){
		removeListeners();
	}
	
	init();
}