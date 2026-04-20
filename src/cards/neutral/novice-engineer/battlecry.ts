import { BattlecryModel } from "../../../features/battlecry";
import { Model } from "set-piece";
import { Selector } from "../../../utils/controller";
import { useBattlecryRunHook } from "../../../hooks/battlecry-run";

export class NoviceEngineerBattlecryModel extends BattlecryModel<Model> {
    constructor() {
        super();
        this.init();
    }

    public getSelector(params: Array<Model | undefined>): Selector<Model> | undefined {
        return undefined;
    }

    @useBattlecryRunHook()
    protected async handleRun(): Promise<void> {
        this.player?.drawCard();
    }
}
