import { Event, Method, Model, State, TranxUtil } from "set-piece";
import { EffectModel } from "../features/hooks/effect";
import { SpellCastEvent, SpellFeaturesModel, SpellHooksOptions } from "../features/group/spell";
import { SchoolType } from "../../types/card-enums";
import { SpellEffectModel } from "../..";
import { CardModel } from ".";
import { BoardModel } from "./group/board";
import { SpellPlayModel } from "./spell-play";
import { AbortEvent } from "../../types/abort-event";

export namespace SpellCardModel {
    export type S = {
        readonly schools: SchoolType[];
    };
    export type E = {
        toCast: SpellCastEvent;
    };
    export type C = {
        readonly play: SpellPlayModel;
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
    public get chunk() {
        const result = super.chunk;
        const schools = this.state.schools;
        return {
            ...result,
            schools: schools.length ? schools : undefined,
        }
    }

    public get status(): boolean {
        if (!super.status) return false;
        // need target
        const effects = this.child.feats.child.effects;
        const selectors = SpellEffectModel.getSelector(effects);
        if (!selectors) return false;
        return true;
    }

    constructor(props: SpellCardModel['props'] & {
        state: S & State<Omit<CardModel.S, 'isActive'> & SpellCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                play: props.child.play ?? new SpellPlayModel(),
                feats: props.child.feats ?? new SpellFeaturesModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    protected async toUse(): Promise<[SpellHooksOptions] | undefined> {
        const player = this.route.player;
        if (!player) return;
        // spell
        const effects = this.child.feats.child.effects;
        const result = await SpellEffectModel.toRun(player, effects);
        if (!result) return;
        return [{ effects: result }];
    }
    
    public use(from: number, options: SpellHooksOptions) {
        const event = new AbortEvent({})
        this.event.toUse(event);
        if (event.detail.isAbort) return;

        const castEvent = new SpellCastEvent({ options: options })
        this.event.toCast(castEvent);
        if (castEvent.detail.isAbort) return;
        options = castEvent.detail.options;
        
        const player = this.route.player;
        if (!player) return;

        // effect
        this.child.play.run(from, options);
    }

    public onUse(from: number, options: SpellHooksOptions) {
        const player = this.route.player;
        if (!player) return;
        // end
        const board = player.child.board;
        if (!board) return;
        this.event.onUse(new Event({}));
    }

    public deploy(board?: BoardModel) {}

}