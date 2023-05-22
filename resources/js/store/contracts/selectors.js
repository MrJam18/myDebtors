import { SelectorCreator } from "../base/selectorCreator";
import { SelectExisting } from "../../classes/SelectExisting";
export const contractsSelectors = new SelectorCreator('contracts');
contractsSelectors.easyCreator('list');
contractsSelectors.easyCreator('current');
// @ts-expect-error TS(2339): Property 'getContractId' does not exist on type 'S... Remove this comment to see the full error message
contractsSelectors.getContractId = contractsSelectors.chunkCreator('current.id');
contractsSelectors.easyCreator('limitations');
contractsSelectors.easyCreator('totalLimitations');
contractsSelectors.easyCreator('executiveDoc');
contractsSelectors.easyCreator('statuses');
contractsSelectors.easyCreator('loadingExisting');
contractsSelectors.easyCreator('court');
// @ts-expect-error TS(2339): Property 'getExecutiveDocName' does not exist on t... Remove this comment to see the full error message
contractsSelectors.getExecutiveDocName = contractsSelectors.chunkCreator('current.executiveDocName');
export const selectExisting = new SelectExisting();
selectExisting.getSelector('contract');
selectExisting.getSelector('cancelDecision');
selectExisting.getSelector('courtOrder');
selectExisting.getSelector('IPEnd');
selectExisting.getSelector('IPInit');
selectExisting.getSelector('receivingOrder');
