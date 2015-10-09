var Background = Class.extend({
	init: function(options) {
		options = options || {};
		this.layer = options.layer;
		this.image = options.image;
		this.parallax = options.parallax || 1;
		this.img_width = this.image.width;
		this.img_height = this.image.height;
		this.img_ratio = this.img_width / this.img_height;
	},
	
	render: function(layer, camera) {
		layer = layer || this.layer;
		layer.save();
		
		this.height = Math.round(camera.viewport_h * camera.zoom);
		this.width = Math.round(this.height * this.img_ratio);
		
		//var bgParallaxSpeed = 1/6;
		layer.translate(-camera.x * this.parallax, -camera.y * this.parallax);

		var bgIndex = ~~(camera.x / (this.width / this.parallax));
		var totalLength = -~~(camera.x % (this.width / this.parallax));
		while (totalLength < camera.viewport_w) {
			layer.drawImage(this.image, 0, 0, this.img_width, this.img_height, bgIndex * this.width, 0, this.width, this.height);			
			totalLength += this.width;
			bgIndex++;
		}
		
		layer.restore();
	}
});