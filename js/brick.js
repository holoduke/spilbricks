function brick()
{
	var gameSize = {width:800, height:600};
	
	var p = new pBar();
	var b = new ball();
	var gameLevel = new level();
	var colMng = new collisionManager();
	var view = new gameView();
	var hasCollision = false;
	var animFrame = window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
    	        window.mozRequestAnimationFrame    ||
        	    window.oRequestAnimationFrame      ||
            	window.msRequestAnimationFrame     ||
            	null ;

	var showText = function(t,x,y){
		view.drawText(t,x,y);
		
		setTimeout(function(){
			
			showText(t-1,x,y)
			
		},1000)
	}
	
	var update = function(){
		
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
					gameLevel.hitBrick(i);

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
	}
	
	var GAMESTATE = {};
	GAMESTATE.splash = 0;
	GAMESTATE.starting = 1;
	GAMESTATE.started = 2;
	GAMESTATE.gameover = 3;
	
	var currentGameState = null;

	var init = function (){
		p.init(gameSize.width);
		p.y = 500;
		b.init(gameSize);
		gameLevel.init(gameSize, getIntro());
		view.size(gameSize.width, gameSize.height);
		//update();
		registerEvents();
		
		updateGameState(GAMESTATE.splash);
		
		//document.addEventListener('keydown', startGame);
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
			updateGameState(GAMESTATE.start)
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
	

	var gameIsOver = function(){

		gameLevel = null;
		gameLevel = new level();
		gameLevel.init(gameSize, getLevel());
	}
	
	var startScreenTimer = null;
	var showSplashScreen = function(){
		
		var i = 0;
		function drawStartText(){		
			startScreenTimer = setTimeout(function(){
				if (i % 2){
					view.draw({shape:'rectangle2',rgb:'rgba(255,255,255,100)',x:0,y:0,width:gameSize.width,height:gameSize.width});
				}
				else{
					view.drawText({text:"Press enter to start",font:"bold 48pt sans-serif",x:100,y:300});
				}
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
			
			view.draw({shape:'rectangle2',rgb:'rgba(255,255,255,100)',x:0,y:0,width:gameSize.width,height:gameSize.width});
		
			view.drawText({text:i,font:"bold 98pt sans-serif",x:360,y:300});
			
			i--;
			
			if (i < 0){
				return event.pub("startGame");
			}
			
			startScreenTimer = setTimeout(function(){
				drawStartText();
			},1000)	
		}
		drawStartText();
	}
	
	
	var startGame = function(event) {
		    if ( animFrame !== null ) {
		        var recursiveAnim = function() {
		            update();
		            animFrame( recursiveAnim );
		        };
			    animFrame( recursiveAnim );
		    } else {
		     	//window.setInterval(update, 1000);
		    }  
	    
	}
	
	var gameloop = function(){
		 
	}
	

	init();
}

brick();