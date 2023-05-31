import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import styles from '../../css/customModal.module.css';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const defaultHeaderStyles = {maxWidth: '400px', display: 'none'}


const CustomModal = ({children, show = true, setShow, onClose = null, customStyles = null, fixedStyles = null, header = null, customClassName = null}) => {
    const [headerStyles, setHeaderStyles] = useState(defaultHeaderStyles);
    const closeHandler = () => {
        if (onClose){
            onClose();
        }
        setShow(false);
    }
    const stopClosing = (ev) => {
        ev.stopPropagation();
    }
    const onKeyDown = (ev) => {
        if(ev.key === 'Escape') {
            closeHandler();
        }
    }
    useEffect(()=> {
        if(customStyles?.width){
            setHeaderStyles({...defaultHeaderStyles, maxWidth: customStyles.width});
        }
    }, [customStyles])

    return (
        <>
        {show && <div className={styles.back} onKeyDown={onKeyDown} onMouseDown={closeHandler}>
            <div className={styles.fixed} style={fixedStyles}>
                <div className={styles.headerHolder} style={headerStyles}>{header}</div>
            <div className={styles.contentBox + (customClassName ? " " + customClassName : '') } style={customStyles} onMouseDown={stopClosing}>
            <div className={styles.closingButton} onClick= {closeHandler}>
                <FontAwesomeIcon icon={solid("xmark")} className={styles.xmark}/>
                </div>
                {children}
            </div>
            </div>
        </div>}
        </>
    );
};

export default CustomModal;