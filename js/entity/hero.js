var Hero = Entity.extend({
	init: function(options) {
		options = options || {};
		options.friction = 0.80;
		options.maxSpeed = 5;
		this._super(options);
		this.acc = 0.5;
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