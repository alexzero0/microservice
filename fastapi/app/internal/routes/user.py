from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pkg.rabbitmq.broker import rpc

class Healcheck(BaseModel):
    status: int
    message: str

router = APIRouter(
    prefix='/api/v1',
    tags=['Healcheck']
)

@router.get('/healcheck', response_model=Healcheck)
async def healcheck():

    return JSONResponse({
        'status': 200,
        'message': 'server working'
    })

@router.get('/send-rpc')
async def send_request():


    routing_key = "rpc_test_queue"  # Название очереди которую слушает сервис B
    # Публикация сообщения.
    response = await rpc.call(routing_key, data=10)
    return JSONResponse({
        'status': 200,
        'message': 'server working',
        'test': response
    })