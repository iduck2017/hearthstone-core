import { Event, Model } from "set-piece";
import { RoleModel } from "../models/role";
import { RestoreModel } from "../models/actions/restore";
import { CardModel, HeroModel } from "..";

export class RestoreEvent extends Event {
    public readonly target: RoleModel;
    public readonly source: CardModel | HeroModel;
    public readonly detail: Model;
    public readonly origin: number;

    private _result: number;
    public get result() { return this._result; }
    public set result(value: number) { this._result = value; }

    constructor(props: {
        target: RoleModel;
        source: CardModel | HeroModel;
        detail: Model;
        origin: number;
    }) {
        super();
        this.target = props.target;
        this.source = props.source;
        this.detail = props.detail;
        this.origin = props.origin;
        this._result = props.origin;
    }
}