var CollisionDetector = function() {};
CollisionDetector.prototype.collideRect = function(collider, collidee) {
	// Store the collider and collidee edges
	var l1 = collider.getLeft();
	var t1 = collider.getTop();
	var r1 = collider.getRight();
	var b1 = collider.getBottom();

	var l2 = collidee.getLeft();
	var t2 = collidee.getTop();
	var r2 = collidee.getRight();
	var b2 = collidee.getBottom();

	return !(b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2);
};

var STICKY_THRESHOLD = 0.0004;
var CollisionSolver = function() {};

CollisionSolver.prototype.resolve = function(entity1, entity2) {
	var internalSolver = this._getResolverMethod(entity2);
	var response = internalSolver(entity1, entity2);
};

CollisionSolver.prototype._getResolverMethod = function(entity) {
	if (entity.collisionType == "elastic") {
		return this.resolveElastic;
	} else {
		return this.resolveDisplacement;
	}
};

CollisionSolver.prototype.resolveDisplacement = function(entity1, entity2) {
	// Find the mid points of the entity2 and entity1
	var pMidX = entity1.getMidX();
	var pMidY = entity1.getMidY();
	var aMidX = entity2.getMidX();
	var aMidY = entity2.getMidY();

	// To find the side of entry calculate based on
	// the normalized sides
	var dx = (aMidX - pMidX) / entity2.halfWidth;
	var dy = (aMidY - pMidY) / entity2.halfHeight;

	// Calculate the absolute change in x and y
	var absDX = Math.abs(dx);
	var absDY = Math.abs(dy);

	// If the distance between the normalized x and y
	// position is less than a small threshold (.1 in this case)
	// then this object is approaching from a corner
	if (Math.abs(absDX - absDY) < .001) {
		// If the entity1 is approaching from positive X
		if (dx < 0) {
			// Set the entity1 x to the right side
			entity1.x = entity2.getRight();

			// If the entity1 is approaching from negative X
		} else {
			// Set the entity1 x to the left side
			entity1.x = entity2.getLeft() - entity1.w;
		}

		// If the entity1 is approaching from positive Y
		if (dy < 0) {
			// Set the entity1 y to the bottom
			entity1.y = entity2.getBottom();

			// If the entity1 is approaching from negative Y
		} else {
			// Set the entity1 y to the top
			entity1.y = entity2.getTop() - entity1.h;
		}

		// Randomly select a x/y direction to reflect velocity on
		if (Math.random() < .5) {
			entity1.velocity.x = 0;

		} else {
			entity1.velocity.y = 0;
		}

		// If the object is approaching from the sides
	} else if (absDX > absDY) {
		// If the entity1 is approaching from positive X
		if (dx < 0) {
			entity1.x = entity2.getRight();
		} else {
			// If the entity1 is approaching from negative X
			entity1.x = entity2.getLeft() - entity1.w;
		}
		// Velocity component
		entity1.velocity.x = 0;

		// If this collision is coming from the top or bottom more
	} else {
		// If the entity1 is approaching from positive Y
		if (dy < 0) {
			entity1.y = entity2.getBottom();
		} else {
			// If the entity1 is approaching from negative Y
			entity1.y = entity2.getTop() - entity1.h;
		}

		// Velocity component
		entity1.velocity.y = 0;
	}
};

CollisionSolver.prototype.resolveElastic = function(entity1, entity2) {
	// Find the mid points of the entity2 and entity1
	var pMidX = entity1.getMidX();
	var pMidY = entity1.getMidY();
	var aMidX = entity2.getMidX();
	var aMidY = entity2.getMidY();

	// To find the side of entry calculate based on
	// the normalized sides
	var dx = (aMidX - pMidX) / entity2.halfWidth;
	var dy = (aMidY - pMidY) / entity2.halfHeight;

	// Calculate the absolute change in x and y
	var absDX = Math.abs(dx);
	var absDY = Math.abs(dy);

	// If the distance between the normalized x and y
	// position is less than a small threshold (.1 in this case)
	// then this object is approaching from a corner
	if (Math.abs(absDX - absDY) < .001) {
		// If the entity1 is approaching from positive X
		if (dx < 0) {
			// Set the entity1 x to the right side
			entity1.x = entity2.getRight();

			// If the entity1 is approaching from negative X
		} else {
			// Set the entity1 x to the left side
			entity1.x = entity2.getLeft() - entity1.w;
		}

		// If the entity1 is approaching from positive Y
		if (dy < 0) {
			// Set the entity1 y to the bottom
			entity1.y = entity2.getBottom();

			// If the entity1 is approaching from negative Y
		} else {
			// Set the entity1 y to the top
			entity1.y = entity2.getTop() - entity1.h;
		}

		// Randomly select a x/y direction to reflect velocity on
		if (Math.random() < .5) {
			// Reflect the velocity at a reduced rate
			entity1.velocity.x = -entity1.velocity.x * entity2.restitution;

			// If the object's velocity is nearing 0, set it to 0
			// STICKY_THRESHOLD is set to .0004
			if (Math.abs(entity1.vx) < STICKY_THRESHOLD) {
				entity1.velocity.x = 0;
			}
		} else {
			entity1.velocity.y = -entity1.velocity.y * entity2.restitution;
			if (Math.abs(entity1.velocity.y) < STICKY_THRESHOLD) {
				entity1.vy = 0;
			}
		}

		// If the object is approaching from the sides
	} else if (absDX > absDY) {
		// If the entity1 is approaching from positive X
		if (dx < 0) {
			entity1.x = entity2.getRight();
		} else {
			// If the entity1 is approaching from negative X
			entity1.x = entity2.getLeft() - entity1.w;
		}
		// Velocity component
		entity1.velocity.x = -entity1.velocity.x * entity2.restitution;
		if (Math.abs(entity1.velocity.x) < STICKY_THRESHOLD) {
			entity1.velocity.x = 0;
		}

		// If this collision is coming from the top or bottom more
	} else {
		// If the entity1 is approaching from positive Y
		if (dy < 0) {
			entity1.y = entity2.getBottom();
		} else {
			// If the entity1 is approaching from negative Y
			entity1.y = entity2.getTop() - entity1.h;
		}

		// Velocity component
		entity1.velocity.y = -entity1.velocity.y * entity2.restitution;
		if (Math.abs(entity1.velocity.y) < STICKY_THRESHOLD) {
			entity1.velocity.y = 0;
		}
	}
};