import { TablePagination } from '@mui/material';
import styles from '../../../css/pagination.module.css';
import { makeStyles } from '@mui/styles';
import React from "react";
const useStyles = makeStyles({
    main: {
        border: 'none',
    }
});
const ContractCommentPagination = ({ total, page, perPage, setPage, setPerPage }) => {
    const classes = useStyles();
    const onPageChange = (ev, page) => {
        setPage(page + 1);
    };
    const onRowsPerPageChange = (ev) => {
        setPerPage(ev.target.value);
    };
    function defaultLabelDisplayedRows({ from, to, count }) {
        return `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`} записей`;
    }
    return (<div className={styles.main}>
            {/*@ts-ignore*/}
            <TablePagination count={total} style={{ paddingLeft: 0 }} shape="rounded" rowsPerPage={perPage} className={classes.main} onPageChange={onPageChange} labelRowsPerPage='записей на странице:' labelDisplayedRows={defaultLabelDisplayedRows} rowsPerPageOptions={[10, 25, 50]} page={page - 1} onRowsPerPageChange={onRowsPerPageChange}/>
        </div>);
};
export default ContractCommentPagination;
