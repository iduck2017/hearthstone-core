import { Event, Method, Model, Props } from "set-piece";
import { CardModel, CardProps } from ".";
import { EffectModel } from "../features/effect";
import { DeployModel } from "../rules/deploy";

export type SpellCardEvent = {
    effect: Map<EffectModel, Model[]>;
}

export namespace SpellCardProps {
    export type S = {};
    export type E = {};
    export type C = {
        effects: EffectModel[],
        deploy?: DeployModel;
    };
    export type R = {};
}

export class SpellCardModel<
    E extends Partial<SpellCardProps.E & CardProps.E> & Props.E = {},
    S extends Partial<SpellCardProps.S & CardProps.S> & Props.S = {},
    C extends Partial<SpellCardProps.C & CardProps.C> & Props.C = {},
    R extends Partial<SpellCardProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    E & SpellCardProps.E,
    S & SpellCardProps.S,
    C & SpellCardProps.C,
    R & SpellCardProps.R
> {
    constructor(loader: Method<SpellCardModel['props'] & {
        state: S & Omit<CardProps.S, 'isActive'>;
        child: C & Pick<CardProps.C, 'cost'>
        refer: R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    effects: [],
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }

    // play
    public async play() {
        const event = await this.toPlay();
        if (!event) return
        this.doPlay(event);
        this.event.onPlay(new Event({}))
    }

    protected async toPlay() {
        // status 
        if (!this.state.isActive) return;
        // spell
        const effect = await EffectModel.toRun(this.child.effects);
        if (!effect) return;
        const event: SpellCardEvent = {
            effect
        };
        // event
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
        return event;
    }

    protected async doPlay(event: SpellCardEvent) {
        const player = this.route.player;
        if (!player) return;
        // mana
        const mana = player.child.mana;
        const cost = this.child.cost;
        mana.use(cost.state.current);
        // hand
        const hand = player.child.hand;
        hand.use(this);
        await this.run(event);
        hand.del(this);
    }

    
    private async run(event: SpellCardEvent) {
        const signal = this.event.toRun(new Event({}));
        if (signal.isCancel) return;
        const player = this.route.player;
        if (!player) return;
        // spell
        const spells = this.child.effects;
        for (const item of spells) {
            const params = event.effect.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        const board = player.child.board;
        this.child.deploy?.run(board);
    }

}