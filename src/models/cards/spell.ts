import { DebugUtil, Event, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps } from ".";
import { SelectUtil } from "../../utils/select";
import { EffectModel } from "../features/effect";
import { PlayerModel } from "../player";
import { DeployModel } from "../rules/deploy";

export type SpellCardEvent = {
    spell: Map<EffectModel, Model[]>;
}

export namespace SpellCardProps {
    export type S = {};
    export type E = {};
    export type C = {
        spells: EffectModel[],
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
                    spells: [],
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
        const event: SpellCardEvent = {
            spell: new Map(),
        };
        const spells = this.child.spells;
        for (const item of spells) {
            const selectors = item.toRun();
            // condition not match
            if (!selectors) continue;
            for (const item of selectors) {
                if (!item.options.length) return;
            }
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                // user cancel
                if (result === undefined) return;
                params.push(result);
            }
            event.spell.set(item, params);
        }
        // event
        const signal = this.event.toPlay(new Event({}));
        console.log('cancel?', signal.isCancel);
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
        const spells = this.child.spells;
        for (const item of spells) {
            const params = event.spell.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        const board = player.child.board;
        this.child.deploy?.run(board);
    }

}