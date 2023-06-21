import axios from 'axios';
import { serverApi } from '../utils/serverApi';
import { saveAs } from 'file-saver';
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
    if (err.response.status === 401 && err.config.url !== "users/get")
        return window.location.replace('/login');
    throw err;
});
export const saveFile = async (path) => {
    return handleBlobRequest(path, 'get');
};
export const saveFilePost = async (path, body) => {
    return handleBlobRequest(path, 'post', body);
};
const handleBlobRequest = async (path, method, body = null) => {
    var _a, _b, _c;
    try {
        let response;
        if (method === 'put' || method === 'post')
            response = await api[method](path, body, { responseType: 'blob' });
        else
            response = await api[method](path, { responseType: 'blob' });
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
        return response;
    }
    catch (e) {
        if ((_c = e.response) === null || _c === void 0 ? void 0 : _c.data) {
            const blob = new Blob([e.response.data]);
            const data = await JSON.parse(await blob.text());
            console.dir(data);
            throw data;
        }
        console.dir(e);
        throw e;
    }
};
export default api;
