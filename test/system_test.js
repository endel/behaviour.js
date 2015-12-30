'use strict';

var assert = require("assert")
  , createComponentSystem = require('../src/index.js').createComponentSystem
  , Behaviour = require('../src/index.js').Behaviour;

class DummyBaseObject {
  constructor () { }
  update() { }
}

class DummyBehaviour extends Behaviour {
  onAttach (param1, param2) {
    this.attribute = 10;
    this.param1 = param1;
    this.param2 = param2;
  }
  onDestroy () { }
}

describe('System', function() {

  describe('createComponentSystem', function () {
    var system = createComponentSystem(DummyBaseObject, { addBehaviour: 'behave', getEntity: 'entity' })

    it('#mount', function () {
      var object = new DummyBaseObject()
      assert.equal(typeof(object.behave), "function")
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
      object.addBehaviour(new DummyBehaviour)

      assert.equal(Object.keys(system.entities).length, 1)
    })

    it ('should call onAttach with parameters given on #behave method', function() {
      var object = new DummyBaseObject()
      var behaviour = new DummyBehaviour
      object.addBehaviour(behaviour, 1, 2)

      assert.equal(behaviour.param1, 1)
      assert.equal(behaviour.param2, 2)
    })
  })

});
