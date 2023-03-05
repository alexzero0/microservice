const router = require('express').Router();
const errors = require('../../helpers/errors');

router.get(
    '/healcheck',
    errors.wrap(async (req, res) => {

        res.send({
            status: 200,
            message: 'server working',
            server: 'express'
        });
    })
);

module.exports = router;
