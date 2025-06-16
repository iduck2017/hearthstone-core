import { CheckService, DebugService, Model, Props, TranxService } from "set-piece";
import { RoleModel } from "../role";
import { CardModel } from ".";
import { CardType, MinionRace } from "@/types/card";
import { BattlecryModel } from "../feature/battlecry";

export namespace MinionCardModel {
    export type Parent = CardModel.Parent;
    export type Event = Partial<CardModel.Event> & {
        onBattlecry: void;
        onSummon: void;
    };
    export type State = Partial<CardModel.State> & {
        readonly race: ReadonlyArray<MinionRace>;
    };
    export type Child = Partial<CardModel.Child> & {
        readonly role: RoleModel;
        readonly battlecry: BattlecryModel[];
    };
    export type Refer = Partial<CardModel.Refer>;
}

export abstract class MinionCardModel<
    P extends MinionCardModel.Parent = MinionCardModel.Parent,
    E extends Partial<MinionCardModel.Event> & Model.Event = Partial<MinionCardModel.Event>,
    S extends Partial<MinionCardModel.State> & Model.State = Partial<MinionCardModel.State>,
    C extends Partial<MinionCardModel.Child> & Model.Child = Partial<MinionCardModel.Child>,
    R extends Partial<MinionCardModel.Refer> & Model.Refer = Partial<MinionCardModel.Refer>
> extends CardModel<
    P,
    MinionCardModel.Event & E, 
    MinionCardModel.State & S,  
    MinionCardModel.Child & C,
    MinionCardModel.Refer & R
> {
    protected get self(): MinionCardModel { return this; }

    constructor(props: Props<
        MinionCardModel.State,
        MinionCardModel.Child,
        MinionCardModel.Refer
    > & {
        state: S & {
            name: string;
            desc: string;
            mana: number;
        };
        child: C & {
            role: RoleModel;
        };
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                type: CardType.MINION,
                race: [],
                ...props.state,
            },
            child: { 
                battlecry: [],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    @DebugService.log()
    @CheckService.if(self => self.route.hand)
    public use() {
        this.event.toUse(undefined);
        const hand = this.route.hand;
        if (!hand) return;
        hand.use(this);
        this.event.onUse(undefined);
        this.battlecry();
        this.summon();
        this.event.onSummon(undefined);
    }
    
    @TranxService.use()
    private summon() {
        const owner = this.route.owner;
        const board = owner?.child.board;
        const hand = this.route.hand;
        if (!board || !hand) return;
        hand.del(this);
        board.add(this);
    }


    @DebugService.log()
    private battlecry() {
        this.child.battlecry.forEach(battlecry => battlecry.prepare());
        this.event.onBattlecry(undefined);
    }
}