import { Model } from "set-piece";
import { GameModel } from ".";
import { PlayerModel } from "../player";
import { TurnModel } from "./turn";

export namespace JudgeModel {
    export type State = {};
    export type Event = {};
    export type Child = {};
    export type Refer = {
        winner?: PlayerModel;
    };
}

export class JudgeModel extends Model<
    JudgeModel.Event, 
    JudgeModel.State, 
    JudgeModel.Child, 
    JudgeModel.Refer
> {
    constructor(props: JudgeModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get route(): Model['route'] & { 
        game?: GameModel 
        turn?: TurnModel
    } {
        return {
            ...super.route,
            game: this.assert(1, GameModel),
        }
    }

    public check() {

    }
}