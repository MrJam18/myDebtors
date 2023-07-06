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
var _EasyDispatcher_setLoading, _EasyDispatcher_setShow, _EasyDispatcher_update, _EasyDispatcher_alertText, _EasyDispatcher_formRef;
import { Alert } from "../../classes/Alert";
import api from "../../http/index";
import { formDataConverter } from "../../utils/formDataConverter";
export class EasyDispatcher {
    constructor(setError, { setLoading = null, setShow = null, formRef = null, update = null, alertText = null } = null) {
        _EasyDispatcher_setLoading.set(this, void 0);
        _EasyDispatcher_setShow.set(this, void 0);
        _EasyDispatcher_update.set(this, void 0);
        _EasyDispatcher_alertText.set(this, void 0);
        _EasyDispatcher_formRef.set(this, null);
        this._api = api;
        this.request = async (serverAddress, method, data) => {
            return await this._api[method](serverAddress, (method === 'get' || method === 'delete') ? null : data);
        };
        this._setError = setError;
        __classPrivateFieldSet(this, _EasyDispatcher_setLoading, setLoading, "f");
        __classPrivateFieldSet(this, _EasyDispatcher_setShow, setShow, "f");
        __classPrivateFieldSet(this, _EasyDispatcher_update, update, "f");
        this.data = { formData: null };
        this.noReqData = {};
        __classPrivateFieldSet(this, _EasyDispatcher_alertText, alertText, "f");
        if (formRef)
            __classPrivateFieldSet(this, _EasyDispatcher_formRef, formRef, "f");
    }
    async handle(serverAddress, method) {
        var _a;
        if (__classPrivateFieldGet(this, _EasyDispatcher_setLoading, "f"))
            __classPrivateFieldGet(this, _EasyDispatcher_setLoading, "f").call(this, true);
        if (this._setError)
            this._setError(false);
        if (__classPrivateFieldGet(this, _EasyDispatcher_formRef, "f"))
            this.data.formData = formDataConverter(__classPrivateFieldGet(this, _EasyDispatcher_formRef, "f").current.elements);
        try {
            let result = await this.request(serverAddress, method, this.data);
            if (this.afterResponse)
                result = this.afterResponse(result);
            if (__classPrivateFieldGet(this, _EasyDispatcher_setShow, "f"))
                __classPrivateFieldGet(this, _EasyDispatcher_setShow, "f").call(this, false);
            if (__classPrivateFieldGet(this, _EasyDispatcher_update, "f"))
                __classPrivateFieldGet(this, _EasyDispatcher_update, "f").call(this);
            if (__classPrivateFieldGet(this, _EasyDispatcher_alertText, "f"))
                Alert.set('Успешно', __classPrivateFieldGet(this, _EasyDispatcher_alertText, "f"));
            return result;
        }
        catch (e) {
            console.dir(e);
            if ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data)
                console.dir(e.response.data);
            this._handleError(e);
        }
        finally {
            if (__classPrivateFieldGet(this, _EasyDispatcher_setLoading, "f"))
                __classPrivateFieldGet(this, _EasyDispatcher_setLoading, "f").call(this, false);
        }
    }
    _handleError(e) {
        var _a;
        if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 551)
            return this._setError(e.response.data.message);
        if (this._setError)
            this._setError(e.message);
    }
    addData(key, value) {
        this.data[key] = value;
    }
}
_EasyDispatcher_setLoading = new WeakMap(), _EasyDispatcher_setShow = new WeakMap(), _EasyDispatcher_update = new WeakMap(), _EasyDispatcher_alertText = new WeakMap(), _EasyDispatcher_formRef = new WeakMap();
