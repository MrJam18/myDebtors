import { Alert } from "../../../classes/Alert";
import { Dispatcher } from "../Abstract/Dispatcher";
export class AddCreditorDispatcher extends Dispatcher {
    async _handler(data) {
        if (!data.address)
            throw new Error('Укажите адрес.');
        if (!data.bankRequisitesId)
            throw new Error('Укажите банк получателя.');
        const setUpdate = data.setUpdate;
        delete data.setUpdate;
        await this._api.post('creditors/add-one', data);
        Alert.set('Успешно.', "Кредитор успешно добавлен");
        setUpdate(true);
    }
}
