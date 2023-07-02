import {capitalizeFirstLetter} from "../utils/text/capitalize";

type Options = {
    className?: string,
    type?: string
}

export class Header {
    public name: string;
    public key: string;
    public type: string|null;
    public className: string|null;

    constructor(name: string, key: string, options: Options = {}) {
        this.name = capitalizeFirstLetter(name);
        this.key = key;
        this.type = options.type ?? null;
        if(options.className) this.className = options.className;
    }
}