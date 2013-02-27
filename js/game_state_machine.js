function GameStateMachine()
{
	this.SPLASH_STATE = 'splash_state';
	this.STARTING_STATE = 'starting_state';
	this.GAME_LEVEL_STATE = 'game_level_state';
	this.GAME_OVER_STATE = 'game_over_state';

	var gameState = null;
	this.gameSize = {width:800, height:600};

	this.update = function()
	{
		if(gameState != null) gameState.update();	
	}

	this.draw = function()
	{
		if(gameState != null) gameState.draw();
	}

	this.destroy = function()
	{
		if(gameState != null) gameState.destroy();
	}

	this.getState = function()
	{
		var res = "no_state_set";
		if(gameState != null) res = gameState.getState();
		return res;
	}

	this.setState = function(newState)
	{
		if(gameState != null) this.destroy();

		switch (newState){
		
			case this.SPLASH_STATE:
				gameState = new SplashState(this);
				break;
			case this.STARTING_STATE:
				gameState = new StartingState(this);
				break;
			case this.GAME_LEVEL_STATE:
				gameState = new GameLevelState(this);
				break;
			case this.GAME_OVER_STATE:
				gameState = new GameOverState(this);
				break;
			default :
				break;
		}
	}
}

/*

	//GAME STATE IMPLEMENTATION

function SomeGameState(_stateMachine)
{
	var stateMachine = _stateMachine;

	var init = function(){

	}

	this.update = function(){

	}

	this.draw = function(){

	}

	this.destroy = function(){

	}

	this.getState = function(){
		return 'some_game_state';
	}

	init();
}

*/

function SplashState(_stateMachine)
{	
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var splashView = new gameView();
	var i = 0;
	var timerStamp;

	var init = function(){
		splashView.init('brick');
		timerStamp = new Date().getTime();
		addEventHandlers();
	}

	this.update = function(){
		if(new Date().getTime() > timerStamp + 500)
		{
			timerStamp = new Date().getTime();
			i++;
		}
	}

	this.draw = function(){
		if (i % 2){
			splashView.clear();
			splashView.draw({shape:'rectangle',rgb:'rgba(255,255,255,.6)',x:0,y:0,width:gameSize.width,height:gameSize.width});
		}
		else{
			splashView.drawText({text:"Press enter to start",font:"bold 48pt sans-serif",x:100,y:300});
		}
	}

	this.destroy = function(){

	}

	this.getState = function(){
		return 'splash_state';
	}

	var addEventHandlers = function(){
		document.addEventListener('keydown', function(e){
			
			switch (e.keyCode){
			
			case 13:
				splashView.clear();
				stateMachine.setState(stateMachine.STARTING_STATE);
				break;
			}		
		});
	}

	init();
}

function StartingState(_stateMachine)
{	
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var splashView = new gameView();
	var i = 3;
	var timerStamp;

	var init = function(){
		splashView.init('brick');
		timerStamp = new Date().getTime();
	}

	this.update = function(){
		if(new Date().getTime() > timerStamp + 1000)
		{
			timerStamp = new Date().getTime();
			i--;
		}
	}

	this.draw = function(){
		if (i < 0){
			splashView.clear();
			stateMachine.setState(stateMachine.GAME_LEVEL_STATE);
		}else{
			splashView.clear();
			splashView.draw({shape:'rectangle',color:'rgba(255,255,255,0.6)',x:0,y:0,width:gameSize.width,height:gameSize.width});
			splashView.drawText({text:i,font:"bold 98pt sans-serif",x:360,y:300});
		}
	}

	this.destroy = function(){

	}

	this.getState = function(){
		return 'starting_state';
	}

	init();
}

function GameLevelState(_stateMachine)
{
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var p = new pBar();
	var b = new ball();
	var gameLevel = new level();
	var score = new Score();
	var colCheck = new collisionCheck();
	var hasCollision = false;
	var stopgame = false;

	var gView = new gameView();
	var scoreView = new gameView();

	var init = function(){
		registerEvents();

		gView.init('brick');
		scoreView.init('score');

		p.init(gameSize);
		b.init(gameSize);
		gameLevel.init(gameSize, getIntro());
		gView.size(gameSize.width, gameSize.height);

		score.setView(scoreView);
	}

	this.update = function(){
		hasCollision = false;
		
		if(colCheck.hasCollided(b, p)){

			b.hitBrick(colCheck.hitDist(b, p));
			p.hitBall();

			hasCollision = true;
		}

		for(var i=0; i < gameLevel.elements.length; i++)
		{	
			if(!hasCollision)
			{
				if(colCheck.hasCollided(b, gameLevel.elements[i])){

					b.hitBrick(colCheck.hitDist(b, gameLevel.elements[i]));
					gameLevel.elements[i].hitBall();
					
					if(gameLevel.hitBrick(i)){
						event.pub("brickhit");
					}

					hasCollision = true;
				}
			}
		}

		b.update();
		p.update();
		gameLevel.update();
		
		if(gameLevel.elements.length == 0)
		{
			event.pub("gameover");
		}
	}

	this.draw = function(){
		gView.clear();
		b.draw(gView);
		p.draw(gView);
		gameLevel.draw(gView);
	}

	this.destroy = function(){
		deregisterEvents();
	}

	this.getState = function(){
		return 'game_level_state';
	}

	var registerEvents = function(){
		
		event.sub("gameover",function(){
			stateMachine.setState(stateMachine.GAME_OVER_STATE);
		})
		
		event.sub("brickhit",function(){
			score.addPoint();
		})
	}

	var deregisterEvents = function(){
		event.sub("gameover",function(){
			
		})
		
		event.sub("brickhit",function(){
			
		})
	}

	init();
}

function GameOverState(_stateMachine)
{	
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var splashView = new gameView();

	var init = function(){
		splashView.init('brick');

		splashView.clear();
		splashView.draw({shape:'rectangle',color:'rgba(255,255,255,0.6)',x:0,y:0,width:gameSize.width,height:gameSize.width});
		splashView.drawText({text:'game over',font:"bold 98pt sans-serif",x:70,y:300});
	}

	this.update = function(){

	}

	this.draw = function(){
		
	}

	this.destroy = function(){

	}

	this.getState = function(){
		return 'game_over_state';
	}

	init();
}