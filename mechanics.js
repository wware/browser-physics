/*
 * Fundamental units:
 * Times are in seconds.
 * Distances are in meters.
 * Masses are in kilograms.
 *
 * Derived units:
 * Energy is in joules.
 * Force is in newtons.
 * Spring constants are in newtons per meter.
 *
 * Full rigid-body mechanics with tensors and rotational inertia and everything
 * http://www.mare.ee/indrek/varphi/vardyn.pdf
 */

function toString(obj) {
    var str;
    try {
        return obj._toString();
    }
    catch (e) { }
    if ((typeof obj) === 'string')
        // TODO: escape all internal double-quotes with backslashes
        return '"' + obj + '"';
    if (obj instanceof Array) {
        str = "[";
        var first = true;
        for (var i in obj) {
            if (first) {
                first = false;
            } else {
                str += ",";
            }
            var x = "" + toString(obj[i]);
            str += x;
        }
        return str + "]";
    }
    if (obj instanceof Object) {
        str = "{";
        var first = true;
        for (key in obj) {
            if (first) {
                first = false;
            } else {
                str += ",";
            }
            var x = toString(key);
            var y = toString(obj[key]);
            str += x + ":" + y;
        }
        return str + "}";
    }
    try {
        return '' + obj;
    }
    catch (e) { }
    return "" + obj;
}

function extend(base,additional) {
    var r = { };
    for (key in base) {
        r[key] = base[key];
    }
    for (key in additional) {
        r[key] = additional[key];
    }
    return r;
}

/*
 * * * * * * * * * * * * * * VECTORS IN 3-SPACE * * * * * * * * * * * * * *
 */

var vector2Prototype = {
    _toString: function() {
        return "(" + this.x + " " + this.y + " " + ")";
    },
    copy: function(other) {
        return Vector2(this.x, this.y);
    },
    add: function(other) {
        return Vector2(this.x + other.x,
                       this.y + other.y);
    },
    subtract: function(other) {
        return Vector2(this.x - other.x,
                       this.y - other.y);
    },
    negate: function() {
        return Vector2(-this.x, -this.y);
    },
    scale: function(factor) {
        return Vector2(this.x * factor,
                       this.y * factor);
    },
    normalize: function(factor) {
        return this.scale(1.0 / this.length());
    },
    dotProduct: function(other) {
        return this.x * other.x + this.y * other.y;
    },
    distsq: function(other) {
        var dx = this.x - other.x;
        var dy = this.y - other.y;
        return dx * dx + dy * dy;
    },
    lensq: function() {
        var x = this.x;
        var y = this.y;
        return x * x + y * y;
    },
    length: function() {
        return Math.sqrt(this.lensq());
    }
};

function vector2Constructor() { }
vector2Constructor.prototype = vector2Prototype;

function Vector2(x, y) {
    inst = new vector2Constructor();
    inst.x = (x === undefined) ? 0.0 : x;
    inst.y = (y === undefined) ? 0.0 : y;
    return inst;
}

/*
 * * * * * * * * * * * * * * VECTORS IN 3-SPACE * * * * * * * * * * * * * *
 */

var vectorPrototype = {
    _toString: function() {
        return "(" + this.x + " " + this.y + " " + this.z + ")";
    },
    copy: function(other) {
        return Vector(this.x, this.y, this.z);
    },
    add: function(other) {
        return Vector(this.x + other.x,
                      this.y + other.y,
                      this.z + other.z);
    },
    subtract: function(other) {
        return Vector(this.x - other.x,
                      this.y - other.y,
                      this.z - other.z);
    },
    negate: function() {
        return Vector(-this.x, -this.y, -this.z);
    },
    scale: function(factor) {
        return Vector(this.x * factor,
                      this.y * factor,
                      this.z * factor);
    },
    normalize: function(factor) {
        return this.scale(1.0 / this.length());
    },
    dotProduct: function(other) {
        return this.x * other.x +
        this.y * other.y +
        this.z * other.z;
    },
    crossProduct: function(other) {
        return Vector(this.y * other.z - other.y * this.z,
                      this.z * other.x - other.z * this.x,
                      this.x * other.y - other.x * this.y);
    },
    multiplyQuaternion: function(other) {
        return Quaternion(0.0, this).multiply(other);
    },
    distsq: function(other) {
        var dx = this.x - other.x;
        var dy = this.y - other.y;
        var dz = this.z - other.z;
        return dx * dx + dy * dy + dz * dz;
    },
    lensq: function() {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        return x * x + y * y + z * z;
    },
    length: function() {
        return Math.sqrt(this.lensq());
    }
};

function vectorConstructor() { }
vectorConstructor.prototype = vectorPrototype;

function Vector(x,y,z) {
    inst = new vectorConstructor();
    inst.x = (x === undefined) ? 0.0 : x;
    inst.y = (y === undefined) ? 0.0 : y;
    inst.z = (z === undefined) ? 0.0 : z;
    return inst;
}

/*
 * * * * * * * * * * * * * * QUATERNIONS * * * * * * * * * * * * * *
 */

var quaternionPrototype = {
    _toString: function() {
        return "(Quat " + this.getReal() + " " + this.getImaginary() + ")";
    },
    add: function(other) {
        return Quaternion(this.getReal() + other.getReal(),
                          this.getImaginary().add(other.getImaginary()));
    },
    subtract: function(other) {
        return Quaternion(this.getReal() - other.getReal(),
                          this.getImaginary()
                          .subtract(other.getImaginary()));
    },
    multiply: function(other) {
        var a = this.getReal();
        var im = this.getImaginary();
        var b = im.x, c = im.y, d = im.z;
        var e = other.getReal();
        im = other.getImaginary();
        var f = im.x, g = im.y, h = im.z;
        return Quaternion(a*e - b*f - c*g - d*h,
                          Vector(a*f + b*e + c*h - d*g,
                                 a*g - b*h + c*e + d*f,
                                 a*h + b*g - c*f + d*e));
    },
    multiplyVector: function(other) {
        return this.multiply(Quaternion(0.0, other));
    },
    inverse: function() {
        var k = 1.0 / this.absoluteValueSquared();
        return Quaternion(k * this.getReal(), this.getImaginary().scale(-k));
    },
    conjugate: function() {
        return Quaternion(this.getReal(), this.getImaginary().negate());
    },
    divide: function(other) {
        return this.multiply(other.inverse());
    },
    absoluteValueSquared: function() {
        var re = this.getReal();
        var imlensq = this.getImaginary().lensq();
        return re * re + imlensq;
    },
    absoluteValue: function() {
        return Math.sqrt(this.absoluteValueSquared());
    },
    scale: function(k) {
        return Quaternion(k * this.getReal(), this.getImaginary().scale(k));
    },
    negate: function() {
        return this.scale(-1);
    },
    normalize: function() {
        return this.scale(1.0 / this.absoluteValue());
    },
    rotate: function(v) {  // rotate a vector
        var h = 1.0e-6;
        var avs = this.absoluteValueSquared();
        var q = this;
        if (avs < 1.0 - h || avs > 1.0 + h) {
            q = q.scale(1 / Math.sqrt(avs));
        }
        return q.multiplyVector(v).multiply(q.inverse()).getImaginary();
    }
};

function Quaternion(re, im) {
    function q() {
        this.getReal = function() {
            return re;
        };
        this.getImaginary = function() {
            return im;
        };
    }
    q.prototype = quaternionPrototype;
    return new q();
}

function makeRotator(theta, axis) {
    return Quaternion(Math.cos(0.5 * theta),
                      axis.scale(Math.sin(0.5 * theta) / axis.length()));
}

/*
 * * * * * * * * * * * * * * MASS * * * * * * * * * * * * * *
 */

var pointMassPrototype = {
    _toString: function() {
        return "(Mass " + this.getPosition() + ")";
    },

    init: function(dimensions) {
        if (dimensions === 2) {
            this._vector = Vector2;
        } else {
            this._vector = Vector;
        }
        this._state = [];
        this._past_states = [];
    },

    setMass: function(m) {
        this._mass = m;
    },

    getMass: function() {
        return this._mass;
    },

    // state is two vectors, momentum and position
    // momentum divided by mass gives velocity
    // applied force is the rate of change of momentum
    getState: function() {
        return this._state;
    },

    getPosition: function() {
        return this._position;
    },

    shiftPositions: function() {
        // only call this function once per simulation time step
        if (this._position) {
            this._past_positions = this._past_positions.slice(1, 4);
            this._past_positions.push(this._position);
        }
    },

    move: function(v) {
        this._position = this._position.add(v);
    },

    setForce: function(v) {
        this._force = v;
    },

    getForce: function() {
        return this._force;
    },

    addForce: function(v) {
        if (this._force === undefined)
            this._force = v;
        else {
            this._force.x += v.x;
            this._force.y += v.y;
            this._force.z += v.z;
        }
    },

    zeroForce: function(v) {
        this._force = Vector(0, 0, 0);
    },

    getPreviousPositions: function() {
        return this._past_positions;
    },

    getPreviousPosition: function() {
        var pp = this._past_positions;
        return pp[pp.length - 1];
    },

    verletStep: function(dt, dampingCoeff) {
        // http://en.wikipedia.org/wiki/Verlet_integration
        var pos = this._position, prev = this._previous;
        // dampingCoeff negative: colder, positive: hotter
        var x = pos.x + (1.0 + dampingCoeff) * (pos.x - prev.x);
        var y = pos.y + (1.0 + dampingCoeff) * (pos.y - prev.y);
        var z = pos.z + (1.0 + dampingCoeff) * (pos.z - prev.z);
        var a = dt * dt / this.getMass();
        var f = this._force;
        this._position = Vector(x + a * f.x,
                                y + a * f.y,
                                z + a * f.z);
        this._previous = pos;
    },

    kineticEnergy: function(dt) {
        var pos = this._position, prev = this._previous;
        var dx = pos.x - prev.x;
        var dy = pos.y - prev.y;
        var dz = pos.z - prev.z;
        return 0.5 * this.getMass() * (dx*dx + dy*dy + dz*dz) / (dt*dt);
    }
};

function pointMassConstructor() { }
pointMassConstructor.prototype = pointMassPrototype;

function PointMass(m, pos, dimensions) {
    inst = new pointMassConstructor();
    inst._mass = (m === undefined) ? 0.0 : m;
    inst._position = (pos === undefined) ? 0.0 : pos;
    return inst;
}


/*
 * Future stuff: spring (two points in space, spring constant)
 * Points might be anchored to point masses.
 */
