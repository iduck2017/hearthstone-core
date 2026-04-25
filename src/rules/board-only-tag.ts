import { Model, useMemo, useRoute } from "set-piece";
import { FeatModel } from "../feats";
import { FeatActiveDecor, useFeatActiveDecorConsumer } from "../decors/feat-active";
import { BoardModel } from "../entities/board";
import { HeroModel } from "../heroes";

export class BoardOnlyTagModel extends Model {
    constructor() {
        super();
        this.init();
    }

    @useRoute(() => FeatModel)
    private _feat?: FeatModel;
    @useMemo()
    public get feat() {
        return this._feat;
    }

    @useRoute(() => BoardModel)
    private _board?: BoardModel;

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;

    // Disable the parent feat when its entity is neither on the board nor a hero.
    @useFeatActiveDecorConsumer()
    private _handleFeatActive(decor: FeatActiveDecor) {
        if (this._hero) return;
        if (this._board) return
        decor.disable();
    }
}
