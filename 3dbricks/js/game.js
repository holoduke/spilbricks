var game = (function(){
	
	var maxLifes = 3;
	var level = 1;
	var lifes = maxLifes;
	var score = 0;
	
	var gameSize = {
			x : 1000,
			y : 600
		};
	var game = new BrickGame()
	window.games = game;
	
	event.sub("game.start",function(){
		
		hud.drawGameStatistics(score,level);
	});
	
	
	event.sub("game.dies",function(){
		
		if (!lifes){
			game.reset(function(){
				level = 0;
				score = 0;
				hud.drawGameStatistics(score,level);
				
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
		
		score += 100;
		hud.drawGameStatistics(score,level);
		
		if (!e.bricksLeft){
			
			game.reset(function(){
				game.togglePause(function(){
					setTimeout(function(){
						level++;
						hud.drawGameStatistics(score,level);
						game.togglePause();
					},1000)
				});
			});			
		}
	})
	
	var hud = new Hud();
	
	game.init();
	game.start();
	
	
	return;
	
	window.gam = this;
		
		        var angularSpeed = 1.2; // revolutions per second
		        var lastTime = 0;
		 
		        var renderer = new THREE.WebGLRenderer();
		        renderer.setSize(gameSize.x, gameSize.y);
		        document.body.appendChild(renderer.domElement);
		 
		        // camera
		        var camera = new THREE.PerspectiveCamera(50, gameSize.x / gameSize.y, 1, 1000 );
		        camera.position.z = 700;
		 
		        window.d = camera;
		        
		        // scene
		        var scene = new THREE.Scene();
		 
		        
		        
		        var i = 10;
		        var that =this;
		        this.showReadyGo = function(){
		        	
		        	showFlyingText(i);
		        	
		        	setTimeout(function(){
		        		
		        		
		        		
		        		i--;
		        		
		        		that.showReadyGo();
		        	},1000)
		        	
		        	
		        }
		        
		      
		        var textMesh1;
		        
		        var showFlyingText = function(text){
		        	
		        	
		        	if (parent){
		        		console.log("remove")
		        		scene.remove(parent);
		        	}
		        	
		        	var size = 10;
			        var height = 10;
			        var curveSegments =4
			        var font = "helvetiker";
			        var weight = "bold";
			        var style = "normal";
			        
			        textGeo = new THREE.TextGeometry( text, {
			        	size: size,
						height: height,
						curveSegments: curveSegments,

						font: font,
						weight: weight,
						style: style,

						material: 0,
						extrudeMaterial: 1});
			        textGeo.computeBoundingBox();
					textGeo.computeVertexNormals();
						
					material = new THREE.MeshFaceMaterial( [ 
					                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
					                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
					                    				] );
					
					textMesh1 = new THREE.Mesh( textGeo, material );

					textMesh1.position.x = -5;
					textMesh1.position.y = -5;
					textMesh1.position.z = 200;
			        
			        
					parent = new THREE.Object3D();
					//parent.position.y = 100;

					scene.add( parent );
			        
					parent.add( textMesh1 );
			        	       		        	
		        }
		        
		        		        
		        
		        
		    	function animate() {
					//step physics
					
		    		if (textMesh1){
		    			textMesh1.position.z += 15;
		    		}
		    		
					
		    		renderer.render(scene, camera);
							
					requestAnimationFrame(animate);
				}
		        
		        animate();
		        
		        
		        
		        
		        
		        // cube
		        var colors = [0x0000ff, 0x00ff00, 0x00ffff, 0xff0000, 0xff00ff, 0xffff00];
		        var materials = [];
		 
		        for (var n = 0; n < 6; n++) {
		            materials.push([new THREE.MeshBasicMaterial({
		                color: colors[n]
		            })]);
		        }
		 
		       var  material = new THREE.MeshPhongMaterial( 
			        	{ color: 214234.23423423
			        	  ,shininess: 50
			        	  //,wireframe:true
			        	} );
		        
		       var material = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.5 } );
		       
		        var cube = new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300, 1, 1, 1, material), material);
		        cube.overdraw = true;
		        scene.add(cube);   
		 
		
		        
		         
		        
		       	 document.getElementById('3dcanvas2').appendChild( renderer.domElement );
		      // document.body.appendChild( renderer.domElement );
		        
		        renderer.render( scene, camera );
		
		        var r = 0;
		        function a(lastTime, angularSpeed){
		        	
		        	setTimeout(function(){
		        		
		        		//alert('ab')
		        	
		        		camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

						
		//        	     	var date = new Date();
		//        	        var time = date.getTime();
		//        	        var timeDiff = time - lastTime;
		//        	        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
		       	            cube.rotation.y += 0.07;
		//        	        lastTime = time;
		        	        // render
		        	        //renderer.render(scene, camera);
		        	        
		        	        a(lastTime, angularSpeed);
		        	},50)
		        	
		        }
		          
		       // var angularSpeed = 0.2; // revolutions per second
		        //var lastTime = 0;
		        //a(lastTime, angularSpeed); 
	
})()


