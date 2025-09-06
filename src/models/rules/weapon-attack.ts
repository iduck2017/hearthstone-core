import { Loader, Model } from "set-piece";

export namespace WeaponAttackProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

export class WeaponAttackModel extends Model<
    WeaponAttackProps.E,
    WeaponAttackProps.S,
    WeaponAttackProps.C,
    WeaponAttackProps.R
> {
    constructor(loader?: Loader<WeaponAttackModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }
}