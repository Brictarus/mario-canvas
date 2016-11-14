var ImageResource = Resource.extend({
  init: function(options) {
    this._super(options);
  },

  get: function() {
    var deferred = $.Deferred();
    var image = new Image();
    var $image = $(image);
    $image.load(function() {
      deferred.resolve([image]);
    });
    $image.error(function() {
      deferred.reject(arguments);
    });
    image.src = this.url;

    return deferred.promise();
  }
});