import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import Header from './components/Header';
import LoginPage from './pages/Login/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PAGE_URL } from './utils/consts/PageURLConsts';
import HomePage from './pages/Home/HomePage';
import { createContext, useState } from 'react';

export const LoginContext = createContext(null);

export default function App() {
    const [loginState, setLoginState] = useState({
        accessToken: '',
    });

    return (
        <LoginContext.Provider value={{loginState, setLoginState}}>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path={PAGE_URL.HOME} element={<HomePage />} />
                <Route path={PAGE_URL.REGISTER} element={<RegisterPage />} />
                <Route path={PAGE_URL.LOGIN} element={<LoginPage />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
        </LoginContext.Provider>
    );
}