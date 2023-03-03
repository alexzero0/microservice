const router = require('express').Router();
const errors = require('../../helpers/errors');

router.get(
    '/hello',
    errors.wrap(async (req, res) => {
        const response = 'hello world!';

        res.send({ response });
    })
);

module.exports = router;
