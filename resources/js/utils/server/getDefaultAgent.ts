import {Alert} from "../../classes/Alert";
import api from "../../http/index";

export async function getDefaultAgent(setAgent: (agent: {id, name})=> void) {
    try {
        const {data} = await api.get('agents/get-default');
        setAgent(data);
    } catch (e) {
        Alert.setError('Ошибка при получении агента по умолчанию.', e);
    }
}