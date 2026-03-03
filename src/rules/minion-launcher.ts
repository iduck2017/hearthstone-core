import { asRoute, asState, Model } from "set-piece";
import { BattlecryModel } from "../hooks/battlecry";
import { MinionModel } from "../entities/minion";

export type TargetsRegistry = Array<{ hook: BattlecryModel, params: Array<Model | undefined> }>;

export interface MinionLaunchProps {
    handIndex: number;
    boardIndex: number;
    targetsRegistry: TargetsRegistry;
}

export class MinionLauncherModel extends Model {
    @asState()
    private _handIndex: number;

    @asState()
    private _boardIndex: number;
  
    @asState()
    private _targetsRegistry: TargetsRegistry;

    @asState()
    private _currentStep: number;

    @asRoute(() => MinionModel)
    private _minion?: MinionModel;


    constructor(props: MinionLaunchProps) {
        super();
        this._handIndex = props.handIndex;
        this._boardIndex = props.boardIndex;
        this._targetsRegistry = props.targetsRegistry;
        this._currentStep = 0;
    }

    public async next(): Promise<boolean> {
        if (!this._targetsRegistry) return false;

        const currentHook = this._targetsRegistry[this._currentStep];
        /** End */
        if (!currentHook) {
            return true;
        }
        /** Run hooks */
        await currentHook.hook.run(currentHook.params);
        this._currentStep += 1
        return false;
    }
    
}