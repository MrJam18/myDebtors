import { createTheme, Divider, MenuItem, MenuList, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import styles from '../../css/contract.module.css';
import { makeStyles } from '@mui/styles';
import '../../css/contractMenu.css';


const useStyles = makeStyles({
  item: {
      paddingBottom: '12px',
      paddingTop: '12px',
      cursor: 'pointer'
  },
})

const ContractMenu = ({menuValue, setMenuValue}) => {
    const classes = useStyles();
    const handleChangeMenu = (ev, newValue)=> {
      setMenuValue(newValue);
    }
    return (
        <div className={styles.menu}>
            <Tabs value={menuValue} onChange={handleChangeMenu} centered variant='fullWidth'  aria-label="basic tabs example" orientation='vertical'>
                <Tab value='data' label="Договор" ></Tab>
                <hr className={styles.divider} />
                <Tab value='actions'   label="Действия"></Tab>
                <hr className={styles.divider} />
                <Tab  value={'payments'} label="Платежи" ></Tab>
                <hr className={styles.divider} />
                <Tab  value={'files'} label="Файлы" ></Tab>
                <hr className={styles.divider} />
                <Tab value={'documents'} label={'Документы'} ></Tab>
                <hr className={styles.divider} />
                <Tab value={'comments'} label={'Комментарии'} ></Tab>
                <hr className={styles.divider} />
            </Tabs>
        </div>
    );
};

export default ContractMenu;