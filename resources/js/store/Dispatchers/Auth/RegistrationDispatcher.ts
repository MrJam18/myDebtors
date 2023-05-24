import {redirect, useNavigate} from "react-router";
import {Alert} from "../../../classes/Alert";
import {Dispatcher} from "../Abstract/Dispatcher";

export class RegistrationDispatcher extends Dispatcher
{
    protected async _handler(dispatcherData)
    {
        if(dispatcherData.formData.password.length < 8) throw new Error("Минимальная длина пароля должна быть не менее 8 символов")
        if(dispatcherData.formData.password !== dispatcherData.formData.passwordConfirm) throw new Error('Пароли не совпадают');
        if(!dispatcherData.group_id && !dispatcherData.formData.groupName) throw new Error('Укажите группу для вступления');
        delete dispatcherData.formData.passwordConfirm;
        await this._api.post('users/registration', dispatcherData);
        Alert.set('Успешно', "Вы успешно зарегистрировались, Письмо с подтверждением выслано вам на эл. почту");
        this.noReqData.navigate('/login');
    }
}