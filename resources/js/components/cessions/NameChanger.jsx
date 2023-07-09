import React, { useMemo, useState} from 'react';
import CustomModal from "../dummyComponents/CustomModal";
import ButtonInForm from "../dummyComponents/ButtonInForm";
import {useError} from "../../hooks/useError";
import {changeDateFormatOnRus} from "../../utils/changeDateFormat";
import {TextField} from "@mui/material";
import CustomCheckBox from "../dummyComponents/CustomCheckBox";
import api from "../../http";
import {Alert} from "../../classes/Alert";
import {compareDatesBool} from "../../utils/dates/compareDatesBool";

const NameChanger = ({dataArray, deleteIds, setShow, setShowCessionChanger, initDefaultCession, setCession = null, update = null, cessionGroupId = null}) => {
    const defaultName = useMemo(()=> {
        const sorted = dataArray.sort((a, b)=> {
            if(a.transferDate === b.transferDate) return 0;
            if(compareDatesBool(a.transferDate, b.transferDate)) return 1;
            else return -1;
        });
        const lastCession = sorted[sorted.length - 1];
        return `дог. ${lastCession.number ? '№ ' + lastCession.number : 'б/н'} от ${changeDateFormatOnRus(lastCession.transferDate)} г. ${lastCession.assignor.short} - ${lastCession.assignee.short}`;
    }, [dataArray]);
    const [loading, setLoading] = useState(false);
    const error = useError();
    const [defaultCession, setDefaultCession] = useState(initDefaultCession);
    const submitHandler = async (ev) => {
        error.setError(false);
        setLoading(true);
        ev.preventDefault();
        try{
            const name = ev.target.elements.name.value;
            const data = {
                isDefaultCession: defaultCession,
                cessionGroupId,
                deleteIds,
                list: dataArray,
                name
            }
            const response = await api.post('/cessions/set-one', data);
            if(update) update();
            if(setCession && response.data) setCession(response.data);
            setShow(false);
            setShowCessionChanger(false);
            Alert.set('Успешно', "Цессия изменена/добавлена");
        }
        catch(e) {
            console.dir(e);
            error.setError(e.message);
        }
        finally {
            setLoading(false);
        }
    }
 return (
  <CustomModal setShow={setShow} >
      <form onSubmit={submitHandler}>
   <div className="header">Укажите название группы цессий</div>
          <div className="margin-bottom_10">
          <TextField multiline required maxRows={10} fullWidth defaultValue={defaultName} name={'name'} />
          </div>
          <CustomCheckBox checked={defaultCession} setChecked={setDefaultCession} label={'Сделать цессией по умолчанию для кредитора'} size={'big'} />
          <div className="margin-bottom_10">
   <ButtonInForm text={'Сохранить'} loading={loading} />
              {error.Comp()}
          </div>
      </form>
  </CustomModal>
 );
};

export default NameChanger;