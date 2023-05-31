import {Alert} from "../../../classes/Alert";
import {DispatcherAlerter} from "../Abstract/DispatcherAlerter";

export class ChangeDebtorDispatcher extends DispatcherAlerter
{
    protected async _handler(dispatcherData)
    {
        delete dispatcherData.formData;
        await this._api.post('debtors/change-one/' + this.noReqData.debtorId, dispatcherData);
        Alert.set('Успешно', "Должник успешно изменен");
        this.noReqData.update();
    }
}