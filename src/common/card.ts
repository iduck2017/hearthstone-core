import { CheckService, DebugService, Model, Props } from "set-piece";
import { CardType } from "@/types/card";
import { BoardModel } from "./board";
import { HandModel } from "./hand";
import { ExtensionModel } from "./extension";
import { RootModel } from "./root";
import { PlayerModel } from "./player";

export namespace CardModel {
    export type Parent = BoardModel | HandModel | ExtensionModel;
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly type: CardType;
        readonly mana: number;
    };
    export type Event = {
        onUse: CardModel;
    };
    export type Child = {};
    export type Refer = {};
}

export abstract class CardModel<
    P extends CardModel.Parent = CardModel.Parent,
    E extends Partial<CardModel.Event> & Model.Event = Partial<CardModel.Event>,
    S extends Partial<CardModel.State> & Model.State = Partial<CardModel.State>,
    C extends Partial<CardModel.Child> & Model.Child = Partial<CardModel.Child>,
    R extends Partial<CardModel.Refer> & Model.Refer = Partial<CardModel.Refer>
> extends Model<
    P,
    CardModel.Event & E, 
    CardModel.State & S, 
    CardModel.Child & C,
    CardModel.Refer & R
> {
    protected get self(): CardModel { return this; }

    constructor(props: Props<
        CardModel.State,
        CardModel.Child,
        CardModel.Refer
    > & {
        state: S & {
            name: string;
            desc: string;
            mana: number;
            type: CardType;
        };
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
    

    public get route(): Readonly<{
        parent?: P;
        root?: RootModel;
        hand?: HandModel;
        board?: BoardModel;
        owner?: PlayerModel;
        opponent?: PlayerModel;
    }> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const hand = route.parent instanceof HandModel ? route.parent : undefined;
        const board = route.parent instanceof BoardModel ? route.parent : undefined;
        const owner = board?.route.parent ?? hand?.route.parent;
        const opponent = owner?.route.opponent;
        return {
            ...route,
            root,
            hand,
            board,
            owner,
            opponent,
        }
    }

    @DebugService.log()
    @CheckService.if(self => self.route.hand)
    use() {
        const hand = this.route.hand;
        if (!hand) return;
        hand.del(this);        
        this.event.onUse(this);
    }

}