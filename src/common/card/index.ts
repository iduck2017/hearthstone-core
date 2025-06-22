import { DebugService, Model } from "set-piece";
import { CardType } from "@/types/card";
import { BoardModel } from "../container/board";
import { HandModel } from "../container/hand";
import { ExtensionModel } from "../extension";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { BattlecryModel } from "../feature/battlecry";


export namespace CardModel {
    export type Parent = BoardModel | HandModel | ExtensionModel;
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly mana: number;
        readonly type: CardType;
    };
    export type Event = {
        onUseBefore: void;
        onUse: void;
        onBattlecry: void;
    };
    export type Child = {
        readonly battlecry: BattlecryModel[];
    };
    export type Refer = {};
}

export abstract class CardModel<
    P extends CardModel.Parent = CardModel.Parent,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends Model<
    P,
    E & CardModel.Event, 
    S & CardModel.State, 
    C & CardModel.Child,
    R & CardModel.Refer
> {
    protected get self(): CardModel { return this; }

    constructor(props: CardModel['props'] & {
        state: S & CardModel.State;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                battlecry: [],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
    

    public get route(): Readonly<{
        parent: P | undefined;
        root: RootModel | undefined;
        hand: HandModel | undefined;
        board: BoardModel | undefined;
        owner: PlayerModel | undefined;
        opponent: PlayerModel | undefined;
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

    public abstract use(): void;
    
    @DebugService.log()
    protected battlecry() {
        const self = this.self;
        self.child.battlecry.forEach(feat => feat.prepare());
    }

}