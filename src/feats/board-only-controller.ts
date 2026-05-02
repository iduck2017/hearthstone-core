import { Model, useMemo, useRoute, useModel } from "set-piece";
import { FeatModel, BaseFeatModel } from ".";
import { FeatActiveDecor, useFeatActiveDecorConsumer } from "../decors/feat-active";
import { BoardModel } from "../entities/board";
import { HeroModel } from "../heroes";

@useModel('board-only-tag-model')
export class BoardOnlyControllerModel extends BaseFeatModel {
    protected _brand: symbol = Symbol('board-only-tag-model');

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
