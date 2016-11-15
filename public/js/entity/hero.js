var Hero = Entity.extend({
  init: function (options) {
    options = options || {};
    options.friction = 0.80;
    options.maxSpeed = 30;
    this._super(options);
    this.acc = 0.9;
  },

  update: function(deltaT) {
    this._super();
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.w > this.level.width) {
      this.x = this.level.width - this.w;
    }
    if (this.y + this.h > this.level.height) {
      this.alive = false;
    }
  }
});