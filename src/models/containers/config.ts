import { DebugUtil, Loader, Model, StoreUtil } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { CardModel, DeckModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../..";

export namespace ConfigProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly spells: SpellCardModel[],
        readonly minions: MinionCardModel[],
        readonly weapons: WeaponCardModel[]
    };
    export type R = {};
    export type P = {}
}

export class ConfigModel extends Model<
    ConfigProps.E,
    ConfigProps.S,
    ConfigProps.C,
    ConfigProps.R,
    ConfigProps.P
> {
    constructor(loader?: Loader<ConfigModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                child: { 
                    minions: [],
                    spells: [],
                    weapons: [],
                    ...props.child,
                },
                state: { ...props.state },
                refer: { 
                    order: [
                        ...props.child?.minions ?? [],
                        ...props.child?.spells ?? [],
                        ...props.child?.weapons ?? [],
                    ],
                    ...props.refer 
                },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        })
    }

    public use(): DeckModel {
        const spells = this.child.spells.map(item => StoreUtil.copy(item)).filter(item => item !== undefined);
        const minions = this.child.minions.map(item => StoreUtil.copy(item)).filter(item => item !== undefined);
        const weapons = this.child.weapons.map(item => StoreUtil.copy(item)).filter(item => item !== undefined);
        return new DeckModel(() => ({
            child: {
                spells,
                minions,
                weapons,
            }
        }))
    }
}
