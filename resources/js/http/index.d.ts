import { AxiosInstance } from 'axios';
declare const api: AxiosInstance;
export declare const saveFile: (path: any, fileName: any) => Promise<{
    status: string;
}>;
export declare const saveFilePost: (path: any, body: any, fileName: any) => Promise<{
    status: string;
}>;
export default api;
