import { Alert } from "../../../classes/Alert";
import { Dispatcher } from "../Abstract/Dispatcher";
export class ChangeAgentDispatcher extends Dispatcher {
    async _handler(data) {
        if (!data.address)
            throw new Error('Укажите адрес');
        await this._api.post('agents/change-one/', data);
        Alert.set('Успешно', "Представитель успешно изменен");
    }
}
