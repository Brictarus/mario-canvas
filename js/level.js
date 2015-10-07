var Level = Class.extend({
	init: function(options) {
		this.$root = options.$root;
		this.config = options.config;
		this.background = options.background;
		this.tileSize = options.tileSize || this.config.tile_size;
		this.reset();	
	},
	
	addNewLayer: function (id) {	
		if (!this.$root || this.$root.length == 0) {
			throw 'no root provided for level';
		}
		var $canvas = $('<canvas>'+ config.errors.no_canvas_support +'</canvas>').appendTo(this.$root);
		$canvas.attr('width', this.$root.width());
		id && $canvas.attr("id", id);
		$canvas.attr('height', this.$root.height());
		var layerNumber = this.$root.children().length;
		$canvas.addClass("layer-" + layerNumber);
		$canvas.css("z-index", layerNumber);
		return $canvas[0].getContext('2d');
	},
	
	setCamera: function(camera) {
		this.camera = camera;
		camera.setLevel(this);
	},
	
	reset: function() {
		this.blocks = [];
		this.characters = [];	
		this.hero = null;
		this.width = null;
		this.height = null;
	},
	
	load: function (level) {
		this.reset();
		var blocks = this.blocks;
		var characters = this.characters;
		var tileWidth = tileHeight = this.tileSize;
		this.width = tileWidth * level.width;
		this.height = tileHeight * level.height;
		var i = 0, j = 0;
		for (i = 0; i < level.width; i++) {
			for (j = 0; j < level.height; j++) {
				var k = level.data[i][j];
				var color = getTileColor(k);
				if (k == "mario" || k == "ballmonster" || k == "greenturtle") {
					characters.push({
						kind: k,
						x: i * tileWidth,
						y: j * tileHeight,
						w: tileWidth,
						h: tileHeight,
						color: color
					});
					k = "";
				}
				if (k) {
					blocks.push({
						kind: k,
						x: i * tileWidth,
						y: j * tileHeight,
						w: tileWidth,
						h: tileHeight,
						color: color
					});
				}
			}
		}
		this.hero = this.findHero();
	},
	
	findHero: function () {
		var mario = null, idx = 0;
		while (mario == null && idx < this.characters.length) {
			var tempChar = this.characters[idx];
			if (tempChar.kind == "mario") {
				mario = tempChar;
			}
			idx++;
		}
		return mario;
	}
});
