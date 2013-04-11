function Paddle(scene,world){

	var scene = scene;
	var world = world;
	var speed = 0.01;
	var maxSpeed = 0.4;
	
	this.mesh = null
	
	var getGeometry = function(x, y, xw, yw){
		
       var geometry = new THREE.CubeGeometry( 1, 0.2, 0.2 );

        var material = new THREE.MeshPhongMaterial( 
        	{ color: 13947256.453834934 
        	  ,shininess: 50
        	  //,wireframe:true
        	} );
        
        mesh = new THREE.Mesh( geometry, material );
        mesh.position.y = -4
        mesh.position.z = 0;
        return mesh;
	}
	
	var getBody = function(x, y, xw, yw){
		
		var fixDef = new b2FixtureDef;
		fixDef.density = 11.0;
		fixDef.friction = 50;
		fixDef.linearDamping = 1005;
		fixDef.restitution = 0;

		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyPoly = new b2PolygonShape();   
		fixDef.shape = bodyPoly;

		var vertexArray = [];
		vertexArray.push(new b2Vec2(-0.5, -0.1));
		vertexArray.push(new b2Vec2(0.5, -0.1));

		vertexArray.push(new b2Vec2(0.5, 0));
		vertexArray.push(new b2Vec2(0.434, 0.028));
		vertexArray.push(new b2Vec2(0.352, 0.054));
		vertexArray.push(new b2Vec2(0.216, 0.088));
		vertexArray.push(new b2Vec2(0.062, 0.1));

		vertexArray.push(new b2Vec2(-0.062, 0.1));
		vertexArray.push(new b2Vec2(-0.216, 0.088));
		vertexArray.push(new b2Vec2(-0.352, 0.054));
		vertexArray.push(new b2Vec2(-0.434, 0.028));
		vertexArray.push(new b2Vec2(-0.5, 0));

		bodyPoly.SetAsArray(vertexArray, vertexArray.length);

		bodyDef.position.x = 0;
		bodyDef.position.y = -4;
		var barbody = world.CreateBody(bodyDef);
		barbody.CreateFixture(fixDef)
		barbody.SetLinearDamping(5.9);
		
		return barbody;
	}
	
	var isRight = false;
	var isLeft = false;
	
	var getKeyDownInput = function(event) {
	    if(event.keyCode == 37 || event.keyCode == 65) {
	        isLeft = true;
	    } else if(event.keyCode == 39 || event.keyCode == 68) {
	    	isRight = true;
	    }
	}

	var getKeyUpInput = function(event) {
		if(event.keyCode == 37 || event.keyCode == 65) {
			isLeft = false;
	    } else if(event.keyCode == 39 || event.keyCode == 68) {
	    	isRight = false;
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
	
	this.updateControls = function(){
		
		var dir = getDir();
		if (dir > 0) {
			this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(2.2,0),this.body.GetWorldCenter())
			
			speed += dir/100;
			if (speed < 0) speed += dir/60;
		}
		else if (dir < 0){
			this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(-2.2,0),this.body.GetWorldCenter())
			speed += dir/100;
			if (speed > 0) speed +=dir/60;
		}
	}
	
	
	this.create = function(x, y, xw, yw){
		
		var paddle = getGeometry(x, y, xw, yw);
		scene.add(paddle);
		
		this.mesh = paddle;
		
		this.body = getBody(x, y, xw, yw);
		this.body.userData = {
			'name' : 'paddle',
			'guiref' : paddle  
		};
			
		addListeners();
		
		return this.body;
	}	
		
	this.sync = function(){
		this.body.userData.guiref.position.x = this.body.GetPosition().x;
		this.body.userData.guiref.position.y = this.body.GetPosition().y;
	}
	
}

Paddle.prototype = new GameObject();
Paddle.prototype.constructor = GameObject;