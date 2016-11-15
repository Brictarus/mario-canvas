function displayStats(c /** camera **/, hero) {
  displayStat("camera-x", c.x);
  displayStat("camera-y", c.y);
  displayStat("camera-w-x", c.world_x);
  displayStat("camera-w-y", c.world_y);
  var hitL = (!!hero.hitLeft);
  var hitR = (!!hero.hitRight);
  var hitU = (!!hero.hitUp);
  var hitD = (!!hero.hitDown);
  displayStat("hit-l", hitL.toString().charAt(0).toUpperCase());
  displayStat("hit-r", hitR.toString().charAt(0).toUpperCase());
  displayStat("hit-u", hitU.toString().charAt(0).toUpperCase());
  displayStat("hit-d", hitD.toString().charAt(0).toUpperCase());
  $('.hit-l')[hitL ? "addClass" : "removeClass"]("true");
  $('.hit-r')[hitR ? "addClass" : "removeClass"]("true");
  $('.hit-u')[hitU ? "addClass" : "removeClass"]("true");
  $('.hit-d')[hitD ? "addClass" : "removeClass"]("true");

}

function displayStat(name, value) {
  var $el = $('p.' + name + ' span');
  if ($el.length > 0) {
    $el.html(value.toString());
  } else {
    console.log(name + " = " + value);
  }
}

(function () {
  var $root = $("#world");

  var keyboard = window.k = new Keyboard();
  keyboard.start();

  var game = window.g = new Game({
    fps: 60,
    autostart: false,
    keyboard: keyboard,
    $root: $root
  });

  game.player = window.p = new Player({
    game: game,
    config: config,
    inputs: {
      keyboard: keyboard
    }
  });

  game.start();

  if (game.fps === -1) {
    var $debugStepButton = $("#debug-step-button");
    $debugStepButton.show();
    $debugStepButton.on("click", function () {
      game.animate();
    });
  }
})();
