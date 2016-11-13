var Game = Class.extend({
  init: function (options) {
    options = options || {};
    this.camera = options.camera;
    this.level = options.level;
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
    this.state = GameState.RUN;
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
      displayStat("state", this.state);
    }
  },

  gameOver: function () {
    //this.level.this.camera.viewport_w
    //this.viewport_h
    var ctx;
    if (!this.gameOverAnimation) {
      this.gameOverAnimation = {};
      ctx = this.level.addNewLayer("gameOver");
      this.gameOverAnimation.progress = 0;
    } else {
      ctx = this.level.getLayer("gameOver");
    }
    ctx.save();
    //this.gameOverAnimationProgress %= 360;
    ctx.clearRect(0, 0, this.camera.viewport_w, this.camera.viewport_h);
    ctx.fillStyle = "rgba(0,0,0," + Math.min(0.01 * this.gameOverAnimation.progress, 0.8) + ")";
    ctx.fillRect(0, 0, this.camera.viewport_w, this.camera.viewport_h);
    //ctx.fillStyle = "#000";
    ctx.fillStyle = "rgba(255,255,255," +(0.01 * this.gameOverAnimation.progress) + ")";
    ctx.textAlign = "center";
    ctx.textBaseline="middle";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Game Over !", this.camera.viewport_w / 2, this.gameOverAnimation.progress * this.camera.viewport_h / 2 / 100);
    this.gameOverAnimation.progress = Math.min(this.gameOverAnimation.progress + 1, 100);
    ctx.restore();
  }
});

