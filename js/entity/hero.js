var Hero = Entity.extend({
	init: function(options) {
		options = options || {};
		options.friction = 0.87;
		options.maxSpeed = 6;
		this._super(options);
		this.acc = 3;
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