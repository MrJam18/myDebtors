import {capitalizeFirstLetter} from "../utils/text/capitalize";

export class SelectType {
    public id: number;
    public name: string

    constructor(id: number, name: string) {
        this.id = id;
        this.name = capitalizeFirstLetter(name);
    }
}