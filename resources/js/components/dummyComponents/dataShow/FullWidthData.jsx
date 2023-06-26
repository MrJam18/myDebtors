import styles from '../../../css/dataShow.module.css';
const FullWidthData = ({ header, data, className = null }) => {
    return (<div className={className}>
            <h4 className={styles.fullWidthHeader}>{header}</h4>
            <div className={styles.fullWidthText}>{data}</div>
        </div>);
};
export default FullWidthData;
