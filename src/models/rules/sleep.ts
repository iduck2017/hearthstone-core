import { Event, Loader, Model } from "set-piece";

export namespace SleepProps {
    export type E = {
        onActive: Event;
        onDeactive: Event;
    };
    export type S = {
        isActive: boolean;
    }
    export type C = {};
    export type R = {}
}

export class SleepModel extends Model<
    SleepProps.E,
    SleepProps.S,
    SleepProps.C,
    SleepProps.R
> {
    constructor(loader?: Loader<SleepModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    public active() {
        this.draft.state.isActive = true;
        this.event.onActive(new Event({}));
    }

    public deactive(): void {
        this.draft.state.isActive = false;
        this.event.onDeactive(new Event({}));
    }
}