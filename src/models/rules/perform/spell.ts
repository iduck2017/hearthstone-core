import { PerformModel } from ".";
import { EffectModel } from "../effect";
import { SpellCastEvent, SpellHooksOptions } from "../../features/spell";
import { SpellCardModel, SpellEffectModel } from "../../..";

export namespace SpellPerformModel {
    export type E = {
        toRun: SpellCastEvent;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { spell: SpellCardModel; };
}

export class SpellPerformModel extends PerformModel<
    [SpellHooksOptions],
    SpellPerformModel.E,
    SpellPerformModel.S,
    SpellPerformModel.C,
    SpellPerformModel.R
> {
    public get route() {
        const result = super.route;
        const spell: SpellCardModel | undefined = result.list.find(item => item instanceof SpellCardModel);
        return {
            ...result,
            spell,
        }
    }

    constructor(props?: SpellPerformModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
    
    public async toRun(): Promise<[SpellHooksOptions] | undefined> {
        const spell = this.route.spell;
        if (!spell) return;
        // spell
        const feats = spell.child.feats;
        const effects = await SpellEffectModel.toRun(feats.child.effects);
        if (!effects) return;
        return [{ effects }];
    }
    
    public async run(from: number, options: SpellHooksOptions) {
        const spell = this.route.spell;
        if (!spell) return;
        
        const event = new SpellCastEvent({ options: options })
        this.event.toRun(event);
        if (event.detail.isAbort) return;
        options = event.detail.options;
        
        const player = this.route.player;
        if (!player) return;
        // spell
        const effects = spell.child.feats.child.effects;
        for (const item of effects) {
            const params = options.effects.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        const board = player.child.board;
        spell.child.deploy?.run(board);
    }
}