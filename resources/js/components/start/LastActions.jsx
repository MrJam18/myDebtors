import { useMemo} from 'react';
import { useDispatch } from 'react-redux';
import NoBorderTable from '../dummyComponents/NoBorderTable';
import styles from '../../css/start.module.css';
import { recieveAndSaveDocument } from '../../store/actions/actions';
import MinPagination from '../dummyComponents/MinPagination';
import { addLinksForSaveFile } from '../../utils/addLinkForSaveFile.jsx';
import useList from "../../hooks/useList";
const LastActions = () => {
    const dispatch = useDispatch();
    const focus = false;
    const headers = [{ name: "Дата/время", key: 'createdAt', type: 'date/time' }, { name: "Действие", key: 'actionType' }, { name: "Объект", key: 'actionObject' }, { name: "Результат", key: 'result', styles: { minWidth: '200px' } }];
    let list = useList('actions/lastActions', {perPage: 8});
    list.get = useMemo(() => addLinksForSaveFile(list.get, onClickDocumentLink), [list.get]);
    const onClickDocumentLink = (ev) => {
        const path = ev.currentTarget.getAttribute('data-path');
        const object = ev.currentTarget.getAttribute('data-object');
        const id = ev.currentTarget.getAttribute('data-id');
        dispatch(recieveAndSaveDocument(path, object + ' ' + id + '.docx'));
    };
    const sortHandler = async () => {
    };
    return (<div className={styles.element}>
            <div className="header">Мои последние действия</div>
            <div className={styles.flexWrapper}>
           <NoBorderTable loading={list.loading} headers={headers} rows={list.get} focus={focus} sortHandler={sortHandler}/>
           <MinPagination pageUpdater={list.setPage} total={list.totalItems}/>
           </div>
        </div>);
};
export default LastActions;