import { DebugUtil, Model, TemplUtil } from "set-piece";
import { GameModel } from "./game";
import { CollectionModel } from "./cards/group/collection";

export namespace AppModel {
    export type S = {
        version: string;
        count: number;
    };
    export type E = {};
    export type C = {
        game?: GameModel;
        configs: CollectionModel[]
    };
}

@TemplUtil.is('app')
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
                configs: props.child?.configs ?? [],
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    public set(config: CollectionModel): void;
    public set(game: GameModel): void;
    public set(value: GameModel | CollectionModel) {
        if (value instanceof GameModel) this.origin.child.game = value;
        if (value instanceof CollectionModel) this.origin.child.configs.push(value);
    }

    public end() { this.origin.child.game = undefined; }
}