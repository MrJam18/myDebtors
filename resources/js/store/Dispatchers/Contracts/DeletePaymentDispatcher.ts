import {Alert} from "../../../classes/Alert";
import api from "../../../http/index";
import {Dispatcher} from "../Abstract/Dispatcher";

export class DeletePaymentDispatcher extends Dispatcher
{
    protected async _handler(dispatcherData)
    {
        const contract = this._getState().contracts.current;
        await api.delete(`contracts/${contract.id}/payments/delete-one/${this.noReqData.id}`);
        Alert.set('Успешно', "Платеж успешно удален");
        this.noReqData.update();
    }
}