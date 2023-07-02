import { MenuItem, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../css/customSearch.module.css';
import useDebounce from '../../../hooks/useDebounce';
import { makeStyles } from '@mui/styles';
import api from "../../../http";
import { Alert } from "../../../classes/Alert";
const useStyles = makeStyles({
    result: {
        // @ts-expect-error TS(2322): Type '"break-spaces !important"' is not assignable... Remove this comment to see the full error message
        whiteSpace: 'break-spaces !important',
        width: '100%',
        backgroundColor: 'white',
        opacity: 100,
        zIndex: '2',
        '&:hover': {
            zIndex: 2,
            backgroundColor: '#ebebeb;',
            '& .Mui-selected': {
                backgroundColor: 'green'
            }
        }
    }
});
const EasySearch = ({ label = null, customStyles = null, serverAddress, delay = 300, setValue, value = null, required = false, disabled = false, onKeyDown = null, className = null, reqData = null, inputVariant = 'standard' }) => {
    const [results, setResults] = useState([]);
    const onSearch = async (val) => {
        try {
            let url = serverAddress + `?searchString=${val}`;
            if (reqData) {
                for (let key in reqData) {
                    url += `&${key}=${reqData[key]}`;
                }
            }
            const response = await api.get(url);
            if (!response.data || !(response.data instanceof Array))
                throw new Error('cant get data from url ' + response.config.url);
            if (response.data.length !== 0)
                setResults(response.data);
        }
        catch (e) {
            Alert.setError('EasySearch Error', e);
        }
    };
    const classes = useStyles();
    const input = useRef(null);
    const debouncedSearch = useDebounce(onSearch, delay);
    const [shrink, setShrink] = useState(false);
    const changeInputHandler = async (ev) => {
        const val = ev.target.value;
        if (val !== '') {
            debouncedSearch(val);
        }
        if (value)
            setValue(null);
    };
    const chooseHandler = (ev) => {
        const id = +ev.currentTarget.getAttribute('data-id');
        const find = results.find((el) => el.id === id);
        setValue(find);
    };
    useEffect(() => {
        return () => {
            setResults([]);
        };
    }, []);
    useEffect(() => {
        if (value) {
            setShrink(true);
            input.current.value = value.name;
            setResults([]);
            input.current.setCustomValidity('');
        }
        else if (required) {
            input.current.setCustomValidity('Введите название и выберите из списка!');
        }
        if (!value) {
            setShrink(false);
            input.current.value = '';
            setResults([]);
        }
    }, [value]);
    const Results = results.map((result) => {
        return (<MenuItem key={result.id} className={classes.result} tabIndex={0} focusVisibleClassName={styles.selected} data-id={result.id} onClick={chooseHandler}> {result.name} </MenuItem>);
    });
    const onFocus = () => {
        if (!shrink)
            setShrink(true);
    };
    const onBlur = (ev) => {
        if (!ev.target.value)
            setShrink(false);
    };
    return (<div style={customStyles} className={styles.main + (className ? ' ' + className : '')}>
      <TextField disabled={disabled} onBlur={onBlur} onFocus={onFocus} onChange={changeInputHandler} size='small' onKeyDown={onKeyDown} label={label} required={required} InputLabelProps={{ shrink }} defaultValue={value === null || value === void 0 ? void 0 : value.name} variant={inputVariant} inputRef={input} fullWidth/>
      <div className={styles.results}>{Results}</div>
     </div>);
};
export default EasySearch;
