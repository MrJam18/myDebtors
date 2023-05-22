import { DispatcherAlerter } from "./DispatcherAlerter";
export class ListDispatcher extends DispatcherAlerter {
    constructor() {
        super(...arguments);
        this.orderBy = null;
    }
    async _runHandler() {
        let url = `${this.serverAddress}?limit=${this.limit}&page=${this.page}`;
        if (this.orderBy)
            url += `&order[]=${this.orderBy[0]}&order[]=${this.orderBy[1]}`;
        const { data } = await this._api.get(url);
        if (data)
            this.data.list = data;
        else
            throw new Error('cant take data from response');
        return super._runHandler();
    }
}
