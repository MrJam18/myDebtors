import {Alert} from "../../../classes/Alert";
import api from "../../../http/index";
import {Dispatcher} from "../Abstract/Dispatcher";

export class EnforcementProceedingsDispatcher extends Dispatcher
{
    async _handler(data)
    {
        // Вы можете добавить дополнительные проверки данных здесь, если это необходимо.
        // Например:
        // if(!data.bailiffId) throw new Error('Выберите судебного пристава!');
        try {
            await api.post('enforcement-proceedings/create', data);
            Alert.set('Успешно', "Исполнительное производство успешно создано");
        } catch (error) {
            console.error("Произошла ошибка при отправке данных", error);
            throw error; // переброс ошибки выше для дальнейшей обработки
        }
    }
}
