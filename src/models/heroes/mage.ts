import { Loader, StoreUtil } from "set-piece";
import { RoleModel } from "../role";
import { RoleAttackModel } from "../rules/attack/role";
import { RoleHealthModel } from "../rules/health";
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
                            health: new RoleHealthModel(() => ({ state: { origin: 30 }})),
                            attack: new RoleAttackModel(() => ({ state: { current: 0 }})),
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