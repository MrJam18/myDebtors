import axios, {AxiosInstance, AxiosResponse} from 'axios';
import { serverApi } from '../utils/serverApi';
import { saveAs } from 'file-saver';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const api: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: serverApi,
    timeout: 5000,
    timeoutErrorMessage: 'Истекло время на ответ сервера.',
    headers: {
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((conf)=> {
    conf.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return conf;
})
api.interceptors.response.use((conf) => conf, async (err) => {
    if (err.response.status === 401 && err.config.url !== "users/get") return window.location.replace('/login');
    throw err;
});



export const saveFile =  async (path): Promise<AxiosResponse> => {
    return handleBlobRequest(path, 'get');
}
export const saveFilePost = async (path: string, body: Record<string, any>): Promise<AxiosResponse> => {
    return handleBlobRequest(path, 'post', body);
}

const handleBlobRequest = async (path, method, body = null): Promise<AxiosResponse> => {
    try {
        let response;
        if(method === 'put' || method === 'post') response = await api[method](path, body, {responseType: 'blob'});
        else response = await api[method](path, {responseType: 'blob'});
        const parts = response.headers['content-disposition'].split(';');
        let filename;
        if (parts[2]) {
            filename = parts[2]?.split('=')[1];
            filename = decodeURIComponent(filename.replace('utf-8\'\'', ''));
        } else filename = parts[1]?.split('=')[1];
        const blob = new Blob([response.data]);
        saveAs(blob, filename);
        return response
    } catch (e) {
        if(e.response?.data) {
            const blob = new Blob([e.response.data]);
            const data = await JSON.parse(await blob.text());
            console.dir(data);
            throw data;
        }
        console.dir(e);
        throw e;
    }
}

export default api;
