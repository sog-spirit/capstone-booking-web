import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PAGE_URL } from './utils/consts/PageURLConsts';
import HomePage from './pages/Home/HomePage';
import { createContext, useEffect, useState } from 'react';
import CenterManagement from './pages/Center Management/CenterManagement';
import ErrorPage from './pages/Error/ErrorPage';
import { ACCESS_TOKEN, REFRESH_TOKEN, ROLE_NAME } from './utils/consts/HttpRequestConsts';
import CenterDetail from './pages/Center Management/Center Detail/CenterDetail';

export const LoginContext = createContext(null);
export const TokenContext = createContext(null);

export default function App() {
    const [loginState, setLoginState] = useState({
        isLogin: false,
        userRole: '',
    });
    const [tokenState, setTokenState] = useState({
        accessToken: localStorage.getItem(ACCESS_TOKEN),
        refreshToken: localStorage.getItem(REFRESH_TOKEN),
    });

    useEffect(() => {
        if (localStorage.getItem(ACCESS_TOKEN) !== "" && localStorage.getItem(ROLE_NAME) !== "") {
            setLoginState({
                isLogin: true,
                userRole: localStorage.getItem(ROLE_NAME),
            });
        } else {
            setLoginState({
                isLogin: false,
                userRole: '',
            });
        }
    }, [loginState.isLogin, loginState.userRole]);

    useEffect(() => {
        if (localStorage.getItem(ACCESS_TOKEN) !== "" && localStorage.getItem(ROLE_NAME) !== "") {
            setTokenState({
                accessToken: localStorage.getItem(ACCESS_TOKEN),
                refreshToken: localStorage.getItem(REFRESH_TOKEN),
            });
        } else {
            setTokenState({
                accessToken: '',
                refreshToken: '',
            });
        }
    }, [tokenState.accessToken, tokenState.refreshToken]);

    return (
        <LoginContext.Provider value={{loginState, setLoginState}}>
        <TokenContext.Provider value={{tokenState, setTokenState}}>
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<ErrorPage />} />
                <Route path={PAGE_URL.HOME} element={<HomePage />} />
                <Route path={PAGE_URL.REGISTER} element={<RegisterPage />} />
                <Route path={PAGE_URL.LOGIN} element={<LoginPage />} />
                <Route path={PAGE_URL.CENTER_MANAGEMENT} element={<CenterManagement />} />
                <Route path={PAGE_URL.CENTER_MANAGEMENT + '/:centerId' + PAGE_URL.CENTER_DETAIL} element={<CenterDetail />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
        </TokenContext.Provider>
        </LoginContext.Provider>
    );
}