'use strict';

var EventEmitter = require('tiny-emitter')

class Behaviour extends EventEmitter {

  constructor () {
    super()

    this.entity = null
    this.object = null
  }

  attach (entity) {
    this.entity = entity
    this.object = entity.object
  }

  onAttach(options) {  }
  onDestroy() {  }

  destroy () {
    this.emit('destroy')
  }

}

module.exports = Behaviour
