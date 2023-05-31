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
        pageUpdater(limit, page+1);
    }
    return (
        <table className={styles.main}>
            <tbody>
                <tr>
                <TablePagination count={total} style={{paddingLeft: 0}} rowsPerPage={limit} className={classes.main} onPageChange={pageChanger} rowsPerPageOptions={[limit]} page={page} />
                </tr>
            </tbody>
        </table>
    );
  };

export default MinPagination;