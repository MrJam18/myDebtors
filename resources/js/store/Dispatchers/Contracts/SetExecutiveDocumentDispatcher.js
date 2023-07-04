import { Alert } from "../../../classes/Alert";
import api from "../../../http/index";
import { Dispatcher } from "../Abstract/Dispatcher";
export class SetExecutiveDocumentDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        var _a;
        if (!dispatcherData.court)
            throw new Error('укажите суд, вынесший решение!');
        if (!dispatcherData.bailiff)
            throw new Error('Укажите отдел судебных приставов!');
        if (!dispatcherData.typeId)
            throw new Error('Укажите тип исполнительного документа!');
        console.log('SEND DATA', dispatcherData);
        const sendData = {
            formData: dispatcherData.formData,
            courtId: dispatcherData.court.id,
            bailiffId: dispatcherData.bailiff.id,
            typeId: dispatcherData.typeId,
            id: (_a = dispatcherData.executiveDocId) !== null && _a !== void 0 ? _a : null,
            deleteIds: dispatcherData.deleteIds
        };
        await api.post(`contracts/${this.noReqData.contractId}/executive-documents/set-one`, sendData);
        Alert.set('Успешно', "Исполнительный документ успешно изменен");
        this.noReqData.update();
    }
}
