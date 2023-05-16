import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// @ts-expect-error TS(2307): Cannot find module '../css/login.module.css' or it... Remove this comment to see the full error message
import styles from '../css/login.module.css';
import { tryLogin } from '../store/users/actions';
import { formDataConverter } from '../utils/formDataConverter';
const useStyles = makeStyles({
    input: {
        marginBottom: '10px',
        width: '75%'
    },
    button: {
        marginTop: '10px',
        width: '50%',
        marginBottom: '10px',
    }
});
const Login = () => {
    const classes = useStyles();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const onSubmit = async (ev) => {
        setLoading(true);
        // @ts-expect-error TS(2345): Argument of type 'boolean' is not assignable to pa... Remove this comment to see the full error message
        setError(false);
        ev.preventDefault();
        const formData = ev.currentTarget.elements;
        const data = formDataConverter(formData);
        try {
            // @ts-expect-error TS(2345): Argument of type '(dispatch: any) => Promise<void>... Remove this comment to see the full error message
            await dispatch(tryLogin({ email: data.email, password: data.password }));
        }
        catch (e) {
            setError(e.message);
            console.dir(e.response);
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className='background firstWindow'>
            <div className="header">Войдите для использования приложения.</div>
            <form onSubmit={onSubmit}>
            <div className={'contentBox' + ' ' + styles.main}>
                <div className={styles.header}>Введите email и пароль.</div>
                <TextField label='Email' name='email' fullWidth size='small' type='email' required className={classes.input}/>
                <TextField label='Пароль' type='password' name='password' fullWidth size='small' required className={classes.input}/>
                <LoadingButton loading={loading} className={classes.button} variant='contained' type='submit'>Войти
                </LoadingButton>
                <Link to='regRequest' className={styles.regLink + ' ' + 'antiLink'}>Подать заявку на регистрацию.</Link>
                {error && <div className="error">{error}</div>}
            </div>
            </form>
        </div>);
};
export default Login;
//# sourceMappingURL=Login.jsx.map