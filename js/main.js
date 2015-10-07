function clear(camera, layers) {
	layers = layers || [];
	layers.map(function(layer) {
		layer.clearRect(0, 0, camera.viewport_w, camera.viewport_h);
	});
	//backgroundLayer.clearRect(0, 0, camera.viewport_w, camera.viewport_h);
	//ctx.clearRect(0, 0, camera.viewport_w, camera.viewport_h);
	//characterLayer.clearRect(0, 0, camera.viewport_w, camera.viewport_h);
	//ctxDbg1.clearRect(0, 0, $canvasDebugLayer1.width(), $canvasDebugLayer1.height());
}

function renderBlocks(blocks, ctx, camera) {
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

function render(camera, layers) {
	clear(camera, layers);
	renderBackground(camera.level.background, layers[0], camera);
	renderBlocks(camera.level.blocks, layers[1], camera);
	renderCharacters(camera.level.characters, layers[2], camera);
	//renderCameraBBox(camera);
}

var mario, camera, layers;
var levelRawData = definedLevels[0];
var bg = {};
bg.img = new Image();
bg.img.loaded = false;
bg.img.src = 'assets/backgrounds/02.png';
bg.img.onload = function(){
	bg.img.loaded = true;
	bg.img_width = this.width;
	bg.img_height = this.height;
	//renderBackground(bg, backgroundLayer, camera);
	
	var $root = $("#world");
	var viewport_width = $root.width(), viewport_heigth = $root.height()
	var lvl = new Level({
		$root: $("#world"),
		config: config,
		background: bg
	});
	var backgroundLayer = lvl.addNewLayer("layer-background");
	var levelLayer			= lvl.addNewLayer("layer-level");
	var characterLayer 	= lvl.addNewLayer("layer-characters");
	layers = [backgroundLayer, levelLayer, characterLayer]; 
	lvl.load(levelRawData);
	mario = lvl.hero;
	camera = new Camera(0, 0, viewport_width, viewport_heigth, config.camera.zoom, lvl.width, lvl.height);
	lvl.setCamera(camera);
	camera.centerOn(lvl.hero.x, lvl.hero.y).clamp();
	
	render(camera, layers);
	
	var handleMarioMovement0 = handleMarioMovement;
	$(document).on('keydown', handleMarioMovement0);
	//$canvasDebugLayer1.on("click", clickOnDebugMap);
};

/*var $canvasDebugLayer0 = initCanvas($("#mapDebug"));
var $canvasDebugLayer1 = initCanvas($("#mapDebug"));
var ctxDbg0 = $canvasDebugLayer0[0].getContext("2d");
var ctxDbg1 = $canvasDebugLayer1[0].getContext("2d");
var zoomDebug = 1/8;


var i = 0, j = 0;
var tileWidth = tileHeight = 32;
var max_x = tileWidth * level.width;
var max_y = tileHeight * level.height;
var zoom = 1;
*/
/*var res = loadLevel(level, tileWidth, tileHeight);
var blocks = res.blocks, characters = res.characters;
renderBlocksDebug(blocks);
var mario = null, idx = 0;
while (mario == null && idx < characters.length) {
	var tempChar = characters[idx];
	if (tempChar.kind == "mario") {
		mario = tempChar;
	}
	idx++;
}*/

var BOTTOM_KEY = 40,
	UP_KEY = 38,
	LEFT_KEY = 37,
	RIGHT_KEY = 39,
	PLUS_KEY = 107,
	MINUS_KEY = 109,
	HOME_KEY = 36,
	END_KEY = 35;

function clickOnDebugMap(e) {
	var offset = $(this).offset(); 
	var relX = e.pageX - offset.left;
	var relY = e.pageY - offset.top;
	$(".mouse-pos span").text("x: " + relX / zoomDebug + ", y: " + relY / zoomDebug);
	camera.centerOn(relX / zoomDebug, relY / zoomDebug).clamp();
}

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
		//render();
		event.preventDefault();
		return false;
	}
}

function handleMarioMovement(event) {
	var offset = 16;
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
		case PLUS_KEY:
			camera.setZoom(camera.zoom * 2); 
			camera.clamp();
			break;
		case MINUS_KEY:
			camera.setZoom(camera.zoom / 2);
			camera.clamp();
			break;
		case HOME_KEY:
			mario.x = 0; 
			mario.y = 0;
			break;
		case END_KEY:
			mario.x = camera.max_x - mario.w; 
			mario.y = camera.max_y - mario.h;
			break;
		default:
			handled = false;
			console.log(event.keyCode);
			break;
	} 
	if (handled) {
		camera.centerOn(mario.x, mario.y).clamp();
		render(camera, layers);
		event.preventDefault();
		return false;
	}
}
