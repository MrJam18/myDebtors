import React from 'react';
import {saveFile} from "../http";

const Test = ({}) => {
    const onClick = ()=> {
        saveFile('/test', 'test.docx');
    }

    return (
        <div>
            <div>1234</div>
            <div tabIndex={2}>1234</div>
            <div tabIndex={3}>1234</div>
            <button onClick={onClick}>download</button>
        </div>
    );
};

export default Test;