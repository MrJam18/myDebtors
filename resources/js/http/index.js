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
    saveAs(blob, fileName);
    return { status: 'ok' };
};
export const saveFilePost = async (path, body, fileName) => {
    const { data } = await api.post(path, body, { responseType: 'blob' });
    const blob = new Blob([data]);
    saveAs(blob, fileName);
    return { status: 'ok' };
};
export default api;
