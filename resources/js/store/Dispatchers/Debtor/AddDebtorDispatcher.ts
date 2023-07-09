import {Dispatcher} from "../Abstract/Dispatcher";
import {setAlert} from "../../alert/actions";
import {receiveList} from "../../list/actions";

export class AddDebtorDispatcher extends Dispatcher
{
    async _handler(data)
    {
        const response = await this._api.post('debtors/create-one', data);
        this._dispatch(setAlert('Успешно', "Должник успешно добавлен!"));
        if(response.data && this.noReqData.setDebtor) this.noReqData.setDebtor(response.data);
    }
}
