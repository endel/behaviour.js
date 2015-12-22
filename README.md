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
var componentSystem = createComponentSystem(THREE.Object3D, 'behave')

// Define your custom behaviour
class CustomBehaviour extends Behaviour {
  onAttach () {
    console.log("CustomBehaviour has been attached into ", this.object)
  }

  update() {
    console.log("Let's do something with this object", this.object)
    this.object.rotation += 0.1
  }
}

// Attach the behaviour into your objects
var object = new THREE.Object3D()
object.behave(new CustomBehaviour())

function animate() {
  componentSystem.update()

  // render your application
  // ...
}
```

API
---

Behaviours and Entities have `emit`/`on`/`once`/`off` methods. They subclass
[EventEmitters](https://github.com/scottcorgan/tiny-emitter#instance-methods).
A handy way to communicate between behaviours is listening to `entity` events in
Behaviour's `onAttach` callback.

### Behaviour

**Properties**

- `entity` - *Entity instance*
- `object` - *Object which this behaviour was attached*

**Callbacks**

- `onAttach` - *called after being attached in a target object*
- `onDestroy` - *called after being manually destroyed (through `destroy` method)*
- `update` - *called when your component system is updated*

**Methods**

- `destroy`

License
---

MIT
