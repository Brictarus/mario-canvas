var Entity = Drawable.extend({
	
	init: function(options) {
		this._super(options);
		this.velocity = new Vector(0, 0);
		this._maxSpeed = options.maxSpeed;
		this._friction = options.friction || 1.0;
		
		options.level && options.level.characters.push(this);
	},
	
	update: function(deltaT) {
		//this.applyGravity();
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	},
	
	applyGravity: function() {
		this.velocity.y += 0.3;
	}
	
});