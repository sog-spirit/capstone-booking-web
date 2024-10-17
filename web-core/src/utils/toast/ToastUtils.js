import { toast, Zoom } from "react-toastify";

const displayTime = 3000;

export function defaultInfoToastNotification(message) {
    toast.info(message, {
        position: 'top-right',
        autoClose: displayTime,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Zoom,
    });
}

export function defaultErrorToastNotification(message) {
    toast.error(message, {
        position: 'top-right',
        autoClose: displayTime,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Zoom,
    });
}

export function defaultSuccessToastNotification(message) {
    toast.success(message, {
        position: 'top-right',
        autoClose: displayTime,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Zoom,
    });
}