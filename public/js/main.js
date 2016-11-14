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

var mario, camera, layers;
var currLevel = definedLevels[0];
//var currLevel = testLevel;

var resourcesStore = new ResourcesStore({name: 'misc'});
var loader = new ResourceLoader([
  new ImageResource({ key: "bg-" + currLevel.background, url: "/assets/backgrounds/" + pad(currLevel.background, 2) + ".png" })
]);
loader.get().then( resources => {
  resourcesStore.addResources(resources);
  onLoad();
});


function onLoad() {
  var img = resourcesStore.getResource("bg-" + currLevel.background).data;

  var $root = $("#world");
  var viewport_width = $root.width(), viewport_heigth = $root.height()
  var lvl = window.LEVEL = new Level({
    $root: $root,
    config: config
  });
  lvl.load(currLevel);
  var background = new Background({
    image: img,
    parallax: 1 / 6
  });
  lvl.setBackground(background);
  window.MARIO = mario = lvl.hero;
  camera = new Camera(0, 0, viewport_width, viewport_heigth, config.camera.zoom, lvl.width, lvl.height);
  lvl.setCamera(camera);
  camera.centerOn(lvl.hero.x, lvl.hero.y).clamp();

  lvl.render(camera);
  var keyboard = window.k = new Keyboard();
  keyboard.start();

  var game = window.g = new Game({
    fps: 60,
    autostart: false,
    camera: camera,
    level: lvl,
    keyboard: keyboard
  });

  game.player = window.p = new Player({
    game: game,
    config: config,
    inputs: {
      keyboard: keyboard
    },
    level: lvl
  });

  game.start();

  $("#debug-step-button").on("click", function () {
    game.animate();
  });
}
