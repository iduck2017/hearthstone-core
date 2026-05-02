import { Model, useChild, useMemo, useRoute } from "set-piece";
import { LauncherModel } from "../rules/deployers";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { CostModel } from "../rules/cost";
import { BattlecryModel } from "../feats/battlecry";
import { DeathrattleModel } from "../feats/deathrattle";
import { FeatModel } from "../feats";
import { DisposerModel } from "../rules/disposers";
import { DamageSourceModel } from "../rules/damage-source";
import { RestoreSourceModel } from "../rules/restore-source";
import { RarityType } from "../utils/enums";
import { ClassType } from "../utils/enums";
import { CardDeployerModel } from "../rules/deployers/card-deployer";
import { HandModel } from "../entities/hand";
import { DeckModel } from "../entities/deck";
import { GraveyardModel } from "../entities/graveyard";
import { WorkspaceModel } from "../entities/workspace";

export interface CardProps {
    cost: CostModel;
    feats?: FeatModel[];
    rarity: RarityType;
    class: ClassType;
}

export abstract class CardModel extends Model {
    constructor(props: CardProps) {
        super();
        this._cost = props?.cost ?? new CostModel();
        this._feats = props?.feats ?? [];
        this._rarity = props.rarity;
        this._class = props.class;
    }

    private _rarity: RarityType;
    @useMemo()
    public get rarity() {
        return this._rarity;
    }

    private _class: ClassType;
    @useMemo()
    public get class() {
        return this._class;
    }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() {
        return this._game;
    }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;
    @useMemo()
    public get player() {
        return this._player;
    }

    @useChild()
    private _cost: CostModel;
    @useMemo()
    public get cost() {
        return this._cost;
    }

    @useMemo()
    public get battlecries() {
        return this.feats.filter(i => i instanceof BattlecryModel);
    }

    @useMemo()
    public get deathrattles() {
        return this.feats.filter(i => i instanceof DeathrattleModel);
    }

    @useChild()
    protected _disposer?: DisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
    }

    @useChild()
    private _damageSource: DamageSourceModel = new DamageSourceModel();
    @useMemo()
    public get damageSource() {
        return this._damageSource;
    }

    @useChild()
    private _restoreSource: RestoreSourceModel = new RestoreSourceModel();
    @useMemo()
    public get restoreSource() {
        return this._restoreSource;
    }

    @useChild()
    public _feats: FeatModel[];
    @useMemo()
    public get feats() {
        return [...this._feats];
    }
    
    public addFeat(buff: FeatModel) {
        this._feats.push(buff);
    }

    public removeFeat(buff: FeatModel) {
        const index = this._feats.indexOf(buff);
        if (index !== -1) return;
        this._feats.splice(index, 1);
    }

    @useRoute(() => HandModel)
    protected _hand?: HandModel;
    @useMemo()
    public get hand() { return this._hand; }

    @useRoute(() => DeckModel)
    protected _deck?: DeckModel;

    @useRoute(() => GraveyardModel)
    protected _graveyard?: GraveyardModel;

    @useRoute(() => WorkspaceModel)
    protected _workspace?: WorkspaceModel;

    @useChild()
    protected abstract _deployer: CardDeployerModel;
    @useMemo()
    public get deployer() {
        return this._deployer;
    }
}
