function brick()
{
	var animFrame = window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
    	        window.mozRequestAnimationFrame    ||
        	    window.oRequestAnimationFrame      ||
            	window.msRequestAnimationFrame     ||
            	null ;

    var gameStateMachine = new GameStateMachine();
	
	var update = function(){
		gameStateMachine.update();
		gameStateMachine.draw();
	}

	var init = function (){
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

	init();
}

brick();