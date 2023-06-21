import {Alert} from "../../../classes/Alert";
import api from "../../../http/index";
import {Dispatcher} from "../Abstract/Dispatcher";

export class SetExecutiveDocumentDispatcher extends Dispatcher
{
    protected async _handler(dispatcherData)
    {
        if(!dispatcherData.court) throw new Error('укажите суд, вынесший решение!');
        if(!dispatcherData.bailiff) throw new Error('Укажите отдел судебных приставов!');
        if(!dispatcherData.typeId) throw new Error('Укажите тип исполнительного документа!');
        const sendData = {
            formData: dispatcherData.formData,
            courtId: dispatcherData.court.id,
            bailiffId: dispatcherData.bailiff.id,
            typeId: dispatcherData.typeId,
            id: dispatcherData.executiveDocId ?? null
        }
        console.log(sendData);
        await api.post(`contracts/${this.noReqData.contractId}/executive-documents/set-one`, sendData);
        Alert.set('Успешно', "Исполнительный документ успешно изменен");
        this.noReqData.update();
    }
}