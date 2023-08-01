import React, {useEffect, useMemo, useState} from 'react';
import ArrowDirection from './ArrowDirection';
const SortButton = ({sortHandler, header, focus, defReverse=false}) => {
    const initReverse  = useMemo(()=> {
        if(focus === header.key) return defReverse;
        else return false
    }, []);
    const [arrow, setArrow] = useState(initReverse);
    const clickHandler = (ev) => {
        setArrow((currentArrow)=> {
            if (focus === header.key) currentArrow = !currentArrow;
            const colKey = ev.currentTarget.getAttribute('datakey');
            let type;
            if(currentArrow) type = 'DESC';
            else type = 'ASC';
            sortHandler([colKey, type]);
            return currentArrow;
        });
    }
    return (
           // @ts-expect-error TS(2322): Type '{ children: Element; className: string; styl... Remove this comment to see the full error message
           <button className='antibutton margin-left_2' style={{color: focus !== header.key ? 'grey' : null, padding: 0, paddingLeft: '2px'}} datakey={header.key} onClick={clickHandler}><ArrowDirection arrow={arrow} /></button>
    );
};

export default SortButton;