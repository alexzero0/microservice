const router = require('express').Router();
const errors = require('../../helpers/errors');
const { validate, body } = require('../../helpers/validator');
const { rpc } = require('../../helpers/broker');

const test = async (...args) => {
    console.log('js test', args);
    return JSON.parse(args[0]);
};

router.post(
    '/task',
    validate([
        body('taskid').exists().isString(),
        body('description').exists().isString(),
        body('params').exists().isObject(),
    ]),
    errors.wrap(async (req, res) => {
        const msg = req.body;

        await rpc.init();
        // send to listener.py
        const t = await rpc.call('rpc_test_queue', { test: 5 });

        res.send({ msg, t });
    })
);

module.exports = router;
