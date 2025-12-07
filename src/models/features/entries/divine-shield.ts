import { DebugService, Event, ChunkService, TranxService } from "set-piece";
import { DamageEvent } from "../../../utils/events/damage";
import { RoleFeatureModel } from "../role";
import { AbortEvent } from "../../../utils/events/abort";

export namespace DivineShieldModel {
    export type E = {
        toActive: AbortEvent
        onBlock: Event
        toBlock: AbortEvent
    }
    export type S = {
        count: number
    }
    export type C = {}
    export type R = {}
}

@ChunkService.is('divine-shield')
export class DivineShieldModel extends RoleFeatureModel<
    DivineShieldModel.E,
    DivineShieldModel.S,
    DivineShieldModel.C,
    DivineShieldModel.R
> {
    public static block(events: DamageEvent[]) {
        events = events?.filter(item => {
            const target = item.detail.target;
            const entry = target.child.divineShield;
            const isValid = entry.toBlock()
            return isValid;
        }) ?? [];
        DivineShieldModel.doBlock(events);
        events.forEach(item => {
            const target = item.detail.target;
            const entry = target.child.divineShield;
            entry.onBlock();
        })        
    }

    @TranxService.span()
    protected static doBlock(options: DamageEvent[]) {
        options.forEach(item => {
            const target = item.detail.target;
            const entry = target.child.divineShield;
            entry.doBlock(item);
        })
    }

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

    public block(event: DamageEvent) {
        const isValid = this.toBlock();
        if (!isValid) return;
        this.doBlock(event);
        this.onBlock();
    }

    protected toBlock(): boolean {
        if (!this.isActived) return false;
        const event = new AbortEvent({});
        this.event.toBlock(event);
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        return true;
    }

    @TranxService.span()
    protected doBlock(event: DamageEvent) {
        event.update(0);
        event.abort();
        if (this.origin.state.count <= 1) {
            this.origin.state.isEnabled = false;
        }
        this.origin.state.count =- 1;
    }

    protected onBlock() {
        const role = this.route.role;
        if (!role) return;
        DebugService.log(`${role.name} lost Divine Shield`);
        this.event.onBlock(new Event({}));
    }


    @TranxService.span()
    protected doEnable() {
        super.doEnable();
        this.origin.state.count = 1;
    }

    @TranxService.span()
    protected doDisable() {
        super.doDisable();
        this.origin.state.count = 0;
    }
}