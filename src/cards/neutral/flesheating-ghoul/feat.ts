import { useModel, useAction } from "set-piece";
import { FeatModel } from "../../../feats";
import { MinionDisposePostEvent, useMinionDisposeEventConsumer } from "../../../rules/disposers/minion-disposer";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { FlesheatingGhoulBuffModel } from "./buff";
import { MinionModel } from "../../minion";

@useModel('flesheating-ghoul-feat-model')
export class FlesheatingGhoulFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('flesheating-ghoul-feat-model');

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @useMinionDisposeEventConsumer()
    protected _handleMinionDestroy(_event: MinionDisposePostEvent) {
        const minion = this.entity;
        if (!minion) return;
        minion.addFeat(new FlesheatingGhoulBuffModel());
    }
}
