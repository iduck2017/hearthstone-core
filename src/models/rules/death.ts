import { Event, Loader, Model } from "set-piece";
import { DeathUtil } from "../../utils/death";
import { RoleModel } from "../role";
import { MinionModel } from "../cards/minion";
import { DestroyEvent, DestroyModel } from "../actions/destroy";
import { CardModel } from "../cards";
import { CharacterModel } from "../characters";
import { DamageEvent } from "../../types/damage";
import { DamageModel } from "../actions/damage";

export enum DeathStatus {
    INACTIVE = 0,
    ACTIVE_PREV = 1,
    ACTIVE = 2,
}


export namespace DeathProps {
    export type E = {
        onActive: Event;
        toDestroy: DestroyEvent;
        onDestroy: Event;
    }
    export type S = {
        status: DeathStatus;
        isDestroy: boolean;
    }
    export type C = {}
    export type R = {
        reason?: DestroyModel | DamageModel;
    }
}

export class DeathModel extends Model<
    DeathProps.E,
    DeathProps.S,
    DeathProps.C,
    DeathProps.R
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel)
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        const character: CharacterModel | undefined = route.order.find(item => item instanceof CharacterModel);
        const entity = character ?? card;
        return {
            ...route,
            card,
            minion,
            entity,
            role: route.order.find(item => item instanceof RoleModel),
        }
    }

    constructor(loader?: Loader<DeathModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    status: DeathStatus.INACTIVE,
                    isDestroy: false,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    @DeathUtil.span()
    public destroy(event: DestroyEvent) {
        if (event.isCancel) return false;
        event = this.event.toDestroy(event);
        if (event.isCancel) return false;
        if (this.state.isDestroy) return false;
        this.draft.state.isDestroy = true;
        this.draft.refer.reason = event.detail.source;
        this.draft.state.status = DeathStatus.ACTIVE_PREV;
        DeathUtil.add(this);
        return true;
    }

    public active(event: DamageEvent) {
        if (this.state.status) return false;
        this.draft.refer.reason = event.detail.source;
        this.draft.state.status = DeathStatus.ACTIVE_PREV;
        DeathUtil.add(this);
    }

    public cancel() {
        if (!this.state.status) return false
        if (this.state.isDestroy) return false;
        this.draft.refer.reason = undefined;
        this.draft.state.status = DeathStatus.INACTIVE;
    }
    
    public onActive() {
        if (!this.state.status) return;
        this.draft.state.status = DeathStatus.ACTIVE;
        this.event.onActive(new Event({}));
        if (!this.state.isDestroy) return;
        this.event.onDestroy(new Event({}));
    }
}