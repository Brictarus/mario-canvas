var Resource = Class.extend({
  init: function (options) {
    options = options || {};
    this.key = options.key;
    if (!this.key) {
      throw 'resource key is not defined';
    }

    this.url = options.url;
    if (!this.url) {
      throw 'resource url is not defined';
    }
  },

  get: function () {
    return $.get(this.url);
  }
});