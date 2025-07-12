import { DebugUtil, Model } from "set-piece";
import { CardModel } from ".";
import { CardType } from "../../types/card";
import { RoleModel } from "../role";

export namespace MinionCardModel {
    export type Event = Partial<CardModel.Event>;
    export type State = Partial<CardModel.State> & {};
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
        state: S & Pick<CardModel.State, 'name' | 'desc' | 'mana'>;
        child: C & Pick<MinionCardModel.Child, 'role'>;
        refer: R;
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
    public async toPlay() {
        const registry: Map<Model, Model[]> = new Map();
        for (const feat of this.child.battlecries) {
            const accessors = feat.toPlay();
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

    @DebugUtil.log()
    private async play(registry: Map<Model, Model[]>) {
        this.route.owner?.play(this);
        this.event.onPlay({});
        await this.battlecry(registry);
        this.child.role.summon();
    }
}