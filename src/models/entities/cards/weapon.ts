import { Event, Model, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { WeaponAttackModel } from "../../features/rules/weapon-attack";
import { WeaponActionModel } from "../../features/rules/weapon-action";
import { WeaponDisposeModel } from "../../features/dispose/weapon";
import { FeatureModel } from "../../features";
import { BattlecryModel } from "../../features/hooks/battlecry";
import { EndTurnHookModel } from "../../features/hooks/end-turn";
import { StartTurnHookModel } from "../../features/hooks/start-turn";
import { WeaponPerformModel } from "../../features/perform/weapon";
import { DeathrattleModel } from "../../features/hooks/deathrattle";

export namespace WeaponCardModel {
    export type S = {};
    export type E = {};
    export type C = {
        readonly attack: WeaponAttackModel;
        readonly action: WeaponActionModel;

        readonly perform: WeaponPerformModel;
        readonly dispose: WeaponDisposeModel;

        readonly feats: FeatureModel[];
        readonly battlecry: BattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
        readonly startTurn: StartTurnHookModel[];
        readonly endTurn: EndTurnHookModel[];
    };
    export type R = {};
}

@TranxUtil.span(true)
export abstract class WeaponCardModel<
    E extends Partial<WeaponCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<WeaponCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<WeaponCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<WeaponCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    E & WeaponCardModel.E,
    S & WeaponCardModel.S,
    C & WeaponCardModel.C,
    R & WeaponCardModel.R
> {
    public get chunk() {
        const result = super.chunk;
        const hand = this.route.hand;
        const board = this.route.board;
        if (hand || board) {
            return {
                ...result,
                attack: this.child.attack.chunk,
                durability: this.child.action.chunk,
            }
        }
        return {
            ...result,
            attack: this.child.attack.state.origin,
            durability: this.child.action.state.origin,
        }
    }

    constructor(props: WeaponCardModel['props'] & {
        state: S & WeaponCardModel.S & CardModel.S;
        child: C & Pick<WeaponCardModel.C, 'attack' | 'action'> & Pick<CardModel.C, 'cost'>;
        refer: R & WeaponCardModel.R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                perform: props.child.perform ?? new WeaponPerformModel(),
                dispose: props.child.dispose ?? new WeaponDisposeModel(),
                feats: props.child.feats ?? [],
                battlecry: props.child.battlecry ?? [],
                deathrattle: props.child.deathrattle ?? [],
                startTurn: props.child.startTurn ?? [],
                endTurn: props.child.endTurn ?? [],
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }


    public buff(feat: BattlecryModel): void;
    public buff(feat: DeathrattleModel): void;
    public buff(feat: StartTurnHookModel): void;
    public buff(feat: EndTurnHookModel): void;
    public buff(feat: FeatureModel): void;
    public buff(feat: FeatureModel): void {
        const child = this.origin.child;
        if (feat instanceof BattlecryModel) child.battlecry.push(feat);
        else if (feat instanceof StartTurnHookModel) child.startTurn.push(feat);
        else if (feat instanceof EndTurnHookModel) child.endTurn.push(feat);
        else if (feat instanceof DeathrattleModel) child.deathrattle.push(feat);
        else if (feat instanceof FeatureModel) child.feats.push(feat);
    }
}