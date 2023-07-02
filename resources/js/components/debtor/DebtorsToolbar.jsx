import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import React from "react";
import styles from "../../css/leftList.module.css";
import { useShow } from "../../hooks/useShow";
import ListSearcher from "../dummyComponents/search/ListSearcher";
import AddDebtor from "./AddDebtor";
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
const DebtorsToolbar = ({ update, setSearch }) => {
    const showAddDebtor = useShow(AddDebtor, { updateList: update });
    return (<div className={styles.toolbar}>
            {showAddDebtor.Comp()}
            <ListSearcher setSearch={setSearch}/>
            <Button variant="text" onClick={showAddDebtor.setTrue} className={styles.toolbar__button}><FontAwesomeIcon icon={solid('plus')} className={styles.addIcon}/> Добавить</Button>
        </div>);
};
export default DebtorsToolbar;
