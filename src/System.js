'use strict';

var Entity = require('./Entity')

class System {

  constructor () {
    this.objectId = 0
    this.entities = {}
  }

  add (entity) {
    this.entities[ entity.id ] = entity
  }

  update () {
    for (let id in this.entities) {
      this.entities[id].update()
    }
  }

  mount (baseClass, methodName) {
    if (!methodName) { methodName = 'behave' }

    this.baseClass = baseClass
    this.methodName = methodName

    var system = this

    this.baseClass.prototype[ methodName ] = function(behaviourClass, options) {
      if (!this.__ENTITY__) {
        this.__ENTITY__ = new Entity(this, system.objectId++)
        system.add(this.__ENTITY__)
      }

      var args = Array.prototype.splice.apply(arguments, [1])
      this.__ENTITY__.attach(behaviourClass, args)
    }
  }

  destroy () {
    delete this.baseClass.prototype[ this.methodName ]
  }

}

module.exports = System
