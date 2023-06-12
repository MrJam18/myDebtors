import { getState } from "../App";
export function getContractPath(endPath) {
    const contractId = getState().contracts.current.id;
    return `/contracts/${contractId}/${endPath}`;
}
