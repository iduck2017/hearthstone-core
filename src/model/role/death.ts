import { Model } from "set-piece";
import { DamageEvent } from "../..";
import { DeathUtil } from "../../utils/death";
import { RoleModel } from ".";
import { CardModel } from "../card";
import type { AnchorEvent, AnchorModel } from "../anchor";

export enum DeathStatus {
    INACTIVE = 0,
    ACTIVE_PREV = 1,
    ACTIVE = 2,
}

export namespace DeathModel {
    export type Event = {
        onActive: {};
        toDestroy: AnchorEvent;
        onDestroy: {};
    }
    export type State = {
        status: DeathStatus;
        isDestroy: boolean;
    }
    export type Child = {}
    export type Refer = {
        reason?: AnchorModel;
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
                status: DeathStatus.INACTIVE,
                isDestroy: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DeathUtil.span()
    public destroy(event: AnchorEvent) {
        if (event.isAbort) return false;
        event = this.event.toDestroy(event);
        if (event.isAbort) return false;
        if (this.state.isDestroy) return false;
        this.draft.state.isDestroy = true;
        this.draft.refer.reason = event.source;
        this.draft.state.status = DeathStatus.ACTIVE_PREV;
        DeathUtil.add(this);
        return true;
    }

    public active(event: DamageEvent) {
        if (this.state.status) return false;
        this.draft.refer.reason = event.source;
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
        this.event.onActive({});
        if (!this.state.isDestroy) return;
        this.event.onDestroy({});
    }
}