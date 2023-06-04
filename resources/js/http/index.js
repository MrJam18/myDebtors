import axios from 'axios';
import { serverApi } from '../utils/serverApi';
import { saveAs } from 'file-saver';
import { redirect } from "react-router";
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const api = axios.create({
    withCredentials: true,
    baseURL: serverApi,
    timeout: 5000,
    timeoutErrorMessage: 'Истекло время на ответ сервера.',
    headers: {
        'Accept': 'application/json'
    }
});
api.interceptors.request.use((conf) => {
    conf.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return conf;
});
api.interceptors.response.use((conf) => conf, async (err) => {
    const origReq = err.config;
    if (err.response.status === 401 && origReq && !origReq._isRetry) {
        origReq._isRetry = true;
        try {
            return redirect('/login');
            // const res = await axios.get(`${serverApi}users/refresh`, {withCredentials: true});
            // localStorage.setItem('token', res.data.token);
            // return api.request(origReq);
        }
        catch (e) {
            throw new Error('Ошибка авторизации!');
        }
    }
    throw err;
});
export const saveFile = async (path, fileName) => {
    const { data } = await api.get(path, { responseType: 'blob' });
    const blob = new Blob([data]);
    console.log(data);
    saveAs(blob, fileName);
    return { status: 'ok' };
};
export const saveFilePost = async (path, body) => {
    var _a, _b, _c;
    try {
        const response = await api.post(path, body, { responseType: 'blob' });
        const parts = response.headers['content-disposition'].split(';');
        let filename;
        if (parts[2]) {
            filename = (_a = parts[2]) === null || _a === void 0 ? void 0 : _a.split('=')[1];
            filename = decodeURIComponent(filename.replace('utf-8\'\'', ''));
        }
        else
            filename = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.split('=')[1];
        const blob = new Blob([response.data]);
        saveAs(blob, filename);
        return { status: 'ok' };
    }
    catch (e) {
        console.dir(e);
        if ((_c = e.response) === null || _c === void 0 ? void 0 : _c.data) {
            const blob = new Blob([e.response.data]);
            console.log(await JSON.parse(await blob.text()));
        }
    }
};
export default api;
