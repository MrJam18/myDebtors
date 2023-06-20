import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import styles from '../../css/customModal.module.css';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import {addModalQuantity, subtractModalQuantity} from "../../store/global/index";

const defaultHeaderStyles = {maxWidth: '400px', display: 'none'}

type Props = {
    children: React.ReactNode
    show?: boolean,
    setShow: (show: boolean)=> void,
    onClose?: ()=> void,
    customStyles?: React.CSSProperties,
    fixedStyles?: React.CSSProperties,
    header?: string,
    customClassName?: string
}

const CustomModal = ({children, show = true, setShow, onClose = null, customStyles = null, fixedStyles = null, header = null, customClassName = null}: Props) => {
    const [headerStyles, setHeaderStyles] = useState<React.CSSProperties>(defaultHeaderStyles);
    const dispatch = useDispatch();
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
            // @ts-ignore
            setHeaderStyles({...headerStyles, maxWidth: customStyles.width});
        }
    }, [customStyles])
    useEffect(()=> {
        if(header) {
            setHeaderStyles({
                ...headerStyles,
                display: 'block'
            });
        }
            else setHeaderStyles({
                ...headerStyles,
                display: 'none'
            });
        }
    , [header]);
    useEffect(() => {
        dispatch(addModalQuantity());
        return ()=> {
            dispatch(subtractModalQuantity());
        }
    }, []);
    return (
        <>
        {show && <div className={styles.back} onKeyDown={onKeyDown} onMouseDown={closeHandler}>
            <div className={styles.fixed} style={fixedStyles}>
                <div className={styles.headerHolder} style={headerStyles}>{header}</div>
            <div className={styles.contentBox + (customClassName ? " " + customClassName : '')} style={customStyles} onMouseDown={stopClosing}>
                <>
                <div className={styles.closingButton} onClick= {closeHandler}>
                <FontAwesomeIcon icon={solid("xmark")} className={styles.xmark}/>
                </div>
                {children}
                </>
            </div>
            </div>
        </div>}
        </>
    );
};

export default CustomModal;