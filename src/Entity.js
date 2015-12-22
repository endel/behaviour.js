'use strict';

var EventEmitter = require('tiny-emitter')

class Entity extends EventEmitter {

  constructor (object, id) {
    super()

    this.id = id
    this.object = object

    this.behaviours = []
  }

  attach (behaviour, options) {
    this.behaviours.push(behaviour)

    behaviour.attach( this )
    behaviour.on('destroy', this.onDestroyBehaviour.bind(this, behaviour))
    behaviour.onAttach(options)
  }

  detach (klass) {
  }

  onDestroyBehaviour (behaviour) {
    var index = this.behaviours.indexOf(behaviour)
    if (index !== -1) {
      this.behaviours.splice(index, 1)
      behaviour.onDestroy()
    }
  }

  update () {
    var i = this.behaviours.length;
    while (i--) {
      if (this.behaviours[i].update) {
        this.behaviours[i].update()
      }
    }
  }


}

module.exports = Entity
