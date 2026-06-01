import { Model, useRef } from "set-piece";
import { BattlecryModel } from "../feats/battlecry";
import { SpellEffectModel } from "../feats/spell-effect";

export class DeployIntensionModel extends Model {
    @useRef()
    protected _feat: BattlecryModel | SpellEffectModel;

    @useRef()
    protected _params: Array<Model | undefined>

    constructor(props: {
        feat: BattlecryModel | SpellEffectModel,
        params: Array<Model | undefined>
    }) {
        super();
        this._feat = props.feat;
        this._params = props.params;
    }

    public async launch() {
        await this._feat.launch(...this._params);
    }
}
