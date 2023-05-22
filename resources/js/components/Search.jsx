import React, { useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import styles from '../css/search.module.css'
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';

const SearchStyle = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.55),
    
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.8),
    },
    marginLeft: 0,
    width: '400px',
    transition: 'background-color 0.15s linear',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: '400px',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      // padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '350px',
      },
    },
  }));

const Search = () => {
  const navigate = useNavigate();
  const inputSearch = useRef();
  const onSubmit = (ev) =>  {
    ev.preventDefault();
    navigate('list', {state: inputSearch.current.value})
  };

    return (
        <div className={styles.searchWrapper}>
          <form onSubmit={onSubmit}>
        <SearchStyle>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase inputRef={inputSearch}
            placeholder="Поиск договора"
            inputProps={{ 'aria-label': 'search' }}
          />
          {/* <button onClick={ws.sendMessage}>send</button> */}
   </SearchStyle>
   </form>
   </div>
    );
};

export default Search;