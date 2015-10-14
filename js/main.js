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
	ctxDbg1.restore();
}

function displayStats(c /* camera */) {
	displayStat("camera-x", c.x);
	displayStat("camera-y", c.y);
	displayStat("camera-w-x", c.world_x);
	displayStat("camera-w-y", c.world_y);
	displayStat("camera-zoom", c.zoom);
}

function displayStat(name, value) {
	var $el = $('p.'+ name +' span');
	if ($el.length > 0) {
		$el.html(value);
	} else {
		console.log(name + " = " + value);
	}
}

var mario, camera, layers;
var levelRawData = definedLevels[0];

img = new Image();
img.src = 'assets/backgrounds/02.png';
img.onload = function(){
	var $root = $("#world");
	var viewport_width = $root.width(), viewport_heigth = $root.height()
	var lvl = new Level({
		$root: $("#world"),
		config: config
	});
	lvl.load(levelRawData);
	var background = new Background({
		image: img,
		parallax: 1/6
	});
	lvl.setBackground(background);
	mario = lvl.hero;
	camera = new Camera(0, 0, viewport_width, viewport_heigth, config.camera.zoom, lvl.width, lvl.height);
	lvl.setCamera(camera);
	camera.centerOn(lvl.hero.x, lvl.hero.y).clamp();
	
	lvl.render(camera);
	var keyboard = window.k = new Keyboard();
	keyboard.start();
	
	var game = window.g = new Game({
		fps: 30,
		autostart: false,
		tick: function(deltaT) {
			keyboard.update(deltaT);
			player.handleInputs(deltaT);
			lvl.update(deltaT);
			camera.centerOn(mario.x, mario.y).clamp();
			lvl.render(camera);
		}
	});
	
	var player = window.p = new Player({
		game: game,
		config: config,
		inputs: {
			keyboard: keyboard
		},
		level: lvl
	});
	
	game.start();
	
	//$(document).on('keydown', handleMarioMovement);
	
	
	//$canvasDebugLayer1.on("click", clickOnDebugMap);


	/*var $canvasDebugLayer0 = initCanvas($("#mapDebug"));
	var $canvasDebugLayer1 = initCanvas($("#mapDebug"));
	var ctxDbg0 = $canvasDebugLayer0[0].getContext("2d");
	var ctxDbg1 = $canvasDebugLayer1[0].getContext("2d");
	var zoomDebug = 1/8;
	*/


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
			displayStats(camera);
			event.preventDefault();
			return false;
		}
	}
};