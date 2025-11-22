import { HeroModel, RoleModel } from "..";
import { DamageEvent, DamageType } from "../../../../types/events/damage";
import { Selector } from "../../../../types/selector";
import { EffectModel } from "../../../features/hooks/effect";
import { DamageModel } from "../../../rules/damage";

export class FireBlastEffectModel extends EffectModel {
    public get route() {
        const result = super.route;
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel)
        return {
            ...result,
            hero
        }
    }
    
    constructor(props?: FireBlastEffectModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Fireblast\'s Effect',
                desc: 'Deal 1 damage',
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }   

    protected async doRun(params: Array<RoleModel | undefined>): Promise<void> {
        const target = params[0];
        if (!target) return;

        const hero = this.route.hero;
        if (!hero) return;
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SKILL,
                source: hero,
                method: this,
                target,
                origin: 1,
            })
        ])
    }

    public precheck() {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles;
        return new Selector(roles);
    }
}