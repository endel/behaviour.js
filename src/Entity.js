'use strict';

var EventEmitter = require('tiny-emitter')

class Entity extends EventEmitter {

  constructor (object, id) {
    super()

    this.id = id
    this.object = object

    this.behaviours = []
    this.on('detach', this.detach.bind(this))
  }

  attach (behaviour, args) {
    this.behaviours.push(behaviour)

    behaviour.attach( this )
    behaviour.onAttach.apply(behaviour, args)
  }

  detach (behaviour) {
    var index = this.behaviours.indexOf(behaviour)

    if (index !== -1) {
      this.behaviours.splice(index, 1)
      behaviour.onDetach()
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

  destroy () {
    this.emit('destroy')
  }

}

module.exports = Entity
