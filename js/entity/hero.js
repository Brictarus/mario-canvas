var Hero = Entity.extend({
	init: function(options) {
		options = options || {};
		options.friction = 0.80;
		options.maxSpeed = 50;
		this._super(options);
		this.acc = 1.1;
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