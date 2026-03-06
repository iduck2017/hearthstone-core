import { asChildList, asDependency, asRoute, asState, Model, useMemory, useRange } from "set-piece";
import { RoleModel } from "../entities/role";
import { PlayerModel } from "../entities/player";
import { RoleAttackDecorModel } from "./role-attack-decor";

export class RoleAttackModel extends Model {
    constructor(props?: {
        origin?: number;
    }) {
        super();
        this._origin = props?.origin ?? 1;
        this._decors = [];
        this._isHeroSelectable = false;
    }

    // Routes
    @asRoute(() => RoleModel)
    private _role?: RoleModel;
    public get role() {
        return this._role;
    }

    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;

    // Origin
    @useRange(0, undefined)
    @asState()
    @asDependency()
    private _origin: number;
    public get origin() {
        return this._origin;
    }

    // Current
    @asChildList()
    @asDependency(true)
    private _decors: RoleAttackDecorModel[];

    public addDecor(decor: RoleAttackDecorModel) {
        this._decors.push(decor);
    }

    public removeDecor(decor: RoleAttackDecorModel) {
        const index = this._decors.indexOf(decor);
        if (index !== -1) {
            this._decors.splice(index, 1);
        }
    }

    @useMemory()
    @useRange(0, undefined)
    public get current() {
        let result = this._origin;
        this._decors?.forEach(buff => {
            result += buff.value;
        });
        return result;
    }

    // Select
    @asState()
    private _isHeroSelectable: boolean;
    public get isHeroSelectable() {
        return this._isHeroSelectable;
    }

    public setHeroSelectable(value: boolean) {
        this._isHeroSelectable = value;
    }


    public getSelector() {
        const player = this._player;
        const opponent = player?.opponent;
        if (!opponent) return;
        // Get all roles
        const minions = opponent.board.minions;
        let options = [...minions, opponent.hero].map(item => item.role);
        // Filter stealth
        options = options.filter(role => !role.stealth.isActived);
        // Filter hero if not selectable
        if (!this._isHeroSelectable) {
            options = options.filter(role => role !== opponent.hero.role);
        }
        // Filter taunt
        if (options.find(role => role.taunt.isActived)) {
            options = options.filter(role => role.taunt.isActived);
        }
        return { options }
    }

    public async getTarget() {
        // Get player
        const player = this._player;
        if (!player) return;
        // Get selector
        const selector = this.getSelector();
        if (!selector) return;
        // Get target
        const target = await player.controller.fetchTarget(selector);
        if (!target) return;
        return target
    }


    // Attack
    public run(options: {
        target: RoleModel;
    }) {
        // Check role
        const role = this.role;
        if (!role) return;
        // Deal damage to each other
        const { target } = options;
        role.receiveDamage({ value: target.attack.current })
        target.receiveDamage({ value: this.current })
    }
}