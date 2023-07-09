import { Alert } from "../../../classes/Alert";
import { Dispatcher } from "../Abstract/Dispatcher";
export class CreateAgentDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        const noReqData = this.noReqData;
        if (!dispatcherData.address)
            throw new Error('Укажите адрес представителя');
        const response = await this._api.post('agents/create-one', dispatcherData);
        Alert.set('Успешно', "Представитель успешно создан");
        if (noReqData.update)
            noReqData.update();
        if (noReqData.setAgent && response.data)
            noReqData.setAgent(response.data);
    }
}
