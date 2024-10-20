export const DEFAULT_PAGE_SIZE = 5;

export function paginate(currentPageNumber = 1, totalPageNumber = 1, siblingItemCount = 2) {
    const pageNumberList = [];
    const siblingCount = siblingItemCount;

    if (1 < currentPageNumber - siblingCount) {
        pageNumberList.push(1);
        if (siblingCount + 3 < currentPageNumber) {
            pageNumberList.push('...');
        } else if (siblingCount + 2 < currentPageNumber) {
            pageNumberList.push(2);
        }
    }

    for (let i = (0 < (currentPageNumber - siblingCount) ? currentPageNumber - siblingCount : 1); i < currentPageNumber; i++) {
        pageNumberList.push(i);
    }

    for (let i = currentPageNumber; i <= ((totalPageNumber >= currentPageNumber + siblingCount) ? (currentPageNumber + siblingCount) : totalPageNumber); i++) {
        pageNumberList.push(i);
    }

    if (totalPageNumber > currentPageNumber + siblingCount) {
        if (totalPageNumber - siblingCount - 2 > currentPageNumber) {
            pageNumberList.push('...')
        } else if (totalPageNumber - siblingCount - 1 > currentPageNumber) {
            pageNumberList.push(totalPageNumber - 1);
        }
        pageNumberList.push(totalPageNumber);
    }

    return pageNumberList;
}

export function previousPage(currentPageNumberState, setCurrentPageNumberState) {
    if (currentPageNumberState > 1) {
        setCurrentPageNumberState(prevState => prevState - 1);
    }
}

export function nextPage(currentPageNumberState, setCurrentPageNumberState, totalPageState) {
    if (currentPageNumberState < totalPageState) {
        setCurrentPageNumberState(prevState => prevState + 1);
    }
}