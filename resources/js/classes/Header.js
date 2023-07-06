import { capitalizeFirstLetter } from "../utils/text/capitalize";
export class Header {
    constructor(name, key, options = {}) {
        var _a;
        this.name = capitalizeFirstLetter(name);
        this.key = key;
        this.type = (_a = options.type) !== null && _a !== void 0 ? _a : null;
        if (options.className)
            this.className = options.className;
        if (options.type === 'button')
            this.button = options.button;
        if (options.styles)
            this.styles = options.styles;
    }
}
