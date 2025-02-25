const info = (...params: Array<unknown>) => {
    console.log(...params);
};

const error = (...params: Array<unknown>) => {
    console.error(...params);
};

export default { info, error };