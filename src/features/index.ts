import { Model } from "set-piece";

export abstract class FeatureModel extends Model {
    public abstract deactive(): void;
}