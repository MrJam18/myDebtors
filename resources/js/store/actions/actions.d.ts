export declare const recieveActionsList: (contractId: any, page: any, limit: any, orderField: any, orderType: any) => (dispatch: any) => Promise<void>;
export declare const recieveAndSaveDocument: (path: any, name?: string) => () => Promise<{
    status: string;
}>;
export declare const recieveLastActionsList: (page: any) => (dispatch: any) => Promise<void>;
