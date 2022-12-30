import uvicorn
import json
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from aio_pika import connect, Message
#  docker run -d --hostname myrabbit -p 5672:5672 -p 15672:15672 --name some-rabbit -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:3-management

class Task(BaseModel):
    taskid: str
    description: str
    params: Dict[str, str] = {}

app = FastAPI()

@app.post("/task", response_model=Task)
async def create_task(task: Task):
    await send_rabbitmq(task)
    return task

@app.get("/hello")
async def hello():
    return "Hello Word"

async def send_rabbitmq(msg = {}):
    print('send msg', msg)
    connection = await connect("amqp://guest:guest@localhost/")

    channel = await connection.channel()

    await channel.default_exchange.publish(
        Message(json.dumps(msg.dict()).encode("utf-8")),
        routing_key = "rabbitmq_task"
    )

    await connection.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)