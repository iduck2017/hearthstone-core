import { DebugUtil, Event, TemplUtil, TranxUtil } from "set-piece";
import { DamageEvent } from "../../../types/events/damage";
import { RoleFeatureModel } from "../../features/minion";
import { AbortEvent } from "../../../types/events/abort";

export namespace DivineShieldModel {
    export type E = {
        toActive: AbortEvent
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
                isActived: true,
                count: props?.state?.isActived ? 1 : 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    public active() {
        // before
        if (this.origin.state.isActived) return;
        const role = this.route.role;
        if (!role) return;

        const event = new AbortEvent({});
        this.event.toActive(event);
        let isValid = event.detail.isValid;
        if (!isValid) return false;

        // execute
        this.doActive();

        // after
        DebugUtil.log(`${role.name} gain Divine Shield`);
        this.event.onRestore(new Event({}));
    }

    @TranxUtil.span()
    private doActive() {
        this.origin.state.isActived = true;
        this.origin.state.count = 1;
    }


    public consume(event: DamageEvent) {
        // before
        const role = this.route.role;
        if (!role) return false;
        if (!this.isValid) return false;
        
        // execute
        this.doConsume(event);
        event.supplement({ isBlock: true });

        // after
        DebugUtil.log(`${role.name} lost Divine Shield`);
        this.event.onConsume(event);
    }


    protected doConsume(event: DamageEvent) {
        if (this.origin.state.count <= 1) {
            this.origin.state.isActived = false;
        }
        this.origin.state.count =- 1;
    }

    @TranxUtil.span()
    protected doDeactive() {
        super.doDeactive();
        this.origin.state.count = 0;
    }
}