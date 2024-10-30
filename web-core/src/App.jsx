import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Register/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PAGE_URL } from './utils/consts/PageURLConsts';
import HomePage from './pages/Home/HomePage';
import { createContext, useEffect, useState } from 'react';
import ErrorPage from './pages/Error/ErrorPage';
import { ACCESS_TOKEN, REFRESH_TOKEN, ROLE_NAME } from './utils/consts/HttpRequestConsts';
import ProductInventoryCenterOwnerPage from './pages/CenterOwnerRole/ProductInventory/ProductInventoryPage';
import CourtCenterOwnerPage from './pages/CenterOwnerRole/Court/CourtPage';
import CenterCenterOnwerPage from './pages/CenterOwnerRole/Center/CenterPage';
import ProductCenterOwnerPage from './pages/CenterOwnerRole/ProductPage/ProductPage';
import EmployeeManagementPage from './pages/CenterOwnerRole/EmployeeManagement/EmployeeManagementPage';
import UserCenterPage from './pages/UserRole/Center/UserCenterPage';

export const LoginContext = createContext(null);
export const TokenContext = createContext(null);

export default function App() {
    const [loginState, setLoginState] = useState(() => {
        if (localStorage.getItem(ACCESS_TOKEN) !== null && localStorage.getItem(ROLE_NAME) !== null) {
            return {
                isLogin: true,
                userRole: localStorage.getItem(ROLE_NAME),
            };
        } else {
            return {
                isLogin: false,
                userRole: '',
            };
        }
    });

    const [tokenState, setTokenState] = useState(() => {
        if (localStorage.getItem(ACCESS_TOKEN) !== null && localStorage.getItem(ROLE_NAME) !== null) {
            return {
                accessToken: localStorage.getItem(ACCESS_TOKEN),
                refreshToken: localStorage.getItem(REFRESH_TOKEN),
            };
        } else {
            return {
                accessToken: '',
                refreshToken: '',
            };
        }
    });

    useEffect(() => {
        if (localStorage.getItem(ACCESS_TOKEN) !== null && localStorage.getItem(ROLE_NAME) !== null) {
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
        if (localStorage.getItem(ACCESS_TOKEN) !== null && localStorage.getItem(ROLE_NAME) !== null) {
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
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE} element={<CenterCenterOnwerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.CENTER_PAGE + '/:centerId' + PAGE_URL.CENTER_OWNER.COURT_PAGE} element={<CourtCenterOwnerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_PAGE} element={<ProductCenterOwnerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.PRODUCT_INVENTORY_PAGE} element={<ProductInventoryCenterOwnerPage />} />
                <Route path={PAGE_URL.CENTER_OWNER.BASE + PAGE_URL.CENTER_OWNER.EMPLOYEE_MANAGEMENT_PAGE} element={<EmployeeManagementPage />} />

                <Route path={PAGE_URL.USER.BASE + PAGE_URL.USER.CENTER_PAGE} element={<UserCenterPage />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
        </TokenContext.Provider>
        </LoginContext.Provider>
    );
}