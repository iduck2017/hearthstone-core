import { Model, ChunkService } from "set-piece";
import { GameModel } from "./entities/game";
import { CollectionModel } from "./entities/containers/collection";
import { CacheModel } from "./entities/containers/cache";

export namespace AppModel {
    export type S = {
        version: string;
        count: number;
    };
    export type E = {};
    export type C = {
        game?: GameModel;
        readonly collections: CollectionModel[]
        readonly cache: CacheModel
    };
}

@ChunkService.is('app')
export class AppModel extends Model<
    AppModel.E, 
    AppModel.S, 
    AppModel.C
> {
    constructor(props?: AppModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                version: '0.1.0',
                count: 0,
                ...props.state
            },
            child: { 
                collections: props.child?.collections ?? [],
                cache: props.child?.cache ?? new CacheModel({}),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    public set(value: GameModel) {
        this.origin.child.game = value;
    }

    public del(): void { 
        this.origin.child.game = undefined;
    }
}