import { Component, ComponentName, ComponentOfName } from "../components";
import { ActionName } from "../config";
import { Entity, EntityId } from "../entities";
import { query, QueryOptions } from "../query";
import { genUuid } from "../util";
import { ComponentStores } from "./componentStore";

export interface StateEntityApi {
    get: <N extends ComponentName>(name: N) => ComponentOfName<N> | null;
    add: (...components: Component[]) => void;
    remove: (...componentNames: ComponentName[]) => void;
    destroy: () => void;
}

export class State {
    public actions: Map<ActionName, "down" | "press" | "up">;
    public ws: WebSocket | null;

    private entities: Map<EntityId, Entity>;
    private stores: ComponentStores;

    constructor() {
        this.actions = new Map();
        this.ws = null;

        this.entities = new Map();
        this.stores = new ComponentStores();
    }

    public createEntity(id?: EntityId): Entity {
        const api: StateEntityApi = {
            get: (name) => this.stores.getComponentFromEntity(entity, name),
            add: (...components: Component[]) =>
                this.stores.addComponentsToEntity(entity, components),
            remove: (...names: ComponentName[]) =>
                this.stores.removeComponentsFromEntity(entity, names),
            destroy: () => this.destroyEntity(entity),
        };

        const entity = new Entity(id ?? genUuid(), api);
        this.entities.set(entity.id, entity);

        return entity;
    }

    public *query<
        W extends ComponentName | never = never,
        O extends ComponentName | never = never,
        M extends ComponentName | never = never,
    >(q: QueryOptions<W, O, M>) {
        yield* query(q, [...this.entities.values()], this.stores);
    }

    // private dev() {
    //     for (const x of this.query({
    //         with: ["position"],
    //         without: ["player"],
    //         maybe: ["sprite"],
    //     })) {
    //         x;
    //     }
    // }

    private destroyEntity(entity: Entity) {
        this.entities.delete(entity.id);

        for (const store of this.stores.iter()) {
            store.delete(entity.id);
        }
    }
}

export const STATE = new State();

// @ts-ignore
window.STATE = STATE;