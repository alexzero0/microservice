import asyncio
import json

from pkg.rabbitmq.broker import rpc, connect_to_broker, MessagePattern

@MessagePattern(cmd="rpc_test_queue")
async def rpc_accept_message(**message):
    print('rpc_accept_message')
    print(message['test'])
    return { "result": 15 * message['test'] }

async def main(loop):
    print('main')
    channel = await connect_to_broker()
    rpc.channel = channel
    print(rpc.queue_names)
    await rpc.start_listing()
    print('----->  alelllua  <-----')


# it is file for test rabbitmq
if __name__ == "__main__":
    print('start listener')
    loop = asyncio.get_event_loop()
    loop.create_task(main(loop))
    loop.run_forever()