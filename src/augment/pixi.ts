declare namespace PIXI {
    export interface DisplayObject {
        addBehaviour(klass: any, ...args: any[]): any;
        getEntity(): any;
    }
}