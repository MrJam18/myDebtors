import React, { useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import styles from '../css/search.module.css'
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';
import axios from "axios";
import { daDataApi } from '../http/daDataApi';

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
  const onSubmit = (ev) => {
    const stringAnswer = axios.post('/api/search', { searchString: inputSearch.current.value }).then(data => {
      let data = {
        creditor: data.data.creditor,
        contract: data.data.contract
      };
      // navigate('list', { state: data })
    }).catch(err => console.log(err));
    // ev.preventDefault();
  };

  return (
    <div className={styles.searchWrapper}>
      <form onChange={onSubmit}>
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