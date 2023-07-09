import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import React from "react";
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
const styles = {
    toolBarButton: {
        width: 'auto'
    },
    addIcon: {
        marginRight: '8px',
        width: '15px',
        fontSize: '6px',
        height: '18px'
    }
};
const AddButton = ({ onClick }) => {
    return (<Button variant="text" onClick={onClick} style={styles.toolBarButton}><FontAwesomeIcon icon={solid('plus')} style={styles.addIcon}/> Добавить</Button>);
};
export default AddButton;
