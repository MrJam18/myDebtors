import { Column } from "../classes/Column";
import api from "../http";
const noChange = true;
const getPassportTypes = async () => {
    const { data } = await api.get('debtors/passport-types');
    return data;
};
const columns = [new Column('Фамилия', 'name.surname'), new Column('Имя', 'name.name'), new Column('Отчество', 'name.patronymic'), new Column('Дата рождения', 'birth_date', 'date'), new Column("Место рождения", 'birth_place'), new Column('Количество договоров', 'countContracts', undefined, { noChange }), new Column('Адрес регистрации', 'fullAddress', 'address', { style: 'fullWidth' }), new Column('Дата создания', 'created_at', 'date', { noChange }), new Column('Дата обновления', 'updated_at', 'date', { noChange })];
const passportColumns = [new Column('тип паспорта', 'type', 'selected', { func: getPassportTypes, style: 'fullWidth' }), new Column('серия и номер', 'seriesAndNumber', 'composed', { elements: [new Column('серия паспорта', 'series'), new Column('номер паспорта', 'number')] }), new Column('дата выдачи', 'issued_date', 'date'), new Column('Кем выдан', 'issued_by', undefined, { style: 'fullWidth' }), new Column("код подразделения", 'gov_unit_code'), new Column('дата обновления', 'updated_at', 'date', { noChange })];
export { columns, passportColumns };
