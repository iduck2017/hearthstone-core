import { CheckService, DebugService, Model, TranxService } from "set-piece";
import { RoleModel } from "../role";
import { CardModel } from ".";
import { CardType, MinionRaceType } from "@/types/card";
import { BoardModel } from "../container/board";
import { HandModel } from "../container/hand";
import { ExtensionModel } from "../extension";
import { MinionRoleModel } from "../minion";


export namespace MinionCardModel {
    export type Event = {};
    export type State = {
        readonly race: Readonly<MinionRaceType[]>;
    };
    export type Child = {
        readonly role: MinionRoleModel;
    };
    export type Refer = {};
}

export abstract class MinionCardModel<
    P extends CardModel.Parent = CardModel.Parent,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends CardModel<
    P,
    E & MinionCardModel.Event, 
    S & MinionCardModel.State,  
    C & MinionCardModel.Child,
    R & MinionCardModel.Refer
> {
    protected get self(): MinionCardModel { return this; }

    constructor(props: MinionCardModel['props'] & {
        state: S & Pick<CardModel.State, 'name' | 'desc' | 'mana'>;
        child: C & Pick<MinionCardModel.Child, 'role'>;
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
    
    public prepare() {

    }

    @DebugService.log()
    @CheckService.if(self => self.route.hand)
    public use() {
        this.self.event.onUseBefore();
        const hand = this.route.hand;
        if (!hand) return;
        hand.use(this);
        this.self.event.onUse();
        this.battlecry();
        this.summon();
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
}