var gravity = 0.8;

var Entity = Drawable.extend({

  init: function (options) {
    this._super(options);
    this.velocity = new Vector(0, 0);
    this._maxSpeed = options.maxSpeed;
    this._friction = options.friction || 1.0;

    options.level && options.level.characters.push(this);
  },

  update: function (deltaT) {
    this.applyGravity();
    var v = this.velocity;
    if (v.y > 0) {
      v.y = Math.min(v.y, 40);
    }

    this.resolveCollision();
    if (this.onGround && this.velocity.y > 0) {
      this.velocity.y = 0;
    }
  },

  applyGravity: function () {
    this.velocity.y = this.velocity.y + gravity;
  },

  resolveCollision: function () {
    this.resolveXaxis();
    this.resolveYaxis();
  },

  resolveXaxis : function () {
    var vx = this.velocity.x;
    if (vx == 0) return;
    var rectX = this.getCollisionRectX();
    var collidings = this.level.findCollidablesInRect([this], rectX).filter(el => {
      return (el.y !== (this.y + this.h) && (el.y + el.h !== this.y));
    });
    var sort;
    if (!collidings || collidings.length === 0) {
      this.x += vx;
      return;
    }
    if (vx > 0) {
      sort = function (a, b) { return a.x < b.x };
    } else if (vx < 0) {
      sort = function (a, b) { return (b.x + b.w) > (a.x + a.w) };
    }

    var sortedX = collidings.sort(sort);
    var first = sortedX[0];
    var t;
    if (vx > 0) {
      t = Math.min(first.x, this.x + this.w + vx);
      this.x = t - this.w;
    } else {
      t = Math.max(first.x + first.w, this.x + vx);
      this.x = t;
    }
  },

  resolveYaxis: function () {
    var vy = this.velocity.y;
    if (vy == 0) return;
    var rectY = this.getCollisionRectY();
    var collidings = this.level.findCollidablesInRect([this], rectY).filter(el => {
      return (el.x !== (this.x + this.w) && (el.x + el.w !== this.x));
    });
    var sort;
    if (!collidings || collidings.length === 0) {
      this.y += vy;
      this.onGround = false;
      return;
    }
    if (vy > 0) {
      sort = function (a, b) {
        return a.y < b.y
      };
    } else if (vy < 0) {
      sort = function (a, b) {
        return (b.y + b.h) > (a.y + a.h)
      };
    }

    var sortedY = collidings.sort(sort);
    var first = sortedY[0];
    var t;
    if (vy > 0) {
      var nextBottomPos = this.y + this.h + vy;
      t = Math.min(first.y, nextBottomPos);
      this.onGround = (first.y <= nextBottomPos);
      // When falling from too high, the player bounces and loose x velocity (kind of quick stun)
      if (this.onGround && vy > gravity * 30) {
        this.velocity.y = -vy/3;
        this.velocity.x = 0;
        this.onGround = false;
      } else {
        this.velocity.y = 0;
      }
      this.y = t - this.w;
    } else {
      t = Math.max(first.y + first.h, this.y + vy);
      // When the player hit the top, decrease speed for smoother effect
      if (first.y + first.h > this.y + vy) {
        this.velocity.y = vy * 4 / 5;
      }
      this.y = t;
    }
  },

  getCollisionRectX: function () {
    var vx = this.velocity.x;
    if (vx > 0) {
      return {
        x: this.x + this.w, y: this.y,
        w: Math.abs(vx), h: this.h
      };
    } else if (vx < 0) {
      return {
        x: this.x + vx, y: this.y,
        w: Math.abs(vx), h: this.h
      };
    } else {
      return null;
    }
  },

  getCollisionRectY: function () {
    var vy = this.velocity.y;
    if (vy > 0) {
      return {
        x: this.x, y: this.y + this.h,
        w: this.w, h: Math.abs(vy)
      };
    } else if (vy < 0) {
      return {
        x: this.x, y: this.y + vy,
        w: this.w, h: Math.abs(vy)
      };
    } else {
      return null;
    }
  }

});