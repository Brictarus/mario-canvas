var Entity = Drawable.extend({
	
	init: function(options) {
		this._super(options);
		this.velocity = new Vector(0, 0);
		this._maxSpeed = options.maxSpeed;
		this._friction = options.friction || 1.0;
		
		options.level && options.level.characters.push(this);
	},
	
	update: function(deltaT) {
		var v = this.velocity;
    var grounded = this.isOnGround();
    this.applyGravity(grounded);
		if (v.y > 0) {
			v.y = Math.min(v.y, 15);
		}
		
		/*var xCollider = this.velocity.x < 0 ? this.x + this.velocity.x : this.x;
		var yCollider = this.velocity.y < 0 ? this.y + this.velocity.y : this.y;
		var wCollider = this.w + Math.abs(this.velocity.x);
		var hCollider = this.h + Math.abs(this.velocity.y);
		var collidings = this.level.findCollidablesInRect([this], {
			x: xCollider, y: yCollider, w: wCollider, h: hCollider
		});*/
		
		//this.x += this.velocity.x;
		//this.y += this.velocity.y;
		
		var collidings = this.level.findCollidablesInRect([this], this);
		
		// a collision is detected
		if (collidings.length > 0) {
      var minXDistance = this.getShortestDistance(this.velocity.x, "AXISX", collidings);
      if (Math.abs(minXDistance) < Math.abs(this.velocity.x)) {
        this.velocity.x = 0;
      }
      this.x += minXDistance;
			this.dbgColor = "blue";
		} else {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
			this.dbgColor = "red";
		}
	},
  
  isOnGround: function() {
    var blocksUnderThis = this.level.findCollidablesInRect([this], {
      x: this.x,
      y: this.y + this.h,
      w: this.w,
      h: 1
    });
    return blocksUnderThis.length !== 0;
  },
  
  checkDir: function (speed, axis) {
    if (axis == 'AXISX') {
      if (speed < 0) {
        return 'WEST';
      } else if (speed > 0) {
        return 'EAST';
      }
    }
    else if (axis == 'AXISY') {
      if (speed < 0) {
        return 'NORTH';
      } else if (speed > 0) {
        return 'SOUTH';
      }
    }
  },
  
  getShortestDistance: function (speed, axis, collidings) {
    // Check which way the player is moving
    var front, minDistance;
    var dir = this.checkDir(speed, axis);
    if (dir == 'WEST')
      front = this.x;
    else if (dir == 'EAST')
      front = this.x + this.w;
    else if (dir == 'NORTH')
      front = this.y;
    else if (dir == 'SOUTH')
      front = this.y + this.height;
    
    // Calculate the minimum distance
    if (dir) {
      minDistance = this.calculateDistance(front, collidings, dir);
    } else {
      minDistance = 0;
    }
    // If the minumum distance is shorter than the player's delta,
    // move the player by that distance instead.
    if (this.checkCollision(speed, minDistance)) {
      return minDistance;
    } else {
      return speed;
    }
  },
  
  getShortestDistance2: function (speed, axis, collidings) {
    // Check which way the player is moving
    var front, minDistance;
    var dir = this.checkDir(speed, axis);
    if (dir == 'WEST')
      front = this.x;
    else if (dir == 'EAST')
      front = this.x + this.w;
    else if (dir == 'NORTH')
      front = this.y;
    else if (dir == 'SOUTH')
      front = this.y + this.height;
    
    // Calculate the minimum distance
    var linesToCheck = this.checkLines(axis, collidings);
    if (dir) {
      minDistance = this.calculateDistance(front, linesToCheck, dir);
    } else {
      minDistance = 0;
    }
    // If the minumum distance is shorter than the player's delta,
    // move the player by that distance instead.
    if (this.checkCollision(speed, minDistance)) {
      return minDistance;
    } else {
      return speed;
    }
  },
  
  checkCollision: function(speed, minDistance) {
    // If minumum X distance is shorter than the player's deltaX,
    // move the player by that distance instead.
    return (speed < 0 && minDistance > speed) ||
       (speed > 0 && minDistance < speed);
  },
  
  calculateDistance: function(coord, lines, dir) {
    var distances = [];
    /*if (dir == 'WEST' || dir == 'EAST') {
        playerTile = self.convert_pixel_to_level(coord, 0, level)[0]
    } else if (dir == 'NORTH' || dir == 'SOUTH') {
        playerTile = self.convert_pixel_to_level(0, coord, level)[1]
    }*/
    // Which blocks are scanned are dependent on which direction the player is moving in.
    if (dir == 'WEST') {
      /*for line in lines:
        nearestBlock = self.scan_line(line, playerTile, -1, -1, AXISX, level)
        distances.append(abs(nearestBlock * level.blockWidth + level.blockWidth - coord))*/
      lines.forEach(function(l) {
        //if  {
        var lRight = l.x + l.w;
        if (lRight == coord) {
          distances.push(0);
        } else if (lRight > coord) {
          distances.push(Math.abs(l.x + l.w - coord));
        }
        //}
      });
    } else if (dir == 'EAST') {
      /*  for line in lines:
            nearestBlock = self.scan_line(line, playerTile, level.levelWidth, 1, AXISX, level)
            distances.append(abs(nearestBlock * level.blockWidth - coord))
      */
      lines.forEach(function(l) {
        //if (coord <= l.x) {
        if (l.x == coord) {
          distances.push(0);
        } else {
          distances.push(Math.abs(l.x - coord));
        }
        //}
      }); 
    }
    // The function should return the shortest or longest distance 
    // depending on which direction the player was moving in.
    //var desiredValue = min(distances)
    var desiredValue = Math.min.apply(null, distances);
    if (dir == 'WEST' || dir == 'NORTH') {
      return desiredValue;
    } else if (dir == 'EAST' || dir == 'SOUTH') {
      return -desiredValue;
    }
  },
	
	applyGravity: function(grounded) {
		this.velocity.y += 1.8;
    if (grounded && this.velocity.y > 0) {
      this.velocity.y = 0;
    }
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