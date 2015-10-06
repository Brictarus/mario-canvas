function initCanvas($container, id) {	
	var $canvas = $('<canvas>Votre navigateur ne supporte pas les technologies récentes. Merci de le mettre à jour.</canvas>').appendTo($container);
	$canvas.attr('width', $container.width());
	id && $canvas.attr("id", id);
	$canvas.attr('height', $container.height());
	var layerNumber = $container.children().length;
	$canvas.addClass("layer-" + layerNumber);
	$canvas.css("z-index", layerNumber);
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
	var characters = [];
	var i = 0, j = 0;
	var tileWidth = tileHeight = 32;
	var tileWidthDebug = tileHeightDebug = 4;
	for (i = 0; i < level.width; i++) {
		for (j = 0; j < level.height; j++) {
			var k = level.data[i][j];
			var color = getTileColor(k);
			if (k == "mario" || k == "ballmonster" || k == "greenturtle") {
				characters.push({
					kind: k,
					x: i * tileW,
					y: j * tileH,
					w: tileW,
					h: tileH,
					color: color
				});
				k = "";
			}
			if (k) {
				blocks.push({
					kind: k,
					x: i * tileW,
					y: j * tileH,
					w: tileW,
					h: tileH,
					color: color
				});
			}
		}
	}
	return { blocks : blocks, characters : characters};
}

function clear() {
	backgroundLayer.clearRect(0, 0, $canvas.width(), $canvas.height());
	ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
	characterLayer.clearRect(0, 0, $canvas.width(), $canvas.height());
	ctxDbg1.clearRect(0, 0, $canvasDebugLayer1.width(), $canvasDebugLayer1.height());
}

function renderBlocks(blocks, camera) {
	ctx.save();
	ctx.translate(-camera.x, -camera.y);
	var visibles = invisibles = 0;
	for (var i = 0; i < blocks.length; i++) {
		var b = blocks[i];
		if (camera.isVisible(b)) {
			ctx.fillStyle = b.color;
			ctx.fillRect(~~(b.x * camera.zoom), ~~(b.y * camera.zoom), ~~(b.w * camera.zoom), ~~(b.h * camera.zoom));
			visibles++;
		} else {
			invisibles++;
		}
	}
	displayStat("blocks-visibility", 'visibles = ' + visibles + ", invisibles = " + invisibles);
	ctx.restore();
}

function renderCharacters(characters, ctx, camera) {
	ctx.save();
	ctx.translate(-camera.x, -camera.y);
	var visibles = invisibles = 0;
	for (var i = 0; i < characters.length; i++) {
		var b = characters[i];
		if (camera.isVisible(b)) {
			ctx.fillStyle = b.color;
			ctx.fillRect(~~(b.x * camera.zoom), ~~(b.y * camera.zoom), ~~(b.w * camera.zoom), ~~(b.h * camera.zoom));
			visibles++;
		} else {
			invisibles++;
		}
	}
	displayStat("characters-visibility", 'visibles = ' + visibles + ", invisibles = " + invisibles);
	ctx.restore();
}

function renderBackground(bg, ctx, camera) {
	if (bg.img.loaded) {
		ctx.save();
		var ratioImg = bg.img_width / bg.img_height;
		bg.height = Math.round(camera.viewport_h * camera.zoom);
		bg.width = Math.round(bg.height * ratioImg);
		
		
		var bgParallaxSpeed = 1/6;
		ctx.translate(-camera.x * bgParallaxSpeed, -camera.y * bgParallaxSpeed);

		var bgIndex = ~~(camera.x / (bg.width / bgParallaxSpeed));
		var totalLength = -~~(camera.x % (bg.width / bgParallaxSpeed));
		while (totalLength < camera.viewport_w) {
			ctx.drawImage(bg.img, 0, 0, bg.img_width, bg.img_height, bgIndex * bg.width, 0, bg.width, bg.height);			
			totalLength += bg.width;
			bgIndex++;
		}
		
		ctx.restore();
	}
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
	displayStat("camera-x", c.x);
	displayStat("camera-y", c.y);
	displayStat("camera-w-x", c.world_x);
	displayStat("camera-w-y", c.world_y);
	displayStat("camera-zoom", c.zoom);
	ctxDbg1.restore();
}

function displayStat(name, value) {
	var $el = $('p.'+ name +' span');
	if ($el.length > 0) {
		$el.html(value);
	} else {
		console.log(name + " = " + value);
	}
}

function render() {
	clear();
	renderBackground(bg, backgroundLayer, camera);
	renderBlocks(blocks, camera);
	renderCharacters(characters, characterLayer, camera);
	renderCameraBBox(camera);
}

var level = definedLevels[0];
var backgroundLayer = initCanvas($("#world"), "layer-background")[0].getContext("2d");
var bg = background = {};
bg.img = new Image();
bg.img.loaded = false;
bg.img.src = 'assets/backgrounds/02.png';
bg.img.onload = function(){
	bg.img.loaded = true;
	bg.img_width = this.width;
	bg.img_height = this.height;
	renderBackground(bg, backgroundLayer, camera);
}
var $canvas = initCanvas($("#world"), "layer-level");
var ctx = $canvas[0].getContext("2d");
var characterLayer = initCanvas($("#world"), "layer-characters")[0].getContext("2d");
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
var res = loadLevel(level, tileWidth, tileHeight);
var blocks = res.blocks, characters = res.characters;
renderBlocksDebug(blocks);
render();
var mario = null, idx = 0;
while (mario == null && idx < characters.length) {
	var tempChar = characters[idx];
	if (tempChar.kind == "mario") {
		mario = tempChar;
	}
	idx++;
}


var BOTTOM_KEY = 40,
	UP_KEY = 38,
	LEFT_KEY = 37,
	RIGHT_KEY = 39,
	PLUS_KEY = 107,
	MINUS_KEY = 109,
	HOME_KEY = 36,
	END_KEY = 35;
	
$(document).on('keydown', handleCameraMovement);

$canvasDebugLayer1.on("click", function(e) {
	var offset = $(this).offset(); 
   var relX = e.pageX - offset.left;
   var relY = e.pageY - offset.top;
	 $(".mouse-pos span").text("x: " + relX / zoomDebug + ", y: " + relY / zoomDebug);
	 camera.centerOn(relX / zoomDebug, relY / zoomDebug).clamp();
	 render();
});



function handleCameraMovement(event) {
	var offset = 50;
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
}

function handleMarioMovement(event) {
	var offset = 10;
	var handled = true;
	switch (event.keyCode) {
		case BOTTOM_KEY:
			mario.y += offset; break;
		case UP_KEY:
			mario.y -= offset; break;
		case LEFT_KEY:
			mario.x -= offset; break;
		case RIGHT_KEY:
			mario.x += offset; break;
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
}