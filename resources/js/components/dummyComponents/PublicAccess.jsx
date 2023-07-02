import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getOldURL } from "../../store/global/index";
import { getIsOnline } from '../../store/users/selectors';
const PublicAccess = ({ wrapped }) => {
    const authorization = useSelector(getIsOnline);
    const oldURL = useSelector(getOldURL);
    return !authorization ? wrapped : <Navigate to={oldURL !== null && oldURL !== void 0 ? oldURL : '/'}/>;
};
export default PublicAccess;
