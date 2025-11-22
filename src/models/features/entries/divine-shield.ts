import { DebugUtil, Event, TemplUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../../types/events/damage";
import { RoleFeatureModel } from "../role";
import { AbortEvent } from "../../../types/events/abort";

export namespace DivineShieldModel {
    export type E = {
        toActive: AbortEvent
        onConsume: DamageEvent
    }
    export type S = {
        count: number
    }
    export type C = {}
    export type R = {}
}

@TemplUtil.is('divine-shield')
export class DivineShieldModel extends RoleFeatureModel<
    DivineShieldModel.E,
    DivineShieldModel.S,
    DivineShieldModel.C,
    DivineShieldModel.R
> {
    constructor(props?: DivineShieldModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Divine Shield',
                desc: 'The first time you take damage, ignore it.',
                isEnabled: true,
                count: props?.state?.isEnabled ? 1 : 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public consume(event: DamageEvent) {
        // before
        const role = this.route.role;
        if (!role) return false;
        if (!this.isActived) return false;
        
        // execute
        this.doConsume(event);
        event.supplement({ isBlock: true });

        // after
        DebugUtil.log(`${role.name} lost Divine Shield`);
        this.event.onConsume(event);
    }

    protected doConsume(event: DamageEvent) {
        if (this.origin.state.count <= 1) {
            this.origin.state.isEnabled = false;
        }
        this.origin.state.count =- 1;
    }


    @TranxUtil.span()
    protected doEnable() {
        super.doEnable();
        this.origin.state.count = 1;
    }


    @TranxUtil.span()
    protected doDisable() {
        super.doDisable();
        this.origin.state.count = 0;
    }
}