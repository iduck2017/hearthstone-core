import { Model, TemplUtil } from "set-piece";
import { GameModel } from "./entities/game";
import { CollectionModel } from "./entities/collection";

export namespace AppModel {
    export type S = {
        version: string;
        count: number;
    };
    export type E = {};
    export type C = {
        game?: GameModel;
        readonly configs: CollectionModel[]
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

    public start(value: GameModel) {
        if (value instanceof GameModel) this.origin.child.game = value;
    }

    public end() { this.origin.child.game = undefined; }


    public collect(value: CollectionModel) { 
        this.origin.child.configs.push(value); 
    }

    public uncollect(value: CollectionModel) { 
        const index = this.origin.child.configs.indexOf(value);
        if (index === -1) return;
        this.origin.child.configs.splice(index, 1);
    }
}