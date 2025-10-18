import { DebugUtil, Event, Method, Model, TemplUtil, TranxUtil } from "set-piece";
import { PlayerModel } from "../../player";

export namespace ManaModel {
    export type E = {
        onRestore: Event<{ value: number }>;
        onConsume: Event<{ value: number; reason?: Model }>;
    };
    export type S = {
        origin: number;
        current: number;
        maximum: number;
    }
    export type C = {};
    export type R = {};
}

@TemplUtil.is('mana')
export class ManaModel extends Model<
    ManaModel.E,
    ManaModel.S,
    ManaModel.C,
    ManaModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.list.find(item => item instanceof PlayerModel),
        }
    }

    public get chunk() {
        return {
            current: this.state.current,
            origin: this.state.origin,
            maximum: this.state.maximum,
        }
    }

    constructor(props?: ManaModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                origin: 0,
                current: props?.state?.origin ?? 0,
                maximum: 10,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer }, 
        })
    }

    @TranxUtil.span()
    public reset() {
        const player = this.route.player;
        if (!player) return;
        if (this.origin.state.origin < this.origin.state.maximum) {
            this.origin.state.origin += 1;
        }
        DebugUtil.log(`${player.name} reset mana to ${this.origin.state.origin}`);
        this.origin.state.current = this.origin.state.origin;
    }

    public consume(value: number, reason?: Model) {
        if (value > this.origin.state.current) value= this.origin.state.current;
        const player = this.route.player;
        if (!player) return;
        DebugUtil.log(`${player.name} use ${value} mana`);
        this.origin.state.current -= value;
        this.event.onConsume(new Event({ value, reason }));
    }

    public restore(value: number) {
        this.origin.state.current += value;
        const player = this.route.player;
        if (!player) return;
        DebugUtil.log(`${player.name} restore ${value} mana`);
        this.event.onRestore(new Event({ value }));
    }
}