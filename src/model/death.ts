import { Model, TranxUtil } from "set-piece";
import { CardModel } from "./card";
import { RoleModel } from "./role";
import { DamageRes } from "../types/request";
import { DeathUtil } from "../utils/death";
import { HeroCardModel } from "./card/hero";
import { MinionCardModel } from "./card/minion";

export namespace DeathModel {
    export type Event = {};
    export type State = {
        isDead: boolean;
        isDestroyed: boolean;
        damage?: number;
    };
    export type Child = {};
    export type Refer = {
        murderer?: CardModel;
    };
}

export class DeathModel extends Model<
    DeathModel.Event,
    DeathModel.State,
    DeathModel.Child,
    DeathModel.Refer
> {
    constructor(props: DeathModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                isDead: false,
                isDestroyed: false,
                ...props.state,
            },
            child: {},
            refer: {},
        })
    }

    public get route(): Readonly<Partial<{
        parent: Model;
        root: Model;
        role: RoleModel;
        card: HeroCardModel | MinionCardModel;
    }>> {
        const route = super.route
        const role = route.parent instanceof RoleModel ? route.parent : undefined;
        const card = role?.route.card;
        return {
            ...route,
            role,
            card,
        }
    }

    @TranxUtil.span()
    public check(res: DamageRes) {
        if (res.target !== this.route.role) return;
        if (res.prevState.curHealth <= 0) return;
        if (res.nextState.curHealth > 0) return;
        if (!this.route.card) return;
        this.draft.state.damage = res.recvDamage;
        this.draft.state.isDead = true;
        this.draft.refer.murderer = res.source;
        DeathUtil.check(this.route.card);
    }

    public run() {
        
    }
}