import { BrowserRouter, Routes, Route, useNavigate, } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import Header from './components/Header';
import LoginPage from './pages/Login/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PAGE_URL } from './utils/consts/PageURLConsts';
import HomePage from './pages/Home/HomePage';
import { createContext, useEffect, useState } from 'react';
import CenterManagement from './pages/Center Management/CenterManagement';
import ErrorPage from './pages/Error/ErrorPage';
import { BASE_API_URL, JWT_URL } from './utils/consts/APIConsts';
import { HTTP_REQUEST_HEADER, HTTP_REQUEST_METHOD, REFRESH_TOKEN } from './utils/consts/HttpRequestConsts';
import { HTTP_STATUS } from './utils/consts/HttpStatusCode';

export const LoginContext = createContext(null);

export default function App() {
    const [loginState, setLoginState] = useState({
        accessToken: '',
    });

    return (
        <LoginContext.Provider value={{loginState, setLoginState}}>
        <BrowserRouter>
            <Routes>
                <Route path='*' element={<ErrorPage />} />
                <Route path={PAGE_URL.HOME} element={<HomePage />} />
                <Route path={PAGE_URL.REGISTER} element={<RegisterPage />} />
                <Route path={PAGE_URL.LOGIN} element={<LoginPage />} />
                <Route path={PAGE_URL.CENTER_MANAGEMENT} element={<CenterManagement />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
        </LoginContext.Provider>
    );
}