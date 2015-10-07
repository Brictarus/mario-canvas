var tileToColor = {
	"": "#BED",
	//"": "#000",
	"grass_top": "#8B8",
	"grass_top_left": "#8B8",
	"grass_left": "#8B8",
	"grass_top_left_corner": "#8B8",
	"grass_top_left_rounded": "#8B8",
	"grass_top_right_rounded": "#8B8",
	"mario": "#F00",
	"planted_soil_left": "#854",
	"planted_soil_middle": "#854",
	"planted_soil_right": "#854",
	"soil": "#854",
	"soil_right": "#854",
	"soil_left": "#854",
	"stone": "#888",
	"bush_left": "#AAA",
	"bush_middle_left": "#AAA",
	"bush_middle": "#AAA",
	"bush_middle_right": "#AAA",
	"bush_right": "#AAA",
	"pipe_top_left": "#151",
	"pipe_left": "#151",
	"pipe_left_grass": "#151",
	"pipe_left_soil": "#151",
	"pipe_top_right": "#151",
	"pipe_right": "#151",
	"pipe_right_grass": "#151",
	"pipe_right_soil": "#151",
	"pipe_top_left": "#151",
	"mushroombox": "#FE2",
	"starbox": "#FE2",
	"multiple_coinbox": "#FE2",
	"coinbox": "#FE2",
	"coin": "#FA0",
	"brown_block": "#851",
	"ballmonster": "#00F",
	"greenturtle": "#00F"
};

function getTileColor(tilename) {
	if (tileToColor[tilename]) {
		return tileToColor[tilename];
	} else {
		return "#FFF";
	}
}

function overlap(rect1, rect2) {
	return !(rect1.x + rect1.w < rect2.x || rect2.x + rect2.w < rect1.x || rect1.y + rect1.h < rect2.y || rect2.y + rect2.h < rect1.y);
}
