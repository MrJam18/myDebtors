import { saveFilePost } from "../../../http/index";
import { Dispatcher } from "../Abstract/Dispatcher";
export class CreateCourtClaimDispatcher extends Dispatcher {
    async _handler(dispatcherData) {
        await saveFilePost(`contracts/${this.noReqData.contractId}/documents/create-court-claim`, dispatcherData);
    }
}
