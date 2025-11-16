import { DebugUtil, Event, Model } from "set-piece";
import { HeroModel } from "../../entities/heroes";
import { PlayerModel } from "../../entities/player";

export namespace ArmorModel {
    export type E = {
        onRestore: Event<{ value: number }>;
        onConsume: Event<{ value: number }>;
    }
    export type S = {
        current: number;
    }
    export type C = {}
    export type R = {}
}

export class ArmorModel extends Model<
    ArmorModel.E,
    ArmorModel.S,
    ArmorModel.C,
    ArmorModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props?: ArmorModel['props']) {
        super({
            uuid: props?.uuid,
            state: {    
                current: 0,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public gain(value: number) {
        const player = this.route.player;
        DebugUtil.log(`${player?.name} restore ${value} Armor`);
        const result = this.add(value);
        this.event.onRestore(new Event({ value: result }));
        return result;
    }

    protected add(value: number) { 
        if (value <= 0) return 0;
        this.origin.state.current += value; 
        return value;
    }

    protected del(value: number) { 
        const player = this.route.player;
        value = Math.min(value, this.origin.state.current);
        if (value <= 0) return 0;
        DebugUtil.log(`${player?.name} lost ${value} Armor`);
        this.origin.state.current -= value;
        return value;
    }

    public consume(value: number) {
        const result = this.del(value);
        this.event.onConsume(new Event({ value: result }));
        return result;
    }
}