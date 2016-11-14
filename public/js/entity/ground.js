var Ground = Drawable.extend({
  init: function (options) {
    this._super(options);

    options.level && options.level.blocks.push(this);
  }
});