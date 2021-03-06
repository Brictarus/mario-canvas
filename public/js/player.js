var Player = Class.extend({
  init: function (options) {
    options = options || {};
    this.config = options.config;
    this.keyboard = options.inputs ? options.inputs.keyboard : null;
    this.game = options.game;
    this.initControls();
  },

  setLevel: function(level) {
    this.level = level;
    this.hero = level.getHero();
  },

  initControls: function () {
    this.upDown = this.downDown = this.leftDown = this.rightDown =
        this.upJustDown = this.pauseDown = false;
  },

  handleInputs: function (deltaT) {
    if (this.keyboard) {
      this.readKeyboard(deltaT);
    }
  },

  readKeyboard: function () {
    this.initControls();
    this.pauseDown = this.keyboard.isJustDown(this.config.keys.P);
    if (this.pauseDown) {
      this.game.togglePause();
    } else {
      var velocity = this.hero.velocity;
      this.upJustDown = this.keyboard.isJustDown(this.config.keys.UP_KEY);
      this.upDown = this.keyboard.isDown(this.config.keys.UP_KEY);
      this.downDown = this.keyboard.isDown(this.config.keys.BOTTOM_KEY);
      if (this.upJustDown && this.hero.onGround) {
        //if (this.upDown) {
        velocity.y = -13;
        //velocity.y -= this.hero.acc;
        //velocity.y = Math.max(velocity.y, -this.hero._maxSpeed);
      } else if (this.downDown) {
        //velocity.y = 0;
        velocity.y += this.hero.acc;
        velocity.y = Math.min(velocity.y, this.hero._maxSpeed);
      }
      //velocity.y *= this.hero._friction;
      if (Math.abs(velocity.y) < 0.1) {
        velocity.y = 0.0;
      }

      // this.downDown && this.hero.lower();
      this.shiftDown = this.keyboard.isDown(this.config.keys.LEFT_SHIFT);
      this.leftDown = this.keyboard.isDown(this.config.keys.LEFT_KEY);
      this.rightDown = this.keyboard.isDown(this.config.keys.RIGHT_KEY);
      var maxSpeedXModifier = this.shiftDown ? 1.5 : 1;
      if (this.leftDown) {
        velocity.x -= (this.hero.acc * maxSpeedXModifier);
        velocity.x = Math.max(velocity.x, -this.hero._maxSpeed * maxSpeedXModifier);
      } else if (this.rightDown) {
        velocity.x += (this.hero.acc * maxSpeedXModifier);
        velocity.x = Math.min(velocity.x, this.hero._maxSpeed * maxSpeedXModifier);
      }
      velocity.x *= this.hero._friction;
      if (Math.abs(velocity.x) < 0.1) {
        velocity.x = 0.0;
      }

    }
  }
});