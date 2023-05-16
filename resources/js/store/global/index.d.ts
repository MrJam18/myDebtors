export declare const globalReducer: (state: {
    loading: boolean;
    modal: boolean;
    error: boolean;
    openLeftMenu: boolean;
}, action: any) => {
    loading: any;
    modal: boolean;
    error: boolean;
    openLeftMenu: boolean;
} | {
    modal: any;
    loading: boolean;
    error: boolean;
    openLeftMenu: boolean;
} | {
    error: any;
    loading: boolean;
    modal: boolean;
    openLeftMenu: boolean;
} | {
    openLeftMenu: any;
    loading: boolean;
    modal: boolean;
    error: boolean;
};
/**
 *
 * @param {boolean} state состояние загрузки.
 * @return {object} экшен для редьюсера
 */
export declare const setloading: (state?: boolean) => {
    type: string;
    payload: boolean;
};
export declare const setModal: (state: any) => {
    type: string;
    payload: any;
};
export declare const setGlobalError: (message: any) => {
    type: string;
    payload: any;
};
export declare const setOpenLeftMenu: (bool: any) => {
    type: string;
    payload: any;
};
export declare const errorWithAlert: (errorAction: any, error: any) => (dispatch: any) => void;
export declare const getLoading: (state: any) => any;
export declare const getModal: (state: any) => any;
export declare const getGlobalError: (state: any) => any;
export declare const getOpenLeftMenu: (state: any) => any;
