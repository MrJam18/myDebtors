export declare const findCessions: (val: any, setError: any) => (dispatch: any) => Promise<void>;
export declare const recieveCessionsList: (page?: number, limit?: number, order?: string[]) => (dispatch: any) => Promise<void>;
export declare const recieveCessionInfo: (cessionId: any) => (dispatch: any) => Promise<void>;
export declare const setCessionChanges: (data: any, assignee: any, assignor: any, enclosures: any, useDefaultText: any, index: any, cessionId: any) => (dispatch: any) => void;
export declare const sendCessionChanges: (name: any, defaultCession: any) => (dispatch: any, getState: any) => Promise<void>;
export declare const deleteCessionInfoHandler: () => (dispatch: any, getState: any) => any;
export declare const deleteCessionGroup: (cessionId: any) => (dispatch: any) => Promise<void>;
export declare const addCessionGroup: (name: any, defaultCession: any) => (dispatch: any, getState: any) => Promise<void>;
