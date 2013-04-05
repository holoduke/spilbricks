
function brick(){
	
	var gameSize = {x:1000, y:600};
	
	//cannon physics
	var body, world, shape, mass, ground; 
	
	//three js
	var camera, scene, renderer;
    var geometry, material, mesh;
    
    //objects
      
    init = function(){
    	
    	setupWorld();
    	setupObjects();
    	animate();
    }
    
    var groundBody;
        
    var b1;
    var plane;
    var walls = [];
    
    //reference to the paddle
    var paddle;
    //reference to the ball
    var ball
    
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
    ,  b2AABB = Box2D.Collision.b2AABB
 	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
 	,	b2Body = Box2D.Dynamics.b2Body
 	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
 	,	b2Fixture = Box2D.Dynamics.b2Fixture
 	,	b2World = Box2D.Dynamics.b2World
 	,	b2MassData = Box2D.Collision.Shapes.b2MassData
 	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
 	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
 	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ;  b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
    ;
    
    
	var setupWorld = function(){
	
		//setup camera
		camera = new THREE.PerspectiveCamera( 50, gameSize.x / gameSize.y, 1, 10000 );
		camera.position.z = ((document.getElementById("z").value) *1) || 1000;
		camera.position.y = ((document.getElementById("y").value) *1) ||-2000
		camera.rotation.x = ((document.getElementById("x").value) *1) ||0.9;
		
		//create three world
		scene = new THREE.Scene();
		
		//create box2d physics world
		var world = new b2World(new b2Vec2(0, 0) // gravity
		, true // allow sleep
		);
     
		//attach box2d world to the three js scene for reference
		scene.box2dworld = world;   

		
     
     var fixDef = new b2FixtureDef;
     fixDef.density = 11.0;
     fixDef.friction = 50;
     fixDef.linearDamping = 1005;
     fixDef.restitution = 0;
    
   //paddle
     var bodyDef = new b2BodyDef; 
     bodyDef.type = b2Body.b2_dynamicBody;
   //  bodyDef.fixedRotation = true;
     
     
	 fixDef.shape = new b2PolygonShape();
	 fixDef.shape.SetAsBox(0.5,0.1)
	 bodyDef.position.x = 0;
	 bodyDef.position.y = -4;
	 var barbody = world.CreateBody(bodyDef);
	 barbody.CreateFixture(fixDef)
	 barbody.SetLinearDamping(5.9);
	 paddle =barbody;
     
	 

	 var groundBodyDef = new b2BodyDef;
	 groundBodyDef.type = b2Body.b2_staticBody; 
	 groundBodyDef.position.Set(0,0);
	 var _groundBody = world.CreateBody(groundBodyDef);
	 
	 var groundBox = new b2PolygonShape();
	 var groundBoxDef = new b2FixtureDef;
	 groundBoxDef.shape = groundBox;
	 
	 
	 groundBox.SetAsEdge(new b2Vec2(5,5), new b2Vec2(-5, 5));
	 var bottomFixture = _groundBody.CreateFixture(groundBoxDef);
	 
	 groundBox.SetAsEdge(new b2Vec2(-5,5), new b2Vec2(-5, -5));
	 _groundBody.CreateFixture(groundBoxDef);
	 
	 groundBox.SetAsEdge(new b2Vec2(-5,-5), new b2Vec2(5, -5));
	 _groundBody.CreateFixture(groundBoxDef);

	 
	 groundBox.SetAsEdge(new b2Vec2(5,-5), new b2Vec2(5, 5));
	 _groundBody.CreateFixture(groundBoxDef);
	 

     
     //frixture def  
     var fixDef = new b2FixtureDef;
     fixDef.density = 1.0;
     fixDef.friction = 0;
     fixDef.restitution = 1;
     
 

        
	 var worldAxis = new b2Vec2(1.0, 0.0);
	 
	 var prismaticJointDef = new b2PrismaticJointDef();
	 prismaticJointDef.Initialize(barbody, _groundBody, barbody.GetWorldCenter(), worldAxis);
	 prismaticJointDef.lowerTranslation = -4.5;
	 prismaticJointDef.upperTranslation = 4.5;
	 prismaticJointDef.enableLimit = true;
	 prismaticJointDef.maxMotorForce = 1.0;
	 prismaticJointDef.motorSpeed = 0.0;
	 prismaticJointDef.enableMotor = true;
	  
	 world.CreateJoint(prismaticJointDef);
	 
         
//	 b2PrismaticJointDef jointDef;
//	 b2Vec2 worldAxis(1.0f, 0.0f);
//	 jointDef.collideConnected = true;
//	 jointDef.Initialize(_paddleBody, _groundBody, 
//	   _paddleBody->GetWorldCenter(), worldAxis);
//	 _world->CreateJoint(&jointDef);
//	 
	 
	 
        //light
        var ambient = new THREE.AmbientLight( 0x101010 );
		scene.add( ambient );

		directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 0, 0, 2 ).normalize();
		directionalLight.castShadow = true;
		scene.add( directionalLight );

		
		window.light = directionalLight;
		
		pointLight = new THREE.PointLight( 0xffaa00 );
		scene.add( pointLight );
		pointLight.position.z = 3;
		pointLight.position.y = -1;
		
		lightMesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
		lightMesh.scale.x = lightMesh.scale.y = lightMesh.scale.z = 0.05;
		lightMesh.position = pointLight.position;
		scene.add( lightMesh );
        
		
		
		
        bar = new pBar();
        bar.boxmodel = barbody;
        scene.add(bar.getMesh());
        bar.getMesh().castShadow = true;
        bar.getMesh().receiveShadow = true;
         
        
        
        geometry = new THREE.CubeGeometry( 10, 10, 0.3 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000,  shading: THREE.FlatShading, overdraw: true} );
        plane = new THREE.Mesh( geometry, material );
        plane.position.z = -0.4;
        plane.receiveShadow = true;
        scene.add(plane);
 
        //bricks
        
        material = new THREE.MeshPhongMaterial( 
            	{ color: 10904104.10397096 
            	  ,shininess: 50
            	  //,wireframe:true
            	} );
        
        
       
        

        createBlock(-3,0,  0.49,0.25);
        createBlock(-2,0,  0.49,0.25);
        createBlock(-1,0,  0.49,0.25);
        createBlock(0,0,  0.49,0.25);
        createBlock(1,0,  0.49,0.25);
        createBlock(2,0,  0.49,0.25);
        createBlock(3,0,  0.49,0.25);
        
        createBlock(-2.5,0.6,  0.49,0.25);
        createBlock(-1.5,0.6,  0.49,0.25);
        createBlock(-0.5,0.6,  0.49,0.25);
        createBlock(0.5,0.6,  0.49,0.25);
        createBlock(1.5,0.6,  0.49,0.25);
        createBlock(2.5,0.6,  0.49,0.25);
                
        createBlock(-2.0,1.2,  0.49,0.25);
        createBlock(-1.0,1.2,  0.49,0.25);
        createBlock(-0.0,1.2,  0.49,0.25);
        createBlock(1.0,1.2,  0.49,0.25);
        createBlock(2.0,1.2,  0.49,0.25);
        
        createBlock(-1.5,1.8,  0.49,0.25);
        createBlock(-0.5,1.8,  0.49,0.25);
        createBlock(0.5,1.8,  0.49,0.25);
        createBlock(1.5,1.8,  0.49,0.25);
        
        createBlock(-1.0,2.4,  0.49,0.25);
        createBlock(-0.0,2.4,  0.49,0.25);
        createBlock(1.0,2.4,  0.49,0.25);
        
        
        
        var contactListener = new Box2D.Dynamics.b2ContactListener;
        contactListener.BeginContact = function(contact, manifold) {
           //do some stuff 
        	var fa = contact.GetFixtureA();
        	var fb = contact.GetFixtureB();
        	
        	var bA = fa.GetBody();
        	var bB = fb.GetBody();
        	
        	var ballbody = null;
        	var brick = null;
        	
        	if (bA.GetUserData() && bA.GetUserData().name == 'ball'){
        		ballbody = bA;
        		
        		if (bB.GetUserData() && bB.GetUserData().name == 'brick'){
        			brick = bB;
        		}
        	}
        	if (bB.GetUserData() && bB.GetUserData().name == 'ball'){
        		ballbody = bB;
        		
        		if (bA.GetUserData() && bA.GetUserData().name == 'brick'){
        			brick = bA;
        		}
        	}
        	
        	//if we have ball brick colition
        	if (ballbody && brick){
        		
        		destroySchedule.push(brick);
        		console.log('aapi')
        	
        	}
        	
        	
        	console.log(bA.GetUserData(),bB.GetUserData())
        	
        	//console.log('col',contact,manifold)
        };
        world.SetContactListener(contactListener);
        

        renderer = new THREE.WebGLRenderer({'alpha':true,antialias:true});
       //renderer = new THREE.CanvasRenderer();
        
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.anti
//        renderer.shadowCameraNear = 3;
//        renderer.shadowCameraFar = camera.far;
//        renderer.shadowCameraFov = 50;
       // renderer.setClearColorHex ( 0xff0000, 0 );
        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;
        renderer.setSize( gameSize.x, gameSize.y );
        

        document.getElementById('3dcanvas').appendChild( renderer.domElement );
        
         
       // ballBody.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0.7,1.0),ballBody.GetWorldCenter())
        
        //createBall();
        
//        var camera2 = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
//        camera2.position.z = 1000;
//
//       var scene2 = new THREE.Scene();
////
//        geometry = new THREE.CubeGeometry( 200, 200, 200 );
//
////
//        mesh = new THREE.Mesh( geometry, material );
//        scene2.addObject( mesh );
////
//        var renderer2 = new THREE.CanvasRenderer();
//        renderer2.setClearColorHex ( 0xff0000, 0 );
//        renderer2.setSize( gameSize.x, gameSize.y );
// 
//        document.getElementById('3dcanvas2').appendChild( renderer2.domElement );
        //document.body.appendChild( renderer2.domElement );
        
        
	}
	
	function setupObjects(){
		var body = createBall(0,-2);
		body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0.7,1.0),body.GetWorldCenter())	
	}
	
    function createBlock(x,y,xw,yw){

        var color = Math.random() * 0xffffff;
        console.log("color",color)
        material = new THREE.MeshPhongMaterial( 
        	{ color: color
        	  ,shininess: 50
        	  //,wireframe:true
        	} );
    	
    	
		geometry = new THREE.CubeGeometry(xw*2, yw*2, 0.5);
		plane = new THREE.Mesh(geometry, material);
		plane.position.z = 0;
		plane.position.x = x
		plane.position.y = y
		plane.receiveShadow = true;
		scene.add(plane);
    	
    	var fixDef = new b2FixtureDef;
        fixDef.density = 11.0;
                   
        fixDef.restitution = 0;
   	 
        var bodyDef = new b2BodyDef; 
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.userData = {'name':'brick','guiref':plane};
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(xw, yw)
		bodyDef.position.x = x;
		bodyDef.position.y = y;
		
		var barbody = scene.box2dworld.CreateBody(bodyDef);
		barbody.CreateFixture(fixDef)
		barbody.SetLinearDamping(5.9);

    }
	
	
	function createBall(x,y){
		
		 var geometry = new THREE.SphereGeometry( 0.2, 16, 8 );
	        var color = Math.random() * 0xffffff;
	        console.log("color",color)
	        material = new THREE.MeshPhongMaterial( 
	        	{ color: color 
	        	  ,shininess: 50
	        	  //,wireframe:true
	        	} );
		
		console.log('create ball')
        var ball = new THREE.Mesh( geometry, material );
        ball.useQuaternion = true;
        ball.receiveShadow = true;
        ball.castShadow = true;
        scene.add(ball);
		
	    var fixDef = new b2FixtureDef;
	    fixDef.density = 1.0;
	    fixDef.friction = 0;
	    fixDef.restitution = 1;
	     
	    var bodyDef = new b2BodyDef;
	    bodyDef.type = b2Body.b2_dynamicBody;
	    bodyDef.userData = {'name':'ball','guiref':ball};   
		fixDef.shape = new b2CircleShape(
		         0.2 // radius
		      );
		bodyDef.position.x = x;
		bodyDef.position.y = y;
		var ballbody = scene.box2dworld.CreateBody(bodyDef);
		ballbody.userData = {'name':'ball','guiref':ball};
	    ballbody.CreateFixture(fixDef)
	    
	    balls.push(ballbody);
	    
	    return ballbody;
	}
	
	var destroySchedule = [];
	
	var balls = [];
	
	var DO = [] 
	var allow = true;
	var allowWall = true;
	
	var inita = false;
	
	var maxSpeed = 10;
	var speed = null;
	
	
	function syncObjects(){
	    for (var i=0; i < balls.length;i++){
	    	
	    	balls[i].GetUserData().guiref.position.x = balls[i].GetPosition().x;
	    	balls[i].GetUserData().guiref.position.y = balls[i].GetPosition().y;
	    }		
	}
	
	function maintainBallSpeed(){
	    for (var i=0; i < balls.length;i++){
	    	
		    speed = balls[i].GetLinearVelocity().Length()
		    maxSpeed = 10;
		    
		    if (speed > 10){
		    	balls[i].SetLinearDamping(0.5);
		    }
		    else if (speed < maxSpeed) {
		    	balls[i].SetLinearDamping(0.0);
		    }
		    if (speed < 10){
		    	//todO
		    }
		    
	    }			
	}
	
	function destroyScheduledBricks(){
	    if (destroySchedule.length){
	    	
	    	for (var i =0; i < destroySchedule.length; i++){
	    		scene.box2dworld.DestroyBody(destroySchedule[i]);
	    		scene.remove( destroySchedule[i].GetUserData().guiref );
	    	}
	    	
	    	destroySchedule = [];
	    } 
	}
	
    function animate() {

	        camera.position.z = ((document.getElementById("z").value) *1) || 1000;
	        camera.position.y = ((document.getElementById("y").value) *1) ||-2000
	        camera.rotation.x = ((document.getElementById("x").value) *1) ||0.9;
	        inita = true;

      
	    
	    destroyScheduledBricks();
	    syncObjects();   
	    maintainBallSpeed();
	        
        scene.box2dworld.Step(1 / 60, 10, 10);
        scene.box2dworld.ClearForces();
      
        bar.update();
        
   
        
        bar.getMesh().position.x = bar.boxmodel.GetPosition().x;
        bar.getMesh().position.y = bar.boxmodel.GetPosition().y;
        
        
    	requestAnimationFrame( animate );
        
        
       
        camera.lookAt( {'x':bar.getMesh().position.x,'y':bar.getMesh().position.y,'z':bar.getMesh().position.z} );
     
        camera.rotation.z = 0;
        
        var diff = 0 - bar.getMesh().position.x;
        
        camera.position.x = -diff/1.2;
        camera.position.y += 1.2
        window.camera = camera; 
         
        renderer.render( scene, camera );

    }
	
	
	init();
}



brick();