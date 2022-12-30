import asyncio
from aio_pika import connect, IncomingMessage
import json

async def on_message(message: IncomingMessage):
    txt = message.body.decode("utf-8")
    print(json.loads(txt))


async def main(loop):
    connection = await connect("amqp://guest:guest@localhost/", loop = loop)

    channel = await connection.channel()

    queue = await channel.declare_queue("rabbitmq_task", durable=True)

    await queue.consume(on_message, no_ack = True)

# it is file for test rabbitmq
if __name__ == "__main__":
    print('start listener')
    loop = asyncio.get_event_loop()
    loop.create_task(main(loop))
    loop.run_forever()