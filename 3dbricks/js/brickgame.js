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
	}
	
	this.stop = function(){
		runAfter = function(){
			runAfter = null
			that.start();
			return false;
		}	
	}
	
	this.reset = function(){
		
		var that =this;
		
		runBefore = function(){
			runBefore = null
			cleanup();
			
			runAfter = function(){
				runAfter = null
				that.start();
				return false;
			}	
			
			return true;
		}
	}
	
	this.togglePause = function(){
		
		if (paused){
			animate();
		}
		else{
			runBefore = function(){
				runBefore = null;
				return false;
			};
		}
		
		paused = !paused;
	} 
	
	var setupWorld = function() {

		//setup camera
		camera = new THREE.PerspectiveCamera(50, gameSize.x / gameSize.y, 1,10000);

		//create three world
		scene = new THREE.Scene();

		//create box2d physics world
		var world = new b2World(new b2Vec2(0, 0) // gravity
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

		//        var angularSpeed = 0.2; // revolutions per second
		//        var lastTime = 0;
		// 
		//        var renderer2 = new THREE.WebGLRenderer();
		//        renderer2.setSize(gameSize.x, gameSize.y);
		//        document.body.appendChild(renderer2.domElement);
		// 
		//        // camera
		//        var camera2 = new THREE.PerspectiveCamera(50, gameSize.x / gameSize.y, 1, 1000 );
		//        camera2.position.z = 700;
		// 
		//        // scene
		//        var scene2 = new THREE.Scene();
		// 
		//        // cube
		//        var colors = [0x0000ff, 0x00ff00, 0x00ffff, 0xff0000, 0xff00ff, 0xffff00];
		//        var materials = [];
		// 
		//        for (var n = 0; n < 6; n++) {
		//            materials.push([new THREE.MeshBasicMaterial({
		//                color: colors[n]
		//            })]);
		//        }
		// 
		//       var  material = new THREE.MeshPhongMaterial( 
		//	        	{ color: 214234.23423423
		//	        	  ,shininess: 50
		//	        	  //,wireframe:true
		//	        	} );
		//        
		//       var material = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5 } );
		//       
		//        var cube = new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300, 1, 1, 1, material), material);
		//        cube.overdraw = true;
		//        scene2.add(cube);   
		// 
		//
		//        
		//         
		//        
		//       	 document.getElementById('3dcanvas2').appendChild( renderer2.domElement );
		//      // document.body.appendChild( renderer2.domElement );
		//        
		//        renderer2.render( scene2, camera2 );
		//
		//        var r = 0;
		//        function a(lastTime, angularSpeed){
		//        	
		//        	setTimeout(function(){
		//        		
		//        		//alert('ab')
		//        	
		////        	     	var date = new Date();
		////        	        var time = date.getTime();
		////        	        var timeDiff = time - lastTime;
		////        	        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
		//       	            cube.rotation.y += 0.01;
		////        	        lastTime = time;
		//        	        // render
		//        	        renderer2.render(scene2, camera2);
		//        	        
		//        	        a(lastTime, angularSpeed);
		//        	},50)
		//        	
		//        }
		//          
		//        var angularSpeed = 0.2; // revolutions per second
		//        var lastTime = 0;
		//        a(lastTime, angularSpeed); 

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
	
	var paddle;
	function setupObjects() {

		//create controlable paddle
		paddle = new Paddle(scene,scene.box2dworld);
		var paddleBody =paddle.create();
		syncedObjects.push(paddle);
		
		//create ball
		var ball = new Ball(scene,scene.box2dworld);
		var ballBody = ball.create(0,-3);
		ballBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0.1, 0.65), ballBody.GetWorldCenter())
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
		prismaticJointDef.lowerTranslation = -4.5;
		prismaticJointDef.upperTranslation = 4.5;
		prismaticJointDef.enableLimit = true;
		prismaticJointDef.maxMotorForce = 1.0;
		prismaticJointDef.motorSpeed = 0.0;
		prismaticJointDef.enableMotor = true;

		scene.box2dworld.CreateJoint(prismaticJointDef);
			
		//setup ground plane
		var color = Math.random() * 0xffffff;
		console.log(color)
		material = new THREE.MeshPhongMaterial({
			color : 13757355.379216421,
			shininess : 50,
			transparent: true, opacity: 0.2
		//,wireframe:true
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

		for ( var i = scene.children.length - 1; i >= 0; i--) {
			scene.remove(scene.children[i]);
		}
		
		var body;
		while (body = scene.box2dworld.GetBodyList().GetNext()){
			scene.box2dworld.DestroyBody(body);
		}
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
		if (ballbody && brick) {
			destroySchedule.push(brick);
		}
	}
	
	var destroySchedule = [];
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

		//update paddle controls
		paddle.updateControls();
		
		//update gui with physics objects
		for (var i=0; i <syncedObjects.length;i++){
			syncedObjects[i].sync();
		}
		
		//step physics
		scene.box2dworld.Step(1 / 60, 10, 10);
		scene.box2dworld.ClearForces();

		//make sure camera looks to paddle
		camera.lookAt({
			'x' : paddle.mesh.position.x,
			'y' : paddle.mesh.position.y,
			'z' : paddle.mesh.position.z
		});

		camera.rotation.z = 0;

		var diff = 0 - paddle.mesh.position.x;
		camera.position.x = -diff / 2; 
		camera.position.y += 2.5

		//render 3d scene
		renderer.render(scene, camera);

		event.pub("postAnimate");
		
		if (runAfter){
			if (!runAfter()) {return};
		}
		
		requestAnimationFrame(animate);
	}
}