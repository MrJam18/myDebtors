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
var _Dispatcher_setLoading, _Dispatcher_setShow, _Dispatcher_update;
import { formDataConverter } from "../../../utils/formDataConverter";
import { dispatch, getState } from "../../../App.jsx";
import api from "../../../http";
export class Dispatcher {
    constructor(setError, setLoading = null, formRef = null, setShow = null, update = null) {
        _Dispatcher_setLoading.set(this, void 0);
        _Dispatcher_setShow.set(this, void 0);
        _Dispatcher_update.set(this, void 0);
        this._dispatch = dispatch;
        this._getState = getState;
        this._api = api;
        this._actions = null;
        if (setError)
            this._setError = setError;
        __classPrivateFieldSet(this, _Dispatcher_setLoading, setLoading, "f");
        __classPrivateFieldSet(this, _Dispatcher_setShow, setShow, "f");
        __classPrivateFieldSet(this, _Dispatcher_update, update, "f");
        this.data = { formData: null };
        this.noReqData = {};
        if (formRef)
            this.data.formData = formDataConverter(formRef.current.elements);
    }
    async handle() {
        var _a;
        if (__classPrivateFieldGet(this, _Dispatcher_setLoading, "f"))
            __classPrivateFieldGet(this, _Dispatcher_setLoading, "f").call(this, true);
        if (this._setError)
            this._setError(false);
        try {
            if (!this._handler) {
                throw new Error('handler dont created');
            }
            const result = await this._runHandler();
            if (__classPrivateFieldGet(this, _Dispatcher_setShow, "f"))
                __classPrivateFieldGet(this, _Dispatcher_setShow, "f").call(this, false);
            if (__classPrivateFieldGet(this, _Dispatcher_update, "f"))
                __classPrivateFieldGet(this, _Dispatcher_update, "f").call(this);
            return result;
        }
        catch (e) {
            console.dir(e);
            if ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data)
                console.dir(e.response.data);
            this._handleError(e);
        }
        finally {
            if (__classPrivateFieldGet(this, _Dispatcher_setLoading, "f"))
                __classPrivateFieldGet(this, _Dispatcher_setLoading, "f").call(this, false);
        }
    }
    _handleError(e) {
        var _a;
        if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 551)
            return this._setError(e.response.data.message);
        if (this._setError)
            this._setError(e.message);
    }
    async _runHandler() {
        return await this._handler(this.data);
    }
    addData(key, value) {
        this.data[key] = value;
    }
    addNoReqData(key, value) {
        this.noReqData[key] = value;
    }
}
_Dispatcher_setLoading = new WeakMap(), _Dispatcher_setShow = new WeakMap(), _Dispatcher_update = new WeakMap();
