export declare const recieveAgentsList: (page: any, limit: any) => (dispatch: any, getState: any) => Promise<void>;
export declare const addAgent: (data: any) => (dispatch: any) => Promise<void>;
export declare const changeAgent: (data: any) => (dispatch: any) => Promise<void>;
export declare const deleteAgent: (id: any) => (dispatch: any) => Promise<void>;
export declare const searchAgents: (searchString: any) => (dispatch: any) => Promise<void>;
export declare const recieveDefaultAgent: () => (dispatch: any) => Promise<void>;
