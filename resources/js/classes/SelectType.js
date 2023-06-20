import { capitalizeFirstLetter } from "../utils/text/capitalize";
export class SelectType {
    constructor(id, name) {
        this.id = id;
        this.name = capitalizeFirstLetter(name);
    }
}
