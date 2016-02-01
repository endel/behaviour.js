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

  getBehaviour (nameOrClass) {
    var isName = typeof(nameOrClass)==="string"
      , filterByName = (b) => b.constructor.name === nameOrClass
      , filterByClass = (b) => b.constructor.name === nameOrClass.name
    return this.behaviours.filter( (isName) ? filterByName : filterByClass )[0]
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

  detachAll () {
    var i = this.behaviours.length;
    while (i--) this.detach(this.behaviours[i])
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
    this.detachAll()
    this.emit('destroy')
  }

}

module.exports = Entity
