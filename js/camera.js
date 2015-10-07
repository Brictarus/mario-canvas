var Camera = function(x, y, viewport_w, viewport_h, zoom, max_x, max_y) {
	this.world_x = x;
	this.world_y = y;
	this.viewport_w = viewport_w;
	this.viewport_h = viewport_h;
	this.max_x = max_x;
	this.max_y = max_y;
	this.setZoom(zoom);
};
/**
 * Déplace la caméra d'un certain offset sur l'axe X
 */
Camera.prototype.moveX = function(offset) {
	this.world_x += offset;
	this.x = this.world_x * this.zoom
	return this;
};
/**
 * Place la caméra en une certaine position sur l'axe X
 */
Camera.prototype.moveXTo = function(x) {
	this.world_x = x;
	this.x = this.world_x * this.zoom
	return this;
};
/**
 * Déplace la caméra d'un certain offset sur l'axe Y
 */
Camera.prototype.moveY = function(offset) {
	this.world_y += offset;
	this.y = this.world_y * this.zoom;
	return this;
};
/**
 * Place la caméra en une certaine position sur l'axe X
 */
Camera.prototype.moveYTo = function(y) {
	this.world_y = y;
	this.y = this.world_y * this.zoom
	return this;
};
/**
 * Définit le niveau de zoom de la caméra sur le monde
 */
Camera.prototype.setZoom = function(zoom) {
	this.zoom = zoom;
	this.x = this.world_x * this.zoom;
	this.y = this.world_y * this.zoom;
	this.world_w = this.viewport_w / this.zoom;
	this.world_h = this.viewport_h / this.zoom;
};
/**
 * Empêche la caméra de sortir des limites du monde
 */
Camera.prototype.clamp = function() {
	if (this.world_x < 0 || this.max_x < this.world_w) {
		this.moveXTo(0);
	} else if (this.world_x + this.world_w - this.max_x > 0) {
		this.moveXTo(this.max_x - this.world_w);
	}
	if (this.world_y < 0 || this.max_y < this.world_h) {
		this.moveYTo(0);
	}  else if (this.world_y + this.world_h - this.max_y > 0) {
		this.moveYTo(this.max_y - this.world_h);
	}
	return this;
};
/**
 * Déplace la caméra sur un point du monde. Ce point est placé au centre de 
 * la nouvelle position de la caméra
 */
Camera.prototype.centerOn = function (x, y) {
	this.moveXTo(~~(x - this.world_w / 2));
	this.moveYTo(~~(y - this.world_h / 2));
	return this;
};

Camera.prototype.isVisible = function(entity){
	return overlap(entity, { 
		x: this.world_x, y: this.world_y,
		w : this.world_w, h: this.world_h
	});
};

Camera.prototype.setLevel = function(level){
	this.level = level;
}
