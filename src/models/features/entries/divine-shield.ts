import { DebugUtil, Event, TemplUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../../types/damage-event";
import { FeatureModel } from "..";
import { MinionFeatureModel } from "../minion";

export namespace DivineShieldModel {
    export type E = {
        onConsume: DamageEvent
        onRestore: Event
    }
    export type S = {
        count: number
    }
    export type C = {}
    export type R = {}
}

@TemplUtil.is('divine-shield')
export class DivineShieldModel extends MinionFeatureModel<
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
                isActive: true,
                count: props?.state?.isActive ? 1 : 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    @TranxUtil.span()
    public active(): boolean {
        if (this.state.isActive) return false; 
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Divine Shield`);
        this.origin.state.isActive = true;
        this.origin.state.count = 1;
        this.event.onRestore(new Event({}));
        return true;
    }

    @TranxUtil.span()
    public consume(event: DamageEvent) {
        if (!this.state.isActive) return false;
        if (this.origin.state.count <= 1) this.origin.state.isActive = false;
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} lost Divine Shield`);
        this.origin.state.count =- 1;
        event.config({ isDivineShield: true });
        this.event.onConsume(event);
        return true;
    }


    public deactive() {
        super.deactive();
        this.origin.state.count = 0;
    }
}