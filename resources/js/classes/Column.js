import { capitalizeFirstLetter } from "../utils/text/capitalize";
export class Column {
    constructor(name, colName = null, type = null, options = null) {
        this.type = 'string';
        this.style = 'default';
        this.noChange = false;
        this.showEnd = '';
        this.name = capitalizeFirstLetter(name);
        this.colName = colName;
        if (type)
            this.type = type;
        if (colName === 'updatedAt' || colName === 'createdAt')
            this.noChange = true;
        if (options) {
            if (options.style)
                this.style = options.style;
            if (options.noChange)
                this.noChange = options.noChange;
        }
        switch (this.type) {
            case 'composed':
                // @ts-expect-error TS(2339): Property 'elements' does not exist on type 'Column... Remove this comment to see the full error message
                this.elements = options.elements;
            case 'selected':
                this.func = options.func;
                break;
            case 'date':
                this.showEnd = ' г.';
                break;
            case 'money':
                this.showEnd = ' руб.';
                break;
            case 'percent':
                this.showEnd = ' %';
                break;
            case 'ref':
                this.ref = options.ref;
                // @ts-expect-error TS(2339): Property 'refColName' does not exist on type 'Colu... Remove this comment to see the full error message
                if (options.refColName)
                    this.refColName = options.refColName;
        }
    }
}
