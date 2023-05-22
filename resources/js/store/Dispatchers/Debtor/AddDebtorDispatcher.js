import { Dispatcher } from "../Abstract/Dispatcher";
import { setAlert } from "../../alert/actions";
export class AddDebtorDispatcher extends Dispatcher {
    async _handler(data) {
        await this._api.post('debtors/create-one', data);
        this._dispatch(setAlert('Успешно', "Должник успешно добавлен!"));
    }
}
