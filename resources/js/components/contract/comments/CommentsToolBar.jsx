import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import React from "react";
import styles from '../../../css/contract.module.css';
import { useShow } from "../../../hooks/useShow";
import ListSearcher from "../../dummyComponents/search/ListSearcher";
import AddComment from "./AddComment";
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
const CommentsToolBar = ({ setSearch, update }) => {
    const showAddComment = useShow(AddComment, { update });
    return (<div className={styles.list__toolbar}>
            {showAddComment.Comp()}
            <ListSearcher setSearch={setSearch}/>
            <Button variant="text" onClick={showAddComment.setTrue} style={{ width: 'auto' }}><FontAwesomeIcon icon={solid('plus')} className={styles.payments__addIcon}/> Добавить</Button>
        </div>);
};
export default CommentsToolBar;
