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

  mount (baseClass, options = {}) {
    if (!options.addBehaviour) options.addBehaviour = 'addBehaviour'
    if (!options.getEntity) options.getEntity = 'getEntity'

    this.baseClass = baseClass
    this.mountOptions = options

    var system = this

    this.baseClass.prototype[ options.getEntity ] = function() {
      if (!this.__ENTITY__) {
        this.__ENTITY__ = new Entity(this, system.objectId++)
        system.add(this.__ENTITY__)
      }
      return this.__ENTITY__
    }

    this.baseClass.prototype[ options.addBehaviour ] = function(behaviourClass) {
      var entity = this[ options.getEntity ]()

      var args = Array.prototype.splice.apply(arguments, [1])
      entity.attach(behaviourClass, args)

      return entity
    }
  }

  destroy () {
    delete this.baseClass.prototype[ this.mountOptions.addBehaviour ]
    delete this.baseClass.prototype[ this.mountOptions.getEntity ]
  }

}

module.exports = System
