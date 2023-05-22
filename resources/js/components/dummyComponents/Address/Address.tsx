import React, {useRef} from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import styles from '../../../css/adress.module.css'
import { useState } from 'react';
import {useShow} from "../../../hooks/useShow";
import {AddressFields} from "../../../Types/AddressFields";
import AddressManually from "./AddressManually";
import {daDataToken} from "../../../constants/daDataToken";
import addressManuallyIMG from '../../../img/address-manually.svg';

type Props = {
    setAddressForDB: React.Dispatch<React.SetStateAction<AddressFields>>,
    defaultValue?: string,
    showHeader?: boolean
}

const Address = ({setAddressForDB, defaultValue = '', showHeader = true}: Props) => {
    const suggestionsRef = useRef<AddressSuggestions>(null);
    const [error, setError] = useState(false);
    const showAddressManually = useShow();
    const  onSelectAddress = (val) => {
        const data = val.data;
        setError(false);
        try {
            if (data.house === null) throw new Error('Введите полный адрес до дома!');
            setAddressForDB({
                country: data.country,
                region: data.region_with_type,
                area: data.area_with_type,
                settlement: data.city_with_type || data.settlement_with_type,
                street: data.street_with_type ? data.street_with_type : data.settlement_with_type,
                house: `${data.house_type} ${data.house}`,
                flat: data.flat ? `${data.flat_type} ${data.flat}` : null,
                block: data.block ? `${data.block_type} ${data.block}` : null,
                postal_code: data.postal_code
            });
        } catch (e) {
            console.dir(e);
            setError(e.message);
        }
    }

    return (
        <div className={styles.main}>
            {showHeader && <div className={styles.header}>Адрес</div> }
           Введите адрес и выберите из списка.
            <div className={styles.inputBlock}>
                <div className={styles.inputContainer}>
            <AddressSuggestions ref={suggestionsRef} selectOnBlur defaultQuery={defaultValue} token={daDataToken} delay={350} onChange= { onSelectAddress} inputProps = {{
                placeholder: 'Введите адрес',
            }}/>
                </div>
                <button onClick={showAddressManually.setTrue} type={"button"} title={'Адрес вручную'} className={styles.handleAddressButton}>
                    <img src={addressManuallyIMG} className={styles.handleAddressIMG} alt="Добавить адрес вручную"/>
                </button>
            </div>
            {error && <div className={styles.error}>{error}</div> }
            {showAddressManually.state && <AddressManually setValue={suggestionsRef.current?.setInputValue} setShow={showAddressManually.setShow} setAddress={setAddressForDB} />}
        </div>
    );
};

export default Address;