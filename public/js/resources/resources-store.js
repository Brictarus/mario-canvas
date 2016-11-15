var ResourcesStore = Class.extend({
  init: function(options) {
    this.name = options.name;
    this.arr = [];
    this.index = {};
  },

  addResource: function(resource) {
    if (this.index[resource.key] !== undefined) {
      console.warn('The resource "' + resource.key + '" already exists in store "' + this.name + '"');
    }
    else {
      this.arr.push(resource);
      this.index[resource.key] = resource;
    }
  },

  addResources: function(resources) {
    resources.forEach( r => this.addResource(r));
  },

  getResource: function(key) {
    return this.index[key];
  },

  hasResource: function(key) {
    return !!this.index[key];
  }
});