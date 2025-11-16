import { DebugUtil, Event, TemplUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../../types/events/damage";
import { RoleFeatureModel } from "../../features/minion";

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
                actived: true,
                count: props?.state?.actived ? 1 : 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active(): boolean {
        if (this.state.actived) return false; 
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} gain Divine Shield`);
        this._active();
        this.event.onRestore(new Event({}));
        return true;
    }
    @TranxUtil.span()
    private _active() {
        this.origin.state.actived = true;
        this.origin.state.count = 1;
    }

    @TranxUtil.span()
    public consume(event: DamageEvent) {
        if (!this.state.actived) return false;
        if (this.origin.state.count <= 1) this.origin.state.actived = false;
        const role = this.route.role;
        if (!role) return false;
        DebugUtil.log(`${role.name} lost Divine Shield`);
        this.origin.state.count =- 1;
        event.supplement({ block: true });
        this.event.onConsume(event);
        return true;
    }


    public disable() {
        super.disable();
        this.origin.state.count = 0;
    }
}