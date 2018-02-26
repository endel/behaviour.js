import * as assert from "assert";
import { createComponentSystem, Behaviour, EntityObject, ECS } from "../src";

import * as THREE from "three";
import "../src/augment/three";

// class BaseObject extends EntityObject {}

class DummyBehaviour extends Behaviour<THREE.Object3D> {
    attribute: number;
    param1: any;
    param2: any;

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
        const componentSystem = createComponentSystem(THREE.Object3D);

        it('System#mount', function () {
            let object = new THREE.Object3D();
            assert.equal(typeof(object.addBehaviour), "function");
        });

        it('System#destroy', function() {
            let object = new THREE.Object3D();
            componentSystem.destroy();
            assert.equal(object.addBehaviour, null);
        })
    });

    describe('System#add', function() {
        let system: ECS;

        before(() => {
            system = createComponentSystem(THREE.Object3D);
        });

        it ('should create and add entity when #addBehaviour is called', function() {
            let object = new THREE.Object3D();
            object.addBehaviour(new DummyBehaviour());

            assert.equal(Object.keys(system.entities).length, 1);
        })

        it ('should call onAttach with parameters given on #behave method', function() {
            let object = new THREE.Object3D();
            let behaviour = new DummyBehaviour();
            object.addBehaviour(behaviour, 1, 2);

            assert.equal(behaviour.param1, 1);
            assert.equal(behaviour.param2, 2);
        })
    })

    describe('Entity#destroy', function() {
        it ('should destroy entity and it\'s behaviours', function() {
            let object = new THREE.Object3D();
            let behaviour = new DummyBehaviour();
            object.addBehaviour(behaviour, 1, 2);

            let entity = object.getEntity();
            assert.equal(entity.behaviours.length, 1);

            entity.destroy();
            assert.equal(entity.behaviours.length, 0);
        })
    })

    describe('Entity#getBehaviour', function() {
        it ('should get behaviour by name', function() {
            let object = new THREE.Object3D();
            let behaviour = new DummyBehaviour();;
            object.addBehaviour(behaviour, 1, 2);

            let entity = object.getEntity();

            let behaviourByName = entity.getBehaviour('DummyBehaviour');
            assert.equal(behaviourByName, behaviour);

            let behaviourByName = entity.getBehaviour('non-existent');
            assert.equal(behaviourByName, null);
        })

        it ('should get behaviour by class', function() {
            let object = new THREE.Object3D();
            let behaviour = new DummyBehaviour();
            object.addBehaviour(behaviour, 1, 2);

            let entity = object.getEntity();

            let behaviourByClassSuccess = entity.getBehaviour(DummyBehaviour);
            assert.equal(behaviourByClassSuccess, behaviour);

            let behaviourByClassFail = entity.getBehaviour(THREE.Object3D);
            assert.equal(behaviourByClassFail, null);
        })
    })

    describe('Behaviour#detach', function() {
        it ('should detach behaviour from entity', function() {
            let object = new THREE.Object3D();
            let behaviour = new DummyBehaviour();
            let entity = object.getEntity();

            object.addBehaviour(behaviour, 1, 2);
            assert.equal(entity.behaviours.length, 1);

            behaviour.detach();
            assert.equal(entity.behaviours.length, 0);
        })
    })

    describe('Behaviour#detachAll', function() {
        it ('should detach behaviour from entity', function() {
            let object = new THREE.Object3D();
            let entity = object.getEntity();

            let b1 = new DummyBehaviour();
            object.addBehaviour(b1, 1, 2);
            let b2 = new DummyBehaviour();
            object.addBehaviour(b2, 1, 2);
            let b3 = new DummyBehaviour();
            object.addBehaviour(b3, 1, 2);

            assert.equal(entity.behaviours.length, 3);

            entity.detachAll();
            assert.equal(entity.behaviours.length, 0);
        })
    })

});
