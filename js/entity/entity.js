var Entity = Drawable.extend({

  init: function(options) {
    this._super(options);
    this.velocity = new Vector(0, 0);
    this._maxSpeed = options.maxSpeed;
    this._friction = options.friction || 1.0;
    this.grounded = false;
    options.level && options.level.characters.push(this);
  },

  update: function(deltaT) {
    var v = this.velocity;
    this.grounded = this.isOnGround();
    this.applyGravity(this.grounded);

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    var collidings = this.level.findCollidablesInRect([this], this);

    // a collision is detected
    if (collidings.length > 0) {
      /*var minXDistance = this.getShortestDistance(this.velocity.x, "AXISX", collidings);
      var minYDistance = this.getShortestDistance(this.velocity.y, "AXISY", collidings);
      if (minXDistance !== null) {
        this.velocity.x = 0;
      }
      if (minYDistance !== null) {
        this.velocity.y = 0;
      }
      var absX = minXDistance == null ? Infinity : Math.abs(minXDistance);
      var absY = minYDistance == null ? Infinity : Math.abs(minYDistance);
      if (minXDistance !== null && minYDistance && MathUtils.almostEquals(absX, absY)) {
        this.x += minXDistance;
        this.y += minYDistance;
      } else {
        if (absX < absY && minXDistance != null) {
          this.x += minXDistance;
        } else if (minYDistance != null) {
          this.y += minYDistance;
        }
      }*/
      var resolver = new CollisionSolver();
      for (var i = 0; i < collidings.length; i++) {
        var c = collidings[i];
        //resolver.resolveElastic(this, c);
        resolver.resolveDisplacement(this, c);
      }
      this.dbgColor = "blue";
    } else {
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

  checkDir: function(speed, axis) {
    if (axis == 'AXISX') {
      if (speed < 0) {
        return 'WEST';
      } else if (speed > 0) {
        return 'EAST';
      }
    } else if (axis == 'AXISY') {
      if (speed < 0) {
        return 'NORTH';
      } else if (speed > 0) {
        return 'SOUTH';
      }
    }
  },

  getShortestDistance: function(speed, axis, collidings) {
    // Check which way the player is moving
    var front, minDistance;
    var dir = this.checkDir(speed, axis);
    if (!dir) {
      return null;
    }

    switch (dir) {
      case 'WEST':
        front = this.x;
        break;
      case 'EAST':
        front = this.x + this.w;
        break;
      case 'NORTH':
        front = this.y;
        break;
      case 'SOUTH':
        front = this.y + this.h;
        break;
    }

    collidings = this.filterOnAxis(front, collidings, dir);
    // Calculate the minimum distance
    minDistance = this.calculateDistanceBis(front, collidings, dir);
    // If the minumum distance is shorter than the player's delta,
    // move the player by that distance instead.
    /*if (this.checkCollision(speed, minDistance)) {
      return minDistance;
    } else {
      return speed;
    }*/
    return minDistance;
  },

  filterOnAxis: function(coord, lines, dir) {
    var distances = [];
    if (dir == 'WEST') {
      lines.forEach(function(l) {
        var lRight = l.x + l.w;
        if (lRight > coord + MathUtils.EPSILON) {
          distances.push(lRight - coord);
        }
      });
    } else if (dir == 'EAST') {
      lines.forEach(function(l) {
        if (l.x + MathUtils.EPSILON < coord) {
          distances.push(l.x - coord);
        }
      });
    } else if (dir == 'NORTH') {
      lines.forEach(function(l) {
        var lBottom = l.y + l.h;
        if (lBottom > coord + MathUtils.EPSILON) {
          distances.push(Math.abs(lBottom - coord));
        }
      });
    } else if (dir == 'SOUTH') {
      lines.forEach(function(l) {
        if (l.y + MathUtils.EPSILON < coord) {
          distances.push(Math.abs(l.y - coord));
        }
      });
    }
    return distances;
  },

  checkCollision: function(speed, minDistance) {
    // If minumum X distance is shorter than the player's deltaX,
    // move the player by that distance instead.
    return (speed < 0 && minDistance > speed) ||
      (speed > 0 && minDistance < speed);
  },

  calculateDistanceBis: function(coord, distances, dir) {
    var test = distances.map(i => Math.abs(i));
    if (test.length === 0) {
      return null;
    }
    // The function should return the shortest or longest distance 
    // depending on which direction the player was moving in.
    //var desiredValue = min(distances)
    var desiredValue = Math.min.apply(null, test);
    if (dir == 'WEST' || dir == 'NORTH') {
      return desiredValue;
    } else if (dir == 'EAST' || dir == 'SOUTH') {
      return -desiredValue;
    }
  },

  calculateDistance: function(coord, lines, dir) {
    var distances = [];
    // Which blocks are scanned are dependent on which direction the player is moving in.
    if (dir == 'WEST') {
      lines.forEach(function(l) {
        var lRight = l.x + l.w;
        if (MathUtils.almostEquals(lRight, coord)) {
          distances.push(0);
        } else if (lRight > coord) {
          distances.push(Math.abs(lRight - coord));
        }
      });
    } else if (dir == 'EAST') {
      lines.forEach(function(l) {
        if (MathUtils.almostEquals(l.x, coord)) {
          distances.push(0);
        } else {
          distances.push(Math.abs(l.x - coord));
        }
      });
    } else if (dir == 'NORTH') {
      lines.forEach(function(l) {
        var lBottom = l.y + l.h;
        if (MathUtils.almostEquals(lBottom, coord)) {
          distances.push(0);
        } else {
          distances.push(Math.abs(lBottom - coord));
        }
      });
    } else if (dir == 'SOUTH') {
      lines.forEach(function(l) {
        if (MathUtils.almostEquals(l.y, coord)) {
          distances.push(0);
        } else {
          distances.push(Math.abs(l.y - coord));
        }
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
    this.velocity.y += 1;
    if (grounded && this.velocity.y > 0) {
      this.velocity.y = 0;
    }
  }
});