export const debounce = async (func, delay) => {
    let timeoutId;
    return async (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            await func(...args);
        }, delay);
    };
};
