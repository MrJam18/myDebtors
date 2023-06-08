import { Alert } from "../../../classes/Alert";
import { compareDatesBool } from "../../../utils/dates/compareDatesBool";
import { Dispatcher } from "../Abstract/Dispatcher";
export class ChangePaymentDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        const contract = this._getState().contracts.current;
        if (compareDatesBool(contract.date_issue, dispatcherData.formData.date))
            throw new Error('Дата платежа не может быть меньше даты выдачи договора.');
        await this._api.post(`contracts/${contract.id}/payments/change-one/${this.noReqData.id}`, dispatcherData);
        Alert.set('Успешно', 'Платеж успешно изменен');
        this.noReqData.update();
    }
}
