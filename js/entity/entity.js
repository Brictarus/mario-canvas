var Entity = Drawable.extend({
	
	init: function(options) {
		this._super(options);
		this.velocity = new Vector(0, 0);
		this._maxSpeed = options.maxSpeed;
		this._friction = options.friction || 1.0;
		
		options.level && options.level.characters.push(this);
	},
	
	update: function(deltaT) {
		this.applyGravity();
		var v = this.velocity;
		if (v.y > 0) {
			v.y = Math.min(v.y, 15);
		}
		
		var xCollider = this.velocity.x < 0 ? this.x + this.velocity.x : this.x;
		var yCollider = this.velocity.y < 0 ? this.y + this.velocity.y : this.y;
		var wCollider = this.w + Math.abs(this.velocity.x);
		var hCollider = this.h + Math.abs(this.velocity.y);
		/*var collidings = this.level.findCollidablesInRect([this], {
			x: xCollider, y: yCollider, w: wCollider, h: hCollider
		});*/
		
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
		var collidings = this.level.findCollidablesInRect([this], this);
		
		// a collision is detected
		if (collidings.length > 0) {
			this.resolveCollisionV2(collidings);
			this.dbgColor = "blue";
		} else {
			this.dbgColor = "red";
		}
	},
	
	applyGravity: function() {
		this.velocity.y += 1.8;
	},
	
	resolveCollisionOnYAxis: function() {
		
	},
	
	resolveCollisionV2: function(collidings) {
		var isOnGround = false;
		var previousBottom = this.y + this.h;
		for(var i in collidings) {
			var c = collidings[i];
			var depth = getIntersectionDepth(this, c);
			if (depth != Vector.Zero) {
				var absDepthX = Math.abs(depth.x);
				var absDepthY = Math.abs(depth.y);

				// Resolve the collision along the shallow axis.
				if (absDepthY > absDepthX)  {
					this.y += depth.y;
				}
				else {
					this.x += depth.x;
				}
			}
		}
	}
	
});