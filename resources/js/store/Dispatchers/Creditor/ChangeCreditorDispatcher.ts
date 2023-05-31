import {Alert} from "../../../classes/Alert";
import {Dispatcher} from "../Abstract/Dispatcher";

export class ChangeCreditorDispatcher extends Dispatcher
{
    protected async _handler(data)
    {
        if(!data.address) throw new Error('Укажите адрес');
        await this._api.post('creditors/change-one', data);
        Alert.set('Успешно', "Кредитор успешно изменен");
    }

}