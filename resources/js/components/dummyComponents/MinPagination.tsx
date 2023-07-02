import { TablePagination } from '@mui/material';
import { useState } from 'react';
import styles from '../../css/pagination.module.css'
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    main: {
        border: 'none',
    }
})

const MinPagination = ({total, pageUpdater, limit = 10 }) => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const pageChanger = (ev, page)=> {
        setPage(page);
        pageUpdater(page+1);
    }
    function defaultLabelDisplayedRows({ from, to, count }) {
        return `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`} записей`;
    }
    return (
        <table className={styles.main}>
            <tbody>
                <tr>
                <TablePagination count={total} style={{paddingLeft: 0}} labelDisplayedRows={defaultLabelDisplayedRows} rowsPerPage={limit} className={classes.main} onPageChange={pageChanger} rowsPerPageOptions={[limit]} page={page} />
                </tr>
            </tbody>
        </table>
    );
  };

export default MinPagination;