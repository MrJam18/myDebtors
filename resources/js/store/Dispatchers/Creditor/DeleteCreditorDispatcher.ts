import {Alert} from "../../../classes/Alert";
import {Dispatcher} from "../Abstract/Dispatcher";

export class DeleteCreditorDispatcher extends Dispatcher
{
    protected async _handler(data)
    {
        await this._api.delete('creditors/delete-one?id=' + data.id);
        Alert.set('Успешно', "Кредитор успешно удален");
        data.setUpdate();
    }
}