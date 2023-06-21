import { Alert } from "../../../classes/Alert";
import { getContractPath } from "../../../utils/getContractPath";
import { Dispatcher } from "../Abstract/Dispatcher";
export class ChangeCreditorDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        await this._api.post(getContractPath('change-creditor'), dispatcherData);
        Alert.set('Успешно', "Контракт успешно изменен");
    }
}
