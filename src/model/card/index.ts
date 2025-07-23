import { Constructor, Model, Route, TranxUtil } from "set-piece";
import { CardType } from "../../types";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { BattlecryModel } from "../battlecry";
import { GameModel } from "../game";
import { MemoryModel } from "../memory";
import { DeathrattleModel } from "../deathrattle";
import { DamageModel } from "../damage";

export namespace CardModel {
    export type Route = {
        readonly player: PlayerModel;
        readonly game: GameModel;
        readonly root: RootModel;
    };
    export type State = {
        readonly name: string;
        readonly desc: string;
        readonly mana: number;
        readonly type: CardType;
    };
    export type Event = {
        onPlay: {};
        toPlay: { isAbort: boolean };
        toDraw: { isAbort: boolean };
        onDraw: { card: CardModel },
        onRemove: {};
    };
    export type Child = {
        readonly damage: DamageModel;
        readonly battlecries: BattlecryModel[];
        readonly deathrattles: DeathrattleModel[];
    };
    export type Refer = {};
}

export abstract class CardModel<
    P extends CardModel.Route & Model.Route = CardModel.Route,
    E extends Partial<CardModel.Event> & Model.Event = {},
    S extends Partial<CardModel.State> & Model.State = {},
    C extends Partial<CardModel.Child> & Model.Child = {},
    R extends Partial<CardModel.Refer> & Model.Refer = {}
> extends Model<
    P & CardModel.Route,
    E & CardModel.Event, 
    S & CardModel.State, 
    C & CardModel.Child,
    R & CardModel.Refer
> {
    constructor(props: CardModel['props'] & {
        uuid: string | undefined;
        state: S & CardModel.State;
        child: C;
        refer: R;
        route: { [K in keyof P]: [number, Constructor<P[K]>]; };
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                damage: new DamageModel({}),
                battlecries: [],
                deathrattles: [],
                ...props.child,
            },
            refer: { ...props.refer },
            route: {
                ...props.route,
                player: [2, GameModel],
                game: [3, GameModel],
                root: [4, RootModel],
            }
        });
    }

    private get owner(): PlayerModel | undefined {
        let owner: Model | undefined = super.route.player;
        while (owner) {
            if (owner instanceof PlayerModel) break;
            owner = owner.route.parent;
            if (owner instanceof MemoryModel) owner = undefined;
        }
        return owner;
    }

    public get route() {
        const owner = this.owner;
        const opponent = owner?.route.opponent;
        return {
            ...super.route,
            owner,
            opponent,
        }
    }

    public abstract play(): void;

    protected async onPlay(dep: Map<Model, Model[]>) {
        this.event.onPlay({});
        for (const item of this.child.battlecries) {
            const params = dep.get(item);
            if (!params) return;
            await item.run(...params);
        }
    }
    
    public draw() {
        const signal = this.event.toDraw({ isAbort: false });
        if (signal?.isAbort) return;
        const card = this._draw();
        if (!card) return;
        this.event.onDraw({ card });
    }

    @TranxUtil.span()
    private _draw(): CardModel | undefined {
        const player = this.route.owner;
        if (!player) return;
        const card = player.child.deck.del(this);
        if (!card) return;
        player.child.hand.add(card);
        return card;
    }

}