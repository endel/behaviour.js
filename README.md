behaviour.js
===

[![Build Status](https://secure.travis-ci.org/gamestdio/behaviour.js.png?branch=master)](http://travis-ci.org/gamestdio/behaviour.js)

Plugable [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) for Games.

behaviour.js is a Unity-like Entity Component System that you can plug on any
JavaScript library or engine.

**Examples**:

- [Plugged into THREE.js](http://gamestdio.github.io/behaviour.js/three.html)
- [Plugged into PIXI.js](http://gamestdio.github.io/behaviour.js/pixi.html)

Usage
---

Attach the entity component system into your target library's base class. Then
you'll be able to attach custom behaviours directly into your objects.

```javascript
import { createComponentSystem, Behaviour } from 'behaviour.js'
var componentSystem = createComponentSystem(THREE.Object3D)

// Define your custom behaviour
class CustomBehaviour extends Behaviour {
  onAttach () {
    console.log("CustomBehaviour has been attached into ", this.object)
  }

  update() {
    console.log("Let's do something with this object", this.object)
    this.object.rotation += 0.1
  }

  onDetach () {
    console.log("CustomBehaviour has been detached from ", this.object)
  }
}

// Attach the behaviour into your objects
var object = new THREE.Object3D()
object.addBehaviour(new CustomBehaviour())

function animate() {
  componentSystem.update()

  // render your application
  // ...
  requestAnimationFrame( animate );
}
```

API
---

Entities are a sublcass of
[EventEmitters](https://github.com/scottcorgan/tiny-emitter#instance-methods),
they have `emit`/`on`/`once`/`off` methods. A handy way to communicate
between behaviours is listening to events in Behaviour's `onAttach`
callback.

### Object

These methods are injected on all instances of the base object you provided on
`createComponentSystem` (e.g. `THREE.Object`, `PIXI.DisplayObject`, etc)

**Methods**

- `getEntity()` - Get Entity instance attached to the object.
- `addBehaviour(behaviour, options)` - Attach custom behaviour to this entity

### Behaviour

**Properties**

- `entity` - *Entity instance*
- `object` - *Object which this behaviour was attached*

**Callbacks**

- `onAttach` - *called after being attached in a target object*
- `onDetach` - *called after being manually detached (through `entity.detach` method)*
- `update` - *called when your component system is updated*

**Methods**

- `detach`
- `on(event, callback[, context])` - *alias to `entity.on`*
- `once(event, callback[, context])` - *alias to `entity.once`*
- `off(event[, callback])` - *alias to `entity.off`*
- `emit(event[, arguments...])` - *alias to `entity.emit`*

### Entity

**Properties**

- `object` - *Object which this behaviour was attached*
- `behaviours` - *Array of behaviour instances*

**Methods**

- `attach(behaviour)` - *Attach behaviour instance to this Entity*
- `detach(behaviour)` - *Detach behaviour instance to this Entity*
- `destroy` - *Detach all behaviours from this Entity and remove it from the System*
- `on(event, callback[, context])` - *Subscribe to an event*
- `once(event, callback[, context])` - *Subscribe to an event only once*
- `off(event[, callback])` - *Unsubscribe from an event or all events. If no callback is provided, it unsubscribes you from all events.*
- `emit(event[, arguments...])` - *Trigger a named event*

License
---

MIT
