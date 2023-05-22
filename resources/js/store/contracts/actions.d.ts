export declare const createContract: (data: any) => (dispatch: any) => Promise<void>;
export declare const getCurrentContract: (id: any) => (dispatch: any) => Promise<void>;
export declare const changeContract: (data: any, contractId: any) => (dispatch: any) => Promise<void>;
export declare const createCourtClaim: (data: any) => (dispatch: any) => Promise<void>;
export declare const createDocument: (path: any, docName: any) => (dispatch: any) => Promise<{
    status: string;
}>;
export declare const recieveLimitationsList: (limit: any, page: any, order: any) => (dispatch: any) => Promise<void>;
export declare const createIPInitDoc: (contractId: any, agentId: any) => (dispatch: any, getState: any) => Promise<void>;
export declare const setExecutiveDoc: (formData: any, court: any, bailiff: any, typeId: any, contractId: any, executiveDocId: any) => (dispatch: any) => Promise<void>;
export declare const deleteContract: (id: any) => (dispatch: any) => Promise<void>;
export declare const recieveStatuses: () => (dispatch: any) => Promise<void>;
export declare const getExistingFiles: (contractId: any) => (dispatch: any) => Promise<void>;
export declare const deleteContractFile: (contractId: any, fileName: any) => (dispatch: any) => Promise<void>;
export declare const uploadContractFile: (fileName: any, contractId: any, formData: any) => (dispatch: any) => Promise<void>;
export declare const receiveExecutiveDoc: (contractId: any) => (dispatch: any) => Promise<any>;
