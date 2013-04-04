
function brick(){
	
	var gameSize = {x:1000, y:600};
	
	//cannon physics
	var body, world, shape, mass, ground; 
	
	//three js
	var camera, scene, renderer;
    var geometry, material, mesh;
    
    //objects
    var ball,bar;
    
    var collitionManager;
    
    init = function(){
    	
    	initRender();
    	initPhysics();
    	
    	
    	animate();
    }
    
    var groundBody;
    
    var initPhysics = function(){

    }
    
    var b1;
    var leftWall;
    var rightWall;
    var topWall;
    var plane;
    var walls = [];
    
	var initRender = function(){
		
		collitionManager = new CollitionManager();

	    camera = new THREE.PerspectiveCamera( 50, gameSize.x / gameSize.y, 1, 10000 );
        camera.position.z = ((document.getElementById("z").value) *1) || 1000;
        camera.position.y = ((document.getElementById("y").value) *1) ||-2000
        camera.rotation.x = ((document.getElementById("x").value) *1) ||0.9;
    
        scene = new THREE.Scene();
        

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
     
     var world = new b2World(
           new b2Vec2(0, 0)    //gravity
        ,  true                 //allow sleep
     );
     
     
     scene.world2 = world;   

     
     var fixDef = new b2FixtureDef;
     fixDef.density = 11.0;
     fixDef.friction = 50;
     fixDef.linearDamping = 1005;
     fixDef.restitution = 0;
     //fixDef.isSensor = true;
     //fixDef.damping = 0.5
	
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
	 window.bar =barbody;
     
	 
	 
	 var debugDraw = new Box2D.Dynamics.b2DebugDraw;
	 debugDraw.SetSprite(document.getElementById("test").getContext("2d"));
	 
	 
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
	 
	 //groundBox.SetAsEdge(new b2Vec2(5, -5), new b2Vec2(-5,-5));
//	 _groundBody.CreateFixture(groundBoxDef);
//	 groundBox.SetAsEdge(new b2Vec2(6, 6), new b2Vec2(6, 0));
//	 _groundBody.CreateFixture(groundBoxDef);
	 
	  
	 
	 
     
     //frixture def  
     var fixDef = new b2FixtureDef;
     fixDef.density = 1.0;
     fixDef.friction = 0;
     fixDef.restitution = 1;
     
     //ball
     var bodyDef = new b2BodyDef;
     bodyDef.type = b2Body.b2_dynamicBody;
        
	 fixDef.shape = new b2CircleShape(
	         0.2 // radius
	      );
	 bodyDef.position.x = 0;
	 bodyDef.position.y = 0;
	 var ballbody = world.CreateBody(bodyDef);
	 ballbody.CreateFixture(fixDef)	    
	 window.b =ballbody;
	 
 
//	 //lower wall
//     var bodyDef = new b2BodyDef;
//     bodyDef.type = b2Body.b2_staticBody;        
//	 fixDef.shape = new b2PolygonShape();
//	 fixDef.shape.SetAsBox(6,1)
//	 bodyDef.position.x = 0;
//	 bodyDef.position.y = -6;
//	 var wallbody = world.CreateBody(bodyDef);
//	 wallbody.CreateFixture(fixDef)	    
//
// 
//	 //higer wall
//	 var bodyDef = new b2BodyDef;
//     bodyDef.type = b2Body.b2_staticBody;        
//	 fixDef.shape = new b2PolygonShape();
//	 fixDef.shape.SetAsBox(6,1)
//	 bodyDef.position.x = 0;
//	 bodyDef.position.y = 6;
//	 var wallbody = world.CreateBody(bodyDef);
//	 wallbody.CreateFixture(fixDef)	
//	 
//	 //left wall
//	 var bodyDef = new b2BodyDef;
//     bodyDef.type = b2Body.b2_staticBody;        
//	 fixDef.shape = new b2PolygonShape();
//	 fixDef.shape.SetAsBox(1,6)
//	 bodyDef.position.x = -6;
//	 bodyDef.position.y = 0;
//	 var wallbody = world.CreateBody(bodyDef);
//	 wallbody.CreateFixture(fixDef)		 
//	 
//	 //right wall
//	 var bodyDef = new b2BodyDef;
//     bodyDef.type = b2Body.b2_staticBody;        
//	 fixDef.shape = new b2PolygonShape();
//	 fixDef.shape.SetAsBox(1,6)
//	 bodyDef.position.x = 6;
//	 bodyDef.position.y = 0;
//	 var wallbody = world.CreateBody(bodyDef);
//	 wallbody.CreateFixture(fixDef)	
//      
//        
//     //create joint
//	 	 	 fixDef.shape = new b2PolygonShape();
//	 fixDef.shape.SetAsBox(0.5,0.1)
//	 bodyDef.position.x = 0;
//	 bodyDef.position.y = 4;
//	 var fakebody = world.CreateBody(bodyDef);
//	 fakebody.CreateFixture(fixDef)
//	 fakebody.SetLinearDamping(5.9);
//	 
//	 var jointDef = new b2PrismaticJointDef();
//	 var worldAxis = new b2Vec2(0, 0);
//	 //jointDef.collideConnected = true;
//	 //jointDef.enableLimit = true;
//	 //jointDef.lowerTranslation = 0.1;
//	 //jointDef.upperTranslation = 0.1;
//	 jointDef.Initialize(barbody, _groundBody, barbody.GetPosition(), new b2Vec2(0, 0));
//	 world.CreateJoint(jointDef);
        
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
         
        var geometry = new THREE.SphereGeometry( 0.2, 16, 8 );
        var color = Math.random() * 0xffffff;
        console.log("color",color)
        material = new THREE.MeshPhongMaterial( 
        	{ color: 1677812.5796820712 
        	  ,shininess: 50
        	  //,wireframe:true
        	} );

        ball = new THREE.Mesh( geometry, material );
        ball.useQuaternion = true;
        ball.receiveShadow = true;
        ball.castShadow = true;
        ballbody.mesh = ball;
        scene.add(ball);
        
        
        	

        
       // bar.getMesh().material = material;
        
        //ball = new Ball();
        
        
        
        geometry = new THREE.CubeGeometry( 10, 10, 1 );
        //material = new THREE.MeshBasicMaterial( { color: 0xff0000,  shading: THREE.FlatShading, overdraw: true} );
        plane = new THREE.Mesh( geometry, material );
        plane.position.z = -0.7;
        plane.receiveShadow = true;
        scene.add(plane);
 
        //bricks
        
        material = new THREE.MeshPhongMaterial( 
            	{ color: 10904104.10397096 
            	  ,shininess: 50
            	  //,wireframe:true
            	} );
        
        
        
        function createBlock(x,y,xw,yw){
            var fixDef = new b2FixtureDef;
            fixDef.density = 11.0;
            
            
            fixDef.restitution = 0;
            //fixDef.isSensor = true;
            //fixDef.damping = 0.5
       	
 
            var bodyDef = new b2BodyDef; 
            bodyDef.type = b2Body.b2_staticBody;
            
			fixDef.shape = new b2PolygonShape();
			fixDef.shape.SetAsBox(xw, yw)
			bodyDef.position.x = x;
			bodyDef.position.y = y;
			bodyDef.userData = "test"
			var barbody = world.CreateBody(bodyDef);
			barbody.CreateFixture(fixDef)
			barbody.SetLinearDamping(5.9);
			window.bar = barbody;

			geometry = new THREE.CubeGeometry(xw*2, yw*2, 0.5);
			// material = new THREE.MeshBasicMaterial( { color: 0xff0000,
			// shading: THREE.FlatShading, overdraw: true} );
			plane = new THREE.Mesh(geometry, material);
			plane.position.z = 0;
			plane.position.x = bodyDef.position.x
			plane.position.y = bodyDef.position.y
			plane.receiveShadow = true;
			scene.add(plane);
	       	 
        }
        
        createBlock(-1,0,  0.49,0.25);
        createBlock(0,0,  0.49,0.25);
        createBlock(1,0,  0.49,0.25);
        createBlock(2,0,  0.49,0.25);
        
        createBlock(-1.5,0.6,  0.49,0.25);
        createBlock(0.5,0.6,  0.49,0.25);
        createBlock(1.5,0.6,  0.49,0.25);
        createBlock(2.5,0.6,  0.49,0.25);
        
        
        var contactListener = new Box2D.Dynamics.b2ContactListener;
        contactListener.BeginContact = function(contact, manifold) {
           //do some stuff 
        	console.log('col',contact,manifold)
        };
        world.SetContactListener(contactListener);
        

        renderer = new THREE.WebGLRenderer({'alpha':true,antialias:true});
       //renderer = new THREE.CanvasRenderer();
        
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.anti
        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;
        renderer.setSize( gameSize.x, gameSize.y );
        

        document.getElementById('3dcanvas').appendChild( renderer.domElement );
        
         
        window.b.ApplyImpulse(new Box2D.Common.Math.b2Vec2(1.2,1.5),window.b.GetWorldCenter())
        
	}
	
	
	
	var DO = [] 
	var allow = true;
	var allowWall = true;
	
	var inita = false;
	
	var maxSpeed = 10;
	var speed = null;
	
    function animate() {

    	//if (!inita){
	        camera.position.z = ((document.getElementById("z").value) *1) || 1000;
	        camera.position.y = ((document.getElementById("y").value) *1) ||-2000
	        camera.rotation.x = ((document.getElementById("x").value) *1) ||0.9;
	        inita = true;
    	//}
      

	    //restrict max speedd ball
	    
	    speed = b.GetLinearVelocity().Length()
	    maxSpeed = 10;
	        
	   /// console.log(speed);
	    
	    if (speed > 10){
	    	b.SetLinearDamping(0.5);
	    }
	    else if (speed < maxSpeed) {
	        b.SetLinearDamping(0.0);
	    }
	        
        scene.world2.Step(1 / 60, 10, 10);
        //world.DrawDebugData();
        scene.world2.ClearForces();
      
        bar.update();
        
        
        //window.b.mesh
        window.b.mesh.position.x = window.b.GetPosition().x;
        window.b.mesh.position.y = window.b.GetPosition().y;
        //window.b.mesh.quaternion.z = rotation.z();
        //window.b.mesh.quaternion.w = rotation.w();
        
        
        bar.getMesh().position.x = bar.boxmodel.GetPosition().x;
        bar.getMesh().position.y = bar.boxmodel.GetPosition().y;
        
        
    	requestAnimationFrame( animate );
        
        
        
        //ball.update();
       // mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;
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