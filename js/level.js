var Level = Class.extend({
	init: function(options) {
		this.layers = [];
		this._indexLayers = {};
		this.$root = options.$root;
		this.config = options.config;
		this.background = options.background;
		this.tileSize = options.tileSize || this.config.tile_size;
		this.reset();

		var backgroundLayer = this.addNewLayer("layer-background");
		var levelLayer			= this.addNewLayer("layer-level");
		var characterLayer 	= this.addNewLayer("layer-characters");
	},
	
	addNewLayer: function (id) {	
		if (!this.$root || this.$root.length == 0) {
			throw 'no root provided for level';
		}
		if (!id) {
			throw 'id is required for new layer creation';
		}
		if (this._indexLayers.hasOwnProperty(id)) {
			throw 'a layer with that id (' + id + ') already exists in this level';
		}
		var $canvas = $('<canvas>'+ config.errors.no_canvas_support +'</canvas>').appendTo(this.$root);
		$canvas.attr('width', this.$root.width());
		id && $canvas.attr("id", id);
		$canvas.attr('height', this.$root.height());
		var layerNumber = this.$root.children().length;
		$canvas.addClass("layer-" + layerNumber);
		$canvas.css("z-index", layerNumber);
		var ctx = $canvas[0].getContext('2d');
		this.layers.push(ctx);
		this._indexLayers[id] = { $canvas: $canvas, context: ctx};
		return ctx;
	},
	
	getLayer: function(id) {
		return this._indexLayers[id].context;
	},
	
	setCamera: function(camera) {
		this.camera = camera;
		camera.setLevel(this);
	},
	
	setBackground: function(bg) {
		this.background = bg;
	},
	
	reset: function() {
		this.blocks = [];
		this.characters = [];
		this.collidables = [];
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
				if (!k) continue;
				var drawable = DrawableFactory.createFromName(k, {
					level: this, 
					x: i == 0 ? 0 : i * tileWidth - 1,
					y: j == 0 ? 0 : j * tileHeight - 1,
					w: tileWidth,
					h: tileHeight
				});
				//console.log(drawable.x +", "+drawable.y);
			}
		}
		this.collidables = this.blocks.concat(this.characters);
		this.hero = this.findHero();
    
    this.tree = new Quadtree({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height
    });
	},
	
	findHero: function () {
		var mario = null, idx = 0;
		while (mario == null && idx < this.characters.length) {
			var tempChar = this.characters[idx];
			if (tempChar instanceof Hero) {
				mario = tempChar;
			}
			idx++;
		}
		return mario;
	},
	
	getHero: function() {
		if (!this.hero) {
			this.hero = this.findHero();
		}
		return this.hero;
	},
	
	update: function(deltaT) {
		this.updateTree();
    this.characters.forEach(function(entity) {
			entity.update(deltaT);
		});
	},
  
  updateTree: function() {
    var tree = this.tree;
    tree.clear();
    this.collidables.forEach(function(item) {
      tree.insert({
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        item: item
      });
    });
  },
	
	findCollidablesInRect: function(excludes, rect) {
		var collidings = [], item;
    var items = this.tree.retrieve({
      x: rect.x,
      y: rect.y,
      width: rect.w,
      height: rect.h
    });
    for (var i = 0; i < items.length; i++) {
      item = items[i].item;
      if (excludes.indexOf(item) == -1) {
        if (overlap(rect, item)) {
					collidings.push(item);
				}
			}
    }
		return collidings;
	},
	
	render: function(camera) {
		this.clear(camera, layers);
		if (this.background) {
			this.background.render(this.getLayer("layer-background"), camera);
		}
		this.renderBlocks(this.getLayer("layer-level"), camera);
		this.renderCharacters(this.getLayer("layer-characters"), camera);
		//renderCameraBBox(camera);
	},
	
	clear: function(camera) {
		this.layers.map(function(layer) {
			layer.clearRect(0, 0, this.camera.viewport_w, this.camera.viewport_h);
		});
	},
	
	renderBlocks: function(layer, camera) {
		layer.save();
		layer.translate(-camera.x, -camera.y);
		var visibles = invisibles = 0;
		for (var i = 0; i < this.blocks.length; i++) {
			var b = this.blocks[i];
			if (camera.isVisible(b)) {
				b.draw(layer,  camera);
				visibles++;
			} else {
				invisibles++;
			}
		}
		displayStat("blocks-visibility", 'visibles = ' + visibles + ", invisibles = " + invisibles);
		layer.restore();
	},
	
	renderCharacters: function(layer, camera) {
		layer.save();
		layer.translate(-camera.x, -camera.y);
		var visibles = invisibles = 0;
		for (var i = 0; i < this.characters.length; i++) {
			var b = this.characters[i];
			if (camera.isVisible(b)) {
				b.draw(layer,  camera);
				visibles++;
			} else {
				invisibles++;
			}
		}
		displayStat("characters-visibility", 'visibles = ' + visibles + ", invisibles = " + invisibles);
		layer.restore();
	}
});

