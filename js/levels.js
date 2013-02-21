function getIntro(){

	var blocks=[ {x: - 280	,	y: - 17.5, 	width: 15, height: 50, color: "hsla(274, 53%, 37%, 1)"},	//S
				 {x: - 255	, 	y: - 35, 	width: 35, height: 15, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: - 262.5,	y: 0, 		width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: - 245	, 	y: 17.5, 	width: 15, height: 50, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: - 270	, 	y: 35, 		width: 35, height: 15, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: - 210	, 	y: 0, 		width: 15, height: 85, color: "hsla(274, 53%, 37%, 1)"},	//P
				 {x: - 192.5,	y: - 35, 	width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: - 192.5,	y: 0, 		width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: - 175	, 	y: - 17.5, 	width: 15, height: 50, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: - 140	, 	y: 0, 		width: 15, height: 85, color: "hsla(274, 53%, 37%, 1)"},	//I
				 {x: - 105	, 	y: 0, 		width: 15, height: 85, color: "hsla(274, 53%, 37%, 1)"},	//L
				 {x: - 80	, 	y: 35, 		width: 35, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: - 15 	, 	y: 0, 		width: 15, height: 85, color: "hsla(274, 53%, 37%, 1)"},	//B
				 {x: 2.5 	, 	y: - 35, 	width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 2.5 	, 	y: 0, 		width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 10 	, 	y: 35, 		width: 35, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 20 	, 	y: - 17.5, 	width: 15, height: 50, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: 35 	, 	y: 25, 		width: 15, height: 35, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: 70 	, 	y: 0, 		width: 15, height: 85, color: "hsla(274, 53%, 37%, 1)"},	//R
				 {x: 87.5 	, 	y: - 35, 	width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 87.5 	, 	y: 15, 		width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 105 	,	y: - 10, 	width: 15, height: 35, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: 105	,	y: 32.5, 	width: 15, height: 20, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: 140	,	y: 0, 		width: 15, height: 85, color: "hsla(274, 53%, 37%, 1)"},	//I
				 {x: 175 	, 	y: 0, 		width: 15, height: 55, color: "hsla(274, 53%, 37%, 1)"},	//C
				 {x: 200 	, 	y: - 35,	width: 35, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 200 	, 	y: 35, 		width: 35, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 245 	, 	y: 0, 		width: 15, height: 85, color: "hsla(274, 53%, 37%, 1)"},	//K
				 {x: 262.5 	,	y: 15, 		width: 20, height: 15, color: "hsla(322, 64%, 49%, 1)"},	//
				 {x: 280 	, 	y: - 17.5, 	width: 15, height: 50, color: "hsla(274, 53%, 37%, 1)"},	//
				 {x: 280 	, 	y: 32.5, 	width: 15, height: 20, color: "hsla(274, 53%, 37%, 1)"} ];	//
	return blocks;
}

function getLevel(){
	
	var grid	=	{x:6, y: 5};
	var hue 	=	0;
	var blocks	=	[];

	for(var i = 0; i < grid.x; i++)
	{
		for(var t = 0; t < grid.y; t++)
		{
			if(hue < 360){
				hue += 50;
			}else{
				hue = 0;
			}

			var brick = {x		: 	i * 100 - (grid.x * 100)/2 + 50,
						 y		: 	40 + t * 20,
						 width 	: 	100,
						 height	: 	20,
						 color 	: 	"hsla("+ hue +", 50%, 50%, 1)"};

			blocks.push(brick);
		}
	}
	
	return blocks;
}