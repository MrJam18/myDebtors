import React, { useRef, useState } from 'react';
import styles from '../../../css/changer.module.css';
import { changeDateFormatOnISO } from "../../../utils/changeDateFormat";
import CustomModal from "../CustomModal";
import ButtonInForm from "../ButtonInForm";
import EasySelect from "../EasySelect";
import Address from "../Address/Address";
import EasyInput from "../EasyInput";
let address = false;
const setAddress = (changedAddress) => address = changedAddress;
const Changer = ({ data, setModal, setReqData }) => {
    const [loading, setLoading] = useState(false);
    const input = useRef();
    const [error, setError] = useState(false);
    let Input;
    const handleClose = ev => {
        setModal(false);
        setError(false);
    };
    const changeHandler = async (ev) => {
        ev.preventDefault();
        setError(false);
        setLoading(true);
        let requestData;
        try {
            if (data.type === 'address') {
                if (!address)
                    throw new Error('Укажите измененные данные!');
                requestData = {
                    address
                };
            }
            else {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                if (data.value === input.current.value)
                    throw new Error('Укажите измененные данные!');
                requestData = {
                    changingField: {
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        [data.colName]: input.current.value
                    }
                };
            }
            await setReqData(requestData);
            setModal(false);
        }
        catch (e) {
            console.log(e);
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    };
    switch (data.type) {
        case 'selected':
            Input = () => <EasySelect variants={data.select} name={data.colName} ref={input} defaultValue={data.id}/>;
            break;
        case 'address':
            Input = () => <Address defaultValue={data.value} setAddressForDB={setAddress} showHeader={false}/>;
            break;
        case 'date':
            Input = () => <EasyInput defaultValue={changeDateFormatOnISO(data.value)} ref={input} type='date' pattern='lessThenNow' required/>;
            break;
        case 'float':
        case 'money':
        case 'percent':
            // @ts-expect-error TS(2322): Type '{ fullWidth: true; defaultValue: any; ref: M... Remove this comment to see the full error message
            Input = () => <EasyInput fullWidth defaultValue={data.value} ref={input} pattern='float' required/>;
            break;
        default:
            // @ts-expect-error TS(2322): Type '{ fullWidth: true; defaultValue: any; ref: M... Remove this comment to see the full error message
            Input = () => <EasyInput fullWidth defaultValue={data.value} ref={input}/>;
    }
    return (<CustomModal setShow={setModal} onClose={handleClose} header={'Изменение данных'} customStyles={data.style === 'fullWidth' || data.style === 'fullString' ? { minHeight: '140px', width: '500px' } : { minHeight: '150px', width: '330px' }}>
                   <h3 className={styles.header} id="child-modal-title">{data.name}</h3>
                        <form onSubmit={changeHandler}>
                            <div className={styles.input}>
                                <Input />
                            </div>
                            <ButtonInForm loading={loading}/>
                            {error && <div className="error">{error}</div>}
                        </form>
                </CustomModal>);
};
export default Changer;
