import {Order} from "../../../Types/Order";
import {DispatcherAlerter} from "./DispatcherAlerter";


export abstract class ListDispatcher extends DispatcherAlerter
{
    public page: number;
    public limit: number;
    public serverAddress: string;
    public orderBy: Order | null = null;

    protected async _runHandler(): Promise<any> {
        let url = `${this.serverAddress}?limit=${this.limit}&page=${this.page}`;
        if(this.orderBy) url += `&order[]=${this.orderBy[0]}&order[]=${this.orderBy[1]}`;
        const {data} = await this._api.get(url);
        if(data) this.data.list = data;
        else throw new Error('cant take data from response');
        return super._runHandler();
    }
}