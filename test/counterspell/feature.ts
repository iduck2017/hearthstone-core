import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, CardFeatureModel } from "hearthstone-core";
import { DebugUtil, Loader, LogLevel, Model, StoreUtil } from "set-piece";

@StoreUtil.is('counterspell-effect')
export class CounterspellFeatureModel extends CardFeatureModel {
    constructor(loader?: Loader<CounterspellFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Counterspell's feature",
                    desc: "When your opponent casts a spell, Counter it.",
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer } 
            }
        })
    }
}