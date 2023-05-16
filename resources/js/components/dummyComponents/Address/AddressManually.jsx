import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import styles from '../../../css/adress.module.css';
import CustomModal from "../CustomModal";
import { AddressSuggestions } from "react-dadata";
import { daDataToken } from "../../../constants/daDataToken";
import AddressInputManually from "./AddressInputManually";
import { daDataApi } from "../../../http/daDataApi";
const AddressManually = ({ setShowFalse }) => {
    const dispatch = useDispatch();
    const mainRef = useRef();
    const [test, setTest] = useState();
    // @ts-expect-error TS(2345): Argument of type '() => Promise<void>' is not assi... Remove this comment to see the full error message
    useEffect(async () => {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        const daDataInputs = mainRef.current.querySelectorAll('.react-dadata__input');
        daDataInputs.forEach((el) => {
            el.style.border = 'none';
            el.style.width = 'auto';
        });
        const data = await daDataApi.post('fio', { query: 'иванов' });
        console.log(data);
    }, []);
    return (<CustomModal setShow={setShowFalse} header={'Ввод адреса вручную'}>
      <div className={styles.addressManually__main} ref={mainRef}>
    <div className={styles.header_small}>
        Регион
    </div>
          <input id={'address'}/>
          {/*@ts-ignore*/}
      <AddressSuggestions value={test} setValue={setTest} renderOption={(el) => console.log(el)} customInput={AddressInputManually} token={daDataToken} selectOnBlur/>
      </div>
  </CustomModal>);
};
export default AddressManually;
