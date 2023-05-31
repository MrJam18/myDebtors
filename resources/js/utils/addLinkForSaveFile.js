import { serverInsideDocumentsAddress } from './serverApi';
// @ts-expect-error TS(2307): Cannot find module '../img/doc.png' or its corresp... Remove this comment to see the full error message
import downloadIcon from '../img/doc.png';
// @ts-expect-error TS(2307): Cannot find module '../css/start.module.css' or it... Remove this comment to see the full error message
import styles from '../css/start.module.css';
const regExp = new RegExp(`^${serverInsideDocumentsAddress}`);
export const addLinksForSaveFile = (rows, onClick) => {
    let completeRows = [];
    rows.forEach((el) => {
        let row = Object.assign({}, el);
        // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
        if (regExp.test(el.result))
            row.result = React.createElement("button", { onClick: onClick, "data-id": el.id, "data-object": el.actionObject.name, "data-path": el.result, className: 'antibutton' + ' ' + styles.actions__downloadButton },
                "// @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message",
                React.createElement("img", { src: downloadIcon, className: styles.downloadIcon, alt: "download" }));
        completeRows.push(row);
    });
    return completeRows;
};
//# sourceMappingURL=addLinkForSaveFile.js.map