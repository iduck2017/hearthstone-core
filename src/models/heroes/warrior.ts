import { RoleModel } from "../role";
import { HealthModel } from "../rules/health";
import { RoleAttackModel } from "../rules/attack/role";
import { PlayerModel } from "../player";
import { ArmorUpModel } from "../skills/armor-up";
import { Loader, StoreUtil } from "set-piece";
import { HeroModel } from ".";

@StoreUtil.is('warrior')
export class WarriorModel extends HeroModel {
    constructor(loader?: Loader<WarriorModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    role: props.child?.role ?? new RoleModel(() => ({
                        child: {
                            health: new HealthModel(() => ({ state: { origin: 30 }})),
                            attack: new RoleAttackModel(() => ({ state: { current: 0 }})),
                        },
                    })),
                    skill: props.child?.skill ?? new ArmorUpModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}