const router = require('express').Router();
const errors = require('../../helpers/errors');
const { validate, body } = require('../../helpers/validator');
const amqp = require("amqplib");

const send_rabbitmq = async (task) => {
    console.log('send msg', task);

    const connection = await amqp.connect('amqp://guest:guest@localhost/');
    const channel = await connection.createChannel();
    await channel.assertQueue("rabbitmq_task", durable = false);

    await channel.sendToQueue("rabbitmq_task", Buffer.from(JSON.stringify(task)));
    await channel.close();
    await connection.close();
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
        await send_rabbitmq(msg);

        res.send(msg);
    })
);

module.exports = router;
