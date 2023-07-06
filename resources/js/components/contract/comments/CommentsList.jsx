import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert } from "../../../classes/Alert";
import { Header } from "../../../classes/Header";
import { useShow } from "../../../hooks/useShow";
import { useUpdate } from "../../../hooks/useUpdate";
import { saveFile } from "../../../http/index";
import { getUserId } from "../../../store/users/selectors";
import { getContractPath } from "../../../utils/getContractPath";
import CustomList from "../../dummyComponents/CustomList";
import styles from '../../../css/contract.module.css';
import ChangeComment from "./ChangeComment";
import CommentsToolBar from "./CommentsToolBar";
const onClickFile = async (ev) => {
    ev.stopPropagation();
    const data = ev.currentTarget.getAttribute('data');
    try {
        await saveFile(data);
    }
    catch (e) {
        Alert.setError('Ошибка при загрузке файла', e);
    }
};
const headers = [
    new Header('Дата/Время', 'contract_comments.created_at', { type: 'date' }),
    new Header('Текст', 'contract_comments.text'),
    new Header('Автор', 'names.surname'),
    /*@ts-ignore*/
    new Header('Файл', "file_url", { type: "button", button: ({ data }) => <FontAwesomeIcon title='загрузить файл' onClick={onClickFile} data={data} style={{ color: "#2a71fe", fontSize: '20px', cursor: "pointer" }} icon={faFile}/> })
];
const CommentsList = ({}) => {
    const update = useUpdate();
    const [search, setSearch] = useState(null);
    const userId = useSelector(getUserId);
    const [changedComment, setChangedComment] = useState(null);
    const showChangeComment = useShow(ChangeComment, { update: update.set, comment: changedComment });
    useEffect(() => {
        if (changedComment) {
            if (changedComment.user_id !== userId)
                Alert.setError('Ошибка при изменении комментария', new Error("Вы не являетесь владельцем комментария и не можете изменить его"));
            else
                showChangeComment.setTrue();
        }
    }, [changedComment]);
    return (<div className={styles.content}>
            {showChangeComment.Comp()}
            <h3 className={styles.header_small}>Управление комментариями</h3>
            <CommentsToolBar setSearch={setSearch} update={update.set}/>
            <div style={{ height: "auto", minHeight: '70%' }} className='full-size-flex-wrapper'>
                <CustomList defaultOrder={['contract_comments.created_at', 'DESC']} search={search} setElement={setChangedComment} headers={headers} serverAddress={getContractPath(`comments/list`)} update={update.state}/>
            </div>
        </div>);
};
export default CommentsList;
