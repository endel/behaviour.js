'use strict';

class Behaviour {

  constructor () {
    this.entity = null
    this.object = null

    this._callbacks = []
  }

  attach (entity) {
    this.entity = entity
    this.object = entity.object
  }

  onAttach(options) {  }
  onDetach() {  }

  detach () {
    this.emit('detach', this)

    // clear all callbacks this behaviour registered
    for (var i=0; i<this._callbacks.length; i++) {
      this.off.apply(this, this._callbacks[i])
    }
  }

  // delegate EventEmitter events from it's Entity
  on () {
    this._callbacks.push(arguments)
    this.entity.on.apply(this.entity, arguments)
  }

  once() {
    this._callbacks.push(arguments)
    this.entity.once.apply(this.entity, arguments)
  }

  off() { this.entity.off.apply(this.entity, arguments) }
  emit() { this.entity.emit.apply(this.entity, arguments) }

}

module.exports = Behaviour
