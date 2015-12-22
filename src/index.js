'use strict';

var Behaviour = require('./Behaviour')
  , System = require('./System')

module.exports.createComponentSystem = function createComponentSystem (klass, methodName) {
  var system = new System()
  system.mount( klass, methodName )
  return system
}

module.exports.Behaviour = Behaviour
