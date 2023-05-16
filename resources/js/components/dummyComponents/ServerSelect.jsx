import React, { useEffect, useState, forwardRef } from "react";
import api from "../../http/index";
import EasySelect from "./EasySelect";
import { Alert } from "../../classes/Alert";
const ServerSelect = forwardRef(({ name = null, label, style = null, setId = null, customClassName = null, defaultId = null, defaultValue, serverAddress }, ref) => {
    const [variants, setVariants] = useState([]);
    const [initId, setInitId] = useState('');
    useEffect(() => {
        api.get(serverAddress)
            .then((res) => {
            if (!res.data || !(res.data instanceof Array))
                Alert.set('Select error', 'cant take data from url: ' + res.config.url, 'error');
            else
                setVariants(res.data);
            if (defaultId) {
                const found = res.data.find((el) => el.id == defaultId);
                if (found) {
                    setId(found.id);
                    setInitId(found.id);
                }
            }
            else if (defaultValue) {
                const found = res.data.find((el) => el.name === defaultId);
                if (found) {
                    setId(found.id);
                    setInitId(found.id);
                }
            }
        })
            .catch((res) => {
            Alert.setError('Select error', res);
        });
    }, []);
    return (<EasySelect ref={ref} name={name} label={label} onChange={setId} variants={variants} style={style} customClassName={customClassName} value={initId}/>);
});
export default ServerSelect;
