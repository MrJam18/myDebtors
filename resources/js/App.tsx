import { StrictMode } from 'react';
import {ErrorsCatcher} from "./components/ErrorsCatcher";
import { setupStore } from './store';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';
import './index.css';
import Router from './components/Router';

export const store = setupStore();

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <Provider store ={store}>
            <StyledEngineProvider injectFirst>
                <ErrorsCatcher>
                    <Router />
                </ErrorsCatcher>
            </StyledEngineProvider>
        </Provider>
    </StrictMode>,
);

export const dispatch = store.dispatch;
export const getState = store.getState;