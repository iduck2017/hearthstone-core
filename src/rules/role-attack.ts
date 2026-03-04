import { asChildList, asDependency, asRoute, asState, Model, useEffect, useMemory, useRange } from "set-piece";
import { MinionModel } from "../entities/minion";
import { RoleModel } from "../entities/role";
import { PlayerModel } from "../entities/player";

export interface AttackDecor {
    readonly name: string;
    readonly value: number;
    readonly id?: string;
}

export class RoleAttackModel extends Model {

    @useRange(0, undefined)
    @asState()
    @asDependency()
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    @asRoute(() => RoleModel)
    private _role?: RoleModel;
    public get role() {
        return this._role;
    }

    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @asState()
    @asDependency(true)
    private _buffs: AttackDecor[];

    @useMemory()
    @useRange(0, undefined)
    public get current() {
        let result = this._origin;
        this._buffs?.forEach(buff => {
            result += buff.value;
        });
        return result;
    }

    constructor(props?: {
        origin?: number;
        buffs?: AttackDecor[];
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._buffs = props?.buffs ?? [];
    }

    public getSelector() {
        const player = this._player;
        const opponent = player?.opponent;
        if (!opponent) return;
        const minions = opponent.board.minions;
        let options = [...minions, opponent.hero].map(item => item.role);
        if (options.find(role => role.taunt.isActived)) {
            options = options.filter(role => role.taunt.isActived);
        }
        return { options }
    }

    public async getTarget() {
        const selector = this.getSelector();
        if (!selector) return;
        const player = this._player;
        if (!player) return;
        const target = await player.controller.fetchTarget(selector);
        if (!target) return;
        return target
    }

    public run(options: {
        target: RoleModel;
    }) {
        const { target } = options;
        const role = this.role;
        if (!role) return;
        role.receiveDamage({
            value: target.attack.current,
        })
        target.receiveDamage({
            value: this.current,
        })
    }
}