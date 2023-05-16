export declare const selectorCreator: (bigChunk: any) => (chunk: any) => (store: any) => any;
/**
 * deprecated
 */
export declare class SelectorCreator {
    #private;
    easyCreator: any;
    /**
     * deprecated
     * @param {string} chunk several properties of store(max 3)
     * @returns function selector for redux-store
     */
    chunkCreator: any;
    /**
     *
     * @param {string} bigChunk first property of store
     * @returns object with function chunkCreator, which have chunk of store as string with max 3 nested properties
     */
    constructor(bigChunk: any);
    buildAllSelectorsFromInitState(slice: any): void;
}
