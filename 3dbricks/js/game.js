var game = (function(){
	
	var maxLifes = 3;
	var level = 1;
	var lifes = maxLifes;
	var score = 0;
	var bonusMultiplier = 1;
	
	var gameSize = {
			x : 1000,
			y : 600
		};
	var game = new BrickGame()
	window.games = game;
	
	event.sub("game.start",function(){
		
		hud.drawGameStatistics(score,level);
	});
		
	event.sub("game.ball.dies",function(ball){
		
		if (game.getBallCount() == 1 && !lifes){
			
			level = 1;
			score = 0;
			hud.drawGameStatistics(score,level);
			game.setLevel(level);
			
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
		else if (game.getBallCount() == 1){
		
			lifes--;
			
			game.resetBall(function(){
				game.togglePause(function(){
					setTimeout(function(){
						game.togglePause();
					},1000)
				});
			});
		}
		else{
			game.addPreRenderCb(function(){
				game.destroyBall(ball);
			});
		}
	});
		
	event.sub("game.brickDestroy",function(e){
		
		var brickScore = 100 * bonusMultiplier;
		score += brickScore;
		hud.drawGameStatistics(score,level);
		bonusMultiplier+=1;
		
		if (e.brick.userData.type == 'extraBalls'){
			game.addPreRenderCb(function(){
				game.createBonusBall(3,3);
				game.createBonusBall(-3,3);
			})
		}
		else if (e.brick.userData.type=="bigBall"){

			e.ball.userData.guiref.scale.x= 1;
			e.ball.userData.guiref.scale.y= 1; 
			e.ball.userData.guiref.scale.z= 1;
			
		}
		
		onBrickHit(e.brick,brickScore)
		
		if (!e.bricksLeft){
			
			level++;
			game.setLevel(level);
			
			game.reset(function(){
				game.togglePause(function(){
					setTimeout(function(){
						hud.drawGameStatistics(score,level);
						game.togglePause();
					},1000)
				});
			});			
		}
	});
	
	event.sub("game.paddleHit",function(){
		
		bonusMultiplier = 1;
	})
	
	
	/**
	 * callback when brick got hit
	 * we add a score indicator to the brick
	 */
	var onBrickHit = function(brick,brickScore){
		
	  	var size = 0.3;
        var height = 0.05;
        var curveSegments =4
        var font = "helvetiker";
        var weight = "bold";
        var style = "normal";
        
        var textGeo = new THREE.TextGeometry( brickScore, {
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
		                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading,transparent: true, opacity: 0.8 } ), // front
		                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading,transparent: true, opacity: 0.8 } ) // side
		                    				] );
		
		textMesh1 = new THREE.Mesh( textGeo, material );

		textMesh1.position.x = brick.GetPosition().x - 0.3;
		textMesh1.position.y = brick.GetPosition().y;
		textMesh1.position.z = 0.5;
		textMesh1.rotation.x = 1.7;
        
        
		parent = new THREE.Object3D();
		parent.castShadow = true;
		parent.receiveShadow = false;
		//parent.position.y = 100;

		if (!gameScene) return;
		gameScene.add( parent );
        
		parent.add( textMesh1 );
		
		//game.destroyBrick(brick);
		
		//make sure that brick is not active anymore (gui objects stays)
		game.addPreRenderCb(function(){
			brick.SetActive(false);
			brick.userData.guiref.castShadow = false;
		});
		
		(function(mesh,parent,brick){
			
			var opacityStep = 0.02
			var scaleStep = 0.02;
			 
			brick.userData.guiref.material.color.setHex(0xffffff);
			
			function animate(){
				
				game.addPreRenderCb(function(){
					
					mesh.material.materials[0].opacity -= opacityStep;
					mesh.material.materials[1].opacity -= opacityStep;
					mesh.scale.x += scaleStep;
					mesh.scale.y += scaleStep; 
					
					brick.userData.guiref.material.opacity -= opacityStep*1.7;
					
					game.addPostRenderCb(function(){
					
						if (mesh.material.materials[0].opacity >0){
							animate();
						}
						else{
							game.destroyBrick(brick);
							gameScene.remove(parent);
						}
						
					});
				})
			}
			
			animate();
					
		})(textMesh1,parent,brick);
	}
	
	

	var hud = new Hud();
	
	game.setLevel(level);
	game.init();
	game.start();
	
	var gameScene = game.getScene();	
	return;
	
	window.gamee = this;
		
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
	//	        scene.add(cube);   
		 
		
		        
		         
		        
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


