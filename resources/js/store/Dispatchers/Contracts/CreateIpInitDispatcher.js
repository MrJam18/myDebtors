import { saveFilePost } from "../../../http/index";
import { getContractPath } from "../../../utils/getContractPath";
import { Dispatcher } from "../Abstract/Dispatcher";
export class CreateIpInitDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        if (!dispatcherData.executiveDocumentId)
            throw new Error('Сначала создайте исполнительный документ');
        if (!dispatcherData.agentId)
            throw new Error('Укажите представителя');
        await saveFilePost(getContractPath('documents/create-ip-init'), dispatcherData);
    }
}
