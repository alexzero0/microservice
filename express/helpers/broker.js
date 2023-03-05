const { v4: uuidv4 } = require('uuid');

const amqp = require('amqplib');

const RMQ_LOGIN = process.env.EXPRESS_RMQ_LOGIN;
const RMQ_PASSWORD = process.env.EXPRESS_RMQ_PASSWORD;
const RMQ_HOST = process.env.EXPRESS_RMQ_HOST;
const RMQ_PORT = process.env.EXPRESS_RMQ_PORT;

class BaseRMQ {
    // constructor(channel) {
    //   this.channel = channel;
    // }
    connection = null;
    channel = null;

    async init() {
        // move to BaseRMQ
        console.log('--- start init ---');
        let retries = 0
        while (!this.connection) {
            try {
                const conn_str = `amqp://${RMQ_LOGIN}:${RMQ_PASSWORD}@${RMQ_HOST}:${RMQ_PORT}/`;
                console.log('conn_str', conn_str);
                this.connection = await amqp.connect(conn_str);
            } catch {
                retries += 1;
                console.log(`Can't connect to broker ${retries}. Will retry in 5 seconds...`);
                await this.sleep(5000)
            }
        }
        // this.connection = await amqp.connect(conn_str);
        if (!this.channel) this.channel = await this.connection.createChannel();
        // this.channel = await this.connection.createChannel();
        return this.channel;
    }

    static serialize(data) {
        const result = Buffer.from(JSON.stringify(data));
        return result;
    }

    static deserialize(data) {
        if (this.isJson(data)) {
            const result = JSON.parse(data);
            return result;
        }
        return data;
    }

    static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    sleep = ms => new Promise(r => setTimeout(r, ms));
}

class RPC extends BaseRMQ {
    futures = new Map();
    queueNames = {};

    async cancelConsumer(queue, consumerTag) {
        await this.channel.cancel(consumerTag);
    }

    async onResponse(message) {
        const future = this.futures.get(message.properties.correlationId);
        future.resolve(BaseRMQ.deserialize(message.content));
        this.channel.ack(message);
    }

    async call(queueName, payload) {
        const correlationId = uuidv4();
        const callbackQueue = await this.channel.assertQueue('', { exclusive: true, autoDelete: true, durable: true });

        const { consumerTag } = await this.channel.consume(callbackQueue.queue, async (msg) => {
            await this.onResponse.bind(this, msg)();
        });

        const future = new Promise((resolve, reject) => {
            this.futures.set(correlationId, { resolve, reject });
        });

        this.channel.publish('', queueName, BaseRMQ.serialize(payload), {
            contentEncoding: 'utf-8',
            contentType: 'application/json',
            correlationId,
            replyTo: callbackQueue.queue,
        });

        const response = await future;

        await this.cancelConsumer(callbackQueue, consumerTag);

        return BaseRMQ.deserialize(response);
    }

    async consumeQueue(func, queueName) {
        //not verified code
        const { queue } = await this.channel.assertQueue(queueName);

        await this.channel.consume(queue, (message) =>
            this.onCallMessage(message, this.channel.assertExchange('amq.direct', 'direct'), func)
        );
    }

    async onCallMessage(message, exchange, func) {
        //not verified code
        const payload = BaseRMQ.deserialize(message.content);

        try {
            const result = await func(payload);
            const serializedResult = BaseRMQ.serialize(result);

            await exchange.publish('amq.direct', message.properties.replyTo, Buffer.from(serializedResult), {
                correlationId: message.properties.correlationId,
                contentEncoding: 'utf-8',
                contentType: 'application/json',
            });
        } catch (err) {
            const serializedResult = BaseRMQ.serialize({ error: 'error', reason: err.toString() });

            await exchange.publish('amq.direct', message.properties.replyTo, Buffer.from(serializedResult), {
                correlationId: message.properties.correlationId,
                contentEncoding: 'utf-8',
                contentType: 'application/json',
            });
        }

        await message.ack();
    }
}

const rpc = new RPC();
// rpc.init().then(console.log).catch(console.log)
module.exports = { rpc };
