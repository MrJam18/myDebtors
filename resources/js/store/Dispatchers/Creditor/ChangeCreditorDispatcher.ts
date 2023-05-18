import {Alert} from "../../../classes/Alert";
import {Dispatcher} from "../Abstract/Dispatcher";

export class changeCreditorDispatcher extends Dispatcher
{
    protected async _handler(data)
    {
        await this._api.post('creditors/change-one', data);
        Alert.set('Успешно', "Кредитор успешно изменен");
    }

}