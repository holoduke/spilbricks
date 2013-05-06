
//var level1 = 
//{
//		type:"brick",
//		gameSize : {x:5,y:5},
//		brickSize : {x:.49,y:.25,z:.25},
//		brickSpace : {x:.1,y:.1},
//		layout: 
//		[
//		[ 0, 0, 0, 0 ,0, 0, 0 ],
//		  [ 0, 0, 1, 1 ,0, 0 ],
//		[ 0, 0, 1, 1 ,1, 0, 0 ],
//		  [ 0, 1, 1, 1 ,1, 0 ],
//		[ 0, 1, 1, 1 ,1, 1, 0 ],
//		  [ 1, 1, 1, 1 ,1, 1,],
//		[ 1, 1, 1, 1 ,1, 1, 1 ]
//		]
//}


levels = (function(){

	var levels = [];
	levels.push(null);
	levels.push( ///level 1
	{
			type:"align",
			gameSize : {x:5,y:5},
			firstBrickPosition : {x:-3,y:2.4},
			brickSize : {x:.49,y:.25,z:.25},
			brickSpace : {x:1, y:0.52},
			types : {1:{'color':11808294.026639538,'type':'normal'}, 
					 2:{'color':6356160.3086433,'type':'extraBalls'},
					 5:{'color':15346160.1086433,'type':'superspeed'},
					 4:{'color':4274646.795992431,'type':'normal','hitCount':2,"onHitTransformTo":1},
					 6:{'color':19346160.1086433,'type':'ghost'},
			
			},
			layout: 
			[
			[ 1, 1, 2, 2 ,2, 1, 1 ],
			[ 1, 1, 1, 1 ,1, 1, 1 ],
			[ 1, 4, 1, 4 ,1, 4, 1 ],
			[ 1, 1, 1, 1 ,1, 1, 1 ],
			[ 0, 1, 1, 5 ,1, 1, 0 ],
			[ 0, 0, 1, 1 ,1, 0, 0 ], 
			[ 0, 0, 0, 0 ,0, 0, 0 ],
			] 
	});
	
	levels.push( ///level 2
	{
			type:"align",
			gameSize : {x:5,y:5},
			firstBrickPosition : {x:-3,y:2.4},
			brickSize : {x:.49,y:.25,z:.25},
			brickSpace : {x:1, y:0.52},
			types : {1:{'color':11808294.026639538,'type':'normal'}, 
					2:{'color':6356160.3086433,'type':'extraBalls'},
					6:{'color':19346160.1086433,'type':'ghost'},
					},
			layout: 
			[
			[ 1, 1, 0, 6 ,0, 1, 1 ],
			[ 1, 1, 1, 6 ,1, 1, 1 ],
			[ 1, 1, 0, 6 ,0, 1, 1 ],
			[ 1, 1, 1, 1 ,1, 1, 1 ],
			[ 1, 1, 1, 1 ,1, 1, 1 ],
			[ 1, 1, 0, 0 ,0, 1, 1 ], 
			[ 0, 0, 0, 0 ,0, 0, 0 ],
			]
	});
	
	levels.push( ///level 3
			{
					type:"align",
					gameSize : {x:5,y:5},
					firstBrickPosition : {x:-3,y:2.4},
					brickSize : {x:.49,y:.25,z:.25},
					brickSpace : {x:1, y:0.52},
					types : {1:{'color':11808294.026639538,'type':'normal'}, 
						     2:{'color':6356160.3086433,'type':'extraBalls'},
							 3:{'color':8485631.716873156,'type':'normal','hitCount':3,"onHitTransformTo":4},
							 4:{'color':4274646.795992431,'type':'normal','hitCount':2,"onHitTransformTo":1},
							 5:{'color':11808294.026639538,'type':'normal'}
					},
					
					layout: 
					[
					[ 1, 0, 0, 1 ,0, 0, 1 ],
					[ 1, 0, 0, 1 ,0, 0, 1 ],
					[ 1, 0, 0, 1 ,0, 0, 1 ],
					[ 2, 2, 2, 2 ,2, 2, 2 ],
					[ 3, 3, 3, 3 ,3, 3, 3 ],
					[ 4, 4, 4, 4 ,4, 4, 4 ], 
					[ 5, 5, 5, 5 ,5, 5, 5 ],
					]
			});
	
	levels.push( ///level 3
			{
					type:"align",
					gameSize : {x:5,y:5},
					firstBrickPosition : {x:-3,y:2.4},
					brickSize : {x:.49,y:.25,z:.25},
					brickSpace : {x:1, y:0.52},
					types : {1:{'color':11808294.026639538,'type':'normal'}, 
						     2:{'color':6356160.3086433,'type':'extraBalls'},
							 3:{'color':8157503.589997533,'type':'normal'},
							 4:{'color':1274646.795992431,'type':'normal'},
							 5:{'color':61838294.026639538,'type':'normal'}
					},
					
					layout: 
					[
					[ 1, 0, 1, 0 ,1, 0, 1 ],
					[ 1, 0, 1, 0 ,1, 0, 1 ],
					[ 1, 0, 1, 0 ,1, 0, 1 ],
					[ 2, 0, 2, 0 ,2, 0, 2 ],
					[ 3, 0, 3, 0 ,3, 0, 3 ],
					[ 4, 0, 4, 0 ,4, 0, 4 ], 
					[ 5, 0, 5, 0 ,5, 0, 5 ],
					]
			});	
	
//	levels.push( ///level 3
//			{
//					type:"align",
//					gameSize : {x:5,y:5},
//					firstBrickPosition : {x:-3,y:2.4},
//					brickSize : {x:.24,y:.12,z:.12},
//					brickSpace : {x:0.5, y:0.27},
//					types : {1:{'color':11808294.026639538,'type':'normal'}, 2:{'color':6356160.3086433,'type':'extraBalls'}},
//					layout: 
//					[
//					[ 1, 1, 1, 1 ,1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
//					[ 1, 1, 1, 1 ,1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
//					[ 0, 0, 1, 1 ,1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
//					[ 0, 0, 0, 1 ,1, 1, 2, 2, 1, 0, 1, 0, 0, 0 ],
//					[ 0, 0, 0, 0 ,1, 1, 2, 2, 1, 1, 0, 0, 0, 0 ],
//					[ 0, 0, 0, 0 ,0, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
//					[ 0, 0, 0, 0 ,0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ],
//					[ 0, 0, 0, 0 ,0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ],
//					[ 0, 0, 0, 0 ,0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ],
//					[ 0, 0, 0, 0 ,0, 1, 1, 1, 1, 0, 0, 0, 0, 0 ],
//					[ 0, 0, 0, 0 ,1, 1, 2, 2, 1, 1, 0, 0, 0, 0 ],
//					[ 0, 0, 0, 1 ,1, 1, 2, 2, 1, 1, 1, 0, 0, 0 ],
//					[ 0, 0, 1, 1 ,1, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
//					[ 0, 1, 1, 1 ,1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
//					]
//			});
	
	
	
	return {
		getLevel : function(level){
			return levels[level];
		}
	}
		
})()


