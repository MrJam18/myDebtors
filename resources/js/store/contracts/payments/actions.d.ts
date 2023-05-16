export declare const addPayment: (payment: any, contractId: any) => (dispatch: any) => Promise<void>;
export declare const changePayment: (payment: any, contractId: any) => (dispatch: any) => Promise<void>;
export declare const deletePayment: (paymentId: any, contractId: any) => (dispatch: any) => Promise<void>;
export declare const recievePaymentsPage: (contractId: any, page?: number, limit?: number, orderField?: string, orderType?: string) => (dispatch: any) => Promise<void>;
