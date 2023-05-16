import {Dispatcher} from "../Abstract/Dispatcher";
import {saveFilePost} from "../../../http";
import {setAlert} from "../../alert/actions";

export class CreateIPInitDispatcher extends Dispatcher
{
    async _handler(data)
    {
        if(!data.agent) throw new Error('Укажите представителя!');
        if(!this._getState().contracts.executiveDoc.id) throw new Error('Укажите данные исполнительного документа!');
        await saveFilePost('documents/createIPInit', {contractId: data.contractId, agentId: data.agent.id}, `ЗВИП по договору ${data.contractId}.docx`);
        this._dispatch(setAlert('Успешно', "Заявление успешно создано."));
    }
}