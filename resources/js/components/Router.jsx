import '../css/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListOld from './List';
import Menu from './Menu';
import Claim from './Claim';
import Contract from './contract/Contract';
import PrivateAccess from './dummyComponents/PrivateAccess';
import PublicAccess from './dummyComponents/PublicAccess';
import Login from './Login';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../store/users/actions';
import { getLoading } from '../store/users/selectors';
import Loading from './dummyComponents/Loading';
import HidingAlert from './dummyComponents/HidingAlert';
import Start from './start/Start';
import Creditors from './creditors/Creditors';
import { getGlobalError, setGlobalError } from '../store/global';
import { setAlert } from '../store/alert/actions';
import usersSlice from '../store/users/reducer';
import LeftMenu from './LeftMenu';
import Agents from './agents/Agents';
import Debtor from "./debtor/Debtor";

function Router() {
    const dispatch = useDispatch();
    const loading = useSelector(getLoading);
    const error = useSelector(getGlobalError);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            // @ts-expect-error TS(2345): Argument of type '(dispatch: any) => Promise<void>... Remove this comment to see the full error message
            dispatch(getUser());
        }
        else
            (dispatch(usersSlice.actions.setloading(false)));
    }, []);
    useEffect(() => {
        setAlert('Ошибка', error, 'error');
        dispatch(setGlobalError(false));
    }, [error]);
    // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
    if (loading)
        return <Loading />;
    return (
    <BrowserRouter>
        <Menu />
        <LeftMenu />
        <HidingAlert></HidingAlert>
            <Routes>
            <Route path='login' exact element={<PublicAccess wrapped={<Login />}/>}/>
            <Route path='list' exact element={<PrivateAccess Wrapped={<ListOld />}/>}/>
            <Route path='claim' exact element={<PrivateAccess Wrapped={<Claim />}/>}/>
            <Route path='creditors' exact element={<PrivateAccess Wrapped={<Creditors />}/>}/>
            <Route path='agents' exact element={<PrivateAccess Wrapped={<Agents />}/>}/>
            <Route path='contracts/:contractId' element={<PrivateAccess Wrapped={<Contract />}/>}/>
            <Route path='debtors/:debtorId' element={<PrivateAccess Wrapped={<Debtor />}/>}/>
            <Route path='/' element={<PrivateAccess Wrapped={<Start />}/>}/>
            </Routes>
      </BrowserRouter>);
}
export default Router;
//# sourceMappingURL=Router.jsx.map