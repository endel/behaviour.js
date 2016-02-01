(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ECS = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function E () {
	// Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
	on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Behaviour = (function () {
  function Behaviour() {
    _classCallCheck(this, Behaviour);

    this.entity = null;
    this.object = null;

    this._callbacks = [];
  }

  _createClass(Behaviour, [{
    key: 'attach',
    value: function attach(entity) {
      this.entity = entity;
      this.object = entity.object;
    }
  }, {
    key: 'onAttach',
    value: function onAttach(options) {}
  }, {
    key: 'onDetach',
    value: function onDetach() {}
  }, {
    key: 'detach',
    value: function detach() {
      this.emit('detach', this);

      // clear all callbacks this behaviour registered
      for (var i = 0; i < this._callbacks.length; i++) {
        this.off.apply(this, this._callbacks[i]);
      }
    }

    // delegate EventEmitter events from it's Entity

  }, {
    key: 'on',
    value: function on() {
      this._callbacks.push(arguments);
      this.entity.on.apply(this.entity, arguments);
    }
  }, {
    key: 'once',
    value: function once() {
      this._callbacks.push(arguments);
      this.entity.once.apply(this.entity, arguments);
    }
  }, {
    key: 'off',
    value: function off() {
      this.entity.off.apply(this.entity, arguments);
    }
  }, {
    key: 'emit',
    value: function emit() {
      this.entity.emit.apply(this.entity, arguments);
    }
  }]);

  return Behaviour;
})();

module.exports = Behaviour;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('tiny-emitter');

var Entity = (function (_EventEmitter) {
  _inherits(Entity, _EventEmitter);

  function Entity(object, id) {
    _classCallCheck(this, Entity);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Entity).call(this));

    _this.id = id;
    _this.object = object;

    _this.behaviours = [];
    _this.on('detach', _this.detach.bind(_this));
    return _this;
  }

  _createClass(Entity, [{
    key: 'getBehaviour',
    value: function getBehaviour(nameOrClass) {
      var isName = typeof nameOrClass === "string",
          filterByName = function filterByName(b) {
        return b.constructor.name === nameOrClass;
      },
          filterByClass = function filterByClass(b) {
        return b.constructor.name === nameOrClass.name;
      };
      return this.behaviours.filter(isName ? filterByName : filterByClass)[0];
    }
  }, {
    key: 'attach',
    value: function attach(behaviour, args) {
      this.behaviours.push(behaviour);

      behaviour.attach(this);
      behaviour.onAttach.apply(behaviour, args);
    }
  }, {
    key: 'detach',
    value: function detach(behaviour) {
      var index = this.behaviours.indexOf(behaviour);

      if (index !== -1) {
        this.behaviours.splice(index, 1);
        behaviour.onDetach();
      }
    }
  }, {
    key: 'detachAll',
    value: function detachAll() {
      var i = this.behaviours.length;
      while (i--) {
        this.detach(this.behaviours[i]);
      }
    }
  }, {
    key: 'update',
    value: function update() {
      var i = this.behaviours.length;
      while (i--) {
        if (this.behaviours[i].update) {
          this.behaviours[i].update();
        }
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.detachAll();
      this.emit('destroy');
    }
  }]);

  return Entity;
})(EventEmitter);

module.exports = Entity;

},{"tiny-emitter":1}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = require('./Entity');

var System = (function () {
  function System() {
    _classCallCheck(this, System);

    this.objectId = 0;
    this.entities = {};
  }

  _createClass(System, [{
    key: 'add',
    value: function add(entity) {
      this.entities[entity.id] = entity;
      entity.on('destroy', this.onEntityDestroy.bind(this, entity));
    }
  }, {
    key: 'update',
    value: function update() {
      for (var id in this.entities) {
        this.entities[id].update();
      }
    }
  }, {
    key: 'mount',
    value: function mount(baseClass) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (!options.addBehaviour) options.addBehaviour = 'addBehaviour';
      if (!options.getEntity) options.getEntity = 'getEntity';

      this.baseClass = baseClass;
      this.mountOptions = options;

      var system = this;

      this.baseClass.prototype[options.getEntity] = function () {
        if (!this.__ENTITY__) {
          this.__ENTITY__ = new Entity(this, system.objectId++);
          system.add(this.__ENTITY__);
        }
        return this.__ENTITY__;
      };

      this.baseClass.prototype[options.addBehaviour] = function (behaviourClass) {
        var entity = this[options.getEntity]();

        var args = Array.prototype.splice.apply(arguments, [1]);
        entity.attach(behaviourClass, args);

        return entity;
      };
    }
  }, {
    key: 'onEntityDestroy',
    value: function onEntityDestroy(entity) {
      delete this.entities[entity.id];
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      delete this.baseClass.prototype[this.mountOptions.addBehaviour];
      delete this.baseClass.prototype[this.mountOptions.getEntity];
    }
  }]);

  return System;
})();

module.exports = System;

},{"./Entity":3}],5:[function(require,module,exports){
'use strict';

var Behaviour = require('./Behaviour'),
    System = require('./System');

module.exports.createComponentSystem = function createComponentSystem(klass) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var system = new System();
  system.mount(klass, options);
  return system;
};

module.exports.Behaviour = Behaviour;

},{"./Behaviour":2,"./System":4}]},{},[5])(5)
});