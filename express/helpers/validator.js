const { body, param, query, validationResult, checkSchema, check, oneOf } = require('express-validator');
const err = require('./errors');
const validate = (validations) => {
    return err.wrap(async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();
        const errMessages = errors.array().map((e) => `${e.msg} ${e.param} in ${e.location} - ${e.value}`);
        throw new err.UnprocessableEntity(errMessages.join());
    });
};

module.exports = {
    validate,
    body,
    param,
    query,
    checkSchema,
    check,
    oneOf,
};
