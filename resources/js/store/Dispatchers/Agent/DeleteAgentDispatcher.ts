import {Alert} from "../../../classes/Alert";
import {Dispatcher} from "../Abstract/Dispatcher";

export class DeleteAgentDispatcher extends Dispatcher
{
    protected async _handler(dispatcherData)
    {
        await this._api.delete('agents/delete-one/' + dispatcherData.id);
        Alert.set('Успешно', "Представитель успешно удален");
    }
}