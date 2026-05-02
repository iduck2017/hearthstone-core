import { useChild, Model, useMemo, useRoute, useAction } from "set-piece";
import { HeroDisposerModel } from "../rules/disposers/hero-disposer";
import { RoleModel, RoleProps } from "../entities/role";
import { FeatModel } from "../feats";
import { DeathrattleModel } from "../feats/deathrattle";
import { DamageSourceModel } from "../rules/source/damage-source";
import { RestoreSourceModel } from "../rules/source/restore-source";
import { WeaponModel } from "../cards/weapon";
import { PlayerModel } from "../entities/player";

export interface HeroProps extends RoleProps {
    feats?: FeatModel[];
}

export abstract class HeroModel extends Model {
    constructor(props: HeroProps) {
        super();
        this._role = new RoleModel(props);
        this._deathrattles = [];
        this._disposer = new HeroDisposerModel();
        this._feats = props?.feats ?? [];
        this._damageSource = new DamageSourceModel();
        this._restoreSource = new RestoreSourceModel();
    }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;

    @useChild()
    private _damageSource: DamageSourceModel;
    @useMemo()
    public get damageSource() {
        return this._damageSource;
    }

    @useChild()
    private _restoreSource: RestoreSourceModel;
    @useMemo()
    public get restoreSource() {
        return this._restoreSource;
    }

    @useChild()
    private _deathrattles: DeathrattleModel[];
    @useMemo()
    public get deathrattles() {
        return [...this._deathrattles];
    }

    @useChild()
    public _feats: FeatModel[];
    @useMemo()
    public get feats() {
        return [...this._feats];
    }

    public addFeat(feat: FeatModel) {
        this._feats.push(feat);
    }

    public removeFeat(feat: FeatModel) {
        const index = this._feats.indexOf(feat);
        if (index !== -1) {
            this._feats.splice(index, 1);
        }
    }

    @useChild()
    private _role: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    @useChild()
    private _disposer: HeroDisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
    }

    @useChild()
    private _weapon?: WeaponModel;
    @useMemo()
    public get weapon() {
        return this._weapon;
    }

    /** Equip a weapon; if one is already equipped, replace it and send the old one to graveyard. */
    @useAction()
    public equipWeapon(weapon: WeaponModel) {
        const prevWeapon = this._weapon;
        if (prevWeapon) {
            this._weapon = undefined;
            this._player?.graveyard.addCard(prevWeapon);
        }
        this._weapon = weapon;
    }

    /** Remove the equipped weapon from the slot (does not send to graveyard). */
    @useAction()
    public unequipWeapon() {
        this._weapon = undefined;
    }
}
