'use strict';

var assert = require("assert")
  , createComponentSystem = require('../src/index.js').createComponentSystem
  , Behaviour = require('../src/index.js').Behaviour;

class DummyBaseObject {
  constructor () { }
  update() { }
}

class DummyBehaviour extends Behaviour {
  onAttach () { this.attribute = 10 }
  onDestroy () { }
}

describe('System', function() {

  describe('createComponentSystem', function () {
    var system = createComponentSystem(DummyBaseObject, 'addBehaviour')

    it('#mount', function () {
      var object = new DummyBaseObject()
      assert.equal(typeof(object.addBehaviour), "function")
    });

    it('#destroy', function() {
      var object = new DummyBaseObject()
      system.destroy()
      assert.equal(object.addBehaviou, null)
    })

  });

  describe('#add', function() {
    var system = createComponentSystem(DummyBaseObject)

    it ('should create and add entity when #behave is called', function() {
      var object = new DummyBaseObject()
      object.behave(new DummyBehaviour)

      assert.equal(Object.keys(system.entities).length, 1)
    })
  })

});
