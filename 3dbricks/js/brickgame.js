function BrickGame() {

	var gameSize = {
		x : 1000,
		y : 600
	};
	
	var camera, scene, renderer;
	var geometry, material, mesh;
	var syncedObjects = [];
	var paused = false;
	var stopped = false;
	//reference to the paddle
	var paddle;
	var ball;
	var paddlePosX = 0;
	var paddlePosY = -4;
	var brickCount = 0;
	
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
	
	//helper function to ensure stop/start/pause/reset happens at the right time in animate loop
	var runBefore = null;
	var runAfter = null;
	
	this.init = function(){
		setupWorld();
	}
	
	this.start = function(){
		stopped = false;
		paused = false;
		
		setupObjects();
		setupLighting();
		animate();
		
		event.pub("game.start");
	}
	
	this.stop = function(){
		runAfter = function(){
			runAfter = null
			that.start();
			return false;
		}	
	}
	
	this.reset = function(cb){
		
		var that =this;
	
		runBefore = function(){
			runBefore = null;
			paused = true;
			cleanup();
			
			runAfter = function(){
				runAfter = null
				that.start();
				if (cb) cb();
				return false;
			}	
			
			return true;
		}
	}
	
	this.resetBall = function(cb){
		
		runBefore = function(){
			runBefore = null
			
			var ballBody = ball.body;
			ballBody.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
			ballBody.SetPosition(new Box2D.Common.Math.b2Vec2(paddlePosX,-3.5));
			
			var direction = paddle.body.GetPosition().Copy()
			direction.Subtract(new Box2D.Common.Math.b2Vec2(0,0))
			direction.Normalize();
			direction.Multiply(-1);
			
			ballBody.ApplyImpulse(direction, ballBody.GetWorldCenter());
			
			
			runAfter = function(){
				runAfter = null
				if (cb) cb();
				return true;
			}	
			
			return true;
		}
	}
	
	this.togglePause = function(cb){
		
		runBefore = function(){
			runBefore = null;
			paused = !paused;
			if (paused){
				if(cb) cb();
			}
			else{
				runAfter = function(){
					runAfter = null;
					if (cb)cb();
					return true;
				};
			}
			
			return true;
		}
	} 
	
	var setupWorld = function() {

		//setup camera
		camera = new THREE.PerspectiveCamera(50, gameSize.x / gameSize.y, 1,10000);

		//create three world
		scene = new THREE.Scene();

		//create box2d physics world
		var world = new b2World(new b2Vec2(0, -1) // gravity
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
//		renderer.shadowMapDarkness = 0.5;
//		renderer.shadowMapWidth = 1024;
//		renderer.shadowMapHeight = 1024;
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
		scene.add(directionalLight);

		pointLight = new THREE.PointLight(0xffaa00);
		scene.add(pointLight);
		pointLight.position.z = 3;
		pointLight.position.y = -1;

		lightMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			color : 0xffaa00
		}));
		lightMesh.scale.x = lightMesh.scale.y = lightMesh.scale.z = 0.05;
		lightMesh.position = pointLight.position;
		scene.add(lightMesh);
	}
	
	function setupObjects() {

		//create controlable paddle
		paddle = new Paddle(scene,scene.box2dworld);
		var paddleBody =paddle.create(paddlePosX,paddlePosY);
		syncedObjects.push(paddle);
		
		//create ball
		ball = new Ball(scene,scene.box2dworld);
		var ballBody = ball.create(paddlePosX,-3.5);
		
		var direction = paddleBody.GetPosition().Copy()
		direction.Subtract(new Box2D.Common.Math.b2Vec2(0,0))
		direction.Normalize();
		direction.Multiply(-1);
		
		ballBody.ApplyImpulse(direction, ballBody.GetWorldCenter())
		syncedObjects.push(ball);
		
		//create bricks
		new Brick(scene,scene.box2dworld).create(-3, 0, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-2, 0, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-1, 0, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(0, 0, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(1, 0, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(2, 0, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(3, 0, 0.49, 0.25);

		new Brick(scene,scene.box2dworld).create(-2.5, 0.6, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-1.5, 0.6, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-0.5, 0.6, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(0.5, 0.6, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(1.5, 0.6, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(2.5, 0.6, 0.49, 0.25);

		new Brick(scene,scene.box2dworld).create(-2.0, 1.2, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-1.0, 1.2, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-0.0, 1.2, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(1.0, 1.2, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(2.0, 1.2, 0.49, 0.25);

		new Brick(scene,scene.box2dworld).create(-1.5, 1.8, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-0.5, 1.8, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(0.5, 1.8, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(1.5, 1.8, 0.49, 0.25);

		new Brick(scene,scene.box2dworld).create(-1.0, 2.4, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(-0.0, 2.4, 0.49, 0.25);
		new Brick(scene,scene.box2dworld).create(1.0, 2.4, 0.49, 0.25);
		
		brickCount = 25;	
		//create square bounderies
		var groundBodyDef = new b2BodyDef;
		groundBodyDef.type = b2Body.b2_staticBody;
		groundBodyDef.position.Set(0, 0);
		var _groundBody = scene.box2dworld.CreateBody(groundBodyDef);

		var groundBox = new b2PolygonShape();
		var groundBoxDef = new b2FixtureDef;
		groundBoxDef.shape = groundBox;

		groundBox.SetAsEdge(new b2Vec2(5, 5), new b2Vec2(-5, 5));
		var bottomFixture = _groundBody.CreateFixture(groundBoxDef);

		groundBox.SetAsEdge(new b2Vec2(-5, 5), new b2Vec2(-5, -5));
		_groundBody.CreateFixture(groundBoxDef);

		groundBox.SetAsEdge(new b2Vec2(-5, -5), new b2Vec2(5, -5));
		_groundBody.CreateFixture(groundBoxDef);

		groundBox.SetAsEdge(new b2Vec2(5, -5), new b2Vec2(5, 5));
		_groundBody.CreateFixture(groundBoxDef);
	
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
			
		//setup ground plane
		var color = Math.random() * 0xffffff;
		material = new THREE.MeshPhongMaterial({
			color : 13757355.379216421,
			shininess : 50,
			transparent: true, opacity: 0.2
		});
		//var material = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5 } );
		geometry = new THREE.CubeGeometry(10, 10, 0.01);
		//material = new THREE.MeshBasicMaterial( { color: 0xff0000,  shading: THREE.FlatShading, overdraw: true} );
		plane = new THREE.Mesh(geometry, material);
		plane.position.z = -0.4;
		plane.receiveShadow = true;
		scene.add(plane);
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

	/**
	 * called by box2d when colition occurs
	 */
	function beginContactListener(contact, manifold) {
		// do some stuff
		var fa = contact.GetFixtureA();
		var fb = contact.GetFixtureB();

		var bA = fa.GetBody();
		var bB = fb.GetBody();

		var ballbody = null;
		var brick = null;

		if (bA.userData && bA.userData.name == 'ball') {
			ballbody = bA;

			if (bB.userData && bB.userData.name == 'brick') {
				brick = bB;
			}
		}
		if (bB.userData && bB.userData.name == 'ball') {
			ballbody = bB;

			if (bA.userData && bA.userData.name == 'brick') {
				brick = bA;
			}
		}

		// if we have ball brick colition we schedule the brick to be removed in next animate
		if (ballbody && brick && !brick.destroyed) {
			brick.destroyed = true;
			destroySchedule.push(brick);
			
			brickCount--
			event.pub("game.brickDestroy",{'bricksLeft':brickCount});
			
			//var m = manifold.getWorldManifold();
			//var f:V2 = V2.multiplyN(m.normal, ballbody.GetMass() * 170);
			//bumpSchedule(ballbody); 
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

	function animate() {
		if (runBefore){
			if (!runBefore()) {return;};
		}
		
		
		
		camera.position.z = 4;
		camera.position.y = -9
		camera.rotation.x = 5

		//remove bricks beeing hit
		destroyScheduledBricks();

		if (!paused){
		//update paddle controls
		paddle.updateControls();
		paddlePosX = paddle.body.GetPosition().x
		paddlePosY = paddle.body.GetPosition().y
		
		
		//update gui with physics objects
		for (var i=0; i <syncedObjects.length;i++){
			syncedObjects[i].sync();
			
			//generic method. used for detecting game events
			syncedObjects[i].validate();
		}
		
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
		
		scene.box2dworld.SetGravity(new b2Vec2((diff / 6), -1));
		camera.position.y += 2.5

		//render 3d scene
		renderer.render(scene, camera);

		if (runAfter){
			if (!runAfter()) {return};
		}
		
		requestAnimationFrame(animate);
	}
}