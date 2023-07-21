import { Alert } from "../../../classes/Alert";
import api from "../../../http/index";
import { Dispatcher } from "../Abstract/Dispatcher";
export class SetExecutiveDocumentDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        await api.post(`contracts/${this.noReqData.contractId}/executive-documents/set`, dispatcherData);
        Alert.set('Успешно', "Исполнительный документ успешно изменен");
        this.noReqData.update();
    }
}
