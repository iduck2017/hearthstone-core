import { Model, useChild, useMemo, useRoute } from "set-piece";
import { LauncherModel } from "../rules/launcher";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { CostModel } from "../rules/cost";
import { BattlecryModel } from "../feats/battlecry";
import { DeathrattleModel } from "../feats/deathrattle";
import { FeatModel } from "../feats";
import { DisposerModel } from "../rules/disposers";
import { DamageSourceModel } from "../rules/damage-source";
import { RestoreSourceModel } from "../rules/restore-source";
import { RarityType } from "../rules/rarity";
import { ClassType } from "../rules/class";
import { CardLauncherModel } from "../rules/launcher/card-launcher";
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
    public consumeMana() {
        if (!this._player) return;
        const cost = this._cost.current;
        this._player.mana.consume(cost);
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

    /** Move this card from hand/deck/graveyard into the given player's workspace. */
    public moveToWorkspace(player?: PlayerModel) {
        player = player ?? this._player;
        if (!player) return;
        this._hand?.removeCard(this);
        this._deck?.removeCard(this);
        this._graveyard?.removeCard(this);
        player.workspace.addCard(this);
    }

    /** Move this card from workspace into the owning player's graveyard. */
    public moveToGraveyard() {
        const player = this._player;
        if (!player) return;
        this._workspace?.removeCard(this);
        player.graveyard.addCard(this);
    }

    @useChild()
    protected abstract _launcher: CardLauncherModel;
    @useMemo()
    public get launcher() {
        return this._launcher;
    }
}
