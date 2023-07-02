import styles from '../../../css/dataShow.module.css';
const SmallData = ({ header, data }) => {
    return (<div className={styles.smallBlock}>
            <h5 className={styles.smallHeader}>{header}</h5>
            <div className={styles.smallText}>{data}</div>
        </div>);
};
export default SmallData;
