var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SelectorCreator_bigChunk;
/**
 *
 * @param {string} bigChunk first property of store
 * @returns function, which have chunk of store as string with max 3 nested properties
 */
import { capitalizeFirstLetter } from "../../utils/text/capitalize";
export const selectorCreator = (bigChunk) => {
    /**
     * deprecated
     * @param {string} chunk several properties of store(max 3)
     * @returns function selector for redux-store
     */
    const selectorMiniChunkCreator = (chunk) => {
        if (/\./.test(chunk)) {
            const chunks = chunk.split('.', 3);
            switch (chunks.length) {
                case 2:
                    return (store) => store[bigChunk][chunks[0]][chunks[1]];
                case 3:
                    return (store) => store[bigChunk][chunks[0]][chunks[1]][chunks[2]];
            }
        }
        return (store) => store[bigChunk][chunk];
    };
    return selectorMiniChunkCreator;
};
/**
 * deprecated
 */
export class SelectorCreator {
    /**
     *
     * @param {string} bigChunk first property of store
     * @returns object with function chunkCreator, which have chunk of store as string with max 3 nested properties
     */
    constructor(bigChunk) {
        _SelectorCreator_bigChunk.set(this, void 0);
        __classPrivateFieldSet(this, _SelectorCreator_bigChunk, bigChunk, "f");
        this.easyCreator = (chunk) => {
            this['get' + capitalizeFirstLetter(chunk)] = (store) => store[bigChunk][chunk];
            return this['get' + chunk];
        };
        this.chunkCreator = (chunk) => {
            if (/\./.test(chunk)) {
                const chunks = chunk.split('.', 4);
                switch (chunks.length) {
                    case 2:
                        return (store) => store[bigChunk][chunks[0]][chunks[1]];
                    case 3:
                        return (store) => store[bigChunk][chunks[0]][chunks[1]][chunks[2]];
                    case 4:
                        return (store) => store[bigChunk][chunks[0]][chunks[1]][chunks[2]][chunks[3]];
                }
            }
            return (store) => store[bigChunk][chunk];
        };
    }
    buildAllSelectorsFromInitState(slice) {
        const state = slice.getInitialState();
        for (const prop in state) {
            this[prop] = (store) => store[__classPrivateFieldGet(this, _SelectorCreator_bigChunk, "f")][prop];
        }
    }
}
_SelectorCreator_bigChunk = new WeakMap();
