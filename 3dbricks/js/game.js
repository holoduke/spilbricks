var game = (function(){
	
	var maxLifes = 3;
	var lifes = maxLifes;
	
	var gameSize = {
			x : 1000,
			y : 600
		};
	var game = new BrickGame()
	window.games = game;
	
	game.init();
	game.start();
	
	event.sub("game.dies",function(){
		
		if (!lifes){
			game.reset(function(){
				game.togglePause(function(){
					setTimeout(function(){
						game.togglePause();
					},1000)
				});
			});
			lifes = maxLifes
			
			return;
		}
		
		lifes--;
		
		game.resetBall(function(){
			game.togglePause(function(){
				setTimeout(function(){
					game.togglePause();
				},1000)
			});
		});
	});
		
	event.sub("game.brickDestroy",function(e){
		if (!e.bricksLeft){
			
			console.log('no bricks left')
			game.reset(function(){
				game.togglePause(function(){
					setTimeout(function(){
						game.togglePause();
					},1000)
				});
			});			
		}
	})
	
	
	 
		
//		        var angularSpeed = 1.2; // revolutions per second
//		        var lastTime = 0;
//		 
//		        var renderer2 = new THREE.WebGLRenderer();
//		        renderer2.setSize(gameSize.x, gameSize.y);
//		        document.body.appendChild(renderer2.domElement);
//		 
//		        // camera
//		        var camera2 = new THREE.PerspectiveCamera(50, gameSize.x / gameSize.y, 1, 1000 );
//		        camera2.position.z = 700;
//		 
//		        window.d = camera2;
//		        
//		        // scene
//		        var scene2 = new THREE.Scene();
//		 
//		        
//		        
//		        
//		        
//		        var size = 10;
//		        var height = 10;
//		        var curveSegments =4
//		        var font = "helvetiker";
//		        var weight = "bold";
//		        var style = "normal";
//		        
//		        textGeo = new THREE.TextGeometry( "ready to go", {
//		        	size: size,
//					height: height,
//					curveSegments: curveSegments,
//
//					font: font,
//					weight: weight,
//					style: style,
//
//					material: 0,
//					extrudeMaterial: 1});
//		        textGeo.computeBoundingBox();
//				textGeo.computeVertexNormals();
//				
//				window.c = textGeo
//				
//				
//				material = new THREE.MeshFaceMaterial( [ 
//				                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
//				                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
//				                    				] );
//				
//				textMesh1 = new THREE.Mesh( textGeo, material );
//
//				textMesh1.position.x = 0;
//				textMesh1.position.y = 0;
//				textMesh1.position.z = 0;
//		        
//		        
//				parent = new THREE.Object3D();
//				//parent.position.y = 100;
//
//				scene2.add( parent );
//		        
//				parent.add( textMesh1 );
//		        
//		        window.b = textMesh1;
//		        
//		        
//		        
//		        
//		        
//		        
//		        
//		        
//		        
//		        
//		        
//		        // cube
//		        var colors = [0x0000ff, 0x00ff00, 0x00ffff, 0xff0000, 0xff00ff, 0xffff00];
//		        var materials = [];
//		 
//		        for (var n = 0; n < 6; n++) {
//		            materials.push([new THREE.MeshBasicMaterial({
//		                color: colors[n]
//		            })]);
//		        }
//		 
//		       var  material = new THREE.MeshPhongMaterial( 
//			        	{ color: 214234.23423423
//			        	  ,shininess: 50
//			        	  //,wireframe:true
//			        	} );
//		        
//		       var material = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5 } );
//		       
//		        var cube = new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300, 1, 1, 1, material), material);
//		        cube.overdraw = true;
//		        scene2.add(cube);   
//		 
//		
//		        
//		         
//		        
//		       	 document.getElementById('3dcanvas2').appendChild( renderer2.domElement );
//		      // document.body.appendChild( renderer2.domElement );
//		        
//		        renderer2.render( scene2, camera2 );
//		
//		        var r = 0;
//		        function a(lastTime, angularSpeed){
//		        	
//		        	setTimeout(function(){
//		        		
//		        		//alert('ab')
//		        	
//		        		camera2.lookAt( new THREE.Vector3( 0, 0, 0 ) );
//
//						
//		//        	     	var date = new Date();
//		//        	        var time = date.getTime();
//		//        	        var timeDiff = time - lastTime;
//		//        	        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
//		       	            cube.rotation.y += 0.07;
//		//        	        lastTime = time;
//		        	        // render
//		        	        renderer2.render(scene2, camera2);
//		        	        
//		        	        a(lastTime, angularSpeed);
//		        	},50)
//		        	
//		        }
//		          
//		        var angularSpeed = 0.2; // revolutions per second
//		        var lastTime = 0;
//		        a(lastTime, angularSpeed);
	
})()


