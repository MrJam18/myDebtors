import { TextField } from "@mui/material";
import React from 'react';
import useDebounce from "../../../hooks/useDebounce";
function ListSearcher({ setSearch, label = 'Поиск' }) {
    const onSearch = (val) => {
        setSearch(val);
    };
    const debouncedSearch = useDebounce(onSearch, 300);
    const changeInputHandler = async (ev) => {
        const value = ev.target.value;
        if (value !== '')
            debouncedSearch(value);
        else
            debouncedSearch(null);
    };
    return (<TextField variant={'standard'} type={'search'} onChange={changeInputHandler} size={'small'} label={label}/>);
}
export default ListSearcher;
