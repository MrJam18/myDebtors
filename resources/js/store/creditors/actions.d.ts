export declare const findOrganizations: (val: any, setError: any) => (dispatch: any) => Promise<void>;
export declare const addBanksRequisites: (name: any, BIK: any) => (dispatch: any) => Promise<void>;
export declare const recieveOrgList: (limit: any, page: any, order: any) => (dispatch: any) => Promise<void>;
export declare const addCreditor: (data: any) => (dispatch: any) => Promise<void>;
export declare const changeCreditor: (data: any) => (dispatch: any) => Promise<void>;
export declare const deleteOrganization: (id: any) => (dispatch: any) => Promise<void>;
export declare const changeDefaultCession: (creditorId: any, cession: any) => (dispatch: any) => Promise<void>;
export declare const receiveCreditor: (creditorId: any) => (dispatch: any) => Promise<void>;
