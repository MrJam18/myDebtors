import {Alert} from "../../../classes/Alert";
import {Dispatcher, DispatcherData} from "../Abstract/Dispatcher";

export class AddBankRequisitesDispatcher extends Dispatcher
{
    async _handler(dispatcherData: DispatcherData): Promise<any> {
        try{
            const response = await this._api.post('creditors/add-bank-requisites', {
                name: dispatcherData.formData.name,
                BIK: dispatcherData.formData.BIK
            });
            Alert.set('Успешно', "Реквизиты успешно добавлены.");
            return response.data;
        } catch (e) {
            if(e.response?.status === 551) {
                throw new Error(e.response.data.message);
            }
            throw e;
        }
    }
}