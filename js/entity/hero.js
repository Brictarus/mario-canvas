var Hero = Entity.extend({
	init: function(options) {
		options = options || {};
		options.friction = 0.80;
		options.maxSpeed = 30;
		this._super(options);
		this.acc = 0.9;
	},
	goLeft: function() {
		this.velocity.x = -this._maxSpeed;
	},
	goRight: function() {
		this.velocity.x = this._maxSpeed;
	},
	jump: function() {
		this.y--;
	},
	goLeft: function() {
		this.x--;
	},
});