import { useChild, useMemo } from "set-piece";
import { CardModel, CardProps } from ".";
import { WeaponAttackModel } from "../rules/weapon-attack";
import { WeaponDurabilityModel } from "../rules/weapon-durability";
import { WeaponDisposerModel } from "../rules/disposers/weapon-disposer";
import { WeaponLauncherModel } from "../rules/deployers/weapon-launcher";

export interface WeaponProps extends CardProps {
    /** Base attack value granted to the hero while equipped. */
    attack: number;
    /** Number of attacks before the weapon breaks. */
    durability: number;
}
export abstract class WeaponModel extends CardModel {
    constructor(props: WeaponProps) {
        super(props);
        const durability = new WeaponDurabilityModel({ current: props.durability });
        const disposer = new WeaponDisposerModel();
        this._durability = durability;
        this._disposer = disposer;
        this._attack = new WeaponAttackModel({ origin: props.attack });
    }

    @useChild()
    private _attack: WeaponAttackModel;
    @useMemo()
    public get attack() {
        return this._attack;
    }

    @useChild()
    private _durability: WeaponDurabilityModel;
    @useMemo()
    public get durability() {
        return this._durability;
    }

    @useChild()
    protected _disposer: WeaponDisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
    }

    @useChild()
    protected _deployer: WeaponLauncherModel = new WeaponLauncherModel();
}
