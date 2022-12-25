const wrap = (fn) => (...args) => fn(...args).catch(args[args.length - 1]);

const handleError = (err, req, res, next) => {    
    let { status, message } = err;
    if (err.original?.detail) message += ` : ${err.original.detail}`
    console.error('Error: ', message);
    res.status(status || 500).json({ message });
    next();
};

const errorTypes = {
    InvalidInput: 400,
    UnauthorizedError: 401,
    NotFound: 404,
    NotAllowed: 403,
    UnprocessableEntity: 422,
    InternalServer: 500,
}

for (const errorName in errorTypes) {
    function errFunction(message) {
        if (!(this instanceof errFunction)) {
            return new errFunction(message);
        }

        this.name = errorName;
        this.message = message;
        this.status = errorTypes[errorName];
    };

    errFunction.prototype = Object.create(Error.prototype)
    errFunction.prototype.constructor = errFunction;
    module.exports[errorName] = errFunction;
}


module.exports = {
    ...module.exports,
    wrap,
    handleError,
}
