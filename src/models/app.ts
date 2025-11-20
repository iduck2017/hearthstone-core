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
        readonly collections: CollectionModel[]
        readonly templates: Model[]
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
                collections: props.child?.collections ?? [],
                templates: props.child?.templates ?? [],
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


    public link(value: Model) {
        this.origin.child.templates.push(value);
    }

    public unlink(value: Model) {
        const templates = this.origin.child.templates;
        const index = templates.indexOf(value);
        if (index === -1) return;
        templates.splice(index, 1);
    }

    public has(value: Model): boolean {
        const templates = this.origin.child.templates;
        return templates.includes(value);
    }
}