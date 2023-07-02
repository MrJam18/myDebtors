import {capitalizeFirstLetter} from "../utils/text/capitalize";

export class SelectType {
    public id: number;
    public name: string;
    public key: string|null;

    constructor(id: number, name: string, key: string = null) {
        this.id = id;
        this.name = capitalizeFirstLetter(name);
        this.key = key;
    }
}