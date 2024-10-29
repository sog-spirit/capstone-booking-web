export const API_URL = {
    BASE: 'http://localhost:8080',
    USER: {
        BASE: '/user',
        REGISTER: '/register',
        LOGIN: '/login',
    },
    JWT: {
        BASE: '/jwt',
        REFRESH: '/refresh',
        LOG_OUT: '/logout',
        BLACKLIST_VERIFY: '/blacklist-verify',
        VERIFY: '/verify',
    },
    ROLE: {
        BASE: '/role',
        REGISTER_ROLE_LIST: '/register-list',
    },
    USER_ROLE: {
        BASE: '/user-role',
    },
    CENTER: {
        BASE: '/center',
        LIST: '/list',
    },
    COURT: {
        BASE: '/court',
    },
    PRODUCT: {
        BASE: '/product',
        LIST: '/list',
    },
    PRODUCT_INVENTORY: {
        BASE: '/product-inventory',
        LIST: '/list',
    },
    IMAGE: {
        BASE: '/image',
        PRODUCT: '/product',
    },
    EMPLOYEE_LIST: {
        BASE: '/employee-list',
    },
};