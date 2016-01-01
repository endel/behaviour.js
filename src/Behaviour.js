'use strict';

class Behaviour {

  constructor () {
    this.entity = null
    this.object = null
  }

  attach (entity) {
    this.entity = entity
    this.object = entity.object
  }

  onAttach(options) {  }
  onDetach() {  }

  detach () {
    this.emit('detach', this)
  }

  // delegate EventEmitter events from it's Entity
  on () { this.entity.on.apply(this.entity, arguments) }
  once() { this.entity.once.apply(this.entity, arguments) }
  off() { this.entity.off.apply(this.entity, arguments) }
  emit() { this.entity.emit.apply(this.entity, arguments) }

}

module.exports = Behaviour
