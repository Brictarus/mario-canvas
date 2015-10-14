var Player = Class.extend({
	init: function(options) {
		options = options || {};
		this.config = options.config;
		this.keyboard = options.inputs ? options.inputs.keyboard : null;
		this.game = options.game;
		this.level = options.level ? options.level : this.game.level;
		this.hero = this.level.getHero();
		this.initControls();
	},
	
	initControls: function() {
		this.upDown = this.downDown = this.leftDown = this.rightDown = 
				this.upJustDown = this.pauseDown = false;
	},
	
	handleInputs: function(deltaT) {
		if (this.keyboard) {
			this.readKeyboard(deltaT);
		}
	},
	
	readKeyboard: function() {
		this.initControls();
		this.pauseDown = this.keyboard.isJustDown(this.config.keys.P);
		if (this.pauseDown) {
			this.game.togglePause();
		} else {
			var velocity = this.hero.velocity;
			this.upJustDown = this.keyboard.isJustDown(this.config.keys.UP_KEY);
			this.downDown = this.keyboard.isDown(this.config.keys.BOTTOM_KEY);
			if (this.upJustDown) {
				velocity.y -= 4;
			} else if (this.downDown) {
				velocity.y = 0;
			} 
			// this.downDown && this.hero.lower();
			this.leftDown = this.keyboard.isDown(this.config.keys.LEFT_KEY);
			this.rightDown = this.keyboard.isDown(this.config.keys.RIGHT_KEY);
			if (this.leftDown) {
				velocity.x -= this.hero.acc;
				velocity.x = Math.max(velocity.x, -this.hero._maxSpeed)
			} else if (this.rightDown) {
				velocity.x += this.hero.acc;
				velocity.x = Math.min(velocity.x, this.hero._maxSpeed)
			} else {
				//velocity.x = 0;
			}
			velocity.x *= this.hero._friction;
			if (Math.abs(velocity.x) < 0.1) {
				velocity.x = 0.0;
			}
			
		}
	}
});