from pkg.rabbitmq.broker import mq, rpc, connect_to_broker

# import requests

async def broker():
    print('--- start broker ---')
    channel = await connect_to_broker()
    mq.channel = rpc.channel = channel

    # await rpc.consume_queue(rpc_accept_message, "rpc_test_queue")
    # await mq.consume_queue(mq_accept_message, "mq_test_queue")

# def get_fake_data() -> dict:
#     """Открытый API-endpoint для получение рандомных данных."""
#     posts = requests.get("https://jsonplaceholder.typicode.com/posts")
#     return posts.json()

# async def mq_accept_message(msg) -> None:
#     """MQ-функция которая слушает очередь test-queue приходит объект IncomingMessage"""
#     print(get_fake_data())
#     # test = 1 / 0
#     # Если не ack-ать message тогда она будет висеть в рабите
#     # и при перезапуске приложения этот message снова попадет в функцию.
#     await msg.ack()


# async def rpc_accept_message(**kwargs):
#     print(**kwargs)
#     return get_fake_data()