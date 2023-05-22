import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recieveTaskstList } from '../../store/tasks/actions';
import { getTasksList, getTasksTotal } from '../../store/tasks/selectors';
import { getUserId } from '../../store/users/selectors';
import NoBorderTable from '../dummyComponents/NoBorderTable';
import { setAlert } from '../../store/alert/actions';
import styles from '../../css/start.module.css';
import MinPagination from '../dummyComponents/MinPagination';
const focus = false;
const sort = ['time', 'ASC'];
const Tasks = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const headers = [{ key: 'createdAt', type: 'date/time', name: 'Дата создания' }, { key: 'name', name: 'Название' }, { key: 'time', name: 'Конечный срок', type: 'date/time' }];
    const tasks = useSelector(getTasksList);
    const totalTasks = useSelector(getTasksTotal);
    const userId = useSelector(getUserId);
    const [page, setPage] = useState(1);
    const changePage = async (limit, page) => {
        setLoading(true);
        setPage(page);
        try {
            // @ts-expect-error TS(2345): Argument of type '(dispatch: any) => Promise<void>... Remove this comment to see the full error message
            await dispatch(recieveTaskstList(limit, page, sort, userId));
        }
        catch (e) {
            setAlert('Ошибка!', "Ошибка при получении списка задач!", "error");
        }
        finally {
            setLoading(false);
        }
    };
    const sortHandler = async () => {
    };
    useEffect(() => {
        setLoading(true);
        // @ts-expect-error TS(2345): Argument of type '(dispatch: any) => Promise<void>... Remove this comment to see the full error message
        dispatch(recieveTaskstList(10, page, sort, userId))
            .catch(() => setAlert('Ошибка!', "Ошибка при получении списка задач!", "error"))
            .finally(() => setLoading(false));
    }, []);
    return (<div className={styles.element}>
            <div className="header">Мои задачи</div>
            <div className={styles.flexWrapper}>
           <NoBorderTable loading={loading} rows={tasks} headers={headers} focus={focus} sortHandler={sortHandler}/>
           <MinPagination pageUpdater={changePage} total={totalTasks}/>
           </div>
        </div>);
};
export default Tasks;

//# sourceMappingURL=Tasks.jsx.map