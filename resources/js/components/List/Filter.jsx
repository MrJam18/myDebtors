import { useRef } from "react";
import { Header } from "../../classes/Header";
import { useError } from "../../hooks/useError";
import { useLoading } from "../../hooks/useLoading";
import { formDataConverter } from "../../utils/formDataConverter";
import ButtonInForm from "../dummyComponents/ButtonInForm";
import CustomInput from "../dummyComponents/CustomInput";
import CustomModal from "../dummyComponents/CustomModal";
import EasyCheckBox from "../dummyComponents/EasyCheckBox";
import EasySelect from "../dummyComponents/EasySelect";
import styles from '../../css/list.module.css';
const filterVariants = [
    { id: 'LIKE', name: 'Содержит' },
    { id: 'NOT LIKE', name: 'Не содержит' },
    { id: '=', name: 'Равно' },
    { id: '!=', name: 'Не равно' },
];
const numberDateFilterVariants = [
    { id: '=', name: 'Равно' },
    { id: '!=', name: 'Не равно' },
    { id: '<=', name: 'Меньше или равно' },
    { id: '>=', name: 'Больше или равно' },
];
const filterHeaders = [
    new Header('Дата выдачи', 'contracts.issued_date', { type: 'date' }),
    new Header('Номер', 'contracts.number'),
    new Header('Фамилия должника', 'names.surname'),
    new Header('Имя должника', 'names.name'),
    new Header('Отчество должника', 'names.patronymic'),
    new Header('кредитор', 'creditors.name'),
    new Header('статус', 'contract_statuses.name')
];
const Filter = ({ setFilter, setShow, filter }) => {
    const formRef = useRef();
    const error = useError();
    const loading = useLoading(false);
    const onSubmit = (ev) => {
        ev.preventDefault();
        const filter = [];
        const formData = formDataConverter(formRef.current.elements);
        filterHeaders.forEach((el) => {
            if (formData[el.key] && formData[el.key + '__value']) {
                filter.push({
                    key: el.key,
                    operator: formData[el.key + '__operator'],
                    value: formData[el.key + '__value']
                });
            }
        });
        setFilter(filter);
        setShow(false);
    };
    const onChangeCheckBox = (checked, ev) => {
        const target = ev.target;
        const key = target.name;
        const input = formRef.current.elements[key + '__value'];
        input.disabled = target.checked;
    };
    return (<CustomModal setShow={setShow} customStyles={{ width: '765px' }}>
            <h3 className="header marginTop_0">Фильтр договоров</h3>
            <form onSubmit={onSubmit} ref={formRef}>
            {filterHeaders.map((header) => {
            var _a;
            let variants = filterVariants;
            if (header.type === 'date')
                variants = numberDateFilterVariants;
            let filterEl = filter === null || filter === void 0 ? void 0 : filter.find((element) => element.key === header.key);
            let defaultOperator;
            if (filterEl)
                defaultOperator = filterEl.operator;
            else if (header.type === 'date')
                defaultOperator = '=';
            else
                defaultOperator = 'LIKE';
            return (<div key={header.key} className={styles.filter__row}>
                        <EasyCheckBox onChange={onChangeCheckBox} className={styles.filter__checkbox} defaultValue={Boolean(filterEl)} label={header.name} name={header.key}/>
                        {/*@ts-ignore*/}
                        <EasySelect customClassName={styles.filter__selector} name={header.key + '__operator'} variants={variants} value={defaultOperator}/>
                        <CustomInput inputProps={{ disabled: !Boolean(filterEl) }} required={false} type={(_a = header.type) !== null && _a !== void 0 ? _a : 'search'} defaultValue={filterEl === null || filterEl === void 0 ? void 0 : filterEl.value} name={header.key + '__value'} className={styles.filter__input}/>
                    </div>);
        })}
                <ButtonInForm text={'Сохранить'} loading={loading.state} customClassName={styles.filter__button}/>
                {error.Comp()}
            </form>
        </CustomModal>);
};
export default Filter;
