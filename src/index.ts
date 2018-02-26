import { ECS } from "./ECS"
import { Entity } from "./Entity";
import { Behaviour } from "./Behaviour";

export class EntityObject {
  addBehaviour(klass: any, ...args: any[]): Entity { return null; }
  getEntity(): Entity { return null; }
}

export function createComponentSystem (klass: any, options: any = {}) {
  const system = new ECS();
  system.mount( klass, options );
  return system;
}

export { ECS, Entity, Behaviour };