import { asChild, Model } from "set-piece";
import { HealthModel } from "../rules/health";
import { AttackModel } from "../rules/attack";
import { MinionModel } from "./minion";
import { registerDisposer, useCardDisposer } from "../utils/dispose";

export type RoleModel = HeroModel | MinionModel;

export abstract class HeroModel extends Model {

    @asChild()
    private _health: HealthModel;
    public get health() {
        return this._health;
    }

    @asChild()
    private _attack: AttackModel;
    public get attack() {
        return this._attack;
    }

    constructor(props?: {
        attack?: AttackModel,
        health?: HealthModel,
    }) {
        super();
        this._attack = props?.attack ?? new AttackModel({ origin: 0 });
        this._health = props?.health ?? new HealthModel({ origin: 30 });
    }


    @useCardDisposer()
    public receiveDamage(options: {
        value: number;
    }) {
        // registerDisposer(this);
        console.log('Receive damage', options.value);
        this.health.loseCurrent(options.value);
    }

}