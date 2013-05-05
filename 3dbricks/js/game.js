var game = (function(){
	
	var maxLifes = 0;
	var level = 1;
	var lifes = maxLifes;
	var score = 0;
	var bonusMultiplier = 1;
	var game = new BrickGame()
	var hud = new Hud();
	var demo = false;
	
	/**
	 * game state machine
	 * use this to change game states. logic here makes sure old gamestates are getting cleaned up.
	 */
	var states = {"demo":1,"playing":2,"gameover":3};
	var gameState = {
		
		currentState : null,	
			
		startDemo : function(){
			startDemoGame();
			gameState.currentState = states.demo;
		},
		
		stopDemo : function(){
			
		},
		
		startGameover : function(){
			gameState.clearPreviousState(function(){
				gameState.startDemo();
				gameState.currentState = states.gameover;
			})			
		},
		
		startGame : function(){
			
			gameState.clearPreviousState(function(){
				startPlayerGame();
				gameState.currentState = states.playing;
			})
		},
		
		stopGame : function(){
			
		},
		
		clearPreviousState : function(cb){
			
			console.log('clear prev',gameState.currentState)
			if (gameState.currentState == states.demo){
				stopDemoGame(cb)
			}
			else if (gameState.currentState == states.playing){
				stopPlayerGame(cb)
			}	
			else if (gameState.currentState == states.gameover){
				stopDemoGame(cb)
			}
			else{
				cb();
			}
		}		
	}
	
	
	/*
	 * ##################################
	 * BASIC ROUTINES TO START/STOP VARIOUS GAME STATES
	 * ##################################
	 */
	function startPlayerGame(){
				
		level = 1;
		lifes = maxLifes;
		score = 0;
		registerPlayerGameEvents();
		game.setLevel(level);
	
		fade(0,1,function(){
			game.start();
			game.reset(function(){
				game.setCameraLookAtMesh(game.getPaddle().mesh);
				game.cameraFollowsPaddle(true);
				
				game.togglePause(function(){
		
					//let the camera start from this position
					game.getCamera().setLens(25)
					game.getCamera().position.x = 0;
					game.getCamera().position.y = -7;
					game.getCamera().position.z = 2;			
					
					animateBricksFadeIn(function(){
		
						hud.drawGameStatistics(score,level,lifes);
						game.togglePause();			
					});
				
					fade(1,-1,function(){});
					game.tweenCamera(Tween.easeInOutQuad,{yTarget:-7,zTarget:6, xTarget:0});
										
				});
			});
		});
	};
	
	function stopPlayerGame(cb){
		game.resetTweenCamera(); 
		unRegisterGameEvents();
		game.cleanup(cb);	
		hud.clear();
	}
	
	function startDemoGame(){
		
		document.getElementById("splashContainer").style.display = 'block';
		document.getElementById("startTitle").style.opacity = 0;
		
		demo = true;
		level = 1;
		lifes = maxLifes;
		score = 0;
		registerDemoGameEvents();
		game.setLevel(level);
		
		game.start();
		//game.getCamera().setLens(12)
		game.setCameraLookAtMesh({'position':{'x':0,'y':-2,'z':0}});

		game.tweenCameraLens(Tween.easeInOutQuad,{
			start: 10,
			target: 25,
			speed: 200
		});
		
		game.tweenCamera(Tween.easeOutQuad, {
			yStart : -7,
			yTarget : -6,
			zStart : 4,
			zTarget : 2,
			xTarget : 4,
			speed : 200
		}, function() {
				
			game.tweenCameraLens(Tween.easeInOutQuad,{
				start: 25,
				target: 19,
				speed: 300
			})
	
			function aniloop(){
				game.tweenCamera(Tween.easeInOutQuad,{yTarget:5,zTarget:3, xTarget:5,speed:1500});
				game.tweenCamera(Tween.easeInOutQuad,{yTarget:5,zTarget:3, xTarget:-6,speed:1500});
				game.tweenCamera(Tween.easeInOutQuad,{yTarget:-5,zTarget:3, xTarget:-5,speed:1500});
				game.tweenCamera(Tween.easeInOutQuad,{yTarget:5,zTarget:3, xTarget:-5,speed:1500,},function(){
					
					aniloop();
				});
			}
		
		aniloop();
		});
		
		fade(1,-1,function(){})
		game.cameraFollowsPaddle(false);
		game.reset(function(){
			game.togglePause(function(){
				animateBricksFadeIn(function(){
					game.togglePause();
					activatePaddleAi();	
					
					//let the start title blink
					var el = document.getElementById("startTitle");
					
					var start = 1;
					var change = -1
					var dur = 20;
					var t = 0;
					
					//start animation of press key to continue title
					function blinkAnimate(){
						
						if (!demo) return;
						
						el.style.opacity = Tween.easeInOutQuad(t,start,change,dur);
						t++;
						
						t = t % (dur*2);
						
						setTimeout(function(){
							blinkAnimate();
						},20)
					}
					
					blinkAnimate();
					
					var listener = function(e){
						if (e.keyCode == 13){
							//startPlayerGame();
							gameState.startGame();						
							document.removeEventListener('keyup', listener, false);
						}
					}
					
					document.addEventListener('keyup', listener);	
					
				});
			});		
		});
	};
	
	function stopDemoGame(cb){
		
		if (!demo) return cb();
		
		document.getElementById("splashContainer").style.display = 'none';
		demo = false;
		paddleAiActive = false;
		demo = false;
		game.resetTweenCamera(); 
		unRegisterGameEvents();
		game.getPaddle().body.SetPosition(new Box2D.Common.Math.b2Vec2(0,-4))
		game.cleanup(cb);
		
	}
	
	
	/*
	 * ##################################
	 * GAME EVENTS
	 * ##################################
	 */
	//these events are registered when player starts a game
	function registerPlayerGameEvents(){
		
		ev.sub("game.start",function(){
			
			hud.drawGameStatistics(score,level,lifes);
		});
		
		ev.sub("game.ball.created",function(ball){
		
			if (game.getBallCount() == 2){
				gamee.tweenCamera(Tween.easeInOutQuad,{yTarget:-7,zTarget:8});
			}
		});

		ev.sub("game.ball.dies",function(ball){
			
			if (game.getBallCount() == 1 && !lifes){
				
				return gameState.startGameover();
				
				level = 1;
				score = 0;
				bonusMultiplier = 1;
				hud.drawGameStatistics(score,level,lifes);
				game.setLevel(level);
				
				game.reset(function(){
					game.setCameraLookAtMesh(game.getPaddle().mesh);
					game.cameraFollowsPaddle(true);			
					animateBricksFadeIn(function(){
						game.togglePause();
					});
				},true);
				lifes = maxLifes
				
				return;
			}
			else if (game.getBallCount() == 1){
			
				lifes--;
				bonusMultiplier =1
				hud.drawGameStatistics(score,level,lifes);
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
					
					if (game.getBallCount() == 1){
						gamee.tweenCamera(Tween.easeInOutQuad,{yTarget:-7,zTarget:6});					
					}
				});
			}
		});
		
		//when ball hit brick
		ev.sub("game.brickHit",function(e){
			
			var bscore = 100 * bonusMultiplier;
			score += bscore;
			hud.drawGameStatistics(score,level,lifes);
			bonusMultiplier+=1;
			
			if (e.brick.userData.type.type == 'extraBalls'){
				game.addPreRenderCb(function(){
					game.createBonusBall(3,3);
					game.createBonusBall(-3,3);
				})
			}
			else if (e.brick.userData.type.type=="bigBall"){
	
				e.ball.userData.guiref.scale.x= 1;
				e.ball.userData.guiref.scale.y= 1; 
				e.ball.userData.guiref.scale.z= 1;		
			}
			else if (e.brick.userData.type.type=="superspeed"){
	
				var lv = e.ball.GetLinearVelocity();
				
				var xv = lv.x * 2
				var yv = lv.y * 2
				
				if (xv < 0){
					xv= Math.max(xv,-15)
				}else{
					xv=Math.min(xv,15)
				}
				if (yv < 0){
					yv=Math.max(yv,-15)
				}else{
					yv=Math.min(yv,15)
				}
			
				e.ball.SetLinearVelocity(new b2Vec2(xv,yv))	
			}
			else if (e.brick.userData.type.type == 'ghost'){
				
			}
			
			//show some fancy things when the ball hits the brick. if there is no hitcount left, we remove the brick	
			if (!brick.userData.hitCount){
				onBrickHit({
					'brick' : e.brick,
					'score' : bscore,
					'enableBrickFadeOut' : true,
				}, function(brick) {
					game.destroyBrick(brick);
				})
			}
			else{
				onBrickHit({
					'brick' : e.brick,
					'score' : bscore,
					'enableBrickFadeOut' : false,
				}, function(brick) {
					
				})			
			}
			
			//if no bricks are left we reset the game and starts the next level		
			if (!e.bricksLeft){
				
				level++;
				game.setLevel(level);
				
				game.togglePause(function(){
					
					game.setCameraLookAtMesh(null);
					game.cameraFollowsPaddle(false);
					
					zoomToBrick(e.brick,function(){
						
						game.togglePause(function(){				
							game.reset(function(){
						
								game.setCameraLookAtMesh(game.getPaddle().mesh);
								game.cameraFollowsPaddle(true);
								
								game.tweenCamera(Tween.easeInOutQuad,{yTarget:-7,zTarget:6});
								//game.togglePause(function(){
									animateBricksFadeIn(function(){						
										hud.drawGameStatistics(score,level,lifes);
										game.togglePause();
									});
								//});
							},true);	
						});
					});
				});
			}
		});
			
		//event is fired just before a brick ball collition is occuring
		ev.sub("game.brickPreHit",function(e){
	
			//create ghost ball for 3 seconds
			if (e.brick.userData.type.type == 'ghost'){
				
				e.contact.SetEnabled(false);
				e.ball.userData.isGhost = true;
				e.ball.userData.guiref.material.opacity = 0.5;
				
				
				(function(contact){
					setTimeout(function(){
						e.ball.userData.guiref.material.opacity = 1;
						e.contact.SetEnabled(true);
						e.ball.userData.isGhost = false;
					},5000)
				})(e.contact)
			}
			
			if (e.ball.userData.isGhost){
				e.contact.SetEnabled(false);
			}
		});
		
		//when ball hits paddle we reset the bonus multiplyer
		ev.sub("game.paddleHit",function(){
			
			bonusMultiplier = 1;
		});	
	}
	
	
	//these events are registered when demo splash screen is shown.
	//its a bit identical to the events when player plays the game with the exception that
	//there are no camera changes here. code is a bit duplicated
	function registerDemoGameEvents(){
		
		ev.sub("game.ball.dies",function(ball){
			
			if (game.getBallCount() == 1 && !lifes){
				
				level = 1;
				score = 0;
				bonusMultiplier = 1;
				game.setLevel(level);
				
				game.reset(function(){
								
					animateBricksFadeIn(function(){
						game.togglePause();
					});
				},true);
				lifes = maxLifes
			}
			else if (game.getBallCount() == 1){
			
				lifes--;
				bonusMultiplier =1
				game.resetBall();
			}
			else{
				game.addPreRenderCb(function(){
					game.destroyBall(ball);
				});
			}
		});
		
		//when ball hit brick
		ev.sub("game.brickHit",function(e){
			
			var bscore = 100 * bonusMultiplier;
			score += bscore;
			bonusMultiplier+=1;
			
			if (e.brick.userData.type.type == 'extraBalls'){
				game.addPreRenderCb(function(){
					game.createBonusBall(3,3);
					game.createBonusBall(-3,3);
				})
			}
			else if (e.brick.userData.type.type=="bigBall"){
	
				e.ball.userData.guiref.scale.x= 1;
				e.ball.userData.guiref.scale.y= 1; 
				e.ball.userData.guiref.scale.z= 1;		
			}
			else if (e.brick.userData.type.type=="superspeed"){
	
				var lv = e.ball.GetLinearVelocity();
				
				var xv = lv.x * 2
				var yv = lv.y * 2
				
				if (xv < 0){
					xv= Math.max(xv,-15)
				}else{
					xv=Math.min(xv,15)
				}
				if (yv < 0){
					yv=Math.max(yv,-15)
				}else{
					yv=Math.min(yv,15)
				}
			
				e.ball.SetLinearVelocity(new b2Vec2(xv,yv))	
			}
			else if (e.brick.userData.type.type == 'ghost'){
				
			}
			
			//show some fancy things when the ball hits the brick. if there is no hitcount left, we remove the brick	
			if (!brick.userData.hitCount){
				onBrickHit({
					'brick' : e.brick,
					'score' : bscore,
					'enableBrickFadeOut' : true,
				}, function(brick) {
					game.destroyBrick(brick);
				})
			}
			else{
				onBrickHit({
					'brick' : e.brick,
					'score' : bscore,
					'enableBrickFadeOut' : false,
				}, function(brick) {
					
				})			
			}
			
			//if no bricks are left we reset the game and starts the next level		
			if (!e.bricksLeft){
				
				level++;
				game.setLevel(level);
					
				game.togglePause(function(){				
					game.reset(function(){
						//game.togglePause(function(){
							animateBricksFadeIn(function(){						
								game.togglePause();
							});
						//});
					},true);	
				});				
			}
		});
			
		//event is fired just before a brick ball collition is occuring
		ev.sub("game.brickPreHit",function(e){
	
			//create ghost ball for 3 seconds
			if (e.brick.userData.type.type == 'ghost'){
				
				e.contact.SetEnabled(false);
				e.ball.userData.isGhost = true;
				e.ball.userData.guiref.material.opacity = 0.5;
				
				
				(function(contact){
					setTimeout(function(){
						e.ball.userData.guiref.material.opacity = 1;
						e.contact.SetEnabled(true);
						e.ball.userData.isGhost = false;
					},5000)
				})(e.contact)
			}
			
			if (e.ball.userData.isGhost){
				e.contact.SetEnabled(false);
			}
		});
		
		//when ball hits paddle we reset the bonus multiplyer
		ev.sub("game.paddleHit",function(){
			
			bonusMultiplier = 1;
		});	
	}
	
	function unRegisterGameEvents(){
		ev.unsub("game.paddleHit");
		ev.unsub("game.brickPreHit");
		ev.unsub("game.brickHit");
		ev.unsub("game.ball.dies");
		ev.unsub("game.ball.created");
		ev.unsub("game.start");
	}
	
	function initGame(){
		game.setLevel(level);
		game.init();	
	}
	
	
	var fade = function(start,change,cb){
		
		var el = document.getElementById("white");
		
		var dur = 20;
		var t = 0;
		
		//start animation of press key to continue title
		function animate(){
			
			if (t == dur){
				if(cb) cb();
				return;
			};
			
			el.style.opacity = Tween.easeInOutQuad(t,start,change,dur);
			t++;
			
			t = t % (dur*2);
			
			setTimeout(function(){
				animate();
			},20)
		}
		
		animate();	
	}
	

	

	
	//create the hud to show level info, life info and scores
	initGame();
	gameState.startDemo();
	//startPlayerGame();
	

	//start the game and immidiately pause the game.
	//we then move the camera towards the back of the table and unpause the game


//	return;
	
	
	
	
	


	
	
	
	/**
	 * shows score above brick. bricks slowly fades away and will be removed from scene
	 */
	var onBrickHit = function(options,cb){
		
		var brick = options.brick;
		var score = options.score;
	  	var size = 0.3;
        var height = 0.05;
        var curveSegments =4
        var font = "helvetiker";
        var weight = "bold";
        var style = "normal";
        
        var d = 30; //duration
        
        var textGeo = new THREE.TextGeometry( score, {
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
	
		var textMaterial = new THREE.MeshFaceMaterial( [ 
		    	                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading,transparent: true, opacity: 0.8 } ), // front
		    	                    					new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading,transparent: true, opacity: 0.8 } ) // side
		    	                    				] );
		
		textMesh1 = new THREE.Mesh( textGeo, textMaterial );

		textMesh1.position.x = brick.GetPosition().x - 0.3;
		textMesh1.position.y = brick.GetPosition().y;
		textMesh1.position.z = 0.5;
		textMesh1.rotation.x = 1.7;
        
        
		parent = new THREE.Object3D();
		parent.castShadow = true;
		parent.receiveShadow = false;
		//parent.position.y = 100;

		if (!game.getScene()) return;
		game.getScene().add( parent );
        
		parent.add( textMesh1 );
		
		//make sure that brick is not active anymore (gui objects stays)
		if (!brick.userData.hitCount){
			game.addPreRenderCb(function(){
				brick.SetActive(false);
				brick.userData.guiref.castShadow = false;
				brick.userData.guiref.material.color.setHex("0xffffff");
			});
		}
		else{
			//TODO this is not the right place to change brick type
			brick.userData.type = levels.getLevel(level).types[brick.userData.type.onHitTransformTo];
			brick.userData.guiref.material.color.set(brick.userData.type.color);
		}
		
		(function(mesh,parent,brick){
			
			var opacityStep = 0.02
			var scaleStep = 0.02;
			
			var opacity = null;
			var tick = 0;
			 			
			function animate(){
				
				game.addPreRenderCb(function(){
					
					var opacity = Tween.easeInQuad(tick,1,-1,d);
					
					mesh.material.materials[0].opacity = opacity;
					mesh.material.materials[1].opacity = opacity;
					mesh.scale.x += scaleStep;
					mesh.scale.y += scaleStep; 
					
					if (options.enableBrickFadeOut){
						brick.userData.guiref.material.opacity = opacity;
					}
					
					game.addPostRenderCb(function(){
					
						if (tick == d){
							game.getScene().remove(parent);
							cb(brick);
						}
						else{
							animate();
						}
												
					tick++
						
					});
				})
			}
			
			animate();
					
		})(textMesh1,parent,brick);
	}
	
	//animation to fade in bricks like falling blocks
	var animateBricksFadeIn = function(cb){
		
		var bricks = game.getBricks();
		var startHeight = 4;
		var step = 0.3;
		var diffStep = 1;

		for (var i=0,len=bricks.length;i<len;i++){
			
			bricks[i].userData.guiref.position.z = 4+diffStep;
			bricks[i].userData.guiref.material.opacity = 0;
			diffStep+=0.7
		}
		
		function animate(){
			
			game.addPreRenderCb(function(){
				
				var allReady = true;
				
				for (var i=0,len=bricks.length;i<len;i++){
			
					bricks[i].userData.guiref.material.opacity = 1;
					bricks[i].userData.guiref.position.z -= step;					
					if (bricks[i].userData.guiref.position.z < 0){
						bricks[i].userData.guiref.position.z = 0;
					}
					else{
						allReady = false;
					}
				}
				
				game.addPostRenderCb(function(){
				
					if (allReady){
						cb()
					}
					else{
						animate();
					}			
				});
			})
		}
		
		animate();		
		
	}
	
	var zoomToBrick = function(brick, cb) {

		var paddleX = game.getPaddle().mesh.position.x;
		var paddleZ = game.getPaddle().mesh.position.z;
		var paddleY = game.getPaddle().mesh.position.y;
	
		var brickX = brick.GetPosition().x;
		var brickZ = brick.GetPosition().z;
		var brickY = brick.GetPosition().y;
		
		var cameraX = game.getCamera().position.x;
		var cameraY = game.getCamera().position.y;
		var cameraZ = game.getCamera().position.z;
		
		// zoom the camera to the brick
		game.tweenCamera(Tween.easeInOutQuad, {
			yStart : cameraY,
			yTarget : brickY - 1,
			zStart : cameraZ,
			zTarget : 2,
			xStart : paddleX / 2,
			xTarget : brickX,
			speed : 20
		});
	
		game.tweenLookAtCamera(Tween.easeInOutQuad, {
			yStart : paddleY + 2,
			yTarget : brickY,
			zStart : paddleZ,
			zTarget : paddleZ,
			xStart : paddleX,
			xTarget : brickX,
			speed : 20
		}, function() {
	
			game.tweenCamera(Tween.linear, {
				yStart : brickY - 1,
				yTarget : brickY - 1,
				zStart : 2,
				zTarget : 2,
				xStart : brickX,
				xTarget : brickX,
				speed : 60
			}, function() {
	
				game.tweenCamera(Tween.easeInOutQuad, {
					yStart : brickY - 1,
					yTarget : cameraY,
					zStart : 2,
					zTarget : cameraZ,
					xStart : brickX,
					xTarget : paddleX / 2,
					speed : 20
				});
				game.tweenLookAtCamera(Tween.easeInOutQuad, {
					yStart : brickY,
					yTarget : paddleY + 2,
					zStart : paddleZ,
					zTarget : paddleZ,
					xStart : brickX,
					xTarget : paddleX,
					speed : 20
				}, function() {
					if (cb)
						cb();
				})
			});
	
		});
	}
	
	var paddleAiActive = true;
	function activatePaddleAi(){
		
		paddleAiActive = true;
		
		function ai(){
			
			if (!paddleAiActive) return;
			
			var keepMoving = false;
			var left = 0;
			var right = 0;
			
			if (game.getBalls().length)
			{
				var balls = game.getBalls();
				
				var ball;
				for (var i=0; i<balls.length; i++){
					
					if (!ball){
						ball = balls[i];
					}
					
					if (ball.body.GetPosition().y > balls[i].body.GetPosition().y){
						ball = balls[i];
					}
				}
				
				var diff = ball.body.GetPosition().x - game.getPaddle().body.GetPosition().x
				
			
				var imp = 3/diff * 6;
				//console.log(diff)
				
				
				if (diff > 0.4) {
					left++;
					right = 0;
					game.getPaddle().body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(6.2,0),game.getPaddle().body.GetWorldCenter())
				}
				else if (diff < -0.4){
					right++;
					left = 0;
					game.getPaddle().body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(-6.2,0),game.getPaddle().body.GetWorldCenter())
				}
			}
						
			setTimeout(function(){
			
				if (!paddleAiActive) return;
				ai();
				
			},20)
			
		}
		
		ai();
	}

	
	
	 
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	window.gamee = game;
	return;
	
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


