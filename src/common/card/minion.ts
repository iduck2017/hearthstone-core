import { DebugService, Model, TranxService } from "set-piece";
import { CardModel } from ".";
import { CardType, MinionRaceType } from "@/types/card";
import { MinionRoleModel } from "../role/minion";

export namespace MinionCardModel {
    export type Event = Partial<CardModel.Event>;
    export type State = Partial<CardModel.State> & {
        readonly race: Readonly<MinionRaceType[]>;
    };
    export type Child = Partial<CardModel.Child> & {
        readonly role: MinionRoleModel;
    };
    export type Refer = Partial<CardModel.Refer>;
}

export abstract class MinionCardModel<
    P extends CardModel.Parent = CardModel.Parent,
    E extends Partial<MinionCardModel.Event> & Model.Event = {},
    S extends Partial<MinionCardModel.State> & Model.State = {},
    C extends Partial<MinionCardModel.Child> & Model.Child = {},
    R extends Partial<MinionCardModel.Refer> & Model.Refer = {}
> extends CardModel<
    P,
    E & MinionCardModel.Event, 
    S & MinionCardModel.State,  
    C & MinionCardModel.Child,
    R & MinionCardModel.Refer
> {
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
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DebugService.log()
    public async prepare() {
        const registry: Map<Model, Model[]> = new Map();
        for (const feat of this.child.battlecries) {
            const accessors = feat.prepare();
            if (!accessors) continue;
            const params: Model[] = [];
            for (const item of accessors) {
                const result = await item.get();
                if (!result) return;
                params.push(result);
            }
            registry.set(feat, params);
        }
        this.play(registry);
    }

    @DebugService.log()
    private async play(registry: Map<Model, Model[]>) {
        this.event.onPlayBefore({});
        const hand = this.route.hand;
        if (!hand) return;
        hand.use(this);
        this.event.onPlay({});
        await this.battlecry(registry);
        this.child.role.summon();
    }
}