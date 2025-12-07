import { Model, State, TranxService } from "set-piece";
import { SchoolType } from "../../../types/card";
import { SpellEffectModel } from "../../..";
import { CardModel } from ".";
import { SpellPerformModel } from "../../rules/perform/spell";

export namespace SpellCardModel {
    export type S = {
        readonly schools: SchoolType[];
    };
    export type E = {};
    export type C = {
        readonly perform: SpellPerformModel;
        readonly effects: SpellEffectModel[];
    };
    export type R = {};
}

@TranxService.span(true)
export abstract class SpellCardModel<
    E extends Partial<SpellCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<SpellCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<SpellCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<SpellCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    E & SpellCardModel.E,
    S & SpellCardModel.S,
    C & SpellCardModel.C,
    R & SpellCardModel.R
> {
    public get chunk() {
        const result = super.chunk;
        const schools = this.state.schools;
        return {
            ...result,
            schools: schools.length ? schools : undefined,
        }
    }

    constructor(props: SpellCardModel['props'] & {
        state: S & State<CardModel.S & SpellCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                perform: props.child.perform ?? new SpellPerformModel(),
                effects: props.child.effects ?? [],
                feats: props.child.feats ?? [],
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    @TranxService.span()
    public deploy() {
        const player = this.route.player;
        if (!player) return;
        
        const hand = player.child.hand;
        if (!hand) return;
        hand.del(this);
        
        const graveyard = player.child.graveyard;
        if (!graveyard) return;
        graveyard.add(this);
    }
}