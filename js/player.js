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
	
	handleInputs: function() {
		if (this.keyboard) {
			this.readKeyboard();
		}
	},
	
	readKeyboard: function() {
		this.initControls();
		this.pauseDown = this.keyboard.isJustDown(this.config.keys.P);
		if (this.pauseDown) {
			this.game.togglePause();
		} else {
			this.upJustDown = this.keyboard.isJustDown(this.config.keys.UP_KEY);
			this.upJustDown && this.hero.jump();
			this.downDown = this.keyboard.isDown(this.config.keys.BOTTOM_KEY);
			this.downDown && this.hero.lower();
			this.leftDown = this.keyboard.isDown(this.config.keys.LEFT_KEY);
			this.leftDown && this.hero.goLeft();
			this.rightDown = this.keyboard.isDown(this.config.keys.RIGHT_KEY);
			this.rightDown && this.hero.goRight();
		}
	}
});