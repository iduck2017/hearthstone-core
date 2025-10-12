import { Event, Method, Model, State, TranxUtil } from "set-piece";
import { EffectModel } from "../features/hooks/effect";
import { SpellCastEvent, SpellFeaturesModel, SpellHooksOptions } from "../features/group/spell";
import { SchoolType } from "../../types/card-enums";
import { SpellEffectModel } from "../..";
import { CardModel } from ".";
import { BoardModel } from "../board";

export namespace SpellCardModel {
    export type S = {
        readonly schools: SchoolType[];
    };
    export type E = {
        toCast: SpellCastEvent;
    };
    export type C = {
        readonly feats: SpellFeaturesModel;
    };
    export type R = {};
}

@TranxUtil.span(true)
export abstract class SpellCardModel<
    E extends Partial<SpellCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<SpellCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<SpellCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<SpellCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    [SpellHooksOptions],
    E & SpellCardModel.E,
    S & SpellCardModel.S,
    C & SpellCardModel.C,
    R & SpellCardModel.R
> {
    constructor(props: SpellCardModel['props'] & {
        state: S & State<Omit<CardModel.S, 'isActive'> & SpellCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                feats: props.child.feats ?? new SpellFeaturesModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    protected async toUse(): Promise<[SpellHooksOptions] | undefined> {
        // spell
        const feats = this.child.feats;
        const effects = await SpellEffectModel.toRun(feats.child.effects);
        if (!effects) return;
        return [{ effects }];
    }
    
    public async use(from: number, options: SpellHooksOptions) {
        const event = new SpellCastEvent({ options: options })
        this.event.toUse(event);
        this.event.toCast(event);
        if (event.detail.isAbort) return;
        options = event.detail.options;
        
        const player = this.route.player;
        if (!player) return;
        // spell
        const effects = this.child.feats.child.effects;
        for (const item of effects) {
            const params = options.effects.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        const board = player.child.board;
        this.deploy(board);
    }

    public deploy(board: BoardModel) {}
}