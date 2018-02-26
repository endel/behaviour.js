import { Entity } from "./Entity";

export class ECS {
    objectId: number = 0;
    entities: { [id:string]: Entity } = {};

    baseClass: any;
    mountOptions: any;

    add (entity: Entity) {
        this.entities[ entity.id ] = entity;
        entity.on('destroy', this.onEntityDestroy.bind(this, entity));
    }

    update () {
        for (let id in this.entities) {
            this.entities[id].update();
        }
    }

    mount (baseClass, options: any = {}) {
        if (!options.addBehaviour) { options.addBehaviour = 'addBehaviour'; }
        if (!options.getEntity) { options.getEntity = 'getEntity'; }

        this.baseClass = baseClass;
        this.mountOptions = options;

        const system = this;

        this.baseClass.prototype[ options.getEntity ] = function() {
            if (!this.__ENTITY__) {
                this.__ENTITY__ = new Entity(this, system.objectId++);
                system.add(this.__ENTITY__);
            }
            return this.__ENTITY__;
        }

        this.baseClass.prototype[ options.addBehaviour ] = function(behaviourClass) {
            const entity = this[ options.getEntity ]();

            const args = Array.prototype.splice.apply(arguments, [1]);
            entity.attach(behaviourClass, args);

            return entity;
        }
    }

    onEntityDestroy (entity) {
        delete this.entities[ entity.id ];
    }

    destroy () {
        delete this.baseClass.prototype[ this.mountOptions.addBehaviour ];
        delete this.baseClass.prototype[ this.mountOptions.getEntity ];
    }

}
