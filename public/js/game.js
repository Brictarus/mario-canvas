"use strict";

var Game = Class.extend({
  init: function (options) {
    options = options || {};

    var fps = options.fps || 30;
    this.keyboard = options.keyboard;
    this.$root = options.$root;

    this.started = false;

    this.setFps(fps);
    this.startTime = null;
    this.frameCount = 0;
    this.then = null;
    if (options.autostart) {
      this.start(this.fps);
    }
    this.resourcesStore = new ResourcesStore({name: 'misc'});
  },

  start: function () {
    this.started = true;
    this.state = GameState.INIT;
    this.frameCount = 0;
    this.then = Date.now();
    this.startTime = this.then;
    console.log('Game started at ' + this.fps + ' FPS');
    console.log('Start time : ' + this.startTime);
    this.animate();
    this.loadLevel(0);
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

  tick: function(deltaT) {
    switch (this.state) {
      case GameState.INIT:
        break;
      case GameState.RUN:
        if (!this.level.hero.alive) {
          this.state = GameState.GAME_OVER;
          return;
        }
        this.keyboard.update(deltaT);
        this.player.handleInputs(deltaT);
        this.level.update(deltaT);
        this.camera.centerOn(this.level.hero.x, this.level.hero.y).clamp();
        this.level.render(this.camera);
        displayStats(this.camera, this.level.hero);
        break;
      case GameState.GAME_OVER:
        this.gameOver();
        break;
      default:
        throw "unsupported game state";
    }
  },

  loadLevel: function(index) {
    var deferred = $.Deferred();
    var levelData;
    this.loadLevelData(index)
        .then(function(data) {
          levelData = data;
          return this.loadLevelAssets(data);
        }.bind(this))
        .done(function() {
          this.initLevel(levelData);
          this.state = GameState.RUN;
          deferred.resolve();
        }.bind(this))
        .fail(this.onLoadLevelFailed.bind(this));
    return deferred.promise();
  },

  loadLevelData: function (index) {
    var deferred = $.Deferred();
    if (index >= 0 && index < definedLevels.length) {
      deferred.resolve(definedLevels[index]);
    } else {
      deferred.reject("Loading level data failed : (index = " + index + ")");
    }
    return deferred.promise();
  },

  loadLevelAssets: function(levelData) {
    var deferred = $.Deferred();
    var loader = new ResourceLoader([
      new ImageResource({ key: "bg-" + levelData.background, url: "/assets/backgrounds/" + pad(levelData.background, 2) + ".png" })
    ]);
    loader.get()
        .then(function(resources) {
          this.resourcesStore.addResources(resources);
          deferred.resolve();
        }.bind(this))
        .fail(function() {
          deferred.reject("Loading level asset failed : (index = " + levelData.id + ")");
        });
    return deferred.promise();
  },

  initLevel: function(levelData) {
    var img = this.resourcesStore.getResource("bg-" + levelData.background).data;
    this.level = window.LEVEL = new Level({
      $root: this.$root,
      config: config
    });
    this.level.load(levelData);
    var hero = window.HERO = this.level.hero;

    var background = new Background({
      image: img,
      parallax: 1 / 6
    });
    this.level.setBackground(background);

    var viewport_width = this.$root.width(),
        viewport_heigth = this.$root.height();

    this.camera = new Camera(0, 0, viewport_width, viewport_heigth, config.camera.zoom, this.level.width, this.level.height);
    this.level.setCamera(this.camera);

    this.camera.centerOn(hero.x, hero.y).clamp();

    // this.level.render(this.camera);

    this.player.setLevel(this.level);
  },

  onLoadLevelFailed: function() {
    console.error("lo")
  },

  gameOver: function () {
    var ctx;
    if (!this.gameOverAnimation) {
      this.gameOverAnimation = {};
      ctx = this.level.addNewLayer("gameOver");
      this.gameOverAnimation.progress = 0;
    } else {
      ctx = this.level.getLayer("gameOver");
    }
    if (this.gameOverAnimation.progress <= 100) {
      ctx.save();
      ctx.clearRect(0, 0, this.camera.viewport_w, this.camera.viewport_h);
      ctx.fillStyle = "rgba(0,0,0," + Math.min(0.01 * this.gameOverAnimation.progress, 0.8) + ")";
      ctx.fillRect(0, 0, this.camera.viewport_w, this.camera.viewport_h);
      ctx.fillStyle = "rgba(255,255,255," +(0.01 * this.gameOverAnimation.progress) + ")";
      ctx.textAlign = "center";
      ctx.textBaseline="middle";
      ctx.font = "bold 30px Arial";
      ctx.fillText("Game Over !", this.camera.viewport_w / 2, this.gameOverAnimation.progress * this.camera.viewport_h / 2 / 100);
      this.gameOverAnimation.progress = Math.min(this.gameOverAnimation.progress + 1, 100);
      ctx.restore();
    }
  }
});

