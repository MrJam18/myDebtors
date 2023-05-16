export default class AuthService {
    static login(email: any, password: any): Promise<import("axios").AxiosResponse<any, any>>;
    static logout(): Promise<import("axios").AxiosResponse<any, any>>;
}
