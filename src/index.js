'use strict';

var Behaviour = require('./Behaviour')
  , System = require('./System')

module.exports.createComponentSystem = function createComponentSystem (klass, options = {}) {
  var system = new System()
  system.mount( klass, options )
  return system
}

module.exports.Behaviour = Behaviour
