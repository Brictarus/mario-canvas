var Drawable = Class.extend({
	
	init: function(options) {
		this.x = options.x;
		this.y = options.y;
		this.w = options.w;
		this.h = options.h;
		
		this.dbgColor = options.dbgColor;
		this.level = options.level;
	},
	
	draw: function(context, camera) {
		context.save();
		context.fillStyle = this.dbgColor;
		context.fillRect(~~(this.x * camera.zoom), ~~(this.y * camera.zoom), ~~(this.w * camera.zoom), ~~(this.h * camera.zoom));
		context.restore();
	}
});