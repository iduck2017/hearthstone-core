import { useModel } from "set-piece";
import { FeatModel } from "../feats";

@useModel('taunt-model')
export class TauntModel extends FeatModel {
    protected _brand: symbol = Symbol('taunt-model');

    public active() { super.active(); }
    public deactive() { this.disable(); }
}
