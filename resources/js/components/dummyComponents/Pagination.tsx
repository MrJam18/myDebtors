import { TablePagination } from '@mui/material';
import styles from '../../css/pagination.module.css'
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    main: {
        border: 'none',
    }
})
type Props = {
    total: number,
    page: number,
    perPage: number,
    setPage: (page: number)=> void,
    setPerPage: (perPage: number) => void
}

const Pagination = ({total, page, perPage, setPage, setPerPage }: Props) => {
    const classes = useStyles();
    const onPageChange = (ev, page) => {
        setPage(page + 1);
    }
    const onRowsPerPageChange = (ev) => {
        setPerPage(ev.target.value);
    }
    function defaultLabelDisplayedRows({ from, to, count }) {
        return `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`} записей`;
    }
    return (
        <div className={styles.main}>
            {/*@ts-ignore*/}
        <TablePagination count={total} style={{paddingLeft: 0}} shape="rounded" rowsPerPage={perPage} className={classes.main} onPageChange={onPageChange} labelRowsPerPage='записей на странице:' labelDisplayedRows={defaultLabelDisplayedRows} rowsPerPageOptions={[10, 25, 50]} page={page - 1} onRowsPerPageChange={onRowsPerPageChange}/>
        </div>
    );
  };

export default Pagination;