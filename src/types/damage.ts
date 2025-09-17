import { Event, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { DamageModel } from "../models/actions/damage";
import { CardModel, HeroModel } from "..";

export enum DamageType {
    DEFAULT = 0,
    ATTACK = 1,
    DEFEND,
    SPELL,
    SKILL
}

export class DamageEvent extends Event {
    public readonly type?: DamageType;
    public readonly source: CardModel | HeroModel;
    public readonly detail: Model;
    public readonly target: RoleModel;
    public readonly origin: number;

    private _result: number;
    public get result() { return this._result; }
    public set result(value: number) { this._result = value; }

    constructor(props: {
        type?: DamageType;
        source: CardModel | HeroModel;
        detail: Model;
        target: RoleModel;
        origin: number;
    }) {
        super();
        this.type = props.type;
        this.source = props.source;
        this.detail = props.detail;
        this.target = props.target;
        this.origin = props.origin;
        this._result = props.origin;
    }
}