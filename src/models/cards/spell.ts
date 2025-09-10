import { DebugUtil, Event, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps } from ".";
import { SpellModel } from "../spell";

export type SpellCardEvent = {
    effects: Map<SpellModel, Model[]>;
}

export namespace SpellCardProps {
    export type S = {};
    export type E = {};
    export type C = {
        effects: SpellModel[],
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

    // equip
    public async play() {
        if (!this.state.isActive) return;
        const player = this.route.player;
        if (!player) return;
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
    }

    protected async doPlay(event: SpellCardEvent) {

    }
}