import {getState} from "../App";

export function getContractPath(endPath: string): string {
    const contractId = getState().contracts.current.id;
    return `/contracts/${contractId}/${endPath}`;
}