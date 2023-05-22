import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
const ArrowDirection = ({ arrow }) => {
    return (<>
            {arrow ? <FontAwesomeIcon icon={solid('angle-up')}/> : <FontAwesomeIcon icon={solid('angle-down')}/>}
        </>);
};
export default ArrowDirection;
