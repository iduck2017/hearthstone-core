import { DebugUtil, Loader, Model, StoreUtil } from "set-piece";
import { MinionCardModel } from "../cards/minion";
import { GameModel } from "../game";
import { CardModel, DeckModel, PlayerModel, SpellCardModel, WeaponCardModel } from "../..";

export namespace ConfigProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly cards: CardModel[]
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
                    cards: props.child?.cards ?? [],
                    ...props.child,
                },
                state: { ...props.state },
                refer: { ...props.refer },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        })
    }

    public use(): DeckModel {
        const order = this.child.cards
            .map(item => StoreUtil.copy(item))
            .filter(item => item !== undefined)
            .sort((a, b) => Math.random() - 0.5);
        const spells: SpellCardModel[] = [];
        const minions: MinionCardModel[] = [];
        const weapons: WeaponCardModel[] = [];
        for (const card of order) {
            if (card instanceof SpellCardModel) spells.push(card);
            if (card instanceof MinionCardModel) minions.push(card);
            if (card instanceof WeaponCardModel) weapons.push(card);
        }
        return new DeckModel(() => ({
            child: {
                spells,
                minions,
                weapons,
            },
            order: order
        }))
    }
}
