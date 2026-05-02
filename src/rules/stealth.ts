import { useModel } from "set-piece";
import { FeatModel } from "../feats";

@useModel('stealth-model')
export class StealthModel extends FeatModel {
    protected _brand: symbol = Symbol('stealth-model');

    public active() { super.active(); }
    public deactive() { this.disable(); }
}
