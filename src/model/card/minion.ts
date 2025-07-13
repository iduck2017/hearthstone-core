import { DebugUtil, Model, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { CardType, RaceType } from "../../types/enums";
import { RoleModel } from "../role";
import { SelectUtil } from "../../utils/select";
import { DamageRes } from "../../types/request";

export namespace MinionCardModel {
    export type Event = Partial<CardModel.Event> & {
        onSummon: {};
    }
    export type State = Partial<CardModel.State> & {
        readonly races: RaceType[];
    };
    export type Child = Partial<CardModel.Child> & {
        readonly role: RoleModel;
    };
    export type Refer = Partial<CardModel.Refer>;
}

export abstract class MinionCardModel<
    E extends Partial<MinionCardModel.Event> & Model.Event = {},
    S extends Partial<MinionCardModel.State> & Model.State = {},
    C extends Partial<MinionCardModel.Child> & Model.Child = {},
    R extends Partial<MinionCardModel.Refer> & Model.Refer = {}
> extends CardModel<
    E & MinionCardModel.Event, 
    S & MinionCardModel.State,  
    C & MinionCardModel.Child,
    R & MinionCardModel.Refer
> {
    constructor(props: MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<MinionCardModel.State, 'races'> & Pick<CardModel.State, 'name' | 'desc' | 'mana'>,
        child: C & Pick<MinionCardModel.Child, 'role'>,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: {
                type: CardType.MINION,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DebugUtil.log()
    private async toPlay(): Promise<{
        dep: Map<Model, Model[]>,
        pos: number
    } | undefined> {
        const player = this.route.owner;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.cards.length;
        const pos = await SelectUtil.get({
            candidates: new Array(size + 1).fill(0).map((item, index) => index),
        })
        if (pos === undefined) return;
        const dep: Map<Model, Model[]> = new Map();
        for (const feat of this.child.battlecries) {
            const selectors = feat.toPlay();
            if (!selectors) continue;
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                if (result === undefined) return;
                params.push(result);
            }
            dep.set(feat, params);
        }        
        const isAbort = this.event.toPlay({});
        if (isAbort) return;
        return { dep, pos };
    }

    @DebugUtil.log()
    public async play() {
        const options = await this.toPlay();
        if (!options) return;
        const { dep, pos } = options;
        this._play(pos);
        await this.onPlay(dep);
    }

    @TranxUtil.span()
    private _play(pos: number) {
        const player = this.route.owner;
        if (!player) return;
        const card = player.child.hand.del(this);
        if (!card) return;
        player.child.board.add(card, pos); 
    }

    protected async onPlay(dep: Map<Model, Model[]>) {
        await super.onPlay(dep);
        this.event.onSummon({});
    }

    public onDealDamage(res: DamageRes) {
        super.onDealDamage(res);
        this.child.role.onDealDamage(res);
    }
}