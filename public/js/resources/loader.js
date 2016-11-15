var ResourceLoader = Class.extend({
  init: function (resourcesArr) {
    this._toLoad = resourcesArr.slice(0);
  },

  get: function () {
    if (this._toLoad.length === 0) {
      throw 'empty resourceLoader !'
    }

    var deferred = $.Deferred();

    var urls = this._toLoad.map(dl => dl.get());
    if (urls.length === 1) {
      urls.push(this.doNothingPromise())
    }

    $.when.apply($, urls)
        .then(function () {
          for (var i = 0; i < this._toLoad.length; i++) {
            this._toLoad[i].data = arguments[i][0];
          }
          deferred.resolve(this._toLoad);
        }.bind(this)).fail(function (e) {
          deferred.reject(e);
        });

    return deferred.promise();
  },

  doNothingPromise: function() {
    var deferred = $.Deferred();
    deferred.resolve(null);
    return deferred.promise();
  }
});