import { asDependency, asState, Model } from "set-piece";

export interface TauntDecor {
    value: boolean;
    id?: string;
}

export class TauntModel extends Model {
    constructor(props?: {
        isActive?: boolean;
    }) {
        super();
        this._decors = [{
            value: props?.isActive ?? false,
        }]
    }

    @asState()
    @asDependency(true)
    private _decors: TauntDecor[] = [];

    public get isActived() {
        const length = this._decors.length;
        return this._decors[length - 1]?.value ?? false;
    }

    public active(id: string) {
        this._decors.push({
            value: true,
            id,
        });
    }

    public reset() {
        this._decors.length = 0;
    }
}