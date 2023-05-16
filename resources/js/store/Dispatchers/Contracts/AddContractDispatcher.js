import { Dispatcher } from "../Abstract/Dispatcher";
import { setAlert } from "../../alert/actions";
export class AddContractDispatcher extends Dispatcher {
    async _handler(data) {
        if (!data.cessionId)
            throw new Error('Выберите договор цессии!');
        if (!data.creditorId)
            throw new Error('Выберите кредитора, которому принадлежит заем!');
        await this._api.post('contracts/createOne', data);
        this._dispatch(setAlert('Успешно', "Контракт успешно создан"));
    }
}
