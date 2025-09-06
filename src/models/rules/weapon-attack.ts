import { Decor, EventUtil, Method, Model, StateChangeEvent, StateUtil } from "set-piece";
import { GameModel, PlayerModel, CharacterModel, CharacterProps, AttackProps, AttackModel } from "../..";

export namespace WeaponAttackProps {
    export type E = {}
    export type S = {
        origin: number;
        offset: number;
    }
    export type C = {}
    export type R = {}
}

export class WeaponAttackModel extends Model<
    WeaponAttackProps.E,
    WeaponAttackProps.S,
    WeaponAttackProps.C,
    WeaponAttackProps.R
> {
    public get route() {
        const route = super.route;
        const character: CharacterModel | undefined = route.order.find(item => item instanceof CharacterModel);
        return { 
            ...route, 
            character,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin + state.offset,
        }
    }

    constructor(loader: Method<WeaponAttackModel['props'] & {
        state: Pick<WeaponAttackProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    offset: 0,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }


    @EventUtil.on(self => self.proxy.event.onStateChange)
    private onChange(that: WeaponAttackModel, event: StateChangeEvent<WeaponAttackModel>) {
        const { prev, next } = event.detail;
        if (prev.current !== next.current) this.reload();
    }

    @StateUtil.on(self => self.route.character?.proxy.child.role.child.attack.decor)
    private onCheck(that: AttackModel, decor: Decor<AttackProps.S>) {
        decor.current.offset += this.state.current;
    }
}