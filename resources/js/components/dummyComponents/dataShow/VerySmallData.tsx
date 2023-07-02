import {DataProps} from "./FullWidthData";
import styles from '../../../css/dataShow.module.css';

const VerySmallData = ({header, data}: DataProps) => {
    return (
        <div className={styles.verySmallBlock}>
            <h6 className={styles.verySmallHeader}>{header}</h6>
            <div className={styles.verySmallText}>{data}</div>
        </div>
        );
}

export default VerySmallData