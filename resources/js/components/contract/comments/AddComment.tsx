import {FormEvent, useState} from "react";
import {useForm} from "../../../hooks/useForm";
import {Update} from "../../../hooks/useUpdate";
import api from "../../../http/index";
import {getContractPath} from "../../../utils/getContractPath";
import CustomModal, {SetShow} from "../../dummyComponents/CustomModal";
import Comment from "./Comment";

type Props = {
    setShow: SetShow,
    update: Update
}

const AddComment = ({setShow, update}: Props) => {
    const form = useForm({buttonText: 'сохранить', setShow, update, alertText: 'Комментарий добавлен'});
    const [file, setFile] = useState(null);
    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        const dispatcher = form.dispatcher;
        dispatcher.request = async (serverAddress, method,)=> {
            const data = new FormData(form.ref.current);
            await api.post(serverAddress, data);
        }
        dispatcher.handle(getContractPath('comments/create-one'), 'post');
    }
    return (
        <CustomModal setShow={setShow}>
            <h3 className="header_small">Добавление комментария</h3>
            <form onSubmit={onSubmit} ref={form.ref}>
                <Comment file={file} setFile={setFile} />
                {form.Button()}
            </form>
        </CustomModal>
    );
};

export default AddComment