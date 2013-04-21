function BrickGame() {

	var gameSize = {
		x : 1000,
		y : 600
	};
	
	var level;
	var camera, scene, renderer;
	var geometry, material, mesh;
	var syncedObjects = [];
	var paused = false;

	//reference to the paddle
	var paddle;
	var balls = [];
	var bricks = [];
	var paddlePosX = 0;
	var paddlePosY = -4;
	var brickCount = 0;
	var that = this;
	
	b2Vec2 = Box2D.Common.Math.b2Vec2, 
	b2AABB = Box2D.Collision.b2AABB, 
	b2BodyDef = Box2D.Dynamics.b2BodyDef, 
	b2Body = Box2D.Dynamics.b2Body, 
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef, 
	b2Fixture = Box2D.Dynamics.b2Fixture, 
	b2World = Box2D.Dynamics.b2World, 
	b2PolygonDef = Box2D.Dynamics.b2PolygonDef, 
	b2MassData = Box2D.Collision.Shapes.b2MassData, 
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, 
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw, 
	b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef, 
	b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
	
	/**
	 * initializes render /physics engine. sets up the camera
	 */
	this.init = function(){
		setupWorld();
	}
	
	/**
	 * starts the game by creating required objects and start of animation loop
	 */
	this.start = function(){
		
		setupObjects();
		setupLighting();
		
		if (!animating){
			animate();
		}
		
		event.pub("game.start");
	}
		
	/**
	 * resets the game. bricks will be restored, ball placed to original start position
	 */
	this.reset = function(cb,pause){
				
		this.addPreRenderCb(function(){
			
			if (balls.length >= 0){
				for (var i=balls.length-1; i >= 0; i--){
					that.destroyBall(balls[i]);
				}
			}
			if (pause) paused = true;
			cleanup();
			that.start();
			if (cb) cb();
		});
	}
	
	/**
	 * toggle pause game. 
	 */
	this.togglePause = function(cb){
		
		this.addPreRenderCb(function(){
			paused = !paused;
			if (paused){
				if(cb) cb();
			}
			else{
				that.addPostRenderCb(function(){
					if (cb)cb();
				});
			}
		});
	} 
	
	/**
	 * resets ball to start position
	 */
	this.resetBall = function(cb){

		this.addPreRenderCb(function(){
			
			var ballBody = balls[0].body;
			ballBody.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
			ballBody.SetPosition(new Box2D.Common.Math.b2Vec2(paddlePosX,-3.5));
			
			var direction = paddle.body.GetPosition().Copy()
			direction.Subtract(new Box2D.Common.Math.b2Vec2(0,0))
			direction.Normalize();
			direction.Multiply(-1);
			
			ballBody.ApplyImpulse(direction, ballBody.GetWorldCenter());
			
			that.addPostRenderCb(function(){
				if (cb) cb();
			});
			
			return true;
		});
	}
	
	this.createBonusBall = function(x,y){
		var ball = createBall(x,y)
		ball.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2((Math.random() < 0.5 ? -1 : 1) * Math.random(),(Math.random() < 0.5 ? -1 : 1) * Math.random()), ball.body.GetWorldCenter())
	}
	
	this.destroyBall = function(ball){
		scene.remove(ball.body.userData.guiref);
		scene.box2dworld.DestroyBody(ball.body);
		balls.splice(balls.indexOf(ball),1);
		syncedObjects.splice(syncedObjects.indexOf(ball),1);
	}
	
	this.getBallCount = function(){
		return balls.length;
	}
	
	this.destroyBrick = function(brick){
		destroySchedule.push(brick);
	}
	
	this.getBricks = function(){
		return bricks;
	}
	
	this.setLevel = function(lvl){
		
		level = lvl;
	}

	this.getScene = function(){
		return scene;
	}
	
	var setupWorld = function() {

		//setup camera
		camera = new THREE.PerspectiveCamera(50, gameSize.x / gameSize.y, 1,10000);

		//create three world
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x59472b, 0.1, 20 );

		//create box2d physics world
		var world = new b2World(new b2Vec2(0, -2) // gravity
		, true // allow sleep
		);

		//attach box2d world to the three js scene for reference
		scene.box2dworld = world;

	
		//assign contact listener for all colitions
		var contactListener = new Box2D.Dynamics.b2ContactListener;
		contactListener.BeginContact = beginContactListener;
		
		world.SetContactListener(contactListener);

		renderer = new THREE.WebGLRenderer({
			'alpha' : true,
			antialias : true
		});
		
		renderer.shadowMapEnabled = true;
		//renderer.shadowMapType = THREE.PCFShadowMap;
//		renderer = new THREE.CanvasRenderer({
//			'alpha' : true,
//			antialias : true
//		});

//		renderer.shadowMapEnabled = true;
//		renderer.shadowMapSoft = true;
//		renderer.anti
//		renderer.shadowCameraNear = 3;
//		renderer.shadowCameraFar = camera.far;
//		renderer.shadowCameraFov = 50;
//		renderer.setClearColorHex(0xff0000, 0);
//		renderer.shadowMapBias = 0.0039;
		renderer.shadowMapDarkness = 0.5;
		renderer.shadowMapWidth = 1024;
		renderer.shadowMapHeight = 1024;
		renderer.setSize(gameSize.x, gameSize.y);

		document.getElementById('3dcanvas').appendChild(renderer.domElement);
	}

	function setupLighting(){
		//setup lighting
		var ambient = new THREE.AmbientLight(0x101010);
		scene.add(ambient);

		directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(0, 0, 2).normalize();
		directionalLight.castShadow = true;
		//scene.add(directionalLight);
//
		pointLight = new THREE.PointLight(0xffaa00);
		scene.add(pointLight);
		pointLight.position.x = 1;
		pointLight.position.y = -3;
		pointLight.position.z = 3;
//scene.add(pointLight);
		
//		lightMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
//			color : 0xffaa00
//		}));
//		lightMesh.scale.x = lightMesh.scale.y = lightMesh.scale.z = 0.05;
//		lightMesh.position = pointLight.position;
//		scene.add(lightMesh);
		
		
		var light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI, 1 );
		light.position.set( 0, 2, 5 );
		light.target.position.set( 0, 0, 0 );

		light.castShadow = true;

		light.shadowCameraNear = 1;
		light.shadowCameraFar = 10
		light.shadowCameraFov = 100;

		//light.shadowCameraVisible = true;

		scene.add( light );
	}
	
	function createBall(x,y) {
		var ball = new Ball(scene,scene.box2dworld);
		ball.create(x,y);
		balls.push(ball);
		syncedObjects.push(ball);
		
		return ball;
	}
	
	function setupObjects() {

		//create controlable paddle
		paddle = new Paddle(scene,scene.box2dworld);
		var paddleBody =paddle.create(paddlePosX,paddlePosY);
		syncedObjects.push(paddle);
		
		//create ball
		var ball = createBall(paddlePosX,-3.5);
		var ballBody = ball.body;
		
		var direction = paddleBody.GetPosition().Copy()
		direction.Subtract(new Box2D.Common.Math.b2Vec2(0,0))
		direction.Normalize();
		direction.Multiply(-1);
		
		//ballBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(-0.5,-0.05),ballBody.GetWorldCenter())
		ballBody.ApplyImpulse(direction, ballBody.GetWorldCenter())
		syncedObjects.push(ball);
		
		var brickLoc = null;
		var x = null;
		var y = null;
		var count = 0;

		var lvl = levels.getLevel(level);
		
		//TODO make bricks array dynamic adjustable
		bricks = [];
		
		for (var i=0,len=lvl.layout.length;i < len;i++){
				
			x = lvl.firstBrickPosition.x
			
			for (var j=0,jlen=lvl.layout[i].length; j < jlen; j++){
		
				if (lvl.layout[i][j] != 0){
				
				if (y === null){
					y = lvl.firstBrickPosition.y
				}
				var brick = new Brick(scene,scene.box2dworld);
				
				bricks.push(brick.create(x, y, 
							lvl.brickSize.x, 
							lvl.brickSize.y,
							lvl.types[lvl.layout[i][j]].color,
							lvl.types[lvl.layout[i][j]].type));
				count++;
				
				}
				x+=lvl.brickSpace.x;		
			}
			
			y-=lvl.brickSpace.y;			
		}
		
		brickCount = count;	
		
		//create square bounderies
		var groundBodyDef = new b2BodyDef;
		groundBodyDef.type = b2Body.b2_staticBody;
		groundBodyDef.position.Set(0, 0);
		var _groundBody = scene.box2dworld.CreateBody(groundBodyDef);
		_groundBody.userData = {'name':'wall'};

		var groundBox = new b2PolygonShape();
		var groundBoxDef = new b2FixtureDef;
		groundBoxDef.shape = groundBox;

		groundBox.SetAsEdge(new b2Vec2(5, 5), new b2Vec2(-5, 5));
		var bottomFixture = _groundBody.CreateFixture(groundBoxDef);
		bottomFixture.userData = "top";
		
		groundBox.SetAsEdge(new b2Vec2(-5, 5), new b2Vec2(-5, -5));
		var left = _groundBody.CreateFixture(groundBoxDef);
		left.userData = "left";
		
		groundBox.SetAsEdge(new b2Vec2(-5, -5), new b2Vec2(5, -5));
		var top = _groundBody.CreateFixture(groundBoxDef);
		
		groundBox.SetAsEdge(new b2Vec2(5, -5), new b2Vec2(5, 5));
		var right = _groundBody.CreateFixture(groundBoxDef);
		right.userData = "right";
		
		
		///create joint to keep paddle fixed to x axis
		var worldAxis = new b2Vec2(1.0, 0.0);

		var prismaticJointDef = new b2PrismaticJointDef();
		prismaticJointDef.Initialize(paddleBody, _groundBody, paddleBody
				.GetWorldCenter(), worldAxis);
			
		prismaticJointDef.lowerTranslation = -4.5 + paddlePosX;
		prismaticJointDef.upperTranslation = 4.5 + paddlePosX;
		prismaticJointDef.enableLimit = true;
		prismaticJointDef.maxMotorForce = 1.0;
		prismaticJointDef.motorSpeed = 0.0;
		prismaticJointDef.enableMotor = true;

		scene.box2dworld.CreateJoint(prismaticJointDef);
			
		var geometry = new THREE.PlaneGeometry( 10, 10 );
		var planeMaterial = new THREE.MeshPhongMaterial( { color: 132332,opacity: 0.5,transparent: false } );
		//laneMaterial.ambient = planeMaterial.color; 

		var ground = new THREE.Mesh( geometry, planeMaterial );

		ground.position.set( 0, 0, -0.20 );

		ground.castShadow = false;
		ground.receiveShadow = true;

		scene.add( ground );		
	}

	/**
	 * removes all physical and graphical bodies from world.
	 */	
	function cleanup() {

		///remove all gui objects
		for ( var i = scene.children.length - 1; i >= 0; i--) {
			scene.remove(scene.children[i]);
		}
		
		//remove all physics objects
		var body;
		while (body = scene.box2dworld.GetBodyList().GetNext()){
			scene.box2dworld.DestroyBody(body);
		}
		
		syncedObjects = [];
	}

	var fa;
	var fb;
	var bA;
	var bB;
	var contactBallBody;
	var contactBrick;
	/**
	 * called by box2d when colition occurs
	 */
	function beginContactListener(contact, manifold) {
		// do some stuff
		fa = contact.GetFixtureA();
		fb = contact.GetFixtureB();

		bA = fa.GetBody();
		bB = fb.GetBody();

		if (bA.userData && bA.userData.name == 'ball' &&
			bB.userData && bB.userData.name == 'brick') {
			
			contactBallBody = bA;
			brick = bB;
		}
		else if (bB.userData && bB.userData.name == 'ball' &&
				 bA.userData && bA.userData.name == 'brick') {
			contactBallBody = bB;
			brick = bA;
		}		
		else if (bA.userData && bA.userData.name == 'paddle' || bB.userData && bB.userData.name == 'paddle') {
			
			var ball = null;
			if (bA.userData && bA.userData.name == 'ball'){
				ball = bA
			}
			else if (bB.userData && bB.userData.name == 'ball'){
				ball = bB;
			}
			
			//bounce ratio between y and x should not be lower than 1
			//in other words, the minimum angle should be 45 degrees
			if (ball){
				var lv = ball.GetLinearVelocity();
				
				var xv = Math.abs(lv.x)
				var yv = Math.abs(lv.y)
				var newY = 1;
			
				if (yv/xv < 1){
					newY = xv;
					
					if (lv.y >= 0){
						ball.SetLinearVelocity(new b2Vec2(lv.x,newY))
					}
					else if (lv.y <= 0){
						ball.SetLinearVelocity(new b2Vec2(lv.x,-newY))
					}
				}
			}
			
			event.pub("game.paddleHit",paddle);
		}

		// if we have ball brick colition we schedule the brick to be removed in next animate
		if (contactBallBody && brick && !brick.destroyed) {
			brick.destroyed = true;
			
			
			brickCount--
			event.pub("game.brickDestroy",{'bricksLeft':brickCount,'brick':brick,'ball':contactBallBody});
			
			//var m = manifold.getWorldManifold();
			//var f:V2 = V2.multiplyN(m.normal, contactBallBody.GetMass() * 170);
			//bumpSchedule(contactBallBody); 
		}
	}
	
	var destroySchedule = [];
	var bumpSchedule = [];
	
	function destroyScheduledBricks() {
		if (destroySchedule.length) {

			for ( var i = 0; i < destroySchedule.length; i++) {
				scene.box2dworld.DestroyBody(destroySchedule[i]);			
				scene.remove(destroySchedule[i].userData.guiref);
			}

			destroySchedule = [];
		}
	}
	
	var addPreRenderCb =[];
	this.addPreRenderCb = function(cb){
		addPreRenderCb.push(cb)
	}
	
	var addPostRenderCb =[];
	this.addPostRenderCb = function(cb){
		addPostRenderCb.push(cb)
	}
	
	function executePrerenderCb(){
		for (var i=0,len=addPreRenderCb.length;i<len;i++){
			addPreRenderCb[i].dirty = true;
			addPreRenderCb[i]();
		}
		
		//remove executed callback.
		//we dont remove inside loop to prevent situations that a callback created
		//another callback and interfers with array size. TODO this could be smarter?/
		for (var i=addPreRenderCb.length-1;i >=0;i--){
			
			if (addPreRenderCb[i].dirty){
				addPreRenderCb.splice(i,1);
			}
		}
	}
	
	function executePostrenderCb(){
		for (var i=0,len=addPostRenderCb.length;i<len;i++){
			addPostRenderCb[i].dirty = true;
			addPostRenderCb[i]();
		}
		
		for (var i=addPostRenderCb.length-1;i >=0;i--){
			
			if (addPostRenderCb[i].dirty){
				addPostRenderCb.splice(i,1);
			}
		}
	}

	
	var animating = false;
	function animate() {

		animating = true;
		executePrerenderCb();
		
		camera.position.z = window.z || 4;
		camera.position.y = window.y || -9
		//camera.rotation.x = window.x || 5

		//remove bricks beeing hit
		destroyScheduledBricks();
			
			
		//update gui with physics objects
		for (var i=0; i <syncedObjects.length;i++){
			syncedObjects[i].sync();
			
			//generic method. used for detecting game events
			syncedObjects[i].validate();
		}
			
		if (!paused){
			
			//update paddle controls
			paddle.updateControls();
			paddlePosX = paddle.body.GetPosition().x
			paddlePosY = paddle.body.GetPosition().y
			
			//step physics
			scene.box2dworld.Step(1 / 60, 10, 10);
			scene.box2dworld.ClearForces();
		}
		
		//make sure camera looks to paddle
		camera.lookAt({
			'x' : paddle.mesh.position.x,
			'y' : paddle.mesh.position.y,
			'z' : paddle.mesh.position.z
		});

		camera.rotation.z = 0;

		var diff = 0 - paddle.mesh.position.x;
		camera.position.x = -diff / 2; 
		
		if (balls.length){
			camera.position.z += balls[0].body.GetPosition().y / 20
		}
		
		scene.box2dworld.SetGravity(new b2Vec2((diff / 6), -1));
		
		if (balls.length){
			camera.position.y += 2.5 - (balls[0].body.GetPosition().y / 20)
		}
		
		//render 3d scene
		renderer.render(scene, camera);
		
		executePostrenderCb();
		
		requestAnimationFrame(animate);
	}
}