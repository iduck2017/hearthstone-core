import { Model } from "set-piece";
import { DamageForm, DamageModel } from "../damage";
import { DeathUtil } from "../../utils/death";
import { RoleModel } from ".";
import { CardModel } from "../card";

export namespace DeathModel {
    export type Event = {
        onDie: {};
    }
    export type State = {
        isDying: boolean;
        isDestroy: boolean;
    }
    export type Child = {}
    export type Refer = {
        reason?: DamageModel;
    }
}

export class DeathModel extends Model<
    DeathModel.Event,
    DeathModel.State,
    DeathModel.Child,
    DeathModel.Refer
> {
    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel) as RoleModel | undefined;
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel) as CardModel | undefined;
        return {
            ...route,
            role,
            card,
        }
    }

    constructor(props: DeathModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                isDying: false,
                isDestroy: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toDie(form: DamageForm) {
        if (this.state.isDying) return false;
        this.draft.refer.reason = form.source;
        this.draft.state.isDying = true;
        DeathUtil.add(this);
    }

    public onDie() {
        this.event.onDie({});
    }
}