import { useState } from "react";
import { Alert } from "../../../classes/Alert";
import { useForm } from "../../../hooks/useForm";
import { useShow } from "../../../hooks/useShow";
import api from "../../../http/index";
import CustomModal from "../../dummyComponents/CustomModal";
import DeleteButton from "../../dummyComponents/DeleteButton";
import Warning from "../../dummyComponents/Warning";
import Comment from "./Comment";
const ChangeComment = ({ comment, setShow, update }) => {
    const form = useForm({ buttonText: 'сохранить', setShow, update, alertText: 'Комментарий изменен' });
    const [file, setFile] = useState({ name: comment.file_name, isInitial: true });
    const onDelete = async () => {
        try {
            await api.delete('contract-comments/delete-one/' + comment.id);
            setShow(false);
            update();
            Alert.set('Успешно', 'Комментарий удален');
        }
        catch (e) {
            form.setError(e.message);
        }
    };
    const showDeleteWarning = useShow(Warning, { text: "Вы уверены, что хотите удалить комментарий? Отменить это действие будет невозможно", onSubmit: onDelete });
    const onSubmit = (ev) => {
        ev.preventDefault();
        const dispatcher = form.dispatcher;
        dispatcher.request = async (serverAddress, method) => {
            const data = new FormData(form.ref.current);
            await api.post(serverAddress, data);
        };
        dispatcher.handle('contract-comments/update-one/' + comment.id, 'post');
    };
    return (<CustomModal setShow={setShow}>
            {showDeleteWarning.Comp()}
            <h3 className="header_small">Изменение комментария</h3>
            <div className="margin-bottom_10">
                <DeleteButton onClick={showDeleteWarning.setTrue}/>
            </div>
            <form onSubmit={onSubmit} ref={form.ref}>
                <Comment initText={comment['contract_comments.text']} file={file} setFile={setFile}/>
                {form.Button()}
            </form>
        </CustomModal>);
};
export default ChangeComment;
