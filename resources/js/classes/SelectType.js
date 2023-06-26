import { capitalizeFirstLetter } from "../utils/text/capitalize";
export class SelectType {
    constructor(id, name, key = null) {
        this.id = id;
        this.name = capitalizeFirstLetter(name);
        this.key = key;
    }
}
