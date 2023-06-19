import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useError } from "../../hooks/useError";
import { useLoading } from "../../hooks/useLoading";
import { RegistrationDispatcher } from "../../store/Dispatchers/Auth/RegistrationDispatcher";
import ButtonInForm from "../dummyComponents/ButtonInForm";
import Content from "../dummyComponents/Content";
import CustomInput from "../dummyComponents/CustomInput";
import styles from "../../css/auth.module.css";
import EasySelect from "../dummyComponents/EasySelect";
import EasySearch from "../dummyComponents/search/EasySearch";
const groupVariants = [
    { id: 1, name: 'Запрос на вступление в группу' },
    { id: 2, name: 'Создать новую группу' }
];
const Registration = ({}) => {
    const navigate = useNavigate();
    const [groupVariant, setGroupVariant] = useState(1);
    const [group, setGroup] = useState(null);
    const formRef = useRef();
    const loading = useLoading(false);
    const error = useError();
    const onSubmit = (ev) => {
        ev.preventDefault();
        const dispatcher = new RegistrationDispatcher(error.setError, loading.set, formRef);
        if (group)
            dispatcher.addData('group_id', group.id);
        dispatcher.addNoReqData('navigate', navigate);
        dispatcher.handle();
    };
    return (<><Content boxClassName={styles.main} header={'Регистрация нового пользователя'}>
        <form ref={formRef} onSubmit={onSubmit}>
            <div className={styles.header}>Введите учетные данные</div>
            <CustomInput type={'email'} className={styles.input} label={"Email"} name='email' required />
            <div className={styles.smallInputs}>
                <CustomInput name='password' label={'Пароль'} className={styles.smallInput} type={'password'} />
                <CustomInput name='passwordConfirm' label={'Подтвердите пароль'} className={styles.smallInput} type={'password'} />
            </div>
            <div className={styles.smallInputs}>
                <CustomInput name='surname' className={styles.smallInput} label={'Ваша фамилия'} />
                <CustomInput name='name' className={styles.smallInput} label={'Ваше имя'} />
            </div>
            <div className={styles.smallInputs}>
                <CustomInput required={false} name='patronymic' className={styles.smallInput} label={'Ваше отчество'} />
                <CustomInput name='phone' label={'Телефон'} className={styles.smallInput} />
            </div>
            <EasySelect variants={groupVariants} label={"Укажите порядок участия в группе"} onChange={setGroupVariant} customClassName={styles.input} defaultValue={1} smallLabel />
            {groupVariant === 1 &&
                <EasySearch serverAddress={'users/group-search'} className={styles.input} setValue={setGroup} value={group} label={'Укажите название группы для вступления'} />}
            {groupVariant === 2 &&
                <CustomInput name='groupName' className={styles.input} label={'Укажите название новой группы'} />}
            <ButtonInForm loading={loading.state} />
            {error.Comp()}
        </form>

    </Content><><div className='footer-bottom '>
        <div>
            <p>8 800 200 200</p>
            <p>myDeptors@mail.com</p>
        </div>
        <div>
            <p>my Deptors</p>
            <p>© 2023 Brand All Rights Reserved.</p>
        </div>
    </div></></>
    
    );
};
export default Registration;
