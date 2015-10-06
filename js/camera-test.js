function initCanvas($container) {	
	var $canvas = $('<canvas>Votre navigateur ne supporte pas les technologies récentes. Merci de le mettre à jour.</canvas>').appendTo($container);
	$canvas.attr('width', $container.width());
	$canvas.attr('height', $container.height());
	return $canvas;
};

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

function loadLevel(level, tileW, tileH) {
	var blocks = [];
	var i = 0, j = 0;
	var tileWidth = tileHeight = 32;
	var tileWidthDebug = tileHeightDebug = 4;
	for (i = 0; i < level.width; i++) {
		for (j = 0; j < level.height; j++) {
			var k = level.data[i][j];
			var color = getTileColor(k);
			blocks.push({
				x: i * tileW,
				y: j * tileH,
				w: tileW,
				h: tileH,
				color: color
			})
		}
	}
	return blocks;
}

function clear() {
	ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
	ctxDbg1.clearRect(0, 0, $canvasDebugLayer1.width(), $canvasDebugLayer1.height());
}

function renderBlocks(blocks, camera) {
	ctx.save();
	ctx.translate(-camera.x, -camera.y);
	for (var i = 0; i < blocks.length; i++) {
		var b = blocks[i];
		ctx.fillStyle = b.color;
		ctx.fillRect(~~(b.x * camera.zoom), ~~(b.y * camera.zoom), ~~(b.w * camera.zoom), ~~(b.h * camera.zoom));
	}
	ctx.restore();
}

function renderBlocksDebug(blocks) {
	for (var i = 0; i < blocks.length; i++) {
		var b = blocks[i];
		ctxDbg0.fillStyle = b.color;
		ctxDbg0.fillRect(b.x * zoomDebug, b.y * zoomDebug, b.w * zoomDebug, b.h * zoomDebug);
	}
}

function renderCameraBBox(c) {
	ctxDbg1.save();
	ctxDbg1.fillStyle = "rgba(200, 200, 200, 0.5)";
	ctxDbg1.fillRect(c.x * zoomDebug / c.zoom, c.y * zoomDebug / c.zoom, c.viewport_w * zoomDebug / c.zoom, c.viewport_h * zoomDebug / c.zoom);
	ctxDbg1.strokeStyle = "#333";
	ctxDbg1.strokeRect(c.x * zoomDebug / c.zoom, c.y * zoomDebug / c.zoom, c.viewport_w * zoomDebug / c.zoom, c.viewport_h * zoomDebug / c.zoom);
	$('p.camera-x span').html(c.x);
	$('p.camera-y span').html(c.y);
	$('p.camera-w-x span').html(c.world_x);
	$('p.camera-w-y span').html(c.world_y);
	$('p.camera-zoom span').html(c.zoom);
	ctxDbg1.restore();
}

function render() {
	clear();
	renderBlocks(blocks, camera);
	renderCameraBBox(camera);
}

var level = definedLevels[0];
var $canvas = initCanvas($("#world"));
var ctx = $canvas[0].getContext("2d");
var $canvasDebugLayer0 = initCanvas($("#mapDebug"));
var $canvasDebugLayer1 = initCanvas($("#mapDebug"));
var ctxDbg0 = $canvasDebugLayer0[0].getContext("2d");
var ctxDbg1 = $canvasDebugLayer1[0].getContext("2d");

var i = 0, j = 0;
var tileWidth = tileHeight = 32;
var max_x = tileWidth * level.width;
var max_y = tileHeight * level.height;
var zoom = 1;
var zoomDebug = 1/8;

var camera = new Camera(0, 0, $canvas.width(), $canvas.height(), zoom, max_x, max_y);
var blocks = loadLevel(level, tileWidth, tileHeight);
renderBlocksDebug(blocks);
render();


var BOTTOM_KEY = 40,
	UP_KEY = 38,
	LEFT_KEY = 37,
	RIGHT_KEY = 39,
	PLUS_KEY = 107,
	MINUS_KEY = 109,
	HOME_KEY = 36,
	END_KEY = 35;
	
$(document).on('keydown', function(event) {
	var offset = 10;
	var handled = true;
	switch (event.keyCode) {
		case BOTTOM_KEY:
			camera.moveY(offset).clamp(); break;
		case UP_KEY:
			camera.moveY(-offset).clamp(); break;
		case LEFT_KEY:
			camera.moveX(-offset).clamp(); break;
		case RIGHT_KEY:
			camera.moveX(offset).clamp(); break;
		case PLUS_KEY:
			camera.setZoom(camera.zoom * 2); 
			camera.clamp();
			break;
		case MINUS_KEY:
			camera.setZoom(camera.zoom / 2);
			camera.clamp();
			break;
		case HOME_KEY:
			camera.moveXTo(0); 
			camera.moveXTo(0); 
			camera.clamp();
			break;
		case END_KEY:
			camera.moveXTo(camera.max_x - camera.world_w); 
			camera.moveYTo(0); 
			camera.clamp();
			break;
		default:
			handled = false;
			console.log(event.keyCode);
			break;
	} 
	if (handled) {
		render();
		event.preventDefault();
		return false;
	}
});

$canvasDebugLayer1.on("click", function(e) {
	var offset = $(this).offset(); 
   var relX = e.pageX - offset.left;
   var relY = e.pageY - offset.top;
	 $(".mouse-pos span").text("x: " + relX / zoomDebug + ", y: " + relY / zoomDebug);
	 camera.centerOn(relX / zoomDebug, relY / zoomDebug).clamp();
	 render();
});