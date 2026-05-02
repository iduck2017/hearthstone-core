import { Model, useRef, useState } from "set-piece";
import { BattlecryModel } from "../feats/battlecry";

export class DeployIntensionModel extends Model {
    @useRef()
    protected _feat: BattlecryModel;

    @useRef()
    protected _params: Array<Model | undefined>

    constructor(props: {
        feat: BattlecryModel,
        params: Array<Model | undefined>
    }) {
        super();
        this._feat = props.feat;
        this._params = props.params;
    }

    public launch() {
        const feat = this._feat;
        const params = this._params;
        feat.run(...params);
    }
}