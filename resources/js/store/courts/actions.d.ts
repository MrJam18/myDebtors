export declare const setCourtsList: (list: any) => {
    type: string;
    payload: any;
};
export declare const setCourtTypes: (list: any) => {
    type: string;
    payload: any;
};
export declare const setCourtLevels: (list: any) => {
    type: string;
    payload: any;
};
export declare const findCourtsByName: (string: any) => (dispatch: any) => Promise<void>;
export declare const recieveCourtTypes: () => (dispatch: any) => Promise<void>;
export declare const recieveCourtLevels: () => (dispatch: any) => Promise<void>;
export declare const createCourt: (court: any, address: any) => () => Promise<any>;
