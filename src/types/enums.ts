export enum CardType {
    MINION = 1,
    SPELL,
    WEAPON,
    HERO
}

export enum RaceType {
    UNDEAD = 1,
    BEAST,
    ELEMENTAL,
    MURLOC,
}

export enum QueryMode {
    OPTIONAL,
    REQUIRED = 1,
    EXCLUDE,
}

export enum DamageMode {
    ATTACK = 1,
    DEFEND,
    SPELL,
    SKILL,
}