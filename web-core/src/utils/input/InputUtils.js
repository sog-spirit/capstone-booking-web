import { SORT_DIRECTION } from "../consts/SortDirection";

export function handleInputChange(event, setState) {
    let { name, value } = event.target;
    setState( prevFormData => ({
        ...prevFormData,
        [name]: value,
    }));
}

export function handleInputCheckboxChange(event, setState) {
    let { name, checked } = event.target;
    setState( prevFormData => ({
        ...prevFormData,
        [name]: checked,
    }));
}

export function handleClickOutsideElement(elementRef, setElementState) {
    function handler(event) {
        if (!elementRef?.current?.contains(event.target)) {
            setElementState(false);
        }
    }

    document.addEventListener("mousedown", handler);

    return () => {
        document.removeEventListener("mousedown", handler);
    }
}

export function onChangeSortOrder(name, setState) {
    setState(prevState => {
        if (prevState[name] == null) {
            return {
                ...prevState,
                [name]: SORT_DIRECTION.ASC,
            };
        } else if (prevState[name] === SORT_DIRECTION.ASC) {
            return {
                ...prevState,
                [name]: SORT_DIRECTION.DESC,
            };
        } else {
            return {
                ...prevState,
                [name]: null,
            };
        }
    });
}