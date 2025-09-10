import { Loader, StoreUtil } from "set-piece";
import { RoleModel } from "../role";
import { AttackModel } from "../rules/attack";
import { HealthModel } from "../rules/health";
import { FireBlastModel } from "../skills/fireblast";
import { HeroModel } from ".";

@StoreUtil.is('mage')
export class MageModel extends HeroModel {
    constructor(loader?: Loader<MageModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    role: props.child?.role ?? new RoleModel(() => ({ 
                        child: {
                            health: new HealthModel(() => ({ state: { origin: 30 }})),
                            attack: new AttackModel(() => ({ state: { origin: 0 }})),
                        },
                    })),
                    skill: props.child?.skill ?? new FireBlastModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}