var Game = Class.extend({
  init: function (options) {
    options = options || {};
    this.started = false;
    var fps = options.fps || 30;
    this.tick = options.tick;
    this.setFps(fps);
    this.startTime = null;
    this.frameCount = 0;
    this.then = null;
    if (options.autostart) {
      this.start(this.fps);
    }
  },

  start: function () {
    this.started = true;
    this.frameCount = 0;
    this.then = Date.now();
    this.startTime = this.then;
    console.log('Game started at ' + this.fps + ' FPS');
    console.log('Start time : ' + this.startTime);
    this.animate();
  },

  stop: function () {
    this.started = false;
  },

  setFps: function (fps) {
    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;
  },

  animate: function () {
    // stop
    if (!this.started) {
      return;
    }

    // request another frame
    if (this.fps != -1) {
      requestAnimationFrame(this.animate.bind(this));
    }

    // calc elapsed time since last loop
    var now = Date.now();
    var elapsed = now - this.then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > this.fpsInterval) {

      // Get ready for next frame by setting then=now
      this.then = now - (elapsed % this.fpsInterval);

      // draw stuff here
      this.tick && this.tick(elapsed);

      // TESTING...Report #seconds since start and achieved fps.
      var sinceStart = now - this.startTime;
      var currentFps = Math.round(1000 / (sinceStart / ++this.frameCount) * 100) / 100;
      displayStat("tick-info",
          "Elapsed time= " + (Math.round(sinceStart / 1000 * 100) / 100).toFixed(2) + " secs @ " + currentFps + " fps.");

    }
  }
});

