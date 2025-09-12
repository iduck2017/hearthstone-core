import { Decor, Event, Loader, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { FeatureModel } from "../features";
import { RoleActionProps, RoleActionModel } from "../rules/action/role";

export namespace WindfuryProps {
    export type E = {
        onActive: Event;
    };
    export type S = {
        isAdvance: boolean;
    };
    export type C = {};
    export type R = {};
}

@StoreUtil.is('windfury')
export class WindfuryModel extends FeatureModel<
    WindfuryProps.E,
    WindfuryProps.S,
    WindfuryProps.C,
    WindfuryProps.R
> {
    constructor(loader?: Loader<WindfuryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Windfury',
                    desc: 'Can attack twice each turn.',
                    isAdvance: false,
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public active(isAdvance?: boolean): boolean {
        if (!isAdvance && this.state.isActive) return false;
        if (this.state.isActive && this.state.isAdvance) return false; 
        this.doActive(isAdvance);
        this.event.onActive(new Event({}));
        return true;
    }

    @TranxUtil.span()
    private doActive(isAdvance?: boolean) {
        this.draft.state.isActive = true;
        this.draft.state.isAdvance = isAdvance ?? false;
    }

    @StateUtil.on(self => self.route.role?.proxy.child.action.decor)
    protected onCheck(that: RoleActionModel, decor: Decor<RoleActionProps.S>) {
        if (!this.state.isActive) return;
        const offset = this.state.isAdvance ? 3 : 1;
        decor.current.origin += offset;
    }

    @TranxUtil.span()
    public disable(): void {
        super.disable();
        this.draft.state.isAdvance = false;
    }
}
