import React, {useState} from "react";
import styles from "../../../css/contract.module.css";
import {useDispatch, useSelector} from "react-redux";
import CustomModal from "../../dummyComponents/CustomModal";
import {Select, TextField} from "@mui/material";
import CustomLoadingButton from "../../dummyComponents/CustomLoadingButton";
import {capitalizeFirstLetter} from "../../../utils/text/capitalize";
import api from "../../../http";
import {setAlert} from "../../../store/alert/actions";
import SearchAndAddButton from "../../dummyComponents/search/SearchAndAddButton";
import CreateBailiffDepartment from "./CreateBailiffDepartment";
import ServerSelect from "../../dummyComponents/ServerSelect";




const CreateBailiff = ({setShow, setNewItem})=>{
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const onBlurName = (ev) => {
        const value = ev.target.value;
        if (value)
            ev.target.value = capitalizeFirstLetter(value);
    };
    const [bailiffDepartment, setBailiffDepartment] = useState();
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [bailiffPosition, setBailiffPosition] = useState();
    const onClickCreateBailiffDepartment = () => {
        setShowCreateBailiffDepartment(true);
    }
    const [showCreateBailiffDepartment, setShowCreateBailiffDepartment] = useState(false);

    const onSubmit = async () => {
        setError(false);
        setLoading(true);
        try{
            const {data} = await api.post('bailiffs/create',
                {name, surname, patronymic, bailiffDepartmentId: bailiffDepartment.id, bailiffPosition});
            dispatch(setAlert('Успешно!'));
            const formattedBailiff = { ...data, name: `${surname} ${name} ${patronymic}` };
            setNewItem(formattedBailiff);
            setShow(false);
        }
        catch (e) {
            console.dir(e);
            if(e.message) setError(e.message)
        }
        finally {
            setLoading(false)
        }
    }



    return (
        <CustomModal show={true} setShow={setShow}>
            <div className={styles.courtCreator}>
                {showCreateBailiffDepartment && <CreateBailiffDepartment setShow={setShowCreateBailiffDepartment} setNewValue={setBailiffDepartment} /> }
                <div className='header_small'>Создание судебного пристава.</div>
                <div className={styles.courtCreator__inputMargin}>
                    <TextField onBlur={onBlurName} label='Фамилия' name={'surname'}  variant='standard'  required fullWidth onChange={e => setSurname(e.target.value)} />
                </div>
                <div className={styles.courtCreator__inputMargin}>
                    <TextField onBlur={onBlurName} label='Имя' name='name'  variant='standard'  required fullWidth onChange={e => setName(e.target.value)} />
                </div>
                <div className={styles.courtCreator__inputMargin}>
                    <TextField onBlur={onBlurName} label='Отчество' name='patronymic'  variant='standard'  required fullWidth onChange={e => setPatronymic(e.target.value)}/>
                </div>
                <div className={styles.contentBlock}>
                    <SearchAndAddButton value={bailiffDepartment} serverAddress={'bailiffs-departments/search'} required setValue={setBailiffDepartment} label='Отдел судебных приставов-исполнителей' onClickAddButton={onClickCreateBailiffDepartment} />
                </div>
                <div className={styles.contentBlock}>
                    <ServerSelect  serverAddress={'bailiffs/get-positions'} required label='Должность судебного пристава' name='bailiffPosition' setId={value => setBailiffPosition(value)}/>
                </div>

                <CustomLoadingButton onClick={onSubmit} loading={loading} />
                {error && <div className='error'>{error}</div>}
            </div>
        </CustomModal>
    );
}
export default CreateBailiff;
