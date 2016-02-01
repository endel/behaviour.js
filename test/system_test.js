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
  onDetach () { }
  onDestroy () { }
}

describe('System', function() {

  describe('createComponentSystem', function () {
    var componentSystem = createComponentSystem(DummyBaseObject, { addBehaviour: 'behave', getEntity: 'entity' })

    it('System#mount', function () {
      var object = new DummyBaseObject()
      assert.equal(typeof(object.behave), "function")
    });

    it('System#destroy', function() {
      var object = new DummyBaseObject()
      componentSystem.destroy()
      assert.equal(object.addBehaviou, null)
    })
  });

  var system = createComponentSystem(DummyBaseObject)
  describe('System#add', function() {

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

  describe('Entity#destroy', function() {
    it ('should destroy entity and it\'s behaviours', function() {
      var object = new DummyBaseObject()
      var behaviour = new DummyBehaviour
      object.addBehaviour(behaviour, 1, 2)

      var entity = object.getEntity()
      assert.equal(entity.behaviours.length, 1)

      entity.destroy()
      assert.equal(entity.behaviours.length, 0)
    })
  })

  describe('Entity#getBehaviour', function() {
    it ('should get behaviour by name', function() {
      var object = new DummyBaseObject()
      var behaviour = new DummyBehaviour
      object.addBehaviour(behaviour, 1, 2)

      var entity = object.getEntity()

      var behaviourByName = entity.getBehaviour('DummyBehaviour')
      assert.equal(behaviourByName, behaviour)

      var behaviourByName = entity.getBehaviour('non-existent')
      assert.equal(behaviourByName, null)
    })

    it ('should get behaviour by class', function() {
      var object = new DummyBaseObject()
      var behaviour = new DummyBehaviour
      object.addBehaviour(behaviour, 1, 2)

      var entity = object.getEntity()

      var behaviourByClassSuccess = entity.getBehaviour(DummyBehaviour)
      assert.equal(behaviourByClassSuccess, behaviour)

      var behaviourByClassFail = entity.getBehaviour(DummyBaseObject)
      assert.equal(behaviourByClassFail, null)
    })
  })

  describe('Behaviour#detach', function() {
    it ('should detach behaviour from entity', function() {
      var object = new DummyBaseObject()
      var behaviour = new DummyBehaviour
      var entity = object.getEntity()

      object.addBehaviour(behaviour, 1, 2)
      assert.equal(entity.behaviours.length, 1)

      behaviour.detach()
      assert.equal(entity.behaviours.length, 0)
    })
  })

  describe('Behaviour#detachAll', function() {
    it ('should detach behaviour from entity', function() {
      var object = new DummyBaseObject()
      var entity = object.getEntity()

      var b1 = new DummyBehaviour
      object.addBehaviour(b1, 1, 2)
      var b2 = new DummyBehaviour
      object.addBehaviour(b2, 1, 2)
      var b3 = new DummyBehaviour
      object.addBehaviour(b3, 1, 2)

      assert.equal(entity.behaviours.length, 3)

      entity.detachAll()
      assert.equal(entity.behaviours.length, 0)
    })
  })

});
