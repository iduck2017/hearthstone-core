import { Model, Route } from "set-piece";
import { CardModel, HeroModel } from "..";
import { AbortEvent } from "../utils/abort";

export namespace AnchorModel {
    export type Event<T extends AnchorEvent> = {
        toRun: T;
        onRun: T;
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class AnchorEvent extends AbortEvent {
    public readonly source: AnchorModel<this>;
    
    constructor(props: { source: AnchorModel }) {
        super();
        this.source = props.source;
    }
}

export class AnchorModel<
    T extends AnchorEvent = any
> extends Model<
    AnchorModel.Event<T>,
    AnchorModel.State, 
    AnchorModel.Child, 
    AnchorModel.Refer
> {

    public get route(): Route & {
        card?: CardModel;
        hero?: HeroModel;
    } {
        const path = super.route.path;
        const card = path.find(item => item instanceof CardModel);
        const hero = path.find(item => item instanceof HeroModel);
        return { ...super.route, card, hero }
    }
    
    constructor(props: AnchorModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(event: T): T | undefined {
        return this.event.toRun(event);
    }

    public onRun(event: T): T | undefined {
        return this.event.onRun(event);
    }
}