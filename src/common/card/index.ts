import { DebugService, EventAgent, Model, StateAgent } from "set-piece";
import { CardType } from "@/types/card";
import { BoardModel } from "../container/board";
import { HandModel } from "../container/hand";
import { ExtensionModel } from "../extension";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { BattlecryModel } from "../feature/battlecry";
import { GameModel } from "../game";


export namespace CardModel {
    export type Parent = BoardModel | HandModel | ExtensionModel;
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly mana: number;
        readonly type: CardType;
    };
    export type Event = {
        onPlay: {};
        onPlayBefore: {};
    };
    export type Child = {
        readonly battlecries: BattlecryModel[];
    };
    export type Refer = {};
}

export abstract class CardModel<
    P extends CardModel.Parent = CardModel.Parent,
    E extends Partial<CardModel.Event> & Model.Event = {},
    S extends Partial<CardModel.State> & Model.State = {},
    C extends Partial<CardModel.Child> & Model.Child = {},
    R extends Partial<CardModel.Refer> & Model.Refer = {}
> extends Model<
    P,
    E & CardModel.Event, 
    S & CardModel.State, 
    C & CardModel.Child,
    R & CardModel.Refer
> {
    constructor(props: CardModel['props'] & {
        state: S & CardModel.State;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                battlecries: [],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    public get route(): Readonly<Partial<{
        parent: P;
        root: RootModel;
        game: GameModel;
        hand: HandModel;
        board: BoardModel;
        owner: PlayerModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const hand = route.parent instanceof HandModel ? route.parent : undefined;
        const board = route.parent instanceof BoardModel ? route.parent : undefined;
        const owner = board?.route.parent ?? hand?.route.parent;
        const opponent = owner?.route.opponent;
        return {
            ...route,
            root,
            game: root?.child.game,
            hand,
            board,
            owner,
            opponent,
        }
    }

    public abstract prepare(): void;

    protected async battlecry(registry: Map<Model, Model[]>) {
        for (const item of this.child.battlecries) {
            const params = registry.get(item);
            if (!params) return;
            await item.use(...params);
        }
    }
}