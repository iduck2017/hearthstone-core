import { Model, useMemo, useState, useModel, useRoute } from "set-piece";
import { CardModel } from "../cards";
import { registerDisposer, useDisposer } from "../hooks/disposer";

@useModel('weapon-durability-model')
export class WeaponDurabilityModel extends Model {
    protected _brand: symbol = Symbol('weapon-durability-model');

    // Route to the parent weapon card to access its disposer
    @useRoute(() => CardModel)
    private _card?: CardModel;

    @useState()
    private _current: number;
    @useMemo()
    public get current() {
        return this._current;
    }

    constructor(props: { current: number }) {
        super();
        this._current = props.current;
    }

    /** Consume 1 durability; schedule weapon disposal when depleted. */
    @useDisposer()
    public consume() {
        this._current -= 1;
        const disposer = this._card?.disposer;
        if (!disposer?.isActived) return;
        registerDisposer(disposer);
    }
}
