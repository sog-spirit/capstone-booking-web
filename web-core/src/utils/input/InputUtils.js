export function handleInputChange(event, setState) {
    let { name, value } = event.target;
    setState( prevFormData => ({
        ...prevFormData,
        [name]: value,
    }));
}