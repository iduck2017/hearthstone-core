import { BoardModel, CardModel, DeckModel, GameModel, GraveyardModel, HandModel, HeroModel, MinionCardModel, PlayerModel, RoleModel, SecretCardModel, SpellCardModel, WeaponCardModel } from "..";

export type CardRoute = { card: CardModel; }
export type SpellRoute = CardRoute & { spell: SpellCardModel }
export type MinionRoute = CardRoute & { minion: MinionCardModel }
export type WeaponRoute = CardRoute & { weapon: WeaponCardModel }
export type SecretRoute = CardRoute & { secret: SecretCardModel }

export const CARD_ROUTE: CardRoute = { card: CardModel.prototype }
export const MINION_ROUTE: MinionRoute = { ...CARD_ROUTE, minion: MinionCardModel.prototype }
export const WEAPON_ROUTE: WeaponRoute = { ...CARD_ROUTE, weapon: WeaponCardModel.prototype }
export const SECRET_ROUTE: SecretRoute = { ...CARD_ROUTE, secret: SecretCardModel.prototype }
export const SPELL_ROUTE: SpellRoute = { ...CARD_ROUTE, spell: SpellCardModel.prototype }


export type RoleRoute = {
    role: RoleModel;
    card: CardModel;
    hero: HeroModel;
    minion: MinionCardModel;
}
export const ROLE_ROUTE: RoleRoute = {
    card: CardModel.prototype,
    hero: HeroModel.prototype,
    minion: MinionCardModel.prototype,
    role: RoleModel.prototype,
}