



var level1 = 
{
		type:"brick",
		gameSize : {x:5,y:5},
		brickSize : {x:.49,y:.25,z:.25},
		brickSpace : {x:.1,y:.1},
		layout: 
		[
		[ 0, 0, 0, 0 ,0, 0, 0 ],
		  [ 0, 0, 1, 1 ,0, 0 ],
		[ 0, 0, 1, 1 ,1, 0, 0 ],
		  [ 0, 1, 1, 1 ,1, 0 ],
		[ 0, 1, 1, 1 ,1, 1, 0 ],
		  [ 1, 1, 1, 1 ,1, 1,],
		[ 1, 1, 1, 1 ,1, 1, 1 ]
		]
}

var level2 = 
{
		type:"align",
		gameSize : {x:5,y:5},
		brickSize : {x:.49,y:.25,z:.25},
		brickSpace : {x:.1, y:.1},
		layout: 
		[
		[ 2, 2, 2, 2 ,2, 2, 2 ],
		[ 1, 1, 1, 1 ,1, 1, 1 ],
		[ 1, 1, 1, 1 ,1, 1, 1 ],
		[ 0, 0, 0, 0 ,0, 0, 0 ],
		[ 2, 2, 2, 2 ,2, 2, 2 ],
		[ 1, 1, 1, 1 ,1, 1, 1 ], 
		[ 1, 1, 1, 1 ,1, 1, 1 ],
		]
}