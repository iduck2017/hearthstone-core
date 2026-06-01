import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { BoardOnlyControllerModel } from "../../../feats/board-only-controller";
import { MinionSummonPostEvent, usePlayerMinionSummonEventConsumer } from "../../../rules/deployers/minion-deployer";
import { RaceType } from "../../../utils/enums";
import { MurlocTidecallerBuffModel } from "./buff";

@useModel('murloc-tidecaller-feat-model')
export class MurlocTidecallerFeatModel extends FeatModel {
    protected _brand: symbol = Symbol('murloc-tidecaller-feat-model');

    constructor() {
        super({ subFeats: [new BoardOnlyControllerModel()] });
    }

    @usePlayerMinionSummonEventConsumer()
    protected _handleMinionSummon(event: MinionSummonPostEvent) {
        const minion = this.entity;
        if (!minion) return;
        if (event.minion === minion) return;
        if (!event.minion.races.includes(RaceType.MURLOC)) return;
        minion.addFeat(new MurlocTidecallerBuffModel());
    }
}
