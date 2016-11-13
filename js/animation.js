var Animation = Class.extend({
  init: function(options) {
    options = options || {};
    this.duration = options.duration;
    this.started = null;
    this.done = false;
  },

  start: function() {
    this.started = Date.now();
    this.targetTime = this.started + this.duration;
    this.frame = 0;
    this.value = 0;
    requestAnimationFrame(this.step.bind(this));
  },

  step: function() {
    this.frame++;
    var currTime = Date.now();

    var progress = (currTime - this.started) / (this.targetTime - this.started)
    console.log(progress);
    //if (Date.)

    if (currTime >= this.targetTime) {
      this.done = true;
    } else {
      requestAnimationFrame(this.step.bind(this));
    }
  }
});