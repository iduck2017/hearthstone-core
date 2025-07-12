import { Model, Props } from "set-piece";
import { CardType } from "../../types/card";
import { ExtensionModel } from "../extension";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { BattlecryModel } from "../feature/battlecry";
import { GameModel } from "../game";
import { Optional } from "set-piece";
import { RoleModel } from "../role";
import { HandModel } from "../hand";
import { BoardModel } from "../board";


export namespace CardModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly mana: number;
        readonly type: CardType;
    };
    export type Event = {
        onPlay: {};
        toPlay: {};
    };
    export type Child = {
        readonly role?: RoleModel;
        readonly battlecries: BattlecryModel[];
    };
    export type Refer = {};
}

export abstract class CardModel<
    E extends Partial<CardModel.Event> & Model.Event = {},
    S extends Partial<CardModel.State> & Model.State = {},
    C extends Partial<CardModel.Child> & Model.Child = {},
    R extends Partial<CardModel.Refer> & Model.Refer = {}
> extends Model<
    E & CardModel.Event, 
    S & CardModel.State, 
    C & CardModel.Child,
    R & CardModel.Refer
> {
    constructor(props: CardModel['props'] & Props<
        S & CardModel.State,
        C,
        R
    >) {
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

    public get route(): Readonly<Optional<{
        parent: P;
        root: RootModel;
        game: GameModel;
        owner: PlayerModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const parent = route.parent;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const owner = route.parent instanceof PlayerModel ? route.parent : undefined;
        const opponent = owner?.route.opponent;
        const game = root?.child.game;
        return {
            root,
            game,
            owner,
            parent,
            opponent,
        }
    }

    public abstract toPlay(): void;

    protected async battlecry(registry: Map<Model, Model[]>) {
        for (const item of this.child.battlecries) {
            const params = registry.get(item);
            if (!params) return;
            await item.toRun(...params);
        }
    }
}