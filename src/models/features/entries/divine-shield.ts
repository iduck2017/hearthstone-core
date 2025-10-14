import { Event, TemplUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../../types/damage-event";
import { FeatureModel } from "..";
import { RoleFeatureModel } from "../role";

export namespace DivineShieldModel {
    export type E = {
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
                isActive: true,
                count: props?.state?.isActive ? 1 : 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    @TranxUtil.span()
    public gain(): boolean {
        if (this.state.isActive) return false; 
        this.origin.state.isActive = true;
        this.origin.state.count = 1;
        return true;
    }

    public consume(event: DamageEvent) {
        if (!this.state.isActive) return false;
        if (this.origin.state.count <= 1) this.origin.state.isActive = false;
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