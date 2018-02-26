import { Behaviour } from "./Behaviour";
import EventEmitter = require("tiny-emitter");

export class Entity<T=any> extends EventEmitter {
    id: string;
    object: T;

    behaviours: Behaviour[] = [];

    constructor (object, id) {
        super();

        this.id = id;
        this.object = object;

        this.on('detach', this.detach.bind(this));
    }

    getBehaviour (nameOrClass) {
        const isName = typeof(nameOrClass) === "string";
        const filterByName = (b) => b.constructor.name === nameOrClass;
        const filterByClass = (b) => b.constructor.name === nameOrClass.name;
        return this.behaviours.filter((isName) ? filterByName : filterByClass)[0];
    }

    attach (behaviour, args) {
        this.behaviours.push(behaviour);

        behaviour.attach( this );
        behaviour.onAttach.apply(behaviour, args);
    }

    detach (behaviour) {
        const index = this.behaviours.indexOf(behaviour);

        if (index !== -1) {
            this.behaviours.splice(index, 1)
            behaviour.onDetach();
        }
    }

    detachAll () {
        let i = this.behaviours.length;
        while (i--) {
            this.detach(this.behaviours[i]);
        }
    }

    update () {
        let i = this.behaviours.length;
        while (i--) {
            if (this.behaviours[i].update) {
                this.behaviours[i].update();
            }
        }
    }

    destroy () {
        this.detachAll();
        this.emit('destroy');
    }

}