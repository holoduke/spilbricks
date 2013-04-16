function brick2()
{
	var animFrame = window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
    	        window.mozRequestAnimationFrame    ||
        	    window.oRequestAnimationFrame      ||
            	window.msRequestAnimationFrame     ||
            	null ;
<<<<<<< Updated upstream

    var gameStateMachine = new GameStateMachine();
	
	var update = function(){
		gameStateMachine.update();
		gameStateMachine.draw();
=======
 
	var score = 0; 
	var stopgame = false;
	
	var update = function(){
		
		return;
		view.clear();
		
		hasCollision = false;

		if(colMng.hasCollided(b, p)){

			b.hitBrick(colMng.hitDist(b, p));
			p.hitBall();

			hasCollision = true;
		}

		for(var i=0; i < gameLevel.elements.length; i++)
		{	
			if(!hasCollision)
			{
				if(colMng.hasCollided(b, gameLevel.elements[i])){

					b.hitBrick(colMng.hitDist(b, gameLevel.elements[i]));
					gameLevel.elements[i].hitBall();
					
					if(gameLevel.hitBrick(i)){
						event.pub("brickhit");
					}

					hasCollision = true;
				}
			}

			view.draw(gameLevel.elements[i]);
		}

		for(var w = gameLevel.explosions.length; w > 0; w--)
		{
			
			if(gameLevel.explosions[w-1].update())
			{
				gameLevel.explosions[w - 1].destroy();
				gameLevel.explosions.splice(w - 1, 1);
			}else{
				for(var t = 0; t < gameLevel.explosions[w - 1].parts.length; t++)
				{
					view.draw(gameLevel.explosions[w - 1].parts[t]);
				}
			}
		}

		b.update();
		view.draw(b);

		p.update();
		view.draw(p);
		
		gameLevel.update();
		
		if(gameLevel.elements.length == 0)
		{
			gameIsOver();
		}
>>>>>>> Stashed changes
	}

	var init = function (){
<<<<<<< Updated upstream
		gameStateMachine.setState(gameStateMachine.SPLASH_STATE);

		if ( animFrame !== null ) {
	        var recursiveAnim = function() {
	            update();
	            animFrame( recursiveAnim );
	        };
		    animFrame( recursiveAnim );
	    } else {
	     	window.setInterval(update, 20);
	    } 
	}
=======
//		p.init(gameSize.width);
//		p.y = 500;
//		b.init(gameSize);
//		gameLevel.init(gameSize, getIntro());
//		view.size(gameSize.width, gameSize.height);
		
		initEngine();
		
		//update();
		registerEvents();
		
	//	updateGameState(GAMESTATE.splash);
	
		//document.addEventListener('keydown', startGame);
	}
	var camera, scene, renderer;
    var geometry, material, mesh;
	var initEngine = function(){
	    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/2 / window.innerHeight/2, 1, 10000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();

        geometry = new THREE.CubeGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false} );

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth/2, window.innerHeight/2 );

        document.getElementById('3dcanvas').appendChild( renderer.domElement );		
	}
	
	var registerEvents = function(){
		
		document.addEventListener('keydown', function(e){
			
			switch (e.keyCode){
			
			case 13:
				if (currentGameState == GAMESTATE.splash){
					updateGameState(GAMESTATE.starting)					
				}
				break;
			}		
		});
		
		event.sub("startGame",function(){
			stopgame = false;
			updateGameState(GAMESTATE.start);
		})
		
		event.sub("gameover",function(){
			updateGameState(GAMESTATE.splash);
			
			//gameLevel = null;
			//gameLevel = new level();
			//gameLevel.init(gameSize, getLevel());
		})
		
		event.sub("brickhit",function(){
			view.drawScore(++score);
		})
	}
	
	/**
	 * updates game state
	 * first end current state then start new state
	 */
	var updateGameState = function(state){
				
		//stop old state
		switch (currentGameState){
		
			case GAMESTATE.splash:
				stopSplashScreen();
				break;
			case GAMESTATE.start:
				stopGame();
				break;	
		}
		
		//start new state
		currentGameState = state;
		
		
		switch (state){
		    case GAMESTATE.splash:
		    	showSplashScreen();
		    	break;
		
			case GAMESTATE.starting:
				startStartingScreen();
				break;
				
			case GAMESTATE.start:
				startGame();
				break;	
		}
	}
		
	var startScreenTimer = null;
	var showSplashScreen = function(){
		
		view.drawSplash({shape:'rectangle',rgb:'rgba(255,255,255,.6)',x:0,y:0,width:gameSize.width,height:gameSize.width});
		var i = 0;
		function drawStartText(){		
			startScreenTimer = setTimeout(function(){
				
				
				if (i % 2){
					view.clearSplash();
					view.drawSplash({shape:'rectangle',rgb:'rgba(255,255,255,.6)',x:0,y:0,width:gameSize.width,height:gameSize.width});
				}
				else{
					view.drawText({text:"Press enter to start",font:"bold 48pt sans-serif",x:100,y:300});
				}
				
				//view.drawSplash({shape:'rectangle',rgb:'rgba(255,255,255,.4)',x:0,y:0,width:gameSize.width,height:gameSize.width});
				
				drawStartText();
				i++;
			},500)	
		}
		drawStartText();
	}
	
	var stopSplashScreen = function(){
		clearTimeout(startScreenTimer);
	}
	
	
	var startStartingScreen = function(){
				
		var i = 3;
		
		function drawStartText(){
			
			view.clearSplash();
			
			view.drawSplash({shape:'rectangle',rgb:'rgba(255,255,255,0.6)',x:0,y:0,width:gameSize.width,height:gameSize.width});
		
			view.drawText({text:i,font:"bold 98pt sans-serif",x:360,y:300});
			
			i--;
			
			if (i < 0){
				view.clearSplash();
				return event.pub("startGame");
			}
			
			startScreenTimer = setTimeout(function(){
				drawStartText();
			},1000)	
		}
		drawStartText();
	}
	
	
	var startGame = function(event) {
		
//			view.drawScore();
//		
//		    if ( animFrame !== null ) {
//		        var recursiveAnim = function() {
//		            update();
//		            if (stopgame) return;
//		            animFrame( recursiveAnim );
//		        };
//			    animFrame( recursiveAnim );
//		    } else {
//		     	//window.setInterval(update, 1000);
//		    }  
		     
		    animate();
	    
	}
	
    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }
	
	var stopGame = function(){
		score = 0;
		view.clearScore();
		stopgame = true;
	}
	
	var gameIsOver = function(){

		event.pub("gameover");
	}
	
	
>>>>>>> Stashed changes

	init();
}


function brick(){
	
	var gameSize = {x:800, y:600};
	
	//cannon physics
	var body, world, shape, mass, ground; 
	
	//three js
	var camera, scene, renderer;
    var geometry, material, mesh;
    
    //objects
    var ball,bar;
    
    var collitionManager;
    
    init = function(){
    	
    	initPhysics();
    	initRender();
    	animate();
    }
    
    var groundBody;
    var initPhysics = function(){
       
        world = new CANNON.World();
        world.gravity.set(0,0,-500);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 10;
        world.solver.tolerance = 0.01;
        world.defaultContactMaterial.contactEquationStiffness = 1e7;
        world.defaultContactMaterial.contactEquationRegularizationTime = 0;
        
        var stone = new CANNON.Material('stone');
        var stone_stone = new CANNON.ContactMaterial(stone,
      					       stone,
      					       1.03, // friction
      					       0.1  // Restitution
      					       );
        world.addContactMaterial(stone_stone);
        
        var bounce = new CANNON.Material('bounce');
        var bounce_bounce= new CANNON.ContactMaterial(bounce,
      					       bounce,
      					       0.0, // friction
      					       1.4  // Restitution
      					       );
        world.addContactMaterial(bounce_bounce);
        
        var tbounce = new CANNON.Material('turbobounce');
        var tbounce_bounce= new CANNON.ContactMaterial(tbounce,
      					       tbounce,
      					       0.0, // friction
      					       2.4  // Restitution
      					       );
       // world.addContactMaterial(tbounce_bounce);
        
        var sphereShape = new CANNON.Sphere(16);
        var mass = 15, radius = 16;
        var mat1 = new CANNON.Material();
        body = new CANNON.RigidBody(mass,sphereShape,bounce);
        body.velocity.set(400,1900,200)
        body.position.set(0, 0, 200);
        body.linearDamping = 0.001;
        world.add(body);
        //demo.addVisual(shapeBody1);


      
        // Create a plane (bottom)
        var groundShape = new CANNON.Plane(new CANNON.Vec3(1,1,1));
        groundBody = new CANNON.RigidBody(0,groundShape,stone);
        world.add(groundBody);
        
        //plane -x (left)
        var planeShapeXmin = new CANNON.Plane();
        var planeXmin = new CANNON.RigidBody(0, planeShapeXmin,bounce);
        planeXmin.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/2);
        planeXmin.position.set(-800,0,0);
        world.add(planeXmin);
        
        // Plane +x (right)
        var planeShapeXmax = new CANNON.Plane();
        var planeXmax = new CANNON.RigidBody(0, planeShapeXmax,bounce);
        planeXmax.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),-Math.PI/2);
        planeXmax.position.set(800,0,0);
        world.add(planeXmax);
      
        // Plane -y (front)
        var planeShapeYmin = new CANNON.Plane();
        var planeYmin = new CANNON.RigidBody(0, planeShapeYmin,bounce);
        planeYmin.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        planeYmin.position.set(0,-800,0);
        world.add(planeYmin);

        // Plane +y (Rear)
        var planeShapeYmax = new CANNON.Plane();
        var planeYmax = new CANNON.RigidBody(0, planeShapeYmax, bounce);
        planeYmax.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/2);
        planeYmax.position.set(0,800,0);
        world.add(planeYmax);
        
        
        var barShape = new CANNON.Box(new CANNON.Vec3(200,20,20));
    
        // Box
        b1 = new CANNON.RigidBody(0,barShape,bounce);
        //b1.position.set(5,0,0);
        //b1.velocity.set(-5,0,0);
        b1.linearDamping = 0.01;
        world.add(b1);
        
        b1.addEventListener("collide",function(e){
            //alert("The sphere just collided with the ground!");
            console.log(e); // Print the object to console to inspect it
            
            e.with.velocity.x *=1.2;
            e.with.velocity.y *=1.2;
            e.with.velocity.z *=1;
            
            //e.with.velocity.x = Math.min(20,e.with.velocity.x);
            //e.with.velocity.y = Math.min(20,e.with.velocity.y);
            //e.with.velocity.z = Math.min(20,e.with.velocity.z);
        });
        
       // demo.adbisual(b1);
        
    }
    
    var b1;
    
    var plane;
	var initRender = function(){
		
		collitionManager = new CollitionManager();

	    camera = new THREE.PerspectiveCamera( 30, gameSize.x / gameSize.y, 1, 10000 );
        camera.position.z = ((document.getElementById("z").value) *1) || 1000;
        camera.position.y = ((document.getElementById("y").value) *1) ||-2000
        camera.rotation.x = ((document.getElementById("x").value) *1) ||0.9;

        
        
        
        scene = new THREE.Scene();
        
        //light
        var ambient = new THREE.AmbientLight( 0x101010 );
		scene.add( ambient );

		directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 0, -70, 100 ).normalize();
		directionalLight.castShadow = true;
		scene.add( directionalLight );

		pointLight = new THREE.PointLight( 0xffaa00 );
		scene.add( pointLight );
		pointLight.position.z = 200;
		
		lightMesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
		lightMesh.scale.x = lightMesh.scale.y = lightMesh.scale.z = 0.05;
		lightMesh.position = pointLight.position;
		scene.add( lightMesh );
        
		
		
		
        bar = new pBar();
        scene.add(bar.getMesh());
        bar.getMesh().castShadow = true;
         
        var geometry = new THREE.SphereGeometry( this.radius, 16, 8 );
        material = new THREE.MeshPhongMaterial( 
        	{ color: Math.random() * 0xffffff 
        	  ,shininess: 50
        	} );

        ball = new THREE.Mesh( geometry, material );
        ball.useQuaternion = true;
        ball.castShadow = true;
       
        
        bar.getMesh().material = material;
        
        //ball = new Ball();
        scene.add(ball);
        
        
        geometry = new THREE.CubeGeometry( 1600, 1600, 50 );
        //material = new THREE.MeshBasicMaterial( { color: 0xff0000,  shading: THREE.FlatShading, overdraw: true} );
        plane = new THREE.Mesh( geometry, material );
        plane.receiveShadow = true;
        scene.add(plane);
        
        collitionManager.add({mesh:ball,type:'sphere'});
        collitionManager.add({mesh:bar,type:'box',fixed:true});

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
	}
	
    function animate() {

        camera.position.z = ((document.getElementById("z").value) *1) || 1000;
        camera.position.y = ((document.getElementById("y").value) *1) ||-2000
        camera.rotation.x = ((document.getElementById("x").value) *1) ||0.9;
    	
        // note: three.js includes requestAnimationFrame shim
    	world.step(1/60);
    	requestAnimationFrame( animate );
        
        
    	
//console.log(body.position.z,ball.getMesh().position.z,groundBody.position.z)
        
        // Copy coordinates from Cannon.js to Three.js
  
        //console.log(body);
        body.position.copy(ball.position);
        body.quaternion.copy(ball.quaternion);
        
        b1.position.x = bar.getMesh().position.x
        b1.position.y = bar.getMesh().position.y;
        //body.quaternion.copy(ball.getMesh());
        
        plane.position.x = groundBody.position.x
        plane.position.y = groundBody.position.y
        plane.position.z = groundBody.position.z-50
        
        bar.update();
        //ball.update();
       // mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;
        camera.lookAt( {'x':bar.getMesh().position.x,'y':bar.getMesh().position.y,'z':bar.getMesh().position.z+500} );
     
        camera.rotation.z = 0;
        
        var diff = 0 - bar.getMesh().position.x;
        
        camera.position.x = -diff/1.2;
        
         
        renderer.render( scene, camera );

    }
	
	
	init();
}



brick();