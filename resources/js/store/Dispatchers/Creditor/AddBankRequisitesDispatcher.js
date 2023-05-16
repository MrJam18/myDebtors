import { Alert } from "../../../classes/Alert";
import { Dispatcher } from "../Abstract/Dispatcher";
export class AddBankRequisitesDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        var _a;
        try {
            const response = await this._api.post('creditors/add-bank-requisites', {
                name: dispatcherData.formData.name,
                BIK: dispatcherData.formData.BIK
            });
            Alert.set('Успешно', "Реквизиты успешно добавлены.");
            return response.data;
        }
        catch (e) {
            if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 551) {
                throw new Error(e.response.data.message);
            }
            throw e;
        }
    }
}
