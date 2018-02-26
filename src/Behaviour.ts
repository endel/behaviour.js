import { Entity } from "./Entity";

export abstract class Behaviour<T=any> {
    public entity: Entity;
    public object: T;

    protected _callbacks: any[] = [];

    public attach (entity: Entity<T>) {
        this.entity = entity
        this.object = entity.object
    }

    public abstract onAttach (...args: any[]);
    public abstract onDetach ();

    public update?(): void;

    public detach () {
        this.emit('detach', this)

        // clear all callbacks this behaviour registered
        this._callbacks.forEach(callback => this.off.apply(this, callback));
    }

    // delegate EventEmitter events from it's Entity
    public on (event: string, callback: Function) {
        this._callbacks.push(callback);
        this.entity.on(event, callback);
        return this;
    }

    public once (event: string, callback: Function) {
        this._callbacks.push(callback);
        this.entity.once(event, callback);
        return this;
    }

    public off(...args) {
        this.entity.off.apply(this.entity, args);
        return this;
    }

    public emit(...args) {
        this.entity.emit.apply(this.entity, args);
        return this;
    }

}
