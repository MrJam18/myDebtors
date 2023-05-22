import React, { useEffect, useRef } from 'react';
import styles from '../../css/loading.module.css';
const Loading = ({ addStyles, size, bold = true }) => {
    const parentRef = useRef();
    useEffect(() => {
        if (size || bold) {
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            const children = parentRef.current.children;
            for (let i = 0; i < children.length; i++) {
                children[i].style.width = size + 'px';
                children[i].style.height = size + 'px';
                children[i].style.margin = size / 6 + 'px';
                if (bold)
                    children[i].style.border = bold + 'px solid';
                children[i].style.borderColor = '#1976d2 transparent transparent transparent';
            }
        }
    }, [size, bold]);
    return (<div className={styles.ldsRing} ref={parentRef} style={addStyles}><div></div><div></div><div></div><div></div></div>);
};
export default Loading;
