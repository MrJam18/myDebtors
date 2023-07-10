import React from 'react';
// @ts-expect-error TS(2307): Cannot find module '../../css/start.module.css' or... Remove this comment to see the full error message
import styles from '../../css/start.module.css';
import LastActions from './LastActions';
import Limits from './Limits';
const perPage = 15;
const Start = () => {
    return (
        <div className={styles.main}>
                <LastActions perPage={perPage} />
                <Limits perPage={perPage}  />
        </div>);
};
export default Start;
//# sourceMappingURL=Start.jsx.map
