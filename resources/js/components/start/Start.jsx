import React from 'react';
// @ts-expect-error TS(2307): Cannot find module '../../css/start.module.css' or... Remove this comment to see the full error message
import styles from '../../css/start.module.css';
import LastActions from './LastActions';
import Limits from './Limits';
import Tasks from './Tasks';
import Refferences from './Referrences';

const Start = () => {
    return (<div className={styles.main}>
            <Tasks />
            <Limits />
            <LastActions />
            <Refferences />
        </div>);
};
export default Start;
//# sourceMappingURL=Start.jsx.map