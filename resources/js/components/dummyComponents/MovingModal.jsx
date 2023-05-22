import styles from "../../css/customModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
let oldComponent;
const MovingModal = ({ children, show = true, setShow, movingSpeed = 350, onClose, customStyles, fixedStyles, header, firstComponent }) => {
    const [isFirstRender, setIsFirstRender] = useState(false);
    const animationDuration = `0.${movingSpeed}s`;
    const [completedFixedStyles, setFixedStyles] = useState(Object.assign(Object.assign({}, fixedStyles), { animationDuration, animationFillMode: 'forwards' }));
    const getMoving = async () => {
        setIsFirstRender(true);
        setFixedStyles(Object.assign(Object.assign({}, completedFixedStyles), { animationName: 'slideOut' }));
        setTimeout(() => {
            setIsFirstRender(false);
            setFixedStyles(Object.assign(Object.assign({}, completedFixedStyles), { animationName: 'slideIn' }));
            oldComponent = children;
        }, movingSpeed - 70);
    };
    const closeHandler = () => {
        if (onClose) {
            onClose();
        }
        setShow(false);
    };
    const stopClosing = (ev) => {
        ev.stopPropagation();
    };
    // @ts-expect-error TS(2345): Argument of type '() => Promise<void>' is not assi... Remove this comment to see the full error message
    useEffect(getMoving, [children]);
    useEffect(() => oldComponent = firstComponent, []);
    return (<>
            {show && <div className={styles.back} onMouseDown={closeHandler}>
                <div className={styles.fixed} style={completedFixedStyles}>
                    <div className={styles.headerHolder}>{header}</div>
                    <div className={styles.contentBox} style={customStyles} onMouseDown={stopClosing}>
                        <div className={styles.closingButton} onClick={closeHandler}>
                            <FontAwesomeIcon icon={solid("xmark")} className={styles.xmark}/>
                        </div>
                        {isFirstRender ? oldComponent : children}
                    </div>
                </div>
            </div>}
        </>);
};
export default MovingModal;
