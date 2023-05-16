export declare const setTasksList: (list: any, total: any) => {
    type: string;
    payload: {
        list: any;
        total: any;
    };
};
export declare const recieveTaskstList: (limit: any, page: any, sort: any, userId: any) => (dispatch: any) => Promise<void>;
