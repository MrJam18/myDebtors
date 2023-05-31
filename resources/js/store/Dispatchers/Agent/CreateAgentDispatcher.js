import { Alert } from "../../../classes/Alert";
import { Dispatcher } from "../Abstract/Dispatcher";
export class CreateAgentDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        if (!dispatcherData.address)
            throw new Error('Укажите адрес представителя');
        await this._api.post('agents/create-one', dispatcherData);
        Alert.set('Успешно', "Представитель успешно создан");
        this.noReqData.update();
    }
}
