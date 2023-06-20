import React, {ForwardedRef, useEffect, useState, forwardRef} from "react";
import api from "../../http/index";
import EasySelect from "./EasySelect";
import {Alert} from "../../classes/Alert";

type ServerSelectProps = {
    name?: string,
    id?: number,
    label: string,
    style?: React.CSSProperties,
    setId?:  React.Dispatch<React.SetStateAction<number>>,
    customClassName?: string,
    defaultId?: string | number,
    serverAddress: string,
    defaultValue?: string,
    smallLabel?: boolean,
    required?: boolean
}

const ServerSelect = forwardRef(({name = null, label, style = null, id = null, setId = null, customClassName = null, defaultId = null, defaultValue, serverAddress, smallLabel=false, required=false}: ServerSelectProps, ref: ForwardedRef<any>) => {
    const [variants, setVariants] = useState([]);
    const [initId, setInitId] = useState('');
    useEffect(()=> {
        api.get(serverAddress)
            .then((res)=> {
                if(!res.data || !(res.data instanceof Array)) Alert.set('Select error', 'cant take data from url: ' + res.config.url, 'error');
                else setVariants(res.data);
                if(defaultId) {
                    const found = res.data.find((el) => el.id == defaultId);
                    if(found) {
                        if(setId) setId(found.id);
                        setInitId(found.id);
                    }
                }
                else if(defaultValue) {
                    const found = res.data.find((el) => el.name === defaultId);
                    if(found) {
                        if (setId) setId(found.id);
                        setInitId(found.id);
                    }
                }
            })
            .catch((res)=> {
                Alert.setError('Select error', res);
            });
    }, []);
    useEffect(() => {
        if (id) {
            setInitId(String(id));
        }
        else if(id === 0) setInitId('');
    }, [id]);
    return (
        <EasySelect required={required} smallLabel={smallLabel} ref={ref} name={name} label={label} onChange={setId} variants={variants} style={style} customClassName={customClassName} value={initId} />
    );
});

export default ServerSelect;