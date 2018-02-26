/// <reference types="three" />

declare module 'three/three-core' {
    export interface Object3D {
        addBehaviour(klass: any, ...args: any[]): any;
        getEntity(): any;
    }
}