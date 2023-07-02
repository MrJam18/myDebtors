import styles from '../../../css/dataShow.module.css';

export type DataProps = {
    header: string,
    data: string,
    className?: string
}

const FullWidthData = ({header, data, className = null}: DataProps) => {
    return (
        <div className={className}>
            <h4 className={styles.fullWidthHeader}>{header}</h4>
            <div className={styles.fullWidthText}>{data}</div>
        </div>
        );
}

export default FullWidthData