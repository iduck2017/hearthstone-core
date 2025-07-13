import { Model, TranxUtil } from "set-piece";
import { CardType } from "../../types/enums";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { BattlecryModel } from "../feature/battlecry";
import { GameModel } from "../game";
import { RoleModel } from "../role";
import { MemoryModel } from "../memory";
import { DamageReq, DamageRes } from "../../types/request";

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
        toDraw: {};
        onDraw: { card: CardModel },
        onDealDamage: DamageRes;
        toDealDamage: DamageReq;
    };
    export type Child = {
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
    constructor(props: CardModel['props'] & {
        uuid: string | undefined;
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


    private get owner(): PlayerModel | undefined {
        let owner: Model | undefined = super.route.parent;
        while (owner) {
            if (owner instanceof PlayerModel) break;
            owner = owner.route.parent;
            if (owner instanceof MemoryModel) owner = undefined;
        }
        return owner;
    }

    public get route(): Readonly<Partial<{
        parent: Model;
        root: RootModel;
        game: GameModel;
        owner: PlayerModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const parent = route.parent;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const owner = this.owner;
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
        const isAbort = this.event.toDraw({});
        if (isAbort) return;
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

    public toDealDamage(req: DamageReq) {
        this.event.toDealDamage(req);
    }

    public onDealDamage(res: DamageRes) {
        this.event.onDealDamage(res);
    }
}