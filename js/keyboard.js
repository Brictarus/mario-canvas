var Key = Class.extend({
	init: function(keyCode) {
		this.keyCode = keyCode;
		this.repeats = 0;
	},
	
	isDown: function() {
		return this.down === true;
	},
	
	isUp: function() {
		return this.down === false;
	},
	
	isJustDown: function() {
		return this.down === true && this.repeats === 1;
	},
	
	isJustUp: function() {
		return this.down === false && this.repeats === 1;
	},
	
	update: function() {
		this.repeats++;
	},
	
	onKeyDown: function(event) {
		if (this.down !== true) {
			this.down = true;
			this.time = new Date;
			this.repeats = 0;
		}
	},
	
	onKeyUp: function(event) {
		if (this.down !== false) {
			this.down = false;
			this.time = new Date;
			this.repeats = 0;
		}
	}
});

var Keyboard = Class.extend({
	init: function() {
		this._keys = {};
	},
	
	start: function() {
		window.addEventListener('keydown', this._onKeyDown.bind(this), false);
		window.addEventListener('keyup', this._onKeyUp.bind(this), false);
	},
	
	stop: function() {
		window.removeEventListener('keydown', this._onKeyDown);
		window.removeEventListener('keyup', this._onKeyUp);
	},
	
	_onKeyDown: function(event) {
		var key = this._keys[event.keyCode];
		if (!key) {
			key = this._keys[event.keyCode] = new Key(event.keyCode);
		}
		key.onKeyDown(event);
	},
	
	_onKeyUp: function(event) {
		var key = this._keys[event.keyCode];
		if (!key) {
			key = this._keys[event.keyCode] = new Key(event.keyCode);
		}
		key.onKeyUp(event);
	},
	
	getKeyState: function(keyCode) {
		var key = this._keys[keyCode]; 
		if (!key) {
			key = new Key(keyCode);
			key.down = false;
			key.repeats = Infinity;
			key.time = new Date(0);
		}
		return key;
	},
	
	isDown: function(keyCode) {
		return this.getKeyState(keyCode).isDown();
	},
	
	isUp: function() {
		this.getKeyState(keyCode).isUp();
	},
	
	isJustDown: function() {
		this.getKeyState(keyCode).isJustDown();
	},
	
	isJustUp: function() {
		this.getKeyState(keyCode).isJustUp();
	},
	
	update: function() {
		for (var keyIndex in this._keys) {
			if(this._keys.hasOwnProperty(keyIndex)) {
				var key = this._keys[keyIndex];
				key.update();
			}
		}
	}
});