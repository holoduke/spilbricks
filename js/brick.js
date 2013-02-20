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
					gameLevel.removeBrick(i);

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

	var init = function (){
		p.init(gameSize.width);
		p.y = 500;
		b.init(gameSize);
		gameLevel.init(gameSize, getIntro());
		view.size(gameSize.width, gameSize.height);
		update();
		document.addEventListener('keydown', startGame);
	}

	var gameIsOver = function(){

		gameLevel = null;
		gameLevel = new level();
		gameLevel.init(gameSize, getLevel());
	}
	
	var startGame = function(event) {
	    if(event.keyCode == 87) {
	     	document.removeEventListener('keydown', startGame);

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
	}

	init();
}

brick();