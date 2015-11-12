var Drawable = Class.extend({
	
	init: function(options) {
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		this.restitution = options.restitution || .6;
		
		this.dbgColor = options.dbgColor;
		this.level = options.level;
		this.halfWidth = this.w / 2;
		this.halfHeight = this.h / 2;
	},

	getLeft: function() {
		return this.x;
	},

	getRight: function() {
		return this.x + this.w;
	},

	getTop: function () {
		return this.y;
	},

	getBottom: function() {
		return this.y + this.h;
	},

	getMidX: function() {
		return this.x + this.w / 2;
	}, 

	getMidY: function() {
		return this.y + this.h / 2;
	},
	
	draw: function(context, camera) {
		context.save();
		context.fillStyle = this.dbgColor;
		context.fillRect(~~(this.x * camera.zoom), ~~(this.y * camera.zoom), ~~(this.w * camera.zoom), ~~(this.h * camera.zoom));
		context.restore();
	}
});