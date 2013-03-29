
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
     //fixDef.damping = 0.5
	
   //paddle
     var bodyDef = new b2BodyDef;
     bodyDef.type = b2Body.b2_dynamicBody;
     bodyDef.fixedRotation = true;
     
     
	 fixDef.shape = new b2PolygonShape();
	 fixDef.shape.SetAsBox(0.5,0.1)
	 bodyDef.position.x = 0;
	 bodyDef.position.y = -4;
	 var barbody = world.CreateBody(bodyDef);
	 barbody.CreateFixture(fixDef)
	 barbody.SetLinearDamping(5.9);
	 window.bar =barbody;
     	 
     
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
	 
 
	 //lower wall
     var bodyDef = new b2BodyDef;
     bodyDef.type = b2Body.b2_staticBody;        
	 fixDef.shape = new b2PolygonShape();
	 fixDef.shape.SetAsBox(6,1)
	 bodyDef.position.x = 0;
	 bodyDef.position.y = -6;
	 var wallbody = world.CreateBody(bodyDef);
	 wallbody.CreateFixture(fixDef)	    

 
	 //higer wall
	 var bodyDef = new b2BodyDef;
     bodyDef.type = b2Body.b2_staticBody;        
	 fixDef.shape = new b2PolygonShape();
	 fixDef.shape.SetAsBox(6,1)
	 bodyDef.position.x = 0;
	 bodyDef.position.y = 6;
	 var wallbody = world.CreateBody(bodyDef);
	 wallbody.CreateFixture(fixDef)	
	 
	 //left wall
	 var bodyDef = new b2BodyDef;
     bodyDef.type = b2Body.b2_staticBody;        
	 fixDef.shape = new b2PolygonShape();
	 fixDef.shape.SetAsBox(1,6)
	 bodyDef.position.x = -6;
	 bodyDef.position.y = 0;
	 var wallbody = world.CreateBody(bodyDef);
	 wallbody.CreateFixture(fixDef)		 
	 
	 //right wall
	 var bodyDef = new b2BodyDef;
     bodyDef.type = b2Body.b2_staticBody;        
	 fixDef.shape = new b2PolygonShape();
	 fixDef.shape.SetAsBox(1,6)
	 bodyDef.position.x = 6;
	 bodyDef.position.y = 0;
	 var wallbody = world.CreateBody(bodyDef);
	 wallbody.CreateFixture(fixDef)	
      
        
     //create joint
	 	 	 fixDef.shape = new b2PolygonShape();
	 fixDef.shape.SetAsBox(0.5,0.1)
	 bodyDef.position.x = 0;
	 bodyDef.position.y = 4;
	 var fakebody = world.CreateBody(bodyDef);
	 fakebody.CreateFixture(fixDef)
	 fakebody.SetLinearDamping(5.9);
	 
	 var jointDef = new b2PrismaticJointDef();
	 var worldAxis = new b2Vec2(1, 0.0);
	 jointDef.collideConnected = true;
	 jointDef.enableLimit = true;
	 jointDef.lowerTranslation = 1;
	 jointDef.upperTranslation = 1;
	 jointDef.Initialize(barbody, fakebody, barbody.GetWorldCenter(), worldAxis);
	 world.CreateJoint(jointDef);
        
           
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
		pointLight.position.z = 2;
		
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
        console.log(color)
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
        
        
        	

        
        bar.getMesh().material = material;
        
        //ball = new Ball();
        
        
        
        geometry = new THREE.CubeGeometry( 10, 10, 1 );
        //material = new THREE.MeshBasicMaterial( { color: 0xff0000,  shading: THREE.FlatShading, overdraw: true} );
        plane = new THREE.Mesh( geometry, material );
        plane.position.z = -1;
        plane.receiveShadow = true;
        scene.add(plane);
 

        renderer = new THREE.WebGLRenderer({'alpha':true});
       //renderer = new THREE.CanvasRenderer();
        
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;
        renderer.setSize( gameSize.x, gameSize.y );
        

        document.getElementById('3dcanvas').appendChild( renderer.domElement );
        
        
        window.b.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0,-0.5),window.b.GetWorldCenter())
        
	}
	
	
	
	var DO = [] 
	var allow = true;
	var allowWall = true;
    function animate() {

        camera.position.z = ((document.getElementById("z").value) *1) || 1000;
        camera.position.y = ((document.getElementById("y").value) *1) ||-2000
        camera.rotation.x = ((document.getElementById("x").value) *1) ||0.9;
      

         
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
     
        //camera.rotation.z = 0;
        
        var diff = 0 - bar.getMesh().position.x;
        
        camera.position.x = -diff/1.2;
        camera.position.y += 1.2
        window.camera = camera; 
         
        renderer.render( scene, camera );

    }
	
	
	init();
}



brick();